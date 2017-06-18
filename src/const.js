"use strict";

/** # Label generation # */
let ii = 0;

let Nodes = {};
let Token = {};
let TokenList = {};
let Operators = {};

/** Types */
((Label) => {
  Label[Label["Program"] = ++ii] = "Program";
  Label[Label["BinaryExpression"] = ++ii] = "BinaryExpression";
  Label[Label["UnaryExpression"] = ++ii] = "UnaryExpression";
  Label[Label["UnaryPrefixExpression"] = ++ii] = "UnaryPrefixExpression";
  Label[Label["UnaryPostfixExpression"] = ++ii] = "UnaryPostfixExpression";
  Label[Label["CallExpression"] = ++ii] = "CallExpression";
  Label[Label["CastExpression"] = ++ii] = "CastExpression";
  Label[Label["ParameterExpression"] = ++ii] = "ParameterExpression";
  Label[Label["BlockStatement"] = ++ii] = "BlockStatement";
  Label[Label["ReturnStatement"] = ++ii] = "ReturnStatement";
  Label[Label["IfStatement"] = ++ii] = "IfStatement";
  Label[Label["ForStatement"] = ++ii] = "ForStatement";
  Label[Label["WhileStatement"] = ++ii] = "WhileStatement";
  Label[Label["ExpressionStatement"] = ++ii] = "ExpressionStatement";
  Label[Label["ImportStatement"] = ++ii] = "ImportStatement";
  Label[Label["ExportStatement"] = ++ii] = "ExportStatement";
  Label[Label["BreakStatement"] = ++ii] = "BreakStatement";
  Label[Label["ContinueStatement"] = ++ii] = "ContinueStatement";
  Label[Label["FunctionExpression"] = ++ii] = "FunctionExpression";
  Label[Label["FunctionDeclaration"] = ++ii] = "FunctionDeclaration";
  Label[Label["VariableDeclaration"] = ++ii] = "VariableDeclaration";
  Label[Label["EnumDeclaration"] = ++ii] = "EnumDeclaration";
  Label[Label["Parameter"] = ++ii] = "Parameter";
  Label[Label["Enumerator"] = ++ii] = "Enumerator";
  Label[Label["Identifier"] = ++ii] = "Identifier";
  Label[Label["Literal"] = ++ii] = "Literal";
  Label[Label["Comment"] = ++ii] = "Comment";
  // test mode
  Label[Label["RuntimeErrorTrap"] = ++ii] = "RuntimeErrorTrap";
})(Nodes);

/** Data types */
((Label) => {
  Label[Label["EOF"] = ++ii] = "EOF";
  Label[Label["Unknown"] = ++ii] = "Unknown";
  Label[Label["Keyword"] = ++ii] = "Keyword";
  Label[Label["Identifier"] = ++ii] = "Identifier";
  Label[Label["BooleanLiteral"] = ++ii] = "BooleanLiteral";
  Label[Label["NullLiteral"] = ++ii] = "NullLiteral";
  Label[Label["StringLiteral"] = ++ii] = "StringLiteral";
  Label[Label["NumericLiteral"] = ++ii] = "NumericLiteral";
  Label[Label["HexadecimalLiteral"] = ++ii] = "HexadecimalLiteral";
})(Token);

/** Tokens */
((Label) => {
  /** Punctuators */
  Label[Label["("] = ++ii] = "LPAREN";
  Label[Label[")"] = ++ii] = "RPAREN";
  Label[Label["{"] = ++ii] = "LBRACE";
  Label[Label["}"] = ++ii] = "RBRACE";
  Label[Label[","] = ++ii] = "COMMA";
  Label[Label[";"] = ++ii] = "SEMICOLON";
  /** Literals */
  Label[Label["true"] = ++ii] = "TRUE";
  Label[Label["false"] = ++ii] = "FALSE";
  /** Declaration keywords */
  Label[Label["enum"] = ++ii] = "ENUM";
  Label[Label["import"] = ++ii] = "IMPORT";
  Label[Label["extern"] = ++ii] = "EXPORT";
  /** Statement keywords */
  Label[Label["break"] = ++ii] = "BREAK";
  Label[Label["continue"] = ++ii] = "CONTINUE";
  Label[Label["do"] = ++ii] = "DO";
  Label[Label["else"] = ++ii] = "ELSE";
  Label[Label["for"] = ++ii] = "FOR";
  Label[Label["if"] = ++ii] = "IF";
  Label[Label["return"] = ++ii] = "RETURN";
  Label[Label["while"] = ++ii] = "WHILE";
  /** Types */
  Label[Label["int"] = ++ii] = "INT";
  Label[Label["i32"] = ++ii] = "INT32";
  Label[Label["i64"] = ++ii] = "INT64";
  Label[Label["float"] = ++ii] = "FLOAT";
  Label[Label["f32"] = ++ii] = "FLOAT32";
  Label[Label["f64"] = ++ii] = "FLOAT64";
  Label[Label["void"] = ++ii] = "VOID";
  Label[Label["bool"] = ++ii] = "BOOLEAN";
})(TokenList);

/** Operators */
((Label) => {
  Label.LOWEST = ++ii;
  Label.UNARY_POSTFIX = ++ii;
  // order by precedence
  Label[Label["="] = ++ii] = "ASS";
  Label[Label["+="] = ++ii] = "ADD_ASS";
  Label[Label["-="] = ++ii] = "SUB_ASS";
  Label[Label["*="] = ++ii] = "MUL_ASS";
  Label[Label["/="] = ++ii] = "DIV_ASS";
  Label[Label["%="] = ++ii] = "MOD_ASS";

  Label[Label["&="] = ++ii] = "BIN_AND_ASS";
  Label[Label["|="] = ++ii] = "BIN_OR_ASS";
  Label[Label["^="] = ++ii] = "BIN_XOR_ASS";
  Label[Label["<<="] = ++ii] = "BIN_SHL_ASS";
  Label[Label[">>="] = ++ii] = "BIN_SHR_ASS";

  Label[Label["||"] = ++ii] = "OR";
  Label[Label["&&"] = ++ii] = "AND";
  Label[Label["=="] = ++ii] = "EQ";
  Label[Label["!="] = ++ii] = "NEQ";
  Label[Label["<"] = ++ii] = "LT";
  Label[Label["<="] = ++ii] = "LE";
  Label[Label[">"] = ++ii] = "GT";
  Label[Label[">="] = ++ii] = "GE";
  Label[Label["+"] = ++ii] = "ADD";
  Label[Label["-"] = ++ii] = "SUB";
  Label[Label["*"] = ++ii] = "MUL";
  Label[Label["/"] = ++ii] = "DIV";
  Label[Label["%"] = ++ii] = "MOD";

  Label[Label["&"] = ++ii] = "BIN_AND";
  Label[Label["|"] = ++ii] = "BIN_OR";
  Label[Label["~"] = ++ii] = "BIN_NOT";
  Label[Label["^"] = ++ii] = "BIN_XOR";
  Label[Label["<<"] = ++ii] = "BIN_SHL";
  Label[Label[">>"] = ++ii] = "BIN_SHR";

  Label[Label["!"] = ++ii] = "NOT";
  Label[Label["--"] = ++ii] = "DECR";
  Label[Label["++"] = ++ii] = "INCR";
  Label.UNARY_PREFIX = ++ii;
  Label.HIGHEST = ++ii;
})(Operators);

function getLabelName(index) {
  index = index | 0;
  if (Nodes[index] !== void 0) return (Nodes[index]);
  if (Token[index] !== void 0) return (Token[index]);
  if (TokenList[index] !== void 0) return (TokenList[index]);
  if (Operators[index] !== void 0) return (Operators[index]);
  return ("undefined");
};

/** 
 * Auto generate
 * str access key
 * for token list
 */
(() => {
  const items = [
    Nodes, Token, TokenList, Operators
  ];
  items.map((item) => {
    for (let key in item) {
      const code = parseInt(key);
      if (!(code >= 0)) continue;
      const nkey = item[key].toUpperCase();
      item[nkey] = code;
    };
  });
})();

// # Wasm codes

// control flow operators
const WASM_OPCODE_UNREACHABLE = 0x00;
const WASM_OPCODE_NOP = 0x01;
const WASM_OPCODE_BLOCK = 0x02;
const WASM_OPCODE_LOOP = 0x03;
const WASM_OPCODE_IF = 0x04;
const WASM_OPCODE_ELSE = 0x05;
const WASM_OPCODE_END = 0x0b;
const WASM_OPCODE_BR = 0x0c;
const WASM_OPCODE_BR_IF = 0x0d;
const WASM_OPCODE_BR_TABLE = 0x0e;
const WASM_OPCODE_RETURN = 0x0f;

// call operators
const WASM_OPCODE_CALL = 0x10;
const WASM_OPCODE_CALL_INDIRECT = 0x11;

// parametric operators
const WASM_OPCODE_DROP = 0x1a;
const WASM_OPCODE_SELECT = 0x1b;

// variable access
const WASM_OPCODE_GET_LOCAL = 0x20;
const WASM_OPCODE_SET_LOCAL = 0x21;
const WASM_OPCODE_TEE_LOCAL = 0x22;
const WASM_OPCODE_GET_GLOBAL = 0x23;
const WASM_OPCODE_SET_GLOBAL = 0x24;

// memory operators
const WASM_OPCODE_I32_LOAD = 0x28;
const WASM_OPCODE_I64_LOAD = 0x29;
const WASM_OPCODE_F32_LOAD = 0x2a;
const WASM_OPCODE_F64_LOAD = 0x2b;

const WASM_OPCODE_I32_LOAD8_S = 0x2c;
const WASM_OPCODE_I32_LOAD8_U = 0x2d;
const WASM_OPCODE_I32_LOAD16_S = 0x2e;
const WASM_OPCODE_I32_LOAD16_U = 0x2f;

const WASM_OPCODE_I64_LOAD8_S = 0x30;
const WASM_OPCODE_I64_LOAD8_U = 0x31;
const WASM_OPCODE_I64_LOAD16_S = 0x32;
const WASM_OPCODE_I64_LOAD16_U = 0x33;
const WASM_OPCODE_I64_LOAD32_S = 0x34;
const WASM_OPCODE_I64_LOAD32_U = 0x35;

const WASM_OPCODE_I32_STORE = 0x36;
const WASM_OPCODE_I64_STORE = 0x37;
const WASM_OPCODE_F32_STORE = 0x38;
const WASM_OPCODE_F64_STORE = 0x39;

const WASM_OPCODE_I32_STORE8 = 0x3a;
const WASM_OPCODE_I32_STORE16 = 0x3b;
const WASM_OPCODE_I64_STORE8 = 0x3c;
const WASM_OPCODE_I64_STORE16 = 0x3d;
const WASM_OPCODE_I64_STORE32 = 0x3e;

const WASM_OPCODE_CURRENT_MEMORY = 0x3f;
const WASM_OPCODE_GROW_MEMORY = 0x40;

// constants
const WASM_OPCODE_I32_CONST = 0x41;
const WASM_OPCODE_I64_CONST = 0x42;
const WASM_OPCODE_F32_CONST = 0x43;
const WASM_OPCODE_F64_CONST = 0x44;

// comparison operators
const WASM_OPCODE_I32_EQZ = 0x45;
const WASM_OPCODE_I32_EQ = 0x46;
const WASM_OPCODE_I32_NEQ = 0x47;
const WASM_OPCODE_I32_LT_S = 0x48;
const WASM_OPCODE_I32_LT_U = 0x49;
const WASM_OPCODE_I32_GT_S = 0x4a;
const WASM_OPCODE_I32_GT_U = 0x4b;
const WASM_OPCODE_I32_LE_S = 0x4c;
const WASM_OPCODE_I32_LE_U = 0x4d;
const WASM_OPCODE_I32_GE_S = 0x4e;
const WASM_OPCODE_I32_GE_U = 0x4f;

const WASM_OPCODE_I64_EQZ = 0x50;
const WASM_OPCODE_I64_EQ = 0x51;
const WASM_OPCODE_I64_NE = 0x52;
const WASM_OPCODE_I64_LT_S = 0x53;
const WASM_OPCODE_I64_LT_U = 0x54;
const WASM_OPCODE_I64_GT_S = 0x55;
const WASM_OPCODE_I64_GT_U = 0x56;
const WASM_OPCODE_I64_LE_S = 0x57;
const WASM_OPCODE_I64_LE_U = 0x58;
const WASM_OPCODE_I64_GE_S = 0x59;
const WASM_OPCODE_I64_GE_U = 0x5a;

const WASM_OPCODE_F32_EQ = 0x5b;
const WASM_OPCODE_F32_NE = 0x5c;
const WASM_OPCODE_F32_LT = 0x5d;
const WASM_OPCODE_F32_GT = 0x5e;
const WASM_OPCODE_F32_LE = 0x5f;
const WASM_OPCODE_F32_GE = 0x60;

const WASM_OPCODE_F64_EQ = 0x61;
const WASM_OPCODE_F64_NE = 0x62;
const WASM_OPCODE_F64_LT = 0x63;
const WASM_OPCODE_F64_GT = 0x64;
const WASM_OPCODE_F64_LE = 0x65;
const WASM_OPCODE_F64_GE = 0x66;

// numeric operators
const WASM_OPCODE_I32_CLZ = 0x67;
const WASM_OPCODE_I32_CTZ = 0x68;
const WASM_OPCODE_I32_POPCNT = 0x69;
const WASM_OPCODE_I32_ADD = 0x6a;
const WASM_OPCODE_I32_SUB = 0x6b;
const WASM_OPCODE_I32_MUL = 0x6c;
const WASM_OPCODE_I32_DIV_S = 0x6d;
const WASM_OPCODE_I32_DIV_U = 0x6e;
const WASM_OPCODE_I32_REM_S = 0x6f;
const WASM_OPCODE_I32_REM_U = 0x70;
const WASM_OPCODE_I32_AND = 0x71;
const WASM_OPCODE_I32_OR = 0x72;
const WASM_OPCODE_I32_XOR = 0x73;
const WASM_OPCODE_I32_SHL = 0x74;
const WASM_OPCODE_I32_SHR_S = 0x75;
const WASM_OPCODE_I32_SHR_U = 0x76;
const WASM_OPCODE_I32_ROTL = 0x77;
const WASM_OPCODE_I32_ROTR = 0x78;

const WASM_OPCODE_I64_CLZ = 0x79;
const WASM_OPCODE_I64_CTZ = 0x7a;
const WASM_OPCODE_I64_POPCNT = 0x7b;
const WASM_OPCODE_I64_ADD = 0x7c;
const WASM_OPCODE_I64_SUB = 0x7d;
const WASM_OPCODE_I64_MUL = 0x7e;
const WASM_OPCODE_I64_DIV_S = 0x7f;
const WASM_OPCODE_I64_DIV_U = 0x80;
const WASM_OPCODE_I64_REM_S = 0x81;
const WASM_OPCODE_I64_REM_U = 0x82;
const WASM_OPCODE_I64_AND = 0x83;
const WASM_OPCODE_I64_OR = 0x84;
const WASM_OPCODE_I64_XOR = 0x85;
const WASM_OPCODE_I64_SHL = 0x86;
const WASM_OPCODE_I64_SHR_S = 0x87;
const WASM_OPCODE_I64_SHR_U = 0x88;
const WASM_OPCODE_I64_ROTL = 0x89;
const WASM_OPCODE_I64_ROTR = 0x8a;

const WASM_OPCODE_F32_ABS = 0x8b;
const WASM_OPCODE_F32_NEG = 0x8c;
const WASM_OPCODE_F32_CEIL = 0x8d;
const WASM_OPCODE_F32_FLOOR = 0x8e;
const WASM_OPCODE_F32_TRUNC = 0x8f;
const WASM_OPCODE_F32_NEAREST = 0x90;
const WASM_OPCODE_F32_SQRT = 0x91;
const WASM_OPCODE_F32_ADD = 0x92;
const WASM_OPCODE_F32_SUB = 0x93;
const WASM_OPCODE_F32_MUL = 0x94;
const WASM_OPCODE_F32_DIV = 0x95;
const WASM_OPCODE_F32_MIN = 0x96;
const WASM_OPCODE_F32_MAX = 0x97;
const WASM_OPCODE_F32_COPYSIGN = 0x98;

const WASM_OPCODE_F64_ABS = 0x99;
const WASM_OPCODE_F64_NEG = 0x9a;
const WASM_OPCODE_F64_CEIL = 0x9b;
const WASM_OPCODE_F64_FLOOR = 0x9c;
const WASM_OPCODE_F64_TRUNC = 0x9d;
const WASM_OPCODE_F64_NEAREST = 0x9e;
const WASM_OPCODE_F64_SQRT = 0x9f;
const WASM_OPCODE_F64_ADD = 0xa0;
const WASM_OPCODE_F64_SUB = 0xa1;
const WASM_OPCODE_F64_MUL = 0xa2;
const WASM_OPCODE_F64_DIV = 0xa3;
const WASM_OPCODE_F64_MIN = 0xa4;
const WASM_OPCODE_F64_MAX = 0xa5;
const WASM_OPCODE_F64_COPYSIGN = 0xa6;

// conversions
const WASM_OPCODE_I32_WRAP_I64 = 0xa7;
const WASM_OPCODE_I32_TRUNC_S_F32 = 0xa8;
const WASM_OPCODE_I32_TRUNC_U_F32 = 0xa9;
const WASM_OPCODE_I32_TRUNC_S_F64 = 0xaa;
const WASM_OPCODE_I32_TRUNC_U_F64 = 0xab;

const WASM_OPCODE_I64_EXTEND_S_I32 = 0xac;
const WASM_OPCODE_I64_EXTEND_U_I32 = 0xad;
const WASM_OPCODE_I64_TRUNC_S_F32 = 0xae;
const WASM_OPCODE_I64_TRUNC_U_F32 = 0xaf;
const WASM_OPCODE_I64_TRUNC_S_F64 = 0xb0;
const WASM_OPCODE_I64_TRUNC_U_F64 = 0xb1;

const WASM_OPCODE_F32_CONVERT_S_I32 = 0xb2;
const WASM_OPCODE_F32_CONVERT_U_I32 = 0xb3;
const WASM_OPCODE_F32_CONVERT_S_I64 = 0xb4;
const WASM_OPCODE_F32_CONVERT_U_I64 = 0xb5;
const WASM_OPCODE_F32_DEMOTE_F64 = 0xb6;

const WASM_OPCODE_F64_CONVERT_S_I32 = 0xb7;
const WASM_OPCODE_F64_CONVERT_U_I32 = 0xb8;
const WASM_OPCODE_F64_CONVERT_S_I64 = 0xb9;
const WASM_OPCODE_F64_CONVERT_U_I64 = 0xba;
const WASM_OPCODE_F64_PROMOTE_F32 = 0xbb;

// reinterpretations
const WASM_OPCODE_I32_REINTERPRET_F32 = 0xbc;
const WASM_OPCODE_I64_REINTERPRET_F64 = 0xbd;
const WASM_OPCODE_F32_REINTERPRET_I32 = 0xbe;
const WASM_OPCODE_F64_REINTERPRET_I64 = 0xbf;

const WASM_MAGIC = 0x6d736100;
const WASM_VERSION = 0x1;
const WASM_INITIAL_MEMORY = 256;
const WASM_MAXIMUM_MEMORY = 256;

const WASM_SECTION_TYPE = 0x1;
const WASM_SECTION_FUNCTION = 0x3;
const WASM_SECTION_TABLE = 0x4;
const WASM_SECTION_MEMORY = 0x5;
const WASM_SECTION_GLOBAL = 0x6;
const WASM_SECTION_EXPORT = 0x7;
const WASM_SECTION_ELEMENT = 0x9;
const WASM_SECTION_CODE = 0xa;

const WASM_TYPE_VOID = 0x0;
const WASM_TYPE_I32 = 0x7f;
const WASM_TYPE_I64 = 0x7e;
const WASM_TYPE_F32 = 0x7d;
const WASM_TYPE_F64 = 0x7c;

const WASM_TYPE_CTOR_VOID = 0x0;
const WASM_TYPE_CTOR_I32 = 0x7f;
const WASM_TYPE_CTOR_I64 = 0x7e;
const WASM_TYPE_CTOR_F32 = 0x7d;
const WASM_TYPE_CTOR_F64 = 0x7c;
const WASM_TYPE_CTOR_FUNC = 0x60;
const WASM_TYPE_CTOR_ANYFUNC = 0x70;
const WASM_TYPE_CTOR_BLOCK = 0x40;

const WASM_EXTERN_FUNCTION = 0x0;
const WASM_EXTERN_TABLE = 0x1;
const WASM_EXTERN_MEMORY = 0x2;
const WASM_EXTERN_GLOBAL = 0x3;
const WASM_EXTERN_FUNC = 0x3;
