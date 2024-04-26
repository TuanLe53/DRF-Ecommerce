from django.urls import path
from .views import CreateCustomer, DeleteCartItem, ListCreateCartItem

urlpatterns = [
    path("new/", CreateCustomer.as_view(), name="customer_register"),
    path("cart/", ListCreateCartItem.as_view(), name="cart_items"),
    path("cart/item/<int:pk>", DeleteCartItem.as_view(), name="remove_item"),
]
