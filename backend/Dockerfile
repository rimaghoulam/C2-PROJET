FROM php:7.3-fpm
WORKDIR /app
RUN apt-get update -y && apt-get install -y openssl zip unzip git sendmail libpng-dev
RUN apt update && apt install -y libc-client-dev libkrb5-dev && rm -r /var/lib/apt/lists/*
RUN curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer
RUN docker-php-ext-install pdo pdo_mysql
RUN docker-php-ext-install mbstring
RUN docker-php-ext-configure imap --with-kerberos --with-imap-ssl && docker-php-ext-install imap
RUN docker-php-ext-install gd
RUN echo "expose_php = Off" >> /usr/local/etc/php/conf.d/custom.ini
COPY . .
RUN composer install
RUN composer require dompdf/dompdf
RUN composer require khaled.alshamaa/ar-php
RUN composer require shuchkin/simplexlsxgen
RUN composer require barryvdh/laravel-dompdf
RUN composer require phpoffice/phpword
RUN composer require geniusts/hijri-dates
CMD bash -c "php artisan serve --host 0.0.0.0 --port 8000"
EXPOSE 8000
