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


class InventorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Inventory
        fields = ("quantity", )

class ProductImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductImages
        fields = ("image", )

class CategoryNameSerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ("name", )
        
    def to_representation(self, value):
        return value.name

class ProductSerializer(serializers.ModelSerializer):
    images = ProductImageSerializer(many=True, read_only=True)
    categories = CategoryNameSerializer(many=True, read_only=True, source="category")
    quantity = serializers.CharField(source="inventory.quantity", read_only=True)
    slug = serializers.SlugField(read_only=True)

    class Meta: 
        model = Product
        fields = ("id", "name", "slug", "price", "description", "categories", "quantity", "images")
        extra_kwargs = {
            "id": {"read_only": True}
            }