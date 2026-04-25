/* =============================================
   Motor de ejecución didáctico Python + C++
   Soporta: variables, operadores, if/while/for,
   funciones, clases, herencia, map, vector.
   ============================================= */

function simulateExecution(code, lang) {
    code = code.replace(/[\u200B-\u200D\uFEFF]/g, '');
    const lines = code.split('\n');
    const vars = {};
    const functions = {};
    const classes = {};
    let output = '';

    // ----- Utilidades -----
    const removeComments = (line) => {
        let inStr = false, strCh = '';
        for (let i = 0; i < line.length; i++) {
            const ch = line[i];
            if (inStr) {
                if (ch === strCh) inStr = false;
            } else {
                if (ch === '"' || ch === "'") { inStr = true; strCh = ch; }
                else if ((lang === 'python' && ch === '#') || (lang === 'cpp' && ch === '/' && line[i+1] === '/')) {
                    return line.substring(0, i).trimEnd();
                }
            }
        }
        return line;
    };

    const cleanLine = (line) => {
        let cleaned = removeComments(line).trim();
        if (lang === 'python') cleaned = cleaned.replace(/:$/, ''); // quitar : final para bloques
        return cleaned;
    };

    const evaluate = (expr, localVars = {}) => {
        if (typeof expr === 'number') return expr;
        if (typeof expr === 'string') expr = expr.trim();
        if (expr === '') return '';
        const allVars = { ...vars, ...localVars };
        let processed = '';
        let i = 0, inStr = false, strCh = '';
        while (i < expr.length) {
            const ch = expr[i];
            if (inStr) {
                processed += ch;
                if (ch === strCh) inStr = false;
            } else {
                if (ch === '"' || ch === "'") { inStr = true; strCh = ch; processed += ch; }
                else {
                    let replaced = false;
                    const varNames = Object.keys(allVars).sort((a,b) => b.length - a.length);
                    for (let v of varNames) {
                        const re = new RegExp('\\b' + v + '\\b');
                        const m = re.exec(expr.slice(i));
                        if (m && m.index === 0) {
                            processed += String(allVars[v]);
                            i += v.length - 1;
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
            return Function('"use strict"; return (' + processed + ')')();
        } catch (e) {
            return `[Error: ${e.message}]`;
        }
    };

    const extractPrintArgs = (line) => {
        const openIdx = line.indexOf('print(');
        if (openIdx === -1) return null;
        let start = openIdx + 6, count = 1, end = start;
        let inStr = false, strCh = '';
        while (end < line.length && count > 0) {
            const c = line[end];
            if (inStr) {
                if (c === strCh) inStr = false;
            } else {
                if (c === '"' || c === "'") { inStr = true; strCh = c; }
                else if (c === '(') count++;
                else if (c === ')') count--;
            }
            end++;
        }
        if (count !== 0) return null;
        const argsStr = line.slice(start, end-1).trim();
        if (argsStr === '') return [];
        const args = [];
        let current = ''; inStr = false;
        for (let ch of argsStr) {
            if (inStr) {
                current += ch;
                if (ch === strCh) inStr = false;
            } else {
                if (ch === '"' || ch === "'") { inStr = true; strCh = ch; current += ch; }
                else if (ch === ',') { args.push(current.trim()); current = ''; }
                else current += ch;
            }
        }
        if (current.trim()) args.push(current.trim());
        return args;
    };

    const getClassMethod = (className, methodName) => {
        let cls = classes[className];
        while (cls) {
            if (cls.methods[methodName]) return cls.methods[methodName];
            cls = cls.parent ? classes[cls.parent] : null;
        }
        return null;
    };

    const instantiateClass = (className, args, localVars) => {
        const obj = { __class__: className };
        // Buscar constructor en jerarquía
        let init = null;
        let cls = classes[className];
        while (cls && !init) {
            if (cls.methods['__init__']) init = cls.methods['__init__'];
            else cls = cls.parent ? classes[cls.parent] : null;
        }
        if (init) {
            const initVars = { ...localVars };
            initVars[init.params[0]] = obj;
            for (let p = 1; p < init.params.length; p++) {
                initVars[init.params[p]] = args[p-1] !== undefined ? args[p-1] : null;
            }
            executeBlock(init.block, initVars);
        }
        return obj;
    };

    const executeBlock = (blockLines, localVars = {}) => {
        let out = '';
        let i = 0;
        while (i < blockLines.length) {
            const originalLine = blockLines[i];
            const line = cleanLine(originalLine);
            if (line === '' || line.startsWith('#')) { i++; continue; }

            // if / elif / else
            if ((lang === 'python' && (line.startsWith('if ') || line.startsWith('elif ') || line.startsWith('else'))) ||
                (lang === 'cpp' && (line.startsWith('if (') || line.startsWith('else if (') || line.startsWith('else')))) {
                let cond = true;
                let isElse = false;
                if (lang === 'python') {
                    if (line.startsWith('else')) { isElse = true; cond = true; }
                    else {
                        const kw = line.startsWith('elif ') ? 'elif' : 'if';
                        const expr = line.slice(kw.length).trim();
                        cond = !!evaluate(expr, localVars);
                    }
                } else { // cpp
                    if (line.startsWith('else if (')) {
                        cond = !!evaluate(line.slice(8, -1).trim(), localVars);
                    } else if (line.startsWith('if (')) {
                        cond = !!evaluate(line.slice(4, -1).trim(), localVars);
                    } else if (line.startsWith('else')) {
                        isElse = true; cond = true;
                    }
                }
                // Encontrar bloque
                let j = i + 1;
                const block = [];
                if (lang === 'python') {
                    while (j < blockLines.length) {
                        const nl = blockLines[j];
                        if (nl.trim() === '' || nl.trim().startsWith('#')) { j++; continue; }
                        if (nl.startsWith(' ') || nl.startsWith('\t')) { block.push(nl); j++; }
                        else break;
                    }
                } else { // C++ usa llaves
                    // Buscar apertura de llave
                    while (j < blockLines.length && !blockLines[j].includes('{')) j++;
                    if (j < blockLines.length) {
                        j++; // saltar la línea con {
                        let braceCount = 1;
                        while (j < blockLines.length && braceCount > 0) {
                            const nl = blockLines[j];
                            if (nl.includes('{')) braceCount++;
                            if (nl.includes('}')) braceCount--;
                            if (braceCount > 0) block.push(nl);
                            j++;
                        }
                    }
                }
                if (cond) {
                    out += executeBlock(block, localVars);
                    // Saltar bloques elif/else posteriores (Python)
                    if (lang === 'python') {
                        while (j < blockLines.length) {
                            const nl = blockLines[j].trim();
                            if (nl.startsWith('elif ') || nl.startsWith('else')) {
                                j++;
                                while (j < blockLines.length && (blockLines[j].trim() === '' || blockLines[j].startsWith(' ') || blockLines[j].startsWith('\t'))) j++;
                            } else break;
                        }
                    }
                } else {
                    // Buscar siguiente elif/else
                    while (j < blockLines.length) {
                        const nl = blockLines[j].trim();
                        if ((lang === 'python' && (nl.startsWith('elif ') || nl.startsWith('else'))) ||
                            (lang === 'cpp' && (nl.startsWith('else if (') || nl.startsWith('else')))) break;
                        j++;
                    }
                }
                i = j;
                continue;
            }

            // while
            if ((lang === 'python' && line.startsWith('while ')) || (lang === 'cpp' && line.startsWith('while ('))) {
                const expr = lang === 'python' ? line.slice(6).trim() : line.slice(6, -1).trim();
                let j = i + 1;
                const block = [];
                if (lang === 'python') {
                    while (j < blockLines.length) {
                        const nl = blockLines[j];
                        if (nl.trim() === '' || nl.trim().startsWith('#')) { j++; continue; }
                        if (nl.startsWith(' ') || nl.startsWith('\t')) { block.push(nl); j++; }
                        else break;
                    }
                } else {
                    while (j < blockLines.length && !blockLines[j].includes('{')) j++;
                    if (j < blockLines.length) {
                        j++;
                        let braceCount = 1;
                        while (j < blockLines.length && braceCount > 0) {
                            const nl = blockLines[j];
                            if (nl.includes('{')) braceCount++;
                            if (nl.includes('}')) braceCount--;
                            if (braceCount > 0) block.push(nl);
                            j++;
                        }
                    }
                }
                while (evaluate(expr, localVars)) {
                    out += executeBlock(block, localVars);
                }
                i = j;
                continue;
            }

            // for (Python y C++)
            if (lang === 'python' && line.startsWith('for ')) {
                const forRange = /for (\w+) in range\((\d+)(?:,(\d+))?\)/.exec(line);
                if (forRange) {
                    const varName = forRange[1];
                    const start = forRange[3] ? parseInt(forRange[2]) : 0;
                    const end = forRange[3] ? parseInt(forRange[3]) : parseInt(forRange[2]);
                    let j = i + 1;
                    const block = [];
                    while (j < blockLines.length) {
                        const nl = blockLines[j];
                        if (nl.trim() === '' || nl.trim().startsWith('#')) { j++; continue; }
                        if (nl.startsWith(' ') || nl.startsWith('\t')) { block.push(nl); j++; }
                        else break;
                    }
                    for (let ci = start; ci < end; ci++) {
                        localVars[varName] = ci;
                        out += executeBlock(block, localVars);
                    }
                    i = j;
                    continue;
                }
                const forIn = /for (\w+) in (\w+)/.exec(line);
                if (forIn) {
                    const varName = forIn[1], listName = forIn[2];
                    const list = localVars[listName] || vars[listName];
                    if (Array.isArray(list)) {
                        let j = i + 1;
                        const block = [];
                        while (j < blockLines.length) {
                            const nl = blockLines[j];
                            if (nl.trim() === '' || nl.trim().startsWith('#')) { j++; continue; }
                            if (nl.startsWith(' ') || nl.startsWith('\t')) { block.push(nl); j++; }
                            else break;
                        }
                        for (let elem of list) {
                            localVars[varName] = elem;
                            out += executeBlock(block, localVars);
                        }
                        i = j;
                        continue;
                    }
                }
            }
            if (lang === 'cpp' && line.startsWith('for (')) {
                const cFor = /for\s*\((.+)\)/.exec(line);
                if (cFor) {
                    const parts = cFor[1].split(';');
                    if (parts.length === 3) {
                        const init = parts[0].trim();
                        const cond = parts[1].trim();
                        const inc = parts[2].trim();
                        // Ejecutar inicialización
                        if (init) {
                            const initAssign = init.match(/^(\w+)\s*=\s*(.+)/);
                            if (initAssign) localVars[initAssign[1]] = evaluate(initAssign[2], localVars);
                        }
                        let j = i + 1;
                        const block = [];
                        while (j < blockLines.length && !blockLines[j].includes('{')) j++;
                        if (j < blockLines.length) {
                            j++;
                            let braceCount = 1;
                            while (j < blockLines.length && braceCount > 0) {
                                const nl = blockLines[j];
                                if (nl.includes('{')) braceCount++;
                                if (nl.includes('}')) braceCount--;
                                if (braceCount > 0) block.push(nl);
                                j++;
                            }
                        }
                        while (evaluate(cond, localVars)) {
                            out += executeBlock(block, localVars);
                            if (inc) {
                                const incParts = inc.match(/(\w+)\s*=\s*(.+)/);
                                if (incParts) {
                                    localVars[incParts[1]] = evaluate(incParts[2], localVars);
                                } else {
                                    // i++ o i+=1
                                    const incMatch = inc.match(/(\w+)\+\+/);
                                    if (incMatch) localVars[incMatch[1]]++;
                                }
                            }
                        }
                        i = j;
                        continue;
                    }
                }
            }

            // print
            if (line.startsWith('print(')) {
                const args = extractPrintArgs(originalLine); // usar línea original para no perder comillas
                if (args) {
                    const evaluated = args.map(arg => {
                        if ((arg.startsWith("'") && arg.endsWith("'")) || (arg.startsWith('"') && arg.endsWith('"'))) return arg.slice(1, -1);
                        return evaluate(arg, localVars);
                    });
                    out += evaluated.join(' ') + '\n';
                }
                i++; continue;
            }

            // cout (C++)
            if (lang === 'cpp' && line.startsWith('cout')) {
                const streamPart = line.replace(/^cout\s*/i, '').replace(/;\s*$/, '').trim();
                const parts = streamPart.split('<<').map(p => p.trim()).filter(p => p);
                let lineOutput = '';
                for (let p of parts) {
                    if (p === 'endl') {
                        lineOutput += '\n';
                    } else if ((p.startsWith('"') && p.endsWith('"')) || (p.startsWith("'") && p.endsWith("'"))) {
                        lineOutput += p.slice(1, -1);
                    } else {
                        const val = evaluate(p, localVars);
                        lineOutput += String(val);
                    }
                }
                output += lineOutput;
                i++; continue;
            }

            // Asignación
            const assignMatch = line.match(/^(\w+)\s*=\s*(.+?)(?:\s*;)?$/);
            if (assignMatch && !line.includes('(')) {
                localVars[assignMatch[1]] = evaluate(assignMatch[2], localVars);
                i++; continue;
            }

            // Declaración C++ (int x = ...)
            if (lang === 'cpp') {
                const declMatch = line.match(/^(int|float|double|string|char|map<.*>|vector<.*>)\s+(\w+)\s*=\s*(.+?);$/);
                if (declMatch) {
                    localVars[declMatch[2]] = evaluate(declMatch[3], localVars);
                    i++; continue;
                }
            }

            // Llamada a función / método
            const callMatch = line.match(/^(\w+(?:\.\w+)?)\s*\((.*)\)\s*;?$/);
            if (callMatch) {
                const fullName = callMatch[1];
                const argsStr = callMatch[2];
                const argValues = argsStr ? argsStr.split(',').map(a => evaluate(a.trim(), localVars)) : [];
                if (fullName.includes('.')) {
                    const [objName, methodName] = fullName.split('.');
                    const obj = localVars[objName] || vars[objName];
                    if (obj && obj.__class__) {
                        const method = getClassMethod(obj.__class__, methodName);
                        if (method) {
                            const methodVars = { ...localVars };
                            methodVars[method.params[0]] = obj;
                            for (let p = 1; p < method.params.length; p++) {
                                methodVars[method.params[p]] = argValues[p-1];
                            }
                            out += executeBlock(method.block, methodVars);
                        }
                    }
                } else if (functions[fullName]) {
                    const func = functions[fullName];
                    const funcVars = { ...localVars };
                    for (let p = 0; p < func.params.length; p++) {
                        funcVars[func.params[p]] = argValues[p];
                    }
                    out += executeBlock(func.block, funcVars);
                }
                i++; continue;
            }

            // Instanciación (Python y C++)
            const newMatch = line.match(/^(\w+)\s*=\s*new\s+(\w+)\((.*)\);?$/); // C++ new
            if (newMatch && lang === 'cpp') {
                const varName = newMatch[1], className = newMatch[2], argsStr = newMatch[3];
                const argValues = argsStr ? argsStr.split(',').map(a => evaluate(a.trim(), localVars)) : [];
                localVars[varName] = instantiateClass(className, argValues, localVars);
                i++; continue;
            }
            const instMatch = line.match(/^(\w+)\s*=\s*(\w+)\((.*)\)\s*;?$/);
            if (instMatch && classes[instMatch[2]]) {
                const varName = instMatch[1], className = instMatch[2], argsStr = instMatch[3];
                const argValues = argsStr ? argsStr.split(',').map(a => evaluate(a.trim(), localVars)) : [];
                const obj = instantiateClass(className, argValues, localVars);
                (className === instMatch[2]) ? (localVars[varName] = obj) : (vars[varName] = obj);
                i++; continue;
            }

            i++;
        }
        return out;
    };

    // ----- Parseo de funciones y clases (Python) -----
    if (lang === 'python') {
        const globalLines = [];
        let i = 0;
        while (i < lines.length) {
            const raw = lines[i].trim();
            if (raw.startsWith('def ')) {
                const m = /def (\w+)\((.*)\)\s*:/.exec(raw);
                if (m) {
                    const fName = m[1], params = m[2].split(',').map(p=>p.trim()).filter(p=>p!==''&&p!=='self');
                    let j = i+1, block=[];
                    while (j < lines.length) {
                        const nl = lines[j];
                        if (nl.trim()===''||nl.trim().startsWith('#')){j++;continue;}
                        if (nl.startsWith(' ')||nl.startsWith('\t')){block.push(nl);j++;}
                        else break;
                    }
                    functions[fName] = {params, block};
                    i = j; continue;
                }
            } else if (raw.startsWith('class ')) {
                const cMatch = /class (\w+)(?:\((.*)\))?\s*:/.exec(raw);
                if (cMatch) {
                    const cName = cMatch[1], parent = cMatch[2] || null;
                    let j = i+1, classBlock=[];
                    while (j < lines.length) {
                        const nl = lines[j];
                        if (nl.trim()===''||nl.trim().startsWith('#')){j++;continue;}
                        if (nl.startsWith(' ')||nl.startsWith('\t')){classBlock.push(nl);j++;}
                        else break;
                    }
                    const methods = {};
                    let mi = 0;
                    while (mi < classBlock.length) {
                        const ml = classBlock[mi].trim();
                        if (ml.startsWith('def ')) {
                            const mf = /def (\w+)\((.*)\)\s*:/.exec(ml);
                            if (mf) {
                                const mName = mf[1], mParams = mf[2].split(',').map(p=>p.trim()).filter(p=>p!=='');
                                let mj = mi+1, mBlock=[];
                                while (mj < classBlock.length) {
                                    const mnl = classBlock[mj];
                                    if (mnl.trim()===''||mnl.trim().startsWith('#')){mj++;continue;}
                                    if (mnl.startsWith(' ')||mnl.startsWith('\t')){mBlock.push(mnl);mj++;}
                                    else break;
                                }
                                methods[mName] = {params: mParams, block: mBlock};
                                mi = mj; continue;
                            }
                        }
                        mi++;
                    }
                    classes[cName] = {parent, methods};
                    i = j; continue;
                }
            } else {
                globalLines.push(lines[i]);
            }
            i++;
        }
        output = executeBlock(globalLines, vars);
    }

    // ----- C++ -----
    else if (lang === 'cpp') {
        let insideMain = false, braceLevel = 0;
        const mainLines = [];
        for (let line of lines) {
            const trimmed = line.trim();
            if (trimmed.startsWith('#') || trimmed.startsWith('using namespace')) continue;
            if (trimmed.includes('int main()')) { insideMain = true; continue; }
            if (!insideMain) continue;
            if (trimmed.includes('{')) braceLevel++;
            if (trimmed.includes('}')) braceLevel--;
            if (braceLevel === 0 && trimmed.includes('}')) break;
            mainLines.push(line);
        }
        output = executeBlock(mainLines, vars);
    }

    return output.trimEnd();
}