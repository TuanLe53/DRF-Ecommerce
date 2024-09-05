import django_filters
from .models import Product

class ProductFilterByCategory(django_filters.FilterSet):
    category = django_filters.CharFilter(field_name="category__slug", lookup_expr="exact")
    
    class Meta:
        model = Product
        fields = ["category"]