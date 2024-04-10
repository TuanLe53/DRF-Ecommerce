from rest_framework.generics import CreateAPIView
from rest_framework.permissions import AllowAny
from .models import Vendor
from .serializers import VendorSerializer
# Create your views here.

class CreateVendor(CreateAPIView):
    permission_classes = (AllowAny, )
    queryset = Vendor.objects.all()
    serializer_class = VendorSerializer