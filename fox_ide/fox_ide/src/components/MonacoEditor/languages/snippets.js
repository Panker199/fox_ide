const JS_SNIPPETS = [
  { label: 'fn', insertText: 'function ${1:name}(${2:params}) {\n\t$0\n}', detail: 'Function declaration' },
  { label: 'afn', insertText: '(${1:params}) => {\n\t$0\n}', detail: 'Arrow function' },
  { label: 'cl', insertText: 'console.log($0)', detail: 'Console log' },
  { label: 'ce', insertText: 'console.error($0)', detail: 'Console error' },
  { label: 'cw', insertText: 'console.warn($0)', detail: 'Console warn' },
  { label: 'for', insertText: 'for (let ${1:i} = 0; ${1:i} < ${2:array}.length; ${1:i}++) {\n\t${2:array}[${1:i}]\n\t$0\n}', detail: 'For loop' },
  { label: 'forof', insertText: 'for (const ${1:item} of ${2:iterable}) {\n\t$0\n}', detail: 'For...of loop' },
  { label: 'forin', insertText: 'for (const ${1:key} in ${2:object}) {\n\t$0\n}', detail: 'For...in loop' },
  { label: 'ife', insertText: 'if (${1:condition}) {\n\t$0\n}', detail: 'If statement' },
  { label: 'ifee', insertText: 'if (${1:condition}) {\n\t$0\n} else {\n\t\n}', detail: 'If-else statement' },
  { label: 'wh', insertText: 'while (${1:condition}) {\n\t$0\n}', detail: 'While loop' },
  { label: 'try', insertText: 'try {\n\t$0\n} catch (${1:error}) {\n\t\n}', detail: 'Try-catch' },
  { label: 'tryf', insertText: 'try {\n\t$0\n} catch (${1:error}) {\n\t\n} finally {\n\t\n}', detail: 'Try-catch-finally' },
  { label: 'imp', insertText: 'import { ${1:module} } from \'${2:source}\';', detail: 'Import statement' },
  { label: 'impp', insertText: 'import ${1:module} from \'${2:source}\';', detail: 'Import default' },
  { label: 'exp', insertText: 'export default ${1:name}', detail: 'Export default' },
  { label: 'expf', insertText: 'export function ${1:name}(${2:params}) {\n\t$0\n}', detail: 'Export function' },
  { label: 'cls', insertText: 'class ${1:name} {\n\t$0\n}', detail: 'Class declaration' },
  { label: 'con', insertText: 'constructor(${1:params}) {\n\t$0\n}', detail: 'Constructor' },
  { label: 'pmt', insertText: 'new Promise((${1:resolve}, ${2:reject}) => {\n\t$0\n})', detail: 'Promise' },
  { label: 'map', insertText: '${1:array}.map((${2:item}) => {\n\treturn $0\n})', detail: 'Array map' },
  { label: 'filter', insertText: '${1:array}.filter((${2:item}) => ${3:condition})', detail: 'Array filter' },
  { label: 'reduce', insertText: '${1:array}.reduce((${2:acc}, ${3:item}) => {\n\t$0\n\treturn ${2:acc}\n}, ${4:initialValue})', detail: 'Array reduce' },
  { label: 'find', insertText: '${1:array}.find((${2:item}) => ${3:condition})', detail: 'Array find' },
  { label: 'each', insertText: '${1:array}.forEach((${2:item}) => {\n\t$0\n})', detail: 'Array forEach' },
  { label: 'tern', insertText: '${1:condition} ? ${2:trueVal} : ${3:falseVal}', detail: 'Ternary operator' },
  { label: 'sw', insertText: 'switch (${1:value}) {\n\tcase ${2:case1}:\n\t\t$0\n\t\tbreak\n\tdefault:\n\t\tbreak\n}', detail: 'Switch statement' },
  { label: 'await', insertText: 'await ${1:expression}', detail: 'Await expression' },
  { label: 'async', insertText: 'async function ${1:name}(${2:params}) {\n\t$0\n}', detail: 'Async function' },
  { label: 'destr', insertText: 'const { ${1:key} } = ${2:object}', detail: 'Destructuring' },
  { label: 'spread', insertText: '...${1:iterable}', detail: 'Spread operator' },
]

const TS_SNIPPETS = [
  ...JS_SNIPPETS,
  { label: 'int', insertText: 'interface ${1:Name} {\n\t$0\n}', detail: 'Interface' },
  { label: 'type', insertText: 'type ${1:Name} = ${2:type}', detail: 'Type alias' },
  { label: 'enum', insertText: 'enum ${1:Name} {\n\t${2:Member}\n}', detail: 'Enum' },
  { label: 'fn', insertText: 'function ${1:name}(${2:params}): ${3:void} {\n\t$0\n}', detail: 'Function with return type' },
  { label: 'afn', insertText: '(${1:params}): ${2:void} => {\n\t$0\n}', detail: 'Arrow function with return type' },
  { label: 'comp', insertText: 'interface ${1:Name}Props {\n\t$0\n}\n\nconst ${1:Name}: React.FC<${1:Name}Props> = (${2:props}) => {\n\treturn (\n\t\t$0\n\t)\n}', detail: 'React component' },
  { label: 'state', insertText: 'const [${1:state}, set${1/(.*)/${1:/capitalize}/}] = useState<${2:type}>(${3:initialValue})', detail: 'useState' },
  { label: 'effect', insertText: 'useEffect(() => {\n\t$0\n\treturn () => {\n\t\t\n\t}\n}, [${1:deps}])', detail: 'useEffect' },
  { label: 'ref', insertText: 'const ${1:ref} = useRef<${2:type}>(${3:initialValue})', detail: 'useRef' },
  { label: 'ctx', insertText: 'const ${1:context} = useContext(${2:Context})', detail: 'useContext' },
  { label: 'memo', insertText: 'useMemo(() => {\n\t$0\n\treturn ${2:value}\n}, [${3:deps}])', detail: 'useMemo' },
  { label: 'cb', insertText: 'useCallback((${1:params}) => {\n\t$0\n}, [${2:deps}])', detail: 'useCallback' },
]

const HTML_SNIPPETS = [
  { label: 'html', insertText: '<!DOCTYPE html>\n<html lang="en">\n<head>\n\t<meta charset="UTF-8">\n\t<meta name="viewport" content="width=device-width, initial-scale=1.0">\n\t<title>${1:Document}</title>\n</head>\n<body>\n\t$0\n</body>\n</html>', detail: 'HTML5 boilerplate' },
  { label: 'div', insertText: '<div class="${1:class}">\n\t$0\n</div>', detail: 'Div element' },
  { label: 'a', insertText: '<a href="${1:url}">${2:text}</a>', detail: 'Anchor tag' },
  { label: 'img', insertText: '<img src="${1:src}" alt="${2:alt}" />', detail: 'Image tag' },
  { label: 'ul', insertText: '<ul>\n\t<li>${1:item}</li>\n\t$0\n</ul>', detail: 'Unordered list' },
  { label: 'form', insertText: '<form action="${1:url}" method="${2:POST}">\n\t$0\n</form>', detail: 'Form element' },
  { label: 'input', insertText: '<input type="${1:text}" name="${2:name}" placeholder="${3:placeholder}" />', detail: 'Input element' },
  { label: 'btn', insertText: '<button type="${1:button}">${2:Click me}</button>', detail: 'Button element' },
]

const CSS_SNIPPETS = [
  { label: 'd', insertText: 'display: ${1:flex};', detail: 'display' },
  { label: 'pos', insertText: 'position: ${1:relative};', detail: 'position' },
  { label: 'm', insertText: 'margin: ${1:0};', detail: 'margin' },
  { label: 'p', insertText: 'padding: ${1:0};', detail: 'padding' },
  { label: 'w', insertText: 'width: ${1:100%};', detail: 'width' },
  { label: 'h', insertText: 'height: ${1:100%};', detail: 'height' },
  { label: 'bg', insertText: 'background: ${1:color};', detail: 'background' },
  { label: 'bgc', insertText: 'background-color: ${1:color};', detail: 'background-color' },
  { label: 'c', insertText: 'color: ${1:color};', detail: 'color' },
  { label: 'fs', insertText: 'font-size: ${1:14px};', detail: 'font-size' },
  { label: 'fw', insertText: 'font-weight: ${1:400};', detail: 'font-weight' },
  { label: 'ff', insertText: 'font-family: ${1:sans-serif};', detail: 'font-family' },
  { label: 'br', insertText: 'border-radius: ${1:4px};', detail: 'border-radius' },
  { label: 'bs', insertText: 'box-shadow: ${1:0 2px 4px rgba(0,0,0,0.1)};', detail: 'box-shadow' },
  { label: 'td', insertText: 'transition: ${1:all 0.3s ease};', detail: 'transition' },
  { label: 'flex', insertText: 'display: flex;\n\talign-items: ${1:center};\n\tjustify-content: ${2:center};', detail: 'Flexbox center' },
  { label: 'grid', insertText: 'display: grid;\n\tgrid-template-columns: ${1:repeat(3, 1fr)};\n\tgap: ${2:16px};', detail: 'CSS Grid' },
  { label: 'abs', insertText: 'position: absolute;\n\ttop: ${1:0};\n\tleft: ${2:0};', detail: 'Absolute position' },
  { label: 'fixed', insertText: 'position: fixed;\n\ttop: ${1:0};\n\tleft: ${2:0};\n\twidth: ${3:100%};', detail: 'Fixed position' },
  { label: 'miw', insertText: 'min-width: ${1:0};', detail: 'min-width' },
  { label: 'maw', insertText: 'max-width: ${1:100%};', detail: 'max-width' },
]

const PYTHON_SNIPPETS = [
  { label: 'fn', insertText: 'def ${1:name}(${2:params}):\n\t$0', detail: 'Function definition' },
  { label: 'afn', insertText: 'lambda ${1:params}: ${2:expression}', detail: 'Lambda function' },
  { label: 'cls', insertText: 'class ${1:name}:\n\tdef __init__(self${2:, params}):\n\t\t$0', detail: 'Class definition' },
  { label: 'if', insertText: 'if ${1:condition}:\n\t$0', detail: 'If statement' },
  { label: 'ife', insertText: 'if ${1:condition}:\n\t$0\nelse:\n\t', detail: 'If-else statement' },
  { label: 'for', insertText: 'for ${1:item} in ${2:iterable}:\n\t$0', detail: 'For loop' },
  { label: 'wh', insertText: 'while ${1:condition}:\n\t$0', detail: 'While loop' },
  { label: 'try', insertText: 'try:\n\t$0\nexcept ${1:Exception} as ${2:e}:\n\t', detail: 'Try-except' },
  { label: 'imp', insertText: 'from ${1:module} import ${2:name}', detail: 'Import statement' },
  { label: 'pr', insertText: 'print($0)', detail: 'Print statement' },
  { label: 'main', insertText: 'if __name__ == \'__main__\':\n\t$0', detail: 'Main guard' },
  { label: 'with', insertText: 'with ${1:expression} as ${2:variable}:\n\t$0', detail: 'With statement' },
  { label: 'comp', insertText: '[${1:expr} for ${2:item} in ${3:iterable}]', detail: 'List comprehension' },
]

const ALL_SNIPPETS = {
  javascript: JS_SNIPPETS,
  typescript: TS_SNIPPETS,
  javascriptreact: JS_SNIPPETS,
  typescriptreact: TS_SNIPPETS,
  html: HTML_SNIPPETS,
  css: CSS_SNIPPETS,
  scss: CSS_SNIPPETS,
  less: CSS_SNIPPETS,
  python: PYTHON_SNIPPETS,
}

export function registerSnippets(monaco) {
  const supportedLangs = monaco.languages.getLanguages().map(l => l.id)

  Object.entries(ALL_SNIPPETS).forEach(([lang, snippets]) => {
    if (!supportedLangs.includes(lang)) return
    monaco.languages.registerCompletionItemProvider(lang, {
      provideCompletionItems: (model, position) => {
        const word = model.getWordUntilPosition(position)
        const range = {
          startLineNumber: position.lineNumber,
          startColumn: word.startColumn,
          endLineNumber: position.lineNumber,
          endColumn: word.endColumn,
        }
        return {
          suggestions: snippets.map(s => ({
            label: s.label,
            kind: monaco.languages.CompletionItemKind.Snippet,
            insertText: s.insertText,
            insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
            detail: s.detail,
            documentation: s.detail,
            range,
          })),
        }
      },
    })
  })
}
