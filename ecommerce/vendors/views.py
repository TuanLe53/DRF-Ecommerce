from rest_framework.generics import CreateAPIView, RetrieveAPIView
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from django.shortcuts import get_object_or_404

from .models import Vendor
from .serializers import VendorSerializer, VendorInfoSerializer

from users.models import CustomUser

# Create your views here.

class CreateVendor(CreateAPIView):
    permission_classes = (AllowAny, )
    queryset = Vendor.objects.all()
    serializer_class = VendorSerializer
    
class GetVendorInfo(RetrieveAPIView):
    permission_classes = (AllowAny, )
    queryset = Vendor.objects.all()
    serializer_class = VendorInfoSerializer
    
    def get_object(self):
        user = get_object_or_404(CustomUser, id=self.kwargs["pk"])
        vendor = get_object_or_404(Vendor, user=user)
        return vendor