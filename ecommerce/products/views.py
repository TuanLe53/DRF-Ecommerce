from django.shortcuts import get_object_or_404
from django.utils.text import slugify
from datetime import datetime
from django.db import transaction
from django_filters.rest_framework import DjangoFilterBackend

from rest_framework import generics
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from rest_framework.pagination import LimitOffsetPagination
from rest_framework.parsers import MultiPartParser

from .serializers import CategorySerializer, ProductSerializer
from .models import Category, Product, ProductImages, Inventory, Discount
from .permissions import IsVendor, IsProductOwner
from .filters import ProductFilterByCategory
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
    filter_backends =   [DjangoFilterBackend]
    filterset_class = ProductFilterByCategory
    
    def get_permissions(self):
        if self.request.method == "GET":
            self.permission_classes = [AllowAny, ]
        else:
            self.permission_classes = [IsVendor,]
        return super(ListCreateProduct, self).get_permissions()
    
    def post(self, request):
        vendor = get_object_or_404(Vendor, user=request.user)
        
        current_time = datetime.now().strftime("%d%m%Y %H%M%S")
        product_slug = slugify(f'{request.data["name"]} {current_time}')
        
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
                {"error": "Error creating product. Please try again later."},
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
    lookup_field = 'slug'
    
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
    
class CreateDiscount(generics.CreateAPIView):
    queryset = Product.objects.all()
    permission_classes = [IsVendor, ]
    
    def post(self, request):
        vendor = get_object_or_404(Vendor, user=request.user)
        product = get_object_or_404(Product, id=request.data.get("product"))
        
        if product.vendor != vendor:
            return Response(
                {"error": "You are not the owner of this product"},
                status=403
            )
            
        Discount.objects.create(
            product=product,
            percentage=request.data["percentage"]
        )
        
        serializer = ProductSerializer(product)
        
        return Response(
            {
                "detail": "Success",
                "product": serializer.data
            },
            status=201
        )
        
class DeleteDiscount(generics.DestroyAPIView):
    queryset = Product.objects.all()
    
    def destroy(self, request, *args, **kwargs):
        pd_id = kwargs.get("id")
        product = get_object_or_404(Product, id=pd_id)
        
        if hasattr(product, "discount"):
            product.discount.delete()
            return Response(status=204)
        
        return Response(
            {"error": "No discount has been found"},
            status=404
        )