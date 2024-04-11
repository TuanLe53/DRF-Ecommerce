from django.urls import path
from .views import ListCreateOrder

urlpatterns = [
    path("", ListCreateOrder.as_view(), name="orders"),
]
