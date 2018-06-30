<?xml version="1.0" encoding="UTF-8"?>

<xsl:stylesheet version="2.0"
                xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
		xmlns="urn:jboss:domain:keycloak-server:1.1">

    <xsl:output method="xml" indent="yes"/>

    <xsl:template match="//subsystem/theme">
        <theme>
            <staticMaxAge>2592000</staticMaxAge>
	    <cacheThemes>false</cacheThemes>
	    <cacheTemplates>false</cacheTemplates>
	    <dir>${jboss.home.dir}/themes</dir>
	</theme>
    </xsl:template>

    <xsl:template match="@*|node()">
        <xsl:copy>
            <xsl:apply-templates select="@*|node()"/>
        </xsl:copy>
    </xsl:template>
</xsl:stylesheet>

