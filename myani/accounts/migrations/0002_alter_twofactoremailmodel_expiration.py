# Generated by Django 5.0 on 2024-03-15 09:36

import datetime
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('accounts', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='twofactoremailmodel',
            name='expiration',
            field=models.DateTimeField(default=datetime.datetime(2024, 3, 15, 20, 36, 27, 588178)),
        ),
    ]
