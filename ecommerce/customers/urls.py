from django.urls import path
from .views import CreateCustomer, ListCreateCart, CreateCartItem, ListCartItem, DeleteCartItem

urlpatterns = [
    path("new/", CreateCustomer.as_view(), name="customer_register"),
    path("cart/", ListCreateCart.as_view(), name="cart"),
    path("cart/items/", CreateCartItem.as_view(), name="add_item"),
    path("cart/<uuid:pk>", ListCartItem.as_view(), name="cart_items"),
    path("cart/items/<int:pk>", DeleteCartItem.as_view(), name="remove_item"),
]
