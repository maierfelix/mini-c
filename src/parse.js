"use strict";

function isBinaryOperator(token) {
  let kind = token.kind;
  return (
    (kind === Operators.ASS ||
    kind === Operators.ADD ||
    kind === Operators.SUB ||
    kind === Operators.MUL ||
    kind === Operators.DIV ||
    kind === Operators.MOD ||
    kind === Operators.OR ||
    kind === Operators.AND ||
    kind === Operators.BIN_AND ||
    kind === Operators.BIN_OR ||
    kind === Operators.BIN_XOR ||
    kind === Operators.BIN_SHL ||
    kind === Operators.BIN_SHR ||
    kind === Operators.NOT ||
    kind === Operators.LT ||
    kind === Operators.LE ||
    kind === Operators.GT ||
    kind === Operators.GE ||
    kind === Operators.EQ ||
    kind === Operators.NEQ ||
    kind === Operators.ADD_ASS ||
    kind === Operators.SUB_ASS ||
    kind === Operators.MUL_ASS ||
    kind === Operators.DIV_ASS ||
    kind === Operators.MOD_ASS ||
    kind === Operators.BIN_AND_ASS ||
    kind === Operators.BIN_OR_ASS ||
    kind === Operators.BIN_XOR_ASS ||
    kind === Operators.BIN_SHL_ASS ||
    kind === Operators.BIN_SHR_ASS) &&
    (kind !== Operators.NOT &&
    kind !== Operators.INCR &&
    kind !== Operators.DECR)
  );
};

function isAssignmentOperator(kind) {
  return (
    kind === Operators.ASS ||
    kind === Operators.ADD_ASS ||
    kind === Operators.SUB_ASS ||
    kind === Operators.MUL_ASS ||
    kind === Operators.DIV_ASS ||
    kind === Operators.MOD_ASS ||
    kind === Operators.BIN_AND_ASS ||
    kind === Operators.BIN_OR_ASS ||
    kind === Operators.BIN_XOR_ASS ||
    kind === Operators.BIN_SHL_ASS ||
    kind === Operators.BIN_SHR_ASS
  );
};

function isUnaryPrefixOperator(token) {
  let kind = token.kind;
  return (
    kind === Operators.BIN_AND ||
    kind === Operators.MUL ||
    kind === Operators.BIN_NOT ||
    kind === Operators.SUB ||
    kind === Operators.ADD ||
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
    kind === Token.HexadecimalLiteral ||
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
  global = scope;
  node.body = parseBlock();
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
    __imports.error("Expected " + getLabelName(kind) + " but got " + getLabelName(current.kind) + " in " + current.line + ":" + current.column);
  } else {
    next();
  }
};

function expectIdentifier() {
  if (current.kind !== Token.IDENTIFIER) {
    __imports.error("Expected " + Token.IDENTIFIER + ":identifier but got " + getLabelName(current.kind) + ":" + current.value);
  }
};

function eat(kind) {
  if (peek(kind)) {
    next();
    return (true);
  }
  return (false);
};

function parseBlock() {
  let node = {
    kind: Nodes.BlockStatement,
    body: [],
    context: scope
  };
  while (true) {
    if (!current) break;
    if (peek(TokenList.RBRACE)) break;
    let child = parseStatement();
    if (child === null) break;
    node.body.push(child);
  };
  return (node);
};

function parseStatement() {
  let node = null;
  if (eat(TokenList.EXPORT)) {
    node = parseDeclaration(true);
  } else if (peek(TokenList.ENUM)) {
    node = parseEnum();
  } else if (isNativeType(current)) {
    node = parseDeclaration(false);
  } else if (peek(TokenList.RETURN)) {
    node = parseReturnStatement();
  } else if (peek(TokenList.IF)) {
    node = parseIfStatement();
  } else if (peek(TokenList.WHILE)) {
    node = parseWhileStatement();
  } else {
    node = parseExpression(Operators.LOWEST);
    if (node === null) {
      __imports.error("Unknown node kind " + current.value + " in " + current.line + ":" + current.column);
    }
  }
  eat(TokenList.SEMICOLON);
  return (node);
};

function parseEnum() {
  expect(TokenList.ENUM);
  let name = null;
  if (peek(Token.Identifier)) {
    name = current.value;
    next();
  }
  // enum declaration
  if (eat(TokenList.LBRACE)) {
    let node = {
      kind: Nodes.EnumDeclaration,
      name: name,
      items: []
    };
    parseEnumList(node);
    expect(TokenList.RBRACE);
    parseTrailingNames(node);
    return (node);
  // enum variable
  } else {
    console.log(current);
  }
};

function parseTrailingNames(node) {
  while (true) {
    if (peek(Token.Identifier)) {
      console.log(current);
    }
    next();
    if (!eat(TokenList.COMMA)) break;
  };
};

function parseEnumList(node) {
  let iter = 0;
  while (true) {
    expectIdentifier();
    let enuma = {
      kind: Nodes.Enumerator,
      name: current.value,
      init: null
    };
    next();
    if (eat(Operators.ASS)) {
      let expr = parseExpression(Operators.LOWEST);
      enuma.init = expr;
      enuma.resolvedValue = evalExpression(expr);
      iter = enuma.resolvedValue;
    } else {
      enuma.resolvedValue = iter;
    }
    node.items.push(enuma);
    scope.register(enuma.name, enuma);
    // allow trailing commas
    eat(TokenList.COMMA);
    if (peek(TokenList.RBRACE)) break;
    iter++;
  };
};

function parseDeclaration(extern) {
  let node = null;
  expectTypeLiteral();
  const type = current.kind;
  next();
  let isPointer = eat(Operators.MUL);
  // if not pointer, check if &-reference
  let isAlias = false;
  if (!isPointer) { isAlias = eat(Operators.BIN_AND); }
  expectIdentifier();
  const name = current.value;
  next();
  const token = current.kind;
  if (token === Operators.ASS) {
    node = parseVariableDeclaration(type, name, extern, isPointer, isAlias);
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
  node.condition = parseExpression(Operators.LOWEST);
  // braced body
  if (eat(TokenList.LBRACE)) {
    pushScope(node);
    node.body = parseBlock();
    popScope();
    expect(TokenList.RBRACE);
  // short body
  } else {
    node.body = parseExpression(Operators.LOWEST);
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
  node.condition = parseExpression(Operators.LOWEST);
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
    node = parseBlock();
    expect(TokenList.RBRACE);
  // short if
  } else {
    node = [];
    node.push(parseExpression(Operators.LOWEST));
    eat(TokenList.SEMICOLON);
  }
  return (node);
};

function parseReturnStatement() {
  expect(TokenList.RETURN);
  let node = {
    kind: Nodes.ReturnStatement,
    argument: null
  };
  if (!peek(TokenList.SEMICOLON)) {
    node.argument = parseExpression(Operators.LOWEST);
  }
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
    index: 0,
    isExported: !!extern,
    kind: Nodes.FunctionDeclaration,
    type: type,
    id: name,
    locals: [],
    returns: [],
    parameter: null,
    prototype: null,
    body: null
  };
  expectScope(node, null); // only allow global functions
  node.parameter = parseFunctionParameters(node);
  node.isPrototype = !eat(TokenList.LBRACE);
  scope.register(name, node);
  if (!node.isPrototype) {
    pushScope(node);
    node.parameter.map((param) => {
      scope.register(param.value, param);
    });
    node.body = parseBlock();
    popScope();
    expect(TokenList.RBRACE);
  }
  if (node.prototype !== null && node.type !== TokenList.VOID && !node.returns.length) {
    __imports.error("Missing return in function: " + node.id);
  }
  // auto insert a empty return for void functions
  if (!node.returns.length && node.type === TokenList.VOID) {
    let ret = {
      kind: Nodes.ReturnStatement,
      argument: null
    };
    node.returns.push(ret);
    node.body.body.push(ret);
  }
  // auto insert return 0 for non-return main
  if (node.id === "main" && !node.returns.length) {
    let ret = {
      kind: Nodes.ReturnStatement,
      argument: {
        kind: Nodes.Literal,
        type: Token.NumericLiteral,
        value: "0"
      }
    };
    node.returns.push(ret);
    node.body.body.push(ret);
  }
  return (node);
};

function parseFunctionParameters(node) {
  let params = [];
  let hasPrototype = node.prototype !== null;
  expect(TokenList.LPAREN);
  while (true) {
    if (peek(TokenList.RPAREN)) break;
    let param = parseFunctionParameter(node);
    params.push(param);
    if (!eat(TokenList.COMMA)) break;
  };
  expect(TokenList.RPAREN);
  return (params);
};

function parseFunctionParameter(node) {
  let type = null;
  // type
  if (isNativeType(current)) {
    type = current.kind;
    next();
  } else {
    __imports.error("Missing type for parameter in", node.id);
  }
  // *&
  let isPointer = eat(Operators.MUL);
  let isReference = false;
  if (!isPointer) { isReference = eat(Operators.BIN_AND); }
  // id
  expectIdentifier();
  let param = current;
  param.type = type;
  param.kind = Nodes.Parameter;
  param.isParameter = true;
  param.isPointer = isPointer;
  param.isReference = isReference;
  next();
  return (param);
};

function parseVariableDeclaration(type, name, extern, isPointer, isAlias) {
  let node = {
    kind: Nodes.VariableDeclaration,
    type: type,
    id: name,
    init: null,
    isGlobal: false,
    isPointer,
    isAlias
  };
  // only allow export of global variables
  if (extern) expectScope(node, null);
  //expectScope(node, Nodes.FunctionDeclaration);
  scope.register(node.id, node);
  if (scope.parent === null) {
    node.isGlobal = true;
  }
  expect(Operators.ASS);
  let init = parseExpression(Operators.LOWEST);
  node.init = {
    kind: Nodes.BinaryExpression,
    left: {
      kind: Nodes.Literal,
      type: Token.Identifier,
      value: node.id
    },
    right: init,
    operator: "="
  };
  if (isAlias) {
    node.aliasValue = init;
    node.aliasReference = {
      kind: Nodes.UnaryPrefixExpression,
      operator: "&",
      value: node.aliasValue
    };
  }
  if (!node.isGlobal) {
    let fn = lookupFunctionScope(scope).node;
    fn.locals.push(node);
  } else {
    node.resolvedValue = evalExpression(node.init.right);
  }
  return (node);
};

function parseCallExpression(id) {
  let node = {
    kind: Nodes.CallExpression,
    callee: id,
    parameter: parseCallParameters(id.value)
  };
  return (node);
};

function parseCallParameters(id) {
  let params = [];
  let callee = scope.resolve(id);
  expect(TokenList.LPAREN);
  let index = 0;
  while (true) {
    if (peek(TokenList.RPAREN)) break;
    let expr = parseExpression(Operators.LOWEST);
    //let isReference = callee.parameter[index].isReference;
    //let isReference = false;
    // called functions parameter expects reference
    /*if (isReference && expr.kind === Nodes.Literal) {
      // wrap pass-by-reference node around passed in expression
      expr = {
        kind: Nodes.UnaryPrefixExpression,
        operator: "&",
        value: expr
      };
    }*/
    params.push(expr);
    if (!eat(TokenList.COMMA)) break;
    index++;
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

function expectTypeLiteral() {
  if (!isNativeType(current)) {
    __imports.error("Expected type literal but got " + current.kind);
  }
};

function parseUnaryPrefixExpression() {
  let node = {
    kind: Nodes.UnaryPrefixExpression,
    operator: current.value,
    value: null
  };
  next();
  node.value = parseExpression(Operators.UNARY_PREFIX);
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

function parsePrefix() {
  if (isLiteral(current)) {
    return (parseLiteral());
  }
  if (eat(TokenList.LPAREN)) {
    let node = parseExpression(Operators.LOWEST);
    expect(TokenList.RPAREN);
    return (node);
  }
  if (isUnaryPrefixOperator(current)) {
    return (parseUnaryPrefixExpression());
  }
  return (parseExpression(Operators.LOWEST));
};

function parseBinaryExpression(level, left) {
  let operator = current.value;
  let precedence = Operators[operator];
  if (level > precedence) return (left);
  let node = {
    kind: Nodes.BinaryExpression,
    left: left,
    right: null,
    operator: operator
  };
  next();
  node.right = parseExpression(precedence);
  let okind = Operators[operator];
  if (isAssignmentOperator(okind) && okind !== Operators.ASS) {
    let right = {
      kind: Nodes.BinaryExpression,
      left: node.left,
      operator: "=",
      right: {
        kind: Nodes.BinaryExpression,
        operator: operator.slice(0, operator.length - 1),
        left: node.left,
        right: node.right
      }
    };
    node = right;
  }
  return (node);
};

function parseInfix(level, left) {
  if (isBinaryOperator(current)) {
    return (parseBinaryExpression(level, left));
  }
  if (isUnaryPostfixOperator(current)) {
    if (level >= Operators.UNARY_POSTFIX) {
      return (left);
    }
    return (parseUnaryPostfixExpression(left));
  }
  if (peek(TokenList.LPAREN)) {
    return (parseCallExpression(left));
  }
  return (left);
};

function parseExpression(level) {
  if (peek(TokenList.BREAK)) {
    return (parseBreak());
  }
  if (peek(TokenList.CONTINUE)) {
    return (parseContinue());
  }
  let node = parsePrefix();
  while (true) {
    if (!current) break;
    let expr = parseInfix(level, node);
    if (expr === null || expr === node) break;
    node = expr;
  };
  return (node);
};

function parseLiteral() {
  let value = current.value;
  if (current.kind === Token.IDENTIFIER) {
    if ($COMPILER_TEST_MODE) {
      // register $trap as native call
      if (value === "§TRAP") {
        next();
        return ({
          kind: Nodes.RuntimeErrorTrap
        });
      }
    }
    // make sure the identifier can be resolved
    scope.resolve(value);
  }
  let node = {
    kind: Nodes.Literal,
    type: current.kind,
    value: value
  };
  next();
  return (node);
};
