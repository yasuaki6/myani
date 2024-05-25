from rest_framework import serializers
from .models import AnimeTitles,Tags
from rest_framework.authtoken.models import Token

class AnimetitlesSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = AnimeTitles
        fields= ['title','overview','img']
        read_only_fields = ['title','overview','img']
        
"""    class Meta:
        model = Tags
        fields = ['id','title']
        read_only_fields = ['id','title']"""
        

        

        
        