
var Token = require('./Token');

const TokenType = {
    SL_COMMENTARY: 'single line commentary',
    ML_COMMENTARY: 'multiline commentary',
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
    COMMA: 'comma',
    EQUAL: 'equal',
    ASSIGNATION: 'assignation',
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
    /*cycles (repetition sentences) */
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
    DOUBLE: 'double',
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
    TEXT_STRING: 'text string',
    EOF: 'eof',
    /* error */
    LEX_ERROR: 'lex error'




}
var tokenList = [];
var errorList = [];
var row = 1;
var column = 1;

// Scanner Java 
module.exports = class Scanner {
    constructor(text) {
        this.text = text;
        tokenList = []; // cleaning
        errorList = [];
        this.tokenList = tokenList;
        row = 1;
        column = 1;

    }

    scan() {

        var auxiliar = "";
        let source_code = "";
        source_code = this.text;
        let current_char = '';
        let state = 0;


        for (let i = 0; i < source_code.length; i++) {
            current_char = source_code.charAt(i);
            //console.log(current_char);
            /*
                Aceptation states:
                    - 
            */

            switch (state) {
                case 0:
                    //console.log("I'm in state 0");

                    if (this.isLetter(current_char)) {
                        auxiliar += current_char;
                        column++;
                        state = 6;
                    }
                    else if (this.isNumber(current_char)) {
                        auxiliar += current_char;
                        column++;
                        state = 7;
                    }
                    else if (current_char === "/") {
                        //auxiliar += current_char;
                        column++;
                        state = 1;
                    }
                    else if (current_char === "(") {
                        auxiliar += current_char;
                        column++;
                        tokenList.push(new Token(TokenType.LEFT_PAR, auxiliar, row, column - auxiliar.length));
                        auxiliar = "";
                        state = 0;
                    }
                    else if (current_char === ")") {
                        auxiliar += current_char;
                        column++;
                        tokenList.push(new Token(TokenType.RIGHT_PAR, auxiliar, row, column - auxiliar.length));
                        auxiliar = "";
                        state = 0;
                    }
                    else if (current_char === "[") {
                        auxiliar += current_char;
                        column++;
                        tokenList.push(new Token(TokenType.LEFT_BRACKET, auxiliar, row, column - auxiliar.length));
                        auxiliar = "";
                        state = 0;
                    }
                    else if (current_char === "]") {
                        auxiliar += current_char;
                        column++;
                        tokenList.push(new Token(TokenType.RIGHT_BRACKET, auxiliar, row, column - auxiliar.length));
                        auxiliar = "";
                        state = 0;
                    }
                    else if (current_char === "{") {
                        auxiliar += current_char;
                        column++;
                        tokenList.push(new Token(TokenType.LEFT_BRACE, auxiliar, row, column - auxiliar.length));
                        auxiliar = "";
                        state = 0;
                    }
                    else if (current_char === "}") {
                        auxiliar += current_char;
                        column++;
                        tokenList.push(new Token(TokenType.RIGHT_BRACE, auxiliar, row, column - auxiliar.length));
                        auxiliar = "";
                        state = 0;
                    }
                    else if (current_char === ".") {
                        auxiliar += current_char;
                        column++;
                        tokenList.push(new Token(TokenType.POINT, auxiliar, row, column - auxiliar.length));
                        auxiliar = "";
                        state = 0;
                    }
                    else if (current_char === ",") {
                        auxiliar += current_char;
                        column++;
                        tokenList.push(new Token(TokenType.COMMA, auxiliar, row, column - auxiliar.length));
                        auxiliar = "";
                        state = 0;
                    }
                    else if (current_char === ";") {
                        auxiliar += current_char;
                        column++;
                        tokenList.push(new Token(TokenType.SEMICOLON, auxiliar, row, column - auxiliar.length));
                        auxiliar = "";
                        state = 0;
                    }
                    else if (current_char === "=") {
                        auxiliar += current_char;
                        column++;
                        tokenList.push(new Token(TokenType.ASSIGNATION, auxiliar, row, column - auxiliar.length));
                        auxiliar = "";
                        state = 0;
                    }
                    else if (current_char === "|") {
                        auxiliar += current_char;
                        column++;
                        tokenList.push(new Token(TokenType.OR, auxiliar, row, column - auxiliar.length));
                        auxiliar = "";
                        state = 0;
                    }
                    else if (current_char === "&") {
                        auxiliar += current_char;
                        column++;
                        tokenList.push(new Token(TokenType.AND, auxiliar, row, column - auxiliar.length));
                        auxiliar = "";
                        state = 0;
                    }
                    else if (current_char === ">") {
                        auxiliar += current_char;
                        column++;
                        state = 9;
                    }
                    else if (current_char === "<") {
                        auxiliar += current_char;
                        column++;
                        state = 9;
                    }
                    else if (current_char === "!") {
                        auxiliar += current_char;
                        column++;
                        state = 9;
                    }
                    else if (current_char === "^") {
                        auxiliar += current_char;
                        column++;
                        tokenList.push(new Token(TokenType.XOR, auxiliar, row, column - auxiliar.length));
                        auxiliar = "";
                        state = 0;
                    }
                    else if (current_char === "+") {
                        auxiliar += current_char;
                        column++;
                        tokenList.push(new Token(TokenType.PLUS, auxiliar, row, column - auxiliar.length));
                        auxiliar = "";
                        state = 0;
                    }
                    else if (current_char === "-") {
                        auxiliar += current_char;
                        column++;
                        tokenList.push(new Token(TokenType.MINUS, auxiliar, row, column - auxiliar.length));
                        auxiliar = "";
                        state = 0;
                    }
                    else if (current_char === "*") {
                        auxiliar += current_char;
                        column++;
                        tokenList.push(new Token(TokenType.ASTERISK, auxiliar, row, column - auxiliar.length));
                        auxiliar = "";
                        state = 0;
                    }
                    else if (current_char === "/") {
                        auxiliar += current_char;
                        console.log("EFE");
                        column++;
                        tokenList.push(new Token(TokenType.SLASH, auxiliar, row, column - auxiliar.length));
                        auxiliar = "";
                        state = 0;
                    }
                    else if (current_char === "\"") {
                        auxiliar += current_char;
                        column++;
                        state = 12;
                    }
                    // others
                    else if (current_char === "\n") {
                        state = 0;
                        column = 1;
                        row++;
                    }
                    else if (current_char === "\t") {
                        state = 0;
                        column += 4;
                    } else if (current_char === " ") {
                        column++;
                    }
                    else {

                        // lex errors
                        auxiliar += current_char;
                        column++;
                        errorList.push(new Token(TokenType.LEX_ERROR, current_char, row, column - auxiliar.length));
                        auxiliar = "";
                        state = 0;

                    }

                    break;

                case 1:
                    //console.log("I'm in state 1");

                    if (current_char === "/") {
                        //auxiliar += current_char;
                        column++;
                        state = 2;
                    }
                    else if (current_char === "*") {
                        //auxiliar += current_char;
                        column++;
                        state = 3;
                    }/*else if(current_char === " "){
                        column++;
                        //console.log("/");
                        tokenList.push(new Token(TokenType.SLASH, "/", row, column -1));
                        //i--;
                        auxiliar = "";
                        state = 0;
                    }*/

                    break;

                case 2:
                    //console.log("I'm in state 2");
                    if (this.isLetter(current_char)) {
                        column++;
                        auxiliar += current_char;
                    }
                    else if (this.isNumber(current_char)) {
                        column++;
                        auxiliar += current_char;
                    }
                    else if (current_char === " ") {
                        column++;
                        auxiliar += current_char;
                    }
                    else if (current_char === "\n") {
                        column = 1;
                        row++;
                        // Acceptation single line comment
                        tokenList.push(new Token(TokenType.SL_COMMENTARY, auxiliar, row, column - auxiliar.length));
                        auxiliar = "";
                        state = 0;
                    }
                    else {
                        column++;
                        auxiliar += current_char;
                    }

                    break;

                case 3:

                    if (this.isLetter(current_char)) {
                        column++;
                        auxiliar += current_char;
                        state = 4;
                    }
                    else if (this.isNumber(current_char)) {
                        column++;
                        auxiliar += current_char;
                        state = 4;
                    }
                    else if (current_char === "\n") {
                        column = 1;
                        auxiliar += current_char;
                        state = 4;
                    }
                    else if (current_char === "*") {
                        column++;
                        auxiliar += current_char;
                        state = 3;
                    }
                    else if (current_char === "/") {
                        column++;
                        //auxiliar += current_char;
                        state = 5;
                    }

                    break;

                case 4:
                    if (this.isLetter(current_char)) {
                        column++;
                        auxiliar += current_char;
                        state = 4;
                    }
                    else if (this.isNumber(current_char)) {
                        column++;
                        auxiliar += current_char;
                        state = 4;
                    }
                    else if (current_char === "\n" || current_char === "\t") {
                        column = 1;
                        auxiliar += current_char;
                        state = 4;
                    }
                    else if (current_char === " ") {
                        column++;
                        auxiliar += current_char;
                        state = 4;
                    }
                    else if (current_char === "*") {
                        column++;
                        //auxiliar += current_char;
                        state = 3;
                    }
                    else {
                        column++;
                        auxiliar += current_char;
                    }

                    break;

                case 5:

                    // Acceptation
                    //console.log(auxiliar);
                    tokenList.push(new Token(TokenType.ML_COMMENTARY, auxiliar, row, column - auxiliar.length));
                    auxiliar = "";
                    state = 0;

                    break;

                case 6:

                    if (this.isLetter(current_char)) {
                        column++;
                        auxiliar += current_char;
                        state = 6;
                    }
                    else if (this.isNumber(current_char)) {
                        column++;
                        auxiliar += current_char;
                        state = 6;
                    }
                    else if (current_char === "_") {
                        column++;
                        auxiliar += current_char;
                        state = 6;
                    }
                    else {
                        this.addToken(auxiliar, row, column);
                        auxiliar = "";
                        i--;
                        state = 0;
                    }
                    break;

                case 7:

                    if (this.isNumber(current_char)) {
                        column++;
                        //console.log("Is a number -> ", current_char)
                        auxiliar += current_char;
                        state = 7;
                    }
                    else if (current_char === ".") {
                        column++;
                        auxiliar += current_char;
                        state = 8;
                    }
                    else if(current_char === "/"){
                        column++;
                        tokenList.push(new Token(TokenType.NUMBER, auxiliar, row, column - auxiliar.length));
                        tokenList.push(new Token(TokenType.SLASH, "/", row, column - auxiliar.length));
                        auxiliar = "";
                        console.log("/ xXDxd");
                    }
                    else {

                        tokenList.push(new Token(TokenType.NUMBER, auxiliar, row, column - auxiliar.length));
                        auxiliar = ""
                        state = 0;
                        i--;

                        
                    }

                    break;

                case 8:

                    if (this.isNumber(current_char)) {
                        column++;
                        auxiliar += current_char;
                        state = 8;
                    }
                    else {

                        tokenList.push(new Token(TokenType.NUMBER, auxiliar, row, column - auxiliar.length));
                        auxiliar = "";
                        state = 0;

                    }

                    break;

                case 9:

                    if (current_char === "=") {
                        column++;
                        auxiliar += current_char;
                    }
                    else {
                        this.addRelationalExp(auxiliar, row, column);
                        auxiliar = "";
                        state = 0;
                        i--;
                    }

                    break;

                case 10:

                    if (current_char === "+") {
                        column++;
                        auxiliar += current_char;
                    }
                    else {
                        this.addRelationalExp(auxiliar, row, column);
                        auxiliar = "";
                        state = 0;
                        i--;
                    }

                    break;

                case 11:

                    if (current_char === "-") {
                        column++;
                        auxiliar += current_char;
                    }
                    else {
                        this.addRelationalExp(auxiliar, row, column);
                        auxiliar = "";
                        state = 0;
                        i--;
                    }

                    break;

                case 12:

                    if (this.isLetter(current_char)) {
                        column++;
                        auxiliar += current_char;
                        state = 12;
                    }
                    else if (this.isNumber(current_char)) {
                        column++;
                        auxiliar += current_char;
                        state = 12;
                    }
                    else if (current_char === "\"") {
                        column++;
                        auxiliar += current_char;
                        state = 13;
                    }
                    else {
                        column++;
                        auxiliar += current_char;
                        state = 12;
                    }

                    break;

                case 13:

                    tokenList.push(new Token(TokenType.TEXT_STRING, auxiliar, row, column - auxiliar.length));
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

    addToken(str, row, column) {

        switch (str) {

            /* Keywords */
            case "public":
                tokenList.push(new Token(TokenType.PUBLIC, str, row, column - str.length))
                break;

            case "class":
                tokenList.push(new Token(TokenType.CLASS, str, row, column - str.length))
                break;

            case "static":
                tokenList.push(new Token(TokenType.STATIC, str, row, column - str.length))
                break;

            case "void":
                tokenList.push(new Token(TokenType.VOID, str, row, column - str.length))
                break;

            case "interface":
                tokenList.push(new Token(TokenType.INTERFACE, str, row, column - str.length))
                break;

            case "main":
                tokenList.push(new Token(TokenType.MAIN, str, row, column - str.length))
                break;

            case "System":
                tokenList.push(new Token(TokenType.SYSTEM, str, row, column - str.length))
                break;

            case "out":
                tokenList.push(new Token(TokenType.OUT, str, row, column - str.length))
                break;

            case "print":
                tokenList.push(new Token(TokenType.PRINT, str, row, column - str.length))
                break;

            case "println":
                tokenList.push(new Token(TokenType.PRINTLN, str, row, column - str.length))
                break;

            case "args":
                tokenList.push(new Token(TokenType.ARGS, str, row, column - str.length))
                break;

            /* Conditionals */

            case "if":
                tokenList.push(new Token(TokenType.IF, str, row, column - str.length))
                break;

            case "else":
                tokenList.push(new Token(TokenType.ELSE, str, row, column - str.length))
                break;

            /* Data types */

            case "int":
                tokenList.push(new Token(TokenType.INT, str, row, column - str.length))
                break;

            case "String":
                tokenList.push(new Token(TokenType.STRING, str, row, column - str.length))
                break;

            case "boolean":
                tokenList.push(new Token(TokenType.BOOLEAN, str, row, column - str.length))
                break;

            case "char":
                tokenList.push(new Token(TokenType.CHAR, str, row, column - str.length))
                break;

            case "float":
                tokenList.push(new Token(TokenType.FLOAT, str, row, column - str.length))
                break;

            case "double":
                tokenList.push(new Token(TokenType.DOUBLE, str, row, column - str.length))
                break;


            /* Cycles */

            case "for":
                tokenList.push(new Token(TokenType.FOR, str, row, column - str.length))
                break;

            case "do":
                tokenList.push(new Token(TokenType.DO, str, row, column - str.length))
                break;

            case "while":
                tokenList.push(new Token(TokenType.WHILE, str, row, column - str.length))
                break;

            /* Sentences */

            case "break":
                tokenList.push(new Token(TokenType.BREAK, str, row, column - str.length))
                break;

            case "continue":
                tokenList.push(new Token(TokenType.CONTINUE, str, row, column - str.length))
                break;

            case "return":
                tokenList.push(new Token(TokenType.RETURN, str, row, column - str.length))
                break;

            /* boolean statmentes */

            case "true":
                tokenList.push(new Token(TokenType.TRUE, str, row, column - str.length))
                break;

            case "false":
                tokenList.push(new Token(TokenType.FALSE, str, row, column - str.length))
                break;


            default:
                tokenList.push(new Token(TokenType.ID, str, row, column - str.length))
                break;
        }

    }

    addEOF() {

        tokenList.push(new Token(TokenType.EOF, 'End of file'));
    }

    addRelationalExp(str, row, column) {

        switch (str) {

            case '=':
                tokenList.push(new Token(TokenType.ASSIGNATION, str, row, column - str.length))
                break;

            case '==':
                tokenList.push(new Token(TokenType.EQUAL, str, row, column - str.length))

                break;

            case '>=':
                tokenList.push(new Token(TokenType.GREATER_OR_EQUAL_THAN, str, row, column - str.length))
                break;

            case '<=':
                tokenList.push(new Token(TokenType.LESS_OR_EQUAL_THAN, str, row, column - str.length))
                break;

            case '!=':
                tokenList.push(new Token(TokenType.NOT, str, row, column - str.length))
                break;

            case '<':
                tokenList.push(new Token(TokenType.LESS_THAN, str, row, column - str.length))
                break;

            case '>':
                tokenList.push(new Token(TokenType.GREATER_THAN, str, row, column - str.length))
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
        
        return errorList;
        /*
        errorList.forEach(element => {
            console.log("type: " + element.type, " --- value: " + element.value + " --- row: " + element.row + " --- column: " + row.column);
        })*/
    }
}
