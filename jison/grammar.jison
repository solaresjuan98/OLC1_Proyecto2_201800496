/** imports **/
%{
    const Node = require('./TreeNode');
%}

/*********************** lex ***************************/
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
"System"             %{ return 'token_System';%}
"out"             %{ return 'token_out';%}
"print"             %{ return 'token_print';%}
"println"             %{ return 'token_println';%}

/* return, break and continue */
"return"             %{ return 'token_return';%}
"break"             %{ return 'token_break';%}
"continue"             %{ return 'token_continue';%}

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

/* increase or decrease */
"++"             %{ return 'increase';%}
"--"             %{ return 'decrease';%}

/* logical */
"&&"             %{ return 'and';%}
"||"             %{ return 'or';%}
"!"              %{ return 'not';%}
"^"              %{ return 'xor';%}

/* relational */
"<"              %{ return 'less_than';%}
">"              %{ return 'greater_than';%}
">="             %{ return 'greater_or_equal_than';%}
"<="             %{ return 'less_or_equal_than';%}
"=="             %{ return 'equal_equal';%}
"!="             %{ return 'different';%}

/* puntuation symbols */
";"             %{ return 'token_semicolon';%}
","             %{ return 'token_comma';%}
"."             %{ return 'token_point';%}


/*
    qm -> quotation mark
    sq -> single quotation
*/
\"[^"]*\"       %{ return 'text_string_qm'; %}
\'[^"]*\'       %{ return 'text_string_sq'; %}
\/\*(\*(?!\/)|[^*])*\*\/\ %{ return 'ml_commentary'; %}

/* Regular expressions */
["][a-zA-Z][a-zA-Z0-9_]*[""] %{return 'string';%}
[0-9]+\b            %{ return 'token_number';%}
[0-9]+("."[0-9]+)?\b    %{ return 'token_decimal';%} 
[a-zA-Z][a-zA-Z0-9_]*           %{ return 'token_Identifier';%}
[ \t\r\n\f]+        {/* ignore this */}

<<EOF>>     %{ return 'EOF';%}
.           { console.log('Lexical error: ' + yytext + ' in line: ' + yylloc.first_line + ' , in column: ' + yylloc.first_column); }

/lex

/* parser */

%left token_plus token_minus 
%left token_asterisk token_slash
%left token_left_parenthesis token_right_parenthesis
//%left unarios

%start S 
%%

S: LIST EOF {
              $$ = new Node("LIST", "");
              $$.addChild($1);
              return $$;

            };

LIST: CLASSLIST {$$ = new Node("CLASSLIST"); $$.addChild($1); }
    | INTERFACELIST  
    | MAIN_METHOD
    | EOF ;



/*------------------*/
/* main method */
MAIN_METHOD: token_public token_static token_void token_main token_left_parenthesis token_string token_left_bracket token_right_bracket token_args token_right_parenthesis token_left_brace token_right_brace ;

/*------------------*/
/* classes */

CLASSLIST: CLASSLIST CLASS {
                             $$ = new Node("CLASSLIST", ""); 
                             $$.addChild($1);  
                             $$.addChild($2);  
                           }
         | CLASS {
                    $$ = new Node("CLASSLIST", "");
                    $$.addChild($1);
                 };

CLASS: token_public token_class token_Identifier token_left_brace METHOD_LIST token_right_brace  { $$ = new Node("CLASS_DEF", "CLASS_DEF"); $$.addChild(new Node($3, "id")); $$.addChild($5); }
    | error token_right_brace {console.log(" (CLASS) Sintax error [ row: " + this._$.first_line + ", column: " + this._$.first_column +" ] ");} ;

/*------------------*/
/* Interfaces */
INTERFACELIST: INTERFACELIST INTERFACE 
            | INTERFACE ;

INTERFACE: token_public token_interface token_Identifier token_left_brace token_right_brace 
    | error {console.log(" (INTERFACE) Sintax error [ row: " + this._$.first_line + ", column: " + this._$.first_column +" ] ");} ;


/*------------------*/
/* list of methods of a class */
METHOD_LIST: METHOD_LIST METHOD_IMPLEMENTATION { 
                            $$ = new Node("METHOD_LIST", ""); 
                            $$.addChild($1);
                            $$.addChild($2);
                          }//METHOD_DEF
           | METHOD_IMPLEMENTATION {
                                    $$ = new Node("M_IMPL", "");
                                    $$.addChild($1);
                                    } ;

/* method definition  (change to implementation) */
METHOD_IMPLEMENTATION: token_public METHOD_DATA_TYPE token_Identifier token_left_parenthesis PARAMETERS_LIST token_right_parenthesis token_left_brace INSTRUCTIONS_LIST token_right_brace 
                     { $$ = new Node("PAR", "");  
                       $$.addChild($2); 
                       $$ = new Node($3, "id");  
                       $$.addChild($5);
                       $$.addChild($8);
                       /*put instructions*/
                     }
         | error token_right_brace {console.log(" (METHOD_DEF) Sintax error [ row: " + this._$.first_line + ", column: " + this._$.first_column +" ] ");} ;


/* patermeters  */
PARAMETERS_LIST: PARAMETERS_LIST PARAMETER { 
                            $$ = new Node("PAR_LIST", ""); 
                            $$.addChild($1);
                            $$.addChild($2);
                          }
               | PARAMETER {
                             $$ = new Node("PARAMETER", "");
                             $$.addChild($1);
                            }                        
               | error {console.log(" (PARAMETERS_LIST) Sintax error [ row: " + this._$.first_line + ", column: " + this._$.first_column +" ] ");} ;

PARAMETER: DATA_TYPE token_Identifier {
                                         $$ = new Node("PAR", "");  
                                         $$.addChild($1);
                                         $$.addChild(new Node($2, "id"));                      
                                      }
          | token_comma DATA_TYPE token_Identifier {
                                                     $$ = new Node("PAR", "");  
                                                     $$.addChild($2);
                                                     $$.addChild(new Node($3, "id"));       
                                                   } ;
          //| error token_right_brace {console.log(" (PAREMETER) Sintax error [ row: " + this._$.first_line + ", column: " + this._$.first_column +" ] ");} ;

/*  instructions */

INSTRUCTIONS_LIST: INSTRUCTIONS_LIST INSTRUCTIONS {
                                    $$ = new Node("INST_LIST", "");  
                                    $$.addChild($1);
                                    $$.addChild($2);
                                    //$$.addChild(new Node($2, "id"));                      
                                }
                | INSTRUCTIONS {
                                    $$ = new Node("INST_LIST", "");  
                                    $$.addChild($1);
                                    //$$.addChild(new Node($3, "id"));       
                                };

INSTRUCTIONS : VAR_DECLARATION { $$ = new Node("VAR_DEC", ""); $$.addChild($1); }
             | PRINT_INST { $$ = new Node("INST_PRINT", ""); $$.addChild($1);  }
             | ASSIGNATION { $$ = new Node("ASSIGNATION", ""); $$.addChild($1); }
             | METHOD_CALL { $$ = new Node("METHOD_CALL", ""); $$.addChild($1); }
             /* if - (else if) else */
             | RETURN_STATEMENT { $$ = new Node("RETURN", "")}
             | error token_semicolon {console.log(" (INSTRUCTIONS) Sintax error [ row: " + this._$.first_line + ", column: " + this._$.first_column +" ] ");} ;


PRINT_INST : token_System token_point token_out token_point token_print token_left_parenthesis text_string_qm token_right_parenthesis token_semicolon 
            {
                $$ = new Node("print", "print");
                $$.addChild(new Node($5, "print"));
                //$$ = new Node("PRINT", "print");
            }
           | token_System token_point token_out token_point token_println token_left_parenthesis text_string_qm token_right_parenthesis token_semicolon
           | token_System token_point token_out token_point token_print token_left_parenthesis token_Identifier token_right_parenthesis token_semicolon ; //| error {console.log(" (PRINT_INST) Sintax error [ row: " + this._$.first_line + ", column: " + this._$.first_column +" ] ");} ;


/* Simple value variable declaration */
VAR_DECLARATION : DATA_TYPE token_Identifier token_equal E token_semicolon 
                 {
                     $$.addChild(new Node("Type", "type"));
                     $$.addChild(new Node($2, "id"));
                     $$.addChild(new Node($3, "equal"));
                     $$.addChild($4);
                 }
                | DATA_TYPE token_Identifier token_equal token_true token_semicolon
                {
                     $$.addChild(new Node("Type", "type"));
                     $$.addChild(new Node($2, "id"));
                     $$.addChild(new Node($3, "equal"));
                     $$.addChild(new Node($4, "true"));
                 }

                | DATA_TYPE token_Identifier token_equal token_false token_semicolon
                {
                     $$.addChild(new Node("Type", "type"));
                     $$.addChild(new Node($2, "id"));
                     $$.addChild(new Node($3, "equal"));
                     $$.addChild(new Node($4, "false"));
                 }
                | DATA_TYPE token_Identifier token_equal text_string_qm token_semicolon
                {
                     $$.addChild(new Node("Type", "type"));
                     $$.addChild(new Node($2, "id"));
                     $$.addChild(new Node($3, "equal"));
                     $$.addChild(new Node($4, "text_string"));
                 }
                | DATA_TYPE token_Identifier token_semicolon
                {
                     $$.addChild(new Node("Type", "type"));
                     $$.addChild(new Node($2, "id"));
                     //$$.addChild(new Node($3, "equal"));
                     //$$.addChild($4);
                 };
                //| DATA_TYPE token_Identifier token_equal token_number token_comma VAR_LIST  ;//| error {console.log(" (VAR_DECLARATION) Sintax error [ row: " + this._$.first_line + ", column: " + this._$.first_column +" ] ");} ;

/* A list of variables (change token_number -> EXPR) */
VAR_LIST: token_Identifier token_equal EXPR token_comma VAR_LIST
        | token_Identifier token_comma VAR_LIST
        | token_Identifier token_equal EXPR  token_semicolon
        | token_Identifier token_semicolon ;


/* an assignation of a variable */
ASSIGNATION: token_Identifier token_equal E token_semicolon 
            {
                $$ = new Node("Asgn", "asgn");
                $$.addChild(new Node("d", "id"));
                $$.addChild(new Node($2, "equal"));
                $$.addChild($3);

            };

/* Calling a method*/
METHOD_CALL: token_Identifier token_left_parenthesis PARAMETER_LIST /* list of parameters */ token_right_parenthesis token_semicolon ;


/* Aritmetical expression */
EXPR_LIST: EXPR EXPR_LIST { 
                            $$ = new Node("EXPR_LIST", ""); 
                            $$.addChild($1);
                            $$.addChild($2);
                          }
        | EXPR { 
                $$ = new Node("EXPR_LIST", "");
                $$.addChild($1);
                } ;

EXPR : E /*token_semicolon*/ { 
                          $$ = new Node("EXPR", "");
                          $$.addChild(new Node("expression", "expression"));
                          $$.addChild($1); 
                            
                        }
    ;//| error token_semicolon {console.log(" (EXPR) Sintax error [ row: " + this._$.first_line + ", column: " + this._$.first_column +" ] ");} ;


E: E token_plus E { 
                    $$ = new Node("E", ""); 
                    $$.addChild($1);
                    $$.addChild(new Node("+", "plus"));
                    $$.addChild($3);
                    
                    }
                    
 | E token_minus E { 
                    $$ = new Node("E", ""); 
                    $$.addChild($1);
                    $$.addChild(new Node("-", "min"));
                    $$.addChild($3);
                    
                    }
 | E token_asterisk E { 
                    $$ = new Node("E", ""); 
                    $$.addChild($1);
                    $$.addChild(new Node("*", "mult"));
                    $$.addChild($3);
                    }
 | E token_slash E {
                    
                    $$ = new Node("E", ""); 
                    $$.addChild($1);
                    $$.addChild(new Node("/", "div"));
                    $$.addChild($3);
                    
                    }
 | token_left_parenthesis E token_right_parenthesis {  $$ = new Node("E", ""); $$.addChild($2); }
 | token_number { $$ = new Node($1, "number"); }
 | token_Identifier { $$ = new Node($1, "identifier"); }
 | token_left_parenthesis error token_semicolon {console.log(" Sintax error [ row: " + this._$.first_line + ", column: " + this._$.first_column +" ] ");} ;



/* list of parameters */
PARAMETER_LIST: token_Identifier token_comma PARAMETER_LIST
              | token_true token_comma PARAMETER_LIST
              | token_false token_comma PARAMETER_LIST
              | token_number token_comma PARAMETER_LIST
              | text_string_qm token_comma PARAMETER_LIST
              | text_string_sq token_comma PARAMETER_LIST
              | token_Identifier
              | token_number 
              | token_true
              | token_false 
              | text_string_qm
              | text_string_sq ;


/* return statement  */
RETURN_STATEMENT : token_return token_number token_semicolon 
                 | token_return token_Identifier token_semicolon 
                 | token_return token_true token_semicolon
                 | token_return token_false token_semicolon
                 | token_return text_string_qm token_semicolon
                 | token_return text_string_sq token_semicolon ;

/*---------------------------------------------------------------------------------------------------------*/
/* Data types OF A METHOD */
METHOD_DATA_TYPE: token_int {$$ = new Node("int", "int");}
         | token_string {$$ = new Node("String", "String");}
         | token_void {$$ = new Node("void", "void");}
         | token_char {$$ = new Node("char", "char");}
         | token_double {$$ = new Node("double", "double");}
         | token_boolean {$$ = new Node("boolean", "boolean");} ;
         //| error token_right_brace {console.log(" ** Sintax error [ row: " + this._$.first_line + ", column: " + this._$.first_column +" ] ");} ;


DATA_TYPE: token_int {$$ = new Node("int", "int");}
         | token_string {$$ = new Node("String", "String");}
         | token_double {$$ = new Node("double", "double");}
         | token_char {$$ = new Node("char", "char");}
         | token_boolean {$$ = new Node("boolean", "boolean");}
         ; //| error token_semicolon {console.log(" (DATA_TYPE) Sintax error [ row: " + this._$.first_line + ", column: " + this._$.first_column +" ] ");} ;
