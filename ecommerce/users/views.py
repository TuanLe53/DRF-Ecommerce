from rest_framework_simplejwt.views import TokenObtainPairView
from .serializers import UserLoginSerializer
from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from django.shortcuts import get_object_or_404

from vendors.serializers import VendorSerializer
from vendors.models import Vendor

from customers.serializers import CustomerSerializer
from customers.models import Customer
# Create your views here.

class LoginView(TokenObtainPairView):
    serializer_class = UserLoginSerializer
    
class UserProfileView(generics.RetrieveAPIView):
    permission_classes = [IsAuthenticated, ]
    
    def get_serializer_class(self):
        if self.request.user.user_type == "VENDOR":
            return VendorSerializer
        elif self.request.user.user_type == "CUSTOMER":
            return CustomerSerializer
    def get_queryset(self):
        if self.request.user.user_type == "VENDOR":
            return Vendor.objects.all()
        elif self.request.user.user_type == "CUSTOMER":
            return Customer.objects.all()
        
    def get_object(self):
        query_set = self.get_queryset()
        obj = get_object_or_404(query_set, user=self.request.user)
        return obj