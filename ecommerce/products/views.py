from rest_framework import generics
from rest_framework.permissions import AllowAny
from .serializers import CategorySerializer
from .models import Category
# Create your views here.

class ListCreateCategory(generics.ListCreateAPIView):
    serializer_class = CategorySerializer
    queryset = Category.objects.all()