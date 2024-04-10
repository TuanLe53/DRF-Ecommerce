from rest_framework import serializers
from .models import Product, ProductImages, Category, Inventory
from django.utils.text import slugify

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ("name", "description", "slug")
        read_only_fields = ("slug", )
        
    def create(self, validated_data) -> Category:
        slug = slugify(validated_data["name"])

        category = Category.objects.create(slug=slug, **validated_data)
        return category



class ProductImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductImages
        fields = ("image", )
        
class ProductSerializer(serializers.ModelSerializer):
    images = ProductImageSerializer(many=True, read_only=True)
    categories = CategorySerializer(many=True)
    vendor = serializers.CharField(required=False)
    inventory = serializers.CharField(required=False)

    class Meta: 
        model = Product
        exclude = ("last_modified", )
        
class InventorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Inventory
        fields = ("quantity", )