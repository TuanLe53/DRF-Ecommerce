from django.urls import path
from .views import ListCreateCategory, ListCreateProduct, RetrieveUpdateDeleteProductByID, ListProductsByID

urlpatterns = [
    path("", ListCreateProduct.as_view(), name="products"),
    path("<str:slug>", RetrieveUpdateDeleteProductByID.as_view(), name="product"),
    path("categories/", ListCreateCategory.as_view(), name="category"),
    path("vendor/", ListProductsByID.as_view(), name="product_by_vendor")
]
