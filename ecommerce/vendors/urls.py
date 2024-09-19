from django.urls import path
from .views import CreateVendor, GetVendorInfo

urlpatterns = [
    path("new/", CreateVendor.as_view(), name="vendor_register"),
    path("<str:pk>", GetVendorInfo.as_view(), name="vendor_info"),
]