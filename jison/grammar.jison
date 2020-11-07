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
\/\*(\*(?!\/)|[^*])*\*\/ %{ return 'ml_commentary'; %}

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
%left token_else
%left or
%left and
%left equal_equal different
%left greater_or_equal_than less_or_equal_than /**/ less_than  greater_than
%left token_plus token_minus 
%left token_asterisk token_slash
%left token_left_parenthesis token_right_parenthesis
//%left unarios

%start S 
%%

S: LIST EOF {
              $$ = new Node("LIST", "NON_TERMINAL");
              $$.addChild($1);
              return $$;

            };


LIST:  CLASSLIST {$$ = new Node("CLASSLIST", "NON_TERMINAL"); $$.addChild($1); }
     | INTERFACELIST  
     | FUNCTION_LIST { $$ = new Node("FUNCTION_LIST", "NON_TERMINAL"); $$.addChild($1); }
     | EOF ;



/*------------------*/
/* main method */
MAIN_METHOD: token_public token_static 
            token_void token_main token_left_parenthesis 
            token_string token_left_bracket token_right_bracket 
            token_args token_right_parenthesis token_left_brace INSTRUCTIONS_LIST
            token_right_brace
            {
                $$ = new Node("main method", "NON_TERMINAL");
                $$.addChild(new Node($1, "public"));
                $$.addChild(new Node($2, "static"));
                $$.addChild(new Node($3, "void"));
                $$.addChild(new Node($4, "main"));
                $$.addChild(new Node($5, "("));
                $$.addChild(new Node($6, "String"));
                $$.addChild(new Node($7, "["));
                $$.addChild(new Node($8, "]"));
                $$.addChild(new Node($9, "args"));
                $$.addChild(new Node($10, ")"));
                $$.addChild(new Node($11, "{"));
                $$.addChild($12);
                $$.addChild(new Node($13, "}"));

            } ;

/*------------------*/
/* classes */

CLASSLIST: CLASSLIST CLASS {
                             $$ = new Node("CLASSLIST", "NON_TERMINAL"); 
                             $$.addChild($1);  
                             $$.addChild($2);  
                           }
         | CLASS {
                    $$ = new Node("CLASS", "NON_TERMINAL");
                    $$.addChild($1);
                 };

CLASS: token_public token_class token_Identifier token_left_brace METHOD_LIST token_right_brace
 { $$ = new Node("CLASS_DEF", "NON_TERMINAL");
   $$.addChild(new Node($2, "class")); 
   $$.addChild(new Node($3, "id")); 
   $$.addChild(new Node($4, "{"));
   $$.addChild($5);
   $$.addChild(new Node($6, "}"));

 }
;//| error token_right_brace {console.log(" (CLASS) Sintax error [ row: " + this._$.first_line + ", column: " + this._$.first_column +" ] ");} ;

/*------------------*/
/* Interfaces */
INTERFACELIST: INTERFACELIST INTERFACE 
            {
                $$ = new Node("INTERFACELIST", "NON_TERMINAL"); 
                $$.addChild($1);
                $$.addChild($2); 
            }
            | INTERFACE 
            {
                $$ = new Node("INTERFACE", "NON_TERMINAL");
                $$.addChild($1);
            };

INTERFACE: token_public token_interface token_Identifier 
           token_left_brace token_right_brace
           {
               $$ = new Node("INTERFACE", "NON_TERMINAL");
               $$.addChild(new Node($1, "interface"));
               $$.addChild(new Node($3, "id_interface"));
               //$$.addChild(new Node($4, "{_interface"));
               //$$.addChild(new Node($5, "}_interface"));
           } 
    | error {console.log(" (INTERFACE) Sintax error [ row: " + this._$.first_line + ", column: " + this._$.first_column +" ] ");} ;


/*------------------*/
/* list of methods of a class */
METHOD_LIST: METHOD_LIST METHOD_IMPLEMENTATION { 
                            $$ = new Node("METHOD_LIST", "NON_TERMINAL"); 
                            $$.addChild($1);
                            $$.addChild($2);
                          }//METHOD_DEF
           | METHOD_IMPLEMENTATION {
                                    $$ = new Node("M_IMPL", "NON_TERMINAL");
                                    $$.addChild($1);
                                    } ;

/* list of functions outside a class */
FUNCTION_LIST: FUNCTION_LIST FUNCTION_DEF
             {
                $$ = new Node("FUNCTION_LIST", "NON_TERMINAL"); 
                $$.addChild($1);
                $$.addChild($2);
             }
             | FUNCTION_DEF 
             {
                $$ = new Node("FUNCTION_DEF", "NON_TERMINAL");
                $$.addChild($1);
             }; 

/* method definition  (change to implementation) */
METHOD_IMPLEMENTATION: token_public METHOD_DATA_TYPE token_Identifier 
                       token_left_parenthesis PARAMETERS_LIST 
                       token_right_parenthesis token_left_brace 
                       INSTRUCTIONS_LIST token_right_brace 
                     { 
                       $$ = new Node("PAR", "NON_TERMINAL");  
                       $$.addChild($2); 
                       $$ = new Node($3, "method_id");
                       $$.addChild(new Node($4, "("));  
                       $$.addChild($5);
                       $$.addChild(new Node($6, ")"));
                       $$.addChild(new Node($7, "{"));
                       $$.addChild($8);
                       $$.addChild(new Node($9, "}"));
                     }
         | MAIN_METHOD {

             $$ = new Node("MAIN_METHOD", "NON_TERMINAL");
             $$.addChild($1);
         }
         | error token_right_brace {console.log(" (METHOD_DEF) Sintax error [ row: " + this._$.first_line + ", column: " + this._$.first_column +" ] ");} ;

/* definition of a function (outside of a class)*/
FUNCTION_DEF: token_public METHOD_DATA_TYPE token_Identifier 
                       token_left_parenthesis PARAMETERS_LIST 
                       token_right_parenthesis token_left_brace 
                       INSTRUCTIONS_LIST token_right_brace 
                     { 
                       $$ = new Node("FUNCTION_DEF", "NON_TERMINAL");  
                       $$.addChild($2); 
                       $$ = new Node($3, "function_id");
                       $$.addChild(new Node($4, "("));  
                       $$.addChild($5);
                       $$.addChild(new Node($6, ")"));
                       $$.addChild(new Node($7, "{"));
                       $$.addChild($8);
                       $$.addChild(new Node($9, "}"));
                     };

/* patermeters  */
PARAMETERS_LIST: PARAMETERS_LIST PARAMETER { 
                            $$ = new Node("PAR_LIST", "NON_TERMINAL"); 
                            $$.addChild($1);
                            $$.addChild($2);
                          }
               | PARAMETER {
                             $$ = new Node("PARAMETER", "NON_TERMINAL");
                             $$.addChild($1);
                            }                        
               | error {console.log(" (PARAMETERS_LIST) Sintax error [ row: " + this._$.first_line + ", column: " + this._$.first_column +" ] ");} ;

PARAMETER: DATA_TYPE token_Identifier {
                                         $$ = new Node("PAR", "NON_TERMINAL");  
                                         $$.addChild(new Node("type", "paramater_type"));
                                         //$$.addChild($1);
                                         $$.addChild(new Node($2, "id"));                      
                                      }
          | token_comma DATA_TYPE token_Identifier {
                                                     $$ = new Node("PAR", "NON_TERMINAL");
                                                     $$.addChild(new Node($1, ","));
                                                     $$.addChild(new Node("type", "paramater_type"));  
                                                     //$$.addChild($2);
                                                     $$.addChild(new Node($3, "id"));       
                                                   } ;
          //| error token_right_brace {console.log(" (PAREMETER) Sintax error [ row: " + this._$.first_line + ", column: " + this._$.first_column +" ] ");} ;

/*  instructions */

INSTRUCTIONS_LIST: INSTRUCTIONS_LIST INSTRUCTIONS {
                                    $$ = new Node("INST_LIST", "NON_TERMINAL");  
                                    $$.addChild($1);
                                    $$.addChild($2);
                                    //$$.addChild(new Node($2, "id"));                      
                                }
                | INSTRUCTIONS {
                                    $$ = new Node("INST_LIST", "NON_TERMINAL");  
                                    $$.addChild($1);
                                    //$$.addChild(new Node($3, "id"));       
                                };

INSTRUCTIONS : VAR_DECLARATION { $$ = new Node("VAR_LIST", "NON_TERMINAL"); $$.addChild($1); }
             | PRINT_INST { $$ = new Node("INST_PRINT", "NON_TERMINAL"); $$.addChild($1);  }
             | ASSIGNATION { $$ = new Node("ASSIGNATION", "NON_TERMINAL"); $$.addChild($1); }
             | METHOD_CALL { $$ = new Node("METHOD_CALL", "NON_TERMINAL"); $$.addChild($1); }
             | IF { $$ = new Node("IF", "NON_TERMINAL"); $$.addChild($1); }
             | FOR { $$ = new Node("FOR", "NON_TERMINAL"); $$.addChild($1); }
             | WHILE { $$ = new Node("WHILE", "NON_TERMINAL"); $$.addChild($1);}
             | DO_WHILE { $$ = new Node("DO_WHILE", "NON_TERMINAL"); $$.addChild($1);}
             | RETURN_STATEMENT { $$ = new Node("RETURN", "NON_TERMINAL"); $$.addChild($1); }
             | token_continue token_semicolon 
             {
                $$ = new Node("CONTINUE", "NON_TERMINAL"); 
                $$.addChild(new Node($1, "continue"));
                $$.addChild(new Node($2, ";"));
             }
             | token_break token_semicolon 
             { 
                 $$ = new Node("BREAK", "NON_TERMINAL"); 
                 $$.addChild(new Node($1, "break"));
                 $$.addChild(new Node($2, ";"));
             }
             | ML_COMMENTARY { $$ = new Node("ML_C", "NON_TERMINAL"); $$.addChild($1); }
             | error token_semicolon {
                  console.log(" (INSTRUCTIONS) Sintax error [ row: " + this._$.first_line + ", column: " + this._$.first_column +" ] ");
                  $$ = new Node($1, "error");
              } ;

ML_COMMENTARY: ml_commentary INSTRUCTIONS
                {
                    $$ = new Node("ml_comment", ""); $$.addChild(new Node($1, "ml_comment"));
                };

PRINT_INST : token_System token_point token_out 
             token_point token_print token_left_parenthesis
             text_string_qm token_right_parenthesis token_semicolon 
            {
                $$ = new Node("print", "NON_TERMINAL");
                $$.addChild(new Node($5, "print"));
                $$.addChild(new Node($6, "("));
                $$.addChild(new Node($7, "text_string")); // cambiar
                $$.addChild(new Node($8, ")"));
                $$.addChild(new Node($9, ";"));
                //$$ = new Node("PRINT", "print");
            }
           | token_System token_point token_out 
             token_point token_println token_left_parenthesis 
             text_string_qm token_right_parenthesis token_semicolon
           {
                $$ = new Node("print", "NON_TERMINAL");
                $$.addChild(new Node($5, "println"));
                $$.addChild(new Node($6, "("));
                $$.addChild(new Node($7, "text_string"));
                $$.addChild(new Node($8, ")"));
                $$.addChild(new Node($9, ";")); 
           }
           | token_System token_point token_out 
             token_point token_print token_left_parenthesis 
             E token_right_parenthesis token_semicolon 
           {
                $$ = new Node("print", "NON_TERMINAL");
                $$.addChild(new Node($5, "print"));
                $$.addChild(new Node($6, "("));
                $$.addChild($7);
                $$.addChild(new Node($8, ")"));
                $$.addChild(new Node($9, ";"));
                //$$.addChild(new Node($7, "id")); 
           }
           | token_System token_point token_out 
             token_point token_println token_left_parenthesis 
             E token_right_parenthesis token_semicolon 
           {
                $$ = new Node("print", "NON_TERMINAL");
                $$.addChild(new Node($5, "println"));
                $$.addChild(new Node($6, "("));
                $$.addChild($7);
                $$.addChild(new Node($8, ")"));
                $$.addChild(new Node($9, ";"));
           } ; 


/* Simple value variable declaration */
VAR_DECLARATION : DATA_TYPE token_Identifier token_equal E token_semicolon 
                 {
                     $$.addChild(new Node("Type", "NON_TERMINAL"));
                     //$$.addChild($1);
                     $$.addChild(new Node($2, "id"));
                     $$.addChild(new Node($3, "equal"));
                     $$.addChild($4);
                     $$.addChild(new Node($5, ","));
                 }
                | DATA_TYPE token_Identifier token_equal token_true token_semicolon
                {
                     $$.addChild(new Node("Type", "NON_TERMINAL"));
                     $$.addChild(new Node($2, "id"));
                     $$.addChild(new Node($3, "equal"));
                     $$.addChild(new Node($4, "true"));
                     $$.addChild(new Node($5, ";"));
                }

                | DATA_TYPE token_Identifier token_equal token_false token_semicolon
                {
                     $$.addChild(new Node("Type", "NON_TERMINAL"));
                     $$.addChild(new Node($2, "id"));
                     $$.addChild(new Node($3, "equal"));
                     $$.addChild(new Node($4, "false"));
                     $$.addChild(new Node($5, ";"));
                }
                | DATA_TYPE token_Identifier token_equal text_string_qm token_semicolon
                {
                     $$.addChild(new Node("Type", "NON_TERMINAL"));
                     $$.addChild(new Node($2, "id"));
                     $$.addChild(new Node($3, "equal"));
                     $$.addChild(new Node($4, "text_string"));
                     $$.addChild(new Node($5, ";"));
                 }
                | DATA_TYPE token_Identifier token_semicolon
                 {
                     $$.addChild(new Node("Type", "NON_TERMINAL"));
                     $$.addChild(new Node($2, "id"));
                     $$.addChild(new Node($3, ";"));
                     
                 }
                | DATA_TYPE token_Identifier token_equal E token_comma VAR_LIST
                 {
                     $$.addChild(new Node("Type", "NON_TERMINAL"));
                     $$.addChild(new Node($2, "id"));
                     $$.addChild(new Node($3, "equal"));
                     $$.addChild($4);
                     $$.addChild(new Node($5, ","));
                     $$.addChild($6);
                 } 
                 | DATA_TYPE token_Identifier token_comma VAR_LIST
                 {
                     $$.addChild(new Node("Type", "NON_TERMINAL"));
                     $$.addChild(new Node($2, "id"));
                     $$.addChild(new Node($3, ","));
                     $$.addChild($4);
                 } ;


/* A list of variables (change token_number -> EXPR) */
/*VAR_LIST: DATA_TYPE identifier token_equal E token_comma VAR_LIST
        | DATA_TYPE identifier token_comma VAR_LIST
        | identifier token_comma VAR_LIST 
        | identifier token_equal E token_semicolon
        | DATA_TYPE identifier token_equal E token_semicolon 
        | identifier token_semicolon ;
*/

VAR_LIST: token_Identifier token_equal E token_comma VAR_LIST
        {
            $$ = new Node("VAR_LIST", "NON_TERMINAL");
            $$.addChild(new Node($1, "var_id"));
            $$.addChild(new Node($2, "="));
            $$.addChild($3);
            $$.addChild(new Node($4, ","));
            $$.addChild($5);
        }
        | token_Identifier token_comma VAR_LIST
        {
            $$ = new Node("VAR_LIST", "NON_TERMINAL");
            $$.addChild(new Node($1, "var_id"));
            $$.addChild(new Node($2, ","));
            $$.addChild($3);
        }
        | token_Identifier token_equal E token_semicolon
        {
            $$ = new Node("VAR_LIST", "NON_TERMINAL");
            $$.addChild(new Node($1, "var_id"));
            $$.addChild(new Node($2, "="));
            $$.addChild($3);
            $$.addChild(new Node($2, ";"));
        } 
        | token_Identifier token_semicolon 
        {
            $$ = new Node("VAR_LIST", "NON_TERMINAL");
            $$.addChild(new Node($1, "var_id"));
            $$.addChild(new Node($2, ";"));
        } ;


/* an assignation of a variable */
ASSIGNATION: token_Identifier token_equal E token_semicolon 
            {
                $$ = new Node("Assignation", "NON_TERMINAL");
                $$.addChild(new Node($1, "var_id"));
                $$.addChild(new Node($2, "equal"));
                $$.addChild($3);
                $$.addChild(new Node($4, ";"));
            };

/* Calling a method*/
METHOD_CALL: token_Identifier token_left_parenthesis PARAMETER_LIST token_right_parenthesis token_semicolon
            {
                $$ = new Node("method_call", "NON_TERMINAL");
                $$.addChild(new Node($1, "method_id"));
                $$.addChild(new Node($2, "("));
                $$.addChild($3);
                $$.addChild(new Node($4, ")"));
                $$.addChild(new Node($5, ")"));
            } ;


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
                          $$ = new Node("EXPR", "NON_TERMINAL");
                          $$.addChild(new Node("expression", "NON_TERMINAL"));
                          $$.addChild($1); 
                            
                        }
    ;//| error token_semicolon {console.log(" (EXPR) Sintax error [ row: " + this._$.first_line + ", column: " + this._$.first_column +" ] ");} ;


E: E token_plus E { 
                    $$ = new Node("E", "NON_TERMINAL"); 
                    $$.addChild($1);
                    $$.addChild(new Node("+", "plus"));
                    $$.addChild($3);
                    
                    }
                    
 | E token_minus E { 
                    $$ = new Node("E", "NON_TERMINAL"); 
                    $$.addChild($1);
                    $$.addChild(new Node("-", "min"));
                    $$.addChild($3);
                    
                    }
 | E token_asterisk E { 
                    $$ = new Node("E", "NON_TERMINAL"); 
                    $$.addChild($1);
                    $$.addChild(new Node("*", "mult"));
                    $$.addChild($3);
                    }
 | E token_slash E {
                    
                    $$ = new Node("E", "NON_TERMINAL"); 
                    $$.addChild($1);
                    $$.addChild(new Node("/", "div"));
                    $$.addChild($3);
                    
                    }
  | E greater_than E {
                    
                    $$ = new Node("E", "NON_TERMINAL"); 
                    $$.addChild($1);
                    $$.addChild(new Node($2, ">"));
                    $$.addChild($3);
                    
                    }
  | E less_than E {
                    
                    $$ = new Node("E", "NON_TERMINAL"); 
                    $$.addChild($1);
                    $$.addChild(new Node($2, "<"));
                    $$.addChild($3);
                    
                    }  
  | E greater_or_equal_than E {
                    
                    $$ = new Node("E", "NON_TERMINAL"); 
                    $$.addChild($1);
                    $$.addChild(new Node($2, ">="));
                    $$.addChild($3);
                    
                    }   
  | E less_or_equal_than E {
                    
                    $$ = new Node("E", "NON_TERMINAL"); 
                    $$.addChild($1);
                    $$.addChild(new Node($2, "<="));
                    $$.addChild($3);
                    
                    }
  | E and E {
                    
                    $$ = new Node("E", "NON_TERMINAL"); 
                    $$.addChild($1);
                    $$.addChild(new Node($2, "&&"));
                    $$.addChild($3);
                    
                    } 
  | E or E {
                    
                    $$ = new Node("E", "NON_TERMINAL"); 
                    $$.addChild($1);
                    $$.addChild(new Node($2, "||"));
                    $$.addChild($3);
                    
            }                                     
 | token_left_parenthesis E token_right_parenthesis 
 {  
     $$ = new Node("E", "NON_TERMINAL");
     $$.addChild(new Node($1, "("));
     $$.addChild($2); 
     $$.addChild(new Node($3, ")")); 
     
 }
 | token_number { $$ = new Node($1, "number"); }
 | token_Identifier { $$ = new Node($1, "identifier"); }
 | token_left_parenthesis error token_semicolon {console.log(" Sintax error [ row: " + this._$.first_line + ", column: " + this._$.first_column +" ] ");} ;



/* list of parameters */
PARAMETER_LIST: E token_comma PARAMETER_LIST
                {
                    $$ = new Node("PARAMETER", "NON_TERMINAL");
                    $$.addChild($1);
                    $$.addChild(new Node($2, ","));
                    $$.addChild($3);
                }
              | token_true token_comma PARAMETER_LIST
              {
                    $$ = new Node("PARAMETER", "NON_TERMINAL");
                    $$.addChild(new Node($1, "true"));
                    $$.addChild(new Node($2, ","));
                    $$.addChild($3);
              }
              | token_false token_comma PARAMETER_LIST
              {
                    $$ = new Node("PARAMETER", "NON_TERMINAL");
                    $$.addChild(new Node($1, "false"));
                    $$.addChild(new Node($2, ","));
                    $$.addChild($3);
              }
              //| token_number token_comma PARAMETER_LIST//
              | text_string_qm token_comma PARAMETER_LIST
              {
                    $$ = new Node("PARAMETER", "NON_TERMINAL");
                    $$.addChild(new Node($1, "text_string"));
                    $$.addChild(new Node($2, ","));
                    $$.addChild($3);
              }
              | text_string_sq token_comma PARAMETER_LIST 
              {
                    $$ = new Node("PARAMETER", "NON_TERMINAL");
                    $$.addChild(new Node($1, "text_string"));
                    $$.addChild(new Node($2, ","));
                    $$.addChild($3);
              }
              //| token_Identifier//
              | E 
              {
                    $$ = new Node("PARAMETER", "NON_TERMINAL");
                    $$.addChild($1);
              }
              | token_true
              {
                    $$ = new Node("PARAMETER", "NON_TERMINAL");
                    $$.addChild(new Node($1, "true"));
              }
              | token_false
              {
                    $$ = new Node("PARAMETER", "NON_TERMINAL");
                    $$.addChild(new Node($1, "false"));
              } 
              | text_string_qm
              {
                    $$ = new Node("PARAMETER", "NON_TERMINAL");
                    $$.addChild(new Node($1, "text_string"));
              }
              | text_string_sq 
              {
                    $$ = new Node("PARAMETER", "NON_TERMINAL");
                    $$.addChild(new Node($1, "text_string"));
              };



/* if */
IF: token_if token_left_parenthesis E token_right_parenthesis 
    token_left_brace INSTRUCTIONS_LIST token_right_brace 
    THEN_STMT
    {
        $$ = new Node("if stmt", "NON_TERMINAL");
        $$.addChild(new Node($1, "if"));
        $$.addChild(new Node($2, "("));
        $$.addChild($3);
        $$.addChild(new Node($4, ")"));
        $$.addChild(new Node($5, "{"));
        $$.addChild($6);
        $$.addChild(new Node($7, "}"));
        $$.addChild($8);
        

    };

THEN_LIST: THEN_STMT THEN_LIST 
         | THEN_STMT ;

/* then_stmt (else else if) */
THEN_STMT: token_else token_left_brace INSTRUCTIONS_LIST token_right_brace
            {
                $$ = new Node("else stmt", "NON_TERMINAL");
                $$.addChild( new Node($1, "else"));
                $$.addChild( new Node($2, "{"));
                $$.addChild($3);
                $$.addChild( new Node($4, "}"));
            }
         | token_else token_if token_left_parenthesis E 
           token_right_parenthesis token_left_brace 
           INSTRUCTIONS_LIST token_right_brace THEN_STMT
         {
            $$ = new Node("else if stmt", "NON_TERMINAL");
            $$.addChild(new Node($1, "else"));
            $$.addChild(new Node($2, "if_"));//else if
            $$.addChild(new Node($3, "("));
            $$.addChild($4);
            $$.addChild(new Node($5, ")"));
            $$.addChild(new Node($6, "{"));
            $$.addChild($7);
            $$.addChild(new Node($8, "}"));
            $$.addChild($9);
         }
         |{$$ = new Node("", "")};




FOR: token_for token_left_parenthesis FOR_DEF token_right_parenthesis token_left_brace INSTRUCTIONS_LIST token_right_brace
    {
        $$ = new Node("for_stmt", "NON_TERMINAL");
        $$.addChild(new Node($1, "for"));
        $$.addChild(new Node($2, "("));
        $$.addChild($3);
        $$.addChild(new Node($4, ")"));
        $$.addChild(new Node($5, "{"));
        $$.addChild($6);
        $$.addChild(new Node($7, "}"));

    };

FOR_DEF: VAR_DECLARATION E token_semicolon E DEC_INC
        {
            $$ = new Node("FOR_DEF", "");
            $$.addChild($1);
            $$.addChild($2);
            $$.addChild(new Node($3, ";"));
            console.log($4);
            $$.addChild($4);
            console.log($5);
            $$.addChild($5);
            $$.addChild(new Node($5, "++"));
        };

DEC_INC: increase { $$ = new Node("DEC_INC", "");  $$.addChild(new Node($1, "++")); }
       | decrease { $$ = new Node("DEC_INC", ""); $$.addChild(new Node($1, "--")); } ;

WHILE: token_while token_left_parenthesis E token_right_parenthesis token_left_brace INSTRUCTIONS_LIST token_right_brace
        {
            $$ = new Node("while_stmt", "NON_TERMINAL");
            $$.addChild(new Node($1, "while"));
            $$.addChild(new Node($2, "("));
            $$.addChild($3);
            $$.addChild(new Node($4, ")"));
            $$.addChild(new Node($5, "{"));
            $$.addChild($6);
            $$.addChild(new Node($7, "}"));
        };

DO_WHILE: token_do token_left_brace INSTRUCTIONS_LIST 
          token_right_brace token_while token_left_parenthesis 
          E token_right_parenthesis token_semicolon 
        {
            $$ = new Node("do while_stmt", "NON_TERMINAL");
            $$.addChild(new Node($1, "do"));
            $$.addChild(new Node($2, "{"));
            $$.addChild($3);
            $$.addChild(new Node($4, "}"));
            $$.addChild(new Node($5, "while"));
            $$.addChild(new Node($6, "("));
            $$.addChild($7);
            $$.addChild(new Node($8, ")"));
            $$.addChild(new Node($9, ";"));
        };

/* return statement*/
RETURN_STATEMENT : token_return E token_semicolon
                 {
                    $$ = new Node("return", "return"); 
                    $$.addChild($2); 
                    $$.addChild(new Node($3, ";"));
                 } 
                 | token_return token_true token_semicolon
                 {
                    $$ = new Node("return", "return"); 
                    $$.addChild(new Node($2, "true"));
                    $$.addChild(new Node($3, ";")); 

                 }
                 | token_return token_false token_semicolon
                 {
                    $$ = new Node("return", "return"); 
                    $$.addChild(new Node($2, "false"));
                    $$.addChild(new Node($3, ";")); 

                 }
                 | token_return text_string_qm token_semicolon
                 {
                    $$ = new Node("return", "return"); 
                    $$.addChild(new Node("text string", "text string"));
                    $$.addChild(new Node($3, ";")); 

                 }
                 | token_return text_string_sq token_semicolon
                 {
                    $$ = new Node("return", "return"); 
                    $$.addChild(new Node("text string", "text string"));
                    $$.addChild(new Node($3, ";")); 

                 } ;

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
         | token_boolean {$$ = new Node("boolean", "boolean");} ; 



/*LOGIC_EXP: or { $$ = new Node($1, "or");}
         | and {$$ = new Node($1, "and");}
         | equal_equal {$$ = new Node($1, "equal_equal");} 
         | greater_or_equal_than {$$ = new Node($1, "greater_or_equal_than");}
         | greater_than {$$ = new Node($1, "greater_than");}
         | less_or_equal_than {$$ = new Node($1, "less_or_equal_than");}
         | less_than {$$ = new Node($1, "less_than");} ;
*/