from rest_framework.generics import CreateAPIView, ListCreateAPIView, DestroyAPIView
from rest_framework.permissions import AllowAny
from rest_framework.response import Response

from django.shortcuts import get_object_or_404

from .models import Customer, Cart, CartItem
from .serializers import CustomerSerializer, CartItemSerializer
from .permissions import IsCustomer, IsCartOwner

# Create your views here.
class CreateCustomer(CreateAPIView):
    permission_classes = (AllowAny, )
    queryset = Customer.objects.all()
    serializer_class = CustomerSerializer
    
class ListCreateCartItem(ListCreateAPIView):
    queryset = CartItem.objects.all()
    serializer_class = CartItemSerializer
    
    def get_permissions(self):
        if self.request.method == "GET":
            self.permission_classes = (IsCartOwner, )
        else:
            self.permission_classes = (IsCustomer, )
        return super(ListCreateCartItem, self).get_permissions()
    
    def get_queryset(self):
        customer = get_object_or_404(Customer, user=self.request.user)
        cart = get_object_or_404(Cart, customer=customer)
        return CartItem.objects.filter(cart=cart)
    
    def post(self, request):
        serializer = CartItemSerializer(data=request.data, context={"request": request})
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data, status=201)
    
class DeleteCartItem(DestroyAPIView):
    queryset = CartItem.objects.all()
    serializer_class = CartItemSerializer
    permission_classes = (IsCartOwner, )