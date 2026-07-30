from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('site_config', '0010_rebrand_jbluxe_accessories'),
    ]

    operations = [
        migrations.AddField(
            model_name='sitesettings',
            name='hero_eyebrow',
            field=models.CharField(
                blank=True,
                default='Luxury Fashion Accessories',
                help_text='Small label above the homepage hero title',
                max_length=120,
            ),
        ),
        migrations.AddField(
            model_name='sitesettings',
            name='hero_title',
            field=models.CharField(
                blank=True,
                default='Discover Your Perfect Style',
                help_text='Main homepage hero headline',
                max_length=200,
            ),
        ),
        migrations.AddField(
            model_name='sitesettings',
            name='hero_subtitle',
            field=models.TextField(
                blank=True,
                default=(
                    'Explore our premium collection of jewellery, bags, watches, shoes, sunglasses, '
                    'and fashion accessories. Curated for women and men who demand excellence.'
                ),
                help_text='Supporting text under the homepage hero title',
            ),
        ),
        migrations.AddField(
            model_name='sitesettings',
            name='hero_primary_cta_label',
            field=models.CharField(blank=True, default='Shop Now', max_length=60),
        ),
        migrations.AddField(
            model_name='sitesettings',
            name='hero_primary_cta_url',
            field=models.CharField(blank=True, default='/shop', max_length=255),
        ),
        migrations.AddField(
            model_name='sitesettings',
            name='hero_secondary_cta_label',
            field=models.CharField(blank=True, default='Browse Categories', max_length=60),
        ),
        migrations.AddField(
            model_name='sitesettings',
            name='hero_secondary_cta_url',
            field=models.CharField(blank=True, default='/categories', max_length=255),
        ),
        migrations.AddField(
            model_name='sitesettings',
            name='hero_disclaimer',
            field=models.CharField(
                blank=True,
                default='Nationwide delivery · Secure checkout · Luxury quality guaranteed',
                max_length=200,
            ),
        ),
        migrations.AddField(
            model_name='sitesettings',
            name='hero_social_proof_text',
            field=models.CharField(
                blank=True,
                default='Trusted by style lovers across Nigeria',
                max_length=120,
            ),
        ),
        migrations.AddField(
            model_name='heroimage',
            name='category',
            field=models.CharField(
                blank=True,
                default='COLLECTION',
                help_text='Small label on the homepage hero carousel card (e.g. JEWELLERY, BAGS)',
                max_length=80,
            ),
        ),
        migrations.AddField(
            model_name='heroimage',
            name='title',
            field=models.CharField(
                blank=True,
                default='',
                help_text='Title shown on the homepage hero carousel card',
                max_length=160,
            ),
        ),
        migrations.AddField(
            model_name='heroimage',
            name='link_url',
            field=models.CharField(
                blank=True,
                default='/shop',
                help_text='Where the carousel card navigates when clicked',
                max_length=255,
            ),
        ),
    ]
