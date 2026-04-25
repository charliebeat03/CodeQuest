// =============================================
// Motor de ejecución didáctico para Python y C++
// =============================================

function simulateExecution(code, lang) {
    // Limpiar caracteres invisibles
    code = code.replace(/[\u200B-\u200D\uFEFF]/g, '');
    const lines = code.split('\n');
    const vars = {};            // variables globales
    const functions = {};       // funciones definidas por el usuario
    const classes = {};         // clases con métodos
    let output = '';

    // ------------------------------------------------------------
    //  EVALUADOR DE EXPRESIONES
    // ------------------------------------------------------------
    function evaluate(expr, localVars = {}) {
        if (typeof expr === 'number') return expr;
        if (typeof expr === 'string') expr = expr.trim();
        if (expr === '') return '';

        const allVars = { ...vars, ...localVars };
        let processed = '';
        let i = 0;
        let inStr = false;
        let strCh = '';

        while (i < expr.length) {
            const ch = expr[i];
            if (inStr) {
                processed += ch;
                if (ch === strCh) inStr = false;
            } else {
                if (ch === '"' || ch === "'") {
                    inStr = true;
                    strCh = ch;
                    processed += ch;
                } else {
                    let replaced = false;
                    // Reemplazar variable más larga primero
                    const varNames = Object.keys(allVars).sort((a,b) => b.length - a.length);
                    for (let varName of varNames) {
                        const regex = new RegExp('\\b' + varName + '\\b');
                        const match = regex.exec(expr.slice(i));
                        if (match && match.index === 0) {
                            let val = allVars[varName];
                            processed += (typeof val === 'string') ? val : String(val);
                            i += varName.length - 1;
                            replaced = true;
                            break;
                        }
                    }
                    if (!replaced) processed += ch;
                }
            }
            i++;
        }

        try {
            // Evaluar usando Function; solo permite operadores básicos
            return Function('"use strict"; return (' + processed + ')')();
        } catch (e) {
            return processed; // devolver la expresión procesada tal cual si falla
        }
    }

    // ------------------------------------------------------------
    //  EXTRACTOR DE ARGUMENTOS DE PRINT()
    // ------------------------------------------------------------
    function extractPrintArgs(line) {
        const openIdx = line.indexOf('print(');
        if (openIdx === -1) return null;
        let start = openIdx + 6; // justo después de 'print('
        let count = 1;
        let end = start;
        let inStr = false;
        let strCh = '';
        while (end < line.length && count > 0) {
            const c = line[end];
            if (inStr) {
                if (c === strCh) inStr = false;
            } else {
                if (c === '"' || c === "'") {
                    inStr = true;
                    strCh = c;
                } else if (c === '(') count++;
                else if (c === ')') count--;
            }
            end++;
        }
        if (count !== 0) return null;

        const argsStr = line.slice(start, end - 1).trim();
        if (argsStr === '') return [];
        const args = [];
        let current = '';
        inStr = false;
        for (let ch of argsStr) {
            if (inStr) {
                current += ch;
                if (ch === strCh) inStr = false;
            } else {
                if (ch === '"' || ch === "'") {
                    inStr = true;
                    strCh = ch;
                    current += ch;
                } else if (ch === ',') {
                    args.push(current.trim());
                    current = '';
                } else {
                    current += ch;
                }
            }
        }
        if (current.trim()) args.push(current.trim());
        return args;
    }

    // ------------------------------------------------------------
    //  EJECUTOR DE BLOQUE (PYTHON)
    // ------------------------------------------------------------
    function executeBlock(blockLines, localVars = {}) {
        let out = '';
        let i = 0;
        while (i < blockLines.length) {
            const rawLine = blockLines[i];
            const line = rawLine.trim();
            if (line === '' || line.startsWith('#')) {
                i++;
                continue;
            }

            // --- if / elif / else ---
            if (line.startsWith('if ') || line.startsWith('elif ') || line.startsWith('else:')) {
                let cond = true;
                if (line.startsWith('else:')) {
                    cond = true;
                } else {
                    const keyword = line.startsWith('elif ') ? 'elif' : 'if';
                    const expr = line.slice(keyword.length).replace(':', '').trim();
                    cond = !!evaluate(expr, localVars);
                }
                // Buscar bloque indentado
                let j = i + 1;
                const block = [];
                while (j < blockLines.length) {
                    const nl = blockLines[j];
                    if (nl.trim() === '' || nl.trim().startsWith('#')) {
                        j++;
                        continue;
                    }
                    if (nl.startsWith(' ') || nl.startsWith('\t')) {
                        block.push(nl);
                        j++;
                    } else {
                        break;
                    }
                }
                if (cond) {
                    out += executeBlock(block, localVars);
                    // Saltar bloques elif/else posteriores
                    while (j < blockLines.length) {
                        const nl = blockLines[j].trim();
                        if (nl.startsWith('elif ') || nl.startsWith('else:')) {
                            j++;
                            while (j < blockLines.length &&
                                  (blockLines[j].trim() === '' ||
                                   blockLines[j].startsWith(' ') ||
                                   blockLines[j].startsWith('\t'))) {
                                j++;
                            }
                        } else {
                            break;
                        }
                    }
                } else {
                    // Buscar siguiente elif/else
                    while (j < blockLines.length) {
                        const nl = blockLines[j].trim();
                        if (nl.startsWith('elif ') || nl.startsWith('else:')) {
                            break;
                        }
                        j++;
                    }
                }
                i = j;
                continue;
            }

            // --- while ---
            if (line.startsWith('while ')) {
                const expr = line.slice(6).replace(':', '').trim();
                let j = i + 1;
                const block = [];
                while (j < blockLines.length) {
                    const nl = blockLines[j];
                    if (nl.trim() === '' || nl.trim().startsWith('#')) {
                        j++;
                        continue;
                    }
                    if (nl.startsWith(' ') || nl.startsWith('\t')) {
                        block.push(nl);
                        j++;
                    } else {
                        break;
                    }
                }
                while (evaluate(expr, localVars)) {
                    out += executeBlock(block, localVars);
                }
                i = j;
                continue;
            }

            // --- for ... in range(...) ---
            const forRange = /for (\w+) in range\((\d+)(?:,(\d+))?\):/.exec(line);
            if (forRange) {
                const varName = forRange[1];
                const start = forRange[3] ? parseInt(forRange[2]) : 0;
                const end = forRange[3] ? parseInt(forRange[3]) : parseInt(forRange[2]);
                let j = i + 1;
                const block = [];
                while (j < blockLines.length) {
                    const nl = blockLines[j];
                    if (nl.trim() === '' || nl.trim().startsWith('#')) {
                        j++;
                        continue;
                    }
                    if (nl.startsWith(' ') || nl.startsWith('\t')) {
                        block.push(nl);
                        j++;
                    } else {
                        break;
                    }
                }
                for (let ci = start; ci < end; ci++) {
                    localVars[varName] = ci;
                    out += executeBlock(block, localVars);
                }
                i = j;
                continue;
            }

            // --- for ... in lista ---
            const forInList = /for (\w+) in (\w+):/.exec(line);
            if (forInList) {
                const varName = forInList[1];
                const listName = forInList[2];
                const list = localVars[listName] || vars[listName];
                if (Array.isArray(list)) {
                    let j = i + 1;
                    const block = [];
                    while (j < blockLines.length) {
                        const nl = blockLines[j];
                        if (nl.trim() === '' || nl.trim().startsWith('#')) {
                            j++;
                            continue;
                        }
                        if (nl.startsWith(' ') || nl.startsWith('\t')) {
                            block.push(nl);
                            j++;
                        } else {
                            break;
                        }
                    }
                    for (let elem of list) {
                        localVars[varName] = elem;
                        out += executeBlock(block, localVars);
                    }
                    i = j;
                    continue;
                }
            }

            // --- print() ---
            if (line.startsWith('print(')) {
                const args = extractPrintArgs(rawLine);
                if (args) {
                    const evaluated = args.map(arg => {
                        if ((arg.startsWith("'") && arg.endsWith("'")) ||
                            (arg.startsWith('"') && arg.endsWith('"'))) {
                            return arg.slice(1, -1);
                        }
                        return evaluate(arg, localVars);
                    });
                    out += evaluated.join(' ') + '\n';
                }
                i++;
                continue;
            }

            // --- asignación simple ---
            const assignMatch = line.match(/^(\w+)\s*=\s*(.+)$/);
            if (assignMatch && !line.includes('(')) {
                localVars[assignMatch[1]] = evaluate(assignMatch[2], localVars);
                i++;
                continue;
            }

            // --- llamada a función definida por el usuario ---
            const callMatch = line.match(/^(\w+)\((.*)\)$/);
            if (callMatch && functions[callMatch[1]]) {
                const funcName = callMatch[1];
                const argsStr = callMatch[2];
                const func = functions[funcName];
                const argValues = argsStr ? argsStr.split(',').map(a => evaluate(a.trim(), localVars)) : [];
                const newLocalVars = { ...localVars };
                for (let p = 0; p < func.params.length; p++) {
                    newLocalVars[func.params[p]] = argValues[p];
                }
                out += executeBlock(func.block, newLocalVars);
                i++;
                continue;
            }

            // --- instanciación de clase: var = Clase(args) ---
            const instMatch = line.match(/^(\w+)\s*=\s*(\w+)\((.*)\)$/);
            if (instMatch && classes[instMatch[2]]) {
                const varName = instMatch[1];
                const className = instMatch[2];
                const argsStr = instMatch[3];
                const obj = { __class__: className };
                // Llamar a __init__ si existe
                if (classes[className].methods['__init__']) {
                    const init = classes[className].methods['__init__'];
                    const argValues = argsStr ? argsStr.split(',').map(a => evaluate(a.trim(), localVars)) : [];
                    const initVars = { ...localVars };
                    initVars[init.params[0]] = obj;
                    for (let p = 1; p < init.params.length; p++) {
                        initVars[init.params[p]] = argValues[p-1];
                    }
                    executeBlock(init.block, initVars);
                }
                vars[varName] = obj;
                i++;
                continue;
            }

            // --- llamada a método: obj.metodo(args) ---
            const methodCall = line.match(/^(\w+)\.(\w+)\((.*)\)$/);
            if (methodCall) {
                const objName = methodCall[1];
                const methodName = methodCall[2];
                const argsStr = methodCall[3];
                const obj = vars[objName] || localVars[objName];
                if (obj && obj.__class__ && classes[obj.__class__] && classes[obj.__class__].methods[methodName]) {
                    const method = classes[obj.__class__].methods[methodName];
                    const argValues = argsStr ? argsStr.split(',').map(a => evaluate(a.trim(), localVars)) : [];
                    const methodVars = { ...localVars };
                    methodVars[method.params[0]] = obj; // self
                    for (let p = 1; p < method.params.length; p++) {
                        methodVars[method.params[p]] = argValues[p-1];
                    }
                    out += executeBlock(method.block, methodVars);
                    i++;
                    continue;
                }
            }

            i++;
        }
        return out;
    }

    // ========================================================
    //  PROCESAMIENTO PRINCIPAL SEGÚN LENGUAJE
    // ========================================================
    if (lang === 'python') {
        // Primer pase: extraer definiciones de funciones y clases
        const globalLines = [];
        let i = 0;
        while (i < lines.length) {
            const raw = lines[i].trim();

            // Definición de función
            if (raw.startsWith('def ')) {
                const m = /def (\w+)\((.*)\)\s*:/.exec(raw);
                if (m) {
                    const fName = m[1];
                    const params = m[2].split(',').map(p=>p.trim()).filter(p=>p!==''&&p!=='self');
                    let j = i + 1;
                    const block = [];
                    while (j < lines.length) {
                        const nl = lines[j];
                        if (nl.trim() === '' || nl.trim().startsWith('#')) { j++; continue; }
                        if (nl.startsWith(' ') || nl.startsWith('\t')) { block.push(nl); j++; }
                        else break;
                    }
                    functions[fName] = { params, block };
                    i = j;
                    continue;
                }
            }
            // Definición de clase
            else if (raw.startsWith('class ')) {
                const cMatch = /class (\w+)(?:\((.*)\))?\s*:/.exec(raw);
                if (cMatch) {
                    const cName = cMatch[1];
                    const parent = cMatch[2] || null;
                    let j = i + 1;
                    const classBlock = [];
                    while (j < lines.length) {
                        const nl = lines[j];
                        if (nl.trim() === '' || nl.trim().startsWith('#')) { j++; continue; }
                        if (nl.startsWith(' ') || nl.startsWith('\t')) { classBlock.push(nl); j++; }
                        else break;
                    }
                    // Extraer métodos
                    const methods = {};
                    let mi = 0;
                    while (mi < classBlock.length) {
                        const ml = classBlock[mi].trim();
                        if (ml.startsWith('def ')) {
                            const mf = /def (\w+)\((.*)\)\s*:/.exec(ml);
                            if (mf) {
                                const mName = mf[1];
                                const mParams = mf[2].split(',').map(p=>p.trim()).filter(p=>p!=='');
                                let mj = mi + 1;
                                const mBlock = [];
                                while (mj < classBlock.length) {
                                    const mnl = classBlock[mj];
                                    if (mnl.trim() === '' || mnl.trim().startsWith('#')) { mj++; continue; }
                                    if (mnl.startsWith(' ') || mnl.startsWith('\t')) { mBlock.push(mnl); mj++; }
                                    else break;
                                }
                                methods[mName] = { params: mParams, block: mBlock };
                                mi = mj;
                                continue;
                            }
                        }
                        mi++;
                    }
                    classes[cName] = { parent, methods };
                    i = j;
                    continue;
                }
            }
            // Cualquier otra línea va al bloque global
            else {
                globalLines.push(lines[i]);
            }
            i++;
        }

        // Ejecutar el bloque global
        output = executeBlock(globalLines, vars);
    }

    // ========================================================
    //  C++
    // ========================================================
    else if (lang === 'cpp') {
        // Detectar si el código contiene int main() o es código suelto
        let hasMain = false;
        let mainStartLine = -1;
        let mainEndLine = -1;

        for (let i = 0; i < lines.length; i++) {
            if (lines[i].trim().includes('int main()')) {
                hasMain = true;
                mainStartLine = i;
                // Encontrar la llave de cierre de main
                let braceCount = 0;
                let j = i;
                while (j < lines.length) {
                    const l = lines[j];
                    for (let ch of l) {
                        if (ch === '{') braceCount++;
                        else if (ch === '}') braceCount--;
                    }
                    if (braceCount === 0 && j > i) {
                        mainEndLine = j;
                        break;
                    }
                    j++;
                }
                break;
            }
        }

        let processLines = [];
        if (hasMain && mainStartLine !== -1 && mainEndLine !== -1) {
            // Extraer líneas dentro del bloque main
            let braceLine = mainStartLine;
            while (braceLine <= mainEndLine && !lines[braceLine].includes('{')) braceLine++;
            let startBody = braceLine + 1;
            for (let k = startBody; k < mainEndLine; k++) {
                processLines.push(lines[k]);
            }
        } else {
            // Sin main: todo el código es el cuerpo (se ignoran includes y using)
            for (let line of lines) {
                const trimmed = line.trim();
                if (!trimmed || trimmed.startsWith('#') || trimmed.startsWith('using namespace')) continue;
                processLines.push(line);
            }
        }

        // Ejecutar las líneas del cuerpo
        for (let line of processLines) {
            const trimmed = line.trim();
            if (!trimmed) continue;

            // Declaración/asignación con tipo
            const typedAssign = trimmed.match(/^(int|float|double|string|char)\s+(\w+)\s*=\s*(.+?);\s*(?:\/\/.*)?$/);
            if (typedAssign) {
                vars[typedAssign[2]] = evaluate(typedAssign[3], vars);
                continue;
            }
            // Asignación simple
            const plainAssign = trimmed.match(/^(\w+)\s*=\s*(.+?);\s*(?:\/\/.*)?$/);
            if (plainAssign) {
                vars[plainAssign[1]] = evaluate(plainAssign[2], vars);
                continue;
            }
            // cout
            if (trimmed.startsWith('cout')) {
                const streamPart = trimmed.replace(/^cout\s*/i, '').replace(/;\s*(?:\/\/.*)?$/, '').trim();
                const parts = streamPart.split('<<').map(p => p.trim()).filter(p => p);
                let lineOutput = '';
                for (let p of parts) {
                    if (p === 'endl') {
                        lineOutput += '\n';
                    } else if ((p.startsWith('"') && p.endsWith('"')) || (p.startsWith("'") && p.endsWith("'"))) {
                        lineOutput += p.slice(1, -1);
                    } else {
                        const val = evaluate(p, vars);
                        lineOutput += (typeof val === 'string') ? val : String(val);
                    }
                }
                output += lineOutput;
                continue;
            }
            // return se ignora
            if (trimmed.startsWith('return')) continue;
        }
    }

    return output.trimEnd();
}