# Generated by Django 2.2.5 on 2021-12-07 18:06

from django.db import migrations, models
import django.db.models.deletion


def load_data_from_sql(path):
    import os
    sql_statements = open(os.path.join(path), 'r').read()
    return sql_statements


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Wall',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
            ],
        ),
        migrations.CreateModel(
            name='Vertex',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('x', models.IntegerField()),
                ('y', models.IntegerField()),
                ('wall', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='app.Wall')),
            ],
        ),
        migrations.RunSQL(load_data_from_sql("app/sql/wall.sql")),
        migrations.RunSQL(load_data_from_sql("app/sql/vertex.sql")),
    ]
