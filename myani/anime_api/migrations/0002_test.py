# Generated by Django 5.0 on 2023-12-13 07:05

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('anime_api', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='Test',
            fields=[
                ('id', models.BigAutoField(primary_key=True, serialize=False)),
                ('tag', models.TextField(null=True)),
                ('graph', models.TextField(null=True)),
            ],
        ),
    ]
