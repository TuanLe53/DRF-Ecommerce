from rest_framework import generics
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny

from django.shortcuts import get_object_or_404
from customers.models import Customer

from .serializers import PaymentSerializer
from .models import Payment
from .permissions import IsPaymentOwner

# Create your views here.
class ListCreatePayment(generics.ListCreateAPIView):
    serializer_class = PaymentSerializer
    queryset = Payment.objects.all()
    
    def get_permissions(self):
        if self.request.method == "GET":
            self.permission_classes = [AllowAny, ]
        else:
            self.permission_classes = [IsAuthenticated,]
        return super(ListCreatePayment, self).get_permissions()
    
    def get_queryset(self):
        customer = get_object_or_404(Customer, user=self.request.user)
        return Payment.objects.filter(customer=customer)
    
    def post(self, request):
        serializer = PaymentSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        customer = get_object_or_404(Customer, user=request.user)
        serializer.save(customer=customer)
        
        return Response(serializer.data, status=201)
    
class DeletePaymentMethod(generics.DestroyAPIView):
    queryset = Payment.objects.all()
    serializer_class = PaymentSerializer
    permission_classes = (IsPaymentOwner, )