from django.urls import path
from .views import ListCreateCategory, ListCreateProduct, RetrieveUpdateDeleteProductByID

urlpatterns = [
    path("", ListCreateProduct.as_view(), name="products"),
    path("<uuid:pk>", RetrieveUpdateDeleteProductByID.as_view(), name="product"),
    path("category/", ListCreateCategory.as_view(), name="category"),
]
