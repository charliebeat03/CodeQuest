const levels = [
    // ==============================================
    // BLOQUE 1: INICIACIÓN A LA CONSOLA
    // ==============================================
    {
        type: 'TEORÍA',
        title: "Iniciación de Consola",
        concept: "Mostrar mensajes es el primer paso de todo programador.",
        hint: "Usa print('texto') en Python o cout << \"texto\"; en C++.",
        python: {
            ex: "print('Hola')",
            mission: "Imprime exactamente 'SISTEMA OK'",
            init: "",
            check: (code, output) => output.trim().toUpperCase().includes("SISTEMA OK")
        },
        cpp: {
            ex: 'cout << "Hola";',
            mission: "Muestra exactamente 'SISTEMA OK'",
            init: "#include <iostream>\nusing namespace std;\n\nint main() {\n    \n    return 0;\n}",
            check: (code, output) => output.trim().toUpperCase().includes("SISTEMA OK")
        }
    },
    {
        type: 'PRÁCTICA',
        title: "Iniciación de Consola (Reto 1)",
        concept: "Practica la impresión de varios mensajes.",
        hint: "Puedes poner dos print (o cout) seguidos, o usar \\n dentro de un string.",
        python: {
            ex: "print('Hola')\nprint('Mundo')",
            mission: "Imprime 'CARGANDO...' y luego 'LISTO' (cada uno en línea separada).",
            init: "",
            check: (code, output) => output.includes("CARGANDO") && output.includes("LISTO")
        },
        cpp: {
            ex: 'cout << "Hola" << endl;\ncout << "Mundo";',
            mission: "Muestra 'CARGANDO...' y luego 'LISTO' (en líneas separadas).",
            init: "#include <iostream>\nusing namespace std;\n\nint main() {\n    \n    return 0;\n}",
            check: (code, output) => output.includes("CARGANDO") && output.includes("LISTO")
        }
    },
    {
        type: 'PRÁCTICA',
        title: "Iniciación de Consola (Reto 2)",
        concept: "Ahora imprime un número.",
        hint: "Simplemente escribe print(2024) o cout << 2024; sin comillas.",
        python: {
            ex: "print(2024)",
            mission: "Imprime el número 2024.",
            init: "",
            check: (code, output) => output.includes("2024")
        },
        cpp: {
            ex: "cout << 2024;",
            mission: "Muestra el número 2024.",
            init: "#include <iostream>\nusing namespace std;\n\nint main() {\n    \n    return 0;\n}",
            check: (code, output) => output.includes("2024")
        }
    },

    // ==============================================
    // BLOQUE 2: ASIGNACIÓN Y VARIABLES
    // ==============================================
    {
        type: 'TEORÍA',
        title: "Asignación de Memoria",
        concept: "Las variables reservan un espacio en memoria para guardar datos.",
        hint: "En Python: variable = valor. En C++: tipo variable = valor; Recuerda usar cout o print luego.",
        python: {
            ex: "x = 5\nprint(x)",
            mission: "Crea una variable 'puntos' con valor 100 e imprímela.",
            init: "",
            check: (code, output) => code.includes("puntos") && output.includes("100")
        },
        cpp: {
            ex: "int x = 5;\ncout << x;",
            mission: "Declara 'int puntos = 100;' y muéstrala con cout.",
            init: "#include <iostream>\nusing namespace std;\n\nint main() {\n    \n    return 0;\n}",
            check: (code, output) => code.includes("puntos") && output.includes("100")
        }
    },
    {
        type: 'PRÁCTICA',
        title: "Asignación de Memoria (Reto 1)",
        concept: "Practica crear variables de texto y mostrarlas.",
        hint: "Para texto usa comillas. En Python no necesitas tipo; en C++ declara string.",
        python: {
            ex: "x = 'Hola'\nprint(x)",
            mission: "Crea una variable 'saludo' con el texto 'Hola Mundo' e imprímela.",
            init: "",
            check: (code, output) => output.includes("Hola Mundo")
        },
        cpp: {
            ex: 'string x = "Hola";\ncout << x;',
            mission: "Declara 'string saludo = \"Hola Mundo\";' y muéstrala.",
            init: "#include <iostream>\nusing namespace std;\n\nint main() {\n    \n    return 0;\n}",
            check: (code, output) => output.includes("Hola Mundo")
        }
    },
    {
        type: 'PRÁCTICA',
        title: "Asignación de Memoria (Reto 2)",
        concept: "Trabaja con números y variables.",
        hint: "Crea dos variables, suma sus valores e imprime el resultado.",
        python: {
            ex: "a = 5\nb = 2\nprint(a + b)",
            mission: "Crea 'a = 7' y 'b = 3', luego imprime la suma (debe salir 10).",
            init: "",
            check: (code, output) => output.includes("10")
        },
        cpp: {
            ex: "int a = 5, b = 2;\ncout << a + b;",
            mission: "Declara 'int a = 7; int b = 3;' y muestra a + b.",
            init: "#include <iostream>\nusing namespace std;\n\nint main() {\n    \n    return 0;\n}",
            check: (code, output) => output.includes("10")
        }
    },

    // ==============================================
    // BLOQUE 3: OPERADORES ARITMÉTICOS
    // ==============================================
    {
        type: 'TEORÍA',
        title: "Operadores Aritméticos",
        concept: "Puedes hacer cálculos con +, -, *, /.",
        hint: "Crea dos variables y muestra el resultado de la división. En C++ si los dos son enteros, la división es entera.",
        python: {
            ex: "a = 20\nb = 4\nprint(a / b)",
            mission: "Crea 'a = 20' y 'b = 4' e imprime la división (a / b). Debe mostrar 5.",
            init: "",
            check: (code, output) => output.includes("5")
        },
        cpp: {
            ex: "int a = 20, b = 4;\ncout << a / b;",
            mission: "Declara 'int a = 20; int b = 4;' y muestra a / b.",
            init: "#include <iostream>\nusing namespace std;\n\nint main() {\n    \n    return 0;\n}",
            check: (code, output) => output.includes("5")
        }
    },
    {
        type: 'PRÁCTICA',
        title: "Operadores Aritméticos (Reto 1)",
        concept: "Usa resta y multiplicación.",
        hint: "Para multiplicar usa * (asterisco).",
        python: {
            ex: "x = 15\ny = 7\nprint(x * y)",
            mission: "Crea 'x = 15' e 'y = 7' e imprime el producto (x * y). Debe mostrar 105.",
            init: "",
            check: (code, output) => output.includes("105")
        },
        cpp: {
            ex: "int x = 15, y = 7;\ncout << x * y;",
            mission: "Declara 'int x = 15; int y = 7;' y muestra x * y.",
            init: "#include <iostream>\nusing namespace std;\n\nint main() {\n    \n    return 0;\n}",
            check: (code, output) => output.includes("105")
        }
    },
    {
        type: 'PRÁCTICA',
        title: "Operadores Aritméticos (Reto 2)",
        concept: "Combina operadores con paréntesis.",
        hint: "Usa paréntesis ( ) para agrupar y calcular en el orden deseado.",
        python: {
            ex: "total = (8 + 2) * 3\nprint(total)",
            mission: "Crea 'total = (8 + 2) * 3' e imprime el resultado (30).",
            init: "",
            check: (code, output) => output.includes("30")
        },
        cpp: {
            ex: "int total = (8 + 2) * 3;\ncout << total;",
            mission: "Declara 'int total = (8 + 2) * 3;' y muéstralo.",
            init: "#include <iostream>\nusing namespace std;\n\nint main() {\n    \n    return 0;\n}",
            check: (code, output) => output.includes("30")
        }
    },

    // ==============================================
    // BLOQUE 4: STRINGS Y CONCATENACIÓN
    // ==============================================
    {
        type: 'TEORÍA',
        title: "Strings y Concatenación",
        concept: "Puedes unir textos con + en Python o << en C++.",
        hint: "En Python usa print('Hola ' + nombre). En C++ usa cout << \"Hola \" << nombre;",
        python: {
            ex: 'nombre = "Ana"\nprint("Hola " + nombre)',
            mission: 'Crea "nombre = \'Juan\'" e imprime "Hola Juan".',
            init: "",
            check: (code, output) => output.includes("Hola Juan")
        },
        cpp: {
            ex: 'string nombre = "Ana";\ncout << "Hola " << nombre;',
            mission: 'Declara "string nombre = \\"Juan\\";" y muestra "Hola Juan".',
            init: "#include <iostream>\nusing namespace std;\n\nint main() {\n    \n    return 0;\n}",
            check: (code, output) => output.includes("Hola Juan")
        }
    },
    {
        type: 'PRÁCTICA',
        title: "Strings y Concatenación (Reto 1)",
        concept: "Une más de dos textos.",
        hint: "Puedes concatenar varias veces: texto1 + \"-\" + texto2",
        python: {
            ex: 'color1 = "Verde"\ncolor2 = "Amarillo"\nprint(color1 + "-" + color2)',
            mission: 'Crea "color1 = \'Verde\'" y "color2 = \'Amarillo\'" e imprime "Verde-Amarillo".',
            init: "",
            check: (code, output) => output.includes("Verde-Amarillo")
        },
        cpp: {
            ex: 'string a = "Rojo", b = "Azul";\ncout << a << "-" << b;',
            mission: 'Declara dos strings y muestra "Verde-Amarillo".',
            init: "#include <iostream>\nusing namespace std;\n\nint main() {\n    \n    return 0;\n}",
            check: (code, output) => output.includes("Verde-Amarillo")
        }
    },
    {
        type: 'PRÁCTICA',
        title: "Strings y Concatenación (Reto 2)",
        concept: "Mezcla números y texto en una salida.",
        hint: "En Python puedes usar str(edad) o simplemente separar con coma en print. En C++ solo <<.",
        python: {
            ex: 'edad = 25\nprint("Tengo " + str(edad) + " años")',
            mission: 'Crea "edad = 30" e imprime "Edad: 30" (usa comas en print o conversión).',
            init: "",
            check: (code, output) => output.includes("Edad: 30")
        },
        cpp: {
            ex: 'int edad = 25;\ncout << "Tengo " << edad << " años";',
            mission: 'Declara "int edad = 30;" y muestra "Edad: 30".',
            init: "#include <iostream>\nusing namespace std;\n\nint main() {\n    \n    return 0;\n}",
            check: (code, output) => output.includes("Edad: 30")
        }
    },

    // ==============================================
    // BLOQUE 5: CONDICIONALES IF / ELSE
    // ==============================================
    {
        type: 'TEORÍA',
        title: "Condicional if",
        concept: "Toma decisiones con if y else.",
        hint: "En Python es 'if condición:' (dos puntos) y luego código indentado. En C++ es if (condición) { ... }.",
        python: {
            ex: "x = 10\nif x > 5:\n    print('Mayor')\nelse:\n    print('Menor')",
            mission: "Crea 'x = 10'. Si x > 5 imprime 'Mayor', si no imprime 'Menor'.",
            init: "",
            check: (code, output) => output.includes("Mayor")
        },
        cpp: {
            ex: "int x = 10;\nif (x > 5) cout << \"Mayor\";\nelse cout << \"Menor\";",
            mission: "Con 'int x = 10;' muestra 'Mayor' si x > 5.",
            init: "#include <iostream>\nusing namespace std;\n\nint main() {\n    \n    return 0;\n}",
            check: (code, output) => output.includes("Mayor")
        }
    },
    {
        type: 'PRÁCTICA',
        title: "Condicional if (Reto 1)",
        concept: "Usa if-else con una condición falsa.",
        hint: "Escribe la misma estructura pero con x = 3 para que entre al else.",
        python: {
            ex: "x = 3\nif x > 5:\n    print('A')\nelse:\n    print('B')",
            mission: "Crea 'x = 3' e imprime 'B' porque no es mayor que 5.",
            init: "",
            check: (code, output) => output.includes("B")
        },
        cpp: {
            ex: "int x = 3;\nif (x > 5) cout << \"A\";\nelse cout << \"B\";",
            mission: "Con 'int x = 3;' muestra 'B'.",
            init: "#include <iostream>\nusing namespace std;\n\nint main() {\n    \n    return 0;\n}",
            check: (code, output) => output.includes("B")
        }
    },
    {
        type: 'PRÁCTICA',
        title: "Condicional if (Reto 2)",
        concept: "Practica con else if.",
        hint: "En Python es 'elif', en C++ 'else if'. Puedes poner varias condiciones.",
        python: {
            ex: "nota = 7\nif nota >= 9:\n    print('A')\nelif nota >= 7:\n    print('B')\nelse:\n    print('C')",
            mission: "Crea 'nota = 7' e imprime 'B'.",
            init: "",
            check: (code, output) => output.includes("B")
        },
        cpp: {
            ex: "int nota = 7;\nif (nota >= 9) cout << \"A\";\nelse if (nota >= 7) cout << \"B\";\nelse cout << \"C\";",
            mission: "Con 'int nota = 7;' muestra 'B'.",
            init: "#include <iostream>\nusing namespace std;\n\nint main() {\n    \n    return 0;\n}",
            check: (code, output) => output.includes("B")
        }
    },

    // ==============================================
    // BLOQUE 6: BUCLES WHILE
    // ==============================================
    {
        type: 'TEORÍA',
        title: "Bucle while",
        concept: "Repite mientras se cumpla una condición.",
        hint: "En Python: while condición: (indentado). En C++: while (condición) { ... }. Recuerda incrementar la variable para no entrar en bucle infinito.",
        python: {
            ex: "i = 0\nwhile i < 3:\n    print(i)\n    i += 1",
            mission: "Usa while para imprimir los números del 0 al 2 (cada uno en línea nueva).",
            init: "",
            check: (code, output) => output.replace(/\s+/g, '').includes("012")
        },
        cpp: {
            ex: "int i = 0;\nwhile (i < 3) {\n    cout << i;\n    i++;\n}",
            mission: "Usa while para mostrar 0,1,2 (sin espacios).",
            init: "#include <iostream>\nusing namespace std;\n\nint main() {\n    \n    return 0;\n}",
            check: (code, output) => output.replace(/\s+/g, '').includes("012")
        }
    },
    {
        type: 'PRÁCTICA',
        title: "Bucle while (Reto 1)",
        concept: "Acumula valores en un while.",
        hint: "Crea una variable total = 0 antes del while y otra i = 1. Dentro suma i al total y aumenta i.",
        python: {
            ex: "i = 1\ntotal = 0\nwhile i <= 3:\n    total += i\n    i += 1\nprint(total)",
            mission: "Suma los números del 1 al 4 usando while e imprime 10.",
            init: "",
            check: (code, output) => output.includes("10")
        },
        cpp: {
            ex: "int i = 1, total = 0;\nwhile (i <= 3) { total += i; i++; }\ncout << total;",
            mission: "Usa while para sumar 1..4 y muestra 10.",
            init: "#include <iostream>\nusing namespace std;\n\nint main() {\n    \n    return 0;\n}",
            check: (code, output) => output.includes("10")
        }
    },
    {
        type: 'PRÁCTICA',
        title: "Bucle while (Reto 2)",
        concept: "Cuenta regresiva con while.",
        hint: "Inicia una variable n = 3. Mientras n > 0: imprime n y decrementa en 1.",
        python: {
            ex: "n = 5\nwhile n > 0:\n    print(n)\n    n -= 1",
            mission: "Imprime una cuenta regresiva desde 3 hasta 1 (cada número en línea nueva).",
            init: "",
            check: (code, output) => output.replace(/\s+/g, '').includes("321")
        },
        cpp: {
            ex: "int n = 5;\nwhile (n > 0) { cout << n; n--; }",
            mission: "Muestra 3,2,1 en líneas separadas.",
            init: "#include <iostream>\nusing namespace std;\n\nint main() {\n    \n    return 0;\n}",
            check: (code, output) => output.replace(/\s+/g, '').includes("321")
        }
    },

    // ==============================================
    // BLOQUE 7: BUCLES FOR
    // ==============================================
    {
        type: 'TEORÍA',
        title: "Bucle for (range)",
        concept: "Recorre una secuencia de números con for.",
        hint: "Python: for i in range(3): (0..2). C++: for(int i=0; i<3; i++)",
        python: {
            ex: "for i in range(3):\n    print(i)",
            mission: "Usa for para imprimir 0,1,2 (uno por línea).",
            init: "",
            check: (code, output) => output.replace(/\s+/g, '').includes("012")
        },
        cpp: {
            ex: "for (int i = 0; i < 3; i++) {\n    cout << i;\n}",
            mission: "Usa for para mostrar 0,1,2 (sin espacios).",
            init: "#include <iostream>\nusing namespace std;\n\nint main() {\n    \n    return 0;\n}",
            check: (code, output) => output.replace(/\s+/g, '').includes("012")
        }
    },
    {
        type: 'PRÁCTICA',
        title: "Bucle for (Reto 1)",
        concept: "Suma acumulada con for.",
        hint: "Usa range(1,6) en Python o for(int i=1; i<=5; i++) en C++.",
        python: {
            ex: "total = 0\nfor i in range(1, 6):\n    total += i\nprint(total)",
            mission: "Suma los números del 1 al 5 usando for e imprime 15.",
            init: "",
            check: (code, output) => output.includes("15")
        },
        cpp: {
            ex: "int total = 0;\nfor (int i = 1; i <= 5; i++) total += i;\ncout << total;",
            mission: "Usa for para sumar 1..5 y muestra 15.",
            init: "#include <iostream>\nusing namespace std;\n\nint main() {\n    \n    return 0;\n}",
            check: (code, output) => output.includes("15")
        }
    },
    {
        type: 'PRÁCTICA',
        title: "Bucle for (Reto 2)",
        concept: "Itera sobre una lista (Python) o array (C++).",
        hint: "En Python: for n in lista: print(n). En C++ recorre con índice.",
        python: {
            ex: "nums = [10, 20, 30]\nfor n in nums:\n    print(n)",
            mission: "Crea una lista [1,2,3] e imprime cada elemento en línea separada.",
            init: "",
            check: (code, output) => output.replace(/\s+/g, '').includes("123")
        },
        cpp: {
            ex: "int arr[] = {10,20,30};\nfor (int i = 0; i < 3; i++) cout << arr[i];",
            mission: "Con un array {1,2,3} muestra 1,2,3 (sin espacios).",
            init: "#include <iostream>\nusing namespace std;\n\nint main() {\n    \n    return 0;\n}",
            check: (code, output) => output.replace(/\s+/g, '').includes("123")
        }
    },

    // ==============================================
    // BLOQUE 8: LISTAS Y ARRAYS
    // ==============================================
    {
        type: 'TEORÍA',
        title: "Listas y Arrays",
        concept: "Colecciones de valores indexados (0,1,2...).",
        hint: "Python: lista[indice]. C++: array[posición]. Recuerda que empiezan en 0.",
        python: {
            ex: "numeros = [10, 20, 30]\nprint(numeros[1])",
            mission: "Crea una lista con [4, 8, 12] e imprime el tercer elemento (12).",
            init: "",
            check: (code, output) => output.includes("12")
        },
        cpp: {
            ex: "int arr[] = {10, 20, 30};\ncout << arr[1];",
            mission: "Crea un array {4,8,12} y muestra el tercer elemento (12).",
            init: "#include <iostream>\nusing namespace std;\n\nint main() {\n    \n    return 0;\n}",
            check: (code, output) => output.includes("12")
        }
    },
    {
        type: 'PRÁCTICA',
        title: "Listas y Arrays (Reto 1)",
        concept: "Modifica un elemento de la lista/array.",
        hint: "Asigna un nuevo valor a una posición con lista[1] = 99; y luego imprime ese elemento.",
        python: {
            ex: "nums = [10, 20, 30]\nnums[0] = 99\nprint(nums[0])",
            mission: "Crea una lista [1,2,3], cambia el segundo elemento a 99 e imprímelo.",
            init: "",
            check: (code, output) => output.includes("99")
        },
        cpp: {
            ex: "int arr[] = {10, 20, 30};\narr[0] = 99;\ncout << arr[0];",
            mission: "Con un array {1,2,3} cambia el segundo elemento a 99 y muéstralo.",
            init: "#include <iostream>\nusing namespace std;\n\nint main() {\n    \n    return 0;\n}",
            check: (code, output) => output.includes("99")
        }
    },
    {
        type: 'PRÁCTICA',
        title: "Listas y Arrays (Reto 2)",
        concept: "Recorre toda la colección con un for.",
        hint: "Usa for sobre la lista o array e imprime cada elemento.",
        python: {
            ex: "nums = [100, 200, 300]\nfor n in nums:\n    print(n)",
            mission: "Crea [100, 200, 300] e imprime cada valor en línea separada.",
            init: "",
            check: (code, output) => output.replace(/\s+/g, '').includes("100200300")
        },
        cpp: {
            ex: "int arr[] = {10,20,30};\nfor (int i=0;i<3;i++) cout << arr[i];",
            mission: "Con {100,200,300} muestra 100200300 (sin espacios).",
            init: "#include <iostream>\nusing namespace std;\n\nint main() {\n    \n    return 0;\n}",
            check: (code, output) => output.replace(/\s+/g, '').includes("100200300")
        }
    },

    // ==============================================
    // BLOQUE 9: FUNCIONES
    // ==============================================
    {
        type: 'TEORÍA',
        title: "Funciones Simples",
        concept: "Define bloques de código reutilizables.",
        hint: "Python: def nombre(): ... indentado. C++: void nombre() { ... } Llamada: nombre();",
        python: {
            ex: "def saludar():\n    print('Hola Mundo')\nsaludar()",
            mission: "Define una función 'saludo()' que imprima 'Hola Mundo' y llámala.",
            init: "",
            check: (code, output) => output.includes("Hola Mundo")
        },
        cpp: {
            ex: 'void saludo() { cout << "Hola Mundo"; }\nint main() { saludo(); return 0; }',
            mission: "Crea una función 'saludo()' que muestre 'Hola Mundo' y ejecútala en main.",
            init: "#include <iostream>\nusing namespace std;\n\nvoid saludo() {\n    \n}\nint main() {\n    saludo();\n    return 0;\n}",
            check: (code, output) => output.includes("Hola Mundo")
        }
    },
    {
        type: 'PRÁCTICA',
        title: "Funciones Simples (Reto 1)",
        concept: "Función con parámetros.",
        hint: "En Python: def cuadrado(x): print(x*x). En C++: void cuadrado(int x) { cout << x*x; }",
        python: {
            ex: "def doble(x):\n    print(x * 2)\ndoble(4)",
            mission: "Define 'cuadrado(x)' que imprima x*x y pruébala con 5 (debe mostrar 25).",
            init: "",
            check: (code, output) => output.includes("25")
        },
        cpp: {
            ex: 'void cuadrado(int x) { cout << x*x; }\nint main() { cuadrado(5); return 0; }',
            mission: "Crea 'void cuadrado(int x)' que muestre x*x; llama con 5.",
            init: "#include <iostream>\nusing namespace std;\n\nvoid cuadrado(int x) {\n    \n}\nint main() {\n    cuadrado(5);\n    return 0;\n}",
            check: (code, output) => output.includes("25")
        }
    },
    {
        type: 'PRÁCTICA',
        title: "Funciones Simples (Reto 2)",
        concept: "Función con retorno de valor.",
        hint: "Usa 'return' para devolver el cálculo y luego imprime el resultado de la llamada.",
        python: {
            ex: "def suma(a, b):\n    return a + b\nprint(suma(3, 4))",
            mission: "Define 'multiplica(a,b)' que devuelva a*b e imprime multiplica(3,7) (21).",
            init: "",
            check: (code, output) => output.includes("21")
        },
        cpp: {
            ex: 'int multiplica(int a, int b) { return a * b; }\nint main() { cout << multiplica(3,7); return 0; }',
            mission: "Crea 'int multiplica(int a, int b)' que devuelva a*b y muestra multiplica(3,7).",
            init: "#include <iostream>\nusing namespace std;\n\nint multiplica(int a, int b) {\n    return 0;\n}\nint main() {\n    cout << multiplica(3,7);\n    return 0;\n}",
            check: (code, output) => output.includes("21")
        }
    },

    // ==============================================
    // BLOQUE 10: CLASES Y POO
    // ==============================================
    {
        type: 'TEORÍA',
        title: "Clases y Objetos",
        concept: "Define tus propios tipos con atributos y constructor.",
        hint: "Python: class Perro: def __init__(self, nombre): self.nombre = nombre. C++: class Perro { public: string nombre; Perro(string n){ nombre=n; } };",
        python: {
            ex: "class Perro:\n    def __init__(self, nombre):\n        self.nombre = nombre\nm = Perro('Max')\nprint(m.nombre)",
            mission: "Crea una clase 'Perro' con constructor que reciba 'nombre' e imprímelo al instanciar con 'Max'.",
            init: "",
            check: (code, output) => output.includes("Max")
        },
        cpp: {
            ex: 'class Perro {\npublic:\n    string nombre;\n    Perro(string n) { nombre = n; }\n};\nint main() {\n    Perro m("Max");\n    cout << m.nombre;\n    return 0;\n}',
            mission: "Clase 'Perro' con atributo 'nombre' y constructor. Instancia con 'Max' y muestra el nombre.",
            init: "#include <iostream>\nusing namespace std;\n\nclass Perro {\npublic:\n    string nombre;\n    Perro(string n) {\n        nombre = n;\n    }\n};\nint main() {\n    \n    return 0;\n}",
            check: (code, output) => output.includes("Max")
        }
    },
    {
        type: 'PRÁCTICA',
        title: "Clases y Objetos (Reto 1)",
        concept: "Añade un método a la clase.",
        hint: "Dentro de la clase define otro def (o void) que haga algo, y luego llámalo con instancia.metodo()",
        python: {
            ex: "class Perro:\n    def __init__(self, nombre):\n        self.nombre = nombre\n    def ladrar(self):\n        print('Guau')\np = Perro('Max')\np.ladrar()",
            mission: "Agrega un método 'ladrar()' a Perro que imprima 'Guau' y llámalo.",
            init: "",
            check: (code, output) => output.includes("Guau")
        },
        cpp: {
            ex: 'class Perro {\npublic:\n    string nombre;\n    Perro(string n) { nombre = n; }\n    void ladrar() { cout << "Guau"; }\n};\nint main() {\n    Perro p("Max");\n    p.ladrar();\n    return 0;\n}',
            mission: "Implementa 'void ladrar()' que muestre 'Guau' y pruébalo.",
            init: "#include <iostream>\nusing namespace std;\n\nclass Perro {\npublic:\n    string nombre;\n    Perro(string n) { nombre = n; }\n    void ladrar() {\n        \n    }\n};\nint main() {\n    Perro p(\"Max\");\n    p.ladrar();\n    return 0;\n}",
            check: (code, output) => output.includes("Guau")
        }
    },
    {
        type: 'PRÁCTICA',
        title: "Clases y Objetos (Reto 2)",
        concept: "Herencia: una clase que extiende a otra y sobrescribe un método.",
        hint: "En Python: class Coche(Vehiculo): y redefine el método. En C++: class Coche : public Vehiculo { ... override }.",
        python: {
            ex: "class Animal:\n    def hablar(self):\n        pass\nclass Gato(Animal):\n    def hablar(self):\n        print('Miau')\nclass Perro(Animal):\n    def hablar(self):\n        print('Guau')\ng = Gato()\ng.hablar()\np = Perro()\np.hablar()",
            mission: "Crea clase 'Vehiculo' con método 'arrancar()' que imprima 'Arrancado'. Luego 'Coche' que herede y sobrescriba con 'Motor encendido'. Instancia Coche y llama a arrancar().",
            init: "",
            check: (code, output) => output.includes("Motor encendido")
        },
        cpp: {
            ex: 'class Vehiculo {\npublic:\n    virtual void arrancar() { cout << "Arrancado"; }\n};\nclass Coche : public Vehiculo {\npublic:\n    void arrancar() override { cout << "Motor encendido"; }\n};\nint main() {\n    Coche c;\n    c.arrancar();\n    return 0;\n}',
            mission: "Herencia: 'Vehiculo' con método 'arrancar()' que diga 'Arrancado'; 'Coche' que herede y sobrescriba con 'Motor encendido'. Muestra 'Motor encendido'.",
            init: "#include <iostream>\nusing namespace std;\n\nclass Vehiculo {\npublic:\n    virtual void arrancar() { cout << \"Arrancado\"; }\n};\nclass Coche : public Vehiculo {\npublic:\n    void arrancar() override {\n        \n    }\n};\nint main() {\n    Coche c;\n    c.arrancar();\n    return 0;\n}",
            check: (code, output) => output.includes("Motor encendido")
        }
    }
];