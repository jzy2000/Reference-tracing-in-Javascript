# Definition-Use analysis for Javascript variable  
Based on (Tern project)[https://github.com/ternjs/tern], this prototype analyzes the AST tree, performs heuristic search for define-use of any given Javascript variable, replaces with new name and output beautified results.

User supplied source code can be either completed package, or code snippet. 

Such static analysis technique is useful to generically and programatically rewrite 3rd party scripts in order to change the behavior, for data flow analysis for security research, and use as Lint to refactor code in IDE.
