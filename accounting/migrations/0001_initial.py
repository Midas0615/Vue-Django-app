# Generated by Django 2.2.7 on 2019-11-16 08:31

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Transaction',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('amount', models.DecimalField(decimal_places=2, max_digits=7)),
                ('currency', models.CharField(max_length=3)),
                ('trans_type', models.CharField(max_length=10)),
                ('category', models.CharField(max_length=10)),
                ('subcategory', models.CharField(max_length=10)),
                ('from_account', models.CharField(max_length=10)),
                ('on_account', models.CharField(max_length=10)),
                ('create_datetime', models.DateTimeField()),
                ('place', models.CharField(max_length=10)),
                ('notes', models.TextField()),
            ],
        ),
    ]