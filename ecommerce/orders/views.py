from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from django.shortcuts import get_object_or_404
from django.db.models import Q
from django.db import transaction
from django_filters.rest_framework import DjangoFilterBackend

from .serializers import OrderSerializer, OrderItemSerializer, OrderFieldSerializer, OrderDetailSerializer
from .models import Order, OrderItem
from .permissions import IsOrderOwner

from customers.models import Customer, Cart, CartItem
from payments.models import Payment
from products.models import Product
from vendors.models import Vendor
# Create your views here.
class ListCreateOrder(generics.ListCreateAPIView):
    queryset = Order.objects.all()
    serializer_class = OrderSerializer
    permission_classes = (IsAuthenticated, )
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ["status"]
    
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
        else:
            return Response({"detail": "Invalid payment type."}, status=400)
        
        address = request.data.get("address", customer.address)
        
        with transaction.atomic():            
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
                product_id = item.get("product_id")
                quantity = item.get("quantity")

                if not product_id and not quantity:
                    continue
                
                pd = get_object_or_404(Product, id=product_id)
                price = pd.final_price * quantity
                
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
    permission_classes = (IsOrderOwner, )
    queryset = Order.objects.all()

class CancelOrder(generics.UpdateAPIView):
    queryset = Order.objects.all()
    serializer_class = OrderDetailSerializer
    permission_classes = (IsOrderOwner, )
    
    def patch(self, request, *args, **kwargs):
        order = self.get_object()
        
        if order.status != "PROCESSING":
            return Response(
                {"detail": "Order cannot be canceled because it is not in a pending state."},
                status=400
            )

        with transaction.atomic():
            order.status = "CANCELLED"
            order.save()
            
            OrderItem.objects.filter(order=order).delete()

        serializer = self.get_serializer(order)
        return Response(serializer.data)        

class ListOrderItem(generics.ListAPIView):
    serializer_class = OrderItemSerializer
    permission_classes = (IsAuthenticated, )
    
    def get_queryset(self):
        vendor = get_object_or_404(Vendor, user=self.request.user)
        return OrderItem.objects.filter(Q(product__vendor=vendor))