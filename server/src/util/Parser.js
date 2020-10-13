
var Token = require('./Token');
var fs = require('fs');

var tokenActual;
var index;
var sintaxError = false;
var tab = 0;
var python = "";

module.exports = class Parser {

    constructor(tokenList) {
        this.tokenList = tokenList;

        var row = 1;
        var column = 1;
        sintaxError = false;
        python = "";
        tab = 0;
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

        else if (tokenActual.type == 'eof') {
            console.log('END OF FILE :v');
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
            python += "class ";
            this.Match();
            this.Identifier();
            python += ":\n";
            this.Left_brace();
            this.INSTRUCTIONS();
            this.Right_brace();
            this.S();
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

        /*
            FUNCTION -> TYPE id PAREMETERS
        */
        console.log("FUNCTION");
        console.log(tokenActual.value);
        this.TYPE();
        this.Identifier();
        this.PARAMETERS();
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
            this.INSTRUCTIONS();
            this.Right_brace();
            this.S();
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
                   | ) { INSTRUCTIONS }
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
            this.INSTRUCTIONS();
            this.Right_brace();
            this.S();
        }

    }

    INSTRUCTIONS() {

        console.log("INSTRUCTIONS");
        console.log(sintaxError, "- current " + tokenActual.value);
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
        else if (tokenActual.type === 'eof') {

            console.log('End of file');
        }
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
        else {
            console.log("Error with " + tokenActual.value);
            sintaxError = true;
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
        console.log('DECLARATION');

        this.TYPE();
        this.Identifier();
        this.DECLARATION_P();



    }

    ASSIGNATION() {
        /**
         * ASSIGNATION -> id = VALUE ;
         * 
        */

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

        if (tokenActual.type === 'number' || tokenActual.type === 'text string' || tokenActual.type === 'true' || tokenActual.type === 'false') {

            this.Match();

        } else {

            console.log("Value was expected instead " + tokenActual.value);
            sintaxError = true;
            this.Match();
        }

    }

    CALL_METHOD() {
        /*
            CALL_METHOD -> id  LIST_P_2
        */

        console.log('CALL_METHOD ' + tokenActual.value);
        this.VALUE_P();
        //this.Left_parenthesis();
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
            this.INSTRUCTIONS();
        }
        else {
            console.log('Error with ' + tokenActual.value);
            sintaxError = true;
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
            sintaxError = true;
            this.Match();
        }

    }

    VALUE_P() {

        console.log('VALUE_P -- ' + tokenActual.value);
        if (tokenActual.type === 'Identifier' || tokenActual.type === 'number' || tokenActual.type === 'true' || tokenActual.type === 'false' || tokenActual.type === 'text string') {

            this.Match();
        }
        else {
            console.log("A parameter value was expected instead " + tokenActual.value);
            sintaxError = true;
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
            sintaxError = true;
            this.Match();
        }
    }

    PRINT_P() {
        /*
            PRINT_P -> println ( DATA ) ;
                     | print (DATA) ;
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
            sintaxError = true;
            this.Match();
        }

    }


    DATA() {
        /*
            DATA -> str
                  | EXPRESSION
                  |  id
        */
        if (tokenActual.type === 'text string') {
            this.Text_String();

        } else if (tokenActual.type === 'Identifier') {
            this.Identifier();
        }
        else {
            console.log("Error with -- " + tokenActual.value);
            sintaxError = true;
            this.Match();
        }
    }

    DO() {

        if (tokenActual.type === 'do') {
            this.Do();
            this.Left_brace();
            this.INSTRUCTIONS();
            this.Right_brace();
            this.While();
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
            sintaxError = true;
            this.Match();
        }

    }


    WHILE() {
        if (tokenActual.type === 'while') {
            this.While();
            this.Left_parenthesis();
            this.EXPR();
            this.LOGIC();
            this.EXPR();
            this.Right_parenthesis();
            this.Left_brace();
            this.INSTRUCTIONS();
            this.Right_brace();

        }
        else {
            console.log('while was expexted instead ' + tokenActual.value);
            sintaxError = true;
            this.Match();
        }
    }


    FOR() {
        /*
            FOR -> for( DEC_FOR ) }
        */

        if (tokenActual.type === 'for') {
            this.For();
            this.Left_parenthesis();
            this.DEC_FOR();
            this.Right_parenthesis();
            this.Left_brace();
            this.INSTRUCTIONS();
            this.Right_brace();
            /*this.EXPR();
            this.REL();
            this.EXPR();
            this.Semicolon();
            this.EXPR();
            this.Right_parenthesis();
            this.Left_brace();
            this.INSTRUCTIONS();
            this.Right_brace();*/
            //this.INSTRUCTIONS();

        }
        else {
            console.log("For was expected instead " + tokenActual.value);
            sintaxError = true;
            this.Match();
        }
    }


    IF() {
        /*
            IF -> if ( CONDITION ) { INSTRUCTIONS } THEN
        */
        console.log('IF -- ' + tokenActual.value);
        if (tokenActual.type === 'if') {
            this.If();
            this.Left_parenthesis();
            this.CONDITION();
            this.Right_parenthesis();
            this.Left_brace();
            this.INSTRUCTIONS();
            this.Right_brace();
            this.THEN();

        }
        else {
            console.log('If was expected instead of ' + tokenActual.value);
            sintaxError = true;
            this.Match();
        }

    }

    DEC_FOR() {
        /*
            DEC_FOR -> TYPE id = VALUE ; EXPR REL EXPR ; ID++
        */
        console.log("DEC_FOR -- " + tokenActual.value);
        if (tokenActual.type === 'int') {
            this.TYPE();
            this.Identifier();
            this.Assignation();
            this.EXPR();
            this.Semicolon();
            this.EXPR();
            this.REL();
            this.EXPR();
            this.Semicolon();
            this.Identifier();
            this.Plus();
            this.Plus();
        }

        else {
            console.log('int was expected instead ' + tokenActual.value);
            sintaxError = true;
        }
    }


    CLAUSE() {

        /*
            CLAUSE -> REL
                    | LOGIC
        */
        console.log('CLAUSE -- ' + tokenActual.type);

        if (tokenActual.type === 'less than' || tokenActual.type === 'greater than' || tokenActual.type === 'not' || tokenActual.type === 'assignation') {
            // REL
            this.REL();

        }
        else if (tokenActual.type === 'and' || tokenActual.type === 'or' || tokenActual.type === 'xor') {
            // LOGIC
            this.LOGIC();
        }
        else {
            console.log('If was expected instead of ' + tokenActual.value);
            sintaxError = true;
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
            this.REL_P();
        }
        else if (tokenActual.type === 'less than') {
            this.Less_than();
            this.REL_P();
        } else if (tokenActual.type === 'assignation') {
            this.Assignation();
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
        } else if (tokenActual.type === 'or') {
            this.Or();
            this.Or();

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
            this.Left_brace();
            this.INSTRUCTIONS();
            this.Right_brace();

        }
        else if (tokenActual.type === 'if') {

            this.IF();
            this.INSTRUCTIONS();
            /*this.If();
            this.Left_parenthesis();
            this.EXPR();
            this.LOGIC();
            this.EXPR();
            this.Right_parenthesis();
            //this.INSTRUCTIONS();
            this.Right_brace();*/
        }
        else {
            console.log("--------------------");
        }

    }

    CONDITION() {
        /**
         * CONDITION -> EXPR LOGIC EXPR
        */
        console.log('CONDITION -- ' + tokenActual.value);

        if (tokenActual.type === 'number' || tokenActual.type === 'Identifier') {
            this.EXPR();
            this.CLAUSE();
            this.EXPR();
        }
        else {
            console.log('Error with ' + tokenActual.value);
            sintaxError = true;
            this.Match();
        }
    }

    LOGIC() {
        /*
            LOGIC -> >
                   | <
                   | =
        */

        if (tokenActual.type === 'less than') {
            this.Less_than();
        }
        else if (tokenActual.type === 'greater than') {
            this.Greater_than();
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
            sintaxError = true;
            this.Match();
        }


    }

    RETURN_STATEMENT() {
        /**
         * RETURN_STATEMENT -> EXPR
         *                   | text_string 
         * 
         */
        if (tokenActual.type === 'Left parenthesis' || tokenActual.type === 'number' || tokenActual.type === 'Identifier') {
            this.EXPR();
        }
        else if (tokenActual.type === 'text string') {
            this.Text_String();
        }
        else {
            console.log('');
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
            //Translate sentence to python sintax
            python += "def main():\n";

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
            tab++;
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
            python += tokenActual.value +" "; 
            this.Match();

            //transalate
            //python += tokenActual.value;
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
            tab++;
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
            
            python += "\n";
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
            tab--;
            this.Match();
            //this.LIST();
        }
        else {
            console.log("'}' was expected, but " + tokenActual.type);
            sintaxError = true;
            this.Match();
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
            // translate
            python += "(";
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
            
            // translate
            python += ")\n";
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

    System() {

        if (tokenActual.type === 'system') {
            this.Match();
        }
        else {
            console.log("system was expected instead " + tokenActual.value);
            sintaxError = true;
            this.Match();
        }
    }

    Out() {

        if (tokenActual.type === 'out') {
            this.Match();
        }
        else {
            console.log("out was expected instead " + tokenActual.value);
            sintaxError = true;
            this.Match();
        }
    }

    Point() {

        if (tokenActual.type === 'point') {
            this.Match();
        }
        else {
            console.log("'.' was expected instead " + tokenActual.value);
            sintaxError = true;
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
            sintaxError = true;
            this.Match();
        }
    }

    Println() {
        if (tokenActual.type === 'println') {

            // translate
            console.log(tab);
            python += this.GenTab(tab) + "print";

            this.Match();

        }
        else {
            console.log("print was expected instead " + tokenActual.value);
            sintaxError = true;
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
            sintaxError = true;
            this.Match();
        }
    }


    If() {
        if (tokenActual.type === 'if') {
            this.Match();
        }
        else {
            console.log("if was expected instead " + tokenActual.value);
            sintaxError = true;
            this.Match();
        }
    }

    Else() {
        if (tokenActual.type === 'else') {
            this.Match();
        }
        else {
            console.log("else was expected instead " + tokenActual.value);
            sintaxError = true;
            this.Match();
        }
    }


    Asterisk() {
        if (tokenActual.type === 'asterisk') {
            this.Match();
        }
        else {
            console.log("'*' was expected instead " + tokenActual.value);
            sintaxError = true;
            this.Match();
        }
    }

    Slash() {
        if (tokenActual.type === 'slash') {
            this.Match();
        }
        else {
            console.log("'/' was expected instead " + tokenActual.value);
            sintaxError = true;
            this.Match();
        }
    }


    Plus() {
        if (tokenActual.type === 'plus') {
            this.Match();
        }
        else {
            console.log("'+' was expected instead " + tokenActual.value);
            sintaxError = true;
            this.Match();
        }
    }

    Minus() {
        if (tokenActual.type === 'minus') {
            this.Match();
        }
        else {
            console.log("'-' was expected instead " + tokenActual.value);
            sintaxError = true;
            this.Match();
        }
    }

    Less_than() {
        if (tokenActual.type === 'less than') {
            this.Match();
        }
        else {
            console.log("'<' was expected instead " + tokenActual.value);
            sintaxError = true;
            this.Match();
        }
    }

    Greater_than() {
        if (tokenActual.type === 'greater than') {
            this.Match();
        }
        else {
            console.log("'>' was expected instead " + tokenActual.value);
            sintaxError = true;
            this.Match();
        }
    }

    Do() {
        if (tokenActual.type === 'do') {
            this.Match();
        }
        else {
            console.log("do was expected instead " + tokenActual.value);
            sintaxError = true;
            this.Match();
        }
    }

    While() {
        if (tokenActual.type === 'while') {
            this.Match();
        }
        else {
            console.log("while was expected instead " + tokenActual.value);
            sintaxError = true;
            this.Match();
        }
    }

    For() {
        if (tokenActual.type === 'for') {
            this.Match();
        }
        else {
            console.log("for was expected instead " + tokenActual.value);
            sintaxError = true;
            this.Match();
        }
    }

    Break() {
        if (tokenActual.type === 'break') {
            this.Match();
        }
        else {
            console.log("break was expected instead " + tokenActual.value);
            sintaxError = true;
            this.Match();
        }
    }

    Continue() {
        if (tokenActual.type === 'continue') {
            this.Match();
        }
        else {
            console.log("continue was expected instead " + tokenActual.value);
            sintaxError = true;
            this.Match();
        }
    }

    Return() {
        if (tokenActual.type === 'return') {
            this.Match();
        }
        else {
            console.log("return was expected instead " + tokenActual.value);
            sintaxError = true;
            this.Match();
        }
    }

    Or() {
        if (tokenActual.type === 'or') {
            this.Match();
        }
        else {
            console.log("'|' was expected instead " + tokenActual.value);
            sintaxError = true;
            this.Match();
        }
    }

    Xor() {
        if (tokenActual.type === 'xor') {
            this.Match();
        }
        else {
            console.log("'^' was expected instead " + tokenActual.value);
            sintaxError = true;
            this.Match();
        }
    }

    And() {
        if (tokenActual.type === 'and') {
            this.Match();
        }
        else {
            console.log("'&' was expected instead " + tokenActual.value);
            sintaxError = true;
            this.Match();
        }
    }

    Not() {
        if (tokenActual.type === 'not') {
            this.Match();
        }
        else {
            console.log("'!' was expected instead " + tokenActual.value);
            sintaxError = true;
            this.Match();
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
        //console.log(this.tokenList.length - 1)
        if (sintaxError) {

            while (tokenActual.type !== 'Semicolon' || tokenActual.type !== 'Right brace') {

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
                else if (tokenActual.type === 'Right brace') {
                    console.log("'}' found");
                    sintaxError = false;
                    index++;
                    tokenActual = this.tokenList[index];
                    this.S();
                    break;

                }
                else if (tokenActual.type === 'eof') {
                    console.log('End of file xd');
                    sintaxError = false;
                    index--;
                    break;
                }

            }
        } else {
            index++;
            tokenActual = this.tokenList[index];
            //sintaxError = false;
        }

        sintaxError = false;




    }


    WriteFile() {
        fs.writeFile('result/prueba.py', python, function (err) {
            if (err) {
                return console.log(err);
            }
        })
    }

    GenTab(n) {
        let tabs = n * 4;
        let tab = "";

        for (var i = 1; i <= tabs; i++) {
            tab += " ";
            console.log(i);
        }

        return tab;
    }
}
