from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from django.shortcuts import get_object_or_404
from django.db.models import Q

from .serializers import OrderSerializer, OrderItemSerializer, OrderFieldSerializer, OrderDetailSerializer
from .models import Order, OrderItem

from customers.models import Customer, Cart, CartItem
from payments.models import Payment
from products.models import Product
from vendors.models import Vendor
# Create your views here.
class ListCreateOrder(generics.ListCreateAPIView):
    queryset = Order.objects.all()
    serializer_class = OrderSerializer
    permission_classes = (IsAuthenticated, )
    
    def get_queryset(self):
        customer = get_object_or_404(Customer, user=self.request.user)
        return Order.objects.filter(customer=customer)
    
    def get_serializer_class(self):
        if self.request.method == "POST":
            return OrderSerializer
        elif self.request.method == "GET":
            return OrderFieldSerializer
    
    def post(self, request):
        customer = get_object_or_404(Customer, user=self.request.user)
        cart = get_object_or_404(Cart, customer=customer)
        
        if request.data["payment_type"] == "COD":
            payment = None
        elif request.data["payment_type"] == "CREDIT_CARD":
            payment = get_object_or_404(Payment, id=request.data["payment"])
            
        if request.data["address"]:
            address = request.data["address"]
        else:
            address = customer.address
        
        order = Order.objects.create(
            customer=customer,
            payment=payment,
            payment_type=request.data["payment_type"],
            address=address,
            status="PROCESSING",
            total_price=0
        )
        
        pd_list = request.data["products"]
        
        total_price = 0
        for item in pd_list:
            pd = Product.objects.get(id=item["product_id"])
            price = pd.final_price * item["quantity"]
            
            #Remove product from cart
            CartItem.objects.filter(cart=cart, product=pd).delete()
            
            OrderItem.objects.create(
                product=pd,
                order=order,
                quantity=item["quantity"],
                total_price=price
            )
            total_price += price
            
        order.total_price = total_price
        order.save()
        
        serializer = OrderSerializer(order)
        
        return Response(serializer.data, status=201)

class RetrieveOrder(generics.RetrieveAPIView):
    serializer_class = OrderDetailSerializer
    permission_classes = (IsAuthenticated, )
    queryset = Order.objects.all()

class ListOrderItem(generics.ListAPIView):
    serializer_class = OrderItemSerializer
    permission_classes = (IsAuthenticated, )
    
    def get_queryset(self):
        vendor = get_object_or_404(Vendor, user=self.request.user)
        return OrderItem.objects.filter(Q(product__vendor=vendor))