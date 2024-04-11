from django.urls import path
from .views import CreateCustomer, ListCreateCart, CreateCartItem

urlpatterns = [
    path("new/", CreateCustomer.as_view(), name="customer_register"),
    path("cart/", ListCreateCart.as_view(), name="cart"),
    path("cart/items/", CreateCartItem.as_view(), name="cart_item"),
]
