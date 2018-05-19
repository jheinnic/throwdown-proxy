<?xml version="1.0" encoding="UTF-8"?>

<xsl:stylesheet version="2.0"
                xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
                xmlns:srv="urn:jboss:domain:5.0"
                xmlns:ut="urn:jboss:domain:undertow:4.0">

    <xsl:output method="xml" indent="yes"/>

    <xsl:template match="//srv:security-realm[@name='ApplicationRealm']/srv:server-identities/srv:ssl/srv:keystore">
        <srv:keystore path="application.keystore" relative-to="jboss.server.config.dir"
                      keystore-password="portfolio" alias="portfolio" key-password="portfolio"
                      generate-self-signed-certificate-host="portfolio.dev.jchein.name"/>
    </xsl:template>

    <xsl:template match="//ut:subsystem/ut:server[@name='default-server']/ut:host">
        <ut:host name="default-host" alias="portfolio.dev.jchein.name">
            <ut:location name="/" handler="welcome-content"/>
            <ut:http-invoker security-realm="ApplicationRealm"/>
        </ut:host>
    </xsl:template>

    <xsl:template match="@*|node()">
        <xsl:copy>
            <xsl:apply-templates select="@*|node()"/>
        </xsl:copy>
    </xsl:template>

</xsl:stylesheet>

