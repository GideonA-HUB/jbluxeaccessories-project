from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('site_config', '0012_testimonials_section_fields'),
    ]

    operations = [
        migrations.AddField(
            model_name='heroimage',
            name='description',
            field=models.TextField(blank=True, default='', help_text='Short line shown under the piece name on the rail'),
        ),
        migrations.AddField(
            model_name='heroimage',
            name='tag',
            field=models.CharField(blank=True, default='', help_text='Small hang-tag, such as a price or a collection name', max_length=40),
        ),
        migrations.AddField(
            model_name='heroimage',
            name='details',
            field=models.CharField(blank=True, default='', help_text='Comma-separated facts shown in the detail view', max_length=255),
        ),
        migrations.AddField(
            model_name='heroimage',
            name='back_image',
            field=models.ImageField(
                blank=True,
                help_text='Optional back photo. Use the same portrait size as the main image so the piece does not jump when it turns. Leave empty to reuse the main photo.',
                null=True,
                upload_to='hero_images/',
            ),
        ),
        migrations.AddField(
            model_name='heroimage',
            name='side_image',
            field=models.ImageField(
                blank=True,
                help_text='Optional side photo, same canvas and scale as the main image. Leave empty for bags, jewellery and other pieces that only have one photo.',
                null=True,
                upload_to='hero_images/',
            ),
        ),
    ]
