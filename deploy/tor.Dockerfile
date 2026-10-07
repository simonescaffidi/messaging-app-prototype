FROM alpine:3.20
RUN apk add --no-cache tor && mkdir -p /var/lib/tor/securmy && chown -R tor /var/lib/tor && chmod 700 /var/lib/tor/securmy
USER tor
CMD ["tor", "-f", "/etc/tor/torrc"]
