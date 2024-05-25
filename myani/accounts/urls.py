from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    UserViewSet, 
    TwoFactorViewSet,
    CustomTokenRefreshView,
    FavoritesAnimeViewSet,
    ReviewViewSet,
    UserProfileViewSet,
)
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
    TokenBlacklistView,
)

app_name = 'accounts'

tow_facter_router = DefaultRouter()
tow_facter_router.register(r'tow-factor', TwoFactorViewSet, basename='tow-factor')

userprofile_router = DefaultRouter()
userprofile_router.register(r'user-profile', UserProfileViewSet, basename='user-profile')

user_router = DefaultRouter()
user_router.register(r'user', UserViewSet, basename='user')

anime_favorite_router = DefaultRouter()
anime_favorite_router.register(r'favorite-anime', FavoritesAnimeViewSet, basename='favorite-anime')

review_router = DefaultRouter()
review_router.register(r'review', ReviewViewSet, basename='review')

urlpatterns = [
    path(r'api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path(r'api/token/custom_refresh/', CustomTokenRefreshView.as_view(), name='token_custom_refresh'),
    path(r'api/token/blacklist/', TokenBlacklistView.as_view(), name='token_blacklist'),
    path(r'', include(user_router.urls)),
    path(r'', include(tow_facter_router.urls)),
    path(r'', include(anime_favorite_router.urls)),
    path(r'', include(review_router.urls)),
    path(r'', include(userprofile_router.urls)),
]