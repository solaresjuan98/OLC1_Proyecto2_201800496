
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
            sintaxError = true;
            this.Match();
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
        console.log("LISTP");
        console.log(tokenActual.type);

        if (tokenActual.type === 'static') {

            this.MAINP();
        }
        else if (tokenActual.type === 'class') {
            //call to class method
            this.CLASS();
        }
        else if (tokenActual.type === 'interface') {
            this.INTERFACE();

        }
        else if (tokenActual.type === 'int' || tokenActual.type === 'String' || tokenActual.type === 'boolean' || tokenActual.type === 'char' || tokenActual.type === 'void') {
            this.FUNCTION();
        }
        else {
            //error
            console.log("Error with " + tokenActual.type);
            sintaxError = true;
            this.Match();
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
            sintaxError = true;
            this.Match();
        }
    }

    INTERFACE() {
        this.Interface();
    }

    FUNCTION() {
        this.TYPE();
        this.Identifier();
        this.PARAMETERS();
        //this.Left_brace();
    }

    PARAMETERS() {

        if (tokenActual.type === 'Left parenthesis') {

            this.Match();
            this.LIST_ID(); // one or + parameters
        }
        else {
            console.log("Left parethesis was expected intead of " + tokenActual.value);
        }
    }

    LIST_ID() {

        if (tokenActual.type === 'int' || tokenActual.type === 'String' || tokenActual.type === 'boolean' || tokenActual.type === 'char') {

            this.TYPE();
            this.Identifier();
            //this.Comma();
            this.LIST_ID();
        }
        else if (tokenActual.type === 'Right parenthesis') {
            this.Right_parenthesis();
            //this.
        }
        else{

            console.log("Error with " +tokenActual.type);
        }


    }

    INSTRUCTIONS() {

        console.log("INSTRUCTIONS");
        console.log(tokenActual.value);
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
            sintaxError = true;
            this.Match();

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
            sintaxError = true;
            this.Match();
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
            sintaxError = true;
            this.Match();
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
            sintaxError = true;
            this.Match();

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
            sintaxError = true;
            this.Match();

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
            sintaxError = true;
            this.Match();
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
            sintaxError = true;
            this.Match();

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
            sintaxError = true;
            this.Match();
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
            sintaxError = true;
            this.Match();
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
            sintaxError = true;
            this.Match();

        }
    }
    // Only for main method
    Left_brace_() {
        if (tokenActual.type === 'Left brace') {

            //console.log("correcto");
            this.Match();
            this.INSTRUCTIONS();
        }
        else {
            console.log("'{' was expected but " + tokenActual.type);
            sintaxError = true;
            this.Match();
        }
    }

    Identifier() {

        if (tokenActual.type === 'Identifier') {

            this.Match();
        }
        else {
            console.log('An Identifier was expecter, but ' + tokenActual.type);
            sintaxError = true;
            this.Match();
        }
    }

    // For the rest of the methods 

    Left_brace() {
        if (tokenActual.type === 'Left brace') {

            this.Match();
            this.INSTRUCTIONS();
        }
        else {
            console.log("'{' was expected, but " + tokenActual.type);
            sintaxError = true;
        }
    }

    Right_brace() {
        if (tokenActual.type === 'Right brace') {

            this.Match();
            this.LIST();
        }
        else {
            console.log("'}' was expected, but " + tokenActual.type);
            sintaxError = true;
        }
    }

    Interface() {
        if (tokenActual.type === 'interface') {

            this.Match();
            this.Identifier();
        }
        else {
            console.log("'interface' was expected, but " + tokenActual.type);
            sintaxError = true;
            this.Match();
        }

    }

    // for parameters
    Left_parenthesis() {

        if(tokenActual.type === 'Left parenthesis') {
            this.Match();
        }
        else {
            console.log("'(' was expected instead " +tokenActual.value);
            sintaxError = true;
            this.Match();
        }
    }

    Right_parenthesis() {
        if(tokenActual.type === 'Right parenthesis') {
            this.Match();
        }
        else {
            console.log("')' was expected instead " +tokenActual.value);
            sintaxError = true;
            this.Match();
        }
    }

    Comma() { 
        if(tokenActual.type === 'comma') {
            this.Match();
        }
        else {
            console.log("',' was expected instead " +tokenActual.value);
            sintaxError = true;
            this.Match();
        }
    }




    // Data types
    TYPE() {

        if (tokenActual.type === 'int' || tokenActual.type === 'String' || tokenActual.type === 'boolean' || tokenActual.type === 'char' || tokenActual.type === 'void') {
            this.Match();
        }
        else {
            console.log("A data type was expected instead of " + tokenActual.type);
            sintaxError = true;
            this.Match();
        }

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
        console.log(sintaxError);
        if (sintaxError) {

            while (tokenActual.type !== 'Semicolon' || tokenActual.type !== 'Left brace') {


                index++;
                tokenActual = this.tokenList[index];

                if (tokenActual.type === 'Semicolon') {

                    console.log("';' found");
                    sintaxError = false;
                    this.INSTRUCTIONS();
                    break;
                }
                else if (tokenActual.type === 'Left brace') {

                    console.log("'{' found ");
                    sintaxError = false;
                    index++;
                    tokenActual = this.tokenList[index];
                    this.INSTRUCTIONS();
                    break;
                }
                /*else {
                    index--;
                    console.log(tokenActual.type);
                    console.log(":v");
                    this.INSTRUCTIONS();
                    break;
                }*/
            }

        } else {
            index++;
            tokenActual = this.tokenList[index];
        }



    }

}
