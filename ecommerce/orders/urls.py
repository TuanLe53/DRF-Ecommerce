from django.urls import path
from .views import ListCreateOrder, ListOrderItem, RetrieveOrder

urlpatterns = [
    path("", ListCreateOrder.as_view(), name="orders"),
    path("<str:pk>", RetrieveOrder.as_view(), name="order"),
    path("items/", ListOrderItem.as_view(), name="order_items")
]
