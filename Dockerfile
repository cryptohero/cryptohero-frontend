FROM nginx:1.13.9
COPY dist /usr/share/nginx/html
LABEL maintainer "kjlmfe@gmail.com"

# set a health check
HEALTHCHECK --interval=10s --timeout=5s CMD curl --fail http://127.0.0.1 || exit 1