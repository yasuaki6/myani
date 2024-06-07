from rest_framework import serializers
from rest_framework.authtoken.models import Token

from .models import AnimeTitles, Tags


class AnimetitlesSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = AnimeTitles
        fields= ['title','overview','img']
        read_only_fields = ['title','overview','img']
        
"""    class Meta:
        model = Tags
        fields = ['id','title']
        read_only_fields = ['id','title']"""
        

        

        
        