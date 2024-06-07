from django.apps import apps
from django.contrib.auth import get_user_model
from django.contrib.auth.password_validation import \
    validate_password as provided_validate_password
from django.core.exceptions import ValidationError as DjangoValidationError
from django.utils import html, timezone
from rest_framework import serializers
from rest_framework.exceptions import ValidationError
import re

from .models import (FavoritesModel, ReviewsModel, UserProfileModel,
                     VerificationTokenModel)

Users = get_user_model()


PASSWORD_REGEX = r'(?=.*[A-Z])(?=.*\d)(?=.*[a-z]).*$'

class UserRegistrationSerializer(serializers.Serializer):
    username = serializers.CharField(required=True, max_length=32)
    email = serializers.EmailField(required=True, max_length=320)
    password = serializers.CharField(required=True, write_only=True, max_length=124)
    re_password = serializers.CharField(required=True, write_only=True, max_length=124)
    
    is_email_verified_flag = False
        
    def validate_username(self, value):
        safe_value = html.escapejs(value)
        return safe_value
    
    def validate_email(self,value):
        try:
            self.user = Users.objects.get(email=value)
            if self.user.is_email_verified: 
                raise ValidationError('すでに存在しています')
            
            else:
                self.user.delete()
                return value
        
        except Users.DoesNotExist:
            return value
    
    def validate_password(self, value):
        pattern = re.compile(PASSWORD_REGEX)
        
        errors = []
        if pattern.match(value) == None:
            errors.append('大文字、小文字、数字を1文字以上入れてください')    
        
        try:
            provided_validate_password(value)
            
        except DjangoValidationError as e:
            errors += e
     
        if errors:
            raise ValidationError(errors)
        
        return value
    
    def validate(self, data):
        if data['password'] != data['re_password']:
            return Response(
                data={'message':'パスワードが確認用パスワードと一致しません。'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        return data
        
    def create(self):
        return Users.objects.create_user(**self.validated_data)
    
class EditUserInfoSerializer(serializers.ModelSerializer):
    
    def validate_username(self, value):
        if len(value) > 34:
            raise ValidationError("ユーザ名は34文字以下である必要があります。")
        return value
    
    def validate_user_identifier(self,value):
        if len(str(value)) != 3:
            raise ValidationError('3件桁の数字にしてください')
        return value
        
    class Meta:
        model = Users
        fields = ['username','user_identifier',]
    
class UserLoginSerializer(serializers.Serializer):
    email = serializers.CharField(required=True)
    password = serializers.CharField(required=True)
    user = None
    
    def validate(self, data):
        try: 
            self.user = Users.objects.get(email=data['email'])
        
        except Users.DoesNotExist:
            raise ValidationError('emailもしくはpasswordが間違っています')
        
        if self.user.check_password(data['password']):
            return data
        
        else:
            raise ValidationError('emailもしくはpasswordが間違っています')
    
class ChangePasswordSerializer(serializers.Serializer):
    current_password = serializers.CharField(required=True)
    new_password = serializers.CharField(required=True)
    confirm_password =serializers.CharField(required=True)
    refresh = serializers.CharField(required=True)
    
    def validate_password(self,value):
        instance = UserRegistrationSerializer()
        return instance.validate_password(value)
    
class ChackPasswordSrializer(serializers.Serializer):
    password = serializers.CharField(required=True)
    
    def validate_password(self, value):
        pattern = re.compile(PASSWORD_REGEX)
        
        if pattern.match(value) == None:
            raise ValidationError('大文字、小文字、数字を1文字以上入れてください')  
          
        else:
            return value
    

class SendResetPasswordEmailSerializer(serializers.Serializer):
    email = serializers.EmailField(required=True,max_length=Users.email_max_length)
    
    def validate_email(self,value):
        try:
            self.user = Users.objects.get(email=value)
            if self.user.is_active == False:
                raise ValidationError('is_activeが有効ではない')
        
        except Users.DoesNotExist:
            raise ValidationError('指定されたメールアドレスが存在しません')
        
        return value
  
    
class ProvisionalRegistrationSerializer(serializers.Serializer):
    token = serializers.CharField(max_length=255, required=True)
    
    def validate_token(self,value):
        try:
            self.token_instances = VerificationTokenModel.objects.get(value)
            if self.token_instances.purpose_regist_user:
                if self.token_instances.expiry > timezone.now():
                    return value
                
                else:
                    raise ValidationError('トークンの有効期限が切れています。もう一度申請してください。')
            
            else:
                raise ValidationError('値が不正です。')
                
        except:
            raise ValidationError('トークンが正しくありません。')
     
        
class ProvisionalResetPasswordSerializer(serializers.Serializer):
    token = serializers.CharField(max_length=255)
    new_password = serializers.CharField(max_length=128)
    re_password = serializers.CharField(max_length=128)
    
    def validate_new_password(self, value):
        instance = UserRegistrationSerializer()
        return instance.validate_password(value)  
    
    def validate(self,data):
        new_password = data.get('new_password')
        re_password = data.get('re_password')
        token = data.get('token')
        
        if new_password == re_password:
            try:
                self.token_instances = VerificationTokenModel.objects.get(token=token)
                if self.token_instances.purpose_reset_password:
                    if self.token_instances.expiry > timezone.now():
                        return data
                    
                    else:
                        raise ValidationError('トークンの有効期限が切れています。もう一度申請してください')
                
                else:
                    raise ValidationError('値が不正です')
                    
                    
                    
            except VerificationTokenModel.DoesNotExist:
                raise ValidationError('トークンが正しくありません')
                
        
        else:
            raise ValidationError('パスワードと確認パスワードが一致しません')
    
    
    
class FavoritesAnimeSerializer(serializers.ModelSerializer):
    FavoritesModel = apps.get_models('FavoritesModel')
    
    class Meta:
        model = FavoritesModel
        fields = ['anime_title','uuid']
        
    def create(self, validated_data):
        anime_title = validated_data['anime_title']
        uuid = validated_data['uuid']
        

        if not FavoritesModel.objects.filter(anime_title=anime_title, uuid=uuid).exists():
            FavoritesModel.objects.create(anime_title=anime_title, uuid=uuid)
    
    def delete(self, data):
        anime_title = data['anime_title']
        uuid = data['uuid']
        
        if FavoritesModel.objects.filter(anime_title=anime_title, uuid=uuid).exists():
            FavoritesModel.objects.filter(anime_title=anime_title, uuid=uuid).delete()
            
            
class ReviewSerializer(serializers.ModelSerializer):
    ReviewsModel = apps.get_models('ReviewsModel')
    
    class Meta:
        model = ReviewsModel
        fields = ['anime_title','review_title','author','body','star']
        
    def validate_star(self,value):
        if value >= 1 and value <= 5:
            return value
        else:
            raise ValidationError('starは1から5までの整数でしていしたください')
    
        
class UserProfileSerializer(serializers.ModelSerializer):
    UserProfileModel = apps.get_models('UserProfileModel')
    
    class Meta:
        model = UserProfileModel
        fields = '__all__'

            