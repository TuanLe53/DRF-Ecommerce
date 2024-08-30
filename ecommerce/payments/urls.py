from django.urls import path
from .views import ListCreatePayment, DeletePaymentMethod

urlpatterns = [
    path("", ListCreatePayment.as_view(), name="payments"),
    path("<str:pk>", DeletePaymentMethod.as_view(), name="delete_payment")
]
