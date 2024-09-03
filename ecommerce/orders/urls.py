from django.urls import path
from .views import ListCreateOrder, ListOrderItem, RetrieveOrder, CancelOrder

urlpatterns = [
    path("", ListCreateOrder.as_view(), name="orders"),
    path("<str:pk>", RetrieveOrder.as_view(), name="order"),
    path("<str:pk>/cancel/", CancelOrder.as_view(), name="cancel_order"),
    path("items/", ListOrderItem.as_view(), name="order_items")
]
