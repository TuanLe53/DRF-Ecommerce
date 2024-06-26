from rest_framework.generics import CreateAPIView, ListCreateAPIView, DestroyAPIView
from rest_framework.permissions import AllowAny
from rest_framework.response import Response

from django.shortcuts import get_object_or_404

from .models import Customer, Cart, CartItem
from .serializers import CustomerSerializer, CreateCartItemSerializer, GetCartItemSerializer
from .permissions import IsCustomer, IsCartOwner

from products.models import Product

# Create your views here.
class CreateCustomer(CreateAPIView):
    permission_classes = (AllowAny, )
    queryset = Customer.objects.all()
    serializer_class = CustomerSerializer
    
class ListCreateCartItem(ListCreateAPIView):
    queryset = CartItem.objects.all()

    def get_serializer_class(self):
        if self.request.method == "POST":
            return CreateCartItemSerializer
        elif self.request.method == "GET":
            return GetCartItemSerializer
    
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
        
        customer = get_object_or_404(Customer, user=request.user)
        cart = get_object_or_404(Cart, customer=customer)
        product = get_object_or_404(Product, id=request.data.get("product"))
        if CartItem.objects.filter(cart=cart, product=product).exists():
            return Response({"error": "Item already exists in the cart."}, status=409)
        
        serializer = CreateCartItemSerializer(data=request.data, context={"request": request})
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data, status=201)
    
class DeleteCartItem(DestroyAPIView):
    queryset = CartItem.objects.all()
    serializer_class = CreateCartItemSerializer
    permission_classes = (IsCartOwner, )