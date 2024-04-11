from rest_framework.generics import CreateAPIView, ListCreateAPIView
from rest_framework.permissions import AllowAny
from rest_framework.response import Response

from .models import Customer, Cart, CartItem
from .serializers import CustomerSerializer, CartSerializer, CartItemSerializer
from .permissions import IsCustomer

# Create your views here.
class CreateCustomer(CreateAPIView):
    permission_classes = (AllowAny, )
    queryset = Customer.objects.all()
    serializer_class = CustomerSerializer
    
class ListCreateCart(ListCreateAPIView):
    queryset = Cart.objects.all()
    serializer_class = CartSerializer
    permission_classes = (IsCustomer, )
    
    def post(self, request):
        customer = Customer.objects.get(user=request.user)
        cart = Cart.objects.create(
            customer = customer,
            status = "OPEN"
        )
        
        serializer = CartSerializer(cart)
        
        return Response(serializer.data, status=201)
    
class CreateCartItem(CreateAPIView):
    queryset = CartItem.objects.all()
    serializer_class = CartItemSerializer
    permission_classes = (IsCustomer, )
    