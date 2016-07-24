var htmlparser = require('htmlparser2');
var dom = require('dom-lite');

module.exports = dom;

var document = dom.document;

document.ELEMENT_NODE = 1;
document.TEXT_NODE = 3;
document.COMMENT_NODE = 8;
document.DOCUMENT_NODE = 9;
document.DOCUMENT_TYPE_NODE = 10;
document.DOCUMENT_FRAGMENT_NODE = 11;

var elProto = Object.getPrototypeOf(document.createElement('p'));
var nodeProto = Object.getPrototypeOf(elProto);
var docProto = Object.getPrototypeOf(document);

Object.defineProperty(nodeProto, 'innerHTML', {
  get: getHtml,
  set: setHtml
});

docProto.createElementNS = createElementNS;

function getHtml () {
  return nodeProto.toString.call(this);
}

function setHtml (html) {
  var parser = new htmlparser.Parser(new htmlparser.DomHandler(parsed));
  var self = this;

  parser.write(html);
  parser.end();

  function parsed (err, nodes) {
    if (err) {
      throw err;
    }

    self.childNodes = [];
    addChildren(self, nodes);
  }
}

function addChildren (root, nodes) {
  var attrs;
  var el;
  var j;
  var l2;

  for (var i = 0, l = nodes.length; i < l; ++i) {
    if (nodes[i].type === 'text') {
      el = document.createTextNode(nodes[i].data);
    } else if (nodes[i].type === 'comment') {
      el = document.createComment(nodes[i].data);
    } else if (nodes[i].type === 'tag') {
      el = document.createElement(nodes[i].name.toLowerCase());
      attrs = Object.keys(nodes[i].attribs);

      for (j = 0, l2 = attrs.length; j < l2; ++j) {
        el.setAttribute(attrs[j], nodes[i].attribs[attrs[j]]);
      }

      addChildren(el, nodes[i].children);
    } else if (nodes[i].type === 'script' || nodes[i].type === 'style') {
      el = document.createElement(nodes[i].type);
      attrs = Object.keys(nodes[i].attribs);

      for (j = 0, l2 = attrs.length; j < l2; ++j) {
        el.setAttribute(attrs[j], nodes[i].attribs[attrs[j]]);
      }

      addChildren(el, nodes[i].children);
    } else if (nodes[i].type === 'directive') {
      el = new Directive(nodes[i].data);
    } else {
      continue;
    }

    root.appendChild(el);
  }
}

function createElementNS (ns, tag) {
  return this.createElement(tag);
}

function Directive (data) {
  this.data = data;
}

Directive.prototype = Object.create(nodeProto);
Directive.prototype.toString = function () {
  return '<' + this.data + '>';
};
