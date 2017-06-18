"use strict";

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
  if ($COMPILER_TEST_MODE && cc === 167) return (true);
  return (
    cc >= 65 && cc <= 90 ||
    cc >= 97 && cc <= 122 ||
    cc === 95 ||
    cc === 36
  );
};

function isNumber(cc) {
  return (
    cc >= 48 && cc <= 57
  );
};

function isHex(cc) {
  return (
    isNumber(cc) ||
    (cc >= 97 && cc <= 102)
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
    ch === "=" ||
    ch === "+" ||
    ch === "-" ||
    ch === "%" ||
    ch === "!" ||
    ch === "|" ||
    ch === "&" ||
    ch === "~" ||
    ch === "^" ||
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
    str === ">=" ||
    str === "<=" ||
    str === "!=" ||
    str === "||" ||
    str === "&&" ||
    str === "<<" ||
    str === ">>" ||
    str === "+=" ||
    str === "-=" ||
    str === "*=" ||
    str === "/=" ||
    str === "%=" ||
    str === "^=" ||
    str === "&=" ||
    str === "|=" ||
    str === "^=" ||
    str === "<<=" ||
    str === ">>="
  );
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
  function processOperator(ch, idx, line, column) {
    let second = str.slice(idx + 1, idx + 2);
    let third = str.slice(idx + 2, idx + 3);
    if (second && isOperator(ch + second)) {
      if (third && isOperator(ch + second + third)) {
        next();
        next();
        processToken(tokens, ch + second + third, line, column);
      } else {
        next();
        processToken(tokens, ch + second, line, column);
      }
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
    if (isNumber(cc)) {
      // hexadecimal
      if (str.charAt(ii+1) === "x") {
        let start = ii;
        next();
        while (true) {
          if (!isHex(cc)) {
            ii--;
            column--;
            break;
          }
          next();
          cc = str.charCodeAt(ii);
        };
        let content = str.slice(start, ii+1);
        let token = createToken(Token.HexadecimalLiteral, content, line, column);
        tokens.push(token);
        continue;
      }
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
    if (ch === "/" && str[ii + 1] === "/") {
      // TODO: add support for /* */
      while (true) {
        if (cc === 10) {
          column = 0;
          line++;
          break;
        }
        next();
        cc = str.charCodeAt(ii);
      };
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
      processOperator(ch, ii, line, column);
      continue;
    }
    if (ii >= length) {
      break;
    }
  };
  return (tokens);
};
