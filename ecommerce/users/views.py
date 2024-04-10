from rest_framework_simplejwt.views import TokenObtainPairView
from .serializers import UserLoginSerializer
# Create your views here.

class LoginView(TokenObtainPairView):
    serializer_class = UserLoginSerializer