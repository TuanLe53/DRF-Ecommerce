from django.urls import path
from .views import ListCreatePayment

urlpatterns = [
    path("", ListCreatePayment.as_view(), name="payments")
]
