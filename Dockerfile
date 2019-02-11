FROM alpine:3.9 AS build

ARG WEZMUID=2000
ARG WEZMGID=2000
ARG USER=wezm

RUN apk --update add --no-cache ruby-dev ruby-bundler ruby-bigdecimal ruby-json build-base zlib-dev \
    && addgroup -g ${WEZMGID} ${USER} \
    && adduser -D -u ${WEZMUID} -G ${USER} -h /home/${USER} -D ${USER}

RUN mkdir /usr/share/www && chown wezm:wezm /usr/share/www

WORKDIR /usr/share/www

USER wezm

COPY --chown=wezm:wezm Gemfile .
COPY --chown=wezm:wezm Gemfile.lock .

RUN bundle install -j 4 --deployment --without 'test development'

COPY --chown=wezm:wezm . .

RUN bundle exec nanoc co


FROM 791569612186.dkr.ecr.ap-southeast-2.amazonaws.com/nginx

ARG WEZMUID=2000
ARG WEZMGID=2000
ARG USER=wezm

RUN addgroup -g ${WEZMGID} ${USER} \
    && adduser -D -u ${WEZMUID} -G ${USER} -h /home/${USER} -D ${USER}

COPY --from=build --chown=wezm:wezm /usr/share/www/output /usr/share/www

EXPOSE 80
