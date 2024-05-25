import pytest
from rest_framework.test import APIRequestFactory
from accounts.serializers import UserRegistrationSerializer
from django.contrib.auth import get_user_model
from rest_framework.exceptions import ValidationError
from rest_framework.test import APIClient
from django.core import mail
from rest_framework import status
from django.test import TestCase
from django.urls import reverse
from rest_framework.fields import ErrorDetail
import json
from accounts.models import TwoFactorEmailModel
import re
from django.core.exceptions import ObjectDoesNotExist

Users = get_user_model()

xss_js = {
    'username':"<script></script>",
    'email':'test@yahoo.co.jp',
    'password':'+A123<script>docment.cookie</script>',
    're_password':'+A123<script>docment.cookie</script>',
}

validation_password = {
    'username':'test',
    'email':'test@example.com',
    'password':'testfgsfsatest',
    're_password':'testtest',
}

sql_injection = {
    'username':'ASkg2425',
    'email':'test@yahoo.co.jp',
    'password':'ASkgoska2425; insert into accounts_users (password, email, username) \
    values (Abcd013, sqlinjection@email.com, sqlinjection)',
}

@pytest.mark.django_db
def test_xss_escape():
    serializer = UserRegistrationSerializer(data=xss_js)
    if not serializer.is_valid():
        print(serializer.errors)
    validated_data = serializer.validated_data
    print( f'Escaped String: {validated_data}')   

@pytest.mark.django_db
def test_sql_injection():
    Users.objects.create_user(**sql_injection)
    with pytest.raises(Users.DoesNotExist):
        Users.objects.get(username='sqlinjection')

@pytest.mark.django_db       
def test_validation_password():
    with pytest.raises(ValidationError) as exc_info:
        serializer = UserRegistrationSerializer(data=validation_password)
        serializer.is_valid(raise_exception=True)
    expected_error_detail = {'password': [ErrorDetail(string='大文字、小文字、数字を1文字以上入れてください', code='invalid')]}  
    assert exc_info.value.detail == expected_error_detail
     
user_regist_data =  {
            'username': 'testuser',
            'email': 'testsdadsa@example.com',
            'password': 'Secu12dsa',
            're_password': 'Secu12dsa',
        }
     
mail_extract_code_pattern = r'\d+'     
@pytest.mark.django_db      
class UserRegistrationViewTest(TestCase):
    
    def setUp(self):
        self.client = APIClient()
        self.regist_url = reverse('accounts:user-regist')
        self.towfactor_url = reverse('accounts:tow-factor-validation')
        mail.outbox = []

        
    def test_user_registration_successfull(self):
    
        regist_response = self.client.post(self.regist_url, user_regist_data, format='json')
        self.assertEqual(regist_response.status_code, status.HTTP_200_OK)
        
        authentication_code = re.findall(mail_extract_code_pattern,str(mail.outbox[0].body))[0]
        assert len(authentication_code) == 4
         
        towfactor_response = self.client.post(self.towfactor_url, {'email':user_regist_data['email'],
                                            'code':'00i9'}, format='json')
        assert Users.objects.get(username=user_regist_data['username']).is_active == False, '間違った認証コードで認証が完了している'
        assert TwoFactorEmailModel.objects.get(email=user_regist_data['email']).trycount == 1, 'towfactorのtrycountが増加していない。'
        
        towfactor_response = self.client.post(self.towfactor_url, {'email':user_regist_data['email'],
                                            'code':authentication_code}, format='json')
        self.assertEqual(towfactor_response.status_code, status.HTTP_201_CREATED)
        assert Users.objects.get(username=user_regist_data['username']).is_active == True, '認証成功していない'
        

@pytest.mark.django_db      
class Towfactor_resend(TestCase):
        
    def setUp(self):
        self.client = APIClient()
        self.regist_url = reverse('accounts:user-regist')
        self.towfactor_url = reverse('accounts:tow-factor-validation')
        self.towfactor_resend_url = reverse('accounts:tow-factor-resend')
        mail.outbox = []
    
    def test_resend(self):
        
        regist_response = self.client.post(self.regist_url, user_regist_data, format='json')
        self.assertEqual(regist_response.status_code, status.HTTP_200_OK)
        first_code = re.findall(mail_extract_code_pattern,str(mail.outbox[0].body))[0]

        self.client.post(self.towfactor_resend_url, {'email':user_regist_data['email']}, format='json')
        second_code = re.findall(mail_extract_code_pattern,str(mail.outbox[1].body))[0]
        
        assert first_code != second_code, '認証コードが変わっていません'
        self.assertEqual(TwoFactorEmailModel.objects.filter(email=user_regist_data['email']).count(), 1)
    
        towfactor_response = self.client.post(self.towfactor_url, {'email':user_regist_data['email'],
                                    'code':second_code}, format='json')

        assert Users.objects.get(username=user_regist_data['username']).is_active == True, '認証成功していない'

        response = self.client.post(self.towfactor_resend_url, {'email':user_regist_data['email']}, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)