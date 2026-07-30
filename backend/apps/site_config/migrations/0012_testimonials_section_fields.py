from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('site_config', '0011_homepage_hero_fields'),
    ]

    operations = [
        migrations.AddField(
            model_name='sitesettings',
            name='testimonials_title',
            field=models.CharField(
                blank=True,
                default='What Our Clients Say',
                help_text='Homepage testimonials section title',
                max_length=255,
            ),
        ),
        migrations.AddField(
            model_name='sitesettings',
            name='testimonials_subtitle',
            field=models.CharField(
                blank=True,
                default='Real stories from real customers who have experienced the JBLuxe Accessories difference',
                help_text='Homepage testimonials section subtitle',
                max_length=500,
            ),
        ),
    ]
