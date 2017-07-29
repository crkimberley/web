// jQuery function to load an XML file
function getXML(myUrl) {
    var xhr = $.ajax({
        url:      myUrl,
        datatype: "xml",
        async:    false
    });
    return xhr.responseXML;
}

function retrieveFilms() {
    // Clear resultArea for each new query
    $('#resultArea').empty();

    var xmlDoc = getXML("remakes.xml");
    var stylesheet = getXML("remakes.xsl");

    // Get entered values from the form
    var title = document.getElementById("remakeTitle").value;
    var year = document.getElementById("remakeYear").value;
    var fraction = document.getElementById('closenessFraction').value;
    // Input validation - checking that the entered year and fraction values are numbers
    // and that the fraction value is between 0 and 1
    // The form is reset if the values are not valid
    if (isNaN(year) || isNaN(fraction)) {
        window.alert("The year and fraction values have to be numbers - all values will be reset");
        document.getElementById("selectionForm").reset();
    } else if (parseFloat(fraction) < 0.0 || parseFloat(fraction) > 1.0) {
        window.alert("The fraction value has to be between 0.0 and 1.0 - all values will be reset");
        document.getElementById("selectionForm").reset();
    }

    // Strings are assembled for the title, year and fraction predicates, combining the entered values and selected operators
    var titleOperator = $('input[type=radio][name=title]:checked').val();
    var titlePredicate = !title ? "*" : titleOperator === "equals" ?
            "rtitle = '" + title + "'" : "contains(rtitle, '" + title + "')";

    var yearOperator = $('input[type=radio][name=year]:checked').val();
    var yearOp = yearOperator === "equals" ? "=" :
        (yearOperator === "lessThan" ? "<" : ">");
    var yearPredicate = year ? "ryear " + yearOp + " '" + year + "'" : "*";

    var fractionOperator = $('input[type=radio][name=fraction]:checked').val();
    var fractionOp = fractionOperator === "equals" ? "=" :
        (fractionOperator === "lessThan" ? "<" : ">");
    var fractionPredicate = fraction ?
        "fraction " + fractionOp + " '" + fraction + "'" : "*";

    // A string for the sameTitle predicate when remake title = original title
    var sameTitle = $('input[type=checkbox][name=same]:checked').val();
    var sameTitlePredicate = sameTitle === "same" ? "rtitle = stitle" : "*";

    // All predicates combined into one string
    var selection = "remake[" + titlePredicate + "][" + yearPredicate + "][" +
        fractionPredicate + "][" + sameTitlePredicate + "]";

    // Selection of the way to sort the results
    var sortBy = $('input[type=radio][name=sortBy]:checked').val();

    // Modifying the XSL stylesheet with the entered values and selections
    $(stylesheet).find("xsl\\:for-each, for-each").attr("select", selection);
    $(stylesheet).find("xsl\\:sort, sort").attr("select", sortBy);

    // The modified stylesheet and remakes file are processed
    // with the results appearing on the HTML page
    if (typeof (XSLTProcessor) != "undefined") {
        var processor = new XSLTProcessor();
        processor.importStylesheet(stylesheet);
        var result = processor.transformToFragment(xmlDoc, document);
        document.getElementById("resultArea").appendChild(result);
    } else
        window.alert("Your browser does not support the XSLTProcessor object");
}