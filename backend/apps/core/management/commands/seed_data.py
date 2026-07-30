import os
from decimal import Decimal

from django.contrib.auth.models import User
from django.core.management import call_command
from django.core.management.base import BaseCommand

from apps.products.models import Product
from apps.site_config.default_policies import (
    DEFAULT_PRIVACY_POLICY,
    DEFAULT_REFUND_POLICY,
    DEFAULT_TERMS_OF_SERVICE,
)
from apps.site_config.models import SiteSettings, Testimonial, WhyChooseItem


class Command(BaseCommand):
    help = 'Seed initial data for JBLuxe Accessories'

    def handle(self, *args, **options):
        # Always remove legacy hair-type categories that were auto-seeded in older deploys.
        call_command('cleanup_legacy_categories')

        if not User.objects.filter(username='admin').exists():
            admin_password = os.environ.get('ADMIN_INITIAL_PASSWORD', 'admin123!')
            User.objects.create_superuser(
                username='admin',
                email='admin@jbluxeaccessories.com',
                password=admin_password,
            )
            self.stdout.write(self.style.SUCCESS('Admin user created (username: admin)'))
            if admin_password == 'admin123!':
                self.stdout.write(self.style.WARNING('Change the default admin password after first login.'))

        settings, _ = SiteSettings.objects.get_or_create(pk=1)
        settings.site_name = 'JBLuxe Accessories'
        settings.tagline = 'Luxury Fashion Accessories'
        settings.meta_description = (
            'Premium jewellery, bags, watches, shoes, sunglasses, perfumes and fashion accessories '
            'for women and men. Luxury lifestyle products delivered with care.'
        )
        settings.delivery_fee = Decimal('4000')
        settings.currency = 'NGN'
        settings.currency_symbol = '₦'
        settings.is_vat_inclusive = False
        settings.about_title = 'About JBLuxe Accessories'
        settings.about_subtitle = 'Luxury Accessories, Delivered with Care'
        settings.brand_story = (
            'JBLuxe Accessories was born from a passion for elevated everyday style. '
            'We curate jewellery, designer bags, watches, shoes, sunglasses, perfumes, and '
            'fashion accessories for women and men — bringing world-class quality to discerning '
            'clients across Nigeria and beyond.'
        )
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
        settings.hero_eyebrow = 'Luxury Fashion Accessories'
        settings.hero_title = 'Discover Your Perfect Style'
        settings.hero_subtitle = (
            'Explore our premium collection of jewellery, bags, watches, shoes, sunglasses, '
            'and fashion accessories. Curated for women and men who demand excellence.'
        )
        settings.hero_primary_cta_label = 'Shop Now'
        settings.hero_primary_cta_url = '/shop'
        settings.hero_secondary_cta_label = 'Browse Categories'
        settings.hero_secondary_cta_url = '/categories'
        settings.hero_disclaimer = 'Nationwide delivery · Secure checkout · Luxury quality guaranteed'
        settings.hero_social_proof_text = 'Trusted by style lovers across Nigeria'
        settings.contact_email = 'contact@jbluxeaccessories.com'
        settings.whatsapp_number = '+2348135380528'
        settings.instagram_url = ''
        settings.tiktok_url = ''
        if not settings.privacy_policy:
            settings.privacy_policy = DEFAULT_PRIVACY_POLICY
        if not settings.terms_of_service:
            settings.terms_of_service = DEFAULT_TERMS_OF_SERVICE
        if not settings.refund_policy:
            settings.refund_policy = DEFAULT_REFUND_POLICY
        settings.save()
        self.stdout.write(self.style.SUCCESS('Site settings configured'))

        self.stdout.write(
            self.style.WARNING(
                'Categories are managed in Django admin — no demo categories are seeded.'
            )
        )

        if Product.objects.exists():
            self.stdout.write('Products already exist, skipping product seed')
        else:
            self.stdout.write(
                'No products found. Add products in Django admin under your categories '
                '(Jewellery, Bags, Watches, Shoes, and more).'
            )

        if not WhyChooseItem.objects.exists():
            why_choose_data = [
                ('Authentic Luxury Pieces', 'Genuine premium accessories sourced from trusted suppliers', 0),
                ('Curated Collections', 'Jewellery, bags, watches, shoes, sunglasses & more', 1),
                ('For Her & Him', 'Fashion accessories designed for women and men', 2),
                ('Lasting Quality', 'Built to last with premium materials and craftsmanship', 3),
                ('Effortless Elegance', 'Statement pieces that elevate every look', 4),
                ('Fast Delivery', 'Swift nationwide delivery across Nigeria', 5),
                ('Gift-Ready', 'Perfect luxury gifts for every occasion', 6),
            ]
            for title, description, order in why_choose_data:
                WhyChooseItem.objects.create(
                    title=title,
                    description=description,
                    order=order,
                    is_active=True,
                )
            self.stdout.write(self.style.SUCCESS('Why Choose items created (upload images in Django admin)'))

        if not Testimonial.objects.exists():
            Testimonial.objects.create(
                name='Adaeze O.',
                role='Verified Buyer',
                content=(
                    'The quality is absolutely stunning. My new jewellery set looks and feels '
                    'incredibly premium. JBLuxe Accessories is the real deal!'
                ),
                rating=5,
                is_featured=True,
                order=1,
            )
            Testimonial.objects.create(
                name='Chioma M.',
                role='Loyal Customer',
                content=(
                    "I've tried many brands but nothing compares. The bags and watches are "
                    'beautifully finished. Worth every naira.'
                ),
                rating=5,
                is_featured=True,
                order=2,
            )
            self.stdout.write(self.style.SUCCESS('Testimonials created'))

        self.stdout.write(self.style.SUCCESS('Seed complete!'))
