FROM coturn/coturn:4.17.2-r0
COPY remote/coturn/turnserver.conf /etc/coturn/omnibot.conf
COPY remote/coturn/entrypoint.sh /usr/local/bin/omnibot-coturn
ENTRYPOINT ["/usr/local/bin/omnibot-coturn"]
