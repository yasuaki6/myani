from django.db import models,IntegrityError
from django.contrib.auth.models import (
    BaseUserManager,AbstractBaseUser,PermissionsMixin
)
from django.urls import reverse_lazy
from django.apps import apps
import random
from datetime import datetime, timedelta, timezone
from django.core.mail import send_mail
import pytz
from rest_framework.exceptions import ValidationError
from django.contrib.auth.validators import UnicodeUsernameValidator
import uuid
from anime_api.models import AnimeTitles

def random_generate(length):
    identifier = ''.join(str(random.randint(0, 9)) for _ in range(length))
    return identifier

class UserManager(BaseUserManager):
    MAX_TRIES = 100
    def create_user(self, username, email, password=None, *args, **kwargs):
        user = self.model(
            username = username,
            email=email
        )
        user.set_password(password)
        
        for _ in range(self.MAX_TRIES):
            
            try:
                user.user_identifier = random_generate(length=3)
                user.unique_username = user.username + '#' + user.identifier
                user.save(using=self._db)
                return user
            
            except IntegrityError:
                pass
            
        raise IntegrityError("同じusernameが多く存在しています。変更して下さい。")
            

class Users(AbstractBaseUser,PermissionsMixin):
    
    username_validator = UnicodeUsernameValidator()
    email_max_length = 255
    username_max_length = 34
    password_max_length = 128
    user_identifier_max_length = 3
    
    uuid = models.UUIDField(
        primary_key=True,
        default=uuid.uuid4,
        editable=False,
        db_comment="システムユーザID",
    )
    email = models.EmailField(
        max_length=email_max_length,
        unique=True,
        db_comment="メールアドレス",
        )
    username = models.CharField(
        max_length=username_max_length,
        db_comment="ユーザ名",
        )
    password = models.CharField(
        max_length=password_max_length,
        db_comment="パスワード",
        )
    is_staff = models.BooleanField(
        default=False
        )
    is_active = models.BooleanField(
        default=True,
        db_comment="有効の有無",
        )
    icon = models.CharField(
        max_length=100,
        blank=True,
        null=True,
        db_comment = 'プロフィール画像'
        )
    user_identifier = models.CharField(
        max_length = user_identifier_max_length,
        db_comment = 'ユーザ識別子'
        )
    created_at = models.DateTimeField(
        auto_now_add=True,
        db_comment="作成日"
    )
    is_email_verified = models.BooleanField(
        default = False
    )
    
    unique_username = models.CharField(
        max_length=username_max_length+3,
        unique=True,
        db_index=True
    )
    
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username','user_identifier']
    
    objects = UserManager()
    
    def __str__(self):
        return  f'{self.username}#{self.user_identifier}'
    
    class Meta:
        unique_together = ('username', 'user_identifier')
        
class UserProfileModel(models.Model):
    status_max_length = 128
    
    uuid = models.ForeignKey(Users,
        to_field='uuid', 
        on_delete=models.CASCADE,
        null=True
        )
    icon = models.CharField(
        max_length=100,
        blank=True,
        null=True,
        db_comment = 'プロフィール画像'
        )
    status_message = models.CharField(
        max_length=status_max_length,
        db_comment='ステータスメッセージ',
        null=True,
        )
    background = models.CharField(
        max_length=100,
        blank=True,
        null=True,
        db_comment = '背景'
        )

class TwoFactorEmailModel(models.Model):
    code_max_length = 4
    
    code = models.CharField(max_length=code_max_length)
    created_at = models.DateTimeField(auto_now_add=True)
    expiration = models.DateTimeField(default=datetime.now() + timedelta(hours=2))
    trycount = models.IntegerField(default=0)
    email = models.ForeignKey(Users, to_field='email', on_delete=models.CASCADE)

 
    def save(self, *args, **kwargs):
        if not self.code:
            self.code = self.generate_code()
            super().save(*args, **kwargs)
          
        else:
            super().save(*args, **kwargs)

    def generate_code(self):
        code = random_generate(4)
        return code   
    
    def validate_code(self,code):
        if self.attempt_is_over():
            if self.is_expired():
                if self.code == code:
                    return True
                else:
                    self.trycount += 1
                    self.save()
                    raise ValidationError('認証コードが間違っています')
        
            else:
                raise ValidationError('有効期限が過ぎています')
                
        else:
            raise ValidationError('試行回数を超えました')
    
    def attempt_is_over(self):
        return self.trycount < 5

    def is_expired(self):
        return self.expiration > datetime.now(timezone.utc)
    

class VerificationTokenModel(models.Model):
    uuid = models.ForeignKey(
        Users, 
        to_field='uuid', 
        on_delete=models.CASCADE
        )
    token = models.CharField(
        max_length=255, 
        primary_key=True
        )
    expiry = models.DateTimeField(
        auto_now_add=True
        )
    purpose_reset_password = models.BooleanField(
        null=True
        )
    purpose_regist_user = models.BooleanField(
        null=True
        )

    
class ReviewsModel(models.Model):
    anime_title = models.ForeignKey(
        AnimeTitles, 
        to_field='title',
        on_delete=models.PROTECT
    )
    author = models.ForeignKey(
        Users, 
        to_field='uuid', 
        on_delete=models.CASCADE, 
    )
    review_title = models.CharField(
        max_length=32
    )
    body = models.TextField(
        max_length=1024
    )
    star = models.IntegerField(
        null=True
    )
    created_at = models.DateTimeField(
        auto_now_add=True
    )
    
    REQUIRED_FIELDS = ['anime_title','author','review_title','body']
    
    class Meta:
        unique_together = ('anime_title', 'author')
        
    
class FavoritesModel(models.Model):
    anime_title = models.ForeignKey(AnimeTitles, to_field='title', on_delete=models.PROTECT)
    uuid = models.ForeignKey(Users, on_delete=models.CASCADE)
    is_hidden = models.BooleanField(default=False)
    
    class Meta:
        unique_together = ('anime_title', 'uuid')
        
        
class UserSelectAnimeTrackingModel(models.Model):
    uuid = models.ForeignKey(
        Users,
        on_delete=models.PROTECT
        )
    select_anime = models.ForeignKey(
        AnimeTitles, 
        to_field='title', 
        on_delete=models.PROTECT,
        db_comment='選択されたアニメ'
        )
    created_at = models.DateTimeField(
        auto_now_add=True,
        db_comment="作成日"
        )
        
        
        