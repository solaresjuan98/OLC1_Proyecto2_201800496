

/**************************************************/
%lex 
%options case-sensitive
%%

\s+         /* blank spaces */
/* keywords */
"public"            %{ return 'token_public';%}
"class"             %{ return 'token_class';%}
"static"             %{ return 'token_static';%}
"void"             %{ return 'token_void';%}
"if"             %{ return 'token_if';%}
"else"             %{ return 'token_else';%}
"for"             %{ return 'token_for';%}
"do"             %{ return 'token_do';%}
"while"             %{ return 'token_while';%}
"args"             %{ return 'token_args';%}
"true"             %{ return 'token_true';%}
"false"             %{ return 'token_false';%}
"interface"             %{ return 'token_interface';%}
"main"             %{ return 'token_main';%}
/* Data types */
"String"             %{ return 'token_string';%}
"int"             %{ return 'token_int';%}
"char"             %{ return 'token_char';%}
"boolean"             %{ return 'token_boolean';%}
"double"             %{ return 'token_double';%}

/* Delimiters */
"{"             %{ return 'token_left_brace';%}
"}"             %{ return 'token_right_brace';%}
"("             %{ return 'token_left_parenthesis';%}
")"             %{ return 'token_right_parenthesis';%}
"["             %{ return 'token_left_bracket';%}
"]"             %{ return 'token_right_bracket';%}


/* arithmetical */
"+"             %{ return 'token_plus';%}
"-"             %{ return 'token_minus';%}
"*"             %{ return 'token_asterisk';%}
"/"             %{ return 'token_slash';%}
"="             %{ return 'token_equal';%}

/* puntuation symbols */
";"             %{ return 'token_semicolon';%}
","             %{ return 'token_comma';%}
"."             %{ return 'token_point';%}

/* Regular expressions */
["][a-zA-Z][a-zA-Z0-9_]*[""] %{return 'string';%}
[0-9]+\b            %{ return 'token_number';%}
[0-9]+("."[0-9]+)?\b    %{ return 'token_decimal';%} 
[a-zA-Z][a-zA-Z0-9_]*           %{ return 'token_Identifier';%}
[ \t\r\n\f]+        {/* ignore this */}

<<EOF>>     %{ return 'EOF';%}
.           { console.log('Lexical error: ' + yytext + ' in line: ' + yylloc.first_line + ' , in column: ' + yylloc.first_column); }

/lex

/* Sintax */
%start S 
%%

S: LIST EOF ;

LIST: CLASSLIST 
    | INTERFACELIST  
    | MAIN_METHOD
    | EOF ;



/*------------------*/
/* main method */
MAIN_METHOD: token_public token_static token_void token_main token_left_parenthesis token_string token_left_bracket token_right_bracket token_args token_right_parenthesis token_left_brace token_right_brace ;

/*------------------*/
/* classes */

CLASSLIST: CLASSLIST CLASS
         | CLASS ;

CLASS: token_public token_class token_Identifier token_left_brace METHOD_LIST token_right_brace  
    | error token_right_brace {console.log(" (CLASS) Sintax error [ row: " + this._$.first_line + ", column: " + this._$.first_column +" ] ");} ;

/*------------------*/
/* Interfaces */
INTERFACELIST: INTERFACELIST INTERFACE 
            | INTERFACE ;

INTERFACE: token_public token_interface token_Identifier token_left_brace token_right_brace 
    | error {console.log(" (INTERFACE) Sintax error [ row: " + this._$.first_line + ", column: " + this._$.first_column +" ] ");} ;


/*------------------*/
/* method definition */
METHOD_DEF: token_public METHOD_DATA_TYPE token_Identifier token_left_parenthesis PARAMETERS_LIST token_right_parenthesis token_left_brace token_right_brace
         | error token_right_brace {console.log(" (METHOD_DEF) Sintax error [ row: " + this._$.first_line + ", column: " + this._$.first_column +" ] ");} ;

/* list of methods */
METHOD_LIST: METHOD_LIST METHOD_DEF
           | METHOD_DEF ;

PARAMETERS_LIST: PARAMETERS_LIST PARAMETER
               | PARAMETER                        
               | error {console.log(" (PARAMETERS_LIST) Sintax error [ row: " + this._$.first_line + ", column: " + this._$.first_column +" ] ");} ;

PARAMETER: DATA_TYPE token_Identifier
          | token_comma DATA_TYPE token_Identifier 
          | error token_right_brace {console.log(" (PAREMETER) Sintax error [ row: " + this._$.first_line + ", column: " + this._$.first_column +" ] ");} ;

/* inner instructions */

/* Data types */
METHOD_DATA_TYPE: token_int
         | token_string
         | token_void 
         | token_char ;
         //| error token_right_brace {console.log(" ** Sintax error [ row: " + this._$.first_line + ", column: " + this._$.first_column +" ] ");} ;


DATA_TYPE: token_int
         | token_string
         | token_double 
         | token_char
         | error token_semicolon {console.log(" (DATA_TYPE) Sintax error [ row: " + this._$.first_line + ", column: " + this._$.first_column +" ] ");} ;
