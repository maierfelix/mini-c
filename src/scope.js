"use strict";

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
