<!--XSL stylesheet transforms the XML data into an HTML table with a header row-->
<!--which will then be modified by the javascript code - responding to user input-->
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
    <xsl:template match="remakes">
                <table align="center">
                    <tr>
                        <th>Remake</th>
                        <th>Year</th>
                        <th>Original</th>
                        <th>Year</th>
                        <th>Fraction</th>
                    </tr>
                    <xsl:for-each select="remake">
                        <xsl:sort select="rtitle"/>
                        <tr>
                            <td><xsl:value-of select="rtitle"/></td>
                            <td width="10%"><xsl:value-of select="ryear"/></td>
                            <td><xsl:value-of select="stitle"/></td>
                            <td width="10%"><xsl:value-of select="syear"/></td>
                            <td width="5%"><xsl:value-of select="fraction"/></td>
                        </tr>
                    </xsl:for-each>
                </table>
    </xsl:template>
</xsl:stylesheet>