<!-- Header --->
# MANUAL TECNICO

## Proyecto 2 Curso organización de lenguajes y compiladores 1, Segundo semestre 2020

### Juan Antonio Solares Samayoa - Carne 201800496 
*Escuela de Ciencias y Sistemas USAC.*

***

## BASES TEORICAS UTILIZADAS

### Gramatica LL(1) Descendente (utilizado por la clase Parser.js)

El analizador sintático LL es un analizador sintáctico descendente, por un conjunto de gramática libre de contexto. En este analizador las entradas son de izquierda a derecha, y construcciones de derivaciones por la izquierda de una sentencia o enunciado. La clase de gramática que es analizable por este método es conocido como gramática LL.


Un analizador LL es llamado un analizador LL (k) si usa un número k de tokens cuando el analizador va hacia delante de la sentencia. Si existe tal analizador para cierta gramática y puede analizar sentencias de esta gramática sin marcha atrás, entonces es llamada una gramática LL (k). De estas gramáticas, la gramática LL(1), aunque es bastante restrictiva, éstas son muy populares porque los analizadores LL correspondientes sólo necesita ver el siguiente token para hacer el análisis de sus decisiones. Lenguajes mal diseñados usualmente suelen tener gramáticas con un alto nivel de k, y requieren un esfuerzo considerable a analizar. (*Fuente: wikipedia*)


### Gramatica LALR Ascendente (utilizada por la herramienta jison)

Los analizadores sintácticos LR, también conocidos como Parser LR, son un tipo de analizadores para algunas gramáticas libres de contexto. Pertenece a la familia de los analizadores ascendentes, ya que construyen el árbol sintáctico de las hojas hacia la raíz. Utilizan la técnica de análisis por desplazamiento reducción. Existen tres tipos de parsers LR: SLR (K), LALR (K) y LR (K) canónico.

___

## TECNOLOGÍAS UTILIZADAS:

* Sevidor en Go: utilizado para levantar la pagina web en HTML

* IMPORTANTE: Para levantar un servidor en Go

 ```
 cd go
 go run index.go
 ```

* Servidores en nodeJS: 
    * Servidor 1 utilizado para realizar el analisis lexico, sintactico y traducción del codigo analizado (*java*) al codigo destino (*python*). En el desarrollo de este analizador no se utilizó ninguna herramienta de analisis lexico o sintactico.
    ### Clases más importantes de servidor1
    *  #### Scanner
        * Realiza el analisis lexico del codigo de entrada, para posteriorente recopilar tokens y errores lexicos. Cada unos de los tokens recopilados durante el analisis son enviados al analisis sintáctico.
    *  #### Parser
        * Realiza el analisis sintactico del codigo de entrada, para posteriorente recopilar errores y generar el codigo en *python* traducido



    * Servidor 2 utilizado para realizar el analisis lexico, sintactico y traducción del codigo analizado (*java*) al codigo destino (*javascript*). En el desarrollo de este analizado se utilizo la herramienta *jison* el cual es un generador de gramaticas. Tambien se desarrollo con está herramienta el Arbol Sintactico.

___


IMPORTANTE: Para levantar los servidores de nodeJS 

*Servidor1*
  ```
 cd server
 npm run dev
 ```

*Servidor2*
  ```
 cd serverjison
 npm run dev
 ```