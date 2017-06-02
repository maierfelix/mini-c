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
  scope = node.context;
  bytes.emitU32(WASM_MAGIC);
  bytes.emitU32(WASM_VERSION);
  emitTypeSection(node.body);
  emitFunctionSection(node.body);
  emitMemorySection(node);
  emitExportSection(node.body);
  emitCodeSection(node.body);
};

function emitTypeSection(node) {
  bytes.emitULEB128(WASM_SECTION_TYPE);
  let size = bytes.createULEB128Patch();
  let count = bytes.createULEB128Patch();
  let amount = 0;
  // emit function types
  let types = [];
  node.body.map((child) => {
    if (child.kind === Nodes.FunctionDeclaration) {
      bytes.emitULEB128(WASM_TYPE_CTOR_FUNC);
      // parameter count
      bytes.emitULEB128(child.parameter.length);
      // parameter types
      child.parameter.map((param) => {
        bytes.emitULEB128(getWasmType(param.type));
      });
      // emit type
      if (child.type !== TokenList.VOID) {
        // return count
        bytes.emitULEB128(1);
        // return type
        bytes.emitULEB128(getWasmType(child.type));
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
  bytes.emitULEB128(WASM_SECTION_FUNCTION);
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
  bytes.emitULEB128(WASM_SECTION_MEMORY);
  // we dont use memory yet, write empty bytes
  let size = bytes.createULEB128Patch();
  bytes.emitU32v(1);
  bytes.emitU32v(0);
  bytes.emitU32v(1);
  size.patch(bytes.length - 1 - size.offset);
};

function emitExportSection(node) {
  bytes.emitULEB128(WASM_SECTION_EXPORT);
  let size = bytes.createULEB128Patch();
  let count = bytes.createULEB128Patch();
  let amount = 0;
  node.body.map((child) => {
    if (child.kind === Nodes.FunctionDeclaration) {
      if (child.isExported || child.id === "main") {
        amount++;
        bytes.emitString(child.id);
        bytes.emitULEB128(WASM_EXTERN_FUNCTION);
        bytes.emitULEB128(child.index);
      }
    }
  });
  count.patch(amount);
  size.patch(bytes.length - 1 - size.offset);
};

function emitCodeSection(node) {
  bytes.emitULEB128(WASM_SECTION_CODE);
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
  if (kind === Nodes.BlockStatement) {
    if (node.context) scope = node.context;
    bytes.emitULEB128(WASM_OPCODE_BLOCK);
    bytes.emitULEB128(WASM_TYPE_CTOR_BLOCK);
    node.body.map((child) => {
      emitNode(child);
    });
    bytes.emitULEB128(WASM_OPCODE_END);
    if (node.context) scope = scope.parent;
  }
  else if (kind === Nodes.FunctionDeclaration) {
    emitFunction(node);
  }
  else if (kind === Nodes.IfStatement) {
    if (node.condition) {
      emitNode(node.condition);
      bytes.emitULEB128(WASM_OPCODE_IF);
      bytes.emitULEB128(WASM_TYPE_CTOR_BLOCK);
    }
    emitNode(node.consequent);
    if (node.alternate) {
      bytes.emitULEB128(WASM_OPCODE_ELSE);
      emitNode(node.alternate);
    }
    if (node.condition) bytes.emitULEB128(WASM_OPCODE_END);
  }
  else if (kind === Nodes.ReturnStatement) {
    if (node.argument) emitNode(node.argument);
    bytes.emitULEB128(WASM_OPCODE_RETURN);
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
      bytes.emitULEB128(WASM_OPCODE_SET_LOCAL);
      bytes.emitULEB128(resolve.index);
    } else {
      emitNode(node.left);
      emitNode(node.right);
      bytes.emitULEB128(getWasmOperator(operator));
    }
  }
  else if (kind === Nodes.CallExpression) {
    let callee = node.callee.value;
    let resolve = scope.resolve(callee);
    node.parameter.map((child) => {
      emitNode(child);
    });
    bytes.emitULEB128(WASM_OPCODE_CALL);
    bytes.emitULEB128(resolve.index);
  }
  else if (kind === Nodes.VariableDeclaration) {
    let resolve = scope.resolve(node.id);
    // default initialisation with zero
    bytes.emitULEB128(WASM_OPCODE_I32_CONST);
    bytes.emitULEB128(0);
    bytes.emitULEB128(WASM_OPCODE_SET_LOCAL);
    bytes.emitULEB128(resolve.index);
    // emit final initialisation
    emitNode(node.init);
  }
  else if (kind === Nodes.WhileStatement) {
    bytes.emitULEB128(WASM_OPCODE_BLOCK);
    bytes.emitULEB128(WASM_TYPE_CTOR_BLOCK);
    bytes.emitULEB128(WASM_OPCODE_LOOP);
    bytes.emitULEB128(WASM_TYPE_CTOR_BLOCK);
    // condition
    emitNode(node.condition);
    // break if condition != true
    bytes.emitULEB128(WASM_OPCODE_I32_EQZ);
    bytes.emitULEB128(WASM_OPCODE_BR_IF);
    bytes.emitULEB128(1);
    // manually emit body
    scope = node.context;
    node.body.body.map((child) => emitNode(child));
    scope = scope.parent;
    // jump back to top
    bytes.emitULEB128(WASM_OPCODE_BR);
    bytes.emitULEB128(0);
    bytes.emitULEB128(WASM_OPCODE_UNREACHABLE);
    bytes.emitULEB128(WASM_OPCODE_END);
    bytes.emitULEB128(WASM_OPCODE_END);
  }
  else if (kind === Nodes.BreakStatement) {
    bytes.emitULEB128(WASM_OPCODE_BR);
    let label = getLoopContext().index;
    bytes.emitLEB128(label);
    bytes.emitULEB128(WASM_OPCODE_UNREACHABLE);
  }
  else if (kind === Nodes.ContinueStatement) {
    bytes.emitULEB128(WASM_OPCODE_BR);
    let label = getLoopContext().index;
    bytes.emitLEB128(label - 1);
    bytes.emitULEB128(WASM_OPCODE_UNREACHABLE);
  }
  else if (kind === Nodes.Literal) {
    if (node.type === Token.Identifier) {
      emitIdentifier(node);
    }
    else if (node.type === Token.NumericLiteral) {
      bytes.emitULEB128(WASM_OPCODE_I32_CONST);
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

function getLoopContext() {
  let ctx = scope;
  while (ctx !== null) {
    if (ctx.node.kind === Nodes.WhileStatement) break;
    ctx = ctx.parent;
  };
  return (ctx);
};

function emitIdentifier(node) {
  let resolve = scope.resolve(node.value);
  bytes.emitULEB128(WASM_OPCODE_GET_LOCAL);
  bytes.emitULEB128(resolve.index);
  if (node.isReference) {
    bytes.emitULEB128(WASM_OPCODE_I32_STORE);
    bytes.emitULEB128(2); // size alignment
    bytes.emitULEB128(0);
    console.log("Store", node.value, "at:", resolve.index);
  }
  else if (node.isDereference) {
    bytes.emitULEB128(WASM_OPCODE_I32_LOAD);
    bytes.emitULEB128(2); // size alignment
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
    bytes.emitULEB128(1);
    bytes.emitULEB128(getWasmType(local.type));
  });
  // manually, dont handle a function's body as a block
  scope = node.context;
  node.body.body.map((child) => emitNode(child));
  scope = scope.parent;
  // patch function body size
  size.patch(bytes.length - size.offset);
  bytes.emitULEB128(WASM_OPCODE_END);
};

function getLocalSignatureUniforms(locals) {
  let uniforms = [];
  return (uniforms);
};

function getFunctionSignatureUniforms(fns) {
  let uniforms = [];
  return (uniforms);
};
