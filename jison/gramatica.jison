
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

%start S 
%%

S: LIST ;

LIST: token_public LISTP LIST 
    | TYPE DECLARATION LIST
    | EOF
    | error EOF {console.log(" >> Sintax error on line: " + this._$.first_line + " on column:  " + this._$.first_column);} ;
    

LISTP: token_static MAINP 
     | token_class CLASS_DEF 
     | token_interface INTERFACE_DEF;
    
/*----------------------------------------------------------*/
INSTRUCTIONS: TYPE DECLARATION INSTRUCTIONS
            | token_Identifier ASSIGNATION
            | /**/;


MAINP: token_void token_main token_left_parenthesis token_string token_left_bracket token_right_bracket token_args token_right_parenthesis token_left_brace token_right_brace 
     | error token_right_brace {console.log(" (MAIN) Sintax error on line: " + this._$.first_line + " on column:  " + this._$.first_column);} ;

CLASS_DEF: token_Identifier token_left_brace INSTRUCTIONS token_right_brace 
         | error token_right_brace {console.log(" >> Sintax error on line: " + this._$.first_line + " on column:  " + this._$.first_column);} ;

INTERFACE_DEF: token_Identifier token_left_brace token_right_brace 
         | error token_right_brace {console.log(" >> Sintax error on line: " + this._$.first_line + " on column:  " + this._$.first_column);} ;


/* variables */
DECLARATION: token_Identifier token_equal EXPR token_semicolon
           | error token_semicolon {console.log(" - Sintax error on line: " + this._$.first_line + " on column:  " + this._$.first_column);};

/*
DECLARATION_P: token_equal VALUE VAR_LIST
             | VAR_LIST ;
             //| error token_semicolon {console.log(" - Sintax error on line: " + this._$.first_line + " on column:  " + this._$.first_column);};
*/


ASSIGNATION: token_equal EXPR token_semicolon ;

VALUE: EXPR
     | error token_semicolon {console.log(" - Sintax error on line: " + this._$.first_line + " on column:  " + this._$.first_column);};




/* data types */
TYPE: token_int
    | token_string
    | token_char
    | token_boolean ;
    //| error token_semicolon {console.log("Sintax error on line: " + this._$.first_line + " on column:  " + this._$.first_column);};

/* Aritmethical expressions */
EXPR: E ;

E: T EP ;

EP: token_plus T EP 
  | token_minus T EP
  | /* nothing */ ;

T: F TP ;

TP: token_asterisk F TP
  | token_slash F TP
  | /* nothing */ ;

F: token_number
 | token_Identifier
 | token_left_parenthesis token_Identifier token_right_parenthesis ;


