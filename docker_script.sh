docker run --name my-nginx -p 80:80 -p 443:443 -v /root/cryptoroses-1:/cryptohero -v /root/cryptoroses-1/nginx_conf/nginx.conf:/etc/nginx/nginx.conf -d nginx
