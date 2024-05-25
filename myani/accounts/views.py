import logging
from django.conf import settings
from django.shortcuts import render,redirect
from django.contrib.auth import authenticate, login, logout
from django.views.generic.edit import CreateView,FormView,UpdateView
from django.views.generic.base import TemplateView,View
from django.utils import timezone
from django.utils.html import strip_tags
from django.template.loader import render_to_string
from .models import (Users, 
                     TwoFactorEmailModel,
                     VerificationTokenModel,
                     FavoritesModel,
                     ReviewsModel,
                     UserProfileModel,
                     UserSelectAnimeTrackingModel
)
from anime_api.models import AnimeTitles
from .serializers import (UserRegistrationSerializer, 
                          ChangePasswordSerializer,
                          ProvisionalRegistrationSerializer,
                            UserLoginSerializer,
                            FavoritesAnimeSerializer,
                            ReviewSerializer,
                            ChackPasswordSrializer,
                            EditUserInfoSerializer,
                            UserProfileSerializer,
                          )
from rest_framework import status, viewsets, generics
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.exceptions import ValidationError
from django.core.exceptions import ObjectDoesNotExist
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated,AllowAny
from django.contrib.auth.password_validation import validate_password
from rest_framework_simplejwt.tokens import RefreshToken
import secrets
from datetime import timedelta
from django.core.mail import send_mail
import os
from rest_framework_simplejwt.views import TokenRefreshView
from rest_framework.response import Response
from accounts.authentication import CookieHandlerJWTAuthentication
from django.shortcuts import get_object_or_404
import re
from django.contrib.auth.models import AnonymousUser
import requests
import json
import random
from django.db import IntegrityError,transaction

# Create your views here.

def get_tokens_for_user(user):
    refresh = RefreshToken.for_user(user)

    return {
        'refresh': str(refresh),
        'access': str(refresh.access_token),
    }

class UserViewSet(viewsets.ModelViewSet, generics.GenericAPIView):
    logger = logging.getLogger(__name__)
    queryset = Users.objects.all() 
    
    def get_serializer_class(self):
        match self.action:
            case 'registration':
                return UserRegistrationSerializer
            case 'login':
                return UserLoginSerializer
            case 'provisional_registration':
                return ProvisionalRegistrationSerializer
            case "change_password":
                return ChangePasswordSerializer
            case "provisional_reset_password_token":
                return ProvisionalResetPasswordSerializer
            case "reset_password":
                return SlidingTokenBlacklistSerializer
            case "send_reset_password_email":
                return SendResetPasswordEmailSerializer
            case "check_password":
                return ChackPasswordSrializer
            case "edit_user_info":
                return EditUserInfoSerializer
            case _:
                return null
            
    @action(detail=False, methods=['POST'])
    def registration(self, request, *args, **kwargs):
        """
        ユーザの登録
        
        Args:
            request:
                username(Str): username
                email(Str): email
                password(Str): パスワード
                re_password(Str): 確認用パスワード
            
        Return:
            Response.object
        """
            
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            user = serializer.create()
            UserProfileModel.create(uuid=user.uuid)

            token = secrets.token_urlsafe(64)
            expiry = timezone.now() + timedelta(minutes=30)
            
            VerificationTokenModel.objects.create(
            uuid=user,
            token=token,
            expiry=expiry,
            purpose_regist_user = True,
            )
            
            regist_user_url = settings.BASE_URL + '/accounts/user/regist/?token={}'.format(token)
            message = render_to_string('regist_user_email_template.html',{'regist_user_url': regist_user_url})
            
            email_config = {
                'subject' : '【MYANI】メールアドレスの確認',
                'html_message' : message,
                'message' : strip_tags(message),
                'from_email' : None,
                'recipient_list' : [request.data['email']], 
                'fail_silently' : False,
            }
            
            send_mail(
                **email_config
            )
            
            return Response(status=status.HTTP_200_OK)
            
        else:
            error_message={'error':serializer.errors}
            return Response(error_message,status=status.HTTP_400_BAD_REQUEST)
        
    @action(detail=False, methods=['GET'], authentication_classes=[CookieHandlerJWTAuthentication])
    def resend_email_verification(self, request, *args, **kwargs):
        print(request.user)
        if not isinstance(request.user,AnonymousUser):
            user = request.user
            if user.is_email_verified == True:
                return Response('認証済み',status=status.HTTP_200_OK)
            token = secrets.token_urlsafe(64)
            expiry = timezone.now() + timedelta(minutes=30)
            
            VerificationTokenModel.objects.create(
            uuid=user,
            token=token,
            expiry=expiry,
            purpose_regist_user = True,
            )
            
            regist_user_url = settings.BASE_URL + '/accounts/user/regist/?token={}'.format(token)
            message = render_to_string('regist_user_email_template.html',{'regist_user_url': regist_user_url})
            
            email_config = {
                'subject' : '【MYANI】メールアドレスの確認',
                'html_message' : message,
                'message' : strip_tags(message),
                'from_email' : None,
                'recipient_list' : [request.user.email], 
                'fail_silently' : False,
            }
            
            send_mail(
                **email_config
            )   
            
            return Response(status=status.HTTP_200_OK)
            
        else:
            return Response(status=status.HTTP_401_UNAUTHORIZED)
        
    @action(detail=False, methods=['GET'])
    def provisional_registration(self, request, *args, **kwargs):
        """
        userの本登録を確認するapi
        
        Args:
            request:
                token(Str):認証トークン
                
        Return:
            Response.object
        """
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid(raise_exception=True):
            user = Users.objects.get(uuid=serializer.token_instances.uuid)
            user.is_email_verified = True
            serializer.token_instances.delete()
            return Response(status=HTTP_200_OK)      
        
    @action(detail=False, methods=['POST'])
    def change_password(self, request, authentication_classes=[CookieHandlerJWTAuthentication]):
        """
        パスワードを変更する
        
        Args:
            request:
                current_password(Str): 現在のパスワード
                new_password(Str): 新しいパスワード
                confirm_password(Str): 確認用パスワード
            
        Return:
            Response.object
        """
        if not isinstance(request.user,AnonymousUser):
            current_password = request.data.get('current_password')
            new_password = request.data.get('new_password')
            confirm_password = request.data.get('confirm_password')
            refresh_token = request.COOKIES.get("refresh_token")
            
            user = request.user
            serializer = self.get_serializer(data = request.data)

            if new_password == confirm_password:
                if serializer.is_valid(raise_exception=True):
                    if user.check_password(serializer.validated_data['current_password']):
                        token = serializer.validated_data['refresh']
                        token = RefreshToken(token)
                        token.blacklist()
                        
                        tokens = get_tokens_for_user(request.user)
                        
                        user.set_password(new_password)
                        user.save()
                        
                        response.delete_cookie("refresh_token")
                        response.set_cookie('refresh_token', tokens['refresh'], httponly=True, secure=True, samesite='None')
                        

                        return Response(status=status.HTTP_200_OK)  
                            
                    else:
                        return Response(data={'パスワードが違います'},
                                        status=status.HTTP_400_BAD_REQUEST)            
            else:
                return Response(data={'新しいパスワーが一致しません'}, status=status.HTTP_400_BAD_REQUEST)
        else:
            return Response(status=HTTP_401_UNAUTHORIZED)
             
    @action(detail=False, methods=['POST'])
    def send_reset_password_email(self, request, *args, **kwargs):
        """ 
        パスワードリセットのためのリセットメールを送信する

        Args:
            request:
                email (str): パスワードリセットメールを送信するメールアドレス

        Returns:
            Response.object
        """
        serializer = self.get_serializer(data=request.data)
        try :
            serializer.is_valid(raise_exception=True)
                
        except ValidationError as e:
            logger.error(e)
            return Response(status=status.HTTP_200_OK)    
            
        token = secrets.token_urlsafe(64)
        expiry = timezone.now() + timedelta(minutes=30)
        VerificationTokenModel.objects.create(
            token=token,
            user=serializer.uuid,
            expiry=expiry,
            purpose_reset_password = True,
        )
        
        reset_password_url = settings.BASE_URL + '/accounts/user/reset-password/?token=' + token
        
        subject = '【MYANI】パスワードリセットのお知らせ'
        message = render_to_string('reset_password_email_template.html', {'reset_password_url': reset_password_url})
        plain_message = strip_tags(message)  # HTMLタグを取り除いたプレーンなメッセージ

        send_mail(
            subject = subject,
            message = plain_message,
            from_email = None,
            recipient_list = [request.data['email']], 
            html_message=message,
            fail_silently = False,
        )
        
        return Response(status=status.HTTP_200_OK)
    
    @action(detail=False, methods=['POST'])
    def provisional_reset_password_token(self, request, *args, **kwargs):
        """
        パスワードリセットのトークン検証とパスワード検証
        
        Args:
            request:
                token(Str):トークン
                new_password:パスワード
                re_password:確認用パスワード
                
        return:
            Response.object
        """   
        serializer = self.get_serializer(data=request.data)
        
        if serializer.is_valid(raise_exception=True):
            user = Users.objects.get(uuid=serializer.token_instances.uuid)
            user.set_password(new_password)
            serializer.token_instances.delete()
            user.save()
            return Response(status=HTTP_200_OK)
        
    @action(detail=False, methods=['POST'], permission_classes=[AllowAny])
    def login(self, request, *args, **kwargs):
        """
        ユーザーログインapi
        
        Args:
            request:
                email:string
                password:string
        return:
            Response.object
        """
        serializer = self.get_serializer(data=request.data)
        
        if serializer.is_valid(raise_exception=True):
            tokens = get_tokens_for_user(serializer.user)
            response = Response({'message': 'Login successful'})
            response.set_cookie('access_token', tokens['access'], httponly=True, secure=True, samesite='None')
            response.set_cookie('refresh_token', tokens['refresh'], httponly=True, secure=True, samesite='None')
            return response
        else:
            return Response({'message': 'Login failed'}, status=401)  
    
    @action(detail=False, methods=['GET'], authentication_classes=[CookieHandlerJWTAuthentication])
    def get_detail(self, request, *args, **kwargs):
        """
        ユーザ詳細情報取得
        
        return:
            username(Str):ユーザ名
            identifier(Str):識別子
            email(Str):メールアドレス
            icon:画像
            is_email_verified:メールアドレス認証有無
        """
        permission_classes = [IsAuthenticated]
        user = request.user
        
        if not isinstance(request.user,AnonymousUser):
            response_data = {
                'username':user.username,
                'identifier':user.user_identifier,
                'email':user.email,
                'is_email_verified':user.is_email_verified
            }
            
            return Response(response_data, status=status.HTTP_200_OK)
        
        else:
            return Response(status=status.HTTP_401_UNAUTHORIZED)
    
    @action(detail=False, methods=['PUT'], authentication_classes=[CookieHandlerJWTAuthentication])
    def edit_user_info(self, request, *args, **kwargs):
        """
        ユーザ詳細情報の編集
        
        Args:
            username(Str):ユーザ名
            identifier(Str):識別子
        """ 

        
        username = request.data.get('username',request.user.username)
        identifier = request.data.get('identifier',request.user.user_identifier)
        
        data = {'username':username, 'user_identifier':identifier}
        
        if not isinstance(request.user,AnonymousUser):
            serializer = self.get_serializer(data=data)
            if serializer.is_valid():
                request.user.username = username
                request.user.user_identifier = identifier
                request.user.unique_username = '{}#{}'.format(username,identifier)
                request.user.save()
                return Response(status=status.HTTP_200_OK)

            else:
                print(serializer.errors)
                return Response(serializer.errors,status=status.HTTP_400_BAD_REQUEST)
        
        else:
            return Response(status=status.HTTP_401_UNAUTHORIZED)
    
    @action(detail=False, methods=['POST'], authentication_classes=[CookieHandlerJWTAuthentication])
    def logout(self, request, *args, **kwargs):
        """
        ログアウトするためのAPi
        """
        permission_classes = [IsAuthenticated]
        
        refresh_token = request.COOKIES.get("refresh_token")
        token = RefreshToken(refresh_token)
        token.blacklist()
             
        response = Response(status=status.HTTP_200_OK)
        response.delete_cookie("refresh_token",samesite='None')
        response.delete_cookie("access_token",samesite='None')
        
        return response
    
    @action(detail=False, methods=['POST'], authentication_classes=[CookieHandlerJWTAuthentication])
    def check_password(self, request, *args, **kwargs):
        """
        パスワードのcheckを行うapi
        対象のユーザーはjwtのauthor
        """
        
        serializer = self.get_serializer(data=request.data)
        
        if not isinstance(request.user,AnonymousUser):
            if serializer.is_valid():
                if request.user.check_password(serializer.validated_data['password']):
                    return Response(True,status=status.HTTP_200_OK)
            
                else:
                    return Response(False,status=status.HTTP_400_BAD_REQUEST)
                
            else:
                return Response(False,status=status.HTTP_400_BAD_REQUEST)
            
        else:
            return Response(status=status.HTTP_401_UNAUTHORIZED)
        
    @action(detail=False, methods=['POST'])
    def username_filter(self, request, *args, **kwargs):
        """
        usernmaeが一致するユーザを全て返す。
        args:
            username
        return:
            uniqe_usernmaes
        """    
        
        username = request.data.get('username',None)
        
        instances = Users.objects.filter(username=username)
        response_data = {}
        for i,instance in enumerate(instances):
            response_data[i] = instance.unique_username
        print(response_data)

        return Response(response_data,status=status.HTTP_200_OK)
            
            
        
    

# HTTPRequestのBodyプロパティから送られてきたtokenを受け取る
class CustomTokenRefreshView(APIView):
    def get(self, request, *args, **kwargs):
        try:
            refresh_token = request.COOKIES["refresh_token"]
        except KeyError:
            return Response(status=status.HTTP_400_BAD_REQUEST)
        
        
        headers = {
            'Content-Type': 'application/json',
        }
        
        data = {
            'refresh':refresh_token,
        }
        
        response = requests.post('http://127.0.0.1:8000/accounts/api/token/refresh/', headers=headers, data=json.dumps(data))
        if response.status_code == status.HTTP_200_OK:
            response_data =  response.json()
            access_token = response_data['access']
            response = Response(status=status.HTTP_200_OK)
            response.set_cookie(
                            'access_token', 
                            access_token,
                            httponly=True, 
                            secure=True, 
                            samesite='None'
                            )
            return response
        
        else:
            return Response(status=response.status_code)
        
    def post(self, request, *args, **kwargs):
        return Response({'message': 'Method Not Allowed'}, status=status.HTTP_405_METHOD_NOT_ALLOWED)
    
    def put(self, request, *args, **kwargs):
        return Response({'message': 'Method Not Allowed'}, status=status.HTTP_405_METHOD_NOT_ALLOWED)
    
    def delete(self, request, *args, **kwargs):
        return Response({'message': 'Method Not Allowed'}, status=status.HTTP_405_METHOD_NOT_ALLOWED)


class TwoFactorViewSet(viewsets.ModelViewSet):
    logger = logging.getLogger(__name__)
    
    @action(detail=False, methods=['POST'])
    def validation(self, request, *args, **kwargs):
        assert request.data['email'],'e-mailがありません'
        assert request.data['code'],'codeがありません'
        self.email = request.data['email']
        self.code = request.data['code']
        try:
            instance = TwoFactorEmailModel.objects.get(email=self.email)
            try:
                instance.validate_code(self.code)
                user = Users.objects.get(email=self.email)
                user.is_active = True
                user.save()
                instance.delete()
                return Response(status=status.HTTP_201_CREATED)
                
            except ValidationError as e:
                self.logger.error(e)
                error_message = str(e)
                error_message = {'error_message':error_message}
                response = Response(data=error_message, status=status.HTTP_400_BAD_REQUEST)  
                return response
        
        except TwoFactorEmailModel.DoesNotExist as each:
            self.logger.error(e)
            return Response(
                data={}
            )        
    
    @action(detail=False, methods=['POST'])
    def resend(self, request, *args, **kwargs):
        assert request.data['email'],'e-mailがありません'
        self.email = request.data['email']
        try:
            user_instance = Users.objects.get(email=self.email)
            try:
                TwoFactorEmailModel.objects.get(email=self.email).delete()    
                instance = TwoFactorEmailModel()
                instance.email = user_instance
                instance.save()
                return Response(status=status.HTTP_200_OK)
            
            except TwoFactorEmailModel.DoesNotExist as e:
                self.logger.error(e)
                message = {'message':'errorが発生しました。お問い合わせいただくか、\
                                        違うメールアドレスでお試しください'}
                return Response(data=message, status=status.HTTP_400_BAD_REQUEST)
            
        except Users.DoesNotExist as e:
            self.logger.error(e)
            return Response(status=status.HTTP_200_OK)
            
USERNAME_USE_IDENTIFIER_REGEX = r'([^#]+)#([^#]+)' 
            
class FavoritesAnimeViewSet(viewsets.ModelViewSet):
    queryset = FavoritesModel.objects.all()
    
    @action(detail=False, methods=['POST'], authentication_classes=[CookieHandlerJWTAuthentication], permission_classes=[IsAuthenticated])       
    def registration(self, request, *args, **kwargs):
        """
        アニメお気に入り登録
        
        Args:
            anime_title:string
        """
        user = request.user
        
        data = {
            'anime_title':request.data.get('title'),
            'uuid':user.uuid,
        }
        
        serializer = FavoritesAnimeSerializer(data=data)
        if serializer.is_valid():
            serializer.create(serializer.validated_data)
        else:
            return Response(serializer.errors ,status=status.HTTP_400_BAD_REQUEST)
            
        return Response(status=status.HTTP_200_OK)
    
    @action(detail=False, methods=['DELETE'], authentication_classes=[CookieHandlerJWTAuthentication], permission_classes=[IsAuthenticated])   
    def delete(self, request, *args, **kwargs):
        """
        アニメお気に入り解除
        
        Args:
            anime_title:string
        """
        user = request.user
        
        data = {
            'anime_title':request.data.get('anime_title'),
            'uuid':user.uuid,
        }
        
        serializer = FavoritesAnimeSerializer(data=data)
        
        #uuidとtitleは一意にあるので、
        try:
            serializer.is_valid(raise_exception=True)
            
        except ValidationError as e:
            print(e)
            for error_key, error_value in e.detail.items():
                for error_detail in error_value:
                    if error_detail.code == 'unique':
                        serializer.delete(data)
                    else:
                        return e
            
        return Response(status=status.HTTP_200_OK)
    
 
    
    @action(detail=False, methods=['GET'], authentication_classes=[CookieHandlerJWTAuthentication])
    def get_detail(self, request):
        """
        ユーザが特定のアニメをお気に入り登録しているかを確認するエンドポイントで
        usernameはusername#user_identifierで構成される
        """
        
        username = request.query_params.get('username')
        title = request.query_params.get('title')
        
        if username and title: 
            user_match  = re.match(USERNAME_USE_IDENTIFIER_REGEX, username)
            if user_match :
                before_hash, after_hash = user_match.groups()
                user = get_object_or_404(Users, username=before_hash, user_identifier=after_hash, is_active=True)
                
                if not isinstance(request.user,AnonymousUser) and username == request.user.unique_username:
                    favorite = FavoritesModel.objects.filter(anime_title=title, uuid=user.uuid).first()
                    anime_title_instance = AnimeTitles.objects.get(title=title)
                    if anime_title_instance:
                        UserSelectAnimeTrackingModel.objects.create(uuid=user,select_anime=anime_title_instance)
                    
                else:
                    favorite = FavoritesModel.objects.filter(anime_title=title, uuid=user.uuid, is_hidden=False).first()
                
                if favorite:
                    return Response({'favorite_state': True}, status=status.HTTP_200_OK)
                else:
                    return Response({'favorite_state': False}, status=status.HTTP_200_OK)
                
            else:
                return Response({'message':'usernameの指定の仕方が間違っています。username#identifier'},
                                status=HTTP_400_BAD_REQUEST)
    
        else:
            return Response({'message': 'usernameとtitleを指定してください。'},
                        status=status.HTTP_400_BAD_REQUEST)
                        
    @action(detail=False, methods=['GET'], authentication_classes=[CookieHandlerJWTAuthentication])     
    def get_list(self, request):
        """
        ユーザが特定のアニメをお気に入りの一覧を取得するエンドポイントで
        usernameはusername#user_identifierで構成される

        data構造 
        data = {title : {
        'overview': obj.overview, 
        'img':obj.img.url, 
        'broadcast':obj.broadcast}}
        """
        target_user = request.query_params.get('username')
        user_match  = re.match(USERNAME_USE_IDENTIFIER_REGEX, str(target_user))
        target_user_instance = get_object_or_404(Users, unique_username=target_user, is_active=True)

        if user_match :
            if not isinstance(request.user,AnonymousUser) and target_user_instance.uuid == request.user.uuid:
                try:      
                    favorite_instances = FavoritesModel.objects.filter(uuid=request.user.uuid)
                    anime_title_instances = AnimeTitles.objects.filter(title__in=favorite_instances.values_list('anime_title', flat=True))
                    print(anime_title_instances)
                    
                    response_data = {}
                    for anime_title_instance in anime_title_instances:
                        response_data[str(anime_title_instance.title)] = {
                            'overview': str(anime_title_instance.overview), 
                            'img':str(anime_title_instance.img.url), 
                            'broadcast':str(anime_title_instance.broadcast)}
                        
                    return Response(response_data, status=status.HTTP_200_OK)
                
                except FavoritesModel.DoesNotExist:
                    return Response({}, status=status.HTTP_200_OK)
                
            else:
                try: 
                    print(target_user_instance)
                    favorite_instances = FavoritesModel.objects.filter(uuid=target_user_instance.uuid, is_hidden=False)
                    anime_title_instances = AnimeTitles.objects.filter(title__in=favorite_instances.values_list('anime_title', flat=True))
                    
                    response_data = {}
                    for anime_title_instance in anime_title_instances:
                        response_data[str(anime_title_instance.title)] = {
                            'overview': str(anime_title_instance.overview), 
                            'img':str(anime_title_instance.img.url), 
                            'broadcast':str(anime_title_instance.broadcast)}
                        
                    return Response(response_data, status=status.HTTP_200_OK)
                
                except FavoritesModel.DoesNotExist:
                    return Response({}, status=status.HTTP_200_OK)
            
        else:
            return Response({'message':'usernameの指定の仕方が間違っています。username#identifier'},
                            status=status.HTTP_400_BAD_REQUEST)            
            

class ReviewViewSet(viewsets.ModelViewSet):
    queryset = ReviewsModel.objects.all()
    def get_serializer_class(self):
        return ReviewSerializer
    
    @action(detail=False, methods=['GET'])
    def get_review(self,request):
        """
        指定したユーザとタイトルで合致するreviewを返すapi
        エスケープ処理は施していないため、フロントエンド側で行う
        args:
        {
          username:string(username#useridentifier)
          anime_title:[anime_titles:string]
        } 
        return:
          [{author:{review_title:string,body:string,star:int or null}}}]
        """
        request_user = request.query_params.get('username')
        request_anime_title = request.query_params.get('anime_title')
        
        user_match  = re.match(USERNAME_USE_IDENTIFIER_REGEX, str(request_user))
        
        if user_match:
            author = get_object_or_404(Users,unique_username=request_user)
            try:
                reviews_instances = ReviewsModel.objects.filter(author=author,anime_title=request_anime_title)
                response_data = {}
                for reviews_instance in reviews_instances:
                    print(reviews_instance)
                    response_data[str(reviews_instance.author)] = {
                        'title': str(reviews_instance.review_title),
                        'body':str(reviews_instance.body),
                        'star':str(reviews_instance.star)}
                print(response_data)    
                return Response(response_data, status=status.HTTP_200_OK)
                
            except ReviewsModel.DoesNotExist:
                return Response({}, status=status.HTTP_404_NOT_FOUND)            
        
        else:
            return Response({'message':'usernameの指定の仕方が間違っています。username#identifier'},
                            status=status.HTTP_400_BAD_REQUEST)       
        
    
    @action(detail=False, methods=['GET'])
    def random_get(self,request):
        """
        指定した作品のreviewをランダムに返すapi
        エスケープ処理は施していないため、フロントエンド側で行う
        args:
            anime_title:string 作品名
            number:number 取得する数
            
        return:
            {author:{
            title:str,
            body:str,
            star:str
            }}
        """
        
        request_anime_title = request.query_params.get('anime_title')
        count = int(request.query_params.get('number'))
        all_reviews = ReviewsModel.objects.filter(anime_title=request_anime_title)
        
    
        # データ数が指定された数より少ない場合は、全てのデータを返す
        response_data = {}
        if len(all_reviews) <= count:
            for review in all_reviews:
                response_data[str(review.author)] = {'title':str(review.review_title),'body':review.body, 'star':review.star}
            print(response_data)
            return Response(response_data, status=status.HTTP_200_OK)        
        
        else:
            random_reviews = random.sample(list(all_reviews), count)
            for review in random_reviews:
                response_data[str(review.author)] = {'title':str(review.review_title),'body':review.body, 'star':review.star}
            print(response_data)
            return Response(response_data, status=status.HTTP_200_OK)
        
    @action(detail=False, methods=['POST'], authentication_classes=[CookieHandlerJWTAuthentication], permission_classes=[IsAuthenticated])
    def review_create(self,request):
        """
        reviewを作成するapi
        args:
            anime_title:string,
            review_title:string,
            body:string,
            star:string,
        """
        
        if not isinstance(request.user,AnonymousUser) and request.data.get('author') == request.user.unique_username:
            request.data['author'] = request.user.uuid
            serializer = self.get_serializer(data=request.data)
            if serializer.is_valid():
                try:
                    ReviewsModel.objects.create(**serializer.validated_data)
                    return Response(status=status.HTTP_201_CREATED)  
                
                except IntegrityError:
                    return Response(status=status.HTTP_200_OK)
            
            else:
                print(serializer.errors)
                if len(serializer.errors) == 1 and 'non_field_errors' in serializer.errors and serializer.errors['non_field_errors'][0].code == 'unique':
                    anime_title = request.data.get('anime_title')
                    author = request.data.get('author')
                    with transaction.atomic():
                        tmp = ReviewsModel.objects.get(anime_title=anime_title, author=author)
                        tmp.delete() 
                    
                        ReviewsModel.objects.create(**serializer.validated_data)
                            
                    return Response(status=status.HTTP_201_CREATED)
                else:   
                    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
        else:
            return Response(status=status.HTTP_401_UNAUTHORIZED)
        
    @action(detail=False, methods=['DELETE'], authentication_classes=[CookieHandlerJWTAuthentication], permission_classes=[IsAuthenticated])
    def delete(self,request):
        """
        reviewを削除するapi
        args:
            anime_title:string,
        """
        
        anime_title = request.data.get('anime_title')
        author = request.user.uuid
        
        if not isinstance(request.user,AnonymousUser) and request.data.get('author') == request.user.unique_username:
            try:
                tmp = ReviewsModel.objects.get(anime_title=anime_title,author=author)
                tmp.delete()
                return Response(status=status.HTTP_200_OK) 
            
            except ReviewsModel.DoesNotExist:
                return Response(status=status.HTTP_200_OK)

        else:
            return Response(status=status.HTTP_401_UNAUTHORIZED)
        
    @action(detail=False, methods=['PUT'], authentication_classes=[CookieHandlerJWTAuthentication], permission_classes=[IsAuthenticated])
    def edit(self,request):
        """
        reviewを編集するapi
        args:
            anime_title:string,
            author:string,
            review_title?:string,
            body?:string,
            star?:number
        """
        
        print(request.user)
        anime_title = request.data.get('anime_title')
        author = request.user.uuid
        
        data = request.data
        
        if not isinstance(request.user,AnonymousUser) and request.data.get('author') == request.user.unique_username:
  
            try:
                instance = ReviewsModel.objects.get(anime_title=anime_title,author=author)
                
            except ReviewsModel.DoesNotExist:
                return Response({'error': 'not found'}, status=status.HTTP_404_NOT_FOUND)
            
            instance.review_title = data.get('review_title',instance.review_title)
            instance.body = data.get('body',instance.body)
            instance.star = data.get('star',instance.star)
            
            serializer = self.get_serializer(instance)
            
            if serializer.is_valid():    
                instance.save()
                return Response(status=status.HTTP_200_OK)
            
            else:
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
            
        else:
            return Response(status=status.HTTP_401_UNAUTHORIZED)
    """    
    @action(detail=False, methods=['GET'], authentication_classes=[CookieHandlerJWTAuthentication])
    def get_list(self,request):
      args:
        username:uniqueusername
    """
  
    """
    
    username = request.query_params.get('username')
    user_match  = re.match(USERNAME_USE_IDENTIFIER_REGEX, username)
    if user_match:
        user_instance = Users.objects.get_object_or_404(unique_username=username,is_active=True)
        if not isinstance(request.user,AnonymousUser) and user_instance.user_instance == request.user.uuid:
            ReviewsModel.objects.filter(author=)
    
    """
    
class UserProfileViewSet(viewsets.ModelViewSet):
    logger = logging.getLogger(__name__)
    queryset = UserProfileModel.objects.all() 
    
    def get_serializer_class(self):
        match self.action:
            case 'edit_userprofile':
                return UserProfileSerializer
       
    @action(detail=False, methods=['PUT'], authentication_classes=[CookieHandlerJWTAuthentication])
    def edit_userprofile(self, request, *args, **kwargs):
        """
        args:
            icon:string
            status_message:string
            background:string
        """
        
        
        
        if not isinstance(request.user,AnonymousUser):       
            profile_instance = get_object_or_404(UserProfileModel,uuid=request.user.uuid)
            
            icon = request.data.get('icon', profile_instance.icon)
            status_message = request.data.get('status_message', profile_instance.status_message)
            background = request.data.get('background', profile_instance.background)
            print(icon)
            print(background)
            print(status_message)
            

            serializer = self.get_serializer(data={
                'icon':icon,
                'status_message':status_message,
                'background':background
            })

            if serializer.is_valid():
                profile_instance.icon = icon
                profile_instance.status_message = status_message
                profile_instance.background = background
                profile_instance.save()
                
                
            
                return Response(status=status.HTTP_200_OK)
            
            else:
                return Response(serializers.error_message,status=status.HTTP_400_BAD_REQUEST)
            
        else:
            return Response(status=status.HTTP_401_UNAUTHORIZED)
    
    @action(detail=False, methods=['GET'])
    def get_userprofile(self, request, *args, **kwargs):
        """
        指定したユーザのプロフィール情報を取得
        args:
            username:uniqueusername
        return:
            icon:url(string)
            status:string
            background:url(string)
        """
        uniqueusername = request.query_params.get('username') 
        user = get_object_or_404(Users, unique_username=uniqueusername)
        try:
            profile_instance = UserProfileModel.objects.get(uuid=user.uuid)
        except UserProfileModel.DoesNotExist:
                data={
                'uuid':user.uuid,
                'icon':None,
                'status_message':None,
                'background':None
                }
                UserProfileModel.objects.create(**data)
                profile_instance = UserProfileModel.objects.get(uuid=user.uuid)

        response_data  = {
            'icon': str(profile_instance.icon), 
            'status':str(profile_instance.status_message), 
            'background':str(profile_instance.background)
            }
        return Response(response_data,status=status.HTTP_200_OK)
            
 
            
            
            

        
             