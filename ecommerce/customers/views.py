from rest_framework.generics import CreateAPIView
from rest_framework.permissions import AllowAny
from .models import Customer
from .serializers import CustomerSerializer

# Create your views here.
class CreateCustomer(CreateAPIView):
    permission_classes = (AllowAny, )
    queryset = Customer.objects.all()
    serializer_class = CustomerSerializer