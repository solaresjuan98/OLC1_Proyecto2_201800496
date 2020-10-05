
var Token = require('./Token');


var tokenActual;
var index;
var sintaxError = false;

module.exports = class Parser {

    constructor(tokenList) {
        this.tokenList = tokenList;

        var row = 1;
        var column = 1;
        //this.value = value;
        

    }

    getTokens() {
        this.tokenList.forEach(element =>
            console.log("type: " + element.type, " --- value: " + element.value)
        )
    }

    parse() {

        index = 0;
        tokenActual = this.tokenList[index];
        this.S();
    }


    /*
        NON-TERMINAL SYMBOLS
    */

    S() {
        // S -> LIST
        //this.MAINP();//MAINP -> main production
        this.LIST();
    }

    LIST() {
        /*
            LIST -> public LISTP
                  | epsilon
                   
        */

        if (tokenActual.type === 'public') {
            this.Public();
        }
        else {
            console.log('Error with ' + tokenActual.type);
            // Nothing to analize
        }

    }

    LISTP() {
        /*
            LISTP -> MAIN
                  | CLASS
                  | INTERFACE
                  | FUNCTION
                  | METHOD
                   
        */

        console.log(tokenActual.type);

        if (tokenActual.type === 'static') {

            this.MAINP();
        }
        else if (tokenActual.type === 'class') {
            //call to class method
            this.CLASS();
        }
        else {
            //error
            console.log("Error with " + tokenActual.type);
        }


    }

    MAINP() {

        // Call to the Terminal symbols methods
        this.Static();
    }

    CLASS() {
        /*
            CLASS -> CLASS id { INSTRUCTIONS } LISTP
        */
        if (tokenActual.type === 'class') {
            this.Match();
            this.Identifier();
            this.Left_brace();
            //INSTRUCTIONS();
            //Right_brace();
        }
        else {
            console.log('class was expected, but ' + tokenActual.type);
        }
    }

    INSTRUCTIONS() {


    }

    /*
        TERMINAL SYMBOLS
    */

    Public() {

        if (tokenActual.type === 'public') {

            //console.log("correcto");
            this.Match();
            this.LISTP();
        }
        else {
            console.log("public was expected but " + tokenActual.type);

        }
    }

    Static() {
        if (tokenActual.type === 'static') {

            //console.log("correcto");
            this.Match();
            this.Void();
        }
        else {
            console.log("static was expected but " + tokenActual.type);

        }
    }

    Void() {
        if (tokenActual.type === 'void') {

            //console.log("correcto");
            this.Match();
            this.Main();
        }
        else {
            console.log("void was expected but " + tokenActual.type);

        }
    }

    Main() {
        if (tokenActual.type === 'main') {

            //console.log("correcto");
            this.Match();
            this.Left_p_();
        }
        else {
            console.log("main was expected but " + tokenActual.type);

        }
    }

    Left_p_() {
        if (tokenActual.type === 'Left parenthesis') {

            //console.log("correcto");
            this.Match();
            this.String_p();
        }
        else {
            console.log("'(' was expected but " + tokenActual.type);

        }
    }

    String_p() {
        if (tokenActual.type === 'String') {

            //console.log("correcto");
            this.Match();
            this.Left_b_();
        }
        else {
            console.log("String was expected but " + tokenActual.type);

        }
    }

    Left_b_() {
        if (tokenActual.type === 'Left bracket') {

            //console.log("correcto");
            this.Match();
            this.Right_b_();
        }
        else {
            console.log("'[' was expected but " + tokenActual.type);

        }
    }

    Right_b_() {
        if (tokenActual.type === 'Right bracket') {

            //console.log("correcto");
            this.Match();
            this.Args();
        }
        else {
            console.log("']' was expected but " + tokenActual.type);

        }
    }

    Args() {

        if (tokenActual.type === 'args') {

            //console.log("correcto");
            this.Match();
            this.Right_p_();
        }
        else {
            console.log("args was expected but " + tokenActual.type);

        }
    }

    Right_p_() {
        if (tokenActual.type === 'Right parenthesis') {

            //console.log("correcto");
            this.Match();
            this.Left_brace_();
        }
        else {
            console.log("')' was expected but " + tokenActual.type);

        }
    }
    // Only for main method
    Left_brace_() {
        if (tokenActual.type === 'Left brace') {

            //console.log("correcto");
            this.Match();
        }
        else {
            console.log("'{' was expected but " + tokenActual.type);
        }
    }

    Identifier() {

        if (tokenActual.type === 'Identifier') {

            this.Match();
        }
        else {
            console.log('An Identifier was expecter, but ' + tokenActual.type);
        }
    }

    // For the rest of the methods 

    Left_brace() {
        if (tokenActual.type === 'Left brace') {

            this.Match();
        }
        else {
            console.log("'{' was expected, but " + tokenActual.type);
        }
    }

    Right_brace() {
        if (tokenActual.type === 'Right brace') {

            this.Match();
        }
        else {
            console.log("'}' was expected, but " + tokenActual.type);
        }
    }



    // Data types
    TYPE() {


    }

    /*
    ***************
    */

    Match() {
        /*
            There are two cases:
            1. Panic mode: (Error = True) [while tokenActual !== ';' || tokenActual !== '{']
            2. Change the index (Error = False)
        */
        index++;
        tokenActual = this.tokenList[index];
    }

}
