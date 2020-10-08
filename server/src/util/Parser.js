
var Token = require('./Token');


var tokenActual;
var index;
var sintaxError = false;

module.exports = class Parser {

    constructor(tokenList) {
        this.tokenList = tokenList;

        var row = 1;
        var column = 1;
        sintaxError = false;
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
        console.log("FUNCTION");
        console.log(tokenActual.value);
        this.TYPE();
        this.Identifier();
        this.PARAMETERS();
        //this.Left_brace();
        this.INSTRUCTIONS();
    }

    PARAMETERS() {
        console.log("PARAMETERS");
        console.log(tokenActual.value);
        // PARAMETERS -> ( LIST_P 
        if (tokenActual.type === 'Left parenthesis') {

            this.Match();
            this.LIST_P(); // one or + parameters
        }
        else {
            console.log("Left parethesis was expected intead of " + tokenActual.value);
            sintaxError = true;
            this.Match();
        }
    }

    LIST_P() {

        /*
            LIST_P -> TYPE id LISTV
                   | )
        */
        console.log("LIST_P");
        console.log(tokenActual.value);
        if (tokenActual.type === 'int' || tokenActual.type === 'String' || tokenActual.type === 'boolean' || tokenActual.type === 'char') {

            this.TYPE();
            this.Identifier();
            this.LISTV();
        }
        else if (tokenActual.type === 'Right parenthesis') {
            this.Right_parenthesis();
            this.Left_brace();
        }
        else {

            console.log("Error with " + tokenActual.value);
            sintaxError = true;
            this.Match();
        }



    }

    LISTV() {

        /*
            LISTV -> , TYPE id LIST_P
                   | )
        */
        console.log("LISTV");
        console.log(tokenActual.value);
        if (tokenActual.type === 'comma') {

            this.Comma();
            this.TYPE();
            this.Identifier();
            this.LISTV();

        }
        else if (tokenActual.type === 'Right parenthesis') {
            this.Right_parenthesis();
            this.Left_brace();
            //this.INSTRUCTIONS();
        }
        /*else {

            console.log("Error with " + tokenActual.value);
            sintaxError = true;
            this.Match();
        }*/




        /*if (tokenActual.type === 'int' || tokenActual.type === 'String' || tokenActual.type === 'boolean' || tokenActual.type === 'char') {

            this.TYPE();
            this.Identifier();
            //this.Comma();
        }*/



    }

    INSTRUCTIONS() {

        console.log("INSTRUCTIONS");
        console.log(sintaxError, "-");
        console.log(tokenActual.value);
        //this.Right_brace();

        /**
         * INSTRUCTIONS -> DECLARATION INSTRUCTIONS_P
         *               | ASIGNATION INSTRUCTIONS_P 
         * 
        */
        if (tokenActual.type === 'int' || tokenActual.type === 'String' || tokenActual.type === 'char' || tokenActual.type === 'boolean' || tokenActual.type === 'double') {
            this.DECLARATION();
            //this.INSTRUCTIONS_P();
        }

        //this.Match();
    }

    INSTRUCTIONS_P() {
        console.log("INSTRUCTION_P");
        console.log(sintaxError, "-");
        console.log(tokenActual.value);
    }

    DECLARATION() {

        /**
         * DECLARATION -> TYPE id DECLARATION_P
         *              | 
        */
        console.log('DECLARATION');

        this.TYPE();
        this.Identifier();
        this.DECLARATION_P();



    }

    DECLARATION_P() {
        /*
            DECLARATION_P -> = VALUE VAR_LIST
                           | VAR_LIST
        */
        console.log('DECLARATION_P');
        console.log(tokenActual.value);

        if (tokenActual.type === 'assignation') {
            this.Assignation();
            this.VALUE();
            this.VAR_LIST();
        }
        else {
            this.VAR_LIST();
        }


    }

    VAR_LIST() {

        /*(Change)
            VAR_LIST -> , VAR_LIST_2
                      | ; INSTRUCTIONS
        */

        /*
            VAR_LIST -> , TYPE id VAR_LIST_P
                      | , id VAR_LIST_P
                      | ;
        */
        console.log('VAR_LIST -- ', tokenActual.value);

        if (tokenActual.type === 'comma') {
            this.Comma();
            this.VAR_LIST_2();

        } else if (tokenActual.type === 'Semicolon') {
            this.Semicolon();
            this.INSTRUCTIONS();
        }
        else {
            console.log("Error with " + tokenActual.value);
            sintaxError = true;
            this.Match();
        }

        /* (formerly)
        if (tokenActual.type === 'comma') {
            this.Comma();
            this.TYPE();
            this.Identifier();
            this.VAR_LIST_P();

        } else if (tokenActual.type === 'Semicolon') {
            //this.Match();
            this.Semicolon();
            this.INSTRUCTIONS();
        }
        else{
            console.log("Error with "+tokenActual.value);
            sintaxError = true;
            this.Match();
        }*/

    }

    VAR_LIST_2() {

        /**
         * VAR_LIST_2 -> TYPE id VAR_LIST_P 
         *             | id VAR_LIST_P
         * 
        */
        if (tokenActual.type === 'int' || tokenActual.type === 'String' || tokenActual.type === 'double' ||tokenActual.type === 'boolean' || tokenActual.type === 'char' || tokenActual.type === 'void') {
            this.TYPE();
            this.Identifier();
            this.VAR_LIST_P();
        }
        else if (tokenActual.type === 'Identifier') {
            this.Identifier();
            this.VAR_LIST_P();
        }
        else {
            console.log("Error with " + tokenActual.value);
            sintaxError = true;
            this.Match();
        }

    }


    VAR_LIST_P() {
        /*
            VAR_LIST_P -> = VALUE VAR_LIST
                       | VAR_LIST
        */
        console.log('VAR_LIST_P -- ', tokenActual.value, tokenActual.type);
        if (tokenActual.type === 'assignation') {
            this.Assignation();
            this.VALUE();
            this.VAR_LIST();
        }
        else {
            console.log('f');
            this.VAR_LIST();
        }

    }

    VALUE() {
        /*
            VALUE -> EXPRESSION
                   | str
                   | true
                   | false
        */

        if (tokenActual.type === 'number' || tokenActual.type === 'text string' || tokenActual.type === 'true' || tokenActual.type === 'false') {

            this.Match();

        } else {

            console.log("Value was expected instead " + tokenActual.value);
            sintaxError = true;
            this.Match();
        }

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

        //console.log("Identifier")
        console.log(tokenActual.value, 'Identifier');
        if (tokenActual.type === 'Identifier') {

            this.Match();
        }
        else {
            console.log('An Identifier was expected instead of ' + tokenActual.type);
            sintaxError = true;
            this.Match();
        }
    }

    Assignation() {
        if (tokenActual.type === 'assignation') {

            this.Match();
        }
        else {
            console.log("'=' was expected instead of " + tokenActual.type);
            sintaxError = true;
            this.Match();
        }
    }

    Number() {
        if (tokenActual.type === 'number') {

            this.Match();
        }
        else {
            console.log("number was expected instead of " + tokenActual.type);
            sintaxError = true;
            this.Match();
        }
    }

    // For the rest of the methods 

    Left_brace() {
        if (tokenActual.type === 'Left brace') {

            this.Match();
            //this.INSTRUCTIONS();
        }
        else {
            console.log("'{' was expected instead of " + tokenActual.type);
            sintaxError = true;
            this.Match();
        }
    }

    Semicolon() {
        if (tokenActual.type === 'Semicolon') {

            this.Match();
        }
        else {
            console.log("';' was expected instead of " + tokenActual.type);
            sintaxError = true;
            this.Match();
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

        if (tokenActual.type === 'Left parenthesis') {
            this.Match();
        }
        else {
            console.log("'(' was expected instead " + tokenActual.value);
            sintaxError = true;
            this.Match();
        }
    }

    Right_parenthesis() {
        if (tokenActual.type === 'Right parenthesis') {
            this.Match();
        }
        else {
            console.log("')' was expected instead " + tokenActual.value);
            sintaxError = true;
            this.Match();
        }
    }

    Comma() {
        if (tokenActual.type === 'comma') {
            this.Match();
        }
        else {
            console.log("',' was expected instead " + tokenActual.value);
            sintaxError = true;
            this.Match();
        }
    }


    // Data types
    TYPE() {
        console.log(tokenActual.value);
        if (tokenActual.type === 'int' || tokenActual.type === 'String' || tokenActual.type === 'boolean' || tokenActual.type === 'char' || tokenActual.type === 'double' ||tokenActual.type === 'void') {
            this.Match();
        }
        else {
            console.log("A data type was expected instead of " + tokenActual.value);
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
        //console.log(sintaxError);
        if (sintaxError) {

            while (tokenActual.type !== 'Semicolon' && tokenActual.type !== undefined) {

                console.log(tokenActual.value);
                index++;
                tokenActual = this.tokenList[index];

                if (tokenActual.type === 'Semicolon') {

                    console.log("';' found");
                    sintaxError = false;
                    index++;
                    tokenActual = this.tokenList[index];
                    this.INSTRUCTIONS();
                    break;
                }


                /*else if (tokenActual.type === 'Left brace') {

                    console.log("'{' found ");
                    sintaxError = false;
                    index++;
                    tokenActual = this.tokenList[index];
                    this.INSTRUCTIONS();
                    break;
                }*/
                else {
                    //console.log('fdf');
                    //index--;
                    //sintaxError = false;
                    //this.INSTRUCTIONS();
                    //break;

                }


            }

            if (tokenActual.type === undefined) {
                console.log('f');
            }

        } else {
            index++;
            tokenActual = this.tokenList[index];
            //sintaxError = false;
        }

        sintaxError = false;




    }

}
