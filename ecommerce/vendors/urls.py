from django.urls import path
from .views import CreateVendor

urlpatterns = [
    path("new/", CreateVendor.as_view(), name="vendor_register")
]