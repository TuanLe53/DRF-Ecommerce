from django.urls import path
from .views import ListCreateCategory, ListCreateProduct, RetrieveUpdateDeleteProductByID, ListProductsByID, CreateDiscount, DeleteDiscount, ListProductsOfVendor

urlpatterns = [
    path("", ListCreateProduct.as_view(), name="products"),
    path("<str:slug>", RetrieveUpdateDeleteProductByID.as_view(), name="product"),
    path("categories/", ListCreateCategory.as_view(), name="category"),
    path("vendor/", ListProductsByID.as_view(), name="my_product"),
    path("vendor/<str:vendor_id>", ListProductsOfVendor.as_view(), name="product_by_vendor"),
    path("discount/", CreateDiscount.as_view(), name="create_discount"),
    path("discount/<str:id>", DeleteDiscount.as_view(), name="delete_discount")
]
