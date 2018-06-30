FROM jboss/keycloak:4.0.0.Final

# Make theme customizations available for use
ADD themes/jchptf /opt/jboss/keycloak/themes/jchptf/
ADD themes/jchptf2 /opt/jboss/keycloak/themes/jchptf2/

ADD changeHostname.xsl /opt/jboss/keycloak/
ADD disableTemplateCaching.xsl /opt/jboss/keycloak/
ADD application.keystore /opt/jboss/keycloak/standalone/configuration/

RUN java -jar /usr/share/java/saxon.jar -s:/opt/jboss/keycloak/standalone/configuration/standalone.xml -xsl:/opt/jboss/keycloak/changeHostname.xsl -o:/opt/jboss/keycloak/standalone/configuration/standalone.xml && \
    java -jar /usr/share/java/saxon.jar -s:/opt/jboss/keycloak/standalone/configuration/standalone-ha.xml -xsl:/opt/jboss/keycloak/changeHostname.xsl -o:/opt/jboss/keycloak/standalone/configuration/standalone-ha.xml && \
    java -jar /usr/share/java/saxon.jar -s:/opt/jboss/keycloak/standalone/configuration/standalone.xml -xsl:/opt/jboss/keycloak/disableTemplateCaching.xsl -o:/opt/jboss/keycloak/standalone/configuration/standalone.xml && \
    java -jar /usr/share/java/saxon.jar -s:/opt/jboss/keycloak/standalone/configuration/standalone-ha.xml -xsl:/opt/jboss/keycloak/disableTemplateCaching.xsl -o:/opt/jboss/keycloak/standalone/configuration/standalone-ha.xml && \
    rm /opt/jboss/keycloak/changeHostname.xsl /opt/jboss/keycloak/disableTemplateCaching.xsl
