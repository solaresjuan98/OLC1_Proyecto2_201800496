
//
const TokenType = {
    COMENT: 'commentary',
    STRING: 'string',
    PR_CLASS: 'Pr_class',
    PR_STATIC: 'Pr_static',
    PR_VOID: 'Pr_void'

}

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
        let tokenList = [];

        for (let i = 0; i < source_code.length; i++) {
            current_char = source_code.charAt(i);
            /*
                Aceptation states:
                    - 
            */

            switch (state) {
                case 0:
                    console.log("I'm in state 0");

                    if (this.isLetter(current_char)) {
                        //console.log("Is a letter -> ", current_char);
                    }
                    else if (this.isNumber(current_char)) {
                        //console.log("Is a number -> ", current_char)
                    }
                    else if (current_char === "/") {
                        auxiliar += current_char;
                        state = 1;
                    }
                    else {
                        //console.log("Is not a letter -> ", current_char);
                    }

                    break;

                case 1:
                    console.log("I'm in state 1");

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
                    console.log("I'm in state 2");
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
                        // Acceptation
                        console.log(auxiliar);
                        auxiliar
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
                    console.log(auxiliar);
                    auxiliar = "";
                    state = 0;

                    break;
            }

            //console.log(current_char);
            // Scan source code and collect tokens

        }

        console.log(auxiliar);

    }

    // Check if a char is a letter
    isLetter(char) {
        return char.length === 1 && char.match(/[a-zA-Z]/i);
    }

    // Check if a char is a number
    isNumber(char) {
        return char.length === 1 && char.match(/[0-9]/i);
    }

    ReturnTokens() {

    }

}
//module.exports = Scanner;