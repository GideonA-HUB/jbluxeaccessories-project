# Generated manually for JBLuxe Accessories rebrand

from django.db import migrations, models

from apps.site_config.default_policies import (
    DEFAULT_PRIVACY_POLICY,
    DEFAULT_REFUND_POLICY,
    DEFAULT_TERMS_OF_SERVICE,
)

NEW_MARQUEE = (
    'JBLuxe Accessories presents Mid Year Preorder Sales — bringing factory prices to your doorstep '
    'with 30% off website orders, 20% off WhatsApp orders, and free gift wrap. '
    'Running July 20th – 25th, 2026. Please read our Terms of Service before ordering.'
)

META_DESCRIPTION = (
    'Premium jewellery, bags, watches, shoes, sunglasses, perfumes and fashion accessories '
    'for women and men. Luxury lifestyle products delivered with care.'
)

BRAND_STORY = (
    'JBLuxe Accessories was born from a passion for elevated everyday style. '
    'We curate jewellery, designer bags, watches, shoes, sunglasses, perfumes, and '
    'fashion accessories for women and men — bringing world-class quality to discerning '
    'clients across Nigeria and beyond.'
)

# Titles from the previous niche seed data — rewrite to accessories copy.
LEGACY_WHY_CHOOSE = {
    'Authentic Luxury Hair': (
        'Authentic Luxury Pieces',
        'Genuine premium accessories sourced from trusted suppliers',
    ),
    'Global Sourcing': (
        'Curated Collections',
        'Jewellery, bags, watches, shoes, sunglasses & more',
    ),
    'Premium Lace': (
        'For Her & Him',
        'Fashion accessories designed for women and men',
    ),
    'Natural Look': (
        'Gift-Ready',
        'Perfect luxury gifts for every occasion',
    ),
}


def rebrand_forward(apps, schema_editor):
    SiteSettings = apps.get_model('site_config', 'SiteSettings')
    SaleAnnouncement = apps.get_model('site_config', 'SaleAnnouncement')
    WhyChooseItem = apps.get_model('site_config', 'WhyChooseItem')
    Testimonial = apps.get_model('site_config', 'Testimonial')

    for settings in SiteSettings.objects.all():
        settings.site_name = 'JBLuxe Accessories'
        settings.tagline = 'Luxury Fashion Accessories'
        settings.meta_description = META_DESCRIPTION
        settings.about_title = 'About JBLuxe Accessories'
        settings.about_subtitle = 'Luxury Accessories, Delivered with Care'
        settings.brand_story = BRAND_STORY
        settings.mission = (
            'To deliver authentic luxury fashion accessories that empower every customer '
            'to feel confident, elegant, and stylish.'
        )
        settings.vision = (
            "To become Africa's most trusted luxury accessories brand, "
            'rivaling international premium fashion houses.'
        )
        settings.why_choose_title = 'Why Choose JBLuxe Accessories'
        settings.why_choose_subtitle = 'Authentic luxury accessories, crafted for elegance'
        settings.contact_email = 'contact@jbluxeaccessories.com'
        # Reset socials — configure new brand handles in Django admin after deploy.
        settings.instagram_url = ''
        settings.tiktok_url = ''
        settings.privacy_policy = DEFAULT_PRIVACY_POLICY
        settings.terms_of_service = DEFAULT_TERMS_OF_SERVICE
        settings.refund_policy = DEFAULT_REFUND_POLICY
        settings.save()

    for announcement in SaleAnnouncement.objects.all():
        announcement.marquee_text = NEW_MARQUEE
        if 'WIGGING' in (announcement.offer_extra or '').upper():
            announcement.offer_extra = 'FREE GIFT WRAP'
        announcement.save()

    for item in WhyChooseItem.objects.all():
        if item.title in LEGACY_WHY_CHOOSE:
            item.title, item.description = LEGACY_WHY_CHOOSE[item.title]
            item.save()
        else:
            title_l = (item.title or '').lower()
            if 'hair' in title_l or 'lace' in title_l or 'wig' in title_l:
                item.title = 'Premium Craftsmanship'
                item.description = 'Thoughtfully designed luxury accessories with lasting quality'
                item.save()

    for t in Testimonial.objects.all():
        content_l = (t.content or '').lower()
        if 'jbluxe' in content_l:
            continue
        if any(token in content_l for token in ('wig', 'hair', 'lace', 'bone straight')):
            t.content = (
                'The quality is absolutely stunning. My new jewellery and accessories look '
                'incredibly premium. JBLuxe Accessories is the real deal!'
            )
            t.save()


def rebrand_reverse(apps, schema_editor):
    pass


class Migration(migrations.Migration):

    dependencies = [
        ('site_config', '0009_seed_mid_year_preorder_announcement'),
    ]

    operations = [
        migrations.AlterField(
            model_name='sitesettings',
            name='site_name',
            field=models.CharField(default='JBLuxe Accessories', max_length=100),
        ),
        migrations.AlterField(
            model_name='sitesettings',
            name='tagline',
            field=models.CharField(default='Luxury Fashion Accessories', max_length=255),
        ),
        migrations.AlterField(
            model_name='sitesettings',
            name='contact_email',
            field=models.EmailField(default='contact@jbluxeaccessories.com', max_length=254),
        ),
        migrations.AlterField(
            model_name='sitesettings',
            name='about_subtitle',
            field=models.CharField(
                blank=True,
                default='Luxury Accessories, Delivered with Care',
                help_text='Subtitle shown below the About page heading',
                max_length=255,
            ),
        ),
        migrations.AlterField(
            model_name='sitesettings',
            name='why_choose_title',
            field=models.CharField(default='Why Choose JBLuxe Accessories', max_length=255),
        ),
        migrations.AlterField(
            model_name='sitesettings',
            name='why_choose_subtitle',
            field=models.CharField(
                blank=True,
                default='Authentic luxury accessories, crafted for elegance',
                max_length=500,
            ),
        ),
        migrations.AlterField(
            model_name='saleannouncement',
            name='offer_extra',
            field=models.CharField(blank=True, default='FREE GIFT WRAP', max_length=80),
        ),
        migrations.AlterField(
            model_name='saleannouncement',
            name='marquee_text',
            field=models.TextField(
                default=NEW_MARQUEE,
                help_text='Continuous scrolling announcement text shown on the homepage banner.',
            ),
        ),
        migrations.RunPython(rebrand_forward, rebrand_reverse),
    ]
