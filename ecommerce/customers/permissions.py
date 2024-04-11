from rest_framework.permissions import BasePermission

class IsCustomer(BasePermission):
    def has_permission(self, request, view):
        if request.user.is_authenticated and request.user.user_type == "CUSTOMER":
            return True
        return False
    
class IsCartOwner(BasePermission):
    def has_permission(self, request, view):
        if request.user.is_authenticated and request.user.user_type == "CUSTOMER":
            return True
        return False
    
    def has_object_permission(self, request, view, obj):
        if obj.cart.customer.user == request.user:
            return True
        return False