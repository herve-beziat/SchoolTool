# ── STAGE BUILD ──────────────────────────────────────────────────────────────
FROM --platform=linux/x86-64 php:7.3-apache AS build

RUN apt-get update && apt-get upgrade -y \
    && apt-get install -y libzip-dev unzip \
    && docker-php-ext-install mysqli pdo pdo_mysql zip \
    && a2enmod rewrite

COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

WORKDIR /var/www/html
COPY . .

RUN composer install --no-dev --no-interaction --prefer-dist

# ── STAGE PROD ───────────────────────────────────────────────────────────────
FROM --platform=linux/x86-64 php:7.3-apache AS prod

RUN apt-get update && apt-get upgrade -y \
    && apt-get install -y libzip-dev unzip \
    && docker-php-ext-install mysqli pdo pdo_mysql zip \
    && a2enmod rewrite

RUN chown -R www-data:www-data /var/www/html \
    && chmod -R 755 /var/www/html

COPY --from=build /var/www/html /var/www/html

EXPOSE 80
CMD ["apache2ctl", "-D", "FOREGROUND"]