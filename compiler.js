(function() { "use strict";

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
    Label[Label["Parameter"] = ++ii] = "Parameter";
    Label[Label["TypeCast"] = ++ii] = "TypeCast";
    Label[Label["Identifier"] = ++ii] = "Identifier";
    Label[Label["Literal"] = ++ii] = "Literal";
    Label[Label["Comment"] = ++ii] = "Comment";
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
    Label[Label["import"] = ++ii] = "IMPORT";
    Label[Label["export"] = ++ii] = "EXPORT";
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
    Label[Label["!"] = ++ii] = "NOT";
    Label[Label["*"] = ++ii] = "MUL";
    Label[Label["/"] = ++ii] = "DIV";
    Label[Label["%"] = ++ii] = "MOD";
    Label[Label["+"] = ++ii] = "ADD";
    Label[Label["-"] = ++ii] = "SUB";
    Label[Label["="] = ++ii] = "ASS";
    Label[Label["<"] = ++ii] = "LT";
    Label[Label["<="] = ++ii] = "LE";
    Label[Label[">"] = ++ii] = "GT";
    Label[Label[">="] = ++ii] = "GE";
    Label[Label["=="] = ++ii] = "EQ";
    Label[Label["!="] = ++ii] = "NEQ";
    Label[Label["&&"] = ++ii] = "AND";
    Label[Label["||"] = ++ii] = "OR";
    Label[Label["++"] = ++ii] = "INCR";
    Label[Label["--"] = ++ii] = "DECR";
  })(Operators);

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
  const WASM_OPCODE_I32_NE = 0x47;
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
  const WASM_SECTION_MEMORY = 0x5;
  const WASM_SECTION_EXPORT = 0x7;
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
  const WASM_TYPE_CTOR_BLOCK = 0x40;

  const WASM_EXTERN_FUNCTION = 0x0;
  const WASM_EXTERN_TABLE = 0x1;
  const WASM_EXTERN_MEMORY = 0x2;
  const WASM_EXTERN_GLOBAL = 0x3;
  const WASM_EXTERN_FUNC = 0x3;

  function getWasmType(type) {
    switch (type) {
      case TokenList.VOID: return (WASM_TYPE_CTOR_VOID);
      case TokenList.INT: case TokenList.INT32: return (WASM_TYPE_CTOR_I32);
      case TokenList.INT64: return (WASM_TYPE_CTOR_I64);
      case TokenList.FLOAT: case TokenList.FLOAT32: return (WASM_TYPE_CTOR_I32);
      case TokenList.FLOAT64: return (WASM_TYPE_CTOR_F64);
      case TokenList.BOOL: return (WASM_TYPE_CTOR_I32);
    };
    return (-1);
  };
  function getWasmOperator(op) {
    switch (op) {
      case "+": return (WASM_OPCODE_I32_ADD);
      case "-": return (WASM_OPCODE_I32_SUB);
      case "*": return (WASM_OPCODE_I32_MUL);
    };
    return (-1);
  };

  // # Halp functions #
  function isBlank(cc) {
    return (
      cc === 9 ||
      cc === 11 ||
      cc === 12 ||
      cc === 32 ||
      cc === 160
    );
  };
  function isQuote(cc) {
    return (
      cc === 39 ||
      cc === 34
    );
  };
  function isAlpha(cc) {
    return (
      cc >= 65 && cc <= 90 ||
      cc >= 97 && cc <= 122 ||
      cc === 95
    );
  };
  function isNumber(cc) {
    return (
      cc >= 48 && cc <= 57
    );
  };
  function isBinaryOperator(token) {
    let kind = token.kind;
    return (
      (kind === Operators.ASS ||
      kind === Operators.ADD ||
      kind === Operators.SUB ||
      kind === Operators.MUL ||
      kind === Operators.DIV ||
      kind === Operators.OR ||
      kind === Operators.AND ||
      kind === Operators.NOT ||
      kind === Operators.LT ||
      kind === Operators.LTE ||
      kind === Operators.GT ||
      kind === Operators.GTE ||
      kind === Operators.EQUAL ||
      kind === Operators.NEQUAL ||
      kind === Operators.OR ||
      kind === Operators.AND) &&
      !isUnaryPrefixOperator(token)
    );
  };
  function isUnaryPrefixOperator(token) {
    let kind = token.kind;
    return (
      kind === Operators.NOT ||
      kind === Operators.INCR ||
      kind === Operators.DECR
    );
  };
  function isUnaryPostfixOperator(token) {
    let kind = token.kind;
    return (
      kind === Operators.INCR ||
      kind === Operators.DECR
    );
  };
  function isLiteral(token) {
    let kind = token.kind;
    return (
      kind === Token.NumericLiteral ||
      kind === Token.BooleanLiteral ||
      kind === Token.Identifier
    );
  };
  function isNativeType(token) {
    let kind = token.kind;
    return (
      kind === TokenList.INT || kind === TokenList.INT32 || kind === TokenList.INT64 ||
      kind === TokenList.FLOAT || kind === TokenList.FLOAT32 || kind === TokenList.FLOAT64 ||
      kind === TokenList.VOID ||
      kind === TokenList.BOOLEAN
    );
  };
  function isPunctuatorChar(ch) {
    return (
      ch === "(" ||
      ch === ")" ||
      ch === "{" ||
      ch === "}" ||
      ch === "," ||
      ch === ";"
    );
  };
  function isOperatorChar(ch) {
    return (
      ch === "+" ||
      ch === "-" ||
      ch === "!" ||
      ch === "=" ||
      ch === "|" ||
      ch === "&" ||
      ch === ">" ||
      ch === "<" ||
      ch === "*" ||
      ch === "/"
    );
  };
  function isOperator(str) {
    if (str.length === 1) {
      return (isOperatorChar(str));
    }
    return (
      str === "++" ||
      str === "--" ||
      str === "==" ||
      str === "!=" ||
      str === "||" ||
      str === "&&" ||
      str === ">=" ||
      str === "<="
    );
  };

  function getOperatorPrecedence(operator) {
    switch (operator) {
      case "!": return (8);
      case "*": case "/": case "%": return (7);
      case "+": case "-": return (6);
      case "<": case "<=": case ">": case ">=": return (5);
      case "==": case "!=": return (4);
      case "&&": return (3);
      case "||": return (2);
      case "=": return (1);
    }
  };

  class ByteArray extends Array {
    emitU8(value) {
      this.push(value);
    }
    emitU16(value) {
      this.push(value & 0xff);
      this.push((value >> 8) & 0xff);
    }
    emitU32(value) {
      this.push(value & 0xff);
      this.push((value >> 8) & 0xff);
      this.push((value >> 16) & 0xff);
      this.push((value >> 24) & 0xff);
    }
    emitU32v(value) {
      while (true) {
        let v = value & 0xff;
        value = value >>> 7;
        if (value == 0) {
          this.push(v);
          break;
        }
        this.push(v | 0x80);
      }
    }
    patchU32v(value, offset) {
      let idx = 0;
      while (true) {
        let v = value & 0xff;
        value = value >>> 7;
        if (value == 0) {
          this[offset + idx] = v;
          break;
        }
        this[offset + idx] = v | 0x80;
        idx++;
      }
    }
    createU32vPatch() {
      let offset = this.length;
      this.emitU32v(0);
      return ({
        offset: offset,
        patch: (value) => this.patchU32v(value, offset)
      });
    }
    emitString(str) {
      var length = str.length | 0;
      this.emitU32v(length);
      var offset = this.length;
      var ii = 0;
      while (ii < length) {
        this.push(str.charCodeAt(ii) & 0xff);
        ii++;
      };
    }
  };

  function processToken(tokens, value, line, column) {
    let kind = Token.UNKNOWN;
    if (TokenList[value] >= 0) kind = TokenList[value];
    else if (Operators[value] >= 0) kind = Operators[value];
    else kind = Token["Identifier"];
    let token = createToken(kind, value, line, column-value.length);
    tokens.push(token);
    return (token);
  };

  // # Scanner #
  function createToken(kind, value, line, column) {
    let token = {
      kind: kind,
      value: value,
      line: line,
      column: column
    };
    return (token);
  };
  function scan(str) {
    let ii = -1;
    let line = 1;
    let column = 0;
    let length = str.length;
    let tokens = [];

    function next() {
      ii++;
      column++;
    };

    // placed here to have correct context to next()
    function processOperator(ch, second, line, column) {
      if (second && isOperator(ch + second)) {
        next();
        processToken(tokens, ch + second, line, column);
      } else if (isOperator(ch)) {
        processToken(tokens, ch, line, column);
      }
    };

    while (true) {
      next();
      let ch = str.charAt(ii);
      let cc = str.charCodeAt(ii);
      // blank [/s,/n]
      if (isBlank(cc)) {
        continue;
      }
      if (cc === 10) {
        line++;
        column = 0;
        continue;
      }
      // alphabetical [aA-zZ]
      if (isAlpha(cc)) {
        let start = ii;
        while (true) {
          if (!isAlpha(cc) && !isNumber(cc)) {
            ii--;
            column--;
            break;
          }
          next();
          cc = str.charCodeAt(ii);
        };
        let content = str.slice(start, ii+1);
        processToken(tokens, content, line, column);
        continue;
      }
      // number [0-9,-0]
      if (isNumber(cc) || cc === 45 && isNumber(str.charCodeAt(ii+1))) {
        let start = ii;
        while (true) {
          if (!isNumber(cc) && cc !== 45) {
            ii--;
            column--;
            break;
          }
          next();
          cc = str.charCodeAt(ii);
        };
        let content = str.slice(start, ii+1);
        let token = createToken(Token.NumericLiteral, content, line, column);
        tokens.push(token);
        continue;
      }
      // comment [//]
      if (ch === "/") {
        if (str.charAt(ii + 1) === "/") {
          while (true) {
            if (cc === 10) {
              column = 0;
              line++;
              break;
            }
            next();
            cc = str.charCodeAt(ii);
          };
        }
        continue;
      }
      // punctuator [;,(,)]
      if (isPunctuatorChar(ch)) {
        let content = str.slice(ii, ii+1);
        processToken(tokens, content, line, column);
        continue;
      }
      // single operator [+,-,=]
      if (isOperatorChar(ch)) {
        let second = str.slice(ii+1, ii+2);
        processOperator(ch, second, line, column);
        continue;
      }
      if (ii >= length) {
        break;
      }
    };
    return (tokens);
  };

  // # Scope #
  function Scope() {
    this.node = null;
    this.parent = null;
    this.symbols = {};
    // used to assign local variable indices
    this.localIndex = 0;
    this.resolve = function(id) {
      if (this.symbols[id]) {
        return (this.symbols[id]);
      } else {
        // recursively search symbol inside parent
        if (this.parent) {
          return (this.parent.resolve(id));
        } else {
          __imports.error(id + " is not defined");
        }
      }
      return (null);
    };
    this.register = function(id, node) {
      if (this.symbols[id] !== void 0) {
        __imports.error("Symbol " + id + " is already defined");
      }
      this.symbols[id] = node;
      if (node.kind === Nodes.VariableDeclaration || node.kind === Nodes.Parameter) {
        node.index = this.localIndex++;
      }
    };
  };

  function pushScope(node) {
    let scp = new Scope();
    scp.node = node;
    scp.parent = scope;
    node.context = scp;
    scope = scp;
  };

  function popScope() {
    if (scope !== null) {
      scope = scope.parent;
    }
  };

  function expectScope(node, kind) {
    let item = scope;
    while (item !== null) {
      if (item && item.node.kind === kind) break;
      item = item.parent;
    };
    if (item === null && kind !== null) {
      __imports.error("Invalid scope of node " +  node.kind + ", expected", kind);
    }
  };

  // # Parser #
  function parse(tkns) {
    tokens = tkns;
    pindex = -1;
    next();
    let node = {
      kind: Nodes["Program"],
      body: null
    };
    pushScope(node);
    node.body = parseStatementList();
    return (node);
  };
  function peek(kind) {
    return (current && current.kind === kind);
  };
  function next() {
    pindex++;
    current = tokens[pindex];
  };
  function expect(kind) {
    if (current.kind !== kind) {
      __imports.error("Expected " + kind + " but got " + current.kind + " in " + current.line + ":" + current.column);
    } else {
      next();
    }
  };
  function expectIdentifier() {
    if (current.kind !== Token.IDENTIFIER) {
      __imports.error("Expected " + Token.IDENTIFIER + ":identifier but got " + current.kind + ":" + current.value);
    }
  };
  function eat(kind) {
    if (peek(kind)) {
      next();
      return (true);
    }
    return (false);
  };

  function parseStatementList() {
    let list = [];
    while (true) {
      if (!current) break;
      if (peek(TokenList.RBRACE)) break;
      let node = parseStatement();
      if (!node) break;
      list.push(node);
    };
    return (list);
  };

  function parseStatement() {
    let node = null;
    if (eat(TokenList.EXPORT)) {
      node = parseDeclaration(true);
    } else if (isNativeType(current)) {
      node = parseDeclaration(false);
    } else if (peek(TokenList.RETURN)) {
      node = parseReturnStatement();
    } else if (peek(TokenList.IF)) {
      node = parseIfStatement();
    } else if (peek(TokenList.WHILE)) {
      node = parseWhileStatement();
    } else {
      node = parseExpression();
      if (node === null) {
        __imports.error("Unknown node kind " + current.value + " in " + current.line + ":" + current.column);
      }
    }
    eat(TokenList.SEMICOLON);
    return (node);
  };

  function parseDeclaration(extern) {
    let node = null;
    const type = current.kind;
    next();
    expectIdentifier();
    const name = current.value;
    next();
    const token = current.kind;
    if (token === Operators.ASS) {
      node = parseVariableDeclaration(type, name, extern);
    }
    else if (TokenList.LPAREN) {
      node = parseFunctionDeclaration(type, name, extern);
    }
    else {
      node = null;
      __imports.error("Invalid keyword: " + current.value);
    }
    return (node);
  };

  function parseWhileStatement() {
    let node = {
      kind: Nodes.WhileStatement,
      condition: null,
      body: null
    };
    expect(TokenList.WHILE);
    node.condition = parseExpression();
    // braced body
    if (eat(TokenList.LBRACE)) {
      pushScope(node);
      node.body = parseStatementList();
      popScope();
      expect(TokenList.RBRACE);
    // short body
    } else {
      node.body = parseExpression();
    }
    return (node);
  };

  function parseIfStatement() {
    let node = {
      kind: Nodes.IfStatement,
      condition: null,
      alternate: null,
      consequent: null
    };
    // else
    if (!eat(TokenList.IF)) {
      pushScope(node);
      node.consequent = parseIfBody();
      popScope();
      return (node);
    }
    expect(TokenList.LPAREN);
    node.condition = parseExpression();
    expect(TokenList.RPAREN);
    pushScope(node);
    node.consequent = parseIfBody();
    popScope();
    if (eat(TokenList.ELSE)) {
      node.alternate = parseIfStatement();
    }
    return (node);
  };

  function parseIfBody() {
    let node = null;
    // braced if
    if (eat(TokenList.LBRACE)) {
      node = parseStatementList();
      expect(TokenList.RBRACE);
    // short if
    } else {
      node = [];
      node.push(parseExpression());
      eat(TokenList.SEMICOLON);
    }
    return (node);
  };

  function parseReturnStatement() {
    expect(TokenList.RETURN);
    let node = {
      kind: Nodes.ReturnStatement,
      argument: parseExpression()
    };
    expectScope(node, Nodes.FunctionDeclaration);
    let item = scope;
    while (item !== null) {
      if (item && item.node.kind === Nodes.FunctionDeclaration) break;
      item = item.parent;
    };
    item.node.returns.push(node);
    return (node);
  };

  function parseFunctionDeclaration(type, name, extern) {
    let node = {
      index: findex++,
      isExported: !!extern,
      kind: Nodes.FunctionDeclaration,
      type: type,
      id: name,
      returns: [],
      parameter: null,
      body: null
    };
    expectScope(node, null); // only allow global functions
    node.parameter = parseFunctionParameters();
    if (eat(TokenList.LBRACE)) {
      pushScope(node);
      node.parameter.map((param) => {
        scope.register(param.value, param);
      });
      node.body = parseStatementList();
      popScope();
      expect(TokenList.RBRACE);
    }
    scope.register(name, node);
    if (node.type !== TokenList.VOID && !node.returns.length) {
      __imports.error("Missing return in function: " + node.id);
    }
    return (node);
  };

  function parseFunctionParameters() {
    let params = [];
    expect(TokenList.LPAREN);
    while (true) {
      if (peek(TokenList.RPAREN)) break;
      if (!isNativeType(current)) {
        __imports.error("Missing parameter kind: " + current);
      }
      const type = current.kind;
      next();
      expectIdentifier();
      params.push(current);
      let param = params[params.length - 1];
      param.type = type;
      param.kind = Nodes.Parameter;
      param.isParameter = true;
      next();
      if (!eat(TokenList.COMMA)) break;
    };
    expect(TokenList.RPAREN);
    return (params);
  };

  function parseVariableDeclaration(type, name, extern) {
    let node = {
      kind: Nodes.VariableDeclaration,
      type: type,
      id: name,
      init: null
    };
    // only allow export of global variables
    if (!!extern) expectScope(node, null);
    scope.register(node.id, node);
    expect(Operators.ASS);
    node.init = parseExpression();
    return (node);
  };

  function parseCallExpression(id) {
    let node = {
      kind: Nodes.CallExpression,
      callee: id,
      parameter: parseCallParameters()
    };
    return (node);
  };

  function parseCallParameters() {
    let params = [];
    expect(TokenList.LPAREN);
    while (true) {
      if (peek(TokenList.RPAREN)) break;
      let expr = parseExpression();
      params.push(expr);
      if (!eat(TokenList.COMMA)) break;
    };
    expect(TokenList.RPAREN);
    return (params);
  };

  function parseBreak() {
    let node = {
      kind: Nodes.BreakStatement
    };
    expect(TokenList.BREAK);
    expectScope(node, Nodes.WhileStatement);
    return (node);
  };

  function parseContinue() {
    let node = {
      kind: Nodes.ContinueStatement
    };
    expect(TokenList.CONTINUE);
    expectScope(node, Nodes.WhileStatement);
    return (node);
  };

  function parseUnaryPrefixExpression() {
    let node = {
      kind: Nodes.UnaryPrefixExpression,
      operator: current.value,
      value: null
    };
    next();
    node.value = parseLiteral();
    return (node);
  };

  function parseUnaryPostfixExpression(left) {
    let node = {
      kind: Nodes.UnaryPostfixExpression,
      operator: current.value,
      value: left
    };
    next();
    return (node);
  };

  function parseBinaryExpression(left) {
    let node = {
      kind: Nodes.BinaryExpression,
      left: left,
      right: null,
      operator: current.value
    };
    next();
    node.right = parseExpression();
    return (node);
  };

  function parseInfix(left) {
    if (isBinaryOperator(current)) {
      return (parseBinaryExpression(left));
    }
    if (isUnaryPostfixOperator(current)) {
      return (parseUnaryPostfixExpression(left));
    }
    if (peek(TokenList.LPAREN)) {
      return (parseCallExpression(left));
    }
    return (left);
  };

  function parsePrefix() {
    if (isLiteral(current)) {
      return (parseLiteral());
    }
    if (eat(TokenList.LPAREN)) {
      let node = parseExpression();
      expect(TokenList.RPAREN);
      return (node);
    }
    if (isUnaryPrefixOperator(current)) {
      return (parseUnaryPrefixExpression());
    }
    return (parseStatement());
  };

  function parseExpression() {
    if (peek(TokenList.BREAK)) {
      return (parseBreak());
    }
    if (peek(TokenList.CONTINUE)) {
      return (parseContinue());
    }
    let node = parsePrefix();
    while (true) {
      if (!current) break;
      let expr = parseInfix(node);
      if (expr === null || expr === node) break;
      node = expr;
    };
    return (node);
  };

  function parseLiteral() {
    let node = {
      kind: Nodes.Literal,
      type: current.kind,
      value: current.value
    };
    next();
    return (node);
  };

  /**
   * 1. Type section -> function signatures
   * 2. Func section -> function indices
   * 3. Code section -> function bodys
   */
  function emit(node) {
    emitTypeSection(node);
    emitFunctionSection(node);
    //emitMemorySection(node);
    emitExportSection(node);
    emitCodeSection(node);
  };

  function emitTypeSection(node) {
    bytes.emitU8(WASM_SECTION_TYPE);
    let size = bytes.createU32vPatch();
    let count = bytes.createU32vPatch();
    let amount = 0;
    // emit function types
    let types = [];
    node.body.map((child) => {
      if (child.kind === Nodes.FunctionDeclaration) {
        bytes.emitU8(WASM_TYPE_CTOR_FUNC);
        // emit parameter count
        bytes.emitU32v(child.parameter.length);
        // emit parameter types
        child.parameter.map((param) => {
          bytes.emitU8(getWasmType(param.type));
        });
        // emit return count
        bytes.emitU32v(child.returns.length);
        // emit return types
        child.returns.map((ret) => {
          bytes.emitU8(getWasmType(child.type));
        });
        amount++;
      }
    });
    count.patch(amount);
    // finally patch section size
    size.patch(bytes.length - 1 - size.offset);
  };

  function emitFunctionSection(node) {
    bytes.emitU8(WASM_SECTION_FUNCTION);
    let size = bytes.createU32vPatch();
    let count = bytes.createU32vPatch();
    let amount = 0;
    node.body.map((child) => {
      if (child.kind === Nodes.FunctionDeclaration) {
        amount++;
        bytes.emitU32v(child.index);
      }
    });
    count.patch(amount);
    size.patch(bytes.length - 1 - size.offset);
  };

  function emitMemorySection(node) {
    bytes.emitU8(WASM_SECTION_MEMORY);
    // we dont use memory yet, write empty bytes
    let size = bytes.createU32vPatch();
    bytes.emitU8(1);  // one memory entry
    bytes.emitU32v(1);
    bytes.emitU32v(0);
    bytes.emitU32v(0);
    size.patch(bytes.length - 1 - size.offset);
  };

  function emitExportSection(node) {
    bytes.emitU8(WASM_SECTION_EXPORT);
    let size = bytes.createU32vPatch();
    let count = bytes.createU32vPatch();
    let amount = 0;
    node.body.map((child) => {
      if (child.kind === Nodes.FunctionDeclaration) {
        if (child.isExported || child.id === "main") {
          amount++;
          bytes.emitString(child.id);
          bytes.emitU8(WASM_EXTERN_FUNCTION);
          bytes.emitU32v(child.index);
        }
      }
    });
    count.patch(amount);
    size.patch(bytes.length - 1 - size.offset);
  };

  function emitCodeSection(node) {
    bytes.emitU8(WASM_SECTION_CODE);
    let size = bytes.createU32vPatch();
    let count = bytes.createU32vPatch();
    let amount = 0;
    node.body.map((child) => {
      if (child.kind === Nodes.FunctionDeclaration) {
        emitNode(child);
        amount++;
      }
    });
    count.patch(amount);
    size.patch(bytes.length - 1 - size.offset);
  };

  function emitNode(node) {
    let kind = node.kind;
    if (node.context) scope = node.context;
    if (kind === Nodes.FunctionDeclaration) {
      emitFunction(node);
    }
    else if (kind === Nodes.ReturnStatement) {
      if (node.argument) emitNode(node.argument);
      bytes.emitU8(WASM_OPCODE_RETURN);
    }
    else if (kind === Nodes.BinaryExpression) {
      emitNode(node.left);
      emitNode(node.right);
      bytes.emitU8(getWasmOperator(node.operator));
    }
    else if (kind === Nodes.Literal) {
      if (node.type === Token.Identifier) {
        let resolve = scope.resolve(node.value);
        bytes.emitU8(WASM_OPCODE_GET_LOCAL);
        bytes.emitU32v(resolve.index);
      }
      else if (node.type === Token.NumericLiteral) {
        bytes.emitU8(WASM_OPCODE_I32_CONST);
        bytes.emitU32v(parseInt(node.value));
      }
    }
    else if (kind === Nodes.CallExpression) {
      let callee = node.callee.value;
      let resolve = scope.resolve(callee);
      node.parameter.map((child) => {
        emitNode(child);
      });
      bytes.emitU8(WASM_OPCODE_CALL);
      bytes.emitU32v(resolve.index);
    }
    else if (kind === Nodes.VariableDeclaration) {
      console.log(node);
      let resolve = scope.resolve(node.id);
      emitNode(node.init);
      bytes.emitU8(WASM_OPCODE_SET_LOCAL);
      bytes.emitU32v(resolve.index);
    }
    else {
      __imports.error("Unknown node kind " + kind);
    }
  };

  function emitFunction(node) {
    let size = bytes.createU32vPatch();
    // emit count of locals
    let locals = getLocalVariables(node);
    // local count
    bytes.emitU32v(locals.length);
    // local entry signatures
    locals.map((local) => {
      bytes.emitU8(1);
      bytes.emitU8(getWasmType(local.node.type));
    });
    node.body.map((child) => {
      emitNode(child);
    });
    // patch function body size
    size.patch(bytes.length - size.offset);
    bytes.emitU8(WASM_OPCODE_END);
  };

  function getLocalVariables(node) {
    let locals = [];
    let idx = 0;
    node.body.map((child) => {
      if (child.kind === Nodes.VariableDeclaration) {
        locals.push({ index: idx++, node: child });
      }
    });
    return (locals);
  };

  // # compiler globals
  let bytes = null;
  let scope = null;
  let pindex = 0;
  let tokens = null;
  let current = null;
  let findex = 0;
  let __imports = null;

  function compile(str, imports) {
    // reset
    findex = pindex = 0;
    scope = current = __imports = tokens = null;
    bytes = new ByteArray();
    __imports = imports;

    let tkns = scan(str);
    let ast = parse(tkns);
    bytes.emitU32(WASM_MAGIC);
    bytes.emitU32(WASM_VERSION);
    emit(ast);
    let buffer = new Uint8Array(bytes);
    let dump = Array.from(buffer).map((v) => { return (v.toString(16)); });
    let instance = new WebAssembly.Instance(new WebAssembly.Module(buffer));
    return ({
      dump: dump,
      buffer: buffer,
      module: instance,
      exports: instance.exports
    });
  };

  if (typeof module === "object" && module.exports) {
    module.exports = compile;
  }
  else if (typeof window !== "undefined") {
    window.compile = compile;
  }

})();
