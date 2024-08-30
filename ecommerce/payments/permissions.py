from rest_framework.permissions import BasePermission

class IsPaymentOwner(BasePermission):
    def has_permission(self, request, view):
        if request.user.is_authenticated and request.user.user_type == "CUSTOMER":
            return True
        return False
    
    def has_object_permission(self, request, view, obj):
        if obj.customer.user == request.user:
            return True
        return False