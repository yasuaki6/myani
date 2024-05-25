from django.db import models

class AnimeTitles(models.Model):
    title = models.CharField(primary_key=True,max_length=64)
    overview = models.TextField()
    broadcast = models.DateField()
    img = models.ImageField(upload_to='media')
    officialsite = models.URLField(null=True)
    pv = models.TextField(null=True)
    
    def __str__(self):
        return self.title
    
class Tags(models.Model):
    id = models.BigAutoField(primary_key=True,)
    title = models.ForeignKey(
        AnimeTitles, on_delete=models.CASCADE
    )
    tag = models.TextField(null=True)
    graph = models.TextField(null=True)
    
    def __str__(self):
        return f'Tag by {self.Animetitles.title}'

# Create your models here.