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
    case "==": return (WASM_OPCODE_I32_EQ);
    case "!=": return (WASM_OPCODE_I32_NEQ);
  };
  return (-1);
};

/**
 * 1. Type section -> function signatures
 * 2. Func section -> function indices
 * 3. Code section -> function bodys
 */
function emit(node) {
  emitTypeSection(node.body);
  emitFunctionSection(node.body);
  //emitMemorySection(node);
  emitExportSection(node.body);
  emitCodeSection(node.body);
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
      // parameter count
      bytes.emitU32v(child.parameter.length);
      // parameter types
      child.parameter.map((param) => {
        bytes.emitU8(getWasmType(param.type));
      });
      // emit type
      if (child.type !== TokenList.VOID) {
        // return count
        bytes.emitU32v(1);
        // return type
        bytes.emitU8(getWasmType(child.type));
      // void
      } else {
        bytes.emitU32v(0);
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
    emitNode(node.condition);
    bytes.emitU8(WASM_OPCODE_IF);
    bytes.emitU8(WASM_TYPE_CTOR_BLOCK);
    emitNode(node.consequent);
    if (node.alternate !== null) {
      bytes.emitU8(WASM_OPCODE_ELSE);
      emitNode(node.alternate);
    }
    bytes.emitU8(WASM_OPCODE_END);
  }
  else if (kind === Nodes.ReturnStatement) {
    if (node.argument) emitNode(node.argument);
    bytes.emitU8(WASM_OPCODE_RETURN);
  }
  else if (kind === Nodes.BinaryExpression) {
    let operator = node.operator;
    if (operator === "||") {
      emitNode(node.left);
      bytes.emitU8(WASM_OPCODE_IF);
      bytes.emitU8(WASM_TYPE_I32);
      bytes.emitU8(WASM_OPCODE_I32_CONST);
      bytes.emitU8(1);
      bytes.emitU8(WASM_OPCODE_ELSE);
      emitNode(node.right);
      bytes.emitU8(WASM_OPCODE_END);
    }
    else if (operator === "&&") {
      emitNode(node.left);
      bytes.emitU8(WASM_OPCODE_IF);
      bytes.emitU8(WASM_TYPE_I32);
      emitNode(node.right);
      bytes.emitU8(WASM_OPCODE_ELSE);
      bytes.emitU8(WASM_OPCODE_I32_CONST);
      bytes.emitU8(0);
      bytes.emitU8(WASM_OPCODE_END);
    }
    else {
      emitNode(node.left);
      emitNode(node.right);
      bytes.emitU8(getWasmOperator(operator));
    }
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
  let locals = getLocalVariables(node.body);
  // local count
  bytes.emitU32v(locals.length);
  // local entry signatures
  locals.map((local) => {
    bytes.emitU8(1);
    bytes.emitU8(getWasmType(local.node.type));
  });
  // manually, dont handle a function's body as a block
  node.body.body.map((child) => emitNode(child));
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

function getLocalSignatureUniforms(locals) {
  let uniforms = [];
  return (uniforms);
};

function getFunctionSignatureUniforms(fns) {
  let uniforms = [];
  return (uniforms);
};
