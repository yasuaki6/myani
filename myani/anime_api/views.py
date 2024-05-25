from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework import generics
from .models import AnimeTitles,Tags
from rest_framework import viewsets
from .serializers import (AnimetitlesSerializer,)
import numpy as np
from rest_framework.response import Response

# Create your views here.
class RandomAnimeTitles(APIView):
    queryset = AnimeTitles.objects.all()
    serializer_class = AnimetitlesSerializer
    permission_classes = (AllowAny,)
    
    def get(self, request, number:int, format=None):
        title_ids = [Tags.objects.select_related('title').get(pk=1 + int(np.random.rand() * 10)).title_id for _ in range(number)]
        print(title_ids)
        
        queryset = AnimeTitles.objects.filter(pk__in=title_ids)
        
        data = [{'title': obj.title, 'overview': obj.overview, 'img':obj.img.url, 'broadcast':obj.broadcast} for obj in queryset]
        return Response(data)

    
    
    
