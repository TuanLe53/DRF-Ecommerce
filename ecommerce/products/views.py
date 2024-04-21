from django.shortcuts import get_object_or_404
from django.utils.text import slugify
from django.db import transaction

from rest_framework import generics
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from rest_framework.pagination import LimitOffsetPagination
from rest_framework.parsers import MultiPartParser

from .serializers import CategorySerializer, ProductSerializer
from .models import Category, Product, ProductImages, Inventory
from .permissions import IsVendor, IsProductOwner
from vendors.models import Vendor

# Create your views here.
class ListCreateCategory(generics.ListCreateAPIView):
    serializer_class = CategorySerializer
    queryset = Category.objects.all()
    
class ListCreateProduct(generics.ListCreateAPIView):
    queryset = Product.objects.all()
    pagination_class = LimitOffsetPagination
    serializer_class = ProductSerializer
    parser_classes = [MultiPartParser]
    
    def get_permissions(self):
        if self.request.method == "GET":
            self.permission_classes = [AllowAny, ]
        else:
            self.permission_classes = [IsVendor,]
        return super(ListCreateProduct, self).get_permissions()
    
    def post(self, request):
        vendor = get_object_or_404(Vendor, user=request.user)
        
        product_slug = slugify(request.data["name"])
        
        serializer = ProductSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        try:
            with transaction.atomic():                
                product = serializer.save(
                    vendor=vendor,
                    slug=product_slug
                )

            for category_name in request.data.getlist("categories"):
                category = Category.objects.get(name=category_name)
                product.category.add(category)
                
            for file in request.FILES.getlist("images"):
                ProductImages.objects.create(product=product, image=file)
            
            Inventory.objects.create(
                product=product,
                quantity=request.data["quantity"]    
            )
            
        except Exception as e:
            return Response(
                {"detail": "Error creating product. Please try again later."},
                status=500
            )
        
        return Response(
            {
                "detail": "Product successfully created!",
                "product": serializer.data,
             },
            status=201
        )
        
class RetrieveUpdateDeleteProductByID(generics.RetrieveUpdateDestroyAPIView):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    parser_classes = [MultiPartParser]
    
    def get_permissions(self):
        if self.request.method == "GET":
            self.permission_classes = [AllowAny, ]
        else:
            self.permission_classes = [IsProductOwner, ]
            
        return super(RetrieveUpdateDeleteProductByID, self).get_permissions()
    
class ListProductsByID(generics.ListAPIView):
    serializer_class = ProductSerializer
    permission_classes = [IsProductOwner, ]
    
    def get_queryset(self):
        vendor = get_object_or_404(Vendor, user=self.request.user)
        products = Product.objects.filter(vendor=vendor)
        
        return products