from rest_framework.generics import CreateAPIView, ListCreateAPIView, ListAPIView, DestroyAPIView
from rest_framework.permissions import AllowAny
from rest_framework.response import Response

from django.shortcuts import get_object_or_404

from .models import Customer, Cart, CartItem
from .serializers import CustomerSerializer, CartSerializer, CartItemSerializer
from .permissions import IsCustomer, IsCartOwner

# Create your views here.
class CreateCustomer(CreateAPIView):
    permission_classes = (AllowAny, )
    queryset = Customer.objects.all()
    serializer_class = CustomerSerializer
    
# class ListCreateCart(ListCreateAPIView):
#     queryset = Cart.objects.all()
#     serializer_class = CartSerializer
#     permission_classes = (IsCustomer, )
    
#     def post(self, request):
#         customer = Customer.objects.get(user=request.user)
#         cart = Cart.objects.create(
#             customer = customer,
#             status = "OPEN"
#         )
        
#         serializer = CartSerializer(cart)
        
#         return Response(serializer.data, status=201)
    
class CreateCartItem(CreateAPIView):
    queryset = CartItem.objects.all()
    serializer_class = CartItemSerializer
    permission_classes = (IsCustomer, )
    
    def post(self, request):
        serializer = CartItemSerializer(data=request.data, context={"request": request})
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data, status=201)
    
class ListCartItem(ListAPIView):
    queryset = CartItem.objects.all()
    serializer_class = CartItemSerializer
    permission_classes = (IsCartOwner, )
    
    def get_queryset(self):
        cart = get_object_or_404(Cart, id=self.kwargs["pk"])
        return CartItem.objects.filter(cart=cart)
    
class DeleteCartItem(DestroyAPIView):
    queryset = CartItem.objects.all()
    serializer_class = CartItemSerializer
    permission_classes = (IsCartOwner, )