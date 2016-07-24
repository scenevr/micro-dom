var test = require('tape');
var dom = require('./index');

test('parse', function (t) {
  var d = new dom.Document();
  d.innerHTML = '<body><p>Hello world</p></body>';

  t.ok(d.documentElement);
  t.equal(1, d.documentElement.childNodes.length);
  t.ok(d.querySelector('body p'));

  t.end();
});

test('replace', function (t) {
  var d = new dom.Document();
  d.innerHTML = '<body><p>Hello world</p></body>';
  d.querySelector('body p').outerHTML = '<h1>beep boop</h1>';
  t.ok(d.querySelector('body h1'));
  t.ok(!d.querySelector('body p'));
  t.end();
});

