from django.urls import path
from .views import ListCreateCategory

urlpatterns = [
    path("category/", ListCreateCategory.as_view(), name="category"),
]
