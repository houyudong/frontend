/**
 * 符号系统类型定义
 * 统一管理所有符号相关的接口和类型
 */

export interface CompletionItem {
  label: string
  kind: number // Monaco Editor CompletionItemKind
  insertText: string
  insertTextRules?: number
  documentation?: string
  detail?: string
  sortText?: string
  range?: any
  command?: any
  commitCharacters?: string[]
  additionalTextEdits?: any[]
  filterText?: string
}

export interface ParameterInfo {
  label: string
  documentation?: string
}

export interface SignatureInfo {
  label: string
  documentation?: string
  parameters: ParameterInfo[]
  activeParameter?: number
}

export interface SymbolSearchRequest {
  query: string
  language: LanguageType
  context: string
  maxResults?: number
  position?: { line: number; column: number }
}

export interface SymbolSearchResponse {
  symbols: CompletionItem[]
  isIncomplete?: boolean
}

export type LanguageType = 'c' | 'cpp' | 'python' | 'javascript' | 'typescript'

export interface LanguageConfig {
  id: string
  extensions: string[]
  aliases: string[]
  mimetypes: string[]
  triggerCharacters: string[]
  completionTriggerCharacters: string[]
  signatureHelpTriggerCharacters: string[]
}

export interface SymbolCategory {
  name: string
  symbols: CompletionItem[]
  signatures?: Map<string, SignatureInfo[]>
}

export interface LanguageSymbolProvider {
  getSymbolCategories(): SymbolCategory[]
  getSignatures(): Map<string, SignatureInfo[]>
  getLanguageConfig(): LanguageConfig
}

// Monaco Editor 相关类型
export interface MonacoCompletionItem {
  label: string
  kind: number
  insertText: string
  insertTextRules?: number
  documentation?: string | { value: string }
  detail?: string
  sortText?: string
  range?: any
  command?: any
  commitCharacters?: string[]
  additionalTextEdits?: any[]
  filterText?: string
}

export interface MonacoSignatureHelp {
  signatures: MonacoSignatureInformation[]
  activeSignature?: number
  activeParameter?: number
}

export interface MonacoSignatureInformation {
  label: string
  documentation?: string | { value: string }
  parameters: MonacoParameterInformation[]
}

export interface MonacoParameterInformation {
  label: string
  documentation?: string | { value: string }
}

// 符号种类枚举 (Monaco Editor CompletionItemKind)
export enum SymbolKind {
  Text = 0,
  Method = 1,
  Function = 2,
  Constructor = 3,
  Field = 4,
  Variable = 5,
  Class = 6,
  Interface = 7,
  Module = 8,
  Property = 9,
  Unit = 10,
  Value = 11,
  Enum = 12,
  Keyword = 13,
  Snippet = 14,
  Color = 15,
  File = 16,
  Reference = 17,
  Folder = 18,
  EnumMember = 19,
  Constant = 20,
  Struct = 21,
  Event = 22,
  Operator = 23,
  TypeParameter = 24
}

// 插入文本规则枚举 (Monaco Editor CompletionItemInsertTextRule)
export enum InsertTextRule {
  None = 0,
  KeepWhitespace = 1,
  InsertAsSnippet = 4
}
