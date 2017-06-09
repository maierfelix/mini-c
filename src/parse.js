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
    kind === Operators.MOD_ASS) &&
    !isUnaryPrefixOperator(token)
  );
};

function isAssignmentOperator(kind) {
  return (
    kind === Operators.ASS ||
    kind === Operators.ADD_ASS ||
    kind === Operators.SUB_ASS ||
    kind === Operators.MUL_ASS ||
    kind === Operators.DIV_ASS ||
    kind === Operators.MOD_ASS
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

function parseDeclaration(extern) {
  let node = null;
  expectTypeLiteral();
  const type = current.kind;
  next();
  const isPointer = eat(Operators.MUL);
  expectIdentifier();
  const name = current.value;
  next();
  const token = current.kind;
  if (token === Operators.ASS) {
    node = parseVariableDeclaration(type, name, extern, isPointer);
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
    argument: parseExpression(Operators.LOWEST)
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
    locals: [],
    returns: [],
    parameter: null,
    body: null
  };
  expectScope(node, null); // only allow global functions
  scope.register(name, node);
  node.parameter = parseFunctionParameters();
  if (eat(TokenList.LBRACE)) {
    pushScope(node);
    node.parameter.map((param) => {
      scope.register(param.value, param);
    });
    node.body = parseBlock();
    popScope();
    expect(TokenList.RBRACE);
  }
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
    let isPointer = eat(Operators.MUL);
    expectIdentifier();
    params.push(current);
    let param = params[params.length - 1];
    param.type = type;
    param.kind = Nodes.Parameter;
    param.isParameter = true;
    param.isPointer = isPointer;
    next();
    if (!eat(TokenList.COMMA)) break;
  };
  expect(TokenList.RPAREN);
  return (params);
};

function parseVariableDeclaration(type, name, extern, isPointer) {
  let node = {
    kind: Nodes.VariableDeclaration,
    type: type,
    id: name,
    init: null,
    isPointer
  };
  // only allow export of global variables
  if (!!extern) expectScope(node, null);
  else expectScope(node, Nodes.FunctionDeclaration);
  scope.register(node.id, node);
  expect(Operators.ASS);
  node.init = {
    kind: Nodes.BinaryExpression,
    left: { kind: Nodes.Literal, type: Token.Identifier, value: node.id },
    right: parseExpression(Operators.LOWEST),
    operator: "="
  };
  let fn = lookupFunctionScope(scope).node;
  fn.locals.push(node);
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
    let expr = parseExpression(Operators.LOWEST);
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

function isCastOperator(token) {
  return (token.kind === Operators.CAST);
};

function parseCastExpression(left) {
  let node = {
    kind: Nodes.CastExpression,
    source: left,
    target: null
  };
  next();
  expectTypeLiteral();
  node.target = current;
  next();
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

function parsePrefix() {
  if (isLiteral(current)) {
    return (parseLiteral());
  }
  if (eat(TokenList.LPAREN)) {
    let node = parseExpression(Operators.LOWEST);
    expect(TokenList.RPAREN);
    return (node);
  }
  if (current.kind === Operators.MUL) {
    next();
    expectIdentifier();
    let node = parseLiteral();
    let resolve = scope.resolve(node.value);
    node.isDereference = true;
    resolve.isMemoryLocated = true;
    return (node);
  }
  if (current.kind === Operators.BIN_AND) {
    next();
    expectIdentifier();
    let node = parseLiteral();
    let resolve = scope.resolve(node.value);
    node.isReference = true;
    resolve.isMemoryLocated = true;
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
        operator: operator.charAt(0),
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
    return (parseUnaryPostfixExpression(left));
  }
  if (peek(TokenList.LPAREN)) {
    return (parseCallExpression(left));
  }
  if (isCastOperator(current)) {
    return (parseCastExpression(left));
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
    // make sure the identifier can be resolved
    let resolve = scope.resolve(value);
  }
  let node = {
    kind: Nodes.Literal,
    type: current.kind,
    value: value
  };
  next();
  return (node);
};
