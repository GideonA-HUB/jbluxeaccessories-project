from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('products', '0005_product_length_8_inches'),
    ]

    operations = [
        migrations.AlterField(
            model_name='product',
            name='density',
            field=models.CharField(
                blank=True,
                help_text='Weight or size label, e.g. 50g, Small, Medium, Large',
                max_length=50,
                verbose_name='Grams',
            ),
        ),
    ]
