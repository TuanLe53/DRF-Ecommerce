from rest_framework.permissions import BasePermission

class IsOrderOwner(BasePermission):
    accept_methods = ("PUT", "DELETE", "GET")

    def has_permission(self, request, view):
        if request.user.is_authenticated and request.user.user_type == "CUSTOMER":
            return True
        return False
    
    def has_object_permission(self, request, view, obj):
        if obj.customer.user == request.user and request.method in self.accept_methods:
            return True
        return False