FROM jboss/keycloak:3.3.0.CR2-3

USER root
VOLUME /secrets
RUN chown jboss /secrets && mkdir /secrets/vault && chown jboss /secrets/vault

