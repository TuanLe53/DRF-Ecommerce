from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from django.shortcuts import get_object_or_404

from .serializers import OrderSerializer
from .models import Order, OrderItem
from customers.models import Customer
from payments.models import Payment
from products.models import Product
# Create your views here.
class ListCreateOrder(generics.ListCreateAPIView):
    queryset = Order.objects.all()
    serializer_class = OrderSerializer
    permission_classes = (IsAuthenticated, )
    
    def get_queryset(self):
        customer = get_object_or_404(Customer, user=self.request.user)
        return Order.objects.filter(customer=customer)
    
    def post(self, request):
        customer = get_object_or_404(Customer, user=self.request.user)
        
        if request.data["payment_type"] == "CREDIT_CARD":
            payment = get_object_or_404(Payment, id=request.data["payment"])
        
        order = Order.objects.create(
            customer=customer,
            payment=payment,
            payment_type=request.data["payment_type"],
            address=customer.address,
            status="PROCESSING",
            total_price=0
        )
        
        pd_list = request.data["products"]
        
        total_price = 0
        for item in pd_list:
            pd = Product.objects.get(id=item["product_id"])
            price = pd.price * item["quantity"]
            
            order_pd = OrderItem.objects.create(
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
            