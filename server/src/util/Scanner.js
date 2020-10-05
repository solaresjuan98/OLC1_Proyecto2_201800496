
var Token = require('./Token');

const TokenType = {
    COMMENT: 'commentary',
    /* Keywords */
    CLASS: 'class',
    STATIC: 'static',
    PUBLIC: 'public',
    VOID: 'void',
    MAIN: 'main',
    INTERFACE: 'interface',
    SYSTEM: 'system',
    OUT: 'out',
    PRINT: 'print',
    PRINTLN: 'println',
    ARGS: 'args',
    TRUE: 'true',
    FALSE: 'false',
    /* ----- */
    NUMBER: 'number',
    ID: 'Identifier',
    /* ----- */
    POINT: 'point',
    EQUAL: 'equal',
    ASSIGNATION: 'asignation',
    /* Delimeters */
    LEFT_PAR: 'Left parenthesis',
    RIGHT_PAR: 'Right parenthesis',
    LEFT_BRACE: 'Left brace',
    RIGHT_BRACE: 'Right brace',
    SEMICOLON: 'Semicolon',
    LEFT_BRACKET: 'Left bracket',
    RIGHT_BRACKET: 'Right bracket',
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
    STRING: 'String',
    BOOLEAN: 'boolean',
    FLOAT: 'float',
    CHAR: 'char',
    /* LOGICAL EXPRESSIONS  */
    AND: 'and',
    OR: 'or',
    NOT: 'not',
    XOR: 'xor',
    /* RELATIONAL */
    LESS_THAN: 'less than',
    GREATER_THAN: 'greater than',
    LESS_OR_EQUAL_THAN: 'less or equal than',
    GREATER_OR_EQUAL_THAN: 'greater or equal than',
    /* ARITMETHICAL  */
    PLUS: 'plus',
    MINUS: 'minus',
    ASTERISK: 'asterisk',
    SLASH: 'slash',
    /*  others */
    TEXT_STRING: 'text string'



}
var tokenList = [];
var errorList = [];
var row = 1;
// Scanner Java 
module.exports = class Scanner {
    constructor(text) {
        this.text = text;
        tokenList = []; // cleaning
        this.tokenList = tokenList;
        row = 1;

    }

    scan() {

        var auxiliar = "";
        let source_code = "";
        source_code = this.text;
        let current_char = '';
        let state = 0;

        var column = 1;



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
                        auxiliar += current_char;
                        state = 6;
                    }
                    else if (this.isNumber(current_char)) {
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
                    else if (current_char === "[") {
                        auxiliar += current_char;
                        tokenList.push(new Token(TokenType.LEFT_BRACKET, auxiliar));
                        auxiliar = "";
                        state = 0;
                    }
                    else if (current_char === "]") {
                        auxiliar += current_char;
                        tokenList.push(new Token(TokenType.RIGHT_BRACKET, auxiliar));
                        auxiliar = "";
                        state = 0;
                    }
                    else if (current_char === "{") {
                        auxiliar += current_char;
                        tokenList.push(new Token(TokenType.LEFT_BRACE, auxiliar));
                        auxiliar = "";
                        state = 0;
                    }
                    else if (current_char === "}") {
                        auxiliar += current_char;
                        tokenList.push(new Token(TokenType.RIGHT_BRACE, auxiliar));
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
                    }
                    else if (current_char === "|") {
                        auxiliar += current_char;
                        tokenList.push(new Token(TokenType.OR, auxiliar));
                        auxiliar = "";
                        state = 0;
                    }
                    else if (current_char === "&") {
                        auxiliar += current_char;
                        tokenList.push(new Token(TokenType.ASSIGNATION, auxiliar));
                        auxiliar = "";
                        state = 0;
                    }
                    else if (current_char === ">") {
                        auxiliar += current_char;
                        state = 9;
                    }
                    else if (current_char === "<") {
                        auxiliar += current_char;
                        state = 9;
                    }
                    else if (current_char === "!") {
                        auxiliar += current_char;
                        state = 9;
                    }
                    else if (current_char === "^") {
                        auxiliar += current_char;
                        tokenList.push(new Token(TokenType.XOR, auxiliar));
                        auxiliar = "";
                        state = 0;
                    }
                    else if (current_char === "+") {
                        auxiliar += current_char;
                        tokenList.push(new Token(TokenType.PLUS, auxiliar));
                        auxiliar = "";
                        state = 0;
                    }
                    else if (current_char === "-") {
                        auxiliar += current_char;
                        tokenList.push(new Token(TokenType.MINUS, auxiliar));
                        auxiliar = "";
                        state = 0;
                    }
                    else if (current_char === "*") {
                        auxiliar += current_char;
                        tokenList.push(new Token(TokenType.ASTERISK, auxiliar));
                        auxiliar = "";
                        state = 0;
                    }
                    else if (current_char === "/") {
                        auxiliar += current_char;
                        tokenList.push(new Token(TokenType.SLASH, auxiliar));
                        auxiliar = "";
                        state = 0;
                    }
                    else if (current_char === "\"") {
                        auxiliar += current_char;
                        state = 12;
                    }
                    // others
                    else if (current_char === "\n") {
                        state = 0;
                        row++;
                    }
                    else if (current_char === "\t") {
                        state = 0;
                        //row++;
                    }
                    else {
                        //auxiliar += current_char;
                        if (current_char !== "\n" || current_char !== "") {
                            errorList.push(current_char);
                            auxiliar = "";
                            state = 0;
                        }
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
                        //tokenList.push(new Token(TokenType.COMMENT, auxiliar));
                        auxiliar = "";
                        state = 0;
                    }
                    else {
                        auxiliar += current_char;
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
                    else {
                        auxiliar += current_char;
                    }

                    break;

                case 5:

                    // Acceptation
                    //console.log(auxiliar);
                    //tokenList.push(new Token(TokenType.COMMENT, auxiliar));
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
                        i--;
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
                    }
                    else {
                        this.addRelationalExp(auxiliar);
                        auxiliar = "";
                        state = 0;
                        i--;
                    }

                    break;

                case 10:

                    if (current_char === "+") {
                        auxiliar += current_char;
                    }
                    else {
                        this.addRelationalExp(auxiliar);
                        auxiliar = "";
                        state = 0;
                        i--;
                    }

                    break;

                case 11:

                    if (current_char === "-") {
                        auxiliar += current_char;
                    }
                    else {
                        this.addRelationalExp(auxiliar);
                        auxiliar = "";
                        state = 0;
                        i--;
                    }

                    break;

                case 12:

                    if (this.isLetter(current_char)) {
                        auxiliar += current_char;
                        state = 12;
                    }
                    else if (this.isNumber(current_char)) {
                        auxiliar += current_char;
                        state = 12;
                    }
                    else if (current_char === "\"") {
                        auxiliar += current_char;
                        state = 13;
                    }
                    else {
                        auxiliar += current_char;
                        state = 12;
                    }

                    break;

                case 13:

                    tokenList.push(new Token(TokenType.TEXT_STRING, auxiliar));
                    auxiliar = "";
                    state = 0;
                    i--;
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

            /* Keywords */
            case "public":
                tokenList.push(new Token(TokenType.PUBLIC, str))
                break;

            case "class":
                tokenList.push(new Token(TokenType.CLASS, str))
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

            case "System":
                tokenList.push(new Token(TokenType.SYSTEM, str))
                break;

            case "print":
                tokenList.push(new Token(TokenType.PRINT, str))
                break;

            case "println":
                tokenList.push(new Token(TokenType.PRINTLN, str))
                break;

            case "args":
                tokenList.push(new Token(TokenType.ARGS, str))
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

            case "String":
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

            /* boolean statmentes */

            case "true":
                tokenList.push(new Token(TokenType.TRUE, str))
                break;

            case "false":
                tokenList.push(new Token(TokenType.FALSE, str))
                break;


            default:
                tokenList.push(new Token(TokenType.ID, str))
                break;
        }

    }

    addRelationalExp(str) {

        switch (str) {

            case '=':
                tokenList.push(new Token(TokenType.ASSIGNATION, str))
                break;

            case '==':
                tokenList.push(new Token(TokenType.EQUAL, str))

                break;

            case '>=':
                tokenList.push(new Token(TokenType.GREATER_OR_EQUAL_THAN, str))
                break;

            case '<=':
                tokenList.push(new Token(TokenType.LESS_OR_EQUAL_THAN, str))
                break;

            case '!=':
                tokenList.push(new Token(TokenType.NOT, str))
                break;

            case '<':
                tokenList.push(new Token(TokenType.LESS_THAN, str))
                break;

            case '>':
                tokenList.push(new Token(TokenType.GREATER_THAN, str))
                break;

            default:
                break;
        }
    }

    addAritmethicalExp(str) {

        switch (str) {

            case "++":

                break;

            case "--":

                break;
        }
    }

    ReturnTokens() {
        tokenList.forEach(element =>
            console.log("type: " + element.type, " --- value: " + element.value)
        )

        console.log(row);
    }

    ReturnLexErrors() {
        errorList.forEach(element => {
            console.log(element);
        })
    }
}
