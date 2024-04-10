from django.urls import path
from .views import ListCreateCategory, ListCreateProduct

urlpatterns = [
    path("", ListCreateProduct.as_view(), name="products"),
    path("category/", ListCreateCategory.as_view(), name="category"),
]
