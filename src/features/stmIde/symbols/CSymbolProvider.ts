/**
 * C 语言符号提供者
 * 基于 BaseSymbolProvider 的高质量实现
 */

import { BaseSymbolProvider, LanguageConfigFactory } from './BaseSymbolProvider'
import { SymbolFactory, SymbolTemplates } from './SymbolFactory'
import { SignatureInfo } from './types'

export class CSymbolProvider extends BaseSymbolProvider {
  constructor() {
    super(LanguageConfigFactory.createCConfig())
  }

  protected initializeSymbols(): void {
    this.initializeStandardLibrary()
    this.initializeKeywords()
    this.initializeSnippets()
    this.initializeSignatures()
  }

  /**
   * 初始化标准库符号
   */
  private initializeStandardLibrary(): void {
    // stdio.h 函数
    const stdioFunctions = [
      { name: 'printf', returnType: 'int', parameters: 'const char *format, ...', documentation: 'Print formatted output to stdout', library: 'stdio.h' },
      { name: 'scanf', returnType: 'int', parameters: 'const char *format, ...', documentation: 'Read formatted input from stdin', library: 'stdio.h' },
      { name: 'sprintf', returnType: 'int', parameters: 'char *str, const char *format, ...', documentation: 'Write formatted data to string', library: 'stdio.h' },
      { name: 'snprintf', returnType: 'int', parameters: 'char *str, size_t size, const char *format, ...', documentation: 'Write formatted data to string with size limit', library: 'stdio.h' },
      { name: 'puts', returnType: 'int', parameters: 'const char *str', documentation: 'Write string to stdout with newline', library: 'stdio.h' },
      { name: 'putchar', returnType: 'int', parameters: 'int ch', documentation: 'Write character to stdout', library: 'stdio.h' },
      { name: 'getchar', returnType: 'int', parameters: 'void', documentation: 'Read character from stdin', library: 'stdio.h' },
      { name: 'fopen', returnType: 'FILE*', parameters: 'const char *filename, const char *mode', documentation: 'Open file', library: 'stdio.h' },
      { name: 'fclose', returnType: 'int', parameters: 'FILE *file', documentation: 'Close file', library: 'stdio.h' },
      { name: 'fread', returnType: 'size_t', parameters: 'void *buffer, size_t size, size_t count, FILE *file', documentation: 'Read from file', library: 'stdio.h' },
      { name: 'fwrite', returnType: 'size_t', parameters: 'const void *buffer, size_t size, size_t count, FILE *file', documentation: 'Write to file', library: 'stdio.h' }
    ]

    // string.h 函数
    const stringFunctions = [
      { name: 'strlen', returnType: 'size_t', parameters: 'const char *str', documentation: 'Get string length', library: 'string.h' },
      { name: 'strcpy', returnType: 'char*', parameters: 'char *dest, const char *src', documentation: 'Copy string', library: 'string.h' },
      { name: 'strncpy', returnType: 'char*', parameters: 'char *dest, const char *src, size_t n', documentation: 'Copy string with length limit', library: 'string.h' },
      { name: 'strcmp', returnType: 'int', parameters: 'const char *str1, const char *str2', documentation: 'Compare strings', library: 'string.h' },
      { name: 'strcat', returnType: 'char*', parameters: 'char *dest, const char *src', documentation: 'Concatenate strings', library: 'string.h' },
      { name: 'strchr', returnType: 'char*', parameters: 'const char *str, int ch', documentation: 'Find character in string', library: 'string.h' },
      { name: 'strstr', returnType: 'char*', parameters: 'const char *haystack, const char *needle', documentation: 'Find substring', library: 'string.h' },
      { name: 'memset', returnType: 'void*', parameters: 'void *ptr, int value, size_t size', documentation: 'Set memory to value', library: 'string.h' },
      { name: 'memcpy', returnType: 'void*', parameters: 'void *dest, const void *src, size_t size', documentation: 'Copy memory', library: 'string.h' },
      { name: 'memmove', returnType: 'void*', parameters: 'void *dest, const void *src, size_t size', documentation: 'Move memory (overlapping safe)', library: 'string.h' },
      { name: 'memcmp', returnType: 'int', parameters: 'const void *ptr1, const void *ptr2, size_t size', documentation: 'Compare memory', library: 'string.h' }
    ]

    // stdlib.h 函数
    const stdlibFunctions = [
      { name: 'malloc', returnType: 'void*', parameters: 'size_t size', documentation: 'Allocate memory', library: 'stdlib.h' },
      { name: 'calloc', returnType: 'void*', parameters: 'size_t count, size_t size', documentation: 'Allocate and zero memory', library: 'stdlib.h' },
      { name: 'realloc', returnType: 'void*', parameters: 'void *ptr, size_t size', documentation: 'Reallocate memory', library: 'stdlib.h' },
      { name: 'free', returnType: 'void', parameters: 'void *ptr', documentation: 'Free allocated memory', library: 'stdlib.h' },
      { name: 'atoi', returnType: 'int', parameters: 'const char *str', documentation: 'Convert string to integer', library: 'stdlib.h' },
      { name: 'atof', returnType: 'double', parameters: 'const char *str', documentation: 'Convert string to float', library: 'stdlib.h' },
      { name: 'exit', returnType: 'void', parameters: 'int status', documentation: 'Exit program', library: 'stdlib.h' },
      { name: 'rand', returnType: 'int', parameters: 'void', documentation: 'Generate random number', library: 'stdlib.h' },
      { name: 'srand', returnType: 'void', parameters: 'unsigned int seed', documentation: 'Seed random number generator', library: 'stdlib.h' }
    ]

    // math.h 函数
    const mathFunctions = [
      { name: 'abs', returnType: 'int', parameters: 'int x', documentation: 'Absolute value (integer)', library: 'math.h' },
      { name: 'fabs', returnType: 'double', parameters: 'double x', documentation: 'Absolute value (float)', library: 'math.h' },
      { name: 'sqrt', returnType: 'double', parameters: 'double x', documentation: 'Square root', library: 'math.h' },
      { name: 'pow', returnType: 'double', parameters: 'double base, double exp', documentation: 'Power function', library: 'math.h' },
      { name: 'sin', returnType: 'double', parameters: 'double x', documentation: 'Sine function', library: 'math.h' },
      { name: 'cos', returnType: 'double', parameters: 'double x', documentation: 'Cosine function', library: 'math.h' },
      { name: 'tan', returnType: 'double', parameters: 'double x', documentation: 'Tangent function', library: 'math.h' },
      { name: 'log', returnType: 'double', parameters: 'double x', documentation: 'Natural logarithm', library: 'math.h' },
      { name: 'exp', returnType: 'double', parameters: 'double x', documentation: 'Exponential function', library: 'math.h' },
      { name: 'ceil', returnType: 'double', parameters: 'double x', documentation: 'Ceiling function', library: 'math.h' },
      { name: 'floor', returnType: 'double', parameters: 'double x', documentation: 'Floor function', library: 'math.h' }
    ]

    // 添加符号分类
    this.addSymbolCategory('stdio', this.createStandardLibrarySymbols(stdioFunctions))
    this.addSymbolCategory('string', this.createStandardLibrarySymbols(stringFunctions))
    this.addSymbolCategory('stdlib', this.createStandardLibrarySymbols(stdlibFunctions))
    this.addSymbolCategory('math', this.createStandardLibrarySymbols(mathFunctions))
  }

  /**
   * 初始化关键字
   */
  private initializeKeywords(): void {
    // 数据类型关键字
    const typeKeywords = SymbolTemplates.C_TYPES.map(type => ({
      name: type.name,
      documentation: type.documentation
    }))

    // 控制流关键字
    const controlKeywords = SymbolTemplates.C_KEYWORDS

    // 常量
    const constants = [
      { name: 'NULL', documentation: 'Null pointer constant' },
      { name: 'TRUE', documentation: 'Boolean true (1)' },
      { name: 'FALSE', documentation: 'Boolean false (0)' }
    ]

    this.addSymbolCategory('types', this.createKeywordSymbols(typeKeywords))
    this.addSymbolCategory('keywords', this.createKeywordSymbols(controlKeywords))
    this.addSymbolCategory('constants', this.createConstantSymbols(constants, '🔢 C Constant'))
  }

  /**
   * 🔧 根源修复：初始化增强的代码片段
   */
  private initializeSnippets(): void {
    // 使用增强的代码片段
    const snippets = SymbolTemplates.COMMON_SNIPPETS
    const snippetSymbols = this.createSnippetSymbols(snippets)
    this.addSymbolCategory('snippets', snippetSymbols)

    // 🔧 确保代码片段被正确注册，验证优先级
    console.log('✅ 已注册代码片段:', snippets.map((s: any) => s.name))
    console.log('🔧 代码片段优先级验证:', snippetSymbols.slice(0, 5).map(s => ({
      label: s.label,
      sortText: s.sortText,
      kind: s.kind
    })))
  }

  /**
   * 初始化函数签名
   */
  private initializeSignatures(): void {
    const signatures = new Map<string, SignatureInfo[]>()

    // printf 签名
    signatures.set('printf', [
      SymbolFactory.createSignature({
        label: 'printf(const char *format, ...)',
        documentation: 'Print formatted output to stdout\n\nFormat specifiers:\n%d - integer\n%s - string\n%f - float\n%c - character\n%x - hexadecimal\n%p - pointer',
        parameters: [
          { name: 'format', documentation: 'Format string with conversion specifiers (%d, %s, %f, etc.)' },
          { name: '...', documentation: 'Variable arguments matching format specifiers' }
        ]
      })
    ])

    // sprintf 签名
    signatures.set('sprintf', [
      SymbolFactory.createSignature({
        label: 'sprintf(char *str, const char *format, ...)',
        documentation: 'Write formatted data to string',
        parameters: [
          { name: 'str', documentation: 'Destination buffer to store the formatted string' },
          { name: 'format', documentation: 'Format string with conversion specifiers' },
          { name: '...', documentation: 'Variable arguments matching format specifiers' }
        ]
      })
    ])

    // memcpy 签名
    signatures.set('memcpy', [
      SymbolFactory.createSignature({
        label: 'memcpy(void *dest, const void *src, size_t n)',
        documentation: 'Copy n bytes from memory area src to memory area dest\n\nNote: Areas must not overlap, use memmove() for overlapping areas',
        parameters: [
          { name: 'dest', documentation: 'Destination memory area' },
          { name: 'src', documentation: 'Source memory area' },
          { name: 'n', documentation: 'Number of bytes to copy' }
        ]
      })
    ])

    // malloc 签名
    signatures.set('malloc', [
      SymbolFactory.createSignature({
        label: 'malloc(size_t size)',
        documentation: 'Allocate memory block\n\nReturns: Pointer to allocated memory or NULL if allocation fails',
        parameters: [
          { name: 'size', documentation: 'Size of memory block in bytes' }
        ]
      })
    ])

    // fopen 签名
    signatures.set('fopen', [
      SymbolFactory.createSignature({
        label: 'fopen(const char *filename, const char *mode)',
        documentation: 'Open file and return file pointer\n\nModes:\n"r" - read\n"w" - write\n"a" - append\n"rb" - read binary\n"wb" - write binary',
        parameters: [
          { name: 'filename', documentation: 'Path to the file to be opened' },
          { name: 'mode', documentation: 'File access mode ("r", "w", "a", "rb", "wb", etc.)' }
        ]
      })
    ])

    this.addSignatures(signatures)
  }
}
