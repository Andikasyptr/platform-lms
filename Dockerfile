FROM node:22-bookworm-slim AS frontend-builder

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY resources ./resources
COPY public ./public
COPY vite.config.ts tsconfig.json components.json ./
RUN npm run build

FROM php:8.4-apache AS app

ARG APP_ENV=production
ENV APP_ENV=${APP_ENV}
ENV COMPOSER_ALLOW_SUPERUSER=1

WORKDIR /var/www/html

RUN apt-get update \
	&& apt-get install -y --no-install-recommends \
		git \
		curl \
		unzip \
		libicu-dev \
		libzip-dev \
		libpng-dev \
		libjpeg62-turbo-dev \
		libfreetype6-dev \
		supervisor \
	&& docker-php-ext-configure gd --with-freetype --with-jpeg \
	&& docker-php-ext-install -j"$(nproc)" \
		bcmath \
		exif \
		gd \
		intl \
		opcache \
		pcntl \
		pdo_mysql \
		zip \
	&& a2enmod rewrite \
	&& rm -rf /var/lib/apt/lists/*

COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

COPY .docker/vhost.conf /etc/apache2/sites-available/000-default.conf
COPY .docker/supervisord.conf /etc/supervisor/conf.d/supervisord.conf
COPY .docker/entrypoint.sh /usr/local/bin/entrypoint.sh
RUN chmod +x /usr/local/bin/entrypoint.sh

COPY composer.json composer.lock ./
RUN composer install \
	--no-dev \
	--no-interaction \
	--no-progress \
	--prefer-dist \
	--optimize-autoloader

COPY . .
COPY --from=frontend-builder /app/public/build ./public/build

RUN mkdir -p storage/framework/cache \
	&& mkdir -p storage/framework/sessions \
	&& mkdir -p storage/framework/views \
	&& mkdir -p storage/logs \
	&& mkdir -p bootstrap/cache \
	&& chown -R www-data:www-data storage bootstrap/cache \
	&& chmod -R ug+rwx storage bootstrap/cache

EXPOSE 80

ENTRYPOINT ["/usr/local/bin/entrypoint.sh"]
CMD ["/usr/bin/supervisord", "-c", "/etc/supervisor/conf.d/supervisord.conf"]
