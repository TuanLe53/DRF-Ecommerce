from django.urls import path
from .views import ListCreateOrder, ListOrderItem

urlpatterns = [
    path("", ListCreateOrder.as_view(), name="orders"),
    path("items/", ListOrderItem.as_view(), name="order_items")
]
