
var Token = require('./Token');

const TokenType = {
    COMMENT: 'commentary',
    CLASS: 'class',
    STATIC: 'static',
    PUBLIC: 'public',
    VOID: 'void',
    MAIN: 'main',
    INTERFACE: 'interface',
    NUMBER: 'number',
    ID: 'Identifier',
    POINT: 'point',
    EQUAL: 'equal',
    ASSIGNATION: 'asignation',
    LEFT_PAR: 'Left parenthesis',
    RIGHT_PAR: 'Right parenthesis',
    SEMICOLON: 'Semicolon',
    /*conditionals*/
    IF: 'if',
    ELSE: 'else',
    /*cycles (repetition sentences)*/
    FOR: 'for',
    WHILE: 'while',
    DO: 'do',
    /* Sentences */
    BREAK: 'break',
    CONTINUE: 'continue',
    RETURN: 'return',
    /* Data types */
    INT: 'int',
    STRING: 'string',
    BOOLEAN: 'boolean',
    FLOAT: 'float',
    CHAR: 'char'

}
var tokenList = [];
var errorList = [];

// Scanner Java 
module.exports = class Scanner {
    constructor(text) {
        this.text = text;

    }

    scan() {

        var auxiliar = "";
        let source_code = "";
        source_code = this.text;
        let current_char = '';
        let state = 0;


        for (let i = 0; i < source_code.length; i++) {
            current_char = source_code.charAt(i);
            /*
                Aceptation states:
                    - 
            */

            switch (state) {
                case 0:
                    //console.log("I'm in state 0");

                    if (this.isLetter(current_char)) {
                        //console.log("Is a letter -> ", current_char);
                        auxiliar += current_char;
                        state = 6;
                    }
                    else if (this.isNumber(current_char)) {
                        //console.log("Is a number -> ", current_char)
                        auxiliar += current_char;
                        state = 7;
                    }
                    else if (current_char === "/") {
                        auxiliar += current_char;
                        state = 1;
                    }
                    else if (current_char === "(") {
                        auxiliar += current_char;
                        tokenList.push(new Token(TokenType.LEFT_PAR, auxiliar));
                        auxiliar = "";
                        state = 0;
                    }
                    else if (current_char === ")") {
                        auxiliar += current_char;
                        tokenList.push(new Token(TokenType.RIGHT_PAR, auxiliar));
                        auxiliar = "";
                        state = 0;
                    }
                    else if (current_char === ".") {
                        auxiliar += current_char;
                        tokenList.push(new Token(TokenType.POINT, auxiliar));
                        auxiliar = "";
                        state = 0;
                    }
                    else if (current_char === ";") {
                        auxiliar += current_char;
                        tokenList.push(new Token(TokenType.SEMICOLON, auxiliar));
                        auxiliar = "";
                        state = 0;
                    }

                    else if (current_char === "=") {
                        auxiliar += current_char;
                        tokenList.push(new Token(TokenType.ASSIGNATION, auxiliar));
                        auxiliar = "";
                        state = 0;
                        //state = 9;
                    }


                    break;

                case 1:
                    //console.log("I'm in state 1");

                    if (current_char === "/") {
                        auxiliar += current_char;
                        state = 2;
                    }
                    else if (current_char === "*") {
                        auxiliar += current_char;
                        state = 3;
                    }

                    break;

                case 2:
                    //console.log("I'm in state 2");
                    if (this.isLetter(current_char)) {
                        auxiliar += current_char;
                    }
                    else if (this.isNumber(current_char)) {
                        auxiliar += current_char;
                    }
                    else if (current_char === " ") {
                        auxiliar += current_char;
                    }
                    else if (current_char === "\n") {
                        // Acceptation single line comment
                        //console.log(auxiliar);
                        tokenList.push(new Token(TokenType.COMMENT, auxiliar));
                        auxiliar = "";
                        state = 0;
                    }

                    break;

                case 3:

                    if (this.isLetter(current_char)) {
                        auxiliar += current_char;
                        state = 4;
                    }
                    else if (this.isNumber(current_char)) {
                        auxiliar += current_char;
                        state = 4;
                    }
                    else if (current_char === "\n") {
                        auxiliar += current_char;
                        state = 4;
                    }
                    else if (current_char === "*") {
                        auxiliar += current_char;
                        state = 3;
                    }
                    else if (current_char === "/") {
                        auxiliar += current_char;
                        state = 5;
                    }

                    break;

                case 4:
                    if (this.isLetter(current_char)) {
                        auxiliar += current_char;
                        state = 4;
                    }
                    else if (this.isNumber(current_char)) {
                        auxiliar += current_char;
                        state = 4;
                    }
                    else if (current_char === "\n" || current_char === "\t") {
                        auxiliar += current_char;
                        state = 4;
                    }
                    else if (current_char === " ") {
                        auxiliar += current_char;
                        state = 4;
                    }
                    else if (current_char === "*") {
                        auxiliar += current_char;
                        state = 3;
                    }

                    break;

                case 5:

                    // Acceptation
                    //console.log(auxiliar);
                    tokenList.push(new Token(TokenType.COMMENT, auxiliar));
                    auxiliar = "";
                    state = 0;

                    break;

                case 6:

                    if (this.isLetter(current_char)) {
                        //console.log("Is a letter -> ", current_char);
                        auxiliar += current_char;
                        state = 6;
                    }
                    else if (this.isNumber(current_char)) {
                        auxiliar += current_char;
                        state = 6;
                    }
                    else if (current_char === "_") {
                        auxiliar += current_char;
                        state = 6;
                    }
                    else {
                        this.addToken(auxiliar);
                        auxiliar = "";
                        i--;
                        state = 0;
                    }
                    break;

                case 7:

                    if (this.isNumber(current_char)) {
                        //console.log("Is a number -> ", current_char)
                        auxiliar += current_char;
                        state = 7;
                    }
                    else if (current_char === ".") {
                        auxiliar += current_char;
                        state = 8;
                    }
                    else {
                        tokenList.push(new Token(TokenType.NUMBER, auxiliar));
                        auxiliar = ""
                        state = 0;
                    }

                    break;

                case 8:

                    if (this.isNumber(current_char)) {
                        auxiliar += current_char;
                        state = 8;
                    }
                    else {
                        tokenList.push(new Token(TokenType.NUMBER, auxiliar));
                        auxiliar = "";
                        state = 0;

                    }

                    break;

                case 9:

                    if (current_char === "=") {
                        auxiliar += current_char;
                        tokenList.push(new Token(TokenType.EQUAL, auxiliar))
                        auxiliar = ""
                        state = 0;
                    }
                    else {

                    }

                    break;
            }

        }

    }

    // Check if a char is a letter
    isLetter(char) {
        return char.length === 1 && char.match(/[a-zA-Z]/i);
    }

    // Check if a char is a number
    isNumber(char) {
        return char.length === 1 && char.match(/[0-9]/i);
    }

    addToken(str) {

        switch (str) {
            case "public":
                tokenList.push(new Token(TokenType.PUBLIC, str))
                break;

            case "static":
                tokenList.push(new Token(TokenType.STATIC, str))
                break;

            case "void":
                tokenList.push(new Token(TokenType.VOID, str))
                break;

            case "interface":
                tokenList.push(new Token(TokenType.INTERFACE, str))
                break;

            case "main":
                tokenList.push(new Token(TokenType.MAIN, str))
                break;

            /* Conditionals */

            case "if":
                tokenList.push(new Token(TokenType.IF, str))
                break;

            case "else":
                tokenList.push(new Token(TokenType.ELSE, str))
                break;

            /* Data types */

            case "int":
                tokenList.push(new Token(TokenType.INT, str))
                break;

            case "string":
                tokenList.push(new Token(TokenType.STRING, str))
                break;

            case "boolean":
                tokenList.push(new Token(TokenType.BOOLEAN, str))
                break;

            case "char":
                tokenList.push(new Token(TokenType.CHAR, str))
                break;

            case "float":
                tokenList.push(new Token(TokenType.FLOAT, str))
                break;

            /* Cycles */

            case "for":
                tokenList.push(new Token(TokenType.FOR, str))
                break;

            case "do":
                tokenList.push(new Token(TokenType.DO, str))
                break;

            case "while":
                tokenList.push(new Token(TokenType.WHILE, str))
                break;

            /* Sentences */

            case "break":
                tokenList.push(new Token(TokenType.BREAK, str))
                break;

            case "continue":
                tokenList.push(new Token(TokenType.CONTINUE, str))
                break;

            case "return":
                tokenList.push(new Token(TokenType.RETURN, str))
                break;


            default:
                tokenList.push(new Token(TokenType.ID, str))
                break;
        }
    }

    ReturnTokens() {
        tokenList.forEach(element =>
            console.log("type: " + element.type, " --- value: " + element.value)
        )
    }

}
//module.exports = Scanner;