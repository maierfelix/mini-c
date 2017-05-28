"use strict";

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
    case "/": return (WASM_OPCODE_I32_DIV_S);
    case "%": return (WASM_OPCODE_I32_REM_S);
    case "<": return (WASM_OPCODE_I32_LT_S);
    case "<=": return (WASM_OPCODE_I32_LE_S);
    case ">": return (WASM_OPCODE_I32_GT_S);
    case ">=": return (WASM_OPCODE_I32_GE_S);
    case "==": return (WASM_OPCODE_I32_EQ);
    case "!=": return (WASM_OPCODE_I32_NEQ);
    case "&&": return (WASM_OPCODE_I32_AND);
    case "||": return (WASM_OPCODE_I32_OR);
  };
  return (-1);
};

/**
 * 1. Type section -> function signatures
 * 2. Func section -> function indices
 * 3. Code section -> function bodys
 */
function emit(node) {
  bytes.emitU32(WASM_MAGIC);
  bytes.emitU32(WASM_VERSION);
  emitTypeSection(node.body);
  emitFunctionSection(node.body);
  emitMemorySection(node);
  emitExportSection(node.body);
  emitCodeSection(node.body);
};

function emitTypeSection(node) {
  bytes.emitU8(WASM_SECTION_TYPE);
  let size = bytes.createULEB128Patch();
  let count = bytes.createULEB128Patch();
  let amount = 0;
  // emit function types
  let types = [];
  node.body.map((child) => {
    if (child.kind === Nodes.FunctionDeclaration) {
      bytes.emitU8(WASM_TYPE_CTOR_FUNC);
      // parameter count
      bytes.emitULEB128(child.parameter.length);
      // parameter types
      child.parameter.map((param) => {
        bytes.emitU8(getWasmType(param.type));
      });
      // emit type
      if (child.type !== TokenList.VOID) {
        // return count
        bytes.emitULEB128(1);
        // return type
        bytes.emitU8(getWasmType(child.type));
      // void
      } else {
        bytes.emitULEB128(0);
      }
      amount++;
    }
  });
  count.patch(amount);
  // emit section size at reserved patch offset
  size.patch(bytes.length - 1 - size.offset);
};

function emitFunctionSection(node) {
  bytes.emitU8(WASM_SECTION_FUNCTION);
  let size = bytes.createULEB128Patch();
  let count = bytes.createULEB128Patch();
  let amount = 0;
  node.body.map((child) => {
    if (child.kind === Nodes.FunctionDeclaration) {
      amount++;
      bytes.emitULEB128(child.index);
    }
  });
  count.patch(amount);
  size.patch(bytes.length - 1 - size.offset);
};

function emitMemorySection(node) {
  bytes.emitU8(WASM_SECTION_MEMORY);
  // we dont use memory yet, write empty bytes
  let size = bytes.createULEB128Patch();
  bytes.emitU32v(1);
  bytes.emitU32v(0);
  bytes.emitU32v(1);
  size.patch(bytes.length - 1 - size.offset);
};

function emitExportSection(node) {
  bytes.emitU8(WASM_SECTION_EXPORT);
  let size = bytes.createULEB128Patch();
  let count = bytes.createULEB128Patch();
  let amount = 0;
  node.body.map((child) => {
    if (child.kind === Nodes.FunctionDeclaration) {
      if (child.isExported || child.id === "main") {
        amount++;
        bytes.emitString(child.id);
        bytes.emitU8(WASM_EXTERN_FUNCTION);
        bytes.emitULEB128(child.index);
      }
    }
  });
  count.patch(amount);
  size.patch(bytes.length - 1 - size.offset);
};

function emitCodeSection(node) {
  bytes.emitU8(WASM_SECTION_CODE);
  let size = bytes.createULEB128Patch();
  let count = bytes.createULEB128Patch();
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
  if (kind === Nodes.BlockStatement) {
    bytes.emitU8(WASM_OPCODE_BLOCK);
    bytes.emitU8(WASM_TYPE_CTOR_BLOCK);
    node.body.map((child) => {
      emitNode(child);
    });
    bytes.emitU8(WASM_OPCODE_END);
  }
  else if (kind === Nodes.FunctionDeclaration) {
    emitFunction(node);
  }
  else if (kind === Nodes.IfStatement) {
    if (node.condition) {
      emitNode(node.condition);
      bytes.emitU8(WASM_OPCODE_IF);
      bytes.emitU8(WASM_TYPE_CTOR_BLOCK);
    }
    emitNode(node.consequent);
    if (node.alternate) {
      bytes.emitU8(WASM_OPCODE_ELSE);
      emitNode(node.alternate);
    }
    if (node.condition) bytes.emitU8(WASM_OPCODE_END);
  }
  else if (kind === Nodes.ReturnStatement) {
    if (node.argument) emitNode(node.argument);
    bytes.emitU8(WASM_OPCODE_RETURN);
  }
  else if (kind === Nodes.BinaryExpression) {
    let operator = node.operator;
    if (operator === "=") {
      let resolve = scope.resolve(node.left.value);
      // deep assignment
      if (node.right.operator === "=") {
        emitNode(node.right);
        emitNode(node.right.left);
      } else {
        emitNode(node.right);
      }
      bytes.emitU8(WASM_OPCODE_SET_LOCAL);
      bytes.emitULEB128(resolve.index);
    } else {
      emitNode(node.left);
      emitNode(node.right);
      bytes.emitU8(getWasmOperator(operator));
    }
  }
  else if (kind === Nodes.CallExpression) {
    let callee = node.callee.value;
    let resolve = scope.resolve(callee);
    node.parameter.map((child) => {
      emitNode(child);
    });
    bytes.emitU8(WASM_OPCODE_CALL);
    bytes.emitULEB128(resolve.index);
  }
  else if (kind === Nodes.VariableDeclaration) {
    let resolve = scope.resolve(node.id);
    // default initialisation with zero
    bytes.emitU8(WASM_OPCODE_I32_CONST);
    bytes.emitU8(0);
    bytes.emitU8(WASM_OPCODE_SET_LOCAL);
    bytes.emitULEB128(resolve.index);
    // emit final initialisation
    emitNode(node.init);
  }
  else if (kind === Nodes.WhileStatement) {
    bytes.emitU8(WASM_OPCODE_BLOCK);
    bytes.emitU8(WASM_TYPE_CTOR_BLOCK);
    bytes.emitU8(WASM_OPCODE_LOOP);
    bytes.emitU8(WASM_TYPE_CTOR_BLOCK);
    // condition
    emitNode(node.condition);
    // break if condition != true
    bytes.emitU8(WASM_OPCODE_I32_EQZ);
    bytes.emitU8(WASM_OPCODE_BR_IF);
    bytes.emitU8(1);
    // body
    node.body.body.map((child) => emitNode(child));
    // jump back to top
    bytes.emitU8(WASM_OPCODE_BR);
    bytes.emitU8(0);
    bytes.emitU8(WASM_OPCODE_UNREACHABLE);
    bytes.emitU8(WASM_OPCODE_END);
    bytes.emitU8(WASM_OPCODE_END);
  }
  else if (kind === Nodes.Literal) {
    if (node.type === Token.Identifier) {
      emitIdentifier(node);
    }
    else if (node.type === Token.NumericLiteral) {
      bytes.emitU8(WASM_OPCODE_I32_CONST);
      bytes.emitLEB128(parseInt(node.value));
    }
    else {
      __imports.error("Unknown literal type " + node.type);
    }
  }
  else {
    __imports.error("Unknown node kind " + kind);
  }
};

function getLoopContext(node) {
  let ctx = scope;
  while (ctx !== null) {
    if (ctx.node.kind === Nodes.WhileStatement) break;
    ctx = ctx.parent;
  };
  return (ctx);
};

function emitIdentifier(node) {
  let resolve = scope.resolve(node.value);
  bytes.emitU8(WASM_OPCODE_GET_LOCAL);
  bytes.emitULEB128(resolve.index);
  if (node.isReference) {
    bytes.emitU8(WASM_OPCODE_I32_CONST);
    bytes.emitU8(0);
    bytes.emitU8(WASM_OPCODE_I32_STORE);
    bytes.emitU8(2); // size alignment
    bytes.emitULEB128(resolve.index);
    console.log("Store", node.value, "at:", resolve.index);
  }
  else if (node.isDereference) {
    bytes.emitU8(WASM_OPCODE_I32_CONST);
    bytes.emitU8(0);
    bytes.emitU8(WASM_OPCODE_I32_LOAD);
    bytes.emitU8(2); // size alignment
    bytes.emitULEB128(resolve.index);
    console.log("Load", node.value, "at:", resolve.index);
  }
};

function emitFunction(node) {
  let size = bytes.createULEB128Patch();
  // emit count of locals
  let locals = node.locals;
  // local count
  bytes.emitULEB128(locals.length);
  // local entry signatures
  locals.map((local) => {
    bytes.emitU8(1);
    bytes.emitU8(getWasmType(local.type));
  });
  // manually, dont handle a function's body as a block
  node.body.body.map((child) => emitNode(child));
  // patch function body size
  size.patch(bytes.length - size.offset);
  bytes.emitU8(WASM_OPCODE_END);
};

function getLocalSignatureUniforms(locals) {
  let uniforms = [];
  return (uniforms);
};

function getFunctionSignatureUniforms(fns) {
  let uniforms = [];
  return (uniforms);
};
