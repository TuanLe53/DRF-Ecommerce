from rest_framework.permissions import BasePermission

class IsVendor(BasePermission):
    def has_permission(self, request, view):
        if request.user.is_authenticated and request.user.user_type == "VENDOR":
            return True
        return False