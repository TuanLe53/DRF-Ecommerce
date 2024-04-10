from django.shortcuts import get_object_or_404

from rest_framework import generics
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.pagination import LimitOffsetPagination

from .serializers import CategorySerializer, ProductSerializer
from .models import Category, Product, ProductImages, Inventory

from vendors.models import Vendor
# Create your views here.
class ListCreateCategory(generics.ListCreateAPIView):
    serializer_class = CategorySerializer
    queryset = Category.objects.all()
    
class ListCreateProduct(generics.ListCreateAPIView):
    queryset = Product.objects.all()
    pagination_class = LimitOffsetPagination
    serializer_class = ProductSerializer
    
    def get_permissions(self):
        if self.request.method == "GET":
            self.permission_classes = [AllowAny, ]
        else:
            self.permission_classes = [IsAuthenticated, ]
        return super(ListCreateProduct, self).get_permissions()
    
    def post(self, request):
        vendor = get_object_or_404(Vendor, user=request.user)
        category = Category.objects.filter(name=request.data["categories"])

        serializer = ProductSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        product = serializer.save(
            vendor=vendor,
            category=category
        )
        
        for file in request.FILES.getlist("images"):
            ProductImages.objects.create(product=product, image=file)
        
        Inventory.objects.create(
            product=product,
            quantity=request.data["quantity"]    
        )
        
        return Response(
            {
                "detail": "Product successfully created!",
                "product": serializer.data,
             },
            status=201
        )