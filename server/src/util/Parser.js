
var Token = require('./Token');
var fs = require('fs');
const { Console } = require('console');

var tokenActual;
var index;
var sintaxError = false;
var tab = 0;
var python = "";
var sintaxErrorList = [];
var consoleInformation = "";

module.exports = class Parser {

    constructor(tokenList) {
        this.tokenList = tokenList;

        var row = 1;
        var column = 1;
        sintaxErrorList = [];
        sintaxError = false;
        consoleInformation = "";
        python = "";
        tab = 0;
        //this.value = value;


    }

    getTokens() {
        this.tokenList.forEach(element =>
            console.log("type: " + element.type, " --- value: " + element.value + " --- row: " + element.row + " --- column " + element.column)
        )
    }

    returnTokenList() {
        return this.tokenList;
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

        console.log("LIST -> " + tokenActual.value);
        if (tokenActual.type === 'public') {
            this.Public();
        }
        else if (tokenActual.type === 'int' || tokenActual.type === 'String' || tokenActual.type === 'char' || tokenActual.type === 'boolean' || tokenActual.type === 'double') {
            this.DECLARATION();
            this.LIST();
            //this.INSTRUCTIONS_P();
        }
        else if (tokenActual.type === 'single line commentary') {
            this.SL_Comment();
            this.LIST();
        }
        else if (tokenActual.type === 'multiline commentary') {
            this.ML_Comment();
            this.LIST();
        }
        else if (tokenActual.type == 'eof') {
            console.log('END OF FILE :v');
        }
        else {
            console.log('Error with ' + tokenActual.type);
            sintaxError = true; this.addSintaxError(tokenActual);
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
        console.log("LISTP -->" + tokenActual.value);


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
            sintaxError = true; this.addSintaxError(tokenActual);
            this.Match();
        }


    }

    MAINP() {

        /*
            MAINP -> static void main (String [] args) { INSTRUCTIONS }
        */
        if (tokenActual.type === 'static') {

            // translate
            python += this.GenTab(tab) + "def ";
            this.Static();
            this.Void();
            this.Main();
            python += "Main";
            this.Left_parenthesis();
            this.String_p();
            this.Left_b_();
            this.Right_b_();
            this.Args();
            this.Right_parenthesis();
            python += ":\n";
            this.Left_brace();
            this.INSTRUCTIONS();
            this.Right_brace();
            //this.S();
            //thid.INSTRUCTIONS();
        }
        else {
            console.log("Error with " + tokenActual.value);
        }


        // Call to the Terminal symbols methods
        //this.Static();
    }

    CLASS() {
        /*
            CLASS -> class id { INSTRUCTIONS } LISTP
        */
        /*
            update 
        
        */
        console.log("CLASS -- " + tokenActual.value);
        if (tokenActual.type === 'class') {
            python += "class ";
            this.Match();
            this.Identifier();
            python += ":\n";
            this.Left_brace();
            this.DEF_CLASS();
            this.Right_brace();
            this.S();
        }
        else {
            console.log('class was expected instead of ' + tokenActual.type);
            sintaxError = true; this.addSintaxError(tokenActual);
            this.Match();
        }
    }


    DEF_CLASS() {
        // only inside a class
        /*
            DEF_CLASS -> TYPE DECLARATION DEF_CLASS
                       | public METHOD
        */
        console.log('DEF CLASS -- ' + tokenActual.value)
        if (tokenActual.type === 'int' || tokenActual.type === 'String' || tokenActual.type === 'char' || tokenActual.type === 'boolean' || tokenActual.type === 'double') {
            this.DECLARATION();
            this.DEF_CLASS();
        } else if (tokenActual.type == 'public') {

            this.Public_m();
            this.METHOD();
            this.DEF_CLASS();
        } else if (tokenActual.type === 'single line commentary') {

            this.SL_Comment();
            this.DEF_CLASS();
        } else if (tokenActual.type === 'multiline commentary ') {
            this.ML_Comment();
            this.DEF_CLASS();
        }
        /*else if (tokenActual.type === 'return') {
            this.Return();
            this.RETURN_STATEMENT();
            this.Semicolon();
            //this.DEF_CLASS();
        }*/
        else {
            //console.log("weno -> " + tokenActual.value);
            //console.log("bloque vacio");
        }


    }

    METHOD() {

        /*
            METHOD -> TYPE id PAREMETERS
        */
        console.log("METHOD -> " + tokenActual.value);
        console.log();
        // if the method is of any type

        if (tokenActual.value === 'int' || tokenActual.value === 'String' || tokenActual.value === 'char'
            || tokenActual.value === 'double' || tokenActual.value === 'void') {

            this.TYPE();
            python += this.GenTab(tab) + "def ";
            this.Identifier();
            this.PARAMETERS();
            this.INSTRUCTIONS();

        } else if (tokenActual.value === 'static') {
            this.MAINP();
        } else {
            console.log("[type] or [static] was expected intead of " + tokenActual.value);
            sintaxError = true;
            this.addSintaxError(tokenActual);
            this.Match();
        }



    }


    INTERFACE() {
        /*
            INTERFACE -> 
        
        */

        if (tokenActual.type === 'interface') {

            this.Interface();
            this.Identifier();
            python += ":\n";
            this.Left_brace();
            this.LIST_DECLARATIONS();
            this.Right_brace();
            this.S();

        } else {
            console.log("[interface] was expected instead of " + tokenActual.value);
            sintaxError = true;
            this.addSintaxError(tokenActual);
            this.Match();
        }

        //this.Interface();
    }

    LIST_DECLARATIONS() {
        /*
            LIST_DECLARATIONS -> public TYPE id LIST_CMETHOD_P
        */

        console.log("LIST_DECLARATIONS --> " + tokenActual.value);
        if (tokenActual.type === 'public') {
            this.Public_m();
            this.TYPE();
            python += this.GenTab(tab);
            this.Identifier();
            this.LIST_PARAM();

        } else if (tokenActual.type === 'single line commentary') {
            this.SL_Comment();
            this.LIST_DECLARATIONS();
        }
        else if (tokenActual.type === 'multiline commentary') {
            this.ML_Comment();
            this.LIST_DECLARATIONS();
        }
        else {
            console.log("Error with " + tokenActual.value)
        }
    }

    LIST_DECLARATIONS_P() {
        /*
            LIST_DECLARATIONS_P -> public TYPE id PARAMETERS LIST_DECLARATIONS_P
        */
        console.log("LIST_DECLARATIONS_P --> " + tokenActual.value);
        if (tokenActual.type === 'public') {
            this.Public_m();
            this.TYPE();
            python += this.GenTab(tab);
            this.Identifier();
            this.LIST_PARAM();
            this.LIST_DECLARATIONS_P();
        }
        else if (tokenActual.type === 'single line commentary') {
            this.SL_Comment();
            this.LIST_DECLARATIONS_P();
        }
        else if (tokenActual.type === 'multiline commentary') {
            this.ML_Comment();
            this.LIST_DECLARATIONS_P();
        }

    }

    LIST_PARAM() {

        console.log("LIST_PARAM -- " + tokenActual.value);
        if (tokenActual.type === 'Left parenthesis') {
            this.Left_parenthesis();
            this.LIST_PARAM_2(); // one or + parameters
        }
        else {
            console.log("Left parethesis was expected intead of " + tokenActual.value);
            sintaxError = true; this.addSintaxError(tokenActual);
            this.Match();
        }

    }

    LIST_PARAM_2() {
        console.log("LIST_PARAM_2 -- " + tokenActual.value);
        if (tokenActual.type === 'int' || tokenActual.type === 'String' || tokenActual.type === 'boolean' || tokenActual.type === 'char') {

            this.TYPE();
            this.Identifier();
            this.LIST_PARAM_3();
        }
        else if (tokenActual.type === 'Right parenthesis') {
            this.Right_parenthesis();
            this.Semicolon();
            python += "\n";

            //this.S();//cambio aqui
        }
        else {

            console.log("Error with " + tokenActual.value);
            sintaxError = true; this.addSintaxError(tokenActual);
            this.Match();
        }
    }

    LIST_PARAM_3() {
        console.log("LIST_PARAM_3 -- " + tokenActual.value);
        if (tokenActual.type === 'comma') {

            this.Comma();
            this.TYPE();
            this.Identifier();
            this.LIST_PARAM_3();

        }
        else if (tokenActual.type === 'Right parenthesis') {
            this.Right_parenthesis();
            this.Semicolon();
            this.LIST_DECLARATIONS_P();
            /*this.Left_brace();
            this.INSTRUCTIONS();
            this.Right_brace();*/
            //this.S();
        }
    }

    FUNCTION() {

        /*
            FUNCTION -> TYPE id PAREMETERS S
        */
        console.log("FUNCTION");
        console.log(tokenActual.value);
        this.TYPE();
        python += this.GenTab(tab) + "def ";
        this.Identifier();
        this.PARAMETERS();
        this.S();
    }



    PARAMETERS() {
        console.log("PARAMETERS");
        console.log(tokenActual.value);
        // PARAMETERS -> ( LIST_P 
        if (tokenActual.type === 'Left parenthesis') {
            this.Left_parenthesis();
            this.LIST_P(); // one or + parameters
        }
        else {
            console.log("Left parethesis was expected intead of " + tokenActual.value);
            sintaxError = true; this.addSintaxError(tokenActual);
            this.Match();
        }
    }

    LIST_P() {

        /*
            LIST_P -> TYPE id LISTV
                   | ) { INSTRUCTIONS }
        */
        console.log("LIST_P -- " + tokenActual.value);
        if (tokenActual.type === 'int' || tokenActual.type === 'String' || tokenActual.type === 'boolean' || tokenActual.type === 'char') {

            this.TYPE();
            this.Identifier();
            this.LISTV();
        }
        else if (tokenActual.type === 'Right parenthesis') {
            console.log("EMPTY :V");
            this.Right_parenthesis();
            python += ":\n";
            this.Left_brace();
            this.INSTRUCTIONS();
            this.Right_brace();
        }
        else {

            //console.log("without parameters");
            console.log("Error with " + tokenActual.value);
            sintaxError = true; this.addSintaxError(tokenActual);
            this.Match();
        }



    }

    LISTV() {

        /*
            LISTV -> , TYPE id LISTV
                   | ) { INSTRUCTIONS }
        */
        console.log("LISTV -- " + tokenActual.value);
        if (tokenActual.type === 'comma') {

            this.Comma();
            this.TYPE();
            this.Identifier();
            this.LISTV();

        }
        else if (tokenActual.type === 'Right parenthesis') {
            this.Right_parenthesis();
            //translate
            python += ":\n";
            this.Left_brace();
            this.INSTRUCTIONS();
            this.Right_brace();
            //this.S();
        }

    }

    INSTRUCTIONS() {

        console.log("INSTRUCTIONS --- " + tokenActual.value);
        //this.Right_brace();

        /**
         * INSTRUCTIONS -> DECLARATION INSTRUCTIONS_P
         *               | ASIGNATION INSTRUCTIONS_P 
         *               | PRINT INSTRUCTIONS_P
         * 
        */
        if (tokenActual.type === 'int' || tokenActual.type === 'String' || tokenActual.type === 'char' || tokenActual.type === 'boolean' || tokenActual.type === 'double') {
            this.DECLARATION();
            //this.INSTRUCTIONS_P();
        }
        else if (tokenActual.type === 'Identifier') {
            python += this.GenTab(tab);
            this.Identifier();
            this.INSTRUCTIONS_P();
            //this.ASSIGNATION();

        }
        else if (tokenActual.type === 'system') {
            this.PRINT();
            //this.INSTRUCTIONS_P();
        }
        else if (tokenActual.type === 'if') {
            this.IF();
        }
        else if (tokenActual.type === 'do') {
            this.DO();
        }
        else if (tokenActual.type === 'while') {
            this.WHILE();
        }
        else if (tokenActual.type === 'for') {
            this.FOR();
        }
        else if (tokenActual.type === 'return') {

            console.log("Leyedo un return");
            this.Return();
            this.RETURN_STATEMENT();
            this.Semicolon();
        }
        else if (tokenActual.type === 'break') {
            this.Break();
            this.Semicolon();
        }
        else if (tokenActual.type === 'continue') {
            this.Continue();
            this.Semicolon();
        }
        else if (tokenActual.type === 'single line commentary') {
            this.SL_Comment();
            this.INSTRUCTIONS();
        }
        else if (tokenActual.type === 'multiline commentary') {
            this.ML_Comment();
            this.INSTRUCTIONS();
        }
        else if (tokenActual.type === 'eof') {

            console.log('End of file');
        }/* else if(tokenActual.type === 'Right brace'){
            this.Right_brace();

            console.log("DD:");
        } */

    }

    INSTRUCTIONS_P() {

        /**
         * INSTRUCTIONS_P -> ( CALL_METHOD
         *                 | = ASSIGNATION
         * 
        */
        console.log('INSTRUCTIONS_P ' + tokenActual.type);

        if (tokenActual.type === 'Left parenthesis') {
            //console.log("Method");
            this.Left_parenthesis();
            this.CALL_METHOD();
            this.INSTRUCTIONS();
        }
        else if (tokenActual.type === 'assignation') {
            //this.Assignation();
            this.ASSIGNATION();
            this.INSTRUCTIONS();
        }
        else if (tokenActual.value === '+') {

            this.INC_OR_DEC();
            python += "+= 1";
            this.Semicolon();
            this.INSTRUCTIONS();
        }
        else if (tokenActual.value === '-') {

            this.INC_OR_DEC();
            python += "-= 1"
            this.Semicolon();
            this.INSTRUCTIONS();
        }

        else {
            console.log("Error with " + tokenActual.value);
            sintaxError = true; this.addSintaxError(tokenActual);
            this.Match();
        }

        /*console.log("INSTRUCTION_P");
        console.log(sintaxError, "-");
        console.log(tokenActual.value);*/
    }

    DECLARATION() {

        /**
         * DECLARATION -> TYPE id DECLARATION_P
         *              
        */
        console.log('DECLARATION -- ' + tokenActual.value);

        if (tokenActual.type === 'int' || tokenActual.type === 'String' || tokenActual.type === 'double' || tokenActual.type === 'boolean' || tokenActual.type === 'char' || tokenActual.type === 'void') {

            this.TYPE();
            python += this.GenTab(tab);
            this.Identifier();
            this.DECLARATION_P();
        }




    }

    ASSIGNATION() {
        /**
         * ASSIGNATION -> id = VALUE ;
         * 
        */
        console.log('ASIGNATION');
        //this.Identifier();
        this.Assignation();
        this.VALUE();
        this.Semicolon();
        this.INSTRUCTIONS();

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
        else if (tokenActual.type === 'comma') {
            this.VAR_LIST();
        }
        /*else {
            this.VAR_LIST();// IMPORTANTE TOMAR EN CUENTA
        }*/


    }

    VAR_LIST() {

        /*(Change)
            VAR_LIST -> , VAR_LIST_2
                      | ; INSTRUCTIONS
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
            this.addSintaxError(tokenActual);
            this.Match();
        }

    }

    VAR_LIST_2() {

        /**
         * VAR_LIST_2 -> TYPE id VAR_LIST_P 
         *             | id VAR_LIST_P
         * 
        */
        if (tokenActual.type === 'int' || tokenActual.type === 'String' || tokenActual.type === 'double' || tokenActual.type === 'boolean' || tokenActual.type === 'char' || tokenActual.type === 'void') {
            this.TYPE();
            this.Identifier();
            this.VAR_LIST_P();
        }
        else if (tokenActual.type === 'Identifier') {
            this.Identifier();
            this.VAR_LIST_P();
        }
        /*else if (tokenActual.type === 'text string') {
            this.Text_String();
            this.VAR_LIST_P();
        }*/

        else {
            console.log("Error with " + tokenActual.value);
            sintaxError = true; this.addSintaxError(tokenActual);
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
            //console.log('f');
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

        if (tokenActual.type === 'number' || tokenActual.type === 'Identifier' || tokenActual.type === 'Left parenthesis') {
            this.EXPR();
        }
        else if (tokenActual.type === 'text string') {
            python += tokenActual.value;
            this.Match();
        } else if (tokenActual.type === 'true') {
            this.True();
        } else if (tokenActual.type === 'false') {
            this.False();
        }
        else {

            console.log("Value was expected instead " + tokenActual.value);
            sintaxError = true; this.addSintaxError(tokenActual);
            this.Match();
        }

    }

    CALL_METHOD() {
        /*
            CALL_METHOD -> id  LIST_P_2
        */

        console.log('CALL_METHOD ' + tokenActual.value);
        this.VALUE_P();
        this.LIST_P_2();

    }

    LIST_P_2() {
        /*
            LIST_P_2 -> , VALUE_P LIST_P_3
                      | ) ;
        */
        console.log('LIST_P_2 -- ' + tokenActual.value);
        if (tokenActual.type === 'comma') {
            this.Comma();
            this.VALUE_P();
            this.LIST_P_3();
        }
        else if (tokenActual.type === 'Right parenthesis') {
            this.Right_parenthesis();
            this.Semicolon();
            //this.INSTRUCTIONS();
        }
        else {
            console.log('Error with ' + tokenActual.value);
            sintaxError = true; this.addSintaxError(tokenActual);
            this.Match();
        }
    }

    LIST_P_3() {
        /*
            LIST_P_3 -> , VALUE_P LIST_P_3
                      | ) ; 
        */

        if (tokenActual.type === 'comma') {
            this.Comma();
            this.VALUE_P();
            this.LIST_P_3();
        }
        else if (tokenActual.type === 'Right parenthesis') {
            this.Right_parenthesis();
            this.Semicolon();
            //this.INSTRUCTIONS();
        }
        else {
            console.log('Error with ' + tokenActual.value);
            sintaxError = true; this.addSintaxError(tokenActual);
            this.Match();
        }

    }

    VALUE_P() {

        console.log('VALUE_P -- ' + tokenActual.value);
        if (tokenActual.type === 'Identifier' || tokenActual.type === 'number' || tokenActual.type === 'true' || tokenActual.type === 'false' || tokenActual.type === 'text string') {
            //translate
            python += tokenActual.value;
            this.Match();
        }
        else {
            console.log("A parameter value was expected instead " + tokenActual.value);
            sintaxError = true; this.addSintaxError(tokenActual);
            this.Match();
        }
    }

    PRINT() {
        /*
            PRINT -> System.out. PRINT_P
        */
        console.log("PRINT -- " + tokenActual.value);
        if (tokenActual.type === 'system') {
            this.System();
            this.Point();
            this.Out();
            this.Point();
            this.PRINT_P();
        }
        else {
            console.log("System was expected instead " + tokenActual.value);
            sintaxError = true; this.addSintaxError(tokenActual);
            this.Match();
        }
    }

    PRINT_P() {
        /*
            PRINT_P -> println ( DATA ) ;
                     | print ( DATA ) ;
        */
        console.log('PRINT_P --' + tokenActual.type);
        //console.log(sintaxError);
        if (tokenActual.type === 'println') {

            this.Println();
            this.Left_parenthesis();
            this.DATA();
            this.Right_parenthesis();
            this.Semicolon();
            this.INSTRUCTIONS();
        }
        else if (tokenActual.type === 'print') {

            this.Print();
            this.Left_parenthesis();
            this.DATA();
            this.Right_parenthesis();
            this.Semicolon();
            this.INSTRUCTIONS();
        }
        else {
            console.log("Error with " + tokenActual.value);
            sintaxError = true; this.addSintaxError(tokenActual);
            this.Match();
        }

    }


    DATA() {
        /*
            DATA -> str
                  | EXPRESSION
                  |  id (expr)
        */
        console.log('DATA --' + tokenActual.type);
        if (tokenActual.type === 'text string') {
            this.Text_String();
            this.DATA_P();

        } else if (tokenActual.type === 'Identifier' || tokenActual.value === '('
            || tokenActual.type === 'number') {
            this.EXPR();
        }
        else if (tokenActual.type === 'true') {
            this.True();
        }
        else if (tokenActual.type === 'false') {
            this.False();
        }
        else {
            console.log("Error with -- " + tokenActual.value);
            sintaxError = true; this.addSintaxError(tokenActual);
            this.Match();
        }
    }


    DATA_P() {

        console.log("DATA_P ->" + tokenActual.value)
        if (tokenActual.type === 'plus') {
            this.Plus();
            this.DATA_P2();
        } else {
            //
        }
    }


    DATA_P2() {

        console.log("DATA_P2 ->" + tokenActual.value)

        if (tokenActual.type === 'Identifier') {

            this.Identifier();
            this.DATA_P();

        }
        else if (tokenActual.type === 'text string') {
            this.Text_String();
            this.DATA_P();
        }
        else if (tokenActual.type === 'true') {
            this.True();
            this.DATA_P();
        }
        else if (tokenActual.type === 'false') {
            this.False();
            this.DATA_P();
        } else {
            console.log('error with ' + tokenActual.value);
            sintaxError = true;
            this.addSintaxError(tokenActual);
            this.Match();
        }

    }


    DO() {
        /*
            do { INSTRUCTIONS } WHILE_1
        */
        if (tokenActual.type === 'do') {
            this.Do();
            this.Left_brace();
            this.INSTRUCTIONS();
            this.Right_brace();
            this.While_2();
            this.Left_parenthesis();
            this.EXPR();
            this.LOGIC();
            this.EXPR();
            this.Right_parenthesis();
            this.Semicolon();
            this.INSTRUCTIONS();

        }
        else {
            console.log('do was expexted instead ' + tokenActual.value);
            sintaxError = true; this.addSintaxError(tokenActual);
            this.Match();
        }

    }


    WHILE() {
        if (tokenActual.type === 'while') {
            this.While();
            this.Left_parenthesis();
            this.EXPR();
            this.CLAUSE();
            this.EXPR();
            this.Right_parenthesis();
            python += ":\n";
            this.Left_brace();
            this.INSTRUCTIONS();
            this.Right_brace();
            this.INSTRUCTIONS();

        }
        else {
            console.log('while was expexted instead ' + tokenActual.value);
            sintaxError = true; this.addSintaxError(tokenActual);
            this.Match();
        }
    }


    FOR() {
        /*
            FOR -> for( DEC_FOR ) }
        */

        if (tokenActual.type === 'for') {
            this.For();
            python += " ";
            this.Left_parenthesis_f();
            this.DEC_FOR();
            this.Right_parenthesis_f();
            this.Left_brace();
            this.INSTRUCTIONS();
            this.Right_brace();
            this.INSTRUCTIONS();

        }
        else {
            console.log("For was expected instead " + tokenActual.value);
            sintaxError = true;
            this.addSintaxError(tokenActual);
            this.Match();
        }
    }


    IF() {
        /*
            IF -> if ( CONDITION ) { INSTRUCTIONS } THEN
        */
        console.log('IF -- ' + tokenActual.value);
        if (tokenActual.type === 'if') {
            python += this.GenTab(tab) + "if";
            this.If();
            this.Left_parenthesis();
            this.CONDITION();
            this.Right_parenthesis();
            python += ":\n";
            this.Left_brace();
            this.INSTRUCTIONS();
            this.Right_brace();
            this.THEN();

        }
        else {
            console.log('If was expected instead of ' + tokenActual.value);
            sintaxError = true; this.addSintaxError(tokenActual);
            this.Match();
        }

    }

    ELSE_IF() {
        /*
           IF -> if ( CONDITION ) { INSTRUCTIONS } THEN
       */
        console.log('ELSE_IF -- ' + tokenActual.value);
        if (tokenActual.type === 'if') {
            python += this.GenTab(tab) + "elif";
            this.If();
            this.Left_parenthesis();
            this.CONDITION();
            this.Right_parenthesis();
            python += ":\n";
            this.Left_brace();
            this.INSTRUCTIONS();
            this.Right_brace();
            this.THEN();

        }
        else {
            console.log('If was expected instead of ' + tokenActual.value);
            sintaxError = true; this.addSintaxError(tokenActual);
            this.Match();
        }
    }

    DEC_FOR() {
        /*
            DEC_FOR -> TYPE id = VALUE ; EXPR REL EXPR ; ID++

            Sintax in python: id in range (EXP1, EXP2)
        */
        console.log("DEC_FOR -- " + tokenActual.value);
        if (tokenActual.type === 'int') {

            this.TYPE();
            this.Identifier();
            python += " in range ";
            this.Assignation_f();
            python += "(";
            this.EXPR();
            this.Semicolon_f();
            python += ", ";
            this.EXPR();
            this.REL_F();
            this.EXPR();
            this.Semicolon_f();
            this.Identifier_f();
            this.INC_OR_DEC();
            python += "):\n";
        }

        else {
            console.log('int was expected instead ' + tokenActual.value);
            sintaxError = true;
            this.addSintaxError(tokenActual);
            this.Match();
        }
    }

    INC_OR_DEC() {

        if (tokenActual.type === "plus") {
            this.Plus_f();
            this.Plus_f();
        }
        else if (tokenActual.type === "minus") {
            this.Minus_f();
            this.Minus_f();

        } else {
            console.log("'+' or '-' was expected instead of " + tokenActual.value);
            sintaxError = true;
            this.addSintaxError(tokenActual);
            this.Match();
        }
    }

    CLAUSE() {

        /*
            CLAUSE -> REL
                    | LOGIC
        */
        console.log('CLAUSE -- ' + tokenActual.type);

        if (tokenActual.type === 'less than' || tokenActual.type === 'less or equal than' || tokenActual.type === 'greater than' || tokenActual.type === 'greater or equal than' || tokenActual.type === 'not' || tokenActual.type === 'assignation') {
            // REL
            this.REL();

        }
        else if (tokenActual.type === 'and' || tokenActual.type === 'or' || tokenActual.type === 'xor') {
            // LOGIC
            this.LOGIC();
        }
        else {
            console.log('If was expected instead of ' + tokenActual.value);
            sintaxError = true; this.addSintaxError(tokenActual);
            this.Match();
        }
    }

    REL() {
        /*
            REL -> > REL_1
                 | < REL_1
                 | ! REL_1
                 | =
        */
        console.log('REL -- ' + tokenActual.value);
        if (tokenActual.type === 'greater than') {
            // REL
            this.Greater_than();
            //this.REL_P();
        }
        else if (tokenActual.type === 'greater or equal than') {
            this.Greater_or_equal_than();
            //this.REL_P();
        }
        else if (tokenActual.type === 'less than') {
            this.Less_than();
            //this.REL_P();
        }
        else if (tokenActual.type === 'less or equal than') {

            this.Less_or_equal_than();

        } else if (tokenActual.type === 'not') {

            this.Not();

        }
        else if (tokenActual.type === 'assignation') {
            this.Assignation();
            this.REL_P();
        }

    }

    REL_F() {

        if (tokenActual.type === 'greater than') {
            // REL
            this.Match();
            //this.REL_P();
        }
        else if (tokenActual.type === 'greater or equal than') {
            this.Match();
            //this.REL_P();
        }
        else if (tokenActual.type === 'less than') {
            this.Match();
            //this.REL_P();
        }
        else if (tokenActual.type === 'less or equal than') {

            this.Match();
            //this.Less_than();
            //this.REL_P();
        } else if (tokenActual.type === 'assignation') {
            this.Assignation_f();
            this.REL_P();
        }

    }

    REL_P() {
        /**
         * REL_P -> =
         *        | epsilon
         * 
        */
        console.log('REL_P -- ' + tokenActual.value);
        if (tokenActual.type === 'assignation') {
            this.Assignation();
            this.REL_P();
        } else {

            //
        }
    }

    REL_P_f() {
        /**
         * REL_P -> =
         *        | epsilon
         * 
        */
        console.log('REL_P_f -- ' + tokenActual.value);
        if (tokenActual.type === 'assignation') {
            this.Assignation_f();
            this.REL_P_f();
        } else {

            //
        }
    }


    LOGIC() {

        /**
         * LOGIC -> & &
         *        | | |
         *        | ^
         * 
        */
        console.log('LOGIC -- ' + tokenActual.value);
        if (tokenActual.type === 'and') {
            this.And();
            this.And();
            python += " and ";
        } else if (tokenActual.type === 'or') {
            this.Or();
            this.Or();
            python += " or ";

        } else if (tokenActual.type === 'xor') {
            this.Xor();
        } else {
            console.log("FFF");
        }

    }
    THEN() {
        /*
            THEN -> else THEN_P
                  | INSTRUCTIONS
        */
        console.log('THEN --' + tokenActual.value);
        if (tokenActual.type === 'else') {
            this.Else();
            this.THEN_P();
            this.INSTRUCTIONS();
        }
        else {
            this.INSTRUCTIONS();
        }
    }

    THEN_P() {
        /*
            THEN_P -> { INSTRUCTIONS }
                    | if { INSTRUCTIONS }
        */
        console.log('THEN_P --' + tokenActual.value);
        if (tokenActual.type === 'Left brace') {
            //python += ":\n";
            python += this.GenTab(tab) + "else:\n";
            this.Left_brace();
            this.INSTRUCTIONS();
            console.log('f ' + tokenActual.value);
            this.Right_brace();
            //this.INSTRUCTIONS();

        }
        else if (tokenActual.type === 'if') {
            // else if 
            //python += this.GenTab(tab) + "el";
            this.ELSE_IF();
            this.INSTRUCTIONS();
        }
        else {
            console.log("--------------------");
            this.INSTRUCTIONS();
        }

    }

    CONDITION() {
        /**
         * CONDITION -> EXPR LOGIC EXPR
        */
        console.log('CONDITION -- ' + tokenActual.value);

        if (tokenActual.type === 'number' || tokenActual.type === 'Identifier' || tokenActual.type === 'Left parenthesis') {
            this.EXPR();
            this.CLAUSE();
            this.EXPR();
        }
        else {
            console.log('Error with ' + tokenActual.value);
            sintaxError = true; this.addSintaxError(tokenActual);
            this.Match();
        }
    }

    EXPR() {
        console.log('EXPR --' + tokenActual.value);
        this.E();
    }

    E() {
        console.log('E --' + tokenActual.value);

        this.T();
        this.EP();
    }

    EP() {
        /*
            EP -> + T EP
                | - T EP
                | Epsilon
        */

        console.log('EP --' + tokenActual.value);
        if (tokenActual.type == 'plus') {
            this.Plus();
            this.T();
            this.EP();
        }
        else if (tokenActual.type == 'minus') {
            this.Minus();
            this.T();
            this.EP();
        }
        else {

        }

    }

    T() {
        console.log('T --' + tokenActual.value);
        this.F();
        this.TP();
    }

    TP() {

        /*
            TP -> * F TP
                | / F TP
                | Epsilon 
            
        */
        console.log('TP --' + tokenActual.value);
        if (tokenActual.type == 'asterisk') {
            this.Asterisk();
            this.F();
            this.TP();
        }
        else if (tokenActual.type == 'slash') {
            this.Slash();
            this.F();
            this.TP();
        }
        else {

        }
    }

    F() {
        /*
            F -> number
               | id
               | ( E )
        */
        console.log('F --' + tokenActual.value);
        if (tokenActual.type === 'number') {
            this.Number();
        }
        else if (tokenActual.type === 'Identifier') {
            this.Identifier();
        }
        else if (tokenActual.type === 'Left parenthesis') {
            this.Left_parenthesis();
            this.E();
            this.Right_parenthesis();
        }
        else {
            console.log('Error with ' + tokenActual.value);
            sintaxError = true; this.addSintaxError(tokenActual);
            this.Match();
        }


    }

    RETURN_STATEMENT() {
        /**
         * RETURN_STATEMENT -> EXPR
         *                   | text_string 
         * 
         */
        console.log("RETURN STATEMENT ->" + tokenActual.value)
        if (tokenActual.type === 'Left parenthesis' || tokenActual.type === 'number' || tokenActual.type === 'Identifier') {
            this.EXPR();
            //this.Semicolon();
        }
        else if (tokenActual.type === 'text string') {
            this.Text_String();
            this.CONCAT();
        }
        /*else if(tokenActual.type === 'Identifier'){
            //this.EXPR();
            this.Identifier();
            this.RTRN_P();
        }*/
        else {
            console.log('___');
        }


    }

    RTRN_P() {

        console.log("RTRN_P ->" + tokenActual.value)

        if (tokenActual.type === 'Left parenthesis') {
            //console.log("Method");
            this.Left_parenthesis();
            //this.LIST_VALUES();
            //this.Right_parenthesis();
            //this.NT();

            this.CALL_METHOD();
            this.RTRN_P2();
        }

    }

    NT() {

        console.log("NT ->" + tokenActual.value)

        if (tokenActual.type === 'plus') {
            this.Plus();
            this.Identifier();
            this.Left_parenthesis();
            this.LIST_VALUES();
            this.Right_parenthesis();
            this.NT();
        }
    }

    LIST_VALUES() {
        console.log("LIST_values ->" + tokenActual.value)

        if (tokenActual.value === '(' || tokenActual.type === 'number' || tokenActual.type === 'Identifier') {
            this.EXPR();
            this.Comma();
            this.LIST_VALUES();
        } else if (tokenActual.type === 'text string') {

            this.Text_String();
            this.Comma();
            this.LIST_VALUES();
        } else {
            //
            this.NT();
            console.log("no hay mas llamadas");
        }

    }
    //not used
    LIST_VALUES_P() {


    }

    //not used
    CALL_METHOD_PRINT() {


    }

    RTRN_P2() {

        if (tokenActual.type === 'plus') {
            this.Plus();
            this.Identifier();
            this.Left_parenthesis();
            this.CALL_METHOD();
            this.RTRN_P2();

        } else {

            console.log("Ya no hay llamadas en el return")
        }

    }

    CONCAT() {

        console.log("CONCAT ->" + tokenActual.value)

        if (tokenActual.type === 'plus') {
            this.Plus();
            this.CONCAT_P();
        } else if (tokenActual.type === 'Semicolon') {
            this.Semicolon();
        }
        else {
            console.log("Error with " + tokenActual.value);
            sintaxError = true;
            this.addSintaxError(tokenActual);
            this.Match();
        }

    }

    CONCAT_P() {

        console.log("CONCAT_p ->" + tokenActual.value)

        if (tokenActual.type === 'text string') {

            this.Text_String();
            this.CONCAT();
        }
        else if (tokenActual.type === 'Identifier') {

            this.Identifier();
            this.CONCAT();

        }
    }
    /*
    RETURN_STATEMENT_P(){


        if()
    }
    */

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
            console.log("public was expected instead of " + tokenActual.type);
            sintaxError = true; this.addSintaxError(tokenActual);
            this.Match();

        }
    }

    //for method
    Public_m() {

        if (tokenActual.type === 'public') {

            //console.log("correcto");
            this.Match();
            //this.LISTP();
        }
        else {
            console.log("public was expected instead of " + tokenActual.type);
            sintaxError = true; this.addSintaxError(tokenActual);
            this.Match();

        }
    }

    Static() {
        if (tokenActual.type === 'static') {

            //console.log("correcto");
            this.Match();
            //this.Void();
        }
        else {
            console.log("static was expected instead of " + tokenActual.type);
            sintaxError = true; this.addSintaxError(tokenActual);
            this.Match();
        }
    }

    Void() {
        if (tokenActual.type === 'void') {

            //console.log("correcto");
            this.Match();
            //this.Main();
        }
        else {
            console.log("void was expected instead of " + tokenActual.type);
            sintaxError = true; this.addSintaxError(tokenActual);
            this.Match();
        }
    }

    Main() {
        if (tokenActual.type === 'main') {

            //console.log("correcto");
            this.Match();
            //this.Left_p_();
        }
        else {
            console.log("main was expected instead of " + tokenActual.type);
            sintaxError = true; this.addSintaxError(tokenActual);
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
            console.log("'(' was expected instead of " + tokenActual.type);
            sintaxError = true; this.addSintaxError(tokenActual);
            this.Match();

        }
    }

    String_p() {
        if (tokenActual.type === 'String') {

            //console.log("correcto");
            this.Match();
            //this.Left_b_();
        }
        else {
            console.log("String was expected instead of " + tokenActual.type);
            sintaxError = true; this.addSintaxError(tokenActual);
            this.Match();
        }
    }

    Left_b_() {
        if (tokenActual.type === 'Left bracket') {

            //console.log("correcto");
            this.Match();
            //this.Right_b_();
        }
        else {
            console.log("'[' was expected instead of " + tokenActual.type);
            sintaxError = true; this.addSintaxError(tokenActual);
            this.Match();

        }
    }

    Right_b_() {
        if (tokenActual.type === 'Right bracket') {

            //console.log("correcto");
            this.Match();
            //this.Args();
        }
        else {
            console.log("']' was expected instead of " + tokenActual.type);
            sintaxError = true; this.addSintaxError(tokenActual);
            this.Match();
        }
    }

    Args() {

        if (tokenActual.type === 'args') {

            //console.log("correcto");
            this.Match();
            //this.Right_p_();
        }
        else {
            console.log("args was expected instead of " + tokenActual.type);
            sintaxError = true; this.addSintaxError(tokenActual);
            this.Match();
        }
    }

    Right_p_() {
        if (tokenActual.type === 'Right parenthesis') {

            //console.log("correcto");
            //Translate sentence to python sintax
            python += "def main():\n";

            this.Match();
            this.Left_brace_();


        }
        else {
            console.log("')' was expected instead of " + tokenActual.type);
            sintaxError = true; this.addSintaxError(tokenActual);
            this.Match();

        }
    }
    // Only for main method
    Left_brace_() {
        if (tokenActual.type === 'Left brace') {

            //console.log("correcto");
            tab++;
            this.Match();
            this.INSTRUCTIONS();

        }
        else {
            console.log("'{' was expected instead of " + tokenActual.type);
            sintaxError = true; this.addSintaxError(tokenActual);
            this.Match();
        }
    }

    Identifier() {

        //console.log("Identifier")
        console.log(tokenActual.value, 'Identifier');
        if (tokenActual.type === 'Identifier') {
            python += tokenActual.value;
            this.Match();
        }
        else {
            console.log('An Identifier was expected instead of ' + tokenActual.type);
            sintaxError = true; this.addSintaxError(tokenActual);
            this.Match();
        }
    }

    Identifier_f() {

        //console.log("Identifier")
        console.log(tokenActual.value, 'Identifier');
        if (tokenActual.type === 'Identifier') {

            //python += tokenActual.value;
            this.Match();
        }
        else {
            console.log('An Identifier was expected instead of ' + tokenActual.type);
            sintaxError = true; this.addSintaxError(tokenActual);
            this.Match();
        }
    }


    Assignation() {
        if (tokenActual.type === 'assignation') {
            // translate 
            python += tokenActual.value;
            this.Match();
        }
        else {
            console.log("'=' was expected instead of " + tokenActual.type);
            sintaxError = true; this.addSintaxError(tokenActual);
            this.Match();
        }
    }

    Assignation_f() {
        if (tokenActual.type === 'assignation') {
            // translate 
            //python += tokenActual.value;
            this.Match();
        }
        else {
            console.log("'=' was expected instead of " + tokenActual.type);
            sintaxError = true; this.addSintaxError(tokenActual);
            this.Match();
        }
    }


    Number() {
        if (tokenActual.type === 'number') {
            // translate
            python += tokenActual.value;
            this.Match();
        }
        else {
            console.log("number was expected instead of " + tokenActual.type);
            sintaxError = true; this.addSintaxError(tokenActual);
            this.Match();
        }
    }

    // For the rest of the methods 

    Left_brace() {
        if (tokenActual.type === 'Left brace') {
            tab++;
            this.Match();
            //this.INSTRUCTIONS();
        }
        else {
            console.log("'{' was expected instead of " + tokenActual.type);
            sintaxError = true; this.addSintaxError(tokenActual);
            this.Match();
        }
    }

    Semicolon() {
        if (tokenActual.type === 'Semicolon') {

            python += "\n";
            this.Match();
        }
        else {
            console.log("';' was expected instead of " + tokenActual.type);
            sintaxError = true; this.addSintaxError(tokenActual);
            this.Match();
        }
    }

    Semicolon_f() {
        if (tokenActual.type === 'Semicolon') {

            //python += "\n";
            this.Match();
        }
        else {
            console.log("';' was expected instead of " + tokenActual.type);
            sintaxError = true; this.addSintaxError(tokenActual);
            this.Match();
        }
    }


    Right_brace() {
        if (tokenActual.type === 'Right brace') {
            tab--;
            python += "\n";
            this.Match();
        }
        else {
            console.log("'}' was expected instead  " + tokenActual.type);
            sintaxError = true; 
            this.addSintaxError(tokenActual);
            this.Match();
        }
    }

    Interface() {

        if (tokenActual.type === 'interface') {

            python += "class ";
            this.Match();
            //this.Identifier();
        }
        else {
            console.log("'interface' was expected, but " + tokenActual.type);
            sintaxError = true; this.addSintaxError(tokenActual);
            this.Match();
        }

    }

    // for parameters
    Left_parenthesis() {

        if (tokenActual.type === 'Left parenthesis') {
            // translate
            python += "(";
            this.Match();
        }
        else {
            console.log("'(' was expected instead " + tokenActual.value);
            sintaxError = true; this.addSintaxError(tokenActual);
            this.Match();
        }
    }

    // For
    Left_parenthesis_f() {

        if (tokenActual.type === 'Left parenthesis') {
            // translate
            //python += "(";
            this.Match();
        }
        else {
            console.log("'(' was expected instead " + tokenActual.value);
            sintaxError = true; this.addSintaxError(tokenActual);
            this.Match();
        }
    }

    Right_parenthesis() {
        if (tokenActual.type === 'Right parenthesis') {

            // translate
            python += ")";
            this.Match();


        }
        else {
            console.log("')' was expected instead " + tokenActual.value);
            sintaxError = true; this.addSintaxError(tokenActual);
            this.Match();
        }
    }

    // for
    Right_parenthesis_f() {
        if (tokenActual.type === 'Right parenthesis') {

            // translate
            //python += ")";
            this.Match();


        }
        else {
            console.log("')' was expected instead " + tokenActual.value);
            sintaxError = true; this.addSintaxError(tokenActual);
            this.Match();
        }
    }



    Comma() {
        if (tokenActual.type === 'comma') {
            // transalate
            python += tokenActual.value;
            this.Match();
        }
        else {
            console.log("',' was expected instead " + tokenActual.value);
            sintaxError = true; this.addSintaxError(tokenActual);
            this.Match();
        }
    }

    System() {

        if (tokenActual.type === 'system') {
            this.Match();
        }
        else {
            console.log("system was expected instead " + tokenActual.value);
            sintaxError = true; this.addSintaxError(tokenActual);
            this.Match();
        }
    }

    Out() {

        if (tokenActual.type === 'out') {
            this.Match();
        }
        else {
            console.log("out was expected instead " + tokenActual.value);
            sintaxError = true; this.addSintaxError(tokenActual);
            this.Match();
        }
    }

    Point() {

        if (tokenActual.type === 'point') {
            this.Match();
        }
        else {
            console.log("'.' was expected instead " + tokenActual.value);
            sintaxError = true; this.addSintaxError(tokenActual);
            this.Match();
        }
    }

    Print() {
        if (tokenActual.type === 'print') {
            // translate
            python += this.GenTab(tab) + "print";
            this.Match();
        }
        else {
            console.log("print was expected instead " + tokenActual.value);
            sintaxError = true; this.addSintaxError(tokenActual);
            this.Match();
        }
    }

    Println() {
        if (tokenActual.type === 'println') {

            // translate
            python += this.GenTab(tab) + "print";

            this.Match();

        }
        else {
            console.log("print was expected instead " + tokenActual.value);
            sintaxError = true; this.addSintaxError(tokenActual);
            this.Match();
        }
    }

    Text_String() {

        if (tokenActual.type === 'text string') {

            //translate
            python += tokenActual.value;

            this.Match();


        }
        else {
            console.log("text string was expected instead " + tokenActual.value);
            sintaxError = true; this.addSintaxError(tokenActual);
            this.Match();
        }
    }


    If() {
        if (tokenActual.type === 'if') {
            //console.log(tab + " xDxd");
            //python += this.GenTab(tab) + "if";
            this.Match();
        }
        else {
            console.log("if was expected instead " + tokenActual.value);
            sintaxError = true; this.addSintaxError(tokenActual);
            this.Match();
        }
    }

    Else() {
        if (tokenActual.type === 'else') {
            // translate
            //python += this.GenTab(tab) + tokenActual.value;
            this.Match();
        }
        else {
            console.log("else was expected instead " + tokenActual.value);
            sintaxError = true; this.addSintaxError(tokenActual);
            this.Match();
        }
    }


    Asterisk() {
        if (tokenActual.type === 'asterisk') {
            // translate
            python += tokenActual.value;
            this.Match();
        }
        else {
            console.log("'*' was expected instead " + tokenActual.value);
            sintaxError = true; this.addSintaxError(tokenActual);
            this.Match();
        }
    }

    Slash() {
        if (tokenActual.type === 'slash') {
            // translate
            python += tokenActual.value;
            this.Match();
        }
        else {
            console.log("'/' was expected instead " + tokenActual.value);
            sintaxError = true; this.addSintaxError(tokenActual);
            this.Match();
        }
    }


    Plus() {
        if (tokenActual.type === 'plus') {
            // translate
            python += tokenActual.value;
            this.Match();
        }
        else {
            console.log("'+' was expected instead " + tokenActual.value);
            sintaxError = true; this.addSintaxError(tokenActual);
            this.Match();
        }
    }

    Plus_f() {
        if (tokenActual.type === 'plus') {
            // translate
            //python += tokenActual.value;
            this.Match();
        }
        else {
            console.log("'+' was expected instead " + tokenActual.value);
            sintaxError = true; this.addSintaxError(tokenActual);
            this.Match();
        }
    }

    Minus() {
        if (tokenActual.type === 'minus') {
            // translate
            python += tokenActual.value;
            this.Match();
        }
        else {
            console.log("'-' was expected instead " + tokenActual.value);
            sintaxError = true; this.addSintaxError(tokenActual);
            this.Match();
        }
    }

    Minus_f() {
        if (tokenActual.type === 'minus') {
            // translate
            //python += tokenActual.value;
            this.Match();
        }
        else {
            console.log("'-' was expected instead " + tokenActual.value);
            sintaxError = true; this.addSintaxError(tokenActual);
            this.Match();
        }
    }


    Less_than() {
        if (tokenActual.type === 'less than') {
            // translate
            python += tokenActual.value;
            this.Match();
        }
        else {
            console.log("'<' was expected instead " + tokenActual.value);
            sintaxError = true; this.addSintaxError(tokenActual);
            this.Match();
        }
    }

    Less_or_equal_than() {
        if (tokenActual.type === 'less or equal than') {
            // translate
            python += tokenActual.value;
            this.Match();
        }
        else {
            console.log("'<' was expected instead " + tokenActual.value);
            sintaxError = true; this.addSintaxError(tokenActual);
            this.Match();
        }
    }

    Greater_than() {
        if (tokenActual.type === 'greater than') {
            // translate
            python += tokenActual.value;
            this.Match();
        }
        else {
            console.log("'>' was expected instead " + tokenActual.value);
            sintaxError = true; this.addSintaxError(tokenActual);
            this.Match();
        }
    }

    Greater_or_equal_than() {
        if (tokenActual.type === 'greater or equal than') {
            // translate
            python += tokenActual.value;
            this.Match();
        }
        else {
            console.log("'>' was expected instead " + tokenActual.value);
            sintaxError = true; this.addSintaxError(tokenActual);
            this.Match();
        }
    }
    Do() {
        if (tokenActual.type === 'do') {
            this.Match();
        }
        else {
            console.log("do was expected instead " + tokenActual.value);
            sintaxError = true; this.addSintaxError(tokenActual);
            this.Match();
        }
    }

    While() {
        if (tokenActual.type === 'while') {
            // translate
            python += this.GenTab(tab) + tokenActual.value;
            this.Match();
        }
        else {
            console.log("while was expected instead " + tokenActual.value);
            sintaxError = true; this.addSintaxError(tokenActual);
            this.Match();
        }
    }

    While_2() {
        if (tokenActual.type === 'while') {
            // translate
            //python += this.GenTab(tab) + tokenActual.value;
            this.Match();
        }
        else {
            console.log("while was expected instead " + tokenActual.value);
            sintaxError = true; this.addSintaxError(tokenActual);
            this.Match();
        }
    }


    For() {
        if (tokenActual.type === 'for') {
            //translate
            python += this.GenTab(tab) + tokenActual.value;
            this.Match();
        }
        else {
            console.log("for was expected instead " + tokenActual.value);
            sintaxError = true; this.addSintaxError(tokenActual);
            this.Match();
        }
    }

    Break() {
        if (tokenActual.type === 'break') {
            // translate
            python += this.GenTab(tab) + tokenActual.value;
            this.Match();
        }
        else {
            console.log("break was expected instead " + tokenActual.value);
            sintaxError = true; this.addSintaxError(tokenActual);
            this.Match();
        }
    }

    Continue() {
        if (tokenActual.type === 'continue') {
            //translate 
            python += this.GenTab(tab) + tokenActual.value;
            this.Match();
        }
        else {
            console.log("continue was expected instead " + tokenActual.value);
            sintaxError = true; this.addSintaxError(tokenActual);
            this.Match();
        }
    }

    Return() {
        if (tokenActual.type === 'return') {
            //transalate 
            python += this.GenTab(tab) + tokenActual.value + " ";
            this.Match();
        }
        else {
            console.log("return was expected instead " + tokenActual.value);
            sintaxError = true; this.addSintaxError(tokenActual);
            this.Match();
        }
    }

    Or() {
        if (tokenActual.type === 'or') {
            this.Match();
        }
        else {
            console.log("'|' was expected instead " + tokenActual.value);
            sintaxError = true; this.addSintaxError(tokenActual);
            this.Match();
        }
    }

    Xor() {
        if (tokenActual.type === 'xor') {
            this.Match();
        }
        else {
            console.log("'^' was expected instead " + tokenActual.value);
            sintaxError = true; this.addSintaxError(tokenActual);
            this.Match();
        }
    }

    And() {
        if (tokenActual.type === 'and') {
            //translate
            //python += tokenActual.value;

            this.Match();
        }
        else {
            console.log("'&' was expected instead " + tokenActual.value);
            sintaxError = true; this.addSintaxError(tokenActual);
            this.Match();
        }
    }

    Not() {
        if (tokenActual.type === 'not') {
            // translate
            python += "!=";
            //python += tokenActual.value;
            this.Match();
        }
        else {
            console.log("'!' was expected instead " + tokenActual.value);
            sintaxError = true; this.addSintaxError(tokenActual);
            this.Match();
        }
    }

    True() {
        if (tokenActual.type === 'true') {
            // translate
            python += "True";
            this.Match();
        }
        else {
            console.log("'true' was expected instead " + tokenActual.value);
            sintaxError = true; this.addSintaxError(tokenActual);
            this.Match();
        }
    }

    False() {
        if (tokenActual.type === 'false') {
            // translate
            python += "False"
            this.Match();
        }
        else {
            console.log("'false' was expected instead " + tokenActual.value);
            sintaxError = true; this.addSintaxError(tokenActual);
            this.Match();
        }
    }


    // commentaries
    SL_Comment() {
        if (tokenActual.type === 'single line commentary') {
            // translate
            python += this.GenTab(tab) + "# " + tokenActual.value + "\n";
            this.Match();
        }
        else {
            //console.log("'!' was expected instead " + tokenActual.value);
            //sintaxError = true; this.addSintaxError(tokenActual);
            //this.Match();
        }

    }

    ML_Comment() {
        if (tokenActual.type === 'multiline commentary') {
            // translate
            python += this.GenTab(tab) + "\"\"\"\n";
            python += this.GenTab(tab) + tokenActual.value;
            python += this.GenTab(tab) + "\n\"\"\"\n";
            this.Match();
        }
        else {

        }
    }

    // Data types
    TYPE() {
        console.log(tokenActual.value);
        if (tokenActual.type === 'int' || tokenActual.type === 'String' || tokenActual.type === 'boolean' || tokenActual.type === 'char' || tokenActual.type === 'double' || tokenActual.type === 'void') {
            this.Match();
        }
        else {
            console.log("A data type was expected instead of " + tokenActual.value);
            sintaxError = true;
            this.addSintaxError(tokenActual);
            this.Match();
        }

    }

    END(){

        console.log("FIN");
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
        //console.log(this.tokenList.length - 1)
        if (sintaxError) {

            while (tokenActual.type !== 'Semicolon') {

                console.log(tokenActual.value);
                index++;
                tokenActual = this.tokenList[index];

                if (tokenActual.type === 'Semicolon') {

                    console.log("';' found");

                    if (index < (this.tokenList.length - 1)) {
                        sintaxError = false;
                        index++;
                        tokenActual = this.tokenList[index];
                        this.INSTRUCTIONS();
                        break;
                    }

                }
                /*else if (tokenActual.type === 'Right brace') {
                    console.log("'}' found");

                    if (index < (this.tokenList.length - 1)) {
                        sintaxError = false;
                        index++;
                        tokenActual = this.tokenList[index];
                        this.INSTRUCTIONS();
                        break;
                    }

                }*/
                /*else if (tokenActual.type === 'public') {
                    console.log("'public' found");

                    if (index < (this.tokenList.length - 1)) {
                        index++;
                        tokenActual = this.tokenList[index];
                        sintaxError = false;
                        //this.LIST();
                        break;
                    }
                }*/
                else if (tokenActual.type === 'eof') {
                    console.log('End of file');
                    sintaxError = false;
                    this.END();
                    //index--;
                    break;
                }
            }
        } else {
            index++;
            tokenActual = this.tokenList[index];
        }

        sintaxError = false;




    }


    WriteFile() {

        //console.log(python);
        fs.writeFile('result/prueba.py', python, function (err) {
            if (err) {
                return console.log(err);
            }
        })
    }

    returnTraductionString() {

        return python;
    }

    GenTab(n) {
        let tabs = n * 4;
        let tab = "";

        for (var i = 1; i <= tabs; i++) {
            tab += " ";
            //console.log(i);
        }

        return tab;
    }

    addSintaxError(tokenActual) {
        consoleInformation += " Sintax error with [" + tokenActual.value + "] on row: " + tokenActual.row + " and column: " + tokenActual.column + "\n";
        console.log(" Sintax error with [" + tokenActual.value + "] on row: " + tokenActual.row + " and column: " + tokenActual.column);
    }


    returnConsoleReport() {

        return consoleInformation;
    }
}
