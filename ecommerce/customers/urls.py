from django.urls import path
from .views import CreateCustomer

urlpatterns = [
    path("new/", CreateCustomer.as_view(), name="customer_register")
]
