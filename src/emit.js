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

function getNativeTypeSize(type) {
  switch (type) {
    case TokenList.INT: case TokenList.INT32: return (4);
    case TokenList.INT64: return (8);
    case TokenList.FLOAT: case TokenList.FLOAT32: return (4);
    case TokenList.FLOAT64: return (8);
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
  emitGlobalSection(node.body);
  emitExportSection(node.body);
  emitCodeSection(node.body);
};

function emitGlobalSection(node) {
  bytes.emitU8(WASM_SECTION_GLOBAL);
  let size = bytes.createU32vPatch();
  let count = bytes.createU32vPatch();
  let amount = 0;
  node.body.map((child) => {
    if (child.kind === Nodes.VariableDeclaration && child.isGlobal) {
      let init = child.init.right;
      // global have their own indices, patch it here
      child.index = amount++;
      bytes.emitU8(getWasmType(child.type));
      // mutability, enabled by default
      bytes.emitU8(1);
      emitNode(init);
      bytes.emitU8(WASM_OPCODE_END);
    }
  });
  count.patch(amount);
  size.patch(bytes.length - size.offset);
};

function emitTypeSection(node) {
  bytes.emitU8(WASM_SECTION_TYPE);
  let size = bytes.createU32vPatch();
  let count = bytes.createU32vPatch();
  let amount = 0;
  node.body.map((child) => {
    if (child.kind === Nodes.FunctionDeclaration) {
      bytes.emitU8(WASM_TYPE_CTOR_FUNC);
      // parameter count
      bytes.writeVarUnsigned(child.parameter.length);
      // parameter types
      child.parameter.map((param) => {
        bytes.emitU8(getWasmType(param.type));
      });
      // emit type
      if (child.type !== TokenList.VOID) {
        // return count
        bytes.emitU8(1);
        // return type
        bytes.emitU8(getWasmType(child.type));
      // void
      } else {
        bytes.emitU8(0);
      }
      amount++;
    }
  });
  count.patch(amount);
  // emit section size at reserved patch offset
  size.patch(bytes.length - size.offset);
};

function emitFunctionSection(node) {
  bytes.emitU8(WASM_SECTION_FUNCTION);
  let size = bytes.createU32vPatch();
  let count = bytes.createU32vPatch();
  let amount = 0;
  node.body.map((child) => {
    if (child.kind === Nodes.FunctionDeclaration) {
      amount++;
      bytes.writeVarUnsigned(child.index);
    }
  });
  count.patch(amount);
  size.patch(bytes.length - size.offset);
};

function emitMemorySection(node) {
  bytes.emitU8(WASM_SECTION_MEMORY);
  // we dont use memory yet, write empty bytes
  let size = bytes.createU32vPatch();
  bytes.emitU32v(1);
  bytes.emitU32v(0);
  bytes.emitU32v(1);
  size.patch(bytes.length - size.offset);
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
        bytes.writeVarUnsigned(child.index);
      }
    }
  });
  // export memory
  (() => {
    amount++;
    bytes.emitString("memory");
    bytes.emitU8(WASM_EXTERN_MEMORY);
    bytes.emitU8(0);
  })();
  count.patch(amount);
  size.patch(bytes.length - size.offset);
};

function emitCodeSection(node) {
  bytes.emitU8(WASM_SECTION_CODE);
  let size = bytes.createU32vPatch();
  let count = bytes.createU32vPatch();
  let amount = 0;
  node.body.map((child) => {
    if (child.kind === Nodes.FunctionDeclaration) {
      emitFunction(child);
      amount++;
    }
  });
  count.patch(amount);
  size.patch(bytes.length - size.offset);
};

let currentHeapOffset = 3;
function growHeap(amount) {
  currentHeapOffset += amount;
};

function emitNode(node) {
  let kind = node.kind;
  if (kind === Nodes.BlockStatement) {
    let actual = node.context.node;
    // if, while auto provide a block scope
    let skip = (
      actual.kind === Nodes.IfStatement ||
      actual.kind === Nodes.WhileStatement ||
      actual.kind === Nodes.FunctionDeclaration
    );
    if (skip) {
      //console.log("Skipping block code for", Nodes[actual.kind]);
    }
    if (node.context) {
      scope = node.context;
    }
    if (!skip) {
      bytes.emitU8(WASM_OPCODE_BLOCK);
      bytes.emitU8(WASM_TYPE_CTOR_BLOCK);
    }
    node.body.map((child) => {
      emitNode(child);
    });
    if (!skip) {
      bytes.emitU8(WASM_OPCODE_END);
    }
    if (node.context) {
      scope = scope.parent;
    }
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
  else if (kind === Nodes.CallExpression) {
    let callee = node.callee.value;
    let resolve = scope.resolve(callee);
    node.parameter.map((child) => {
      emitNode(child);
    });
    bytes.emitU8(WASM_OPCODE_CALL);
    bytes.writeVarUnsigned(resolve.index);
  }
  else if (kind === Nodes.VariableDeclaration) {
    emitVariableDeclaration(node);
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
    emitNode(node.body);
    // jump back to top
    bytes.emitU8(WASM_OPCODE_BR);
    bytes.emitU8(0);
    bytes.emitU8(WASM_OPCODE_UNREACHABLE);
    bytes.emitU8(WASM_OPCODE_END);
    bytes.emitU8(WASM_OPCODE_END);
  }
  else if (kind === Nodes.BreakStatement) {
    bytes.emitU8(WASM_OPCODE_BR);
    let label = getLoopDepthIndex();
    bytes.writeVarUnsigned(label);
    bytes.emitU8(WASM_OPCODE_UNREACHABLE);
  }
  else if (kind === Nodes.ContinueStatement) {
    bytes.emitU8(WASM_OPCODE_BR);
    let label = getLoopDepthIndex();
    bytes.writeVarUnsigned(label - 1);
    bytes.emitU8(WASM_OPCODE_UNREACHABLE);
  }
  else if (kind === Nodes.Literal) {
    if (node.type === Token.Identifier) {
      emitIdentifier(node);
    }
    else if (node.type === Token.NumericLiteral || node.type === Token.HexadecimalLiteral) {
      bytes.emitU8(WASM_OPCODE_I32_CONST);
      bytes.emitLEB128(parseInt(node.value));
    }
    else {
      __imports.error("Unknown literal type " + node.type);
    }
  }
  else if (kind === Nodes.UnaryPrefixExpression) {
    let operator = node.operator;
    // 0 - x
    if (operator === "-") {
      bytes.emitUi32(0);
      emitNode(node.value);
      bytes.emitU8(WASM_OPCODE_I32_SUB);
    }
    // ignored
    else if (operator === "+") {
      emitNode(node.value);
    }
    // x = 0
    else if (operator === "!") {
      emitNode(node.value);
      bytes.emitU8(WASM_OPCODE_I32_EQZ);
    }
    else if (operator === "++" || operator === "--") {
      let local = node.value;
      let resolve = scope.resolve(local.value);
      let op = (
        node.operator === "++" ? WASM_OPCODE_I32_ADD : WASM_OPCODE_I32_SUB
      );
      emitNode(local);
      bytes.emitUi32(1);
      bytes.emitU8(op);
      bytes.emitU8(WASM_OPCODE_TEE_LOCAL);
      bytes.writeVarUnsigned(resolve.offset);
    }
  }
  else if (kind === Nodes.UnaryPostfixExpression) {
    emitPostfixExpression(node);
  }
  else if (kind === Nodes.BinaryExpression) {
    let operator = node.operator;
    if (operator === "=") {
      emitAssignment(node);
    } else {
      emitNode(node.left);
      emitNode(node.right);
      bytes.emitU8(getWasmOperator(operator));
    }
  }
  else {
    __imports.error("Unknown node kind " + kind);
  }
};

function emitAssignment(node) {
  if (node.left.kind !== Nodes.Literal) {
    __imports.error("Invalid left-hand side in assignment");
  }
  let target = node.left;
  let resolve = scope.resolve(target.value);
  // deep assignment
  if (node.right.operator === "=") {
    emitNode(node.right);
    emitNode(node.right.left);
  }
  // the pointer to assign to is a parameter
  else if (resolve.isPointer && resolve.isParameter) {
    // get the passed in pointer address
    bytes.emitU8(WASM_OPCODE_GET_LOCAL);
    bytes.writeVarUnsigned(resolve.index);
    bytes.emitUi32(4);
    bytes.emitU8(WASM_OPCODE_I32_ADD);
    bytes.emitU8(WASM_OPCODE_I32_LOAD);
    bytes.emitU8(2); // i32
    bytes.writeVarUnsigned(0);
    emitNode(node.right);
    // store it
    bytes.emitU8(WASM_OPCODE_I32_STORE);
    bytes.emitU8(2); // i32
    bytes.emitU8(0);
    return;
  }
  // a pointer gets assigned something
  else if (resolve.isPointer) {
    // go to pointer's address
    bytes.emitUi32(resolve.offset);
    // take the address the pointer is located
    bytes.emitU8(WASM_OPCODE_I32_LOAD);
    bytes.emitU8(2); // i32
    bytes.writeVarUnsigned(0);
    // pointer gets assigned some value to the pointed adress
    // [*ptr = x]
    if (target.isDereference) {
      // jump 4 bytes up to get the pointer's pointed value
      bytes.emitUi32(4);
      bytes.emitU8(WASM_OPCODE_I32_ADD);
    }
    // pointer gets assigned some address
    // [ptr = addr]
    else {
      // don't add 4 bytes, stay on the pointer's mem address
    }
    // load that address
    bytes.emitU8(WASM_OPCODE_I32_LOAD);
    bytes.emitU8(2); // i32
    bytes.writeVarUnsigned(0);
    // set the value to assign
    emitNode(node.right);
    // store it
    bytes.emitU8(WASM_OPCODE_I32_STORE);
    bytes.emitU8(2); // i32
    bytes.emitU8(0);
  }
  // just a default variable assignment
  else {
    emitNode(node.right);
  }
};

function emitIdentifier(node) {
  let resolve = scope.resolve(node.value);
  // global variable
  if (resolve.isGlobal) {
    bytes.emitU8(WASM_OPCODE_GET_GLOBAL);
    bytes.writeVarUnsigned(resolve.index);
  }
  // address-of identifier
  else if (node.isReference) {
    if (resolve.isGlobal) {
      __imports.error("Taking address of global variable", node.value ," isnt supported!");
    }
    // pointer variable
    else if (resolve.isPointer) {
      // push the pointer's address
      bytes.emitUi32(resolve.offset);
      bytes.emitU8(WASM_OPCODE_I32_LOAD);
      bytes.emitU8(2); // i32
      bytes.writeVarUnsigned(0);
      // now pop and load the real pointer's address
      bytes.emitU8(WASM_OPCODE_I32_LOAD);
      bytes.emitU8(2); // i32
      bytes.writeVarUnsigned(0);
    }
    // variable
    else {
      // just push the static variable's address offset
      bytes.emitUi32(resolve.offset);
    }
  }
  // handle pointer parameter
  else if (resolve.isPointer && resolve.isParameter) {
    if (node.isDereference) {
      // get the passed in pointer address
      bytes.emitU8(WASM_OPCODE_GET_LOCAL);
      bytes.writeVarUnsigned(resolve.index);
      // add 4 bytes to get the real pointer's address
      bytes.emitUi32(4);
      bytes.emitU8(WASM_OPCODE_I32_ADD);
      // load this address
      bytes.emitU8(WASM_OPCODE_I32_LOAD);
      bytes.emitU8(2); // i32
      bytes.writeVarUnsigned(0);
      bytes.emitU8(WASM_OPCODE_I32_LOAD);
      bytes.emitU8(2); // i32
      bytes.writeVarUnsigned(0);
    } else {
      bytes.emitU8(WASM_OPCODE_GET_LOCAL);
      bytes.writeVarUnsigned(resolve.index);
    }
  }
  // value-of identifier
  else if (node.isDereference) {
    // take value where pointer points to
    if (resolve.isPointer) {
      bytes.emitUi32(resolve.offset);
      bytes.emitU8(WASM_OPCODE_I32_LOAD);
      bytes.emitU8(2); // i32
      bytes.writeVarUnsigned(0);
      // pointer value at ptr address + 4
      bytes.emitUi32(4);
      bytes.emitU8(WASM_OPCODE_I32_ADD);
      // now pop and load the real pointer's address
      bytes.emitU8(WASM_OPCODE_I32_LOAD);
      bytes.emitU8(2); // i32
      bytes.writeVarUnsigned(0);
      // now push the pointers pointed value
      bytes.emitU8(WASM_OPCODE_I32_LOAD);
      bytes.emitU8(2); // i32
      bytes.writeVarUnsigned(0);
    }
    // invalid ?
    else {
      __imports.error("Unsupported dereference to", node.value);
    }
  }
  // pointer variable
  else if (resolve.isPointer) {
    // push the pointer's address
    bytes.emitUi32(resolve.offset);
    bytes.emitU8(WASM_OPCODE_I32_LOAD);
    bytes.emitU8(2); // i32
    bytes.writeVarUnsigned(0);
    // now pop and load the real pointer's address
    bytes.emitU8(WASM_OPCODE_I32_LOAD);
    bytes.emitU8(2); // i32
    bytes.writeVarUnsigned(0);
  }
  // variable
  else {
    bytes.emitUi32(resolve.offset);
    bytes.emitU8(WASM_OPCODE_I32_LOAD);
    bytes.emitU8(2); // i32
    bytes.writeVarUnsigned(0);
  }
};

function emitVariableDeclaration(node) {
  let resolve = scope.resolve(node.id);
  let storeInMemory = resolve.isMemoryLocated;
  node.offset = currentHeapOffset;
  // store pointer
  // +0 = pointer address, +4 = address pointed to
  if (resolve.isPointer) {
    console.log("Store pointer variable", node.id, "in memory at", resolve.offset);
    // # store the pointer address
    // offset
    bytes.emitUi32(resolve.offset);
    growHeap(4);
    // value
    bytes.emitUi32(resolve.offset);
    // store it
    bytes.emitU8(WASM_OPCODE_I32_STORE);
    bytes.emitU8(2); // i32
    bytes.emitU8(0);
    // # store the pointer value
    // offset
    bytes.emitUi32(resolve.offset + 4);
    // value
    // manually emit, dont allow deep assignments here
    emitNode(node.init.right);
    // store it
    bytes.emitU8(WASM_OPCODE_I32_STORE);
    bytes.emitU8(2); // i32
    bytes.emitU8(0);
    growHeap(4);
  }
  // store variable
  else {
    console.log("Store variable", node.id, "in memory at", resolve.offset);
    // offset
    bytes.emitUi32(resolve.offset);
    growHeap(4);
    // value
    emitNode(node.init);
    // store
    bytes.emitU8(WASM_OPCODE_I32_STORE);
    bytes.emitU8(2); // i32
    bytes.emitU8(0);
  }
};

function getLoopDepthIndex() {
  let ctx = scope;
  let label = 0;
  while (ctx !== null) {
    label++;
    if (ctx.node.kind === Nodes.WhileStatement) break;
    ctx = ctx.parent;
  };
  return (label);
};

function emitPostfixExpression(node) {
  let local = node.value;
  let resolve = scope.resolve(local.value);
  if (node.operator === "++") {
    bytes.emitUi32(1);
    emitIdentifier(local);
    bytes.emitU8(WASM_OPCODE_I32_ADD);
    bytes.emitU8(WASM_OPCODE_TEE_LOCAL);
    bytes.writeVarUnsigned(resolve.offset);
    bytes.emitUi32(1);
    bytes.emitU8(WASM_OPCODE_I32_SUB);
  } else if (node.operator === "--") {
    emitIdentifier(local);
    bytes.emitUi32(1);
    bytes.emitU8(WASM_OPCODE_I32_SUB);
    bytes.emitU8(WASM_OPCODE_TEE_LOCAL);
    bytes.writeVarUnsigned(resolve.offset);
    bytes.emitUi32(1);
    bytes.emitU8(WASM_OPCODE_I32_ADD);
  }
};

function emitFunction(node) {
  let size = bytes.createU32vPatch();
  // emit count of locals
  let locals = node.locals;
  // local count
  bytes.writeVarUnsigned(locals.length);
  // local entry signatures
  locals.map((local) => {
    bytes.emitU8(1);
    bytes.emitU8(getWasmType(local.type));
  });
  emitNode(node.body);
  // patch function body size
  bytes.emitU8(WASM_OPCODE_END);
  size.patch(bytes.length - size.offset);
};

function getLocalSignatureUniforms(locals) {
  let uniforms = [];
  return (uniforms);
};

function getFunctionSignatureUniforms(fns) {
  let uniforms = [];
  return (uniforms);
};
