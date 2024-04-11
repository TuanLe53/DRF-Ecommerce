from rest_framework.permissions import BasePermission

class IsCustomer(BasePermission):
    def has_permission(self, request, view):
        if request.user.is_authenticated and request.user.user_type == "CUSTOMER":
            return True
        return False