from django.urls import path, include
from rest_framework import routers
from .views import RandomAnimeTitles

routers = routers.DefaultRouter()


app_name = 'myani'
urlpatterns = [
    path('api/animetitle/<int:number>/',RandomAnimeTitles.as_view(),name='animeAPIrandom')
]