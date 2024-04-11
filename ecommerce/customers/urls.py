from django.urls import path
from .views import CreateCustomer, ListCreateCart

urlpatterns = [
    path("new/", CreateCustomer.as_view(), name="customer_register"),
    path("cart/", ListCreateCart.as_view(), name="cart")
]
