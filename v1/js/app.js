(function () {
var commonjsGlobal = typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};



function unwrapExports (x) {
	return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, 'default') ? x['default'] : x;
}

function createCommonjsModule(fn, module) {
	return module = { exports: {} }, fn(module, module.exports), module.exports;
}

var riot_1 = createCommonjsModule(function (module, exports) {
/* Riot v3.7.4, @license MIT */
(function (global, factory) {
	factory(exports);
}(commonjsGlobal, (function (exports) { 'use strict';

var __TAGS_CACHE = [];
var __TAG_IMPL = {};
var YIELD_TAG = 'yield';
var GLOBAL_MIXIN = '__global_mixin';
var ATTRS_PREFIX = 'riot-';
var REF_DIRECTIVES = ['ref', 'data-ref'];
var IS_DIRECTIVE = 'data-is';
var CONDITIONAL_DIRECTIVE = 'if';
var LOOP_DIRECTIVE = 'each';
var LOOP_NO_REORDER_DIRECTIVE = 'no-reorder';
var SHOW_DIRECTIVE = 'show';
var HIDE_DIRECTIVE = 'hide';
var KEY_DIRECTIVE = 'key';
var RIOT_EVENTS_KEY = '__riot-events__';
var T_STRING = 'string';
var T_OBJECT = 'object';
var T_UNDEF  = 'undefined';
var T_FUNCTION = 'function';
var XLINK_NS = 'http://www.w3.org/1999/xlink';
var SVG_NS = 'http://www.w3.org/2000/svg';
var XLINK_REGEX = /^xlink:(\w+)/;
var WIN = typeof window === T_UNDEF ? undefined : window;
var RE_SPECIAL_TAGS = /^(?:t(?:body|head|foot|[rhd])|caption|col(?:group)?|opt(?:ion|group))$/;
var RE_SPECIAL_TAGS_NO_OPTION = /^(?:t(?:body|head|foot|[rhd])|caption|col(?:group)?)$/;
var RE_EVENTS_PREFIX = /^on/;
var RE_HTML_ATTRS = /([-\w]+) ?= ?(?:"([^"]*)|'([^']*)|({[^}]*}))/g;
var CASE_SENSITIVE_ATTRIBUTES = {
    'viewbox': 'viewBox',
    'preserveaspectratio': 'preserveAspectRatio'
  };
var RE_BOOL_ATTRS = /^(?:disabled|checked|readonly|required|allowfullscreen|auto(?:focus|play)|compact|controls|default|formnovalidate|hidden|ismap|itemscope|loop|multiple|muted|no(?:resize|shade|validate|wrap)?|open|reversed|seamless|selected|sortable|truespeed|typemustmatch)$/;
var IE_VERSION = (WIN && WIN.document || {}).documentMode | 0;

/**
 * Shorter and fast way to select multiple nodes in the DOM
 * @param   { String } selector - DOM selector
 * @param   { Object } ctx - DOM node where the targets of our search will is located
 * @returns { Object } dom nodes found
 */
function $$(selector, ctx) {
  return [].slice.call((ctx || document).querySelectorAll(selector))
}

/**
 * Shorter and fast way to select a single node in the DOM
 * @param   { String } selector - unique dom selector
 * @param   { Object } ctx - DOM node where the target of our search will is located
 * @returns { Object } dom node found
 */
function $(selector, ctx) {
  return (ctx || document).querySelector(selector)
}

/**
 * Create a document fragment
 * @returns { Object } document fragment
 */
function createFrag() {
  return document.createDocumentFragment()
}

/**
 * Create a document text node
 * @returns { Object } create a text node to use as placeholder
 */
function createDOMPlaceholder() {
  return document.createTextNode('')
}

/**
 * Check if a DOM node is an svg tag or part of an svg
 * @param   { HTMLElement }  el - node we want to test
 * @returns {Boolean} true if it's an svg node
 */
function isSvg(el) {
  var owner = el.ownerSVGElement;
  return !!owner || owner === null
}

/**
 * Create a generic DOM node
 * @param   { String } name - name of the DOM node we want to create
 * @returns { Object } DOM node just created
 */
function mkEl(name) {
  return name === 'svg' ? document.createElementNS(SVG_NS, name) : document.createElement(name)
}

/**
 * Set the inner html of any DOM node SVGs included
 * @param { Object } container - DOM node where we'll inject new html
 * @param { String } html - html to inject
 * @param { Boolean } isSvg - svg tags should be treated a bit differently
 */
/* istanbul ignore next */
function setInnerHTML(container, html, isSvg) {
  // innerHTML is not supported on svg tags so we neet to treat them differently
  if (isSvg) {
    var node = container.ownerDocument.importNode(
      new DOMParser()
        .parseFromString(("<svg xmlns=\"" + SVG_NS + "\">" + html + "</svg>"), 'application/xml')
        .documentElement,
      true
    );

    container.appendChild(node);
  } else {
    container.innerHTML = html;
  }
}

/**
 * Toggle the visibility of any DOM node
 * @param   { Object }  dom - DOM node we want to hide
 * @param   { Boolean } show - do we want to show it?
 */

function toggleVisibility(dom, show) {
  dom.style.display = show ? '' : 'none';
  dom.hidden = show ? false : true;
}

/**
 * Remove any DOM attribute from a node
 * @param   { Object } dom - DOM node we want to update
 * @param   { String } name - name of the property we want to remove
 */
function remAttr(dom, name) {
  dom.removeAttribute(name);
}

/**
 * Convert a style object to a string
 * @param   { Object } style - style object we need to parse
 * @returns { String } resulting css string
 * @example
 * styleObjectToString({ color: 'red', height: '10px'}) // => 'color: red; height: 10px'
 */
function styleObjectToString(style) {
  return Object.keys(style).reduce(function (acc, prop) {
    return (acc + " " + prop + ": " + (style[prop]) + ";")
  }, '')
}

/**
 * Get the value of any DOM attribute on a node
 * @param   { Object } dom - DOM node we want to parse
 * @param   { String } name - name of the attribute we want to get
 * @returns { String | undefined } name of the node attribute whether it exists
 */
function getAttr(dom, name) {
  return dom.getAttribute(name)
}

/**
 * Set any DOM attribute
 * @param { Object } dom - DOM node we want to update
 * @param { String } name - name of the property we want to set
 * @param { String } val - value of the property we want to set
 */
function setAttr(dom, name, val) {
  var xlink = XLINK_REGEX.exec(name);
  if (xlink && xlink[1])
    { dom.setAttributeNS(XLINK_NS, xlink[1], val); }
  else
    { dom.setAttribute(name, val); }
}

/**
 * Insert safely a tag to fix #1962 #1649
 * @param   { HTMLElement } root - children container
 * @param   { HTMLElement } curr - node to insert
 * @param   { HTMLElement } next - node that should preceed the current node inserted
 */
function safeInsert(root, curr, next) {
  root.insertBefore(curr, next.parentNode && next);
}

/**
 * Minimize risk: only zero or one _space_ between attr & value
 * @param   { String }   html - html string we want to parse
 * @param   { Function } fn - callback function to apply on any attribute found
 */
function walkAttrs(html, fn) {
  if (!html) { return }
  var m;
  while (m = RE_HTML_ATTRS.exec(html))
    { fn(m[1].toLowerCase(), m[2] || m[3] || m[4]); }
}

/**
 * Walk down recursively all the children tags starting dom node
 * @param   { Object }   dom - starting node where we will start the recursion
 * @param   { Function } fn - callback to transform the child node just found
 * @param   { Object }   context - fn can optionally return an object, which is passed to children
 */
function walkNodes(dom, fn, context) {
  if (dom) {
    var res = fn(dom, context);
    var next;
    // stop the recursion
    if (res === false) { return }

    dom = dom.firstChild;

    while (dom) {
      next = dom.nextSibling;
      walkNodes(dom, fn, res);
      dom = next;
    }
  }
}

var dom = Object.freeze({
	$$: $$,
	$: $,
	createFrag: createFrag,
	createDOMPlaceholder: createDOMPlaceholder,
	isSvg: isSvg,
	mkEl: mkEl,
	setInnerHTML: setInnerHTML,
	toggleVisibility: toggleVisibility,
	remAttr: remAttr,
	styleObjectToString: styleObjectToString,
	getAttr: getAttr,
	setAttr: setAttr,
	safeInsert: safeInsert,
	walkAttrs: walkAttrs,
	walkNodes: walkNodes
});

var styleNode;
// Create cache and shortcut to the correct property
var cssTextProp;
var byName = {};
var remainder = [];
var needsInject = false;

// skip the following code on the server
if (WIN) {
  styleNode = ((function () {
    // create a new style element with the correct type
    var newNode = mkEl('style');
    // replace any user node or insert the new one into the head
    var userNode = $('style[type=riot]');

    setAttr(newNode, 'type', 'text/css');
    /* istanbul ignore next */
    if (userNode) {
      if (userNode.id) { newNode.id = userNode.id; }
      userNode.parentNode.replaceChild(newNode, userNode);
    } else { document.head.appendChild(newNode); }

    return newNode
  }))();
  cssTextProp = styleNode.styleSheet;
}

/**
 * Object that will be used to inject and manage the css of every tag instance
 */
var styleManager = {
  styleNode: styleNode,
  /**
   * Save a tag style to be later injected into DOM
   * @param { String } css - css string
   * @param { String } name - if it's passed we will map the css to a tagname
   */
  add: function add(css, name) {
    if (name) { byName[name] = css; }
    else { remainder.push(css); }
    needsInject = true;
  },
  /**
   * Inject all previously saved tag styles into DOM
   * innerHTML seems slow: http://jsperf.com/riot-insert-style
   */
  inject: function inject() {
    if (!WIN || !needsInject) { return }
    needsInject = false;
    var style = Object.keys(byName)
      .map(function (k) { return byName[k]; })
      .concat(remainder).join('\n');
    /* istanbul ignore next */
    if (cssTextProp) { cssTextProp.cssText = style; }
    else { styleNode.innerHTML = style; }
  }
};

/**
 * The riot template engine
 * @version v3.0.8
 */

var skipRegex = (function () { //eslint-disable-line no-unused-vars

  var beforeReChars = '[{(,;:?=|&!^~>%*/';

  var beforeReWords = [
    'case',
    'default',
    'do',
    'else',
    'in',
    'instanceof',
    'prefix',
    'return',
    'typeof',
    'void',
    'yield'
  ];

  var wordsLastChar = beforeReWords.reduce(function (s, w) {
    return s + w.slice(-1)
  }, '');

  var RE_REGEX = /^\/(?=[^*>/])[^[/\\]*(?:(?:\\.|\[(?:\\.|[^\]\\]*)*\])[^[\\/]*)*?\/[gimuy]*/;
  var RE_VN_CHAR = /[$\w]/;

  function prev (code, pos) {
    while (--pos >= 0 && /\s/.test(code[pos])){  }
    return pos
  }

  function _skipRegex (code, start) {

    var re = /.*/g;
    var pos = re.lastIndex = start++;
    var match = re.exec(code)[0].match(RE_REGEX);

    if (match) {
      var next = pos + match[0].length;

      pos = prev(code, pos);
      var c = code[pos];

      if (pos < 0 || ~beforeReChars.indexOf(c)) {
        return next
      }

      if (c === '.') {

        if (code[pos - 1] === '.') {
          start = next;
        }

      } else if (c === '+' || c === '-') {

        if (code[--pos] !== c ||
            (pos = prev(code, pos)) < 0 ||
            !RE_VN_CHAR.test(code[pos])) {
          start = next;
        }

      } else if (~wordsLastChar.indexOf(c)) {

        var end = pos + 1;

        while (--pos >= 0 && RE_VN_CHAR.test(code[pos])){  }
        if (~beforeReWords.indexOf(code.slice(pos + 1, end))) {
          start = next;
        }
      }
    }

    return start
  }

  return _skipRegex

})();

/**
 * riot.util.brackets
 *
 * - `brackets    ` - Returns a string or regex based on its parameter
 * - `brackets.set` - Change the current riot brackets
 *
 * @module
 */

/* global riot */

/* istanbul ignore next */
var brackets = (function (UNDEF) {

  var
    REGLOB = 'g',

    R_MLCOMMS = /\/\*[^*]*\*+(?:[^*\/][^*]*\*+)*\//g,

    R_STRINGS = /"[^"\\]*(?:\\[\S\s][^"\\]*)*"|'[^'\\]*(?:\\[\S\s][^'\\]*)*'|`[^`\\]*(?:\\[\S\s][^`\\]*)*`/g,

    S_QBLOCKS = R_STRINGS.source + '|' +
      /(?:\breturn\s+|(?:[$\w\)\]]|\+\+|--)\s*(\/)(?![*\/]))/.source + '|' +
      /\/(?=[^*\/])[^[\/\\]*(?:(?:\[(?:\\.|[^\]\\]*)*\]|\\.)[^[\/\\]*)*?([^<]\/)[gim]*/.source,

    UNSUPPORTED = RegExp('[\\' + 'x00-\\x1F<>a-zA-Z0-9\'",;\\\\]'),

    NEED_ESCAPE = /(?=[[\]()*+?.^$|])/g,

    S_QBLOCK2 = R_STRINGS.source + '|' + /(\/)(?![*\/])/.source,

    FINDBRACES = {
      '(': RegExp('([()])|'   + S_QBLOCK2, REGLOB),
      '[': RegExp('([[\\]])|' + S_QBLOCK2, REGLOB),
      '{': RegExp('([{}])|'   + S_QBLOCK2, REGLOB)
    },

    DEFAULT = '{ }';

  var _pairs = [
    '{', '}',
    '{', '}',
    /{[^}]*}/,
    /\\([{}])/g,
    /\\({)|{/g,
    RegExp('\\\\(})|([[({])|(})|' + S_QBLOCK2, REGLOB),
    DEFAULT,
    /^\s*{\^?\s*([$\w]+)(?:\s*,\s*(\S+))?\s+in\s+(\S.*)\s*}/,
    /(^|[^\\]){=[\S\s]*?}/
  ];

  var
    cachedBrackets = UNDEF,
    _regex,
    _cache = [],
    _settings;

  function _loopback (re) { return re }

  function _rewrite (re, bp) {
    if (!bp) { bp = _cache; }
    return new RegExp(
      re.source.replace(/{/g, bp[2]).replace(/}/g, bp[3]), re.global ? REGLOB : ''
    )
  }

  function _create (pair) {
    if (pair === DEFAULT) { return _pairs }

    var arr = pair.split(' ');

    if (arr.length !== 2 || UNSUPPORTED.test(pair)) {
      throw new Error('Unsupported brackets "' + pair + '"')
    }
    arr = arr.concat(pair.replace(NEED_ESCAPE, '\\').split(' '));

    arr[4] = _rewrite(arr[1].length > 1 ? /{[\S\s]*?}/ : _pairs[4], arr);
    arr[5] = _rewrite(pair.length > 3 ? /\\({|})/g : _pairs[5], arr);
    arr[6] = _rewrite(_pairs[6], arr);
    arr[7] = RegExp('\\\\(' + arr[3] + ')|([[({])|(' + arr[3] + ')|' + S_QBLOCK2, REGLOB);
    arr[8] = pair;
    return arr
  }

  function _brackets (reOrIdx) {
    return reOrIdx instanceof RegExp ? _regex(reOrIdx) : _cache[reOrIdx]
  }

  _brackets.split = function split (str, tmpl, _bp) {
    // istanbul ignore next: _bp is for the compiler
    if (!_bp) { _bp = _cache; }

    var
      parts = [],
      match,
      isexpr,
      start,
      pos,
      re = _bp[6];

    var qblocks = [];
    var prevStr = '';
    var mark, lastIndex;

    isexpr = start = re.lastIndex = 0;

    while ((match = re.exec(str))) {

      lastIndex = re.lastIndex;
      pos = match.index;

      if (isexpr) {

        if (match[2]) {

          var ch = match[2];
          var rech = FINDBRACES[ch];
          var ix = 1;

          rech.lastIndex = lastIndex;
          while ((match = rech.exec(str))) {
            if (match[1]) {
              if (match[1] === ch) { ++ix; }
              else if (!--ix) { break }
            } else {
              rech.lastIndex = pushQBlock(match.index, rech.lastIndex, match[2]);
            }
          }
          re.lastIndex = ix ? str.length : rech.lastIndex;
          continue
        }

        if (!match[3]) {
          re.lastIndex = pushQBlock(pos, lastIndex, match[4]);
          continue
        }
      }

      if (!match[1]) {
        unescapeStr(str.slice(start, pos));
        start = re.lastIndex;
        re = _bp[6 + (isexpr ^= 1)];
        re.lastIndex = start;
      }
    }

    if (str && start < str.length) {
      unescapeStr(str.slice(start));
    }

    parts.qblocks = qblocks;

    return parts

    function unescapeStr (s) {
      if (prevStr) {
        s = prevStr + s;
        prevStr = '';
      }
      if (tmpl || isexpr) {
        parts.push(s && s.replace(_bp[5], '$1'));
      } else {
        parts.push(s);
      }
    }

    function pushQBlock(_pos, _lastIndex, slash) { //eslint-disable-line
      if (slash) {
        _lastIndex = skipRegex(str, _pos);
      }

      if (tmpl && _lastIndex > _pos + 2) {
        mark = '\u2057' + qblocks.length + '~';
        qblocks.push(str.slice(_pos, _lastIndex));
        prevStr += str.slice(start, _pos) + mark;
        start = _lastIndex;
      }
      return _lastIndex
    }
  };

  _brackets.hasExpr = function hasExpr (str) {
    return _cache[4].test(str)
  };

  _brackets.loopKeys = function loopKeys (expr) {
    var m = expr.match(_cache[9]);

    return m
      ? { key: m[1], pos: m[2], val: _cache[0] + m[3].trim() + _cache[1] }
      : { val: expr.trim() }
  };

  _brackets.array = function array (pair) {
    return pair ? _create(pair) : _cache
  };

  function _reset (pair) {
    if ((pair || (pair = DEFAULT)) !== _cache[8]) {
      _cache = _create(pair);
      _regex = pair === DEFAULT ? _loopback : _rewrite;
      _cache[9] = _regex(_pairs[9]);
    }
    cachedBrackets = pair;
  }

  function _setSettings (o) {
    var b;

    o = o || {};
    b = o.brackets;
    Object.defineProperty(o, 'brackets', {
      set: _reset,
      get: function () { return cachedBrackets },
      enumerable: true
    });
    _settings = o;
    _reset(b);
  }

  Object.defineProperty(_brackets, 'settings', {
    set: _setSettings,
    get: function () { return _settings }
  });

  /* istanbul ignore next: in the browser riot is always in the scope */
  _brackets.settings = typeof riot !== 'undefined' && riot.settings || {};
  _brackets.set = _reset;
  _brackets.skipRegex = skipRegex;

  _brackets.R_STRINGS = R_STRINGS;
  _brackets.R_MLCOMMS = R_MLCOMMS;
  _brackets.S_QBLOCKS = S_QBLOCKS;
  _brackets.S_QBLOCK2 = S_QBLOCK2;

  return _brackets

})();

/**
 * @module tmpl
 *
 * tmpl          - Root function, returns the template value, render with data
 * tmpl.hasExpr  - Test the existence of a expression inside a string
 * tmpl.loopKeys - Get the keys for an 'each' loop (used by `_each`)
 */

/* istanbul ignore next */
var tmpl = (function () {

  var _cache = {};

  function _tmpl (str, data) {
    if (!str) { return str }

    return (_cache[str] || (_cache[str] = _create(str))).call(
      data, _logErr.bind({
        data: data,
        tmpl: str
      })
    )
  }

  _tmpl.hasExpr = brackets.hasExpr;

  _tmpl.loopKeys = brackets.loopKeys;

  // istanbul ignore next
  _tmpl.clearCache = function () { _cache = {}; };

  _tmpl.errorHandler = null;

  function _logErr (err, ctx) {

    err.riotData = {
      tagName: ctx && ctx.__ && ctx.__.tagName,
      _riot_id: ctx && ctx._riot_id  //eslint-disable-line camelcase
    };

    if (_tmpl.errorHandler) { _tmpl.errorHandler(err); }
    else if (
      typeof console !== 'undefined' &&
      typeof console.error === 'function'
    ) {
      console.error(err.message);
      console.log('<%s> %s', err.riotData.tagName || 'Unknown tag', this.tmpl); // eslint-disable-line
      console.log(this.data); // eslint-disable-line
    }
  }

  function _create (str) {
    var expr = _getTmpl(str);

    if (expr.slice(0, 11) !== 'try{return ') { expr = 'return ' + expr; }

    return new Function('E', expr + ';')    // eslint-disable-line no-new-func
  }

  var RE_DQUOTE = /\u2057/g;
  var RE_QBMARK = /\u2057(\d+)~/g;

  function _getTmpl (str) {
    var parts = brackets.split(str.replace(RE_DQUOTE, '"'), 1);
    var qstr = parts.qblocks;
    var expr;

    if (parts.length > 2 || parts[0]) {
      var i, j, list = [];

      for (i = j = 0; i < parts.length; ++i) {

        expr = parts[i];

        if (expr && (expr = i & 1

            ? _parseExpr(expr, 1, qstr)

            : '"' + expr
                .replace(/\\/g, '\\\\')
                .replace(/\r\n?|\n/g, '\\n')
                .replace(/"/g, '\\"') +
              '"'

          )) { list[j++] = expr; }

      }

      expr = j < 2 ? list[0]
           : '[' + list.join(',') + '].join("")';

    } else {

      expr = _parseExpr(parts[1], 0, qstr);
    }

    if (qstr.length) {
      expr = expr.replace(RE_QBMARK, function (_, pos) {
        return qstr[pos]
          .replace(/\r/g, '\\r')
          .replace(/\n/g, '\\n')
      });
    }
    return expr
  }

  var RE_CSNAME = /^(?:(-?[_A-Za-z\xA0-\xFF][-\w\xA0-\xFF]*)|\u2057(\d+)~):/;
  var
    RE_BREND = {
      '(': /[()]/g,
      '[': /[[\]]/g,
      '{': /[{}]/g
    };

  function _parseExpr (expr, asText, qstr) {

    expr = expr
      .replace(/\s+/g, ' ').trim()
      .replace(/\ ?([[\({},?\.:])\ ?/g, '$1');

    if (expr) {
      var
        list = [],
        cnt = 0,
        match;

      while (expr &&
            (match = expr.match(RE_CSNAME)) &&
            !match.index
        ) {
        var
          key,
          jsb,
          re = /,|([[{(])|$/g;

        expr = RegExp.rightContext;
        key  = match[2] ? qstr[match[2]].slice(1, -1).trim().replace(/\s+/g, ' ') : match[1];

        while (jsb = (match = re.exec(expr))[1]) { skipBraces(jsb, re); }

        jsb  = expr.slice(0, match.index);
        expr = RegExp.rightContext;

        list[cnt++] = _wrapExpr(jsb, 1, key);
      }

      expr = !cnt ? _wrapExpr(expr, asText)
           : cnt > 1 ? '[' + list.join(',') + '].join(" ").trim()' : list[0];
    }
    return expr

    function skipBraces (ch, re) {
      var
        mm,
        lv = 1,
        ir = RE_BREND[ch];

      ir.lastIndex = re.lastIndex;
      while (mm = ir.exec(expr)) {
        if (mm[0] === ch) { ++lv; }
        else if (!--lv) { break }
      }
      re.lastIndex = lv ? expr.length : ir.lastIndex;
    }
  }

  // istanbul ignore next: not both
  var // eslint-disable-next-line max-len
    JS_CONTEXT = '"in this?this:' + (typeof window !== 'object' ? 'global' : 'window') + ').',
    JS_VARNAME = /[,{][\$\w]+(?=:)|(^ *|[^$\w\.{])(?!(?:typeof|true|false|null|undefined|in|instanceof|is(?:Finite|NaN)|void|NaN|new|Date|RegExp|Math)(?![$\w]))([$_A-Za-z][$\w]*)/g,
    JS_NOPROPS = /^(?=(\.[$\w]+))\1(?:[^.[(]|$)/;

  function _wrapExpr (expr, asText, key) {
    var tb;

    expr = expr.replace(JS_VARNAME, function (match, p, mvar, pos, s) {
      if (mvar) {
        pos = tb ? 0 : pos + match.length;

        if (mvar !== 'this' && mvar !== 'global' && mvar !== 'window') {
          match = p + '("' + mvar + JS_CONTEXT + mvar;
          if (pos) { tb = (s = s[pos]) === '.' || s === '(' || s === '['; }
        } else if (pos) {
          tb = !JS_NOPROPS.test(s.slice(pos));
        }
      }
      return match
    });

    if (tb) {
      expr = 'try{return ' + expr + '}catch(e){E(e,this)}';
    }

    if (key) {

      expr = (tb
          ? 'function(){' + expr + '}.call(this)' : '(' + expr + ')'
        ) + '?"' + key + '":""';

    } else if (asText) {

      expr = 'function(v){' + (tb
          ? expr.replace('return ', 'v=') : 'v=(' + expr + ')'
        ) + ';return v||v===0?v:""}.call(this)';
    }

    return expr
  }

  _tmpl.version = brackets.version = 'v3.0.8';

  return _tmpl

})();

/* istanbul ignore next */
var observable$1 = function(el) {

  /**
   * Extend the original object or create a new empty one
   * @type { Object }
   */

  el = el || {};

  /**
   * Private variables
   */
  var callbacks = {},
    slice = Array.prototype.slice;

  /**
   * Public Api
   */

  // extend the el object adding the observable methods
  Object.defineProperties(el, {
    /**
     * Listen to the given `event` ands
     * execute the `callback` each time an event is triggered.
     * @param  { String } event - event id
     * @param  { Function } fn - callback function
     * @returns { Object } el
     */
    on: {
      value: function(event, fn) {
        if (typeof fn == 'function')
          { (callbacks[event] = callbacks[event] || []).push(fn); }
        return el
      },
      enumerable: false,
      writable: false,
      configurable: false
    },

    /**
     * Removes the given `event` listeners
     * @param   { String } event - event id
     * @param   { Function } fn - callback function
     * @returns { Object } el
     */
    off: {
      value: function(event, fn) {
        if (event == '*' && !fn) { callbacks = {}; }
        else {
          if (fn) {
            var arr = callbacks[event];
            for (var i = 0, cb; cb = arr && arr[i]; ++i) {
              if (cb == fn) { arr.splice(i--, 1); }
            }
          } else { delete callbacks[event]; }
        }
        return el
      },
      enumerable: false,
      writable: false,
      configurable: false
    },

    /**
     * Listen to the given `event` and
     * execute the `callback` at most once
     * @param   { String } event - event id
     * @param   { Function } fn - callback function
     * @returns { Object } el
     */
    one: {
      value: function(event, fn) {
        function on() {
          el.off(event, on);
          fn.apply(el, arguments);
        }
        return el.on(event, on)
      },
      enumerable: false,
      writable: false,
      configurable: false
    },

    /**
     * Execute all callback functions that listen to
     * the given `event`
     * @param   { String } event - event id
     * @returns { Object } el
     */
    trigger: {
      value: function(event) {
        var arguments$1 = arguments;


        // getting the arguments
        var arglen = arguments.length - 1,
          args = new Array(arglen),
          fns,
          fn,
          i;

        for (i = 0; i < arglen; i++) {
          args[i] = arguments$1[i + 1]; // skip first argument
        }

        fns = slice.call(callbacks[event] || [], 0);

        for (i = 0; fn = fns[i]; ++i) {
          fn.apply(el, args);
        }

        if (callbacks['*'] && event != '*')
          { el.trigger.apply(el, ['*', event].concat(args)); }

        return el
      },
      enumerable: false,
      writable: false,
      configurable: false
    }
  });

  return el

};

/**
 * Check if the passed argument is a boolean attribute
 * @param   { String } value -
 * @returns { Boolean } -
 */
function isBoolAttr(value) {
  return RE_BOOL_ATTRS.test(value)
}

/**
 * Check if passed argument is a function
 * @param   { * } value -
 * @returns { Boolean } -
 */
function isFunction(value) {
  return typeof value === T_FUNCTION
}

/**
 * Check if passed argument is an object, exclude null
 * NOTE: use isObject(x) && !isArray(x) to excludes arrays.
 * @param   { * } value -
 * @returns { Boolean } -
 */
function isObject(value) {
  return value && typeof value === T_OBJECT // typeof null is 'object'
}

/**
 * Check if passed argument is undefined
 * @param   { * } value -
 * @returns { Boolean } -
 */
function isUndefined(value) {
  return typeof value === T_UNDEF
}

/**
 * Check if passed argument is a string
 * @param   { * } value -
 * @returns { Boolean } -
 */
function isString(value) {
  return typeof value === T_STRING
}

/**
 * Check if passed argument is empty. Different from falsy, because we dont consider 0 or false to be blank
 * @param { * } value -
 * @returns { Boolean } -
 */
function isBlank(value) {
  return isNil(value) || value === ''
}

/**
 * Check against the null and undefined values
 * @param   { * }  value -
 * @returns {Boolean} -
 */
function isNil(value) {
  return isUndefined(value) || value === null
}

/**
 * Check if passed argument is a kind of array
 * @param   { * } value -
 * @returns { Boolean } -
 */
function isArray(value) {
  return Array.isArray(value) || value instanceof Array
}

/**
 * Check whether object's property could be overridden
 * @param   { Object }  obj - source object
 * @param   { String }  key - object property
 * @returns { Boolean } true if writable
 */
function isWritable(obj, key) {
  var descriptor = getPropDescriptor(obj, key);
  return isUndefined(obj[key]) || descriptor && descriptor.writable
}


var check = Object.freeze({
	isBoolAttr: isBoolAttr,
	isFunction: isFunction,
	isObject: isObject,
	isUndefined: isUndefined,
	isString: isString,
	isBlank: isBlank,
	isNil: isNil,
	isArray: isArray,
	isWritable: isWritable
});

/**
 * Specialized function for looping an array-like collection with `each={}`
 * @param   { Array } list - collection of items
 * @param   {Function} fn - callback function
 * @returns { Array } the array looped
 */
function each(list, fn) {
  var len = list ? list.length : 0;
  var i = 0;
  for (; i < len; i++) { fn(list[i], i); }
  return list
}

/**
 * Check whether an array contains an item
 * @param   { Array } array - target array
 * @param   { * } item - item to test
 * @returns { Boolean } -
 */
function contains(array, item) {
  return array.indexOf(item) !== -1
}

/**
 * Convert a string containing dashes to camel case
 * @param   { String } str - input string
 * @returns { String } my-string -> myString
 */
function toCamel(str) {
  return str.replace(/-(\w)/g, function (_, c) { return c.toUpperCase(); })
}

/**
 * Faster String startsWith alternative
 * @param   { String } str - source string
 * @param   { String } value - test string
 * @returns { Boolean } -
 */
function startsWith(str, value) {
  return str.slice(0, value.length) === value
}

/**
 * Helper function to set an immutable property
 * @param   { Object } el - object where the new property will be set
 * @param   { String } key - object key where the new property will be stored
 * @param   { * } value - value of the new property
 * @param   { Object } options - set the propery overriding the default options
 * @returns { Object } - the initial object
 */
function defineProperty(el, key, value, options) {
  Object.defineProperty(el, key, extend({
    value: value,
    enumerable: false,
    writable: false,
    configurable: true
  }, options));
  return el
}

/**
 * Function returning always a unique identifier
 * @returns { Number } - number from 0...n
 */
var uid = (function() {
  var i = -1;
  return function () { return ++i; }
})();

/**
 * Short alias for Object.getOwnPropertyDescriptor
 */
var getPropDescriptor = function (o, k) { return Object.getOwnPropertyDescriptor(o, k); };

/**
 * Extend any object with other properties
 * @param   { Object } src - source object
 * @returns { Object } the resulting extended object
 *
 * var obj = { foo: 'baz' }
 * extend(obj, {bar: 'bar', foo: 'bar'})
 * console.log(obj) => {bar: 'bar', foo: 'bar'}
 *
 */
function extend(src) {
  var obj;
  var i = 1;
  var args = arguments;
  var l = args.length;

  for (; i < l; i++) {
    if (obj = args[i]) {
      for (var key in obj) {
        // check if this property of the source object could be overridden
        if (isWritable(src, key))
          { src[key] = obj[key]; }
      }
    }
  }
  return src
}

var misc = Object.freeze({
	each: each,
	contains: contains,
	toCamel: toCamel,
	startsWith: startsWith,
	defineProperty: defineProperty,
	uid: uid,
	getPropDescriptor: getPropDescriptor,
	extend: extend
});

var settings$1 = extend(Object.create(brackets.settings), {
  skipAnonymousTags: true,
  // handle the auto updates on any DOM event
  autoUpdate: true
});

/**
 * Trigger DOM events
 * @param   { HTMLElement } dom - dom element target of the event
 * @param   { Function } handler - user function
 * @param   { Object } e - event object
 */
function handleEvent(dom, handler, e) {
  var ptag = this.__.parent;
  var item = this.__.item;

  if (!item)
    { while (ptag && !item) {
      item = ptag.__.item;
      ptag = ptag.__.parent;
    } }

  // override the event properties
  /* istanbul ignore next */
  if (isWritable(e, 'currentTarget')) { e.currentTarget = dom; }
  /* istanbul ignore next */
  if (isWritable(e, 'target')) { e.target = e.srcElement; }
  /* istanbul ignore next */
  if (isWritable(e, 'which')) { e.which = e.charCode || e.keyCode; }

  e.item = item;

  handler.call(this, e);

  // avoid auto updates
  if (!settings$1.autoUpdate) { return }

  if (!e.preventUpdate) {
    var p = getImmediateCustomParentTag(this);
    // fixes #2083
    if (p.isMounted) { p.update(); }
  }
}

/**
 * Attach an event to a DOM node
 * @param { String } name - event name
 * @param { Function } handler - event callback
 * @param { Object } dom - dom node
 * @param { Tag } tag - tag instance
 */
function setEventHandler(name, handler, dom, tag) {
  var eventName;
  var cb = handleEvent.bind(tag, dom, handler);

  // avoid to bind twice the same event
  // possible fix for #2332
  dom[name] = null;

  // normalize event name
  eventName = name.replace(RE_EVENTS_PREFIX, '');

  // cache the listener into the listeners array
  if (!contains(tag.__.listeners, dom)) { tag.__.listeners.push(dom); }
  if (!dom[RIOT_EVENTS_KEY]) { dom[RIOT_EVENTS_KEY] = {}; }
  if (dom[RIOT_EVENTS_KEY][name]) { dom.removeEventListener(eventName, dom[RIOT_EVENTS_KEY][name]); }

  dom[RIOT_EVENTS_KEY][name] = cb;
  dom.addEventListener(eventName, cb, false);
}

/**
 * Update dynamically created data-is tags with changing expressions
 * @param { Object } expr - expression tag and expression info
 * @param { Tag }    parent - parent for tag creation
 * @param { String } tagName - tag implementation we want to use
 */
function updateDataIs(expr, parent, tagName) {
  var tag = expr.tag || expr.dom._tag;
  var ref;

  var ref$1 = tag ? tag.__ : {};
  var head = ref$1.head;
  var isVirtual = expr.dom.tagName === 'VIRTUAL';

  if (tag && expr.tagName === tagName) {
    tag.update();
    return
  }

  // sync _parent to accommodate changing tagnames
  if (tag) {
    // need placeholder before unmount
    if(isVirtual) {
      ref = createDOMPlaceholder();
      head.parentNode.insertBefore(ref, head);
    }

    tag.unmount(true);
  }

  // unable to get the tag name
  if (!isString(tagName)) { return }

  expr.impl = __TAG_IMPL[tagName];

  // unknown implementation
  if (!expr.impl) { return }

  expr.tag = tag = initChildTag(
    expr.impl, {
      root: expr.dom,
      parent: parent,
      tagName: tagName
    },
    expr.dom.innerHTML,
    parent
  );

  each(expr.attrs, function (a) { return setAttr(tag.root, a.name, a.value); });
  expr.tagName = tagName;
  tag.mount();

  // root exist first time, after use placeholder
  if (isVirtual) { makeReplaceVirtual(tag, ref || tag.root); }

  // parent is the placeholder tag, not the dynamic tag so clean up
  parent.__.onUnmount = function () {
    var delName = tag.opts.dataIs;
    arrayishRemove(tag.parent.tags, delName, tag);
    arrayishRemove(tag.__.parent.tags, delName, tag);
    tag.unmount();
  };
}

/**
 * Nomalize any attribute removing the "riot-" prefix
 * @param   { String } attrName - original attribute name
 * @returns { String } valid html attribute name
 */
function normalizeAttrName(attrName) {
  if (!attrName) { return null }
  attrName = attrName.replace(ATTRS_PREFIX, '');
  if (CASE_SENSITIVE_ATTRIBUTES[attrName]) { attrName = CASE_SENSITIVE_ATTRIBUTES[attrName]; }
  return attrName
}

/**
 * Update on single tag expression
 * @this Tag
 * @param { Object } expr - expression logic
 * @returns { undefined }
 */
function updateExpression(expr) {
  if (this.root && getAttr(this.root,'virtualized')) { return }

  var dom = expr.dom;
  // remove the riot- prefix
  var attrName = normalizeAttrName(expr.attr);
  var isToggle = contains([SHOW_DIRECTIVE, HIDE_DIRECTIVE], attrName);
  var isVirtual = expr.root && expr.root.tagName === 'VIRTUAL';
  var ref = this.__;
  var isAnonymous = ref.isAnonymous;
  var parent = dom && (expr.parent || dom.parentNode);
  // detect the style attributes
  var isStyleAttr = attrName === 'style';
  var isClassAttr = attrName === 'class';

  var value;

  // if it's a tag we could totally skip the rest
  if (expr._riot_id) {
    if (expr.__.wasCreated) {
      expr.update();
    // if it hasn't been mounted yet, do that now.
    } else {
      expr.mount();
      if (isVirtual) {
        makeReplaceVirtual(expr, expr.root);
      }
    }
    return
  }

  // if this expression has the update method it means it can handle the DOM changes by itself
  if (expr.update) { return expr.update() }

  var context = isToggle && !isAnonymous ? inheritParentProps.call(this) : this;

  // ...it seems to be a simple expression so we try to calculate its value
  value = tmpl(expr.expr, context);

  var hasValue = !isBlank(value);
  var isObj = isObject(value);

  // convert the style/class objects to strings
  if (isObj) {
    if (isClassAttr) {
      value = tmpl(JSON.stringify(value), this);
    } else if (isStyleAttr) {
      value = styleObjectToString(value);
    }
  }

  // remove original attribute
  if (expr.attr && (!expr.wasParsedOnce || !hasValue || value === false)) {
    // remove either riot-* attributes or just the attribute name
    remAttr(dom, getAttr(dom, expr.attr) ? expr.attr : attrName);
  }

  // for the boolean attributes we don't need the value
  // we can convert it to checked=true to checked=checked
  if (expr.bool) { value = value ? attrName : false; }
  if (expr.isRtag) { return updateDataIs(expr, this, value) }
  if (expr.wasParsedOnce && expr.value === value) { return }

  // update the expression value
  expr.value = value;
  expr.wasParsedOnce = true;

  // if the value is an object (and it's not a style or class attribute) we can not do much more with it
  if (isObj && !isClassAttr && !isStyleAttr && !isToggle) { return }
  // avoid to render undefined/null values
  if (!hasValue) { value = ''; }

  // textarea and text nodes have no attribute name
  if (!attrName) {
    // about #815 w/o replace: the browser converts the value to a string,
    // the comparison by "==" does too, but not in the server
    value += '';
    // test for parent avoids error with invalid assignment to nodeValue
    if (parent) {
      // cache the parent node because somehow it will become null on IE
      // on the next iteration
      expr.parent = parent;
      if (parent.tagName === 'TEXTAREA') {
        parent.value = value;                    // #1113
        if (!IE_VERSION) { dom.nodeValue = value; }  // #1625 IE throws here, nodeValue
      }                                         // will be available on 'updated'
      else { dom.nodeValue = value; }
    }
    return
  }


  // event handler
  if (isFunction(value)) {
    setEventHandler(attrName, value, dom, this);
  // show / hide
  } else if (isToggle) {
    toggleVisibility(dom, attrName === HIDE_DIRECTIVE ? !value : value);
  // handle attributes
  } else {
    if (expr.bool) {
      dom[attrName] = value;
    }

    if (attrName === 'value' && dom.value !== value) {
      dom.value = value;
    } else if (hasValue && value !== false) {
      setAttr(dom, attrName, value);
    }

    // make sure that in case of style changes
    // the element stays hidden
    if (isStyleAttr && dom.hidden) { toggleVisibility(dom, false); }
  }
}

/**
 * Update all the expressions in a Tag instance
 * @this Tag
 * @param { Array } expressions - expression that must be re evaluated
 */
function updateAllExpressions(expressions) {
  each(expressions, updateExpression.bind(this));
}

var IfExpr = {
  init: function init(dom, tag, expr) {
    remAttr(dom, CONDITIONAL_DIRECTIVE);
    this.tag = tag;
    this.expr = expr;
    this.stub = createDOMPlaceholder();
    this.pristine = dom;

    var p = dom.parentNode;
    p.insertBefore(this.stub, dom);
    p.removeChild(dom);

    return this
  },
  update: function update() {
    this.value = tmpl(this.expr, this.tag);

    if (this.value && !this.current) { // insert
      this.current = this.pristine.cloneNode(true);
      this.stub.parentNode.insertBefore(this.current, this.stub);
      this.expressions = parseExpressions.apply(this.tag, [this.current, true]);
    } else if (!this.value && this.current) { // remove
      unmountAll(this.expressions);
      if (this.current._tag) {
        this.current._tag.unmount();
      } else if (this.current.parentNode) {
        this.current.parentNode.removeChild(this.current);
      }
      this.current = null;
      this.expressions = [];
    }

    if (this.value) { updateAllExpressions.call(this.tag, this.expressions); }
  },
  unmount: function unmount() {
    unmountAll(this.expressions || []);
  }
};

var RefExpr = {
  init: function init(dom, parent, attrName, attrValue) {
    this.dom = dom;
    this.attr = attrName;
    this.rawValue = attrValue;
    this.parent = parent;
    this.hasExp = tmpl.hasExpr(attrValue);
    return this
  },
  update: function update() {
    var old = this.value;
    var customParent = this.parent && getImmediateCustomParentTag(this.parent);
    // if the referenced element is a custom tag, then we set the tag itself, rather than DOM
    var tagOrDom = this.dom.__ref || this.tag || this.dom;

    this.value = this.hasExp ? tmpl(this.rawValue, this.parent) : this.rawValue;

    // the name changed, so we need to remove it from the old key (if present)
    if (!isBlank(old) && customParent) { arrayishRemove(customParent.refs, old, tagOrDom); }
    if (!isBlank(this.value) && isString(this.value)) {
      // add it to the refs of parent tag (this behavior was changed >=3.0)
      if (customParent) { arrayishAdd(
        customParent.refs,
        this.value,
        tagOrDom,
        // use an array if it's a looped node and the ref is not an expression
        null,
        this.parent.__.index
      ); }

      if (this.value !== old) {
        setAttr(this.dom, this.attr, this.value);
      }
    } else {
      remAttr(this.dom, this.attr);
    }

    // cache the ref bound to this dom node
    // to reuse it in future (see also #2329)
    if (!this.dom.__ref) { this.dom.__ref = tagOrDom; }
  },
  unmount: function unmount() {
    var tagOrDom = this.tag || this.dom;
    var customParent = this.parent && getImmediateCustomParentTag(this.parent);
    if (!isBlank(this.value) && customParent)
      { arrayishRemove(customParent.refs, this.value, tagOrDom); }
  }
};

/**
 * Convert the item looped into an object used to extend the child tag properties
 * @param   { Object } expr - object containing the keys used to extend the children tags
 * @param   { * } key - value to assign to the new object returned
 * @param   { * } val - value containing the position of the item in the array
 * @param   { Object } base - prototype object for the new item
 * @returns { Object } - new object containing the values of the original item
 *
 * The variables 'key' and 'val' are arbitrary.
 * They depend on the collection type looped (Array, Object)
 * and on the expression used on the each tag
 *
 */
function mkitem(expr, key, val, base) {
  var item = base ? Object.create(base) : {};
  item[expr.key] = key;
  if (expr.pos) { item[expr.pos] = val; }
  return item
}

/**
 * Unmount the redundant tags
 * @param   { Array } items - array containing the current items to loop
 * @param   { Array } tags - array containing all the children tags
 */
function unmountRedundant(items, tags) {
  var i = tags.length;
  var j = items.length;

  while (i > j) {
    i--;
    remove.apply(tags[i], [tags, i]);
  }
}


/**
 * Remove a child tag
 * @this Tag
 * @param   { Array } tags - tags collection
 * @param   { Number } i - index of the tag to remove
 */
function remove(tags, i) {
  tags.splice(i, 1);
  this.unmount();
  arrayishRemove(this.parent, this, this.__.tagName, true);
}

/**
 * Move the nested custom tags in non custom loop tags
 * @this Tag
 * @param   { Number } i - current position of the loop tag
 */
function moveNestedTags(i) {
  var this$1 = this;

  each(Object.keys(this.tags), function (tagName) {
    moveChildTag.apply(this$1.tags[tagName], [tagName, i]);
  });
}

/**
 * Move a child tag
 * @this Tag
 * @param   { HTMLElement } root - dom node containing all the loop children
 * @param   { Tag } nextTag - instance of the next tag preceding the one we want to move
 * @param   { Boolean } isVirtual - is it a virtual tag?
 */
function move(root, nextTag, isVirtual) {
  if (isVirtual)
    { moveVirtual.apply(this, [root, nextTag]); }
  else
    { safeInsert(root, this.root, nextTag.root); }
}

/**
 * Insert and mount a child tag
 * @this Tag
 * @param   { HTMLElement } root - dom node containing all the loop children
 * @param   { Tag } nextTag - instance of the next tag preceding the one we want to insert
 * @param   { Boolean } isVirtual - is it a virtual tag?
 */
function insert(root, nextTag, isVirtual) {
  if (isVirtual)
    { makeVirtual.apply(this, [root, nextTag]); }
  else
    { safeInsert(root, this.root, nextTag.root); }
}

/**
 * Append a new tag into the DOM
 * @this Tag
 * @param   { HTMLElement } root - dom node containing all the loop children
 * @param   { Boolean } isVirtual - is it a virtual tag?
 */
function append(root, isVirtual) {
  if (isVirtual)
    { makeVirtual.call(this, root); }
  else
    { root.appendChild(this.root); }
}

/**
 * Return the value we want to use to lookup the postion of our items in the collection
 * @param   { String }  keyAttr         - lookup string or expression
 * @param   { * }       originalItem    - original item from the collection
 * @param   { Object }  keyedItem       - object created by riot via { item, i in collection }
 * @param   { Boolean } hasKeyAttrExpr  - flag to check whether the key is an expression
 * @returns { * } value that we will use to figure out the item position via collection.indexOf
 */
function getItemId(keyAttr, originalItem, keyedItem, hasKeyAttrExpr) {
  if (keyAttr) {
    return hasKeyAttrExpr ?  tmpl(keyAttr, keyedItem) :  originalItem[keyAttr]
  }

  return originalItem
}

/**
 * Manage tags having the 'each'
 * @param   { HTMLElement } dom - DOM node we need to loop
 * @param   { Tag } parent - parent tag instance where the dom node is contained
 * @param   { String } expr - string contained in the 'each' attribute
 * @returns { Object } expression object for this each loop
 */
function _each(dom, parent, expr) {
  var mustReorder = typeof getAttr(dom, LOOP_NO_REORDER_DIRECTIVE) !== T_STRING || remAttr(dom, LOOP_NO_REORDER_DIRECTIVE);
  var keyAttr = getAttr(dom, KEY_DIRECTIVE);
  var hasKeyAttrExpr = keyAttr ? tmpl.hasExpr(keyAttr) : false;
  var tagName = getTagName(dom);
  var impl = __TAG_IMPL[tagName];
  var parentNode = dom.parentNode;
  var placeholder = createDOMPlaceholder();
  var child = getTag(dom);
  var ifExpr = getAttr(dom, CONDITIONAL_DIRECTIVE);
  var tags = [];
  var isLoop = true;
  var innerHTML = dom.innerHTML;
  var isAnonymous = !__TAG_IMPL[tagName];
  var isVirtual = dom.tagName === 'VIRTUAL';
  var oldItems = [];
  var hasKeys;

  // remove the each property from the original tag
  remAttr(dom, LOOP_DIRECTIVE);
  remAttr(dom, KEY_DIRECTIVE);

  // parse the each expression
  expr = tmpl.loopKeys(expr);
  expr.isLoop = true;

  if (ifExpr) { remAttr(dom, CONDITIONAL_DIRECTIVE); }

  // insert a marked where the loop tags will be injected
  parentNode.insertBefore(placeholder, dom);
  parentNode.removeChild(dom);

  expr.update = function updateEach() {
    // get the new items collection
    expr.value = tmpl(expr.val, parent);

    var items = expr.value;
    var frag = createFrag();
    var isObject$$1 = !isArray(items) && !isString(items);
    var root = placeholder.parentNode;
    var tmpItems = [];

    // if this DOM was removed the update here is useless
    // this condition fixes also a weird async issue on IE in our unit test
    if (!root) { return }

    // object loop. any changes cause full redraw
    if (isObject$$1) {
      hasKeys = items || false;
      items = hasKeys ?
        Object.keys(items).map(function (key) { return mkitem(expr, items[key], key); }) : [];
    } else {
      hasKeys = false;
    }

    if (ifExpr) {
      items = items.filter(function (item, i) {
        if (expr.key && !isObject$$1)
          { return !!tmpl(ifExpr, mkitem(expr, item, i, parent)) }

        return !!tmpl(ifExpr, extend(Object.create(parent), item))
      });
    }

    // loop all the new items
    each(items, function (_item, i) {
      var item = !hasKeys && expr.key ? mkitem(expr, _item, i) : _item;
      var itemId = getItemId(keyAttr, _item, item, hasKeyAttrExpr);
      // reorder only if the items are objects
      var doReorder = mustReorder && typeof _item === T_OBJECT && !hasKeys;
      var oldPos = oldItems.indexOf(itemId);
      var isNew = oldPos === -1;
      var pos = !isNew && doReorder ? oldPos : i;
      // does a tag exist in this position?
      var tag = tags[pos];
      var mustAppend = i >= oldItems.length;
      var mustCreate =  doReorder && isNew || !doReorder && !tag;

      // new tag
      if (mustCreate) {
        tag = createTag(impl, {
          parent: parent,
          isLoop: isLoop,
          isAnonymous: isAnonymous,
          tagName: tagName,
          root: dom.cloneNode(isAnonymous),
          item: item,
          index: i,
        }, innerHTML);

        // mount the tag
        tag.mount();

        if (mustAppend)
          { append.apply(tag, [frag || root, isVirtual]); }
        else
          { insert.apply(tag, [root, tags[i], isVirtual]); }

        if (!mustAppend) { oldItems.splice(i, 0, item); }
        tags.splice(i, 0, tag);
        if (child) { arrayishAdd(parent.tags, tagName, tag, true); }
      } else if (pos !== i && doReorder) {
        // move
        if (keyAttr || contains(items, oldItems[pos])) {
          move.apply(tag, [root, tags[i], isVirtual]);
          // move the old tag instance
          tags.splice(i, 0, tags.splice(pos, 1)[0]);
          // move the old item
          oldItems.splice(i, 0, oldItems.splice(pos, 1)[0]);
        }

        // update the position attribute if it exists
        if (expr.pos) { tag[expr.pos] = i; }

        // if the loop tags are not custom
        // we need to move all their custom tags into the right position
        if (!child && tag.tags) { moveNestedTags.call(tag, i); }
      }

      // cache the original item to use it in the events bound to this node
      // and its children
      tag.__.item = item;
      tag.__.index = i;
      tag.__.parent = parent;

      tmpItems[i] = itemId;

      if (!mustCreate) { tag.update(item); }
    });

    // remove the redundant tags
    unmountRedundant(items, tags);

    // clone the items array
    oldItems = tmpItems.slice();

    root.insertBefore(frag, placeholder);
  };

  expr.unmount = function () {
    each(tags, function (t) { t.unmount(); });
  };

  return expr
}

/**
 * Walk the tag DOM to detect the expressions to evaluate
 * @this Tag
 * @param   { HTMLElement } root - root tag where we will start digging the expressions
 * @param   { Boolean } mustIncludeRoot - flag to decide whether the root must be parsed as well
 * @returns { Array } all the expressions found
 */
function parseExpressions(root, mustIncludeRoot) {
  var this$1 = this;

  var expressions = [];

  walkNodes(root, function (dom) {
    var type = dom.nodeType;
    var attr;
    var tagImpl;

    if (!mustIncludeRoot && dom === root) { return }

    // text node
    if (type === 3 && dom.parentNode.tagName !== 'STYLE' && tmpl.hasExpr(dom.nodeValue))
      { expressions.push({dom: dom, expr: dom.nodeValue}); }

    if (type !== 1) { return }

    var isVirtual = dom.tagName === 'VIRTUAL';

    // loop. each does it's own thing (for now)
    if (attr = getAttr(dom, LOOP_DIRECTIVE)) {
      if(isVirtual) { setAttr(dom, 'loopVirtual', true); } // ignore here, handled in _each
      expressions.push(_each(dom, this$1, attr));
      return false
    }

    // if-attrs become the new parent. Any following expressions (either on the current
    // element, or below it) become children of this expression.
    if (attr = getAttr(dom, CONDITIONAL_DIRECTIVE)) {
      expressions.push(Object.create(IfExpr).init(dom, this$1, attr));
      return false
    }

    if (attr = getAttr(dom, IS_DIRECTIVE)) {
      if (tmpl.hasExpr(attr)) {
        expressions.push({
          isRtag: true,
          expr: attr,
          dom: dom,
          attrs: [].slice.call(dom.attributes)
        });

        return false
      }
    }

    // if this is a tag, stop traversing here.
    // we ignore the root, since parseExpressions is called while we're mounting that root
    tagImpl = getTag(dom);

    if(isVirtual) {
      if(getAttr(dom, 'virtualized')) {dom.parentElement.removeChild(dom); } // tag created, remove from dom
      if(!tagImpl && !getAttr(dom, 'virtualized') && !getAttr(dom, 'loopVirtual'))  // ok to create virtual tag
        { tagImpl = { tmpl: dom.outerHTML }; }
    }

    if (tagImpl && (dom !== root || mustIncludeRoot)) {
      if(isVirtual && !getAttr(dom, IS_DIRECTIVE)) { // handled in update
        // can not remove attribute like directives
        // so flag for removal after creation to prevent maximum stack error
        setAttr(dom, 'virtualized', true);
        var tag = createTag(
          {tmpl: dom.outerHTML},
          {root: dom, parent: this$1},
          dom.innerHTML
        );

        expressions.push(tag); // no return, anonymous tag, keep parsing
      } else {
        expressions.push(
          initChildTag(
            tagImpl,
            {
              root: dom,
              parent: this$1
            },
            dom.innerHTML,
            this$1
          )
        );
        return false
      }
    }

    // attribute expressions
    parseAttributes.apply(this$1, [dom, dom.attributes, function (attr, expr) {
      if (!expr) { return }
      expressions.push(expr);
    }]);
  });

  return expressions
}

/**
 * Calls `fn` for every attribute on an element. If that attr has an expression,
 * it is also passed to fn.
 * @this Tag
 * @param   { HTMLElement } dom - dom node to parse
 * @param   { Array } attrs - array of attributes
 * @param   { Function } fn - callback to exec on any iteration
 */
function parseAttributes(dom, attrs, fn) {
  var this$1 = this;

  each(attrs, function (attr) {
    if (!attr) { return false }

    var name = attr.name;
    var bool = isBoolAttr(name);
    var expr;

    if (contains(REF_DIRECTIVES, name) && dom.tagName.toLowerCase() !== YIELD_TAG) {
      expr =  Object.create(RefExpr).init(dom, this$1, name, attr.value);
    } else if (tmpl.hasExpr(attr.value)) {
      expr = {dom: dom, expr: attr.value, attr: name, bool: bool};
    }

    fn(attr, expr);
  });
}

/*
  Includes hacks needed for the Internet Explorer version 9 and below
  See: http://kangax.github.io/compat-table/es5/#ie8
       http://codeplanet.io/dropping-ie8/
*/

var reHasYield  = /<yield\b/i;
var reYieldAll  = /<yield\s*(?:\/>|>([\S\s]*?)<\/yield\s*>|>)/ig;
var reYieldSrc  = /<yield\s+to=['"]([^'">]*)['"]\s*>([\S\s]*?)<\/yield\s*>/ig;
var reYieldDest = /<yield\s+from=['"]?([-\w]+)['"]?\s*(?:\/>|>([\S\s]*?)<\/yield\s*>)/ig;
var rootEls = { tr: 'tbody', th: 'tr', td: 'tr', col: 'colgroup' };
var tblTags = IE_VERSION && IE_VERSION < 10 ? RE_SPECIAL_TAGS : RE_SPECIAL_TAGS_NO_OPTION;
var GENERIC = 'div';
var SVG = 'svg';


/*
  Creates the root element for table or select child elements:
  tr/th/td/thead/tfoot/tbody/caption/col/colgroup/option/optgroup
*/
function specialTags(el, tmpl, tagName) {

  var
    select = tagName[0] === 'o',
    parent = select ? 'select>' : 'table>';

  // trim() is important here, this ensures we don't have artifacts,
  // so we can check if we have only one element inside the parent
  el.innerHTML = '<' + parent + tmpl.trim() + '</' + parent;
  parent = el.firstChild;

  // returns the immediate parent if tr/th/td/col is the only element, if not
  // returns the whole tree, as this can include additional elements
  /* istanbul ignore next */
  if (select) {
    parent.selectedIndex = -1;  // for IE9, compatible w/current riot behavior
  } else {
    // avoids insertion of cointainer inside container (ex: tbody inside tbody)
    var tname = rootEls[tagName];
    if (tname && parent.childElementCount === 1) { parent = $(tname, parent); }
  }
  return parent
}

/*
  Replace the yield tag from any tag template with the innerHTML of the
  original tag in the page
*/
function replaceYield(tmpl, html) {
  // do nothing if no yield
  if (!reHasYield.test(tmpl)) { return tmpl }

  // be careful with #1343 - string on the source having `$1`
  var src = {};

  html = html && html.replace(reYieldSrc, function (_, ref, text) {
    src[ref] = src[ref] || text;   // preserve first definition
    return ''
  }).trim();

  return tmpl
    .replace(reYieldDest, function (_, ref, def) {  // yield with from - to attrs
      return src[ref] || def || ''
    })
    .replace(reYieldAll, function (_, def) {        // yield without any "from"
      return html || def || ''
    })
}

/**
 * Creates a DOM element to wrap the given content. Normally an `DIV`, but can be
 * also a `TABLE`, `SELECT`, `TBODY`, `TR`, or `COLGROUP` element.
 *
 * @param   { String } tmpl  - The template coming from the custom tag definition
 * @param   { String } html - HTML content that comes from the DOM element where you
 *           will mount the tag, mostly the original tag in the page
 * @param   { Boolean } isSvg - true if the root node is an svg
 * @returns { HTMLElement } DOM element with _tmpl_ merged through `YIELD` with the _html_.
 */
function mkdom(tmpl, html, isSvg$$1) {
  var match   = tmpl && tmpl.match(/^\s*<([-\w]+)/);
  var  tagName = match && match[1].toLowerCase();
  var el = mkEl(isSvg$$1 ? SVG : GENERIC);

  // replace all the yield tags with the tag inner html
  tmpl = replaceYield(tmpl, html);

  /* istanbul ignore next */
  if (tblTags.test(tagName))
    { el = specialTags(el, tmpl, tagName); }
  else
    { setInnerHTML(el, tmpl, isSvg$$1); }

  return el
}

/**
 * Another way to create a riot tag a bit more es6 friendly
 * @param { HTMLElement } el - tag DOM selector or DOM node/s
 * @param { Object } opts - tag logic
 * @returns { Tag } new riot tag instance
 */
function Tag$1(el, opts) {
  // get the tag properties from the class constructor
  var ref = this;
  var name = ref.name;
  var tmpl = ref.tmpl;
  var css = ref.css;
  var attrs = ref.attrs;
  var onCreate = ref.onCreate;
  // register a new tag and cache the class prototype
  if (!__TAG_IMPL[name]) {
    tag$1(name, tmpl, css, attrs, onCreate);
    // cache the class constructor
    __TAG_IMPL[name].class = this.constructor;
  }

  // mount the tag using the class instance
  mountTo(el, name, opts, this);
  // inject the component css
  if (css) { styleManager.inject(); }

  return this
}

/**
 * Create a new riot tag implementation
 * @param   { String }   name - name/id of the new riot tag
 * @param   { String }   tmpl - tag template
 * @param   { String }   css - custom tag css
 * @param   { String }   attrs - root tag attributes
 * @param   { Function } fn - user function
 * @returns { String } name/id of the tag just created
 */
function tag$1(name, tmpl, css, attrs, fn) {
  if (isFunction(attrs)) {
    fn = attrs;

    if (/^[\w-]+\s?=/.test(css)) {
      attrs = css;
      css = '';
    } else
      { attrs = ''; }
  }

  if (css) {
    if (isFunction(css))
      { fn = css; }
    else
      { styleManager.add(css); }
  }

  name = name.toLowerCase();
  __TAG_IMPL[name] = { name: name, tmpl: tmpl, attrs: attrs, fn: fn };

  return name
}

/**
 * Create a new riot tag implementation (for use by the compiler)
 * @param   { String }   name - name/id of the new riot tag
 * @param   { String }   tmpl - tag template
 * @param   { String }   css - custom tag css
 * @param   { String }   attrs - root tag attributes
 * @param   { Function } fn - user function
 * @returns { String } name/id of the tag just created
 */
function tag2$1(name, tmpl, css, attrs, fn) {
  if (css) { styleManager.add(css, name); }

  __TAG_IMPL[name] = { name: name, tmpl: tmpl, attrs: attrs, fn: fn };

  return name
}

/**
 * Mount a tag using a specific tag implementation
 * @param   { * } selector - tag DOM selector or DOM node/s
 * @param   { String } tagName - tag implementation name
 * @param   { Object } opts - tag logic
 * @returns { Array } new tags instances
 */
function mount$1(selector, tagName, opts) {
  var tags = [];
  var elem, allTags;

  function pushTagsTo(root) {
    if (root.tagName) {
      var riotTag = getAttr(root, IS_DIRECTIVE), tag;

      // have tagName? force riot-tag to be the same
      if (tagName && riotTag !== tagName) {
        riotTag = tagName;
        setAttr(root, IS_DIRECTIVE, tagName);
      }

      tag = mountTo(root, riotTag || root.tagName.toLowerCase(), opts);

      if (tag)
        { tags.push(tag); }
    } else if (root.length)
      { each(root, pushTagsTo); } // assume nodeList
  }

  // inject styles into DOM
  styleManager.inject();

  if (isObject(tagName)) {
    opts = tagName;
    tagName = 0;
  }

  // crawl the DOM to find the tag
  if (isString(selector)) {
    selector = selector === '*' ?
      // select all registered tags
      // & tags found with the riot-tag attribute set
      allTags = selectTags() :
      // or just the ones named like the selector
      selector + selectTags(selector.split(/, */));

    // make sure to pass always a selector
    // to the querySelectorAll function
    elem = selector ? $$(selector) : [];
  }
  else
    // probably you have passed already a tag or a NodeList
    { elem = selector; }

  // select all the registered and mount them inside their root elements
  if (tagName === '*') {
    // get all custom tags
    tagName = allTags || selectTags();
    // if the root els it's just a single tag
    if (elem.tagName)
      { elem = $$(tagName, elem); }
    else {
      // select all the children for all the different root elements
      var nodeList = [];

      each(elem, function (_el) { return nodeList.push($$(tagName, _el)); });

      elem = nodeList;
    }
    // get rid of the tagName
    tagName = 0;
  }

  pushTagsTo(elem);

  return tags
}

// Create a mixin that could be globally shared across all the tags
var mixins = {};
var globals = mixins[GLOBAL_MIXIN] = {};
var mixins_id = 0;

/**
 * Create/Return a mixin by its name
 * @param   { String }  name - mixin name (global mixin if object)
 * @param   { Object }  mix - mixin logic
 * @param   { Boolean } g - is global?
 * @returns { Object }  the mixin logic
 */
function mixin$1(name, mix, g) {
  // Unnamed global
  if (isObject(name)) {
    mixin$1(("__" + (mixins_id++) + "__"), name, true);
    return
  }

  var store = g ? globals : mixins;

  // Getter
  if (!mix) {
    if (isUndefined(store[name]))
      { throw new Error(("Unregistered mixin: " + name)) }

    return store[name]
  }

  // Setter
  store[name] = isFunction(mix) ?
    extend(mix.prototype, store[name] || {}) && mix :
    extend(store[name] || {}, mix);
}

/**
 * Update all the tags instances created
 * @returns { Array } all the tags instances
 */
function update$1() {
  return each(__TAGS_CACHE, function (tag) { return tag.update(); })
}

function unregister$1(name) {
  __TAG_IMPL[name] = null;
}

var version$1 = 'v3.7.4';


var core = Object.freeze({
	Tag: Tag$1,
	tag: tag$1,
	tag2: tag2$1,
	mount: mount$1,
	mixin: mixin$1,
	update: update$1,
	unregister: unregister$1,
	version: version$1
});

/**
 * We need to update opts for this tag. That requires updating the expressions
 * in any attributes on the tag, and then copying the result onto opts.
 * @this Tag
 * @param   {Boolean} isLoop - is it a loop tag?
 * @param   { Tag }  parent - parent tag node
 * @param   { Boolean }  isAnonymous - is it a tag without any impl? (a tag not registered)
 * @param   { Object }  opts - tag options
 * @param   { Array }  instAttrs - tag attributes array
 */
function updateOpts(isLoop, parent, isAnonymous, opts, instAttrs) {
  // isAnonymous `each` tags treat `dom` and `root` differently. In this case
  // (and only this case) we don't need to do updateOpts, because the regular parse
  // will update those attrs. Plus, isAnonymous tags don't need opts anyway
  if (isLoop && isAnonymous) { return }
  var ctx = isLoop ? inheritParentProps.call(this) : parent || this;

  each(instAttrs, function (attr) {
    if (attr.expr) { updateExpression.call(ctx, attr.expr); }
    // normalize the attribute names
    opts[toCamel(attr.name).replace(ATTRS_PREFIX, '')] = attr.expr ? attr.expr.value : attr.value;
  });
}

/**
 * Manage the mount state of a tag triggering also the observable events
 * @this Tag
 * @param { Boolean } value - ..of the isMounted flag
 */
function setMountState(value) {
  var ref = this.__;
  var isAnonymous = ref.isAnonymous;

  defineProperty(this, 'isMounted', value);

  if (!isAnonymous) {
    if (value) { this.trigger('mount'); }
    else {
      this.trigger('unmount');
      this.off('*');
      this.__.wasCreated = false;
    }
  }
}


/**
 * Tag creation factory function
 * @constructor
 * @param { Object } impl - it contains the tag template, and logic
 * @param { Object } conf - tag options
 * @param { String } innerHTML - html that eventually we need to inject in the tag
 */
function createTag(impl, conf, innerHTML) {
  if ( impl === void 0 ) { impl = {}; }
  if ( conf === void 0 ) { conf = {}; }

  var tag = conf.context || {};
  var opts = extend({}, conf.opts);
  var parent = conf.parent;
  var isLoop = conf.isLoop;
  var isAnonymous = !!conf.isAnonymous;
  var skipAnonymous = settings$1.skipAnonymousTags && isAnonymous;
  var item = conf.item;
  // available only for the looped nodes
  var index = conf.index;
  // All attributes on the Tag when it's first parsed
  var instAttrs = [];
  // expressions on this type of Tag
  var implAttrs = [];
  var expressions = [];
  var root = conf.root;
  var tagName = conf.tagName || getTagName(root);
  var isVirtual = tagName === 'virtual';
  var isInline = !isVirtual && !impl.tmpl;
  var dom;

  // make this tag observable
  if (!skipAnonymous) { observable$1(tag); }
  // only call unmount if we have a valid __TAG_IMPL (has name property)
  if (impl.name && root._tag) { root._tag.unmount(true); }

  // not yet mounted
  defineProperty(tag, 'isMounted', false);

  defineProperty(tag, '__', {
    isAnonymous: isAnonymous,
    instAttrs: instAttrs,
    innerHTML: innerHTML,
    tagName: tagName,
    index: index,
    isLoop: isLoop,
    isInline: isInline,
    // tags having event listeners
    // it would be better to use weak maps here but we can not introduce breaking changes now
    listeners: [],
    // these vars will be needed only for the virtual tags
    virts: [],
    wasCreated: false,
    tail: null,
    head: null,
    parent: null,
    item: null
  });

  // create a unique id to this tag
  // it could be handy to use it also to improve the virtual dom rendering speed
  defineProperty(tag, '_riot_id', uid()); // base 1 allows test !t._riot_id
  defineProperty(tag, 'root', root);
  extend(tag, { opts: opts }, item);
  // protect the "tags" and "refs" property from being overridden
  defineProperty(tag, 'parent', parent || null);
  defineProperty(tag, 'tags', {});
  defineProperty(tag, 'refs', {});

  if (isInline || isLoop && isAnonymous) {
    dom = root;
  } else {
    if (!isVirtual) { root.innerHTML = ''; }
    dom = mkdom(impl.tmpl, innerHTML, isSvg(root));
  }

  /**
   * Update the tag expressions and options
   * @param   { * }  data - data we want to use to extend the tag properties
   * @returns { Tag } the current tag instance
   */
  defineProperty(tag, 'update', function tagUpdate(data) {
    var nextOpts = {};
    var canTrigger = tag.isMounted && !skipAnonymous;

    // inherit properties from the parent tag
    if (isAnonymous && parent) { extend(tag, parent); }
    extend(tag, data);

    updateOpts.apply(tag, [isLoop, parent, isAnonymous, nextOpts, instAttrs]);

    if (
      canTrigger &&
      tag.isMounted &&
      isFunction(tag.shouldUpdate) && !tag.shouldUpdate(data, nextOpts)
    ) {
      return tag
    }

    extend(opts, nextOpts);

    if (canTrigger) { tag.trigger('update', data); }
    updateAllExpressions.call(tag, expressions);
    if (canTrigger) { tag.trigger('updated'); }

    return tag
  });

  /**
   * Add a mixin to this tag
   * @returns { Tag } the current tag instance
   */
  defineProperty(tag, 'mixin', function tagMixin() {
    each(arguments, function (mix) {
      var instance;
      var obj;
      var props = [];

      // properties blacklisted and will not be bound to the tag instance
      var propsBlacklist = ['init', '__proto__'];

      mix = isString(mix) ? mixin$1(mix) : mix;

      // check if the mixin is a function
      if (isFunction(mix)) {
        // create the new mixin instance
        instance = new mix();
      } else { instance = mix; }

      var proto = Object.getPrototypeOf(instance);

      // build multilevel prototype inheritance chain property list
      do { props = props.concat(Object.getOwnPropertyNames(obj || instance)); }
      while (obj = Object.getPrototypeOf(obj || instance))

      // loop the keys in the function prototype or the all object keys
      each(props, function (key) {
        // bind methods to tag
        // allow mixins to override other properties/parent mixins
        if (!contains(propsBlacklist, key)) {
          // check for getters/setters
          var descriptor = getPropDescriptor(instance, key) || getPropDescriptor(proto, key);
          var hasGetterSetter = descriptor && (descriptor.get || descriptor.set);

          // apply method only if it does not already exist on the instance
          if (!tag.hasOwnProperty(key) && hasGetterSetter) {
            Object.defineProperty(tag, key, descriptor);
          } else {
            tag[key] = isFunction(instance[key]) ?
              instance[key].bind(tag) :
              instance[key];
          }
        }
      });

      // init method will be called automatically
      if (instance.init)
        { instance.init.bind(tag)(opts); }
    });

    return tag
  });

  /**
   * Mount the current tag instance
   * @returns { Tag } the current tag instance
   */
  defineProperty(tag, 'mount', function tagMount() {
    root._tag = tag; // keep a reference to the tag just created

    // Read all the attrs on this instance. This give us the info we need for updateOpts
    parseAttributes.apply(parent, [root, root.attributes, function (attr, expr) {
      if (!isAnonymous && RefExpr.isPrototypeOf(expr)) { expr.tag = tag; }
      attr.expr = expr;
      instAttrs.push(attr);
    }]);

    // update the root adding custom attributes coming from the compiler
    walkAttrs(impl.attrs, function (k, v) { implAttrs.push({name: k, value: v}); });
    parseAttributes.apply(tag, [root, implAttrs, function (attr, expr) {
      if (expr) { expressions.push(expr); }
      else { setAttr(root, attr.name, attr.value); }
    }]);

    // initialiation
    updateOpts.apply(tag, [isLoop, parent, isAnonymous, opts, instAttrs]);

    // add global mixins
    var globalMixin = mixin$1(GLOBAL_MIXIN);

    if (globalMixin && !skipAnonymous) {
      for (var i in globalMixin) {
        if (globalMixin.hasOwnProperty(i)) {
          tag.mixin(globalMixin[i]);
        }
      }
    }

    if (impl.fn) { impl.fn.call(tag, opts); }

    if (!skipAnonymous) { tag.trigger('before-mount'); }

    // parse layout after init. fn may calculate args for nested custom tags
    each(parseExpressions.apply(tag, [dom, isAnonymous]), function (e) { return expressions.push(e); });

    tag.update(item);

    if (!isAnonymous && !isInline) {
      while (dom.firstChild) { root.appendChild(dom.firstChild); }
    }

    defineProperty(tag, 'root', root);

    // if we need to wait that the parent "mount" or "updated" event gets triggered
    if (!skipAnonymous && tag.parent) {
      var p = getImmediateCustomParentTag(tag.parent);
      p.one(!p.isMounted ? 'mount' : 'updated', function () {
        setMountState.call(tag, true);
      });
    } else {
      // otherwise it's not a child tag we can trigger its mount event
      setMountState.call(tag, true);
    }

    tag.__.wasCreated = true;

    return tag

  });

  /**
   * Unmount the tag instance
   * @param { Boolean } mustKeepRoot - if it's true the root node will not be removed
   * @returns { Tag } the current tag instance
   */
  defineProperty(tag, 'unmount', function tagUnmount(mustKeepRoot) {
    var el = tag.root;
    var p = el.parentNode;
    var tagIndex = __TAGS_CACHE.indexOf(tag);

    if (!skipAnonymous) { tag.trigger('before-unmount'); }

    // clear all attributes coming from the mounted tag
    walkAttrs(impl.attrs, function (name) {
      if (startsWith(name, ATTRS_PREFIX))
        { name = name.slice(ATTRS_PREFIX.length); }

      remAttr(root, name);
    });

    // remove all the event listeners
    tag.__.listeners.forEach(function (dom) {
      Object.keys(dom[RIOT_EVENTS_KEY]).forEach(function (eventName) {
        dom.removeEventListener(eventName, dom[RIOT_EVENTS_KEY][eventName]);
      });
    });

    // remove tag instance from the global tags cache collection
    if (tagIndex !== -1) { __TAGS_CACHE.splice(tagIndex, 1); }

    // clean up the parent tags object
    if (parent && !isAnonymous) {
      var ptag = getImmediateCustomParentTag(parent);

      if (isVirtual) {
        Object
          .keys(tag.tags)
          .forEach(function (tagName) { return arrayishRemove(ptag.tags, tagName, tag.tags[tagName]); });
      } else {
        arrayishRemove(ptag.tags, tagName, tag);
      }
    }

    // unmount all the virtual directives
    if (tag.__.virts) {
      each(tag.__.virts, function (v) {
        if (v.parentNode) { v.parentNode.removeChild(v); }
      });
    }

    // allow expressions to unmount themselves
    unmountAll(expressions);
    each(instAttrs, function (a) { return a.expr && a.expr.unmount && a.expr.unmount(); });

    // clear the tag html if it's necessary
    if (mustKeepRoot) { setInnerHTML(el, ''); }
    // otherwise detach the root tag from the DOM
    else if (p) { p.removeChild(el); }

    // custom internal unmount function to avoid relying on the observable
    if (tag.__.onUnmount) { tag.__.onUnmount(); }

    // weird fix for a weird edge case #2409 and #2436
    // some users might use your software not as you've expected
    // so I need to add these dirty hacks to mitigate unexpected issues
    if (!tag.isMounted) { setMountState.call(tag, true); }

    setMountState.call(tag, false);

    delete tag.root._tag;

    return tag
  });

  return tag
}

/**
 * Detect the tag implementation by a DOM node
 * @param   { Object } dom - DOM node we need to parse to get its tag implementation
 * @returns { Object } it returns an object containing the implementation of a custom tag (template and boot function)
 */
function getTag(dom) {
  return dom.tagName && __TAG_IMPL[getAttr(dom, IS_DIRECTIVE) ||
    getAttr(dom, IS_DIRECTIVE) || dom.tagName.toLowerCase()]
}

/**
 * Move the position of a custom tag in its parent tag
 * @this Tag
 * @param   { String } tagName - key where the tag was stored
 * @param   { Number } newPos - index where the new tag will be stored
 */
function moveChildTag(tagName, newPos) {
  var parent = this.parent;
  var tags;
  // no parent no move
  if (!parent) { return }

  tags = parent.tags[tagName];

  if (isArray(tags))
    { tags.splice(newPos, 0, tags.splice(tags.indexOf(this), 1)[0]); }
  else { arrayishAdd(parent.tags, tagName, this); }
}

/**
 * Create a new child tag including it correctly into its parent
 * @param   { Object } child - child tag implementation
 * @param   { Object } opts - tag options containing the DOM node where the tag will be mounted
 * @param   { String } innerHTML - inner html of the child node
 * @param   { Object } parent - instance of the parent tag including the child custom tag
 * @returns { Object } instance of the new child tag just created
 */
function initChildTag(child, opts, innerHTML, parent) {
  var tag = createTag(child, opts, innerHTML);
  var tagName = opts.tagName || getTagName(opts.root, true);
  var ptag = getImmediateCustomParentTag(parent);
  // fix for the parent attribute in the looped elements
  defineProperty(tag, 'parent', ptag);
  // store the real parent tag
  // in some cases this could be different from the custom parent tag
  // for example in nested loops
  tag.__.parent = parent;

  // add this tag to the custom parent tag
  arrayishAdd(ptag.tags, tagName, tag);

  // and also to the real parent tag
  if (ptag !== parent)
    { arrayishAdd(parent.tags, tagName, tag); }

  return tag
}

/**
 * Loop backward all the parents tree to detect the first custom parent tag
 * @param   { Object } tag - a Tag instance
 * @returns { Object } the instance of the first custom parent tag found
 */
function getImmediateCustomParentTag(tag) {
  var ptag = tag;
  while (ptag.__.isAnonymous) {
    if (!ptag.parent) { break }
    ptag = ptag.parent;
  }
  return ptag
}

/**
 * Trigger the unmount method on all the expressions
 * @param   { Array } expressions - DOM expressions
 */
function unmountAll(expressions) {
  each(expressions, function (expr) {
    if (expr.unmount) { expr.unmount(true); }
    else if (expr.tagName) { expr.tag.unmount(true); }
    else if (expr.unmount) { expr.unmount(); }
  });
}

/**
 * Get the tag name of any DOM node
 * @param   { Object } dom - DOM node we want to parse
 * @param   { Boolean } skipDataIs - hack to ignore the data-is attribute when attaching to parent
 * @returns { String } name to identify this dom node in riot
 */
function getTagName(dom, skipDataIs) {
  var child = getTag(dom);
  var namedTag = !skipDataIs && getAttr(dom, IS_DIRECTIVE);
  return namedTag && !tmpl.hasExpr(namedTag) ?
    namedTag : child ? child.name : dom.tagName.toLowerCase()
}

/**
 * Set the property of an object for a given key. If something already
 * exists there, then it becomes an array containing both the old and new value.
 * @param { Object } obj - object on which to set the property
 * @param { String } key - property name
 * @param { Object } value - the value of the property to be set
 * @param { Boolean } ensureArray - ensure that the property remains an array
 * @param { Number } index - add the new item in a certain array position
 */
function arrayishAdd(obj, key, value, ensureArray, index) {
  var dest = obj[key];
  var isArr = isArray(dest);
  var hasIndex = !isUndefined(index);

  if (dest && dest === value) { return }

  // if the key was never set, set it once
  if (!dest && ensureArray) { obj[key] = [value]; }
  else if (!dest) { obj[key] = value; }
  // if it was an array and not yet set
  else {
    if (isArr) {
      var oldIndex = dest.indexOf(value);
      // this item never changed its position
      if (oldIndex === index) { return }
      // remove the item from its old position
      if (oldIndex !== -1) { dest.splice(oldIndex, 1); }
      // move or add the item
      if (hasIndex) {
        dest.splice(index, 0, value);
      } else {
        dest.push(value);
      }
    } else { obj[key] = [dest, value]; }
  }
}

/**
 * Removes an item from an object at a given key. If the key points to an array,
 * then the item is just removed from the array.
 * @param { Object } obj - object on which to remove the property
 * @param { String } key - property name
 * @param { Object } value - the value of the property to be removed
 * @param { Boolean } ensureArray - ensure that the property remains an array
*/
function arrayishRemove(obj, key, value, ensureArray) {
  if (isArray(obj[key])) {
    var index = obj[key].indexOf(value);
    if (index !== -1) { obj[key].splice(index, 1); }
    if (!obj[key].length) { delete obj[key]; }
    else if (obj[key].length === 1 && !ensureArray) { obj[key] = obj[key][0]; }
  } else if (obj[key] === value)
    { delete obj[key]; } // otherwise just delete the key
}

/**
 * Mount a tag creating new Tag instance
 * @param   { Object } root - dom node where the tag will be mounted
 * @param   { String } tagName - name of the riot tag we want to mount
 * @param   { Object } opts - options to pass to the Tag instance
 * @param   { Object } ctx - optional context that will be used to extend an existing class ( used in riot.Tag )
 * @returns { Tag } a new Tag instance
 */
function mountTo(root, tagName, opts, ctx) {
  var impl = __TAG_IMPL[tagName];
  var implClass = __TAG_IMPL[tagName].class;
  var context = ctx || (implClass ? Object.create(implClass.prototype) : {});
  // cache the inner HTML to fix #855
  var innerHTML = root._innerHTML = root._innerHTML || root.innerHTML;
  var conf = extend({ root: root, opts: opts, context: context }, { parent: opts ? opts.parent : null });
  var tag;

  if (impl && root) { tag = createTag(impl, conf, innerHTML); }

  if (tag && tag.mount) {
    tag.mount(true);
    // add this tag to the virtualDom variable
    if (!contains(__TAGS_CACHE, tag)) { __TAGS_CACHE.push(tag); }
  }

  return tag
}

/**
 * makes a tag virtual and replaces a reference in the dom
 * @this Tag
 * @param { tag } the tag to make virtual
 * @param { ref } the dom reference location
 */
function makeReplaceVirtual(tag, ref) {
  var frag = createFrag();
  makeVirtual.call(tag, frag);
  ref.parentNode.replaceChild(frag, ref);
}

/**
 * Adds the elements for a virtual tag
 * @this Tag
 * @param { Node } src - the node that will do the inserting or appending
 * @param { Tag } target - only if inserting, insert before this tag's first child
 */
function makeVirtual(src, target) {
  var this$1 = this;

  var head = createDOMPlaceholder();
  var tail = createDOMPlaceholder();
  var frag = createFrag();
  var sib;
  var el;

  this.root.insertBefore(head, this.root.firstChild);
  this.root.appendChild(tail);

  this.__.head = el = head;
  this.__.tail = tail;

  while (el) {
    sib = el.nextSibling;
    frag.appendChild(el);
    this$1.__.virts.push(el); // hold for unmounting
    el = sib;
  }

  if (target)
    { src.insertBefore(frag, target.__.head); }
  else
    { src.appendChild(frag); }
}

/**
 * Return a temporary context containing also the parent properties
 * @this Tag
 * @param { Tag } - temporary tag context containing all the parent properties
 */
function inheritParentProps() {
  if (this.parent) { return extend(Object.create(this), this.parent) }
  return this
}

/**
 * Move virtual tag and all child nodes
 * @this Tag
 * @param { Node } src  - the node that will do the inserting
 * @param { Tag } target - insert before this tag's first child
 */
function moveVirtual(src, target) {
  var this$1 = this;

  var el = this.__.head;
  var sib;
  var frag = createFrag();

  while (el) {
    sib = el.nextSibling;
    frag.appendChild(el);
    el = sib;
    if (el === this$1.__.tail) {
      frag.appendChild(el);
      src.insertBefore(frag, target.__.head);
      break
    }
  }
}

/**
 * Get selectors for tags
 * @param   { Array } tags - tag names to select
 * @returns { String } selector
 */
function selectTags(tags) {
  // select all tags
  if (!tags) {
    var keys = Object.keys(__TAG_IMPL);
    return keys + selectTags(keys)
  }

  return tags
    .filter(function (t) { return !/[^-\w]/.test(t); })
    .reduce(function (list, t) {
      var name = t.trim().toLowerCase();
      return list + ",[" + IS_DIRECTIVE + "=\"" + name + "\"]"
    }, '')
}


var tags = Object.freeze({
	getTag: getTag,
	moveChildTag: moveChildTag,
	initChildTag: initChildTag,
	getImmediateCustomParentTag: getImmediateCustomParentTag,
	unmountAll: unmountAll,
	getTagName: getTagName,
	arrayishAdd: arrayishAdd,
	arrayishRemove: arrayishRemove,
	mountTo: mountTo,
	makeReplaceVirtual: makeReplaceVirtual,
	makeVirtual: makeVirtual,
	inheritParentProps: inheritParentProps,
	moveVirtual: moveVirtual,
	selectTags: selectTags
});

/**
 * Riot public api
 */
var settings = settings$1;
var util = {
  tmpl: tmpl,
  brackets: brackets,
  styleManager: styleManager,
  vdom: __TAGS_CACHE,
  styleNode: styleManager.styleNode,
  // export the riot internal utils as well
  dom: dom,
  check: check,
  misc: misc,
  tags: tags
};

// export the core props/methods
var Tag = Tag$1;
var tag = tag$1;
var tag2 = tag2$1;
var mount = mount$1;
var mixin = mixin$1;
var update = update$1;
var unregister = unregister$1;
var version = version$1;
var observable = observable$1;

var riot$1 = extend({}, core, {
  observable: observable$1,
  settings: settings,
  util: util,
});

exports.settings = settings;
exports.util = util;
exports.Tag = Tag;
exports.tag = tag;
exports.tag2 = tag2;
exports.mount = mount;
exports.mixin = mixin;
exports.update = update;
exports.unregister = unregister;
exports.version = version;
exports.observable = observable;
exports['default'] = riot$1;

Object.defineProperty(exports, '__esModule', { value: true });

})));
});

var riot$1 = unwrapExports(riot_1);

/* esr version 0.9.2 */
/**
     * Appends an array to the end of another.
     * The first array will be modified.
     */
    function append(arr1, arr2) {
        if (arr2 == null) {
            return arr1;
        }

        var pad = arr1.length,
            i = -1,
            len = arr2.length;
        while (++i < len) {
            arr1[pad + i] = arr2[i];
        }
        return arr1;
    }
    var append_1 = append;

/**
     * Returns the first argument provided to it.
     */
    function identity(val){
        return val;
    }

    var identity_1 = identity;

/**
     * Returns a function that gets a property of the passed object
     */
    function prop(name){
        return function(obj){
            return obj[name];
        };
    }

    var prop_1 = prop;

/**
     * Safer Object.hasOwnProperty
     */
     function hasOwn(obj, prop){
         return Object.prototype.hasOwnProperty.call(obj, prop);
     }

     var hasOwn_1 = hasOwn;

var _hasDontEnumBug;
var _dontEnums;

    function checkDontEnum(){
        _dontEnums = [
                'toString',
                'toLocaleString',
                'valueOf',
                'hasOwnProperty',
                'isPrototypeOf',
                'propertyIsEnumerable',
                'constructor'
            ];

        _hasDontEnumBug = true;

        for (var key in {'toString': null}) {
            _hasDontEnumBug = false;
        }
    }

    /**
     * Similar to Array/forEach but works over object properties and fixes Don't
     * Enum bug on IE.
     * based on: http://whattheheadsaid.com/2010/10/a-safer-object-keys-compatibility-implementation
     */
    function forIn(obj, fn, thisObj){
        var key, i = 0;
        // no need to check if argument is a real object that way we can use
        // it for arrays, functions, date, etc.

        //post-pone check till needed
        if (_hasDontEnumBug == null) { checkDontEnum(); }

        for (key in obj) {
            if (exec(fn, obj, key, thisObj) === false) {
                break;
            }
        }


        if (_hasDontEnumBug) {
            var ctor = obj.constructor,
                isProto = !!ctor && obj === ctor.prototype;

            while (key = _dontEnums[i++]) {
                // For constructor, if it is a prototype object the constructor
                // is always non-enumerable unless defined otherwise (and
                // enumerated above).  For non-prototype objects, it will have
                // to be defined on this object, since it cannot be defined on
                // any prototype objects.
                //
                // For other [[DontEnum]] properties, check if the value is
                // different than Object prototype value.
                if (
                    (key !== 'constructor' ||
                        (!isProto && hasOwn_1(obj, key))) &&
                    obj[key] !== Object.prototype[key]
                ) {
                    if (exec(fn, obj, key, thisObj) === false) {
                        break;
                    }
                }
            }
        }
    }

    function exec(fn, obj, key, thisObj){
        return fn.call(thisObj, obj[key], key, obj);
    }

    var forIn_1 = forIn;

/**
     * Similar to Array/forEach but works over object properties and fixes Don't
     * Enum bug on IE.
     * based on: http://whattheheadsaid.com/2010/10/a-safer-object-keys-compatibility-implementation
     */
    function forOwn(obj, fn, thisObj){
        forIn_1(obj, function(val, key){
            if (hasOwn_1(obj, key)) {
                return fn.call(thisObj, obj[key], key, obj);
            }
        });
    }

    var forOwn_1 = forOwn;

var _rKind = /^\[object (.*)\]$/;
var _toString = Object.prototype.toString;
var UNDEF;

    /**
     * Gets the "kind" of value. (e.g. "String", "Number", etc)
     */
    function kindOf(val) {
        if (val === null) {
            return 'Null';
        } else if (val === UNDEF) {
            return 'Undefined';
        } else {
            return _rKind.exec( _toString.call(val) )[1];
        }
    }
    var kindOf_1 = kindOf;

/**
     * Check if value is from a specific "kind".
     */
    function isKind(val, kind){
        return kindOf_1(val) === kind;
    }
    var isKind_1 = isKind;

/**
     */
    var isArray = Array.isArray || function (val) {
        return isKind_1(val, 'Array');
    };
    var isArray_1 = isArray;

function containsMatch(array, pattern) {
        var i = -1, length = array.length;
        while (++i < length) {
            if (deepMatches(array[i], pattern)) {
                return true;
            }
        }

        return false;
    }

    function matchArray(target, pattern) {
        var i = -1, patternLength = pattern.length;
        while (++i < patternLength) {
            if (!containsMatch(target, pattern[i])) {
                return false;
            }
        }

        return true;
    }

    function matchObject(target, pattern) {
        var result = true;
        forOwn_1(pattern, function(val, key) {
            if (!deepMatches(target[key], val)) {
                // Return false to break out of forOwn early
                return (result = false);
            }
        });

        return result;
    }

    /**
     * Recursively check if the objects match.
     */
    function deepMatches(target, pattern){
        if (target && typeof target === 'object' &&
            pattern && typeof pattern === 'object') {
            if (isArray_1(target) && isArray_1(pattern)) {
                return matchArray(target, pattern);
            } else {
                return matchObject(target, pattern);
            }
        } else {
            return target === pattern;
        }
    }

    var deepMatches_1 = deepMatches;

/**
     * Converts argument into a valid iterator.
     * Used internally on most array/object/collection methods that receives a
     * callback/iterator providing a shortcut syntax.
     */
    function makeIterator(src, thisObj){
        if (src == null) {
            return identity_1;
        }
        switch(typeof src) {
            case 'function':
                // function is the first to improve perf (most common case)
                // also avoid using `Function#call` if not needed, which boosts
                // perf a lot in some cases
                return (typeof thisObj !== 'undefined')? function(val, i, arr){
                    return src.call(thisObj, val, i, arr);
                } : src;
            case 'object':
                return function(val){
                    return deepMatches_1(val, src);
                };
            case 'string':
            case 'number':
                return prop_1(src);
        }
    }

    var makeIterator_ = makeIterator;

/**
     * Maps the items in the array and concatenates the result arrays.
     */
    function collect(arr, callback, thisObj){
        callback = makeIterator_(callback, thisObj);
        var results = [];
        if (arr == null) {
            return results;
        }

        var i = -1, len = arr.length;
        while (++i < len) {
            var value = callback(arr[i], i, arr);
            if (value != null) {
                append_1(results, value);
            }
        }

        return results;
    }

    var collect_1 = collect;

/**
     * Array.indexOf
     */
    function indexOf(arr, item, fromIndex) {
        fromIndex = fromIndex || 0;
        if (arr == null) {
            return -1;
        }

        var len = arr.length,
            i = fromIndex < 0 ? len + fromIndex : fromIndex;
        while (i < len) {
            // we iterate over sparse items since there is no way to make it
            // work properly on IE 7-8. see #64
            if (arr[i] === item) {
                return i;
            }

            i++;
        }

        return -1;
    }

    var indexOf_1 = indexOf;

/**
     * Combines an array with all the items of another.
     * Does not allow duplicates and is case and type sensitive.
     */
    function combine(arr1, arr2) {
        if (arr2 == null) {
            return arr1;
        }

        var i = -1, len = arr2.length;
        while (++i < len) {
            if (indexOf_1(arr1, arr2[i]) === -1) {
                arr1.push(arr2[i]);
            }
        }

        return arr1;
    }
    var combine_1 = combine;

/**
     * Array filter
     */
    function filter(arr, callback, thisObj) {
        callback = makeIterator_(callback, thisObj);
        var results = [];
        if (arr == null) {
            return results;
        }

        var i = -1, len = arr.length, value;
        while (++i < len) {
            value = arr[i];
            if (callback(value, i, arr)) {
                results.push(value);
            }
        }

        return results;
    }

    var filter_1 = filter;

/**
     * Remove all null/undefined items from array.
     */
    function compact(arr) {
        return filter_1(arr, function(val){
            return (val != null);
        });
    }

    var compact_1 = compact;

/**
     * If array contains values.
     */
    function contains(arr, val) {
        return indexOf_1(arr, val) !== -1;
    }
    var contains_1 = contains;

/**
     * @return {array} Array of unique items
     */
    function unique(arr, compare){
        compare = compare || isEqual;
        return filter_1(arr, function(item, i, arr){
            var n = arr.length;
            while (++i < n) {
                if ( compare(item, arr[i]) ) {
                    return false;
                }
            }
            return true;
        });
    }

    function isEqual(a, b){
        return a === b;
    }

    var unique_1 = unique;

/**
     * Array some
     */
    function some(arr, callback, thisObj) {
        callback = makeIterator_(callback, thisObj);
        var result = false;
        if (arr == null) {
            return result;
        }

        var i = -1, len = arr.length;
        while (++i < len) {
            // we iterate over sparse items since there is no way to make it
            // work properly on IE 7-8. see #64
            if ( callback(arr[i], i, arr) ) {
                result = true;
                break;
            }
        }

        return result;
    }

    var some_1 = some;

/**
     * Create slice of source array or array-like object
     */
    function slice(arr, start, end){
        var len = arr.length;

        if (start == null) {
            start = 0;
        } else if (start < 0) {
            start = Math.max(len + start, 0);
        } else {
            start = Math.min(start, len);
        }

        if (end == null) {
            end = len;
        } else if (end < 0) {
            end = Math.max(len + end, 0);
        } else {
            end = Math.min(end, len);
        }

        var result = [];
        while (start < end) {
            result.push(arr[start++]);
        }

        return result;
    }

    var slice_1 = slice;

/**
     * Return a new Array with elements that aren't present in the other Arrays.
     */
    function difference(arr) {
        var arrs = slice_1(arguments, 1),
            result = filter_1(unique_1(arr), function(needle){
                return !some_1(arrs, function(haystack){
                    return contains_1(haystack, needle);
                });
            });
        return result;
    }

    var difference_1 = difference;

/**
     * Check if both arguments are egal.
     */
    function is(x, y){
        // implementation borrowed from harmony:egal spec
        if (x === y) {
          // 0 === -0, but they are not identical
          return x !== 0 || 1 / x === 1 / y;
        }

        // NaN !== NaN, but they are identical.
        // NaNs are the only non-reflexive value, i.e., if x !== x,
        // then x is a NaN.
        // isNaN is broken: it converts its argument to number, so
        // isNaN("foo") => true
        return x !== x && y !== y;
    }

    var is_1 = is;

/**
     * Array every
     */
    function every(arr, callback, thisObj) {
        callback = makeIterator_(callback, thisObj);
        var result = true;
        if (arr == null) {
            return result;
        }

        var i = -1, len = arr.length;
        while (++i < len) {
            // we iterate over sparse items since there is no way to make it
            // work properly on IE 7-8. see #64
            if (!callback(arr[i], i, arr) ) {
                result = false;
                break;
            }
        }

        return result;
    }

    var every_1 = every;

/**
     * Compares if both arrays have the same elements
     */
    function equals(a, b, callback){
        callback = callback || is_1;

        if (!isArray_1(a) || !isArray_1(b)) {
            return callback(a, b);
        }

        if (a.length !== b.length) {
            return false;
        }

        return every_1(a, makeCompare(callback), b);
    }

    function makeCompare(callback) {
        return function(value, i) {
            return i in this && callback(value, this[i]);
        };
    }

    var equals_1 = equals;

/**
     * Returns the index of the first item that matches criteria
     */
    function findIndex(arr, iterator, thisObj){
        iterator = makeIterator_(iterator, thisObj);
        if (arr == null) {
            return -1;
        }

        var i = -1, len = arr.length;
        while (++i < len) {
            if (iterator(arr[i], i, arr)) {
                return i;
            }
        }

        return -1;
    }

    var findIndex_1 = findIndex;

/**
     * Returns first item that matches criteria
     */
    function find(arr, iterator, thisObj){
        var idx = findIndex_1(arr, iterator, thisObj);
        return idx >= 0? arr[idx] : void(0);
    }

    var find_1 = find;

/**
     * Returns the index of the last item that matches criteria
     */
    function findLastIndex(arr, iterator, thisObj){
        iterator = makeIterator_(iterator, thisObj);
        if (arr == null) {
            return -1;
        }

        var n = arr.length;
        while (--n >= 0) {
            if (iterator(arr[n], n, arr)) {
                return n;
            }
        }

        return -1;
    }

    var findLastIndex_1 = findLastIndex;

/**
     * Returns last item that matches criteria
     */
    function findLast(arr, iterator, thisObj){
        var idx = findLastIndex_1(arr, iterator, thisObj);
        return idx >= 0? arr[idx] : void(0);
    }

    var findLast_1 = findLast;

/*
     * Helper function to flatten to a destination array.
     * Used to remove the need to create intermediate arrays while flattening.
     */
    function flattenTo(arr, result, level) {
        if (level === 0) {
            append_1(result, arr);
            return result;
        }

        var value,
            i = -1,
            len = arr.length;
        while (++i < len) {
            value = arr[i];
            if (isArray_1(value)) {
                flattenTo(value, result, level - 1);
            } else {
                result.push(value);
            }
        }
        return result;
    }

    /**
     * Recursively flattens an array.
     * A new array containing all the elements is returned.
     * If level is specified, it will only flatten up to that level.
     */
    function flatten(arr, level) {
        if (arr == null) {
            return [];
        }

        level = level == null ? -1 : level;
        return flattenTo(arr, [], level);
    }

    var flatten_1 = flatten;

/**
     * Array forEach
     */
    function forEach(arr, callback, thisObj) {
        if (arr == null) {
            return;
        }
        var i = -1,
            len = arr.length;
        while (++i < len) {
            // we iterate over sparse items since there is no way to make it
            // work properly on IE 7-8. see #64
            if ( callback.call(thisObj, arr[i], i, arr) === false ) {
                break;
            }
        }
    }

    var forEach_1 = forEach;

/**
     * Bucket the array values.
     */
    function groupBy(arr, categorize, thisObj) {
        if (categorize) {
            categorize = makeIterator_(categorize, thisObj);
        } else {
            // Default to identity function.
            categorize = identity_1;
        }

        var buckets = {};
        forEach_1(arr, function(element) {
            var bucket = categorize(element);
            if (!(bucket in buckets)) {
                buckets[bucket] = [];
            }

            buckets[bucket].push(element);
        });

        return buckets;
    }

    var groupBy_1 = groupBy;

/**
     * Array indicesOf
     */
    function indicesOf(arr, item, fromIndex) {
        var results = [];
        if (arr == null) {
            return results;
        }

        fromIndex = typeof fromIndex === 'number' ? fromIndex : 0;

        var length = arr.length;
        var cursor = fromIndex >= 0 ? fromIndex : length + fromIndex;

        while (cursor < length) {
            if (arr[cursor] === item) {
                results.push(cursor);
            }
            cursor++;
        }

        return results;
    }

    var indicesOf_1 = indicesOf;

/**
     * Insert item into array if not already present.
     */
    function insert(arr, rest_items) {
        var diff = difference_1(slice_1(arguments, 1), arr);
        if (diff.length) {
            Array.prototype.push.apply(arr, diff);
        }
        return arr.length;
    }
    var insert_1 = insert;

/**
     * Return a new Array with elements common to all Arrays.
     * - based on underscore.js implementation
     */
    function intersection(arr) {
        var arrs = slice_1(arguments, 1),
            result = filter_1(unique_1(arr), function(needle){
                return every_1(arrs, function(haystack){
                    return contains_1(haystack, needle);
                });
            });
        return result;
    }

    var intersection_1 = intersection;

/**
     * Call `methodName` on each item of the array passing custom arguments if
     * needed.
     */
    function invoke(arr, methodName, var_args){
        if (arr == null) {
            return arr;
        }

        var args = slice_1(arguments, 2);
        var i = -1, len = arr.length, value;
        while (++i < len) {
            value = arr[i];
            value[methodName].apply(value, args);
        }

        return arr;
    }

    var invoke_1 = invoke;

function isValidString(val) {
        return (val != null && val !== '');
    }

    /**
     * Joins strings with the specified separator inserted between each value.
     * Null values and empty strings will be excluded.
     */
    function join(items, separator) {
        separator = separator || '';
        return filter_1(items, isValidString).join(separator);
    }

    var join_1 = join;

/**
     * Returns last element of array.
     */
    function last(arr){
        if (arr == null || arr.length < 1) {
            return undefined;
        }

        return arr[arr.length - 1];
    }

    var last_1 = last;

/**
     * Array lastIndexOf
     */
    function lastIndexOf(arr, item, fromIndex) {
        if (arr == null) {
            return -1;
        }

        var len = arr.length;
        fromIndex = (fromIndex == null || fromIndex >= len)? len - 1 : fromIndex;
        fromIndex = (fromIndex < 0)? len + fromIndex : fromIndex;

        while (fromIndex >= 0) {
            // we iterate over sparse items since there is no way to make it
            // work properly on IE 7-8. see #64
            if (arr[fromIndex] === item) {
                return fromIndex;
            }
            fromIndex--;
        }

        return -1;
    }

    var lastIndexOf_1 = lastIndexOf;

/**
     * Array map
     */
    function map(arr, callback, thisObj) {
        callback = makeIterator_(callback, thisObj);
        var results = [];
        if (arr == null){
            return results;
        }

        var i = -1, len = arr.length;
        while (++i < len) {
            results[i] = callback(arr[i], i, arr);
        }

        return results;
    }

     var map_1 = map;

/**
     * Return maximum value inside array
     */
    function max(arr, iterator, thisObj){
        if (arr == null || !arr.length) {
            return Infinity;
        } else if (arr.length && !iterator) {
            return Math.max.apply(Math, arr);
        } else {
            iterator = makeIterator_(iterator, thisObj);
            var result,
                compare = -Infinity,
                value,
                temp;

            var i = -1, len = arr.length;
            while (++i < len) {
                value = arr[i];
                temp = iterator(value, i, arr);
                if (temp > compare) {
                    compare = temp;
                    result = value;
                }
            }

            return result;
        }
    }

    var max_1 = max;

/**
     * Return minimum value inside array
     */
    function min(arr, iterator, thisObj){
        if (arr == null || !arr.length) {
            return -Infinity;
        } else if (arr.length && !iterator) {
            return Math.min.apply(Math, arr);
        } else {
            iterator = makeIterator_(iterator, thisObj);
            var result,
                compare = Infinity,
                value,
                temp;

            var i = -1, len = arr.length;
            while (++i < len) {
                value = arr[i];
                temp = iterator(value, i, arr);
                if (temp < compare) {
                    compare = temp;
                    result = value;
                }
            }

            return result;
        }
    }

    var min_1 = min;

/**
 * @constant Minimum 32-bit signed integer value (-2^31).
 */

    var MIN_INT = -2147483648;

/**
 * @constant Maximum 32-bit signed integer value. (2^31 - 1)
 */

    var MAX_INT = 2147483647;

/**
     * Just a wrapper to Math.random. No methods inside mout/random should call
     * Math.random() directly so we can inject the pseudo-random number
     * generator if needed (ie. in case we need a seeded random or a better
     * algorithm than the native one)
     */
    function random(){
        return random.get();
    }

    // we expose the method so it can be swapped if needed
    random.get = Math.random;

    var random_1 = random;

/**
     * Returns random number inside range
     */
    function rand(min, max){
        min = min == null? MIN_INT : min;
        max = max == null? MAX_INT : max;
        return min + (max - min) * random_1();
    }

    var rand_1 = rand;

/**
     * Gets random integer inside range or snap to min/max values.
     */
    function randInt(min, max){
        min = min == null? MIN_INT : ~~min;
        max = max == null? MAX_INT : ~~max;
        // can't be max + 0.5 otherwise it will round up if `rand`
        // returns `max` causing it to overflow range.
        // -0.5 and + 0.49 are required to avoid bias caused by rounding
        return Math.round( rand_1(min - 0.5, max + 0.499999999999) );
    }

    var randInt_1 = randInt;

/**
     * Remove random item(s) from the Array and return it.
     * Returns an Array of items if [nItems] is provided or a single item if
     * it isn't specified.
     */
    function pick(arr, nItems){
        if (nItems != null) {
            var result = [];
            if (nItems > 0 && arr && arr.length) {
                nItems = nItems > arr.length? arr.length : nItems;
                while (nItems--) {
                    result.push( pickOne(arr) );
                }
            }
            return result;
        }
        return (arr && arr.length)? pickOne(arr) : void(0);
    }


    function pickOne(arr){
        var idx = randInt_1(0, arr.length - 1);
        return arr.splice(idx, 1)[0];
    }


    var pick_1 = pick;

/**
     * Extract a list of property values.
     */
    function pluck(arr, propName){
        return map_1(arr, propName);
    }

    var pluck_1 = pluck;

/**
     * Returns an Array of numbers inside range.
     */
    function range(start, stop, step) {
        if (stop == null) {
            stop = start;
            start = 0;
        }
        step = step || 1;

        var result = [],
            nSteps = countSteps_1(stop - start, step),
            i = start;

        while (i <= stop) {
            result.push(i);
            i += step;
        }

        return result;
    }

    var range_1 = range;

/**
     * Array reduce
     */
    function reduce(arr, fn, initVal) {
        // check for args.length since initVal might be "undefined" see #gh-57
        var hasInit = arguments.length > 2,
            result = initVal;

        if (arr == null || !arr.length) {
            if (!hasInit) {
                throw new Error('reduce of empty array with no initial value');
            } else {
                return initVal;
            }
        }

        var i = -1, len = arr.length;
        while (++i < len) {
            if (!hasInit) {
                result = arr[i];
                hasInit = true;
            } else {
                result = fn(result, arr[i], i, arr);
            }
        }

        return result;
    }

    var reduce_1 = reduce;

/**
     * Array reduceRight
     */
    function reduceRight(arr, fn, initVal) {
        // check for args.length since initVal might be "undefined" see #gh-57
        var hasInit = arguments.length > 2;

        if (arr == null || !arr.length) {
            if (hasInit) {
                return initVal;
            } else {
                throw new Error('reduce of empty array with no initial value');
            }
        }

        var i = arr.length, result = initVal, value;
        while (--i >= 0) {
            // we iterate over sparse items since there is no way to make it
            // work properly on IE 7-8. see #64
            value = arr[i];
            if (!hasInit) {
                result = value;
                hasInit = true;
            } else {
                result = fn(result, value, i, arr);
            }
        }
        return result;
    }

    var reduceRight_1 = reduceRight;

/**
     * Array reject
     */
    function reject(arr, callback, thisObj) {
        callback = makeIterator_(callback, thisObj);
        var results = [];
        if (arr == null) {
            return results;
        }

        var i = -1, len = arr.length, value;
        while (++i < len) {
            value = arr[i];
            if (!callback(value, i, arr)) {
                results.push(value);
            }
        }

        return results;
    }

    var reject_1 = reject;

/**
     * Remove a single item from the array.
     * (it won't remove duplicates, just a single item)
     */
    function remove(arr, item){
        var idx = indexOf_1(arr, item);
        if (idx !== -1) { arr.splice(idx, 1); }
    }

    var remove_1 = remove;

/**
     * Remove all instances of an item from array.
     */
    function removeAll(arr, item){
        var idx = indexOf_1(arr, item);
        while (idx !== -1) {
            arr.splice(idx, 1);
            idx = indexOf_1(arr, item, idx);
        }
    }

    var removeAll_1 = removeAll;

/**
     * Returns a copy of the array in reversed order.
     */
    function reverse(array) {
        var copy = array.slice();
        copy.reverse();
        return copy;
    }

    var reverse_1 = reverse;

/**
     * Shuffle array items.
     */
    function shuffle(arr) {
        var results = [],
            rnd;
        if (arr == null) {
            return results;
        }

        var i = -1, len = arr.length;
        while (++i < len) {
            if (!i) {
                results[0] = arr[0];
            } else {
                rnd = randInt_1(0, i);
                results[i] = results[rnd];
                results[rnd] = arr[i];
            }
        }

        return results;
    }

    var shuffle_1 = shuffle;

/**
     * Merge sort (http://en.wikipedia.org/wiki/Merge_sort)
     */
    function mergeSort(arr, compareFn) {
        if (arr == null) {
            return [];
        } else if (arr.length < 2) {
            return arr;
        }

        if (compareFn == null) {
            compareFn = defaultCompare;
        }

        var mid, left, right;

        mid   = ~~(arr.length / 2);
        left  = mergeSort( arr.slice(0, mid), compareFn );
        right = mergeSort( arr.slice(mid, arr.length), compareFn );

        return merge(left, right, compareFn);
    }

    function defaultCompare(a, b) {
        return a < b ? -1 : (a > b? 1 : 0);
    }

    function merge(left, right, compareFn) {
        var result = [];

        while (left.length && right.length) {
            if (compareFn(left[0], right[0]) <= 0) {
                // if 0 it should preserve same order (stable)
                result.push(left.shift());
            } else {
                result.push(right.shift());
            }
        }

        if (left.length) {
            result.push.apply(result, left);
        }

        if (right.length) {
            result.push.apply(result, right);
        }

        return result;
    }

    var sort = mergeSort;

/*
     * Sort array by the result of the callback
     */
    function sortBy(arr, callback, context){
        callback = makeIterator_(callback, context);

        return sort(arr, function(a, b) {
            a = callback(a);
            b = callback(b);
            return (a < b) ? -1 : ((a > b) ? 1 : 0);
        });
    }

    var sortBy_1 = sortBy;

/**
     * Split array into a fixed number of segments.
     */
    function split(array, segments) {
        segments = segments || 2;
        var results = [];
        if (array == null) {
            return results;
        }

        var minLength = Math.floor(array.length / segments),
            remainder = array.length % segments,
            i = 0,
            len = array.length,
            segmentIndex = 0,
            segmentLength;

        while (i < len) {
            segmentLength = minLength;
            if (segmentIndex < remainder) {
                segmentLength++;
            }

            results.push(array.slice(i, i + segmentLength));

            segmentIndex++;
            i += segmentLength;
        }

        return results;
    }
    var split_1 = split;

/**
     * Iterates over a callback a set amount of times
     * returning the results
     */
    function take(n, callback, thisObj){
        var i = -1;
        var arr = [];
        if( !thisObj ){
            while(++i < n){
                arr[i] = callback(i, n);
            }
        } else {
            while(++i < n){
                arr[i] = callback.call(thisObj, i, n);
            }
        }
        return arr;
    }

    var take_1 = take;

/**
     */
    function isFunction(val) {
        return isKind_1(val, 'Function');
    }
    var isFunction_1 = isFunction;

/**
     * Creates an object that holds a lookup for the objects in the array.
     */
    function toLookup(arr, key) {
        var result = {};
        if (arr == null) {
            return result;
        }

        var i = -1, len = arr.length, value;
        if (isFunction_1(key)) {
            while (++i < len) {
                value = arr[i];
                result[key(value)] = value;
            }
        } else {
            while (++i < len) {
                value = arr[i];
                result[value[key]] = value;
            }
        }

        return result;
    }
    var toLookup_1 = toLookup;

/**
     * Concat multiple arrays and remove duplicates
     */
    function union(arrs) {
        var arguments$1 = arguments;

        var results = [];
        var i = -1, len = arguments.length;
        while (++i < len) {
            append_1(results, arguments$1[i]);
        }

        return unique_1(results);
    }

    var union_1 = union;

/**
     * Exclusive OR. Returns items that are present in a single array.
     * - like ptyhon's `symmetric_difference`
     */
    function xor(arr1, arr2) {
        arr1 = unique_1(arr1);
        arr2 = unique_1(arr2);

        var a1 = filter_1(arr1, function(item){
                return !contains_1(arr2, item);
            }),
            a2 = filter_1(arr2, function(item){
                return !contains_1(arr1, item);
            });

        return a1.concat(a2);
    }

    var xor_1 = xor;

function getLength(arr) {
        return arr == null ? 0 : arr.length;
    }

    /**
     * Merges together the values of each of the arrays with the values at the
     * corresponding position.
     */
    function zip(arr){
        var arguments$1 = arguments;

        var len = arr ? max_1(map_1(arguments, getLength)) : 0,
            results = [],
            i = -1;
        while (++i < len) {
            // jshint loopfunc: true
            results.push(map_1(arguments$1, function(item) {
                return item == null ? undefined : item[i];
            }));
        }

        return results;
    }

    var zip_1 = zip;

//automatically generated, do not edit!
//run `node build` instead
var array = {
    'append' : append_1,
    'collect' : collect_1,
    'combine' : combine_1,
    'compact' : compact_1,
    'contains' : contains_1,
    'difference' : difference_1,
    'equals' : equals_1,
    'every' : every_1,
    'filter' : filter_1,
    'find' : find_1,
    'findIndex' : findIndex_1,
    'findLast' : findLast_1,
    'findLastIndex' : findLastIndex_1,
    'flatten' : flatten_1,
    'forEach' : forEach_1,
    'groupBy' : groupBy_1,
    'indexOf' : indexOf_1,
    'indicesOf' : indicesOf_1,
    'insert' : insert_1,
    'intersection' : intersection_1,
    'invoke' : invoke_1,
    'join' : join_1,
    'last' : last_1,
    'lastIndexOf' : lastIndexOf_1,
    'map' : map_1,
    'max' : max_1,
    'min' : min_1,
    'pick' : pick_1,
    'pluck' : pluck_1,
    'range' : range_1,
    'reduce' : reduce_1,
    'reduceRight' : reduceRight_1,
    'reject' : reject_1,
    'remove' : remove_1,
    'removeAll' : removeAll_1,
    'reverse' : reverse_1,
    'shuffle' : shuffle_1,
    'slice' : slice_1,
    'some' : some_1,
    'sort' : sort,
    'sortBy' : sortBy_1,
    'split' : split_1,
    'take' : take_1,
    'toLookup' : toLookup_1,
    'union' : union_1,
    'unique' : unique_1,
    'xor' : xor_1,
    'zip' : zip_1
};

var array_1 = array.find;
var array_2 = array.forEach;

var index$1 = Array.isArray || function (arr) {
  return Object.prototype.toString.call(arr) == '[object Array]';
};

/**
 * Expose `pathToRegexp`.
 */
var index = pathToRegexp;
var parse_1 = parse;
var compile_1 = compile;
var tokensToFunction_1 = tokensToFunction;
var tokensToRegExp_1 = tokensToRegExp;

/**
 * The main path matching regexp utility.
 *
 * @type {RegExp}
 */
var PATH_REGEXP = new RegExp([
  // Match escaped characters that would otherwise appear in future matches.
  // This allows the user to escape special characters that won't transform.
  '(\\\\.)',
  // Match Express-style parameters and un-named parameters with a prefix
  // and optional suffixes. Matches appear as:
  //
  // "/:test(\\d+)?" => ["/", "test", "\d+", undefined, "?", undefined]
  // "/route(\\d+)"  => [undefined, undefined, undefined, "\d+", undefined, undefined]
  // "/*"            => ["/", undefined, undefined, undefined, undefined, "*"]
  '([\\/.])?(?:(?:\\:(\\w+)(?:\\(((?:\\\\.|[^\\\\()])+)\\))?|\\(((?:\\\\.|[^\\\\()])+)\\))([+*?])?|(\\*))'
].join('|'), 'g');

/**
 * Parse a string for the raw tokens.
 *
 * @param  {string}  str
 * @param  {Object=} options
 * @return {!Array}
 */
function parse (str, options) {
  var tokens = [];
  var key = 0;
  var index = 0;
  var path = '';
  var defaultDelimiter = options && options.delimiter || '/';
  var res;

  while ((res = PATH_REGEXP.exec(str)) != null) {
    var m = res[0];
    var escaped = res[1];
    var offset = res.index;
    path += str.slice(index, offset);
    index = offset + m.length;

    // Ignore already escaped sequences.
    if (escaped) {
      path += escaped[1];
      continue
    }

    var next = str[index];
    var prefix = res[2];
    var name = res[3];
    var capture = res[4];
    var group = res[5];
    var modifier = res[6];
    var asterisk = res[7];

    // Push the current path onto the tokens.
    if (path) {
      tokens.push(path);
      path = '';
    }

    var partial = prefix != null && next != null && next !== prefix;
    var repeat = modifier === '+' || modifier === '*';
    var optional = modifier === '?' || modifier === '*';
    var delimiter = res[2] || defaultDelimiter;
    var pattern = capture || group;

    tokens.push({
      name: name || key++,
      prefix: prefix || '',
      delimiter: delimiter,
      optional: optional,
      repeat: repeat,
      partial: partial,
      asterisk: !!asterisk,
      pattern: pattern ? escapeGroup(pattern) : (asterisk ? '.*' : '[^' + escapeString(delimiter) + ']+?')
    });
  }

  // Match any characters still remaining.
  if (index < str.length) {
    path += str.substr(index);
  }

  // If the path exists, push it onto the end.
  if (path) {
    tokens.push(path);
  }

  return tokens
}

/**
 * Compile a string to a template function for the path.
 *
 * @param  {string}             str
 * @param  {Object=}            options
 * @return {!function(Object=, Object=)}
 */
function compile (str, options) {
  return tokensToFunction(parse(str, options))
}

/**
 * Prettier encoding of URI path segments.
 *
 * @param  {string}
 * @return {string}
 */
function encodeURIComponentPretty (str) {
  return encodeURI(str).replace(/[\/?#]/g, function (c) {
    return '%' + c.charCodeAt(0).toString(16).toUpperCase()
  })
}

/**
 * Encode the asterisk parameter. Similar to `pretty`, but allows slashes.
 *
 * @param  {string}
 * @return {string}
 */
function encodeAsterisk (str) {
  return encodeURI(str).replace(/[?#]/g, function (c) {
    return '%' + c.charCodeAt(0).toString(16).toUpperCase()
  })
}

/**
 * Expose a method for transforming tokens into the path function.
 */
function tokensToFunction (tokens) {
  // Compile all the tokens into regexps.
  var matches = new Array(tokens.length);

  // Compile all the patterns before compilation.
  for (var i = 0; i < tokens.length; i++) {
    if (typeof tokens[i] === 'object') {
      matches[i] = new RegExp('^(?:' + tokens[i].pattern + ')$');
    }
  }

  return function (obj, opts) {
    var path = '';
    var data = obj || {};
    var options = opts || {};
    var encode = options.pretty ? encodeURIComponentPretty : encodeURIComponent;

    for (var i = 0; i < tokens.length; i++) {
      var token = tokens[i];

      if (typeof token === 'string') {
        path += token;

        continue
      }

      var value = data[token.name];
      var segment;

      if (value == null) {
        if (token.optional) {
          // Prepend partial segment prefixes.
          if (token.partial) {
            path += token.prefix;
          }

          continue
        } else {
          throw new TypeError('Expected "' + token.name + '" to be defined')
        }
      }

      if (index$1(value)) {
        if (!token.repeat) {
          throw new TypeError('Expected "' + token.name + '" to not repeat, but received `' + JSON.stringify(value) + '`')
        }

        if (value.length === 0) {
          if (token.optional) {
            continue
          } else {
            throw new TypeError('Expected "' + token.name + '" to not be empty')
          }
        }

        for (var j = 0; j < value.length; j++) {
          segment = encode(value[j]);

          if (!matches[i].test(segment)) {
            throw new TypeError('Expected all "' + token.name + '" to match "' + token.pattern + '", but received `' + JSON.stringify(segment) + '`')
          }

          path += (j === 0 ? token.prefix : token.delimiter) + segment;
        }

        continue
      }

      segment = token.asterisk ? encodeAsterisk(value) : encode(value);

      if (!matches[i].test(segment)) {
        throw new TypeError('Expected "' + token.name + '" to match "' + token.pattern + '", but received "' + segment + '"')
      }

      path += token.prefix + segment;
    }

    return path
  }
}

/**
 * Escape a regular expression string.
 *
 * @param  {string} str
 * @return {string}
 */
function escapeString (str) {
  return str.replace(/([.+*?=^!:${}()[\]|\/\\])/g, '\\$1')
}

/**
 * Escape the capturing group by escaping special characters and meaning.
 *
 * @param  {string} group
 * @return {string}
 */
function escapeGroup (group) {
  return group.replace(/([=!:$\/()])/g, '\\$1')
}

/**
 * Attach the keys as a property of the regexp.
 *
 * @param  {!RegExp} re
 * @param  {Array}   keys
 * @return {!RegExp}
 */
function attachKeys (re, keys) {
  re.keys = keys;
  return re
}

/**
 * Get the flags for a regexp from the options.
 *
 * @param  {Object} options
 * @return {string}
 */
function flags (options) {
  return options.sensitive ? '' : 'i'
}

/**
 * Pull out keys from a regexp.
 *
 * @param  {!RegExp} path
 * @param  {!Array}  keys
 * @return {!RegExp}
 */
function regexpToRegexp (path, keys) {
  // Use a negative lookahead to match only capturing groups.
  var groups = path.source.match(/\((?!\?)/g);

  if (groups) {
    for (var i = 0; i < groups.length; i++) {
      keys.push({
        name: i,
        prefix: null,
        delimiter: null,
        optional: false,
        repeat: false,
        partial: false,
        asterisk: false,
        pattern: null
      });
    }
  }

  return attachKeys(path, keys)
}

/**
 * Transform an array into a regexp.
 *
 * @param  {!Array}  path
 * @param  {Array}   keys
 * @param  {!Object} options
 * @return {!RegExp}
 */
function arrayToRegexp (path, keys, options) {
  var parts = [];

  for (var i = 0; i < path.length; i++) {
    parts.push(pathToRegexp(path[i], keys, options).source);
  }

  var regexp = new RegExp('(?:' + parts.join('|') + ')', flags(options));

  return attachKeys(regexp, keys)
}

/**
 * Create a path regexp from string input.
 *
 * @param  {string}  path
 * @param  {!Array}  keys
 * @param  {!Object} options
 * @return {!RegExp}
 */
function stringToRegexp (path, keys, options) {
  return tokensToRegExp(parse(path, options), keys, options)
}

/**
 * Expose a function for taking tokens and returning a RegExp.
 *
 * @param  {!Array}          tokens
 * @param  {(Array|Object)=} keys
 * @param  {Object=}         options
 * @return {!RegExp}
 */
function tokensToRegExp (tokens, keys, options) {
  if (!index$1(keys)) {
    options = /** @type {!Object} */ (keys || options);
    keys = [];
  }

  options = options || {};

  var strict = options.strict;
  var end = options.end !== false;
  var route = '';

  // Iterate over the tokens and create our regexp string.
  for (var i = 0; i < tokens.length; i++) {
    var token = tokens[i];

    if (typeof token === 'string') {
      route += escapeString(token);
    } else {
      var prefix = escapeString(token.prefix);
      var capture = '(?:' + token.pattern + ')';

      keys.push(token);

      if (token.repeat) {
        capture += '(?:' + prefix + capture + ')*';
      }

      if (token.optional) {
        if (!token.partial) {
          capture = '(?:' + prefix + '(' + capture + '))?';
        } else {
          capture = prefix + '(' + capture + ')?';
        }
      } else {
        capture = prefix + '(' + capture + ')';
      }

      route += capture;
    }
  }

  var delimiter = escapeString(options.delimiter || '/');
  var endsWithDelimiter = route.slice(-delimiter.length) === delimiter;

  // In non-strict mode we allow a slash at the end of match. If the path to
  // match already ends with a slash, we remove it for consistency. The slash
  // is valid at the end of a path match, not in the middle. This is important
  // in non-ending mode, where "/test/" shouldn't match "/test//route".
  if (!strict) {
    route = (endsWithDelimiter ? route.slice(0, -delimiter.length) : route) + '(?:' + delimiter + '(?=$))?';
  }

  if (end) {
    route += '$';
  } else {
    // In non-ending mode, we need the capturing groups to match as much as
    // possible by using a positive lookahead to the end or next path segment.
    route += strict && endsWithDelimiter ? '' : '(?=' + delimiter + '|$)';
  }

  return attachKeys(new RegExp('^' + route, flags(options)), keys)
}

/**
 * Normalize the given path string, returning a regular expression.
 *
 * An empty array can be passed in for the keys, which will hold the
 * placeholder key descriptions. For example, using `/user/:id`, `keys` will
 * contain `[{ name: 'id', delimiter: '/', optional: false, repeat: false }]`.
 *
 * @param  {(string|RegExp|Array)} path
 * @param  {(Array|Object)=}       keys
 * @param  {Object=}               options
 * @return {!RegExp}
 */
function pathToRegexp (path, keys, options) {
  if (!index$1(keys)) {
    options = /** @type {!Object} */ (keys || options);
    keys = [];
  }

  options = options || {};

  if (path instanceof RegExp) {
    return regexpToRegexp(path, /** @type {!Array} */ (keys))
  }

  if (index$1(path)) {
    return arrayToRegexp(/** @type {!Array} */ (path), /** @type {!Array} */ (keys), options)
  }

  return stringToRegexp(/** @type {string} */ (path), /** @type {!Array} */ (keys), options)
}

index.parse = parse_1;
index.compile = compile_1;
index.tokensToFunction = tokensToFunction_1;
index.tokensToRegExp = tokensToRegExp_1;

var commonjsGlobal$1 = typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};



function unwrapExports$1 (x) {
	return x && x.__esModule ? x['default'] : x;
}

function createCommonjsModule$1(fn, module) {
	return module = { exports: {} }, fn(module, module.exports), module.exports;
}

var promise = createCommonjsModule$1(function (module) {
(function (root) {

  // Store setTimeout reference so promise-polyfill will be unaffected by
  // other code modifying setTimeout (like sinon.useFakeTimers())
  var setTimeoutFunc = setTimeout;

  function noop() {}
  
  // Polyfill for Function.prototype.bind
  function bind(fn, thisArg) {
    return function () {
      fn.apply(thisArg, arguments);
    };
  }

  function Promise(fn) {
    if (typeof this !== 'object') { throw new TypeError('Promises must be constructed via new'); }
    if (typeof fn !== 'function') { throw new TypeError('not a function'); }
    this._state = 0;
    this._handled = false;
    this._value = undefined;
    this._deferreds = [];

    doResolve(fn, this);
  }

  function handle(self, deferred) {
    while (self._state === 3) {
      self = self._value;
    }
    if (self._state === 0) {
      self._deferreds.push(deferred);
      return;
    }
    self._handled = true;
    Promise._immediateFn(function () {
      var cb = self._state === 1 ? deferred.onFulfilled : deferred.onRejected;
      if (cb === null) {
        (self._state === 1 ? resolve : reject)(deferred.promise, self._value);
        return;
      }
      var ret;
      try {
        ret = cb(self._value);
      } catch (e) {
        reject(deferred.promise, e);
        return;
      }
      resolve(deferred.promise, ret);
    });
  }

  function resolve(self, newValue) {
    try {
      // Promise Resolution Procedure: https://github.com/promises-aplus/promises-spec#the-promise-resolution-procedure
      if (newValue === self) { throw new TypeError('A promise cannot be resolved with itself.'); }
      if (newValue && (typeof newValue === 'object' || typeof newValue === 'function')) {
        var then = newValue.then;
        if (newValue instanceof Promise) {
          self._state = 3;
          self._value = newValue;
          finale(self);
          return;
        } else if (typeof then === 'function') {
          doResolve(bind(then, newValue), self);
          return;
        }
      }
      self._state = 1;
      self._value = newValue;
      finale(self);
    } catch (e) {
      reject(self, e);
    }
  }

  function reject(self, newValue) {
    self._state = 2;
    self._value = newValue;
    finale(self);
  }

  function finale(self) {
    if (self._state === 2 && self._deferreds.length === 0) {
      Promise._immediateFn(function() {
        if (!self._handled) {
          Promise._unhandledRejectionFn(self._value);
        }
      });
    }

    for (var i = 0, len = self._deferreds.length; i < len; i++) {
      handle(self, self._deferreds[i]);
    }
    self._deferreds = null;
  }

  function Handler(onFulfilled, onRejected, promise) {
    this.onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : null;
    this.onRejected = typeof onRejected === 'function' ? onRejected : null;
    this.promise = promise;
  }

  /**
   * Take a potentially misbehaving resolver function and make sure
   * onFulfilled and onRejected are only called once.
   *
   * Makes no guarantees about asynchrony.
   */
  function doResolve(fn, self) {
    var done = false;
    try {
      fn(function (value) {
        if (done) { return; }
        done = true;
        resolve(self, value);
      }, function (reason) {
        if (done) { return; }
        done = true;
        reject(self, reason);
      });
    } catch (ex) {
      if (done) { return; }
      done = true;
      reject(self, ex);
    }
  }

  Promise.prototype['catch'] = function (onRejected) {
    return this.then(null, onRejected);
  };

  Promise.prototype.then = function (onFulfilled, onRejected) {
    var prom = new (this.constructor)(noop);

    handle(this, new Handler(onFulfilled, onRejected, prom));
    return prom;
  };

  Promise.all = function (arr) {
    var args = Array.prototype.slice.call(arr);

    return new Promise(function (resolve, reject) {
      if (args.length === 0) { return resolve([]); }
      var remaining = args.length;

      function res(i, val) {
        try {
          if (val && (typeof val === 'object' || typeof val === 'function')) {
            var then = val.then;
            if (typeof then === 'function') {
              then.call(val, function (val) {
                res(i, val);
              }, reject);
              return;
            }
          }
          args[i] = val;
          if (--remaining === 0) {
            resolve(args);
          }
        } catch (ex) {
          reject(ex);
        }
      }

      for (var i = 0; i < args.length; i++) {
        res(i, args[i]);
      }
    });
  };

  Promise.resolve = function (value) {
    if (value && typeof value === 'object' && value.constructor === Promise) {
      return value;
    }

    return new Promise(function (resolve) {
      resolve(value);
    });
  };

  Promise.reject = function (value) {
    return new Promise(function (resolve, reject) {
      reject(value);
    });
  };

  Promise.race = function (values) {
    return new Promise(function (resolve, reject) {
      for (var i = 0, len = values.length; i < len; i++) {
        values[i].then(resolve, reject);
      }
    });
  };

  // Use polyfill for setImmediate for performance gains
  Promise._immediateFn = (typeof setImmediate === 'function' && function (fn) { setImmediate(fn); }) ||
    function (fn) {
      setTimeoutFunc(fn, 0);
    };

  Promise._unhandledRejectionFn = function _unhandledRejectionFn(err) {
    if (typeof console !== 'undefined' && console) {
      console.warn('Possible Unhandled Promise Rejection:', err); // eslint-disable-line no-console
    }
  };

  /**
   * Set the immediate function to execute callbacks
   * @param fn {function} Function to execute
   * @deprecated
   */
  Promise._setImmediateFn = function _setImmediateFn(fn) {
    Promise._immediateFn = fn;
  };

  /**
   * Change the function to execute on unhandled rejection
   * @param {function} fn Function to execute on unhandled rejection
   * @deprecated
   */
  Promise._setUnhandledRejectionFn = function _setUnhandledRejectionFn(fn) {
    Promise._unhandledRejectionFn = fn;
  };
  
  if ('object' !== 'undefined' && module.exports) {
    module.exports = Promise;
  } else if (!root.Promise) {
    root.Promise = Promise;
  }

})(commonjsGlobal$1);
});

/**
 * Copyright 2014-2015, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 */

/**
 * Similar to invariant but only logs a warning if the condition is not met.
 * This can be used to log issues in development environments in critical
 * paths. Removing the logging code for production environments will keep the
 * same logic and follow the same code paths.
 */

var warning = function() {};

{
  warning = function(condition, format, args) {
    var arguments$1 = arguments;

    var len = arguments.length;
    args = new Array(len > 2 ? len - 2 : 0);
    for (var key = 2; key < len; key++) {
      args[key - 2] = arguments$1[key];
    }
    if (format === undefined) {
      throw new Error(
        '`warning(condition, format, ...args)` requires a warning ' +
        'message argument'
      );
    }

    if (format.length < 10 || (/^[s\W]*$/).test(format)) {
      throw new Error(
        'The warning format should be able to uniquely identify this ' +
        'warning. Please, use a more descriptive format than: ' + format
      );
    }

    if (!condition) {
      var argIndex = 0;
      var message = 'Warning: ' +
        format.replace(/%s/g, function() {
          return args[argIndex++];
        });
      if (typeof console !== 'undefined') {
        console.error(message);
      }
      try {
        // This error was thrown as a convenience so that you can use this stack
        // to find the callsite that caused this warning to fire.
        throw new Error(message);
      } catch(x) {}
    }
  };
}

var browser = warning;

/**
 * Copyright 2013-2015, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 */

/**
 * Use invariant() to assert state which your program assumes to be true.
 *
 * Provide sprintf-style format (only %s is supported) and arguments
 * to provide information about what broke and what you were
 * expecting.
 *
 * The invariant message will be stripped in production, but the invariant
 * will remain to ensure logic does not differ in production.
 */

var invariant = function(condition, format, a, b, c, d, e, f) {
  {
    if (format === undefined) {
      throw new Error('invariant requires an error message argument');
    }
  }

  if (!condition) {
    var error;
    if (format === undefined) {
      error = new Error(
        'Minified exception occurred; use the non-minified dev environment ' +
        'for the full error message and additional helpful warnings.'
      );
    } else {
      var args = [a, b, c, d, e, f];
      var argIndex = 0;
      error = new Error(
        format.replace(/%s/g, function() { return args[argIndex++]; })
      );
      error.name = 'Invariant Violation';
    }

    error.framesToPop = 1; // we don't care about invariant's own frame
    throw error;
  }
};

var browser$1 = invariant;

var isAbsolute = function isAbsolute(pathname) {
  return pathname.charAt(0) === '/';
};

// About 1.5x faster than the two-arg version of Array#splice()
var spliceOne = function spliceOne(list, index) {
  for (var i = index, k = i + 1, n = list.length; k < n; i += 1, k += 1) {
    list[i] = list[k];
  }list.pop();
};

// This implementation is based heavily on node's url.parse
var resolvePathname = function resolvePathname(to) {
  var from = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';

  var toParts = to && to.split('/') || [];
  var fromParts = from && from.split('/') || [];

  var isToAbs = to && isAbsolute(to);
  var isFromAbs = from && isAbsolute(from);
  var mustEndAbs = isToAbs || isFromAbs;

  if (to && isAbsolute(to)) {
    // to is absolute
    fromParts = toParts;
  } else if (toParts.length) {
    // to is relative, drop the filename
    fromParts.pop();
    fromParts = fromParts.concat(toParts);
  }

  if (!fromParts.length) { return '/'; }

  var hasTrailingSlash = void 0;
  if (fromParts.length) {
    var last = fromParts[fromParts.length - 1];
    hasTrailingSlash = last === '.' || last === '..' || last === '';
  } else {
    hasTrailingSlash = false;
  }

  var up = 0;
  for (var i = fromParts.length; i >= 0; i--) {
    var part = fromParts[i];

    if (part === '.') {
      spliceOne(fromParts, i);
    } else if (part === '..') {
      spliceOne(fromParts, i);
      up++;
    } else if (up) {
      spliceOne(fromParts, i);
      up--;
    }
  }

  if (!mustEndAbs) { for (; up--; up) {
    fromParts.unshift('..');
  } }if (mustEndAbs && fromParts[0] !== '' && (!fromParts[0] || !isAbsolute(fromParts[0]))) { fromParts.unshift(''); }

  var result = fromParts.join('/');

  if (hasTrailingSlash && result.substr(-1) !== '/') { result += '/'; }

  return result;
};

var index$3 = resolvePathname;

var index$4 = createCommonjsModule$1(function (module, exports) {
'use strict';

exports.__esModule = true;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var valueEqual = function valueEqual(a, b) {
  if (a === b) { return true; }

  if (a == null || b == null) { return false; }

  if (Array.isArray(a)) { return Array.isArray(b) && a.length === b.length && a.every(function (item, index) {
    return valueEqual(item, b[index]);
  }); }

  var aType = typeof a === 'undefined' ? 'undefined' : _typeof(a);
  var bType = typeof b === 'undefined' ? 'undefined' : _typeof(b);

  if (aType !== bType) { return false; }

  if (aType === 'object') {
    var aValue = a.valueOf();
    var bValue = b.valueOf();

    if (aValue !== a || bValue !== b) { return valueEqual(aValue, bValue); }

    var aKeys = Object.keys(a);
    var bKeys = Object.keys(b);

    if (aKeys.length !== bKeys.length) { return false; }

    return aKeys.every(function (key) {
      return valueEqual(a[key], b[key]);
    });
  }

  return false;
};

exports.default = valueEqual;
});

var valueEqual = unwrapExports$1(index$4);

var addLeadingSlash = function addLeadingSlash(path) {
  return path.charAt(0) === '/' ? path : '/' + path;
};

var stripLeadingSlash = function stripLeadingSlash(path) {
  return path.charAt(0) === '/' ? path.substr(1) : path;
};

var hasBasename = function hasBasename(path, prefix) {
  return new RegExp('^' + prefix + '(\\/|\\?|#|$)', 'i').test(path);
};

var stripBasename = function stripBasename(path, prefix) {
  return hasBasename(path, prefix) ? path.substr(prefix.length) : path;
};

var stripTrailingSlash = function stripTrailingSlash(path) {
  return path.charAt(path.length - 1) === '/' ? path.slice(0, -1) : path;
};

var parsePath = function parsePath(path) {
  var pathname = path || '/';
  var search = '';
  var hash = '';

  var hashIndex = pathname.indexOf('#');
  if (hashIndex !== -1) {
    hash = pathname.substr(hashIndex);
    pathname = pathname.substr(0, hashIndex);
  }

  var searchIndex = pathname.indexOf('?');
  if (searchIndex !== -1) {
    search = pathname.substr(searchIndex);
    pathname = pathname.substr(0, searchIndex);
  }

  return {
    pathname: pathname,
    search: search === '?' ? '' : search,
    hash: hash === '#' ? '' : hash
  };
};

var createPath = function createPath(location) {
  var pathname = location.pathname,
      search = location.search,
      hash = location.hash;


  var path = pathname || '/';

  if (search && search !== '?') { path += search.charAt(0) === '?' ? search : '?' + search; }

  if (hash && hash !== '#') { path += hash.charAt(0) === '#' ? hash : '#' + hash; }

  return path;
};

var _extends$1 = Object.assign || function (target) {
var arguments$1 = arguments;
 for (var i = 1; i < arguments.length; i++) { var source = arguments$1[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var createLocation = function createLocation(path, state, key, currentLocation) {
  var location = void 0;
  if (typeof path === 'string') {
    // Two-arg form: push(path, state)
    location = parsePath(path);
    location.state = state;
  } else {
    // One-arg form: push(location)
    location = _extends$1({}, path);

    if (location.pathname === undefined) { location.pathname = ''; }

    if (location.search) {
      if (location.search.charAt(0) !== '?') { location.search = '?' + location.search; }
    } else {
      location.search = '';
    }

    if (location.hash) {
      if (location.hash.charAt(0) !== '#') { location.hash = '#' + location.hash; }
    } else {
      location.hash = '';
    }

    if (state !== undefined && location.state === undefined) { location.state = state; }
  }

  try {
    location.pathname = decodeURI(location.pathname);
  } catch (e) {
    if (e instanceof URIError) {
      throw new URIError('Pathname "' + location.pathname + '" could not be decoded. ' + 'This is likely caused by an invalid percent-encoding.');
    } else {
      throw e;
    }
  }

  if (key) { location.key = key; }

  if (currentLocation) {
    // Resolve incomplete/relative pathname relative to current location.
    if (!location.pathname) {
      location.pathname = currentLocation.pathname;
    } else if (location.pathname.charAt(0) !== '/') {
      location.pathname = index$3(location.pathname, currentLocation.pathname);
    }
  } else {
    // When there is no prior location and pathname is empty, set it to /
    if (!location.pathname) {
      location.pathname = '/';
    }
  }

  return location;
};

var locationsAreEqual = function locationsAreEqual(a, b) {
  return a.pathname === b.pathname && a.search === b.search && a.hash === b.hash && a.key === b.key && valueEqual(a.state, b.state);
};

var createTransitionManager = function createTransitionManager() {
  var prompt = null;

  var setPrompt = function setPrompt(nextPrompt) {
    browser(prompt == null, 'A history supports only one prompt at a time');

    prompt = nextPrompt;

    return function () {
      if (prompt === nextPrompt) { prompt = null; }
    };
  };

  var confirmTransitionTo = function confirmTransitionTo(location, action, getUserConfirmation, callback) {
    // TODO: If another transition starts while we're still confirming
    // the previous one, we may end up in a weird state. Figure out the
    // best way to handle this.
    if (prompt != null) {
      var result = typeof prompt === 'function' ? prompt(location, action) : prompt;

      if (typeof result === 'string') {
        if (typeof getUserConfirmation === 'function') {
          getUserConfirmation(result, callback);
        } else {
          browser(false, 'A history needs a getUserConfirmation function in order to use a prompt message');

          callback(true);
        }
      } else {
        // Return false from a transition hook to cancel the transition.
        callback(result !== false);
      }
    } else {
      callback(true);
    }
  };

  var listeners = [];

  var appendListener = function appendListener(fn) {
    var isActive = true;

    var listener = function listener() {
      if (isActive) { fn.apply(undefined, arguments); }
    };

    listeners.push(listener);

    return function () {
      isActive = false;
      listeners = listeners.filter(function (item) {
        return item !== listener;
      });
    };
  };

  var notifyListeners = function notifyListeners() {
    var arguments$1 = arguments;

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments$1[_key];
    }

    listeners.forEach(function (listener) {
      return listener.apply(undefined, args);
    });
  };

  return {
    setPrompt: setPrompt,
    confirmTransitionTo: confirmTransitionTo,
    appendListener: appendListener,
    notifyListeners: notifyListeners
  };
};

var canUseDOM = !!(typeof window !== 'undefined' && window.document && window.document.createElement);

var addEventListener = function addEventListener(node, event, listener) {
  return node.addEventListener ? node.addEventListener(event, listener, false) : node.attachEvent('on' + event, listener);
};

var removeEventListener = function removeEventListener(node, event, listener) {
  return node.removeEventListener ? node.removeEventListener(event, listener, false) : node.detachEvent('on' + event, listener);
};

var getConfirmation = function getConfirmation(message, callback) {
  return callback(window.confirm(message));
}; // eslint-disable-line no-alert

/**
 * Returns true if the HTML5 history API is supported. Taken from Modernizr.
 *
 * https://github.com/Modernizr/Modernizr/blob/master/LICENSE
 * https://github.com/Modernizr/Modernizr/blob/master/feature-detects/history.js
 * changed to avoid false negatives for Windows Phones: https://github.com/reactjs/react-router/issues/586
 */
var supportsHistory = function supportsHistory() {
  var ua = window.navigator.userAgent;

  if ((ua.indexOf('Android 2.') !== -1 || ua.indexOf('Android 4.0') !== -1) && ua.indexOf('Mobile Safari') !== -1 && ua.indexOf('Chrome') === -1 && ua.indexOf('Windows Phone') === -1) { return false; }

  return window.history && 'pushState' in window.history;
};

/**
 * Returns true if browser fires popstate on hash change.
 * IE10 and IE11 do not.
 */
var supportsPopStateOnHashChange = function supportsPopStateOnHashChange() {
  return window.navigator.userAgent.indexOf('Trident') === -1;
};

/**
 * Returns false if using go(n) with hash history causes a full page reload.
 */
var supportsGoWithoutReloadUsingHash = function supportsGoWithoutReloadUsingHash() {
  return window.navigator.userAgent.indexOf('Firefox') === -1;
};

/**
 * Returns true if a given popstate event is an extraneous WebKit event.
 * Accounts for the fact that Chrome on iOS fires real popstate events
 * containing undefined state when pressing the back button.
 */
var isExtraneousPopstateEvent = function isExtraneousPopstateEvent(event) {
  return event.state === undefined && navigator.userAgent.indexOf('CriOS') === -1;
};

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _extends = Object.assign || function (target) {
var arguments$1 = arguments;
 for (var i = 1; i < arguments.length; i++) { var source = arguments$1[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var PopStateEvent = 'popstate';
var HashChangeEvent = 'hashchange';

var getHistoryState = function getHistoryState() {
  try {
    return window.history.state || {};
  } catch (e) {
    // IE 11 sometimes throws when accessing window.history.state
    // See https://github.com/ReactTraining/history/pull/289
    return {};
  }
};

/**
 * Creates a history object that uses the HTML5 history API including
 * pushState, replaceState, and the popstate event.
 */
var createBrowserHistory = function createBrowserHistory() {
  var props = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

  browser$1(canUseDOM, 'Browser history needs a DOM');

  var globalHistory = window.history;
  var canUseHistory = supportsHistory();
  var needsHashChangeListener = !supportsPopStateOnHashChange();

  var _props$forceRefresh = props.forceRefresh,
      forceRefresh = _props$forceRefresh === undefined ? false : _props$forceRefresh,
      _props$getUserConfirm = props.getUserConfirmation,
      getUserConfirmation = _props$getUserConfirm === undefined ? getConfirmation : _props$getUserConfirm,
      _props$keyLength = props.keyLength,
      keyLength = _props$keyLength === undefined ? 6 : _props$keyLength;

  var basename = props.basename ? stripTrailingSlash(addLeadingSlash(props.basename)) : '';

  var getDOMLocation = function getDOMLocation(historyState) {
    var _ref = historyState || {},
        key = _ref.key,
        state = _ref.state;

    var _window$location = window.location,
        pathname = _window$location.pathname,
        search = _window$location.search,
        hash = _window$location.hash;


    var path = pathname + search + hash;

    browser(!basename || hasBasename(path, basename), 'You are attempting to use a basename on a page whose URL path does not begin ' + 'with the basename. Expected path "' + path + '" to begin with "' + basename + '".');

    if (basename) { path = stripBasename(path, basename); }

    return createLocation(path, state, key);
  };

  var createKey = function createKey() {
    return Math.random().toString(36).substr(2, keyLength);
  };

  var transitionManager = createTransitionManager();

  var setState = function setState(nextState) {
    _extends(history, nextState);

    history.length = globalHistory.length;

    transitionManager.notifyListeners(history.location, history.action);
  };

  var handlePopState = function handlePopState(event) {
    // Ignore extraneous popstate events in WebKit.
    if (isExtraneousPopstateEvent(event)) { return; }

    handlePop(getDOMLocation(event.state));
  };

  var handleHashChange = function handleHashChange() {
    handlePop(getDOMLocation(getHistoryState()));
  };

  var forceNextPop = false;

  var handlePop = function handlePop(location) {
    if (forceNextPop) {
      forceNextPop = false;
      setState();
    } else {
      var action = 'POP';

      transitionManager.confirmTransitionTo(location, action, getUserConfirmation, function (ok) {
        if (ok) {
          setState({ action: action, location: location });
        } else {
          revertPop(location);
        }
      });
    }
  };

  var revertPop = function revertPop(fromLocation) {
    var toLocation = history.location;

    // TODO: We could probably make this more reliable by
    // keeping a list of keys we've seen in sessionStorage.
    // Instead, we just default to 0 for keys we don't know.

    var toIndex = allKeys.indexOf(toLocation.key);

    if (toIndex === -1) { toIndex = 0; }

    var fromIndex = allKeys.indexOf(fromLocation.key);

    if (fromIndex === -1) { fromIndex = 0; }

    var delta = toIndex - fromIndex;

    if (delta) {
      forceNextPop = true;
      go(delta);
    }
  };

  var initialLocation = getDOMLocation(getHistoryState());
  var allKeys = [initialLocation.key];

  // Public interface

  var createHref = function createHref(location) {
    return basename + createPath(location);
  };

  var push = function push(path, state) {
    browser(!((typeof path === 'undefined' ? 'undefined' : _typeof(path)) === 'object' && path.state !== undefined && state !== undefined), 'You should avoid providing a 2nd state argument to push when the 1st ' + 'argument is a location-like object that already has state; it is ignored');

    var action = 'PUSH';
    var location = createLocation(path, state, createKey(), history.location);

    transitionManager.confirmTransitionTo(location, action, getUserConfirmation, function (ok) {
      if (!ok) { return; }

      var href = createHref(location);
      var key = location.key,
          state = location.state;


      if (canUseHistory) {
        globalHistory.pushState({ key: key, state: state }, null, href);

        if (forceRefresh) {
          window.location.href = href;
        } else {
          var prevIndex = allKeys.indexOf(history.location.key);
          var nextKeys = allKeys.slice(0, prevIndex === -1 ? 0 : prevIndex + 1);

          nextKeys.push(location.key);
          allKeys = nextKeys;

          setState({ action: action, location: location });
        }
      } else {
        browser(state === undefined, 'Browser history cannot push state in browsers that do not support HTML5 history');

        window.location.href = href;
      }
    });
  };

  var replace = function replace(path, state) {
    browser(!((typeof path === 'undefined' ? 'undefined' : _typeof(path)) === 'object' && path.state !== undefined && state !== undefined), 'You should avoid providing a 2nd state argument to replace when the 1st ' + 'argument is a location-like object that already has state; it is ignored');

    var action = 'REPLACE';
    var location = createLocation(path, state, createKey(), history.location);

    transitionManager.confirmTransitionTo(location, action, getUserConfirmation, function (ok) {
      if (!ok) { return; }

      var href = createHref(location);
      var key = location.key,
          state = location.state;


      if (canUseHistory) {
        globalHistory.replaceState({ key: key, state: state }, null, href);

        if (forceRefresh) {
          window.location.replace(href);
        } else {
          var prevIndex = allKeys.indexOf(history.location.key);

          if (prevIndex !== -1) { allKeys[prevIndex] = location.key; }

          setState({ action: action, location: location });
        }
      } else {
        browser(state === undefined, 'Browser history cannot replace state in browsers that do not support HTML5 history');

        window.location.replace(href);
      }
    });
  };

  var go = function go(n) {
    globalHistory.go(n);
  };

  var goBack = function goBack() {
    return go(-1);
  };

  var goForward = function goForward() {
    return go(1);
  };

  var listenerCount = 0;

  var checkDOMListeners = function checkDOMListeners(delta) {
    listenerCount += delta;

    if (listenerCount === 1) {
      addEventListener(window, PopStateEvent, handlePopState);

      if (needsHashChangeListener) { addEventListener(window, HashChangeEvent, handleHashChange); }
    } else if (listenerCount === 0) {
      removeEventListener(window, PopStateEvent, handlePopState);

      if (needsHashChangeListener) { removeEventListener(window, HashChangeEvent, handleHashChange); }
    }
  };

  var isBlocked = false;

  var block = function block() {
    var prompt = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;

    var unblock = transitionManager.setPrompt(prompt);

    if (!isBlocked) {
      checkDOMListeners(1);
      isBlocked = true;
    }

    return function () {
      if (isBlocked) {
        isBlocked = false;
        checkDOMListeners(-1);
      }

      return unblock();
    };
  };

  var listen = function listen(listener) {
    var unlisten = transitionManager.appendListener(listener);
    checkDOMListeners(1);

    return function () {
      checkDOMListeners(-1);
      unlisten();
    };
  };

  var history = {
    length: globalHistory.length,
    action: 'POP',
    location: initialLocation,
    createHref: createHref,
    push: push,
    replace: replace,
    go: go,
    goBack: goBack,
    goForward: goForward,
    block: block,
    listen: listen
  };

  return history;
};

var _extends$2 = Object.assign || function (target) {
var arguments$1 = arguments;
 for (var i = 1; i < arguments.length; i++) { var source = arguments$1[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var HashChangeEvent$1 = 'hashchange';

var HashPathCoders = {
  hashbang: {
    encodePath: function encodePath(path) {
      return path.charAt(0) === '!' ? path : '!/' + stripLeadingSlash(path);
    },
    decodePath: function decodePath(path) {
      return path.charAt(0) === '!' ? path.substr(1) : path;
    }
  },
  noslash: {
    encodePath: stripLeadingSlash,
    decodePath: addLeadingSlash
  },
  slash: {
    encodePath: addLeadingSlash,
    decodePath: addLeadingSlash
  }
};

var getHashPath = function getHashPath() {
  // We can't use window.location.hash here because it's not
  // consistent across browsers - Firefox will pre-decode it!
  var href = window.location.href;
  var hashIndex = href.indexOf('#');
  return hashIndex === -1 ? '' : href.substring(hashIndex + 1);
};

var pushHashPath = function pushHashPath(path) {
  return window.location.hash = path;
};

var replaceHashPath = function replaceHashPath(path) {
  var hashIndex = window.location.href.indexOf('#');

  window.location.replace(window.location.href.slice(0, hashIndex >= 0 ? hashIndex : 0) + '#' + path);
};

var createHashHistory = function createHashHistory() {
  var props = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

  browser$1(canUseDOM, 'Hash history needs a DOM');

  var globalHistory = window.history;
  var canGoWithoutReload = supportsGoWithoutReloadUsingHash();

  var _props$getUserConfirm = props.getUserConfirmation,
      getUserConfirmation = _props$getUserConfirm === undefined ? getConfirmation : _props$getUserConfirm,
      _props$hashType = props.hashType,
      hashType = _props$hashType === undefined ? 'slash' : _props$hashType;

  var basename = props.basename ? stripTrailingSlash(addLeadingSlash(props.basename)) : '';

  var _HashPathCoders$hashT = HashPathCoders[hashType],
      encodePath = _HashPathCoders$hashT.encodePath,
      decodePath = _HashPathCoders$hashT.decodePath;


  var getDOMLocation = function getDOMLocation() {
    var path = decodePath(getHashPath());

    browser(!basename || hasBasename(path, basename), 'You are attempting to use a basename on a page whose URL path does not begin ' + 'with the basename. Expected path "' + path + '" to begin with "' + basename + '".');

    if (basename) { path = stripBasename(path, basename); }

    return createLocation(path);
  };

  var transitionManager = createTransitionManager();

  var setState = function setState(nextState) {
    _extends$2(history, nextState);

    history.length = globalHistory.length;

    transitionManager.notifyListeners(history.location, history.action);
  };

  var forceNextPop = false;
  var ignorePath = null;

  var handleHashChange = function handleHashChange() {
    var path = getHashPath();
    var encodedPath = encodePath(path);

    if (path !== encodedPath) {
      // Ensure we always have a properly-encoded hash.
      replaceHashPath(encodedPath);
    } else {
      var location = getDOMLocation();
      var prevLocation = history.location;

      if (!forceNextPop && locationsAreEqual(prevLocation, location)) { return; } // A hashchange doesn't always == location change.

      if (ignorePath === createPath(location)) { return; } // Ignore this change; we already setState in push/replace.

      ignorePath = null;

      handlePop(location);
    }
  };

  var handlePop = function handlePop(location) {
    if (forceNextPop) {
      forceNextPop = false;
      setState();
    } else {
      var action = 'POP';

      transitionManager.confirmTransitionTo(location, action, getUserConfirmation, function (ok) {
        if (ok) {
          setState({ action: action, location: location });
        } else {
          revertPop(location);
        }
      });
    }
  };

  var revertPop = function revertPop(fromLocation) {
    var toLocation = history.location;

    // TODO: We could probably make this more reliable by
    // keeping a list of paths we've seen in sessionStorage.
    // Instead, we just default to 0 for paths we don't know.

    var toIndex = allPaths.lastIndexOf(createPath(toLocation));

    if (toIndex === -1) { toIndex = 0; }

    var fromIndex = allPaths.lastIndexOf(createPath(fromLocation));

    if (fromIndex === -1) { fromIndex = 0; }

    var delta = toIndex - fromIndex;

    if (delta) {
      forceNextPop = true;
      go(delta);
    }
  };

  // Ensure the hash is encoded properly before doing anything else.
  var path = getHashPath();
  var encodedPath = encodePath(path);

  if (path !== encodedPath) { replaceHashPath(encodedPath); }

  var initialLocation = getDOMLocation();
  var allPaths = [createPath(initialLocation)];

  // Public interface

  var createHref = function createHref(location) {
    return '#' + encodePath(basename + createPath(location));
  };

  var push = function push(path, state) {
    browser(state === undefined, 'Hash history cannot push state; it is ignored');

    var action = 'PUSH';
    var location = createLocation(path, undefined, undefined, history.location);

    transitionManager.confirmTransitionTo(location, action, getUserConfirmation, function (ok) {
      if (!ok) { return; }

      var path = createPath(location);
      var encodedPath = encodePath(basename + path);
      var hashChanged = getHashPath() !== encodedPath;

      if (hashChanged) {
        // We cannot tell if a hashchange was caused by a PUSH, so we'd
        // rather setState here and ignore the hashchange. The caveat here
        // is that other hash histories in the page will consider it a POP.
        ignorePath = path;
        pushHashPath(encodedPath);

        var prevIndex = allPaths.lastIndexOf(createPath(history.location));
        var nextPaths = allPaths.slice(0, prevIndex === -1 ? 0 : prevIndex + 1);

        nextPaths.push(path);
        allPaths = nextPaths;

        setState({ action: action, location: location });
      } else {
        browser(false, 'Hash history cannot PUSH the same path; a new entry will not be added to the history stack');

        setState();
      }
    });
  };

  var replace = function replace(path, state) {
    browser(state === undefined, 'Hash history cannot replace state; it is ignored');

    var action = 'REPLACE';
    var location = createLocation(path, undefined, undefined, history.location);

    transitionManager.confirmTransitionTo(location, action, getUserConfirmation, function (ok) {
      if (!ok) { return; }

      var path = createPath(location);
      var encodedPath = encodePath(basename + path);
      var hashChanged = getHashPath() !== encodedPath;

      if (hashChanged) {
        // We cannot tell if a hashchange was caused by a REPLACE, so we'd
        // rather setState here and ignore the hashchange. The caveat here
        // is that other hash histories in the page will consider it a POP.
        ignorePath = path;
        replaceHashPath(encodedPath);
      }

      var prevIndex = allPaths.indexOf(createPath(history.location));

      if (prevIndex !== -1) { allPaths[prevIndex] = path; }

      setState({ action: action, location: location });
    });
  };

  var go = function go(n) {
    browser(canGoWithoutReload, 'Hash history go(n) causes a full page reload in this browser');

    globalHistory.go(n);
  };

  var goBack = function goBack() {
    return go(-1);
  };

  var goForward = function goForward() {
    return go(1);
  };

  var listenerCount = 0;

  var checkDOMListeners = function checkDOMListeners(delta) {
    listenerCount += delta;

    if (listenerCount === 1) {
      addEventListener(window, HashChangeEvent$1, handleHashChange);
    } else if (listenerCount === 0) {
      removeEventListener(window, HashChangeEvent$1, handleHashChange);
    }
  };

  var isBlocked = false;

  var block = function block() {
    var prompt = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;

    var unblock = transitionManager.setPrompt(prompt);

    if (!isBlocked) {
      checkDOMListeners(1);
      isBlocked = true;
    }

    return function () {
      if (isBlocked) {
        isBlocked = false;
        checkDOMListeners(-1);
      }

      return unblock();
    };
  };

  var listen = function listen(listener) {
    var unlisten = transitionManager.appendListener(listener);
    checkDOMListeners(1);

    return function () {
      checkDOMListeners(-1);
      unlisten();
    };
  };

  var history = {
    length: globalHistory.length,
    action: 'POP',
    location: initialLocation,
    createHref: createHref,
    push: push,
    replace: replace,
    go: go,
    goBack: goBack,
    goForward: goForward,
    block: block,
    listen: listen
  };

  return history;
};

var _typeof$1 = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _extends$3 = Object.assign || function (target) {
var arguments$1 = arguments;
 for (var i = 1; i < arguments.length; i++) { var source = arguments$1[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var clamp = function clamp(n, lowerBound, upperBound) {
  return Math.min(Math.max(n, lowerBound), upperBound);
};

/**
 * Creates a history object that stores locations in memory.
 */
var createMemoryHistory = function createMemoryHistory() {
  var props = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var getUserConfirmation = props.getUserConfirmation,
      _props$initialEntries = props.initialEntries,
      initialEntries = _props$initialEntries === undefined ? ['/'] : _props$initialEntries,
      _props$initialIndex = props.initialIndex,
      initialIndex = _props$initialIndex === undefined ? 0 : _props$initialIndex,
      _props$keyLength = props.keyLength,
      keyLength = _props$keyLength === undefined ? 6 : _props$keyLength;


  var transitionManager = createTransitionManager();

  var setState = function setState(nextState) {
    _extends$3(history, nextState);

    history.length = history.entries.length;

    transitionManager.notifyListeners(history.location, history.action);
  };

  var createKey = function createKey() {
    return Math.random().toString(36).substr(2, keyLength);
  };

  var index = clamp(initialIndex, 0, initialEntries.length - 1);
  var entries = initialEntries.map(function (entry) {
    return typeof entry === 'string' ? createLocation(entry, undefined, createKey()) : createLocation(entry, undefined, entry.key || createKey());
  });

  // Public interface

  var createHref = createPath;

  var push = function push(path, state) {
    browser(!((typeof path === 'undefined' ? 'undefined' : _typeof$1(path)) === 'object' && path.state !== undefined && state !== undefined), 'You should avoid providing a 2nd state argument to push when the 1st ' + 'argument is a location-like object that already has state; it is ignored');

    var action = 'PUSH';
    var location = createLocation(path, state, createKey(), history.location);

    transitionManager.confirmTransitionTo(location, action, getUserConfirmation, function (ok) {
      if (!ok) { return; }

      var prevIndex = history.index;
      var nextIndex = prevIndex + 1;

      var nextEntries = history.entries.slice(0);
      if (nextEntries.length > nextIndex) {
        nextEntries.splice(nextIndex, nextEntries.length - nextIndex, location);
      } else {
        nextEntries.push(location);
      }

      setState({
        action: action,
        location: location,
        index: nextIndex,
        entries: nextEntries
      });
    });
  };

  var replace = function replace(path, state) {
    browser(!((typeof path === 'undefined' ? 'undefined' : _typeof$1(path)) === 'object' && path.state !== undefined && state !== undefined), 'You should avoid providing a 2nd state argument to replace when the 1st ' + 'argument is a location-like object that already has state; it is ignored');

    var action = 'REPLACE';
    var location = createLocation(path, state, createKey(), history.location);

    transitionManager.confirmTransitionTo(location, action, getUserConfirmation, function (ok) {
      if (!ok) { return; }

      history.entries[history.index] = location;

      setState({ action: action, location: location });
    });
  };

  var go = function go(n) {
    var nextIndex = clamp(history.index + n, 0, history.entries.length - 1);

    var action = 'POP';
    var location = history.entries[nextIndex];

    transitionManager.confirmTransitionTo(location, action, getUserConfirmation, function (ok) {
      if (ok) {
        setState({
          action: action,
          location: location,
          index: nextIndex
        });
      } else {
        // Mimic the behavior of DOM histories by
        // causing a render after a cancelled POP.
        setState();
      }
    });
  };

  var goBack = function goBack() {
    return go(-1);
  };

  var goForward = function goForward() {
    return go(1);
  };

  var canGo = function canGo(n) {
    var nextIndex = history.index + n;
    return nextIndex >= 0 && nextIndex < history.entries.length;
  };

  var block = function block() {
    var prompt = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
    return transitionManager.setPrompt(prompt);
  };

  var listen = function listen(listener) {
    return transitionManager.appendListener(listener);
  };

  var history = {
    length: entries.length,
    action: 'POP',
    location: entries[index],
    index: index,
    entries: entries,
    createHref: createHref,
    push: push,
    replace: replace,
    go: go,
    goBack: goBack,
    goForward: goForward,
    canGo: canGo,
    block: block,
    listen: listen
  };

  return history;
};

var constants = {
  BROWSER: 'BROWSER',
  MEMORY: 'MEMORY',
  HASH: 'HASH'
};

var Router = function Router(type) {
  if ( type === void 0 ) { type = constants.BROWSER; }

  /**
   * hash history object.
   * @private
   * @type {Object}
   */
  switch (type) {
  case constants.BROWSER:
    this._history = createBrowserHistory();
    break;
  case constants.MEMORY:
    this._history = createMemoryHistory();
    break;
  case constants.HASH:
    this._history = createHashHistory();
    break;
  default:
    break;
  }

  /**
   * routing definitions.
   * @private
   * @type {Array}
   */
  this._routes = [];

  /**
   * function to stop listening for the changes.
   * to stop, just execute this function.
   * @private
   * @type {Function|null}
   */
  this._unlistener = null;

  /**
   * function that will be called on ahead of every routing.
   * @type {Function|null}
   */
  this._onBefore = null;

  /**
   * function that will be called only once on ahead of routing.
   * @type {Function|null}
   */
  this._onBeforeOnce = null;

  /**
   * function that will be called on behind of every routing.
   * @type {Function|null}
   */
  this._onAfter = null;

  /**
   * function that will be called only once on behind of routing.
   * @type {Function|null}
   */
  this._onAfterOnce = null;
};

/**
 * start listening for changes to the current location.
 * @param {Boolean} autoExec to decide whether routing is executed with the current url.
 */
Router.prototype.start = function start (autoExec) {
    var this$1 = this;
    if ( autoExec === void 0 ) { autoExec = true; }

  this._unlistener = this._history.listen(function (location, action) {
    this$1._change(location, action);
  });

  if (autoExec) {
    this._change(this.getCurrentLocation(), this.getCurrentAction());
  }
};

/**
 * stop listening.
 */
Router.prototype.stop = function stop () {
  if (!this._unlistener) {
    return;
  }
  this._unlistener();
  this._unlistener = null;
};

/**
 * register a route.
 * @param {String} pattern express-like url pattern.
 * @param {Function} onEnter a function that will be executed when the route changes.
 * @param {Function} onBefore a function that will be executed before the route changes.
 * @param {Function} onAfter a function that will be executed after the route changes.
 * @return {Router}
 */
Router.prototype.on = function on (pattern, onEnter, onBefore, onAfter) {
  var keys = [];
  var regexp = index(pattern, keys);
  this._routes.push({
    pattern: pattern,
    regexp: regexp,
    keys: keys,
    onEnter: onEnter,
    onBefore: onBefore,
    onAfter: onAfter
  });
  return this;
};

/**
 * register a function to hook just before routing.
 * this function is called on every routing.
 * @param {Function} func
 * @return {Router}
 */
Router.prototype.onBefore = function onBefore (func) {
  this._onBefore = func;
  return this;
};

/**
 * register a function to hook just before routing.
 * this function is called before routing only once.
 * @param {Function} func
 * @return {Router}
 */
Router.prototype.onBeforeOnce = function onBeforeOnce (func) {
  this._onBeforeOnce = func;
  return this;
};

/**
 * register a function to hook just after routing.
 * this function is called on every routing.
 * @param {Function} func
 * @return {Router}
 */
Router.prototype.onAfter = function onAfter (func) {
  this._onAfter = func;
  return this;
};

/**
 * register a function to hook just after routing.
 * this function is called after routing only once.
 * @param {Function} func
 * @return {Router}
 */
Router.prototype.onAfterOnce = function onAfterOnce (func) {
  this._onAfterOnce = func;
  return this;
};

/**
 * navigate to target location.
 * @param {String|Object} path e.g.) '/foo' or { pathname, search, hash }
 */
Router.prototype.navigateTo = function navigateTo (path) {
    var this$1 = this;

  return promise
    .resolve()
    .then(function () {
      if (this$1.getCurrentLocation().pathname === path) {
        console.warn('same path is passed.');
        return;
      }

      this$1._history.push(path);
    });
};

/**
 * replace current location.
 * @param {String|Object} path e.g.) '/foo' or { pathname, search, hash }
 */
Router.prototype.replace = function replace (path) {
    var this$1 = this;

  return promise
    .resolve()
    .then(function () {
      if (this$1.getCurrentLocation().pathname === path) {
        console.warn('same path is passed.');
        return;
      }

      this$1._history.replace(path);
    });
};

/**
 * returns current location.
 * @return {String}
 */
Router.prototype.getCurrentLocation = function getCurrentLocation () {
  return this._history.location;
};

/**
 * returns current action.
 * @return {String}
 */
Router.prototype.getCurrentAction = function getCurrentAction () {
  return this._history.action;
};

/**
 * hash version of `location.href`.
 * @param {String} pathname
 */
Router.prototype.createHref = function createHref (pathname) {
  return this._history.createHref({
    pathname: pathname
  });
};

/**
 * fire route enter event.
 * @private
 * @param {Object} location i.e.) history.location
 * @param {String} action i.e.) history.action
 */
Router.prototype._change = function _change (location/*, action */) {
    var this$1 = this;

  var route = array_1(this._routes, function (route) {
    return !!route.regexp.exec(location.pathname);
  });

  if (!route) {
    return;
  }

  var data = this._parseLocation(location, route);

  // whether the routing was canceled and replaced.
  var isReplaced = false;
  var replace = function (path) {
    isReplaced = true;
    this$1.replace(path);
  };

  promise
    .resolve()
    .then(function () {// onBeforeOnce
      if (!this$1._onBeforeOnce) {
        return promise.resolve();
      }
      var onBeforeOnce = this$1._onBeforeOnce;
      this$1._onBeforeOnce = null;
      return onBeforeOnce(data);
    })
    .then(function () {// onBefore
      if (!this$1._onBefore) {
        return promise.resolve();
      }
      return this$1._onBefore(data);
    })
    .then(function () {// route.onBefore
      if (!route.onBefore) {
        return promise.resolve();
      }
      return route.onBefore(data, replace);
    })
    .then(function () {// route.onEnter
      if (isReplaced || !route.onEnter) {
        return promise.resolve();
      }
      return route.onEnter(data);
    })
    .then(function () {// route.onAfter
      if (isReplaced || !route.onAfter) {
        return promise.resolve();
      }
      return route.onAfter(data);
    })
    .then(function () {// onAfter
      if (isReplaced || !this$1._onAfter) {
        return promise.resolve();
      }
      return this$1._onAfter(data);
    })
    .then(function () {// onAfterOnce
      if (isReplaced || !this$1._onAfterOnce) {
        return promise.resolve();
      }
      var onAfterOnce = this$1._onAfterOnce;
      this$1._onAfterOnce = null;
      return onAfterOnce(data);
    })
    .catch(function (err) {
      console.error(err.message || 'couldn\'t route. check the onBefore and onAfter functions.');
    });
};

/**
 * parse location object.
 * @private
 * @param {Object} location
 * @param {Object} route
 * @return {Object}
 */
Router.prototype._parseLocation = function _parseLocation (location, route) {
  var params = {};
  var list = route.regexp.exec(location.pathname).slice(1);
  array_2(route.keys, function (v, i) {
    params[v.name] = list[i];
  });

  var queries = {};
  array_2(location.search.slice(1).split('&'), function (v) {
    if (!v) {
      return;
    }
    var pair = v.split('=');
    queries[pair[0]] = pair[1];
  });

  var hash = location.hash.slice(1);

  return {
    params: params,
    queries: queries,
    hash: hash,
    pathname: location.pathname
  };
};

Router.BROWSER = constants.BROWSER;
Router.MEMORY = constants.MEMORY;
Router.HASH = constants.HASH;

/**
     * Returns the first argument provided to it.
     */
    function identity$1(val){
        return val;
    }

    var identity_1$1 = identity$1;

/**
     * Returns a function that gets a property of the passed object
     */
    function prop$1(name){
        return function(obj){
            return obj[name];
        };
    }

    var prop_1$1 = prop$1;

/**
     * Safer Object.hasOwnProperty
     */
     function hasOwn$1(obj, prop){
         return Object.prototype.hasOwnProperty.call(obj, prop);
     }

     var hasOwn_1$1 = hasOwn$1;

var _hasDontEnumBug$1;
var _dontEnums$1;

    function checkDontEnum$1(){
        _dontEnums$1 = [
                'toString',
                'toLocaleString',
                'valueOf',
                'hasOwnProperty',
                'isPrototypeOf',
                'propertyIsEnumerable',
                'constructor'
            ];

        _hasDontEnumBug$1 = true;

        for (var key in {'toString': null}) {
            _hasDontEnumBug$1 = false;
        }
    }

    /**
     * Similar to Array/forEach but works over object properties and fixes Don't
     * Enum bug on IE.
     * based on: http://whattheheadsaid.com/2010/10/a-safer-object-keys-compatibility-implementation
     */
    function forIn$1(obj, fn, thisObj){
        var key, i = 0;
        // no need to check if argument is a real object that way we can use
        // it for arrays, functions, date, etc.

        //post-pone check till needed
        if (_hasDontEnumBug$1 == null) { checkDontEnum$1(); }

        for (key in obj) {
            if (exec$1(fn, obj, key, thisObj) === false) {
                break;
            }
        }


        if (_hasDontEnumBug$1) {
            var ctor = obj.constructor,
                isProto = !!ctor && obj === ctor.prototype;

            while (key = _dontEnums$1[i++]) {
                // For constructor, if it is a prototype object the constructor
                // is always non-enumerable unless defined otherwise (and
                // enumerated above).  For non-prototype objects, it will have
                // to be defined on this object, since it cannot be defined on
                // any prototype objects.
                //
                // For other [[DontEnum]] properties, check if the value is
                // different than Object prototype value.
                if (
                    (key !== 'constructor' ||
                        (!isProto && hasOwn_1$1(obj, key))) &&
                    obj[key] !== Object.prototype[key]
                ) {
                    if (exec$1(fn, obj, key, thisObj) === false) {
                        break;
                    }
                }
            }
        }
    }

    function exec$1(fn, obj, key, thisObj){
        return fn.call(thisObj, obj[key], key, obj);
    }

    var forIn_1$1 = forIn$1;

/**
     * Similar to Array/forEach but works over object properties and fixes Don't
     * Enum bug on IE.
     * based on: http://whattheheadsaid.com/2010/10/a-safer-object-keys-compatibility-implementation
     */
    function forOwn$1(obj, fn, thisObj){
        forIn_1$1(obj, function(val, key){
            if (hasOwn_1$1(obj, key)) {
                return fn.call(thisObj, obj[key], key, obj);
            }
        });
    }

    var forOwn_1$1 = forOwn$1;

/**
     * Gets the "kind" of value. (e.g. "String", "Number", etc)
     */
    function kindOf$1(val) {
        return Object.prototype.toString.call(val).slice(8, -1);
    }
    var kindOf_1$1 = kindOf$1;

/**
     * Check if value is from a specific "kind".
     */
    function isKind$1(val, kind){
        return kindOf_1$1(val) === kind;
    }
    var isKind_1$1 = isKind$1;

/**
     */
    var isArray$1 = Array.isArray || function (val) {
        return isKind_1$1(val, 'Array');
    };
    var isArray_1$1 = isArray$1;

function containsMatch$1(array, pattern) {
        var i = -1, length = array.length;
        while (++i < length) {
            if (deepMatches$1(array[i], pattern)) {
                return true;
            }
        }

        return false;
    }

    function matchArray$1(target, pattern) {
        var i = -1, patternLength = pattern.length;
        while (++i < patternLength) {
            if (!containsMatch$1(target, pattern[i])) {
                return false;
            }
        }

        return true;
    }

    function matchObject$1(target, pattern) {
        var result = true;
        forOwn_1$1(pattern, function(val, key) {
            if (!deepMatches$1(target[key], val)) {
                // Return false to break out of forOwn early
                return (result = false);
            }
        });

        return result;
    }

    /**
     * Recursively check if the objects match.
     */
    function deepMatches$1(target, pattern){
        if (target && typeof target === 'object' &&
            pattern && typeof pattern === 'object') {
            if (isArray_1$1(target) && isArray_1$1(pattern)) {
                return matchArray$1(target, pattern);
            } else {
                return matchObject$1(target, pattern);
            }
        } else {
            return target === pattern;
        }
    }

    var deepMatches_1$1 = deepMatches$1;

/**
     * Converts argument into a valid iterator.
     * Used internally on most array/object/collection methods that receives a
     * callback/iterator providing a shortcut syntax.
     */
    function makeIterator$1(src, thisObj){
        if (src == null) {
            return identity_1$1;
        }
        switch(typeof src) {
            case 'function':
                // function is the first to improve perf (most common case)
                // also avoid using `Function#call` if not needed, which boosts
                // perf a lot in some cases
                return (typeof thisObj !== 'undefined')? function(val, i, arr){
                    return src.call(thisObj, val, i, arr);
                } : src;
            case 'object':
                return function(val){
                    return deepMatches_1$1(val, src);
                };
            case 'string':
            case 'number':
                return prop_1$1(src);
        }
    }

    var makeIterator_$1 = makeIterator$1;

/**
     * Array reject
     */
    function reject$1(arr, callback, thisObj) {
        callback = makeIterator_$1(callback, thisObj);
        var results = [];
        if (arr == null) {
            return results;
        }

        var i = -1, len = arr.length, value;
        while (++i < len) {
            value = arr[i];
            if (!callback(value, i, arr)) {
                results.push(value);
            }
        }

        return results;
    }

    var reject_1$1 = reject$1;

/*
object-assign
(c) Sindre Sorhus
@license MIT
*/

'use strict';
/* eslint-disable no-unused-vars */
var getOwnPropertySymbols = Object.getOwnPropertySymbols;
var hasOwnProperty = Object.prototype.hasOwnProperty;
var propIsEnumerable = Object.prototype.propertyIsEnumerable;

function toObject(val) {
	if (val === null || val === undefined) {
		throw new TypeError('Object.assign cannot be called with null or undefined');
	}

	return Object(val);
}

function shouldUseNative() {
	try {
		if (!Object.assign) {
			return false;
		}

		// Detect buggy property enumeration order in older V8 versions.

		// https://bugs.chromium.org/p/v8/issues/detail?id=4118
		var test1 = new String('abc');  // eslint-disable-line no-new-wrappers
		test1[5] = 'de';
		if (Object.getOwnPropertyNames(test1)[0] === '5') {
			return false;
		}

		// https://bugs.chromium.org/p/v8/issues/detail?id=3056
		var test2 = {};
		for (var i = 0; i < 10; i++) {
			test2['_' + String.fromCharCode(i)] = i;
		}
		var order2 = Object.getOwnPropertyNames(test2).map(function (n) {
			return test2[n];
		});
		if (order2.join('') !== '0123456789') {
			return false;
		}

		// https://bugs.chromium.org/p/v8/issues/detail?id=3056
		var test3 = {};
		'abcdefghijklmnopqrst'.split('').forEach(function (letter) {
			test3[letter] = letter;
		});
		if (Object.keys(Object.assign({}, test3)).join('') !==
				'abcdefghijklmnopqrst') {
			return false;
		}

		return true;
	} catch (err) {
		// We don't expect any of the above to throw, but better to be safe.
		return false;
	}
}

var objectAssign = shouldUseNative() ? Object.assign : function (target, source) {
	var from;
	var to = toObject(target);
	var symbols;

	for (var s = 1; s < arguments.length; s++) {
		from = Object(arguments[s]);

		for (var key in from) {
			if (hasOwnProperty.call(from, key)) {
				to[key] = from[key];
			}
		}

		if (getOwnPropertySymbols) {
			symbols = getOwnPropertySymbols(from);
			for (var i = 0; i < symbols.length; i++) {
				if (propIsEnumerable.call(from, symbols[i])) {
					to[symbols[i]] = from[symbols[i]];
				}
			}
		}
	}

	return to;
};

var application$2 = {
  // 起動状態。
  isLaunched: false,
  // 画面遷移中か否か。
  isNavigating: false,
  // 通信中のAPI群。
  networkings: [],
  // 通信中か否か(i.e. 一つでも通信中のAPIが存在するか?)
  isNetworking: false,
  // ドラッグ中か否か。
  isDragging: false,
  // エンドポイントページに用いるエンドポイントフィルター用のテキスト。
  endpointFilterText: ''
};

// 選択された`page`に関する`component`群。
// `component` = 画面中央に表示される各要素。
var components = {};

var store = createCommonjsModule(function (module, exports) {
"use strict"
// Module export pattern from
// https://github.com/umdjs/umd/blob/master/returnExports.js
;(function (root, factory) {
    if (typeof undefined === 'function' && undefined.amd) {
        // AMD. Register as an anonymous module.
        undefined([], factory);
    } else {
        // Node. Does not work with strict CommonJS, but
        // only CommonJS-like environments that support module.exports,
        // like Node.
        module.exports = factory();
    }
}(commonjsGlobal, function () {
	
	// Store.js
	var store = {},
		win = (typeof window != 'undefined' ? window : commonjsGlobal),
		doc = win.document,
		localStorageName = 'localStorage',
		scriptTag = 'script',
		storage;

	store.disabled = false;
	store.version = '1.3.20';
	store.set = function(key, value) {};
	store.get = function(key, defaultVal) {};
	store.has = function(key) { return store.get(key) !== undefined };
	store.remove = function(key) {};
	store.clear = function() {};
	store.transact = function(key, defaultVal, transactionFn) {
		if (transactionFn == null) {
			transactionFn = defaultVal;
			defaultVal = null;
		}
		if (defaultVal == null) {
			defaultVal = {};
		}
		var val = store.get(key, defaultVal);
		transactionFn(val);
		store.set(key, val);
	};
	store.getAll = function() {};
	store.forEach = function() {};

	store.serialize = function(value) {
		return JSON.stringify(value)
	};
	store.deserialize = function(value) {
		if (typeof value != 'string') { return undefined }
		try { return JSON.parse(value) }
		catch(e) { return value || undefined }
	};

	// Functions to encapsulate questionable FireFox 3.6.13 behavior
	// when about.config::dom.storage.enabled === false
	// See https://github.com/marcuswestin/store.js/issues#issue/13
	function isLocalStorageNameSupported() {
		try { return (localStorageName in win && win[localStorageName]) }
		catch(err) { return false }
	}

	if (isLocalStorageNameSupported()) {
		storage = win[localStorageName];
		store.set = function(key, val) {
			if (val === undefined) { return store.remove(key) }
			storage.setItem(key, store.serialize(val));
			return val
		};
		store.get = function(key, defaultVal) {
			var val = store.deserialize(storage.getItem(key));
			return (val === undefined ? defaultVal : val)
		};
		store.remove = function(key) { storage.removeItem(key); };
		store.clear = function() { storage.clear(); };
		store.getAll = function() {
			var ret = {};
			store.forEach(function(key, val) {
				ret[key] = val;
			});
			return ret
		};
		store.forEach = function(callback) {
			for (var i=0; i<storage.length; i++) {
				var key = storage.key(i);
				callback(key, store.get(key));
			}
		};
	} else if (doc && doc.documentElement.addBehavior) {
		var storageOwner,
			storageContainer;
		// Since #userData storage applies only to specific paths, we need to
		// somehow link our data to a specific path.  We choose /favicon.ico
		// as a pretty safe option, since all browsers already make a request to
		// this URL anyway and being a 404 will not hurt us here.  We wrap an
		// iframe pointing to the favicon in an ActiveXObject(htmlfile) object
		// (see: http://msdn.microsoft.com/en-us/library/aa752574(v=VS.85).aspx)
		// since the iframe access rules appear to allow direct access and
		// manipulation of the document element, even for a 404 page.  This
		// document can be used instead of the current document (which would
		// have been limited to the current path) to perform #userData storage.
		try {
			storageContainer = new ActiveXObject('htmlfile');
			storageContainer.open();
			storageContainer.write('<'+scriptTag+'>document.w=window</'+scriptTag+'><iframe src="/favicon.ico"></iframe>');
			storageContainer.close();
			storageOwner = storageContainer.w.frames[0].document;
			storage = storageOwner.createElement('div');
		} catch(e) {
			// somehow ActiveXObject instantiation failed (perhaps some special
			// security settings or otherwse), fall back to per-path storage
			storage = doc.createElement('div');
			storageOwner = doc.body;
		}
		var withIEStorage = function(storeFunction) {
			return function() {
				var args = Array.prototype.slice.call(arguments, 0);
				args.unshift(storage);
				// See http://msdn.microsoft.com/en-us/library/ms531081(v=VS.85).aspx
				// and http://msdn.microsoft.com/en-us/library/ms531424(v=VS.85).aspx
				storageOwner.appendChild(storage);
				storage.addBehavior('#default#userData');
				storage.load(localStorageName);
				var result = storeFunction.apply(store, args);
				storageOwner.removeChild(storage);
				return result
			}
		};

		// In IE7, keys cannot start with a digit or contain certain chars.
		// See https://github.com/marcuswestin/store.js/issues/40
		// See https://github.com/marcuswestin/store.js/issues/83
		var forbiddenCharsRegex = new RegExp("[!\"#$%&'()*+,/\\\\:;<=>?@[\\]^`{|}~]", "g");
		var ieKeyFix = function(key) {
			return key.replace(/^d/, '___$&').replace(forbiddenCharsRegex, '___')
		};
		store.set = withIEStorage(function(storage, key, val) {
			key = ieKeyFix(key);
			if (val === undefined) { return store.remove(key) }
			storage.setAttribute(key, store.serialize(val));
			storage.save(localStorageName);
			return val
		});
		store.get = withIEStorage(function(storage, key, defaultVal) {
			key = ieKeyFix(key);
			var val = store.deserialize(storage.getAttribute(key));
			return (val === undefined ? defaultVal : val)
		});
		store.remove = withIEStorage(function(storage, key) {
			key = ieKeyFix(key);
			storage.removeAttribute(key);
			storage.save(localStorageName);
		});
		store.clear = withIEStorage(function(storage) {
			var attributes = storage.XMLDocument.documentElement.attributes;
			storage.load(localStorageName);
			for (var i=attributes.length-1; i>=0; i--) {
				storage.removeAttribute(attributes[i].name);
			}
			storage.save(localStorageName);
		});
		store.getAll = function(storage) {
			var ret = {};
			store.forEach(function(key, val) {
				ret[key] = val;
			});
			return ret
		};
		store.forEach = withIEStorage(function(storage, callback) {
			var attributes = storage.XMLDocument.documentElement.attributes;
			for (var i=0, attr; attr=attributes[i]; ++i) {
				callback(attr.name, store.deserialize(storage.getAttribute(attr.name)));
			}
		});
	}

	try {
		var testKey = '__storejs__';
		store.set(testKey, testKey);
		if (store.get(testKey) != testKey) { store.disabled = true; }
		store.remove(testKey);
	} catch(e) {
		store.disabled = true;
	}
	store.enabled = !store.disabled;
	
	return store
}));
});

// 選択されているエンドポイント。
var current = store.get('current', null);

// `/viron`のデータ。
var viron = null;

var drawers = [];

// ローカルに保存されているエンドポイント一覧。
var endpoints = store.get('endpoints', {});

var constants$4 = {
  // mobileとdesktopレイアウトの切り替え閾値。
  layoutThreshold: 640,
  // レイアウトタイプ。mobile or desktop用。
  layoutTypeDesktop: 'desktop',
  layoutTypeMobile: 'mobile',

  // 認証方法。
  authtypeEmail: 'email',
  authtypeOauth: 'oauth'
};

var layout = {
  // レイアウトタイプ。mobile or desktop。
  type: (() => {
    const width = window.innerWidth;
    if (width > constants$4.layoutThreshold) {
      return constants$4.layoutTypeDesktop;
    }
    return constants$4.layoutTypeMobile;
  })(),
  // 表示サイズ。
  size: {
    width: window.innerWidth,
    height: window.innerHeight
  },
  // componentリストのgridレイアウトのcolumn数。
  componentsGridColumnCount: (() => {
    const htmlStyles = window.getComputedStyle(document.querySelector('html'));
    const columnCount = Number(htmlStyles.getPropertyValue('--page-components-grid-column-count'));
    return columnCount;
  })()
};

var location$1 = {
  // 表示中のページ名。
  name: '',
  // ルーティング情報。
  route: {
    params: {},
    queries: {},
    hash: ''
  }
};

var modals = [];

// OpenAPI Specificationに関する情報。
var oas = {
  // SwaggerClientによって生成されたSwaggerClientインスタンス。
  // resolve済みのOpenAPI Document情報やhttpクライアント等が格納されている。
  // @see: https://github.com/swagger-api/swagger-js#constructor-and-methods
  client: null
};

// 選択中の`page`情報。
// `page` = 左メニュー(viron)の一要素。
var page = null;

var popovers = [];

var signinShowKey = null;

var toasts = [];

var ua = {};

const constants$3 = {
  APPLICATION: 'APPLICATION',
  COMPONENTS: 'COMPONENTS',
  COMPONENTS_ONE: riotId => {
    return `component_${riotId}`;
  },
  CURRENT: 'CURRENT',
  VIRON: 'VIRON',
  OAS: 'OAS',
  DRAWERS: 'DRAWERS',
  ENDPOINTS: 'ENDPOINTS',
  LAYOUT: 'LAYOUT',
  LOCATION: 'LOCATION',
  MODALS: 'MODALS',
  PAGE: 'PAGE',
  POPOVERS: 'POPOVERS',
  SIGNIN_SHOW_KEY: 'SIGNIN_SHOW_KEY',
  TOASTS: 'TOASTS',
  UA: 'UA'
};

var states = {
  application: application$2,
  components,
  current,
  viron,
  oas,
  drawers,
  endpoints,
  layout,
  location: location$1,
  modals,
  page,
  popovers,
  signinShowKey,
  toasts,
  ua
};

var application$1 = {
  /**
   * 起動ステータスを変更します。
   * @param {riotx.Context} context
   * @param {Boolean} bool
   * @return {Array}
   */
  launch: (context, bool) => {
    context.state.application.isLaunched = bool;
    return [constants$3.APPLICATION];
  },

  /**
   * 画面遷移ステータスを変更します。
   * @param {riotx.Context} context
   * @param {Boolean} bool
   * @return {Array}
   */
  navigation: (context, bool) => {
    context.state.application.isNavigating = bool;
    return [constants$3.APPLICATION];
  },

  /**
   * 通信中APIを追加します。
   * @param {riotx.Context} context
   * @param {Object} info
   * @return {Array}
   */
  addNetworking: (context, info) => {
    context.state.application.networkings.push(objectAssign({
      id: `networking_${Date.now()}`
    }, info));
    context.state.application.isNetworking = true;
    return [constants$3.APPLICATION];
  },

  /**
   * 通信中APIを削除します。
   * @param {riotx.Context} context
   * @param {String} networkingId
   * @return {Array}
   */
  removeNetworking: (context, networkingId) => {
    context.state.application.networkings = reject_1$1(context.state.application.networkings, networking => {
      return (networking.id === networkingId);
    });
    if (!context.state.application.networkings.length) {
      context.state.application.isNetworking = false;
    }
    return [constants$3.APPLICATION];
  },

  /**
   * ドラッグステータスを変更します。
   * @param {riotx.Context} context
   * @param {Boolean} bool
   * @return {Array}
   */
  drag: (context, bool) => {
    context.state.application.isDragging = bool;
    return [constants$3.APPLICATION];
  },

  /**
   * エンドポイント用のフィルターテキストを更新します。
   * @param {riotx.Context} context
   * @param {String} newFilterText
   * @return {Array}
   */
  endpointFilterText: (context, newFilterText) => {
    context.state.application.endpointFilterText = newFilterText;
    return [constants$3.APPLICATION];
  }
};

var components$1 = {
  /**
   * 一件更新します。
   * @param {riotx.Context} context
   * @param {Object} params
   * @return {Array}
   */
  updateOne: (context, params) => {
    const component_uid = params.component_uid;
    // 存在しなければ新規作成。
    context.state.components[component_uid] = params;
    return [constants$3.COMPONENTS, constants$3.COMPONENTS_ONE(component_uid)];
  },

  /**
   * 一件削除します。
   * @param {riotx.Context} context
   * @param {String} component_uid
   * @return {Array}
   */
  removeOne: (context, component_uid) => {
    delete context.state.components[component_uid];
    return [constants$3.COMPONENTS, constants$3.COMPONENTS_ONE(component_uid)];
  },

  /**
   * 全件削除します。
   * @param {riotx.Context} context
   * @return {Array}
   */
  removeAll: context => {
    context.state.components = {};
    return [constants$3.COMPONENTS, constants$3.COMPONENTS];
  }
};

var current$1 = {
  /**
   * 値書き換え。
   * @param {riotx.Context} context
   * @param {String} endpointKey
   * @return {Array}
   */
  all: (context, endpointKey) => {
    context.state.current = store.set(constants$3.CURRENT, endpointKey);
    return [constants$3.CURRENT];
  }
};

/**
     * Array.indexOf
     */
    function indexOf$1(arr, item, fromIndex) {
        fromIndex = fromIndex || 0;
        if (arr == null) {
            return -1;
        }

        var len = arr.length,
            i = fromIndex < 0 ? len + fromIndex : fromIndex;
        while (i < len) {
            // we iterate over sparse items since there is no way to make it
            // work properly on IE 7-8. see #64
            if (arr[i] === item) {
                return i;
            }

            i++;
        }

        return -1;
    }

    var indexOf_1$1 = indexOf$1;

/**
     * Combines an array with all the items of another.
     * Does not allow duplicates and is case and type sensitive.
     */
    function combine$1(arr1, arr2) {
        if (arr2 == null) {
            return arr1;
        }

        var i = -1, len = arr2.length;
        while (++i < len) {
            if (indexOf_1$1(arr1, arr2[i]) === -1) {
                arr1.push(arr2[i]);
            }
        }

        return arr1;
    }
    var combine_1$1 = combine$1;

/**
     * Returns the index of the first item that matches criteria
     */
    function findIndex$1(arr, iterator, thisObj){
        iterator = makeIterator_$1(iterator, thisObj);
        if (arr == null) {
            return -1;
        }

        var i = -1, len = arr.length;
        while (++i < len) {
            if (iterator(arr[i], i, arr)) {
                return i;
            }
        }

        return -1;
    }

    var findIndex_1$1 = findIndex$1;

/**
     * Returns first item that matches criteria
     */
    function find$1(arr, iterator, thisObj){
        var idx = findIndex_1$1(arr, iterator, thisObj);
        return idx >= 0? arr[idx] : void(0);
    }

    var find_1$1 = find$1;

var viron$1 = {
  /**
   * @param {riotx.Context} context
   * @param {Object|null} viron
   * @return {Array}
   */
  all: (context, viron) => {
    // メニューのカテゴライズ。下位互換のため、dashboardとmanageは必須項目とする。
    if (!!viron) {
      viron.sections = viron.sections || [];
      if (!find_1$1(viron.sections, section => {
        return (section.id === 'manage');
      })) {
        viron.sections = combine_1$1([{ id: 'manage', label: '管理画面' }], viron.sections);
      }
      if (!find_1$1(viron.sections, section => {
        return (section.id === 'dashboard');
      })) {
        viron.sections = combine_1$1([{ id: 'dashboard', label: 'ダッシュボード' }], viron.sections);
      }
    }
    context.state.viron = viron;
    return [constants$3.VIRON];
  }
};

var drawers$1 = {
  /**
   * ドローワーを追加します。
   * @param {riotx.Context} context
   * @param {String} tagName
   * @param {Object} tagOpts
   * @param {Object} drawerOpts
   * @return {Array}
   */
  add: (context, tagName, tagOpts, drawerOpts) => {
    if ( tagOpts === void 0 ) tagOpts = {};
    if ( drawerOpts === void 0 ) drawerOpts = {};

    context.state.drawers.push({
      id: `drawer_${Date.now()}`,
      tagName,
      tagOpts,
      drawerOpts
    });
    return [constants$3.DRAWERS];
  },

  /**
   * ドローワーを削除します。
   * @param {riotx.Context} context
   * @param {String} drawerID
   * @return {Array}
   */
  remove: (context, drawerID) => {
    context.state.drawers = reject_1$1(context.state.drawers, drawer => {
      return (drawer.id === drawerID);
    });
    return [constants$3.DRAWERS];
  }
};

/**
     * Array forEach
     */
    function forEach$1(arr, callback, thisObj) {
        if (arr == null) {
            return;
        }
        var i = -1,
            len = arr.length;
        while (++i < len) {
            // we iterate over sparse items since there is no way to make it
            // work properly on IE 7-8. see #64
            if ( callback.call(thisObj, arr[i], i, arr) === false ) {
                break;
            }
        }
    }

    var forEach_1$1 = forEach$1;

/**
     * Merge sort (http://en.wikipedia.org/wiki/Merge_sort)
     */
    function mergeSort$1(arr, compareFn) {
        if (arr == null) {
            return [];
        } else if (arr.length < 2) {
            return arr;
        }

        if (compareFn == null) {
            compareFn = defaultCompare$1;
        }

        var mid, left, right;

        mid   = ~~(arr.length / 2);
        left  = mergeSort$1( arr.slice(0, mid), compareFn );
        right = mergeSort$1( arr.slice(mid, arr.length), compareFn );

        return merge$1(left, right, compareFn);
    }

    function defaultCompare$1(a, b) {
        return a < b ? -1 : (a > b? 1 : 0);
    }

    function merge$1(left, right, compareFn) {
        var result = [];

        while (left.length && right.length) {
            if (compareFn(left[0], right[0]) <= 0) {
                // if 0 it should preserve same order (stable)
                result.push(left.shift());
            } else {
                result.push(right.shift());
            }
        }

        if (left.length) {
            result.push.apply(result, left);
        }

        if (right.length) {
            result.push.apply(result, right);
        }

        return result;
    }

    var sort$1 = mergeSort$1;

/*
     * Sort array by the result of the callback
     */
    function sortBy$1(arr, callback, context){
        callback = makeIterator_$1(callback, context);

        return sort$1(arr, function(a, b) {
            a = callback(a);
            b = callback(b);
            return (a < b) ? -1 : ((a > b) ? 1 : 0);
        });
    }

    var sortBy_1$1 = sortBy$1;

/**
     */
    function isNumber(val) {
        return isKind_1$1(val, 'Number');
    }
    var isNumber_1 = isNumber;

/**
     * Object some
     */
    function some$1(obj, callback, thisObj) {
        callback = makeIterator_$1(callback, thisObj);
        var result = false;
        forOwn_1$1(obj, function(val, key) {
            if (callback(val, key, obj)) {
                result = true;
                return false; // break
            }
        });
        return result;
    }

    var some_1$1 = some$1;

/**
     * Returns first item that matches criteria
     */
    function find$3(obj, callback, thisObj) {
        callback = makeIterator_$1(callback, thisObj);
        var result;
        some_1$1(obj, function(value, key, obj) {
            if (callback(value, key, obj)) {
                result = value;
                return true; //break
            }
        });
        return result;
    }

    var find_1$2 = find$3;

'use strict';

// Found this seed-based random generator somewhere
// Based on The Central Randomizer 1.3 (C) 1997 by Paul Houle (houle@msc.cornell.edu)

var seed = 1;

/**
 * return a random number based on a seed
 * @param seed
 * @returns {number}
 */
function getNextValue() {
    seed = (seed * 9301 + 49297) % 233280;
    return seed/(233280.0);
}

function setSeed$1(_seed_) {
    seed = _seed_;
}

var randomFromSeed = {
    nextValue: getNextValue,
    seed: setSeed$1
};

'use strict';



var ORIGINAL = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ_-';
var alphabet;
var previousSeed;

var shuffled;

function reset() {
    shuffled = false;
}

function setCharacters(_alphabet_) {
    if (!_alphabet_) {
        if (alphabet !== ORIGINAL) {
            alphabet = ORIGINAL;
            reset();
        }
        return;
    }

    if (_alphabet_ === alphabet) {
        return;
    }

    if (_alphabet_.length !== ORIGINAL.length) {
        throw new Error('Custom alphabet for shortid must be ' + ORIGINAL.length + ' unique characters. You submitted ' + _alphabet_.length + ' characters: ' + _alphabet_);
    }

    var unique = _alphabet_.split('').filter(function(item, ind, arr){
       return ind !== arr.lastIndexOf(item);
    });

    if (unique.length) {
        throw new Error('Custom alphabet for shortid must be ' + ORIGINAL.length + ' unique characters. These characters were not unique: ' + unique.join(', '));
    }

    alphabet = _alphabet_;
    reset();
}

function characters(_alphabet_) {
    setCharacters(_alphabet_);
    return alphabet;
}

function setSeed(seed) {
    randomFromSeed.seed(seed);
    if (previousSeed !== seed) {
        reset();
        previousSeed = seed;
    }
}

function shuffle$1() {
    if (!alphabet) {
        setCharacters(ORIGINAL);
    }

    var sourceArray = alphabet.split('');
    var targetArray = [];
    var r = randomFromSeed.nextValue();
    var characterIndex;

    while (sourceArray.length > 0) {
        r = randomFromSeed.nextValue();
        characterIndex = Math.floor(r * sourceArray.length);
        targetArray.push(sourceArray.splice(characterIndex, 1)[0]);
    }
    return targetArray.join('');
}

function getShuffled() {
    if (shuffled) {
        return shuffled;
    }
    shuffled = shuffle$1();
    return shuffled;
}

/**
 * lookup shuffled letter
 * @param index
 * @returns {string}
 */
function lookup(index) {
    var alphabetShuffled = getShuffled();
    return alphabetShuffled[index];
}

var alphabet_1 = {
    characters: characters,
    seed: setSeed,
    lookup: lookup,
    shuffled: getShuffled
};

'use strict';

var crypto = typeof window === 'object' && (window.crypto || window.msCrypto); // IE 11 uses window.msCrypto

function randomByte() {
    if (!crypto || !crypto.getRandomValues) {
        return Math.floor(Math.random() * 256) & 0x30;
    }
    var dest = new Uint8Array(1);
    crypto.getRandomValues(dest);
    return dest[0] & 0x30;
}

var randomByteBrowser = randomByte;

'use strict';



function encode(lookup, number) {
    var loopCounter = 0;
    var done;

    var str = '';

    while (!done) {
        str = str + lookup( ( (number >> (4 * loopCounter)) & 0x0f ) | randomByteBrowser() );
        done = number < (Math.pow(16, loopCounter + 1 ) );
        loopCounter++;
    }
    return str;
}

var encode_1 = encode;

'use strict';


/**
 * Decode the id to get the version and worker
 * Mainly for debugging and testing.
 * @param id - the shortid-generated id.
 */
function decode(id) {
    var characters = alphabet_1.shuffled();
    return {
        version: characters.indexOf(id.substr(0, 1)) & 0x0f,
        worker: characters.indexOf(id.substr(1, 1)) & 0x0f
    };
}

var decode_1 = decode;

'use strict';




// Ignore all milliseconds before a certain time to reduce the size of the date entropy without sacrificing uniqueness.
// This number should be updated every year or so to keep the generated id short.
// To regenerate `new Date() - 0` and bump the version. Always bump the version!
var REDUCE_TIME = 1459707606518;

// don't change unless we change the algos or REDUCE_TIME
// must be an integer and less than 16
var version = 6;

// Counter is used when shortid is called multiple times in one second.
var counter;

// Remember the last time shortid was called in case counter is needed.
var previousSeconds;

/**
 * Generate unique id
 * Returns string id
 */
function build(clusterWorkerId) {

    var str = '';

    var seconds = Math.floor((Date.now() - REDUCE_TIME) * 0.001);

    if (seconds === previousSeconds) {
        counter++;
    } else {
        counter = 0;
        previousSeconds = seconds;
    }

    str = str + encode_1(alphabet_1.lookup, version);
    str = str + encode_1(alphabet_1.lookup, clusterWorkerId);
    if (counter > 0) {
        str = str + encode_1(alphabet_1.lookup, counter);
    }
    str = str + encode_1(alphabet_1.lookup, seconds);

    return str;
}

var build_1 = build;

'use strict';


function isShortId(id) {
    if (!id || typeof id !== 'string' || id.length < 6 ) {
        return false;
    }

    var characters = alphabet_1.characters();
    var len = id.length;
    for(var i = 0; i < len;i++) {
        if (characters.indexOf(id[i]) === -1) {
            return false;
        }
    }
    return true;
}

var isValid = isShortId;

'use strict';

var clusterWorkerIdBrowser = 0;

var lib = createCommonjsModule(function (module) {
'use strict';







// if you are using cluster or multiple servers use this to make each instance
// has a unique value for worker
// Note: I don't know if this is automatically set when using third
// party cluster solutions such as pm2.
var clusterWorkerId = clusterWorkerIdBrowser || 0;

/**
 * Set the seed.
 * Highly recommended if you don't want people to try to figure out your id schema.
 * exposed as shortid.seed(int)
 * @param seed Integer value to seed the random alphabet.  ALWAYS USE THE SAME SEED or you might get overlaps.
 */
function seed(seedValue) {
    alphabet_1.seed(seedValue);
    return module.exports;
}

/**
 * Set the cluster worker or machine id
 * exposed as shortid.worker(int)
 * @param workerId worker must be positive integer.  Number less than 16 is recommended.
 * returns shortid module so it can be chained.
 */
function worker(workerId) {
    clusterWorkerId = workerId;
    return module.exports;
}

/**
 *
 * sets new characters to use in the alphabet
 * returns the shuffled alphabet
 */
function characters(newCharacters) {
    if (newCharacters !== undefined) {
        alphabet_1.characters(newCharacters);
    }

    return alphabet_1.shuffled();
}

/**
 * Generate unique id
 * Returns string id
 */
function generate() {
  return build_1(clusterWorkerId);
}

// Export all other functions as properties of the generate function
module.exports = generate;
module.exports.generate = generate;
module.exports.seed = seed;
module.exports.worker = worker;
module.exports.characters = characters;
module.exports.decode = decode_1;
module.exports.isValid = isValid;
});

'use strict';
var shortid = lib;

/**
 * 受け取ったエンドポイント群をきれいに並び替えます。
 * order値が存在しない場合は後方に配置されます。
 * @param {Object} endpoints
 * @return {Object}
 */
const putEndpointsInOrder = endpoints => {
  // どのorder値よりも大きいであろう適当な値。
  const bigNumber = 9999;
  let ordered = [];
  forOwn_1$1(endpoints, (endpoint, key) => {
    ordered.push({
      key,
      order: (isNumber_1(endpoint.order) ? endpoint.order : bigNumber)
    });
  });
  ordered = sortBy_1$1(ordered, obj => {
    return obj.order;
  });
  forEach_1$1(ordered, (obj, order) => {
    endpoints[obj.key].order = order;
  });
  return endpoints;
};

var endpoints$1 = {
  /**
   * 1件のエンドポイントを追加します。
   * @param {riotx.Context} context
   * @param {String} endpointKey
   * @param {Object} endpoint
   * @return {Array}
   */
  add: (context, endpointKey, endpoint) => {
    // order値が指定されていなければ自動的に設定する。
    if (!isNumber_1(endpoint.order)) {
      // リストの先頭に配置するために意図的にマイナス値を付与。
      endpoint.order = -1;
    }
    let newEndpoints = objectAssign({}, context.state.endpoints);
    newEndpoints[endpointKey] = endpoint;
    newEndpoints = putEndpointsInOrder(newEndpoints);
    context.state.endpoints = newEndpoints;
    store.set('endpoints', context.state.endpoints);
    return [constants$3.ENDPOINTS];
  },

  /**
   * 指定されたエンドポイントを削除します。
   * @param {riotx.Context} context
   * @param {String} endpointKey
   * @return {Array}
   */
  remove: (context, endpointKey) => {
    let newEndpoints = objectAssign({}, context.state.endpoints);
    delete newEndpoints[endpointKey];
    newEndpoints = putEndpointsInOrder(newEndpoints);
    context.state.endpoints = newEndpoints;
    store.set('endpoints', context.state.endpoints);
    return [constants$3.ENDPOINTS];
  },

  /**
   * 全てのエンドポイントを削除します。
   * @param {riotx.Context} context
   * @return {Array}
   */
  removeAll: context => {
    context.state.endpoints = {};
    store.set('endpoints', context.state.endpoints);
    return [constants$3.ENDPOINTS];
  },

  /**
   * 指定されたエンドポイントを更新します。
   * @param {riotx.Context} context
   * @param {String} endpointKey
   * @param {Object} endpoint
   * @return {Array}
   */
  update: (context, endpointKey, endpoint) => {
    if (!endpoint) {
      context.state.endpoints[endpointKey] = null;
    } else {
      context.state.endpoints[endpointKey] = objectAssign({}, context.state.endpoints[endpointKey], endpoint);
    }
    store.set('endpoints', context.state.endpoints);
    return [constants$3.ENDPOINTS];
  },

  /**
   * 指定されたエンドポイントのtokenを更新します。
   * @param {riotx.Context} context
   * @param {String} endpointKey
   * @param {String|null} token
   * @return {Array}
   */
  updateToken: (context, endpointKey, token) => {
    if (!!context.state.endpoints[endpointKey]) {
      context.state.endpoints[endpointKey].token = token;
    }
    store.set('endpoints', context.state.endpoints);
    return [constants$3.ENDPOINTS];
  },

  /**
   * 新エンドポイント群をmergeします。
   * @param {riotx.Context} context
   * @param {Object} endpoints
   * @return {Array}
   */
  mergeAll: (context, endpoints) => {
    let modifiedEndpoints = objectAssign({}, context.state.endpoints);

    forOwn_1$1(endpoints, endpoint => {
      let duplicatedEndpoint = find_1$2(modifiedEndpoints, val => {
        return endpoint.url === val.url;
      });

      if (!duplicatedEndpoint) {
        const key = shortid.generate();
        modifiedEndpoints[key] = endpoint;
      } else {
        objectAssign(duplicatedEndpoint, endpoint);
      }
    });

    modifiedEndpoints = putEndpointsInOrder(modifiedEndpoints);
    context.state.endpoints = modifiedEndpoints;
    store.set('endpoints', modifiedEndpoints);
    return [constants$3.ENDPOINTS];
  },

  /**
   * エンドポイント群のorder値を整理します。
   * order値が存在しない場合は後方に配置されます。
   * @param {riotx.Context} context
   * @return {Array}
   */
  tidyUpOrder: context => {
    const newEndpoints = putEndpointsInOrder(objectAssign(context.state.endpoints));
    context.state.endpoints = newEndpoints;
    store.set('endpoints', newEndpoints);
    return [constants$3.ENDPOINTS];
  },

  /**
   * 指定されたエンドポイントのorder値を変更します。
   * 他エンドポイントのorder値もインクリメントされます。
   * @param {riotx.Context} context
   * @param {String} endpointKey
   * @param {Number} newOrder
   * @return {Array}
   */
  changeOrder: (context, endpointKey, newOrder) => {
    let newEndpoints = objectAssign(context.state.endpoints);
    // x番目とx+1番目の中間に配置するために0.5をマイナスしている。
    newEndpoints[endpointKey].order = newOrder - 0.5;
    newEndpoints = putEndpointsInOrder(newEndpoints);
    context.state.endpoints = newEndpoints;
    store.set('endpoints', newEndpoints);
    return [constants$3.ENDPOINTS];
  }
};

var layout$1 = {
  /**
   * 表示サイズを更新します。
   * @param {riotx.Context} context
   * @param {Number} width
   * @param {Number} height
   */
  updateSize: (context, width, height) => {
    context.state.layout.size.width = width;
    context.state.layout.size.height = height;
    if (width > constants$4.layoutThreshold) {
      context.state.layout.type = constants$4.layoutTypeDesktop;
    } else {
      context.state.layout.type = constants$4.layoutTypeMobile;
    }
    return [constants$3.LAYOUT];
  },

  /**
   * componentリストのgridレイアウトのcolumn数を更新します。
   * @param {riotx.Context} context
   * @param {Number} count
   * @return {Array}
   */
  updateComponentsGridColumnCount: (context, count) => {
    context.state.layout.componentsGridColumnCount = count;
    return [constants$3.LAYOUT];
  }
};

var location$2 = {
  /**
   * ページ情報を更新します。
   * @param {riotx.Context} context
   * @param {Object} obj
   * @return {Array}
   */
  all: (context, obj) => {
    context.state.location = objectAssign({}, context.state.location, obj);
    return [constants$3.LOCATION];
  },

  /**
   * ページ名を更新します。
   * @param {riotx.Context} context
   * @param {String} name
   * @return {Array}
   */
  name: (context, name) => {
    context.state.location.name = name;
    return [constants$3.LOCATION];
  },

  /**
   * ルーティング情報を更新します。
   * @param {riotx.Context} context
   * @param {Object} route
   * @return {Array}
   */
  route: (context, route) => {
    context.state.location.route = route;
    return [constants$3.LOCATION];
  }
};

var modals$1 = {
  /**
   * モーダルを追加します。
   * @param {riotx.Context} context
   * @param {String} tagName
   * @param {Object} tagOpts
   * @param {Object} modalOpts
   * @return {Array}
   */
  add: (context, tagName, tagOpts, modalOpts) => {
    if ( tagOpts === void 0 ) tagOpts = {};
    if ( modalOpts === void 0 ) modalOpts = {};

    context.state.modals.push({
      id: `modal_${Date.now()}`,
      tagName,
      tagOpts,
      modalOpts
    });
    return [constants$3.MODALS];
  },

  /**
   * モーダルを削除します。
   * @param {riotx.Context} context
   * @param {String} modalID
   * @return {Array}
   */
  remove: (context, modalID) => {
    context.state.modals = reject_1$1(context.state.modals, modal => {
      return (modal.id === modalID);
    });
    return [constants$3.MODALS];
  }
};

var oas$1 = {
  /**
   * SwaggerClientインスタンスを設定します。
   * @param {riotx.Context} context
   * @param {SwaggerClient} client
   * @return {Array}
   */
  client: (context, client) => {
    context.state.oas.client = client;
    return [constants$3.OAS];
  },

  /**
   * SwaggerClientインスタンスをクリアします。
   * @param {riotx.Context} context
   * @return {Array}
   */
  clearClient: context => {
    context.state.oas.client = null;
    return [constants$3.OAS];
  }
};

var page$1 = {
  /**
   * ページ情報を書き換えます。
   * @param {riotx.Context} context
   * @param {Object|null} page
   * @return {Array}
   */
  all: (context, page) => {
    context.state.page = page;
    return [constants$3.PAGE];
  }
};

var popovers$1 = {
  /**
   * 吹き出しを追加します。
   * @param {riotx.Context} context
   * @param {String} tagName
   * @param {Object} tagOpts
   * @param {Object} popoverOpts
   * @return {Array}
   */
  add: (context, tagName, tagOpts, popoverOpts) => {
    if ( tagOpts === void 0 ) tagOpts = {};
    if ( popoverOpts === void 0 ) popoverOpts = {};

    context.state.popovers.push({
      id: `popover_${Date.now()}`,
      tagName,
      tagOpts,
      popoverOpts: objectAssign({
        direction: 'T',
        width: 100,
        x: 0,
        y: 0
      }, popoverOpts)
    });
    return [constants$3.POPOVERS];
  },

  /**
   * 吹き出しを削除します。
   * @param {riotx.Context} context
   * @param {String} popoverID
   * @return {Array}
   */
  remove: (context, popoverID) => {
    context.state.popovers = reject_1$1(context.state.popovers, popover => {
      return (popover.id === popoverID);
    });
    return [constants$3.POPOVERS];
  }
};

const generateId = () => {
  return `toast_${Date.now()}`;
};

const TOAST_TYPE_NORMAL = 'normal';
const TOAST_TIMEOUT = 3 * 1000;
const TOAST_AUTO_HIDE = true;

var toasts$1 = {
  /**
   * トーストを追加します。
   * @param {riotx.Context} context
   * @param {Object} obj
   * @return {Array}
   */
  add: (context, obj) => {
    const data = objectAssign({
      type: TOAST_TYPE_NORMAL,
      timeout: TOAST_TIMEOUT,
      autoHide: TOAST_AUTO_HIDE
    }, obj, {
      id: generateId()
    });

    context.state.toasts.push(data);
    return [constants$3.TOASTS];
  },

  /**
   * トーストを削除します。
   * @param {riotx.Context} context
   * @param {String} toastId
   * @return {Array}
   */
  remove: (context, toastId) => {
    context.state.toasts = reject_1$1(context.state.toasts, toast => {
      return toast.id === toastId;
    });

    return [constants$3.TOASTS];
  }
};

var ua$1 = {
  /**
   * UA情報を書き換えます。
   * @param {riotx.Context} context
   * @param {Object} ua
   * @return {Array}
   */
  all: (context, ua) => {
    context.state.ua = ua;
    return [constants$3.UA];
  }
};

const constants$2 = {
  APPLICATION_LAUNCH: 'APPLICATION_LAUNCH',
  APPLICATION_NAVIGATION: 'APPLICATION_NAVIGATION',
  APPLICATION_NETWORKINGS_ADD: 'APPLICATION_NETWORKINGS_ADD',
  APPLICATION_NETWORKINGS_REMOVE: 'APPLICATION_NETWORKINGS_REMOVE',
  APPLICATION_DRAG: 'APPLICATION_DRAG',
  APPLICATION_ENDPOINT_FILTER_TEXT: 'APPLICATION_ENDPOINT_FILTER_TEXT',
  COMPONENTS_UPDATE_ONE: 'COMPONENTS_UPDATE_ONE',
  COMPONENTS_REMOVE_ONE: 'COMPONENTS_REMOVE_ONE',
  COMPONENTS_REMOVE_ALL: 'COMPONENTS_REMOVE_ALL',
  CURRENT: 'CURRENT',
  VIRON: 'VIRON',
  DRAWERS_ADD: 'DRAWERS_ADD',
  DRAWERS_REMOVE: 'DRAWERS_REMOVE',
  ENDPOINTS_ADD: 'ENDPOINTS_ADD',
  ENDPOINTS_REMOVE: 'ENDPOINTS_REMOVE',
  ENDPOINTS_REMOVE_ALL: 'ENDPOINTS_REMOVE_ALL',
  ENDPOINTS_UPDATE: 'ENDPOINTS_UPDATE',
  ENDPOINTS_UPDATE_TOKEN: 'ENDPOINTS_UPDATE_TOKEN',
  ENDPOINTS_MERGE_ALL: 'ENDPOINTS_MERGE_ALL',
  ENDPOINTS_TIDY_UP_ORDER: 'ENDPOINTS_TIDY_UP_ORDER',
  ENDPOINTS_CHANGE_ORDER: 'ENDPOINTS_CHANGE_ORDER',
  LAYOUT_SIZE: 'LAYOUT_SIZE',
  LAYOUT_COMPONENTS_GRID_COLUMN_COUNT: 'LAYOUT_COMPONENTS_GRID_COLUMN_COUNT',
  LOCATION: 'LOCATION',
  LOCATION_NAME: 'LOCATION_NAME',
  LOCATION_ROUTE: 'LOCATION_ROUTE',
  MODALS_ADD: 'MODALS_ADD',
  MODALS_REMOVE: 'MODALS_REMOVE',
  OAS_CLIENT: 'OAS_CLIENT',
  OAS_CLIENT_CLEAR: 'OAS_CLIENT_CLEAR',
  PAGE: 'PAGE',
  POPOVERS_ADD: 'POPOVERS_ADD',
  POPOVERS_REMOVE: 'POPOVERS_REMOVE',
  TOASTS_ADD: 'TOASTS_ADD',
  TOASTS_REMOVE: 'TOASTS_REMOVE',
  UA: 'UA'
};

var mutations = {
  [constants$2.APPLICATION_LAUNCH]: application$1.launch,
  [constants$2.APPLICATION_NAVIGATION]: application$1.navigation,
  [constants$2.APPLICATION_NETWORKINGS_ADD]: application$1.addNetworking,
  [constants$2.APPLICATION_NETWORKINGS_REMOVE]: application$1.removeNetworking,
  [constants$2.APPLICATION_DRAG]: application$1.drag,
  [constants$2.APPLICATION_ENDPOINT_FILTER_TEXT]: application$1.endpointFilterText,
  [constants$2.COMPONENTS_UPDATE_ONE]: components$1.updateOne,
  [constants$2.COMPONENTS_REMOVE_ONE]: components$1.removeOne,
  [constants$2.COMPONENTS_REMOVE_ALL]: components$1.removeAll,
  [constants$2.CURRENT]: current$1.all,
  [constants$2.VIRON]: viron$1.all,
  [constants$2.DRAWERS_ADD]: drawers$1.add,
  [constants$2.DRAWERS_REMOVE]: drawers$1.remove,
  [constants$2.ENDPOINTS_ADD]: endpoints$1.add,
  [constants$2.ENDPOINTS_REMOVE]: endpoints$1.remove,
  [constants$2.ENDPOINTS_REMOVE_ALL]: endpoints$1.removeAll,
  [constants$2.ENDPOINTS_UPDATE]: endpoints$1.update,
  [constants$2.ENDPOINTS_UPDATE_TOKEN]: endpoints$1.updateToken,
  [constants$2.ENDPOINTS_MERGE_ALL]: endpoints$1.mergeAll,
  [constants$2.ENDPOINTS_TIDY_UP_ORDER]: endpoints$1.tidyUpOrder,
  [constants$2.ENDPOINTS_CHANGE_ORDER]: endpoints$1.changeOrder,
  [constants$2.LAYOUT_SIZE]: layout$1.updateSize,
  [constants$2.LAYOUT_COMPONENTS_GRID_COLUMN_COUNT]: layout$1.updateComponentsGridColumnCount,
  [constants$2.LOCATION]: location$2.all,
  [constants$2.LOCATION_NAME]: location$2.name,
  [constants$2.LOCATION_ROUTE]: location$2.route,
  [constants$2.MODALS_ADD]: modals$1.add,
  [constants$2.MODALS_REMOVE]: modals$1.remove,
  [constants$2.OAS_CLIENT]: oas$1.client,
  [constants$2.OAS_CLIENT_CLEAR]: oas$1.clearClient,
  [constants$2.PAGE]: page$1.all,
  [constants$2.POPOVERS_ADD]: popovers$1.add,
  [constants$2.POPOVERS_REMOVE]: popovers$1.remove,
  [constants$2.TOASTS_ADD]: toasts$1.add,
  [constants$2.TOASTS_REMOVE]: toasts$1.remove,
  [constants$2.UA]: ua$1.all
};

var application = {
  /**
   * 起動状態にします。
   * @param {riotx.Context} context
   * @return {Promise}
   */
  launch: context => {
    return Promise
      .resolve()
      .then(() => {
        context.commit(constants$2.APPLICATION_LAUNCH, true);
      });
  },

  /**
   * 画面遷移状態にします。
   * @param {riotx.Context} context
   * @return {Promise}
   */
  startNavigation: context => {
    return Promise
      .resolve()
      .then(() => {
        context.commit(constants$2.APPLICATION_NAVIGATION, true);
      });
  },

  /**
   * 画面遷移完了状態にします。
   * @param {riotx.Context} context
   * @return {Promise}
   */
  endNavigation: context => {
    return Promise
      .resolve()
      .then(() => {
        context.commit(constants$2.APPLICATION_NAVIGATION, false);
      });
  },

  /**
   * ドラッグ状態にします。
   * @param {riotx.Context} context
   * @return {Promise}
   */
  startDrag: context => {
    return Promise
      .resolve()
      .then(() => {
        context.commit(constants$2.APPLICATION_DRAG, true);
      });
  },

  /**
   * ドラッグ完了状態にします。
   * @param {riotx.Context} context
   * @return {Promise}
   */
  endDrag: context => {
    return Promise
      .resolve()
      .then(() => {
        context.commit(constants$2.APPLICATION_DRAG, false);
      });
  },

  /**
   * エンドポイントフィルター用のテキストを更新します。
   * @param {riotx.Context} context
   * @param {String} newFilterText
   * @return {Promise}
   */
  updateEndpointFilterText: (context, newFilterText) => {
    return Promise
      .resolve()
      .then(() => {
        context.commit(constants$2.APPLICATION_ENDPOINT_FILTER_TEXT, newFilterText);
      });
  },

  /**
   * エンドポイントフィルター用のテキストをリセットします。
   * @param {riotx.Context} context
   * @return {Promise}
   */
  resetEndpointFilterText: context => {
    return Promise
      .resolve()
      .then(() => {
        context.commit(constants$2.APPLICATION_ENDPOINT_FILTER_TEXT, '');
      });
  }
};

/**
     */
    function isObject(val) {
        return isKind_1$1(val, 'Object');
    }
    var isObject_1 = isObject;

/**
 * body値をContent-Type `application/json`に最適化します。
 * @param {*} body
 * @return {*}
 */
const jsonConverter = body => {
  return JSON.stringify(body);
};

/**
 * body値をContent-Type `application/x-www-form-urlencoded`に最適化します。
 * @param {*} body
 * @return {*}
 */
const urlEncodedStandardQueryStringConverter = body => {
  const strings = [];
  const keys = Object.keys(body);

  keys.forEach(key => {
    const value = body[key];
    const string = `${encodeURIComponent(key)}=${encodeURIComponent(value)}`;

    strings.push(string);
  });

  return strings.join('&');
};

/**
 * body値をContent-Type `multipart/form-data`に最適化します。
 * @param {*} body
 * @return {*}
 */
const formDataConverter = body => {
  const formData = new FormData();
  const keys = Object.keys(body);

  keys.forEach(key => {
    const value = body[key];

    if (isObject_1(value) || Array.isArray(value)) {
      formData.append(key, JSON.stringify(value));
    } else if (value != null) {
      formData.append(key, value);
    }
  });

  return formData;
};

/**
 * 共通設定が施されたFetch API。
 * @param {riotx.Context} context
 * @param {String} url
 * @param {Object} options
 * @return {Promise}
 */
const commonFetch = (context, url, options) => {
  options = objectAssign({
    mode: 'cors',
    // redirect方法はレスポンスにそう形にする。
    redirect: 'follow',
    headers: {
      // 何も指定しない場合はこれをデフォルトにする。
      'Content-Type': 'application/json'
    },
    cache: 'no-store'
  }, options);

  // `Content-Type`に応じてbody内容を書き換えます。
  if (!!options.body && (options.method === 'POST' || options.method === 'PUT')) {
    switch (options.headers['Content-Type']) {
    case 'application/json':
      options.body = jsonConverter(options.body);
      break;
    case 'application/x-www-form-urlencoded':
      options.body = urlEncodedStandardQueryStringConverter(options.body);
      break;
    case 'multipart/form-data':
      options.body = formDataConverter(options.body);
      break;
    default:
      break;
    }
  }

  const networkingId = `networking_${Date.now()}`;
  return Promise
    .resolve()
    .then(() => context.commit(constants$2.APPLICATION_NETWORKINGS_ADD, {
      id: networkingId,
      url,
      options
    }))
    .then(() => Promise.race([
      fetch(url, options),
      new Promise((resolve, reject) => {
        setTimeout(() => {
          reject(new Error('時間がかかり過ぎたため通信を中断しました。'));
        }, 1000 * 10);
      })
    ]))
    .then(response => {
      context.commit(constants$2.APPLICATION_NETWORKINGS_REMOVE, networkingId);
      return response;
    })
    .then(response => { // status check.
      if (!response.ok) {
        return Promise.reject(response);
      }
      return Promise.resolve(response);
    })
    .catch(err => {
      context.commit(constants$2.APPLICATION_NETWORKINGS_REMOVE, networkingId);
      throw err;
    });
};

var application$3 = {
  /**
   * `application`情報を返します。
   * @param {riotx.Context} context
   * @return {Object}
   */
  all: context => {
    return context.state.application;
  },

  /**
   * 起動状態を返します。
   * @param {riotx.Context} context
   * @return {Boolean}
   */
  isLaunched: context => {
    return context.state.application.isLaunched;
  },

  /**
   * 遷移中か否かを返します。
   * @param {riotx.Context} context
   * @return {Boolean}
   */
  isNavigating: context => {
    return context.state.application.isNavigating;
  },

  /**
   * API通信中か否かを返します。
   * @param {riotx.Context} context
   * @return {Boolean}
   */
  isNetworking: context => {
    return context.state.application.isNetworking;
  },

  /**
   * ドラッグ中か否かを返します。
   * @param {riotx.Context} context
   * @return {Boolean}
   */
  isDragging: context => {
    return context.state.application.isDragging;
  },

  /**
   * エンドポイントフィルター用のテキストを返します。
   * @param {riotx.Context} context
   * @return {String}
   */
  endpointFilterText: context => {
    return context.state.application.endpointFilterText;
  }
};

/**
     * Array filter
     */
    function filter$1(arr, callback, thisObj) {
        callback = makeIterator_$1(callback, thisObj);
        var results = [];
        if (arr == null) {
            return results;
        }

        var i = -1, len = arr.length, value;
        while (++i < len) {
            value = arr[i];
            if (callback(value, i, arr)) {
                results.push(value);
            }
        }

        return results;
    }

    var filter_1$1 = filter$1;

/**
     * Array map
     */
    function map$1(arr, callback, thisObj) {
        callback = makeIterator_$1(callback, thisObj);
        var results = [];
        if (arr == null){
            return results;
        }

        var i = -1, len = arr.length;
        while (++i < len) {
            results[i] = callback(arr[i], i, arr);
        }

        return results;
    }

     var map_1$1 = map$1;

/**
     * @return {array} Array of unique items
     */
    function unique$1(arr, compare){
        compare = compare || isEqual$1;
        return filter_1$1(arr, function(item, i, arr){
            var n = arr.length;
            while (++i < n) {
                if ( compare(item, arr[i]) ) {
                    return false;
                }
            }
            return true;
        });
    }

    function isEqual$1(a, b){
        return a === b;
    }

    var unique_1$1 = unique$1;

/**
     * Get object keys
     */
     var keys = Object.keys || function (obj) {
            var keys = [];
            forOwn_1$1(obj, function(val, key){
                keys.push(key);
            });
            return keys;
        };

    var keys_1 = keys;

var components$2 = {
  /**
   * 全情報を返します。
   * @param {riotx.Context} context
   * @return {Object}
   */
  all: context => {
    return context.state.components;
  },

  /**
   * 指定riotIDに対する要素を返します。
   * @param {riotx.Context} context
   * @param {String} riotId
   * @return {Object}
   */
  one: (context, riotId) => {
    return context.state.components[riotId];
  },

  /**
   * 指定riotIDに対する要素のAPIレスポンスを返します。
   * @param {riotx.Context} context
   * @param {String} riotId
   * @return {*}
   */
  response: (context, riotId) => {
    return context.state.components[riotId].response;
  },

  /**
   * 指定riotIDに対する要素のschemaObjectを返します。
   * @param {riotx.Context} context
   * @param {String} riotId
   * @return {Object}
   */
  schemaObject: (context, riotId) => {
    return context.state.components[riotId].schemaObject;
  },

  /**
   * 指定riotIDに対する要素のparamterObject群を返します。
   * @param {riotx.Context} context
   * @param {String} riotId
   * @return {Array}
   */
  parameterObjects: (context, riotId) => {
    return context.state.components[riotId].parameterObjects;
  },

  /**
   * 全てののparamterObject群を返します。
   * @param {riotx.Context} context
   * @return {Array}
   */
  parameterObjectsEntirely: context => {
    let entireParameterObjects = [];
    const weights = {};
    forOwn_1$1(context.state.components, component => {
      entireParameterObjects = entireParameterObjects.concat(component.parameterObjects || []);
    });
    entireParameterObjects = map_1$1(entireParameterObjects, entireParameterObject => {
      const name = entireParameterObject.name;
      weights[name] || (weights[name] = 0);
      weights[name] = weights[name] + 1;
      return objectAssign({}, entireParameterObject);
    });
    entireParameterObjects = unique_1$1(entireParameterObjects, (a, b) => {
      return (a.name === b.name);
    });
    forEach_1$1(entireParameterObjects, entireParameterObject => {
      entireParameterObject.weight = weights[entireParameterObject.name];
    });
    entireParameterObjects = sortBy_1$1(entireParameterObjects, entireParameterObject => {
      return weights[entireParameterObject.name] * (-1);
    });
    return entireParameterObjects;
  },

  /**
   * action(operationObject)群を返します。
   * @param {riotx.Context} context
   * @param {String} riotId
   * @return {Array}
   */
  actions: (context, riotId) => {
    return map_1$1(context.state.components[riotId].actions, action => {
      return action.operationObject;
    });
  },

  /**
   * 自身に関連するaction(operationObject)群を返します。
   * @param {riotx.Context} context
   * @param {String} riotId
   * @return {Array}
   */
  selfActions: (context, riotId) => {
    const actions = context.state.components[riotId].actions;
    const selfActions = filter_1$1(actions, action => {
      return (!action.appendTo || action.appendTo === 'self');
    });
    return map_1$1(selfActions, action => {
      return action.operationObject;
    });
  },

  /**
   * テーブル行に関連するaction(operationObject)群を返します。
   * @param {riotx.Context} context
   * @param {String} riotId
   * @return {Array}
   */
  rowActions: (context, riotId) => {
    const actions = context.state.components[riotId].actions;
    const selfActions = filter_1$1(actions, action => {
      return (action.appendTo === 'row');
    });
    return map_1$1(selfActions, action => {
      return action.operationObject;
    });
  },

  /**
   * 指定riotIDに対する要素のページング機能ON/OFFを返します。
   * @param {riotx.Context} context
   * @param {String} riotId
   * @return {Boolean}
   */
  hasPagination: (context, riotId) => {
    return context.state.components[riotId].hasPagination;
  },

  /**
   * 指定riotIDに対する要素の自動更新secを取得します。
   * @param {riotx.Context} context
   * @param {String} riotId
   * @return {Number}
   */
  autoRefreshSec: (context, riotId) => {
    return context.state.components[riotId].autoRefreshSec;
  },

  /**
   * 指定riotIDに対する要素のページング情報を返します。
   * @param {riotx.Context} context
   * @param {String} riotId
   * @return {Object}
   */
  pagination: (context, riotId) => {
    return context.state.components[riotId].pagination;
  },

  /**
   * テーブル行のラベルに使用するkey群を返します。
   * @param {riotx.Context} context
   * @param {String} riotId
   * @return {Array}
   */
  tableLabels: (context, riotId) => {
    return context.state.components[riotId].table_labels || [];
  },

  /**
   * テーブル列のキー群を返します。
   * @param {riotx.Context} context
   * @param {String} riotId
   * @return {Array}
   */
  tableColumns: (context, riotId) => {
    const response = context.state.components[riotId].response;
    if (!isArray_1$1(response) || !response.length) {
      return [];
    }
    return keys_1(response[0]);
  },

  /**
   * テーブル行に使用するprimaryキーを返します。
   * @param {riotx.Context} context
   * @param {String} riotId
   * @return {String|null}
   */
  primaryKey: (context, riotId) => {
    return context.state.components[riotId].primaryKey || null;
  }
};

var current$2 = {
  /**
   * 選択中のendpointIDを返します。
   * @param {riotx.Context} context
   * @return {String|null}
   */
  all: context => {
    return context.state.current;
  }
};

/**
     * Creates a new object with all the properties where the callback returns
     * true.
     */
    function filterValues(obj, callback, thisObj) {
        callback = makeIterator_$1(callback, thisObj);
        var output = {};
        forOwn_1$1(obj, function(value, key, obj) {
            if (callback(value, key, obj)) {
                output[key] = value;
            }
        });

        return output;
    }
    var filter$4 = filterValues;

/**
     * Get object values
     */
    function values(obj) {
        var vals = [];
        forOwn_1$1(obj, function(val, key){
            vals.push(val);
        });
        return vals;
    }

    var values_1 = values;

const SECTION_DASHBOARD = 'dashboard';
const SECTION_MANAGE = 'manage';

var viron$2 = {
  /**
   * 全て返します。
   * @param {riotx.Context} context
   * @return {Object}
   */
  all: context => {
    if (!context.state.viron) {
      return null;
    }
    return context.state.viron;
  },

  /**
   * VIRONデータが存在する否か。
   * @param {riotx.Context} context
   * @return {Boolean}
   */
  existence: context => {
    return !!context.state.viron;
  },

  /**
   * page群を返します。
   * @param {riotx.Context} context
   * @return {Array}
   */
  pages: context => {
    return context.state.viron.pages;
  },

  /**
   * 指定idx値のpageのidを返します。
   * @param {riotx.Context} context
   * @param {Number} idx
   * @return {String}
   */
  pageIdOf: (context, idx) => {
    return context.state.viron.pages[idx].id;
  },

  /**
   * 名前を返します。
   * @param {riotx.Context} context
   * @return {String}
   */
  name: context => {
    return context.state.viron.name;
  },

  /**
   * ダッシュボードメニュー群を返します。
   * @param {riotx.Context} context
   * @return {Array}
   */
  dashboard: context => {
    if (!context.state.viron) {
      return [];
    }
    return values_1(filter$4(context.state.viron.pages, page => {
      if (page.section !== SECTION_DASHBOARD) {
        return false;
      }
      return true;
    }));
  },

  /**
   * 管理画面メニュー群を返します。
   * @param {riotx.Context} context
   * @return {Array}
   */
  manage: context => {
    if (!context.state.viron) {
      return [];
    }
    return values_1(filter$4(context.state.viron.pages, page => {
      if (page.section !== SECTION_MANAGE) {
        return false;
      }
      return true;
    }));
  },

  /**
   * メニュー内容を返します。
   * @param {riot.Context} context
   * @return {Array}
   */
  menu: context => {
    const menu = [];
    if (!context.state.viron || !context.state.viron.sections) {
      return menu;
    }
    const sections = context.state.viron.sections;
    forEach_1$1(sections, section => {
      menu.push({
        name: section.label || section.id,
        id: section.id,
        groups: []
      });
    });
    const pages = context.state.viron.pages;
    forEach_1$1(pages, page => {
      const targetSection = find_1$1(menu, section => {
        return (section.id === page.section);
      });
      const groupName = page.group;
      const isIndependent = !groupName;
      if (isIndependent) {
        targetSection.groups.push({
          pages: [{
            name: page.name,
            id: page.id
          }],
          isIndependent
        });
      } else {
        if (!find_1$1(targetSection.groups, group => {
          return (group.name === groupName);
        })) {
          targetSection.groups.push({
            name: groupName,
            pages: [],
            isIndependent
          });
        }
        const targetGroup = find_1$1(targetSection.groups, group => {
          return (group.name === groupName);
        });
        targetGroup.pages.push({
          name: page.name,
          id: page.id
        });
      }
    });
    return menu;
  }
};

var drawers$2 = {
  /**
   * 全てのドローワー情報を返します。
   * @param {riotx.Context} context
   * @return {Array}
   */
  all: context => {
    return context.state.drawers;
  }
};

/**
     * Get object size
     */
    function size(obj) {
        var count = 0;
        forOwn_1$1(obj, function(){
            count++;
        });
        return count;
    }

    var size_1 = size;

/**
     * Typecast a value to a String, using an empty string value for null or
     * undefined.
     */
    function toString(val){
        return val == null ? '' : val.toString();
    }

    var toString_1 = toString;

/**
     * Searches for a given substring
     */
    function contains$1(str, substring, fromIndex){
        str = toString_1(str);
        substring = toString_1(substring);
        return str.indexOf(substring, fromIndex) !== -1;
    }

    var contains_1$1 = contains$1;

/**
 * 受け取ったエンドポイント群をorder昇順の配列として返します。
 * @param {Object} endpoints
 * @return {Array}
 */
const sortByOrder = endpoints => {
  let endpointsByOrder = [];
  forOwn_1$1(endpoints, (endpoint, key) => {
    endpoint.key = key;
    endpointsByOrder.push(endpoint);
  });
  endpointsByOrder = sortBy_1$1(endpointsByOrder, endpoint => {
    return endpoint.order;
  });
  return endpointsByOrder;
};

/**
 * 受け取ったエンドポイント群をfilterして返します。
 * @param {Array} endpoints
 * @param {String} filterText
 * @return {Array}
 */
const filterBy = (endpoints, filterText) => {
  filterText = filterText || '';
  filterText = filterText.replace(/　/g, ' ');// eslint-disable-line no-irregular-whitespace
  filterText = filterText.replace(/,/g, ' ');
  const targetTexts = filter_1$1((filterText || '').split(' '), targetText => {
    return !!targetText;
  });
  if (!targetTexts.length) {
    return endpoints;
  }

  return filter_1$1(endpoints, endpoint => {
    let isMatched = false;
    forEach_1$1(targetTexts, targetText => {
      if (contains_1$1(endpoint.url, targetText)) {
        isMatched = true;
      }
      if (contains_1$1(endpoint.title, targetText)) {
        isMatched = true;
      }
      if (contains_1$1(endpoint.name, targetText)) {
        isMatched = true;
      }
      if (contains_1$1(endpoint.description, targetText)) {
        isMatched = true;
      }
      if (contains_1$1(endpoint.memo, targetText)) {
        isMatched = true;
      }
      forEach_1$1(endpoint.tags || [], tag => {
        if (contains_1$1(tag, targetText)) {
          isMatched = true;
        }
      });
    });
    return isMatched;
  });
};

var endpoints$2 = {
  /**
   * 全endpointを返します。
   * @param {riotx.Context} context
   * @return {Object}
   */
  all: context => {
    return context.state.endpoints;
  },

  /**
   * 全endpointをorder昇順の配列として返します。
   * @param {riotx.Context} context
   * @return {Array}
   */
  allByOrder: context => {
    let endpoints = objectAssign(context.state.endpoints);
    endpoints = sortByOrder(endpoints);
    return endpoints;
  },

  /**
   * 全endpointをorder昇順のfilter済み配列として返します。
   * @param {riotx.Context} context
   * @return {Array}
   */
  allByOrderFiltered: context => {
    let endpoints = objectAssign(context.state.endpoints);
    endpoints = sortByOrder(endpoints);
    endpoints = filterBy(endpoints, context.state.application.endpointFilterText);
    return endpoints;
  },

  /**
   * endpoint数を返します。
   * @param {riotx.Context} context
   * @return {Number}
   */
  count: context => {
    return size_1(context.state.endpoints);
  },

  /**
   * 認証トークンを省いた全endpointを返します。
   * @param {riotx.Context} context
   * @return {Object}
   */
  allWithoutToken: context => {
    const endpoints = objectAssign({}, context.state.endpoints);
    // 認証用トークンはexport対象外とする。
    forOwn_1$1(endpoints, endpoint => {
      delete endpoint.token;
    });
    return endpoints;
  },

  /**
   * 指定keyにマッチするendpointを返します。
   * @param {riotx.Context} context
   * @param {String} key
   * @return {Object}
   */
  one: (context, key) => {
    return context.state.endpoints[key];
  },

  /**
   * 指定urlにマッチするendpointを返します。
   * @param {riotx.Context} context
   * @param {String} url
   * @return {Object}
   */
  oneByURL: (context, url) => {
    const endpoints = context.state.endpoints;
    return find_1$2(endpoints, endpoint => {
      return endpoint.url === url;
    });
  }

};

var layout$2 = {
  /**
   * レイアウトタイプを返します。
   * @param {riotx.Context} context
   * @return {String}
   */
  type: context => {
    return context.state.layout.type;
  },

  /**
   * レイアウトタイプがdesktopならtrueを返します。
   * @param {riotx.Context} context
   * @return {Boolean}
   */
  isDesktop: context => {
    return (context.state.layout.type === constants$4.layoutTypeDesktop);
  },

  /**
   * レイアウトタイプがmobileならtrueを返します。
   * @param {riotx.Context} context
   * @return {Boolean}
   */
  isMobile: context => {
    return (context.state.layout.type === constants$4.layoutTypeMobile);
  },

  /**
   * 表示サイズを返します。
   * @param {riotx.Context} context
   * @return {Object}
   */
  size: context => {
    return context.state.layout.size;
  },

  /**
   * componentリストのgridレイアウトのcolumn数を返します。
   * @param {riotx.Context} context
   * @return {Number}
   */
  componentsGridColumnCount: context => {
    return context.state.layout.componentsGridColumnCount;
  }
};

var location$3 = {
  /**
   * 全情報を返します。
   * @param {riotx.Context} context
   * @return {Object}
   */
  all: context => {
    return context.state.location;
  },

  /**
   * トップページか判定します。
   * @param {riotx.Context} context
   * @return {Object}
   */
  isTop: context => {
    return (context.state.location.name === 'endpoints');
  },

  /**
   * ページ名を返します。
   * @param {riotx.Context} context
   * @return {String}
   */
  name: context => {
    return context.state.location.name;
  },

  /**
   * ルーティング情報を返します。
   * @param {riotx.Context} context
   * @return {Object}
   */
  route: context => {
    return context.state.location.route;
  }
};

var menu = {
  /**
   * 有効状態を返します。
   * @param {riotx.Context} context
   * @return {Boolean}
   */
  enabled: context => {
    return context.state.menu.isEnabled;
  }
};

var modals$2 = {
  /**
   * 全てのモーダル情報を返します。
   * @param {riotx.Context} context
   * @return {Array}
   */
  all: context => {
    return context.state.modals;
  }
};

var oas$2 = {
  /**
   * SwaggerClientを返します。
   * @param {riotx.Context} context
   * @return {SwaggerClient}
   */
  client: context => {
    return context.state.oas.client;
  },

  /**
   * resolve済みのOpenAPI Documentを返します。
   * @param {riotx.Context} context
   * @return {Object}
   */
  spec: context => {
    return context.state.oas.client.spec;
  },

  /**
   * resolve前のオリジナルのOpenAPI Documentを返します。
   * @param {riotx.Context} context
   * @return {Object}
   */
  originalSpec: context => {
    return context.state.oas.client.originalSpec;
  },

  /**
   * resolveされたAPI群を返します。
   * @param {riotx.Context} context
   * @return {Object}
   */
  apis: context => {
    return context.state.oas.client.apis;
  },

  /**
   * resolveされたAPI群をflatな構成にして返します。
   * @param {riotx.Context} context
   * @return {Object}
   */
  flatApis: context => {
    // client.apisはタグ分けされているので、まずflatな構成にする。
    const apis = {};
    forOwn_1$1(context.state.oas.client.apis, obj => {
      forOwn_1$1(obj, (api, operationId) => {
        apis[operationId] = api;
      });
    });
    return apis;
  },

  /**
   * 指定したoperationIdにマッチするresolveされたAPIを返します。
   * @param {riotx.Context} context
   * @param {String} operationId
   * @return {Function}
   */
  api: (context, operationId) => {
    const apis = {};
    forOwn_1$1(context.state.oas.client.apis, obj => {
      forOwn_1$1(obj, (api, operationId) => {
        apis[operationId] = api;
      });
    });
    return apis[operationId];
  },

  /**
   * 指定したpathとmethodにマッチするresolveされたAPIを返します。
   * @param {riotx.Context} context
   * @param {String} path
   * @param {String} method
   * @return {Function}
   */
  apiByPathAndMethod: (context, path, method) => {
    const operationObject = context.state.oas.client.spec.paths[path][method];
    const operationId = operationObject.operationId;
    const apis = {};
    forOwn_1$1(context.state.oas.client.apis, obj => {
      forOwn_1$1(obj, (api, operationId) => {
        apis[operationId] = api;
      });
    });
    return apis[operationId];
  },

  /**
   * 指定したpathにマッチするPathItemObjectを返します。
   * @param {riotx.Context} context
   * @param {String} path
   * @return {Object}
   */
  pathItemObject: (context, path) => {
    return context.state.oas.client.spec.paths[path];
  },

  /**
   * 指定したoperationIdにマッチするPathItemObjectのmethod名を返します。
   * @param {riotx.Context} context
   * @param {String} operationId
   * @return {String}
   */
  pathItemObjectMethodNameByOperationId: (context, operationId) => {
    let ret;
    forOwn_1$1(context.state.oas.client.spec.paths, pathItemObject => {
      if (!!ret) {
        return;
      }
      forOwn_1$1(pathItemObject, (operationObject, method) => {
        if (!!ret) {
          return;
        }
        if (operationObject.operationId === operationId) {
          ret = method;
        }
      });
    });
    return ret;
  },

  /**
   * 指定したpathとmethodにマッチするOperationObjectを返します。
   * @param {riotx.Context} context
   * @param {String} path
   * @param {String} method
   * @return {Object}
   */
  operationObject: (context, path, method) => {
    return context.state.oas.client.spec.paths[path][method];
  },

  /**
   * 指定したcomponentに関連するOperationObject(action)群を返します。
   * @param {riotx.Context} context
   * @param {Object} component
   * @return {Array}
   */
  operationObjectsAsAction: (context, component) => {
    const methods = ['get','put', 'post', 'delete'];
    const basePath = component.api.path;
    const primaryKey = component.primary;
    const actions = component.actions || [];

    // 関連API情報。後のOperationObject群抽出に使用します。
    const pathRefs = [];
    // 同じpath & method違いのoperationObjectは関連有りとみなす。
    forEach_1$1(methods, method => {
      // `get`はcomponent自身なのでスルーする。
      if (method === 'get') {
        return;
      }
      const isOperationObjectDefined = !!context.state.oas.client.spec.paths[basePath] && !!context.state.oas.client.spec.paths[basePath][method];
      if (!isOperationObjectDefined) {
        return;
      }
      pathRefs.push({
        path: basePath,
        method,
        appendTo: 'self'
      });
    });
    // primaryキーが存在する場合、`basePath/primaryKey`の各operationObjectは関連有りとみなす。
    // テーブルの各rowに紐づくOperationObjectとみなす。
    if (!!primaryKey) {
      const listBasePath = `${basePath}/{${primaryKey}}`;
      forEach_1$1(methods, method => {
        const isOperationObjectDefined = !!context.state.oas.client.spec.paths[listBasePath] && !!context.state.oas.client.spec.paths[listBasePath][method];
        if (!isOperationObjectDefined) {
          return;
        }
        pathRefs.push({
          path: listBasePath,
          method,
          appendTo: 'row'
        });
      });
    }
    // actionsに指定されたpath群のOperationObjectも関連有りとみなします。
    // path内にprimaryKeyと同一名の変数があれば、それはテーブルrowに紐づくOperationObjectとみなします。
    // primaryKeyと同一名の変数が無ければ、componentと紐づくOperationObjectとみなします。
    forEach_1$1(actions, actionBasePath => {
      const appendTo = (actionBasePath.indexOf(`{${primaryKey}}`) >= 0 ? 'row' : 'self');
      forEach_1$1(methods, method => {
        const isOperationObjectDefined = !!context.state.oas.client.spec.paths[actionBasePath] && !!context.state.oas.client.spec.paths[actionBasePath][method];
        if (!isOperationObjectDefined) {
          return;
        }
        pathRefs.push({
          path: actionBasePath,
          method,
          appendTo
        });
      });
    });

    // OperationObject群を抽出します。
    const operationObjects = [];
    forEach_1$1(pathRefs, ref => {
      const operationObject = context.state.oas.client.spec.paths[ref.path][ref.method];
      operationObjects.push(objectAssign({
        operationObject
      }, ref));
    });

    return operationObjects;
  },

  /**
   * 指定したpathとmethodにマッチするOperationObjectのoperationIdを返します。
   * @param {riotx.Context} context
   * @param {String} path
   * @param {String} method
   * @return {String}
   */
  operationId: (context, path, method) => {
    return context.state.oas.client.spec.paths[path][method].operationId;
  },

  /**
   * 指定したpathとmethodにマッチするOperationObjectのParameterObject群を返します。
   * @param {riotx.Context} context
   * @param {String} path
   * @param {String} method
   * @return {Array}
   */
  parameterObjects: (context, path, method) => {
    return context.state.oas.client.spec.paths[path][method].parameters || [];
  },

  /**
   * 指定したpathとmethodにマッチするOperationObject群を返します。
   * @param {riotx.Context} context
   * @param {String} path
   * @param {String} method
   * @return {Object}
   */
  responseObjects: (context, path, method) => {
    return context.state.oas.client.spec.paths[path][method].responses;
  },

  /**
   * 指定したpathとmethodにマッチするOperationObjectのresponseObjectを返します。
   * statusCodeを指定しない場合はデフォルトで200に設定されます。
   * @param {riotx.Context} context
   * @param {String} path
   * @param {String} method
   * @param {Number} statusCode
   * @return {Object}
   */
  responseObject: (context, path, method, statusCode) => {
    if ( statusCode === void 0 ) statusCode = 200;

    return context.state.oas.client.spec.paths[path][method].responses[statusCode];
  },

  /**
   * 指定したpathとmethodにマッチするOperationObjectのresponseObjectのschemaObjectを返します。
   * statusCodeを指定しない場合はデフォルトで200に設定されます。
   * @param {riotx.Context} context
   * @param {String} path
   * @param {String} method
   * @param {Number} statusCode
   * @return {Object}
   */
  schemaObject: (context, path, method, statusCode) => {
    if ( statusCode === void 0 ) statusCode = 200;

    return context.state.oas.client.spec.paths[path][method].responses[statusCode].schema;
  }
};

var page$2 = {
  /**
   * 全情報を返します。
   * @param {riotx.Context} context
   * @return {Object}
   */
  all: context => {
    return context.state.page || {};
  },

  /**
   * ページIDを返します。
   * @param {riotx.Context} context
   * @return {String}
   */
  id: context => {
    const page = context.state.page;
    if (!page) {
      return '';
    }
    return page.id;
  },

  /**
   * ページ名を返します。
   * @param {riotx.Context} context
   * @return {String}
   */
  name: context => {
    const page = context.state.page;
    if (!page) {
      return '';
    }
    return page.name;
  },

  /**
   * コンポーネント群を返します。
   * @param {riotx.Context} context
   * @return {Array}
   */
  components: context => {
    const page = context.state.page;
    if (!page) {
      return [];
    }
    return page.components;
  },

  /**
   * table表示のコンポーネント群を返します。
   * @param {riotx.Context} context
   * @return {Array}
   */
  componentsTable: context => {
    const page = context.state.page;
    if (!page) {
      return [];
    }
    return filter_1$1(page.components, component => {
      return (component.style === 'table');
    });
  },

  /**
   * table表示以外のコンポーネント群を返します。
   * @param {riotx.Context} context
   * @return {Array}
   */
  componentsNotTable: context => {
    const page = context.state.page;
    if (!page) {
      return [];
    }
    return reject_1$1(page.components, component => {
      return (component.style === 'table');
    });
  },

  /**
   * コンポーネント数を返します。
   * @param {riotx.Context} context
   * @return {Number}
   */
  componentsCount: context => {
    const page = context.state.page;
    if (!page) {
      return 0;
    }
    return (page.components || []).length;
  }
};

var popovers$2 = {
  /**
   * 全ての吹き出し情報を返します。
   * @param {riotx.Context} context
   * @return {Array}
   */
  all: context => {
    return context.state.popovers;
  }
};

var toasts$2 = {
  /**
   * 全てのトースト情報を返します。
   * @param {riotx.Context} context
   * @return {Array}
   */
  all: context => {
    return context.state.toasts;
  }
};

var ua$2 = {
  /**
   * 全情報を返します。
   * @param {riotx.Context} context
   * @return {Object}
   */
  all: context => {
    return context.state.ua;
  },

  /**
   * Chromeか否かを返します。
   * @param {riotx.Context} context
   * @return {Boolean}
   */
  isChrome: context => {
    return !!context.state.ua.chrome;
  },

  /**
   * Safariか否かを返します。
   * @param {riotx.Context} context
   * @return {Boolean}
   */
  isSafari: context => {
    return !!context.state.ua.safari;
  },

  /**
   * Edgeか否かを返します。
   * @param {riotx.Context} context
   * @return {Boolean}
   */
  isEdge: context => {
    return !!context.state.ua.edge;
  },

  /**
   * Firefoxか否かを返します。
   * @param {riotx.Context} context
   * @return {Boolean}
   */
  isFirefox: context => {
    return !!context.state.ua.firefox;
  },

  /**
   * 使用しているブラウザを返します。
   * @param {riotx.Context} context
   * @return {Boolean}
   */
  usingBrowser: context => {
    const ua = context.state.ua;
    if (!!ua.chrome) {
      return 'chrome';
    }
    if (!!ua.safari) {
      return 'safari';
    }
    if (!!ua.edge) {
      return 'edge';
    }
    if (!!ua.firefox) {
      return 'firefox';
    }

    return null;
  }
};

const constants$5 = {
  APPLICATION: 'APPLICATION',
  APPLICATION_ISLAUNCHED: 'APPLICATION_ISLAUNCHED',
  APPLICATION_ISNAVIGATING: 'APPLICATION_ISNAVIGATING',
  APPLICATION_ISNETWORKING: 'APPLICATION_ISNETWORKING',
  APPLICATION_ISDRAGGING: 'APPLICATION_ISDRAGGING',
  APPLICATION_ENDPOINT_FILTER_TEXT: 'APPLICATION_ENDPOINT_FILTER_TEXT',
  COMPONENTS: 'COMPONENTS',
  COMPONENTS_PARAMETER_OBJECTS: 'COMPONENTS_PARAMETER_OBJECTS',
  COMPONENTS_ONE: 'COMPONENTS_ONE',
  COMPONENTS_ONE_RESPONSE: 'COMPONENTS_ONE_RESPONSE',
  COMPONENTS_ONE_SCHEMA_OBJECT: 'COMPONENTS_ONE_SCHEMA_OBJECT',
  COMPONENTS_ONE_PARAMETER_OBJECTS: 'COMPONENTS_ONE_PARAMETER_OBJECTS',
  COMPONENTS_ONE_ACTIONS: 'COMPONENTS_ONE_ACTIONS',
  COMPONENTS_ONE_ACTIONS_SELF: 'COMPONENTS_ONE_ACTIONS_SELF',
  COMPONENTS_ONE_ACTIONS_ROW: 'COMPONENTS_ONE_ACTIONS_ROW',
  COMPONENTS_ONE_HAS_PAGINATION: 'COMPONENTS_ONE_HAS_PAGINATION',
  COMPONENTS_ONE_AUTO_REFRESH_SEC: 'COMPONENTS_ONE_AUTO_REFRESH_SEC',
  COMPONENTS_ONE_PAGINATION: 'COMPONENTS_ONE_PAGINATION',
  COMPONENTS_ONE_TABLE_LABELS: 'COMPONENTS_ONE_TABLE_LABELS',
  COMPONENTS_ONE_TABLE_COLUMNS: 'COMPONENTS_ONE_TABLE_COLUMNS',
  COMPONENTS_ONE_PRIMARY_KEY: 'COMPONENTS_ONE_PRIMARY_KEY',
  CURRENT: 'CURRENT',
  VIRON: 'VIRON',
  VIRON_EXISTENCE: 'VIRON_EXISTENCE',
  VIRON_PAGES: 'VIRON_PAGES',
  VIRON_PAGES_ID_OF: 'VIRON_PAGES_ID_OF',
  VIRON_NAME: 'VIRON_NAME',
  VIRON_DASHBOARD: 'VIRON_DASHBOARD',
  VIRON_MANAGE: 'VIRON_MANAGE',
  VIRON_MENU: 'VIRON_MENU',
  DRAWERS: 'DRAWERS',
  ENDPOINTS: 'ENDPOINTS',
  ENDPOINTS_BY_ORDER: 'ENDPOINTS_BY_ORDER',
  ENDPOINTS_BY_ORDER_FILTERED: 'ENDPOINTS_BY_ORDER_FILTERED',
  ENDPOINTS_COUNT: 'ENDPOINTS_COUNT',
  ENDPOINTS_WITHOUT_TOKEN: 'ENDPOINTS_WITHOUT_TOKEN',
  ENDPOINTS_ONE: 'ENDPOINTS_ONE',
  ENDPOINTS_ONE_BY_URL: 'ENDPOINTS_ONE_BY_URL',
  LAYOUT_TYPE: 'LAYOUT_TYPE',
  LAYOUT_IS_DESKTOP: 'LAYOUT_IS_DESKTOP',
  LAYOUT_IS_MOBILE: 'LAYOUT_IS_MOBILE',
  LAYOUT_SIZE: 'LAYOUT_SIZE',
  LAYOUT_COMPONENTS_GRID_COLUMN_COUNT: 'LAYOUT_COMPONENTS_GRID_COLUMN_COUNT',
  LOCATION: 'LOCATION',
  LOCATION_IS_TOP: 'LOCATION_IS_TOP',
  LOCATION_NAME: 'LOCATION_NAME',
  LOCATION_ROUTE: 'LOCATION_ROUTE',
  MENU_ENABLED: 'MENU_ENABLED',
  MODALS: 'MODALS',
  OAS_CLIENT: 'OAS_CLIENT',
  OAS_SPEC: 'OAS_SPEC',
  OAS_ORIGINAL_SPEC: 'OAS_ORIGINAL_SPEC',
  OAS_APIS: 'OAS_APIS',
  OAS_FLAT_APIS: 'OAS_FLAT_APIS',
  OAS_API: 'OAS_API',
  OAS_API_BY_PATH_AND_METHOD: 'OAS_API_BY_PATH_AND_METHOD',
  OAS_PATH_ITEM_OBJECT: 'OAS_PATH_ITEM_OBJECT',
  OAS_PATH_ITEM_OBJECT_METHOD_NAME_BY_OPERATION_ID: 'OAS_PATH_ITEM_OBJECT_METHOD_NAME_BY_OPERATION_ID',
  OAS_OPERATION_OBJECT: 'OAS_OPERATION_OBJECT',
  OAS_OPERATION_OBJECTS_AS_ACTION: 'OAS_OPERATION_OBJECTS_AS_ACTION',
  OAS_OPERATION_ID: 'OAS_OPERATION_ID',
  OAS_PARAMETER_OBJECTS: 'OAS_PARAMETER_OBJECTS',
  OAS_RESPONSE_OBJECT: 'OAS_RESPONSE_OBJECT',
  OAS_SCHEMA_OBJECT: 'OAS_SCHEMA_OBJECT',
  PAGE: 'PAGE',
  PAGE_ID: 'PAGE_ID',
  PAGE_NAME: 'PAGE_NAME',
  PAGE_COMPONENTS: 'PAGE_COMPONENTS',
  PAGE_COMPONENTS_TABLE: 'PAGE_COMPONENTS_TABLE',
  PAGE_COMPONENTS_NOT_TABLE: 'PAGE_COMPONENTS_NOT_TABLE',
  PAGE_COMPONENTS_COUNT: 'PAGE_COMPONENTS_COUNT',
  POPOVERS: 'POPOVERS',
  TOASTS: 'TOASTS',
  UA: 'UA',
  UA_IS_SAFARI: 'UA_IS_SAFARI',
  UA_IS_EDGE: 'UA_IS_EDGE',
  UA_IS_FIREFOX: 'UA_IS_FIREFOX',
  UA_USING_BROWSER: 'UA_USING_BROWSER'
};

var getters = {
  [constants$5.APPLICATION]: application$3.all,
  [constants$5.APPLICATION_ISLAUNCHED]: application$3.isLaunched,
  [constants$5.APPLICATION_ISNAVIGATING]: application$3.isNavigating,
  [constants$5.APPLICATION_ISNETWORKING]: application$3.isNetworking,
  [constants$5.APPLICATION_ISDRAGGING]: application$3.isDragging,
  [constants$5.APPLICATION_ENDPOINT_FILTER_TEXT]: application$3.endpointFilterText,
  [constants$5.COMPONENTS]: components$2.all,
  [constants$5.COMPONENTS_PARAMETER_OBJECTS]: components$2.parameterObjectsEntirely,
  [constants$5.COMPONENTS_ONE]: components$2.one,
  [constants$5.COMPONENTS_ONE_RESPONSE]: components$2.response,
  [constants$5.COMPONENTS_ONE_SCHEMA_OBJECT]: components$2.schemaObject,
  [constants$5.COMPONENTS_ONE_PARAMETER_OBJECTS]: components$2.parameterObjects,
  [constants$5.COMPONENTS_ONE_ACTIONS]: components$2.actions,
  [constants$5.COMPONENTS_ONE_ACTIONS_SELF]: components$2.selfActions,
  [constants$5.COMPONENTS_ONE_ACTIONS_ROW]: components$2.rowActions,
  [constants$5.COMPONENTS_ONE_HAS_PAGINATION]: components$2.hasPagination,
  [constants$5.COMPONENTS_ONE_AUTO_REFRESH_SEC]: components$2.autoRefreshSec,
  [constants$5.COMPONENTS_ONE_PAGINATION]: components$2.pagination,
  [constants$5.COMPONENTS_ONE_TABLE_LABELS]: components$2.tableLabels,
  [constants$5.COMPONENTS_ONE_TABLE_COLUMNS]: components$2.tableColumns,
  [constants$5.COMPONENTS_ONE_PRIMARY_KEY]: components$2.primaryKey,
  [constants$5.CURRENT]: current$2.all,
  [constants$5.VIRON]: viron$2.all,
  [constants$5.VIRON_EXISTENCE]: viron$2.existence,
  [constants$5.VIRON_PAGES]: viron$2.pages,
  [constants$5.VIRON_PAGES_ID_OF]: viron$2.pageIdOf,
  [constants$5.VIRON_NAME]: viron$2.name,
  [constants$5.VIRON_DASHBOARD]: viron$2.dashboard,
  [constants$5.VIRON_MANAGE]: viron$2.manage,
  [constants$5.VIRON_MENU]: viron$2.menu,
  [constants$5.DRAWERS]: drawers$2.all,
  [constants$5.ENDPOINTS]: endpoints$2.all,
  [constants$5.ENDPOINTS_BY_ORDER]: endpoints$2.allByOrder,
  [constants$5.ENDPOINTS_BY_ORDER_FILTERED]: endpoints$2.allByOrderFiltered,
  [constants$5.ENDPOINTS_COUNT]: endpoints$2.count,
  [constants$5.ENDPOINTS_WITHOUT_TOKEN]: endpoints$2.allWithoutToken,
  [constants$5.ENDPOINTS_ONE]: endpoints$2.one,
  [constants$5.ENDPOINTS_ONE_BY_URL]: endpoints$2.oneByURL,
  [constants$5.LAYOUT_TYPE]: layout$2.type,
  [constants$5.LAYOUT_IS_DESKTOP]: layout$2.isDesktop,
  [constants$5.LAYOUT_IS_MOBILE]: layout$2.isMobile,
  [constants$5.LAYOUT_SIZE]: layout$2.size,
  [constants$5.LAYOUT_COMPONENTS_GRID_COLUMN_COUNT]: layout$2.componentsGridColumnCount,
  [constants$5.LOCATION]: location$3.all,
  [constants$5.LOCATION_IS_TOP]: location$3.isTop,
  [constants$5.LOCATION_NAME]: location$3.name,
  [constants$5.LOCATION_ROUTE]: location$3.route,
  [constants$5.MENU_ENABLED]: menu.enabled,
  [constants$5.MODALS]: modals$2.all,
  [constants$5.OAS_CLIENT]: oas$2.client,
  [constants$5.OAS_SPEC]: oas$2.spec,
  [constants$5.OAS_ORIGINAL_SPEC]: oas$2.originalSpec,
  [constants$5.OAS_APIS]: oas$2.apis,
  [constants$5.OAS_FLAT_APIS]: oas$2.flatApis,
  [constants$5.OAS_API]: oas$2.api,
  [constants$5.OAS_API_BY_PATH_AND_METHOD]: oas$2.apiByPathAndMethod,
  [constants$5.OAS_PATH_ITEM_OBJECT]: oas$2.pathItemObject,
  [constants$5.OAS_PATH_ITEM_OBJECT_METHOD_NAME_BY_OPERATION_ID]: oas$2.pathItemObjectMethodNameByOperationId,
  [constants$5.OAS_OPERATION_OBJECT]: oas$2.operationObject,
  [constants$5.OAS_OPERATION_OBJECTS_AS_ACTION]: oas$2.operationObjectsAsAction,
  [constants$5.OAS_OPERATION_ID]: oas$2.operationId,
  [constants$5.OAS_PARAMETER_OBJECTS]: oas$2.parameterObjects,
  [constants$5.OAS_RESPONSE_OBJECT]: oas$2.responseObject,
  [constants$5.OAS_SCHEMA_OBJECT]: oas$2.schemaObject,
  [constants$5.PAGE]: page$2.all,
  [constants$5.PAGE_ID]: page$2.id,
  [constants$5.PAGE_NAME]: page$2.name,
  [constants$5.PAGE_COMPONENTS]: page$2.components,
  [constants$5.PAGE_COMPONENTS_TABLE]: page$2.componentsTable,
  [constants$5.PAGE_COMPONENTS_NOT_TABLE]: page$2.componentsNotTable,
  [constants$5.PAGE_COMPONENTS_COUNT]: page$2.componentsCount,
  [constants$5.POPOVERS]: popovers$2.all,
  [constants$5.TOASTS]: toasts$2.all,
  [constants$5.UA]: ua$2.all,
  [constants$5.UA_IS_SAFARI]: ua$2.isSafari,
  [constants$5.UA_IS_EDGE]: ua$2.isEdge,
  [constants$5.UA_IS_FIREFOX]: ua$2.isFirefox,
  [constants$5.UA_USING_BROWSER]: ua$2.usingBrowser
};

var auth = {
  /**
   * 指定されたエンドポイントのtokenを更新します。
   * @param {riotx.Context} context
   * @param {String} endpointKey
   * @param {String} token
   * @return {Promise}
   */
  update: (context, endpointKey, token) => {
    return Promise
      .resolve()
      .then(() => {
        context.commit(constants$2.ENDPOINTS_UPDATE_TOKEN, endpointKey, token);
      });
  },

  /**
   * 指定されたエンドポイントのtokenを削除します。
   * @param {riotx.Context} context
   * @param {String} endpointKey
   * @return {Promise}
   */
  remove: (context, endpointKey) => {
    return Promise
      .resolve()
      .then(() => {
        context.commit(constants$2.ENDPOINTS_UPDATE_TOKEN, endpointKey, null);
      });
  },

  /**
   * 指定されたエンドポイントのtokenが有効か確認します。
   * @param {riotx.Context} context
   * @param {String} endpointKey
   * @return {Promise}
   */
  validate: (context, endpointKey) => {
    const endpoint = context.getter(constants$5.ENDPOINTS_ONE, endpointKey);
    return Promise
      .resolve()
      .then(() => commonFetch(context, endpoint.url, {
        headers: {
          'Authorization': endpoint.token
        }
      }))
      .then(response => {
        const token = response.headers.get('Authorization');
        if (!!token) {
          context.commit(constants$2.ENDPOINTS_UPDATE_TOKEN, endpointKey, token);
        }
        return true;
      })
      .catch(err => {
        if (err.status !== 401) {
          throw err;
        }
        context.commit(constants$2.ENDPOINTS_UPDATE_TOKEN, endpointKey, null);
        return false;
      });
  },

  /**
   * 指定されたエンドポイントの認証手段を調べます。
   * @param {riotx.Context} context
   * @param {String} endpointKey
   * @return {Promise}
   */
  getTypes: (context, endpointKey) => {
    const endpoint = context.getter(constants$5.ENDPOINTS_ONE, endpointKey);
    const fetchUrl = `${new URL(endpoint.url).origin}/viron_authtype`;

    return Promise
      .resolve()
      .then(() => commonFetch(context, fetchUrl))
      .then(response => response.json());
  },

  /**
   * OAuth認証を行います。
   * @param {riotx.Context} context
   * @param {String} endpointKey
   * @param {Object} authtype
   * @return {Promise}
   */
  signinOAuth: (context, endpointKey, authtype) => {
    return Promise
      .resolve()
      .then(() => {
        const endpoint = context.getter(constants$5.ENDPOINTS_ONE, endpointKey);
        const origin = new URL(endpoint.url).origin;
        const redirect_url = encodeURIComponent(`${location.href}oauthredirect/${endpointKey}`);
        const fetchUrl = `${origin}${authtype.url}?redirect_url=${redirect_url}`;
        location.href = fetchUrl;
      });
  },

  /**
   * メールxパスワード認証を行います。
   * @param {riotx.Context} context
   * @param {String} endpointKey
   * @param {Object} authtype
   * @param {String} email
   * @param {String} password
   * @return {Promise}
   */
  signinEmail: (context, endpointKey, authtype, email, password) => {
    const endpoint = context.getter(constants$5.ENDPOINTS_ONE, endpointKey);
    const fetchUrl = `${new URL(endpoint.url).origin}${authtype.url}`;

    return Promise
      .resolve()
      .then(() => commonFetch(context, fetchUrl, {
        method: authtype.method,
        body: {
          email,
          password
        }
      }))
      .then(response => {
        const token = response.headers.get('Authorization');
        context.commit(constants$2.ENDPOINTS_UPDATE_TOKEN, endpointKey, token);
      });
  }
};

// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

// resolves . and .. elements in a path array with directory names there
// must be no slashes, empty elements, or device names (c:\) in the array
// (so also no leading and trailing slashes - it does not distinguish
// relative and absolute paths)
function normalizeArray(parts, allowAboveRoot) {
  // if the path tries to go above the root, `up` ends up > 0
  var up = 0;
  for (var i = parts.length - 1; i >= 0; i--) {
    var last = parts[i];
    if (last === '.') {
      parts.splice(i, 1);
    } else if (last === '..') {
      parts.splice(i, 1);
      up++;
    } else if (up) {
      parts.splice(i, 1);
      up--;
    }
  }

  // if the path is allowed to go above the root, restore leading ..s
  if (allowAboveRoot) {
    for (; up--; up) {
      parts.unshift('..');
    }
  }

  return parts;
}

// Split a filename into [root, dir, basename, ext], unix version
// 'root' is just a slash, or nothing.
var splitPathRe =
    /^(\/?|)([\s\S]*?)((?:\.{1,2}|[^\/]+?|)(\.[^.\/]*|))(?:[\/]*)$/;
var splitPath = function(filename) {
  return splitPathRe.exec(filename).slice(1);
};

// path.resolve([from ...], to)
// posix version
function resolve() {
  var resolvedPath = '',
      resolvedAbsolute = false;

  for (var i = arguments.length - 1; i >= -1 && !resolvedAbsolute; i--) {
    var path = (i >= 0) ? arguments[i] : '/';

    // Skip empty and invalid entries
    if (typeof path !== 'string') {
      throw new TypeError('Arguments to path.resolve must be strings');
    } else if (!path) {
      continue;
    }

    resolvedPath = path + '/' + resolvedPath;
    resolvedAbsolute = path.charAt(0) === '/';
  }

  // At this point the path should be resolved to a full absolute path, but
  // handle relative paths to be safe (might happen when process.cwd() fails)

  // Normalize the path
  resolvedPath = normalizeArray(filter$6(resolvedPath.split('/'), function(p) {
    return !!p;
  }), !resolvedAbsolute).join('/');

  return ((resolvedAbsolute ? '/' : '') + resolvedPath) || '.';
}

// path.normalize(path)
// posix version
function normalize(path) {
  var isPathAbsolute = isAbsolute$1(path),
      trailingSlash = substr(path, -1) === '/';

  // Normalize the path
  path = normalizeArray(filter$6(path.split('/'), function(p) {
    return !!p;
  }), !isPathAbsolute).join('/');

  if (!path && !isPathAbsolute) {
    path = '.';
  }
  if (path && trailingSlash) {
    path += '/';
  }

  return (isPathAbsolute ? '/' : '') + path;
}

// posix version
function isAbsolute$1(path) {
  return path.charAt(0) === '/';
}

// posix version
function join$1() {
  var paths = Array.prototype.slice.call(arguments, 0);
  return normalize(filter$6(paths, function(p, index) {
    if (typeof p !== 'string') {
      throw new TypeError('Arguments to path.join must be strings');
    }
    return p;
  }).join('/'));
}


// path.relative(from, to)
// posix version
function relative(from, to) {
  from = resolve(from).substr(1);
  to = resolve(to).substr(1);

  function trim(arr) {
    var start = 0;
    for (; start < arr.length; start++) {
      if (arr[start] !== '') { break; }
    }

    var end = arr.length - 1;
    for (; end >= 0; end--) {
      if (arr[end] !== '') { break; }
    }

    if (start > end) { return []; }
    return arr.slice(start, end - start + 1);
  }

  var fromParts = trim(from.split('/'));
  var toParts = trim(to.split('/'));

  var length = Math.min(fromParts.length, toParts.length);
  var samePartsLength = length;
  for (var i = 0; i < length; i++) {
    if (fromParts[i] !== toParts[i]) {
      samePartsLength = i;
      break;
    }
  }

  var outputParts = [];
  for (var i = samePartsLength; i < fromParts.length; i++) {
    outputParts.push('..');
  }

  outputParts = outputParts.concat(toParts.slice(samePartsLength));

  return outputParts.join('/');
}

var sep = '/';
var delimiter = ':';

function dirname(path) {
  var result = splitPath(path),
      root = result[0],
      dir = result[1];

  if (!root && !dir) {
    // No dirname whatsoever
    return '.';
  }

  if (dir) {
    // It has a dirname, strip trailing slash
    dir = dir.substr(0, dir.length - 1);
  }

  return root + dir;
}

function basename$1(path, ext) {
  var f = splitPath(path)[2];
  // TODO: make this comparison case-insensitive on windows?
  if (ext && f.substr(-1 * ext.length) === ext) {
    f = f.substr(0, f.length - ext.length);
  }
  return f;
}


function extname(path) {
  return splitPath(path)[3];
}
var path = {
  extname: extname,
  basename: basename$1,
  dirname: dirname,
  sep: sep,
  delimiter: delimiter,
  relative: relative,
  join: join$1,
  isAbsolute: isAbsolute$1,
  normalize: normalize,
  resolve: resolve
};
function filter$6 (xs, f) {
    if (xs.filter) { return xs.filter(f); }
    var res = [];
    for (var i = 0; i < xs.length; i++) {
        if (f(xs[i], i, xs)) { res.push(xs[i]); }
    }
    return res;
}

// String.prototype.substr - negative index don't work in IE8
var substr = 'ab'.substr(-1) === 'b' ?
    function (str, start, len) { return str.substr(start, len) } :
    function (str, start, len) {
        if (start < 0) { start = str.length + start; }
        return str.substr(start, len);
    };


var path$1 = Object.freeze({
	resolve: resolve,
	normalize: normalize,
	isAbsolute: isAbsolute$1,
	join: join$1,
	relative: relative,
	sep: sep,
	delimiter: delimiter,
	dirname: dirname,
	basename: basename$1,
	extname: extname,
	default: path
});

var require$$0$2 = ( path$1 && path ) || path$1;

/*!
 * content-disposition
 * Copyright(c) 2014 Douglas Christopher Wilson
 * MIT Licensed
 */

'use strict';

/**
 * Module exports.
 */

var contentDisposition_1 = contentDisposition;
var parse_1$1 = parse$1;

/**
 * Module dependencies.
 */

var basename = require$$0$2.basename;

/**
 * RegExp to match non attr-char, *after* encodeURIComponent (i.e. not including "%")
 */

var ENCODE_URL_ATTR_CHAR_REGEXP = /[\x00-\x20"'()*,/:;<=>?@[\\\]{}\x7f]/g; // eslint-disable-line no-control-regex

/**
 * RegExp to match percent encoding escape.
 */

var HEX_ESCAPE_REGEXP = /%[0-9A-Fa-f]{2}/;
var HEX_ESCAPE_REPLACE_REGEXP = /%([0-9A-Fa-f]{2})/g;

/**
 * RegExp to match non-latin1 characters.
 */

var NON_LATIN1_REGEXP = /[^\x20-\x7e\xa0-\xff]/g;

/**
 * RegExp to match quoted-pair in RFC 2616
 *
 * quoted-pair = "\" CHAR
 * CHAR        = <any US-ASCII character (octets 0 - 127)>
 */

var QESC_REGEXP = /\\([\u0000-\u007f])/g;

/**
 * RegExp to match chars that must be quoted-pair in RFC 2616
 */

var QUOTE_REGEXP = /([\\"])/g;

/**
 * RegExp for various RFC 2616 grammar
 *
 * parameter     = token "=" ( token | quoted-string )
 * token         = 1*<any CHAR except CTLs or separators>
 * separators    = "(" | ")" | "<" | ">" | "@"
 *               | "," | ";" | ":" | "\" | <">
 *               | "/" | "[" | "]" | "?" | "="
 *               | "{" | "}" | SP | HT
 * quoted-string = ( <"> *(qdtext | quoted-pair ) <"> )
 * qdtext        = <any TEXT except <">>
 * quoted-pair   = "\" CHAR
 * CHAR          = <any US-ASCII character (octets 0 - 127)>
 * TEXT          = <any OCTET except CTLs, but including LWS>
 * LWS           = [CRLF] 1*( SP | HT )
 * CRLF          = CR LF
 * CR            = <US-ASCII CR, carriage return (13)>
 * LF            = <US-ASCII LF, linefeed (10)>
 * SP            = <US-ASCII SP, space (32)>
 * HT            = <US-ASCII HT, horizontal-tab (9)>
 * CTL           = <any US-ASCII control character (octets 0 - 31) and DEL (127)>
 * OCTET         = <any 8-bit sequence of data>
 */

var PARAM_REGEXP = /;[\x09\x20]*([!#$%&'*+.0-9A-Z^_`a-z|~-]+)[\x09\x20]*=[\x09\x20]*("(?:[\x20!\x23-\x5b\x5d-\x7e\x80-\xff]|\\[\x20-\x7e])*"|[!#$%&'*+.0-9A-Z^_`a-z|~-]+)[\x09\x20]*/g; // eslint-disable-line no-control-regex
var TEXT_REGEXP = /^[\x20-\x7e\x80-\xff]+$/;
var TOKEN_REGEXP = /^[!#$%&'*+.0-9A-Z^_`a-z|~-]+$/;

/**
 * RegExp for various RFC 5987 grammar
 *
 * ext-value     = charset  "'" [ language ] "'" value-chars
 * charset       = "UTF-8" / "ISO-8859-1" / mime-charset
 * mime-charset  = 1*mime-charsetc
 * mime-charsetc = ALPHA / DIGIT
 *               / "!" / "#" / "$" / "%" / "&"
 *               / "+" / "-" / "^" / "_" / "`"
 *               / "{" / "}" / "~"
 * language      = ( 2*3ALPHA [ extlang ] )
 *               / 4ALPHA
 *               / 5*8ALPHA
 * extlang       = *3( "-" 3ALPHA )
 * value-chars   = *( pct-encoded / attr-char )
 * pct-encoded   = "%" HEXDIG HEXDIG
 * attr-char     = ALPHA / DIGIT
 *               / "!" / "#" / "$" / "&" / "+" / "-" / "."
 *               / "^" / "_" / "`" / "|" / "~"
 */

var EXT_VALUE_REGEXP = /^([A-Za-z0-9!#$%&+\-^_`{}~]+)'(?:[A-Za-z]{2,3}(?:-[A-Za-z]{3}){0,3}|[A-Za-z]{4,8}|)'((?:%[0-9A-Fa-f]{2}|[A-Za-z0-9!#$&+.^_`|~-])+)$/;

/**
 * RegExp for various RFC 6266 grammar
 *
 * disposition-type = "inline" | "attachment" | disp-ext-type
 * disp-ext-type    = token
 * disposition-parm = filename-parm | disp-ext-parm
 * filename-parm    = "filename" "=" value
 *                  | "filename*" "=" ext-value
 * disp-ext-parm    = token "=" value
 *                  | ext-token "=" ext-value
 * ext-token        = <the characters in token, followed by "*">
 */

var DISPOSITION_TYPE_REGEXP = /^([!#$%&'*+.0-9A-Z^_`a-z|~-]+)[\x09\x20]*(?:$|;)/; // eslint-disable-line no-control-regex

/**
 * Create an attachment Content-Disposition header.
 *
 * @param {string} [filename]
 * @param {object} [options]
 * @param {string} [options.type=attachment]
 * @param {string|boolean} [options.fallback=true]
 * @return {string}
 * @api public
 */

function contentDisposition (filename, options) {
  var opts = options || {};

  // get type
  var type = opts.type || 'attachment';

  // get parameters
  var params = createparams(filename, opts.fallback);

  // format into string
  return format(new ContentDisposition(type, params))
}

/**
 * Create parameters object from filename and fallback.
 *
 * @param {string} [filename]
 * @param {string|boolean} [fallback=true]
 * @return {object}
 * @api private
 */

function createparams (filename, fallback) {
  if (filename === undefined) {
    return
  }

  var params = {};

  if (typeof filename !== 'string') {
    throw new TypeError('filename must be a string')
  }

  // fallback defaults to true
  if (fallback === undefined) {
    fallback = true;
  }

  if (typeof fallback !== 'string' && typeof fallback !== 'boolean') {
    throw new TypeError('fallback must be a string or boolean')
  }

  if (typeof fallback === 'string' && NON_LATIN1_REGEXP.test(fallback)) {
    throw new TypeError('fallback must be ISO-8859-1 string')
  }

  // restrict to file base name
  var name = basename(filename);

  // determine if name is suitable for quoted string
  var isQuotedString = TEXT_REGEXP.test(name);

  // generate fallback name
  var fallbackName = typeof fallback !== 'string'
    ? fallback && getlatin1(name)
    : basename(fallback);
  var hasFallback = typeof fallbackName === 'string' && fallbackName !== name;

  // set extended filename parameter
  if (hasFallback || !isQuotedString || HEX_ESCAPE_REGEXP.test(name)) {
    params['filename*'] = name;
  }

  // set filename parameter
  if (isQuotedString || hasFallback) {
    params.filename = hasFallback
      ? fallbackName
      : name;
  }

  return params
}

/**
 * Format object to Content-Disposition header.
 *
 * @param {object} obj
 * @param {string} obj.type
 * @param {object} [obj.parameters]
 * @return {string}
 * @api private
 */

function format (obj) {
  var parameters = obj.parameters;
  var type = obj.type;

  if (!type || typeof type !== 'string' || !TOKEN_REGEXP.test(type)) {
    throw new TypeError('invalid type')
  }

  // start with normalized type
  var string = String(type).toLowerCase();

  // append parameters
  if (parameters && typeof parameters === 'object') {
    var param;
    var params = Object.keys(parameters).sort();

    for (var i = 0; i < params.length; i++) {
      param = params[i];

      var val = param.substr(-1) === '*'
        ? ustring(parameters[param])
        : qstring(parameters[param]);

      string += '; ' + param + '=' + val;
    }
  }

  return string
}

/**
 * Decode a RFC 6987 field value (gracefully).
 *
 * @param {string} str
 * @return {string}
 * @api private
 */

function decodefield (str) {
  var match = EXT_VALUE_REGEXP.exec(str);

  if (!match) {
    throw new TypeError('invalid extended field value')
  }

  var charset = match[1].toLowerCase();
  var encoded = match[2];
  var value;

  // to binary string
  var binary = encoded.replace(HEX_ESCAPE_REPLACE_REGEXP, pdecode);

  switch (charset) {
    case 'iso-8859-1':
      value = getlatin1(binary);
      break
    case 'utf-8':
      value = new Buffer(binary, 'binary').toString('utf8');
      break
    default:
      throw new TypeError('unsupported charset in extended field')
  }

  return value
}

/**
 * Get ISO-8859-1 version of string.
 *
 * @param {string} val
 * @return {string}
 * @api private
 */

function getlatin1 (val) {
  // simple Unicode -> ISO-8859-1 transformation
  return String(val).replace(NON_LATIN1_REGEXP, '?')
}

/**
 * Parse Content-Disposition header string.
 *
 * @param {string} string
 * @return {object}
 * @api private
 */

function parse$1 (string) {
  if (!string || typeof string !== 'string') {
    throw new TypeError('argument string is required')
  }

  var match = DISPOSITION_TYPE_REGEXP.exec(string);

  if (!match) {
    throw new TypeError('invalid type format')
  }

  // normalize type
  var index = match[0].length;
  var type = match[1].toLowerCase();

  var key;
  var names = [];
  var params = {};
  var value;

  // calculate index to start at
  index = PARAM_REGEXP.lastIndex = match[0].substr(-1) === ';'
    ? index - 1
    : index;

  // match parameters
  while ((match = PARAM_REGEXP.exec(string))) {
    if (match.index !== index) {
      throw new TypeError('invalid parameter format')
    }

    index += match[0].length;
    key = match[1].toLowerCase();
    value = match[2];

    if (names.indexOf(key) !== -1) {
      throw new TypeError('invalid duplicate parameter')
    }

    names.push(key);

    if (key.indexOf('*') + 1 === key.length) {
      // decode extended value
      key = key.slice(0, -1);
      value = decodefield(value);

      // overwrite existing value
      params[key] = value;
      continue
    }

    if (typeof params[key] === 'string') {
      continue
    }

    if (value[0] === '"') {
      // remove quotes and escapes
      value = value
        .substr(1, value.length - 2)
        .replace(QESC_REGEXP, '$1');
    }

    params[key] = value;
  }

  if (index !== -1 && index !== string.length) {
    throw new TypeError('invalid parameter format')
  }

  return new ContentDisposition(type, params)
}

/**
 * Percent decode a single character.
 *
 * @param {string} str
 * @param {string} hex
 * @return {string}
 * @api private
 */

function pdecode (str, hex) {
  return String.fromCharCode(parseInt(hex, 16))
}

/**
 * Percent encode a single character.
 *
 * @param {string} char
 * @return {string}
 * @api private
 */

function pencode (char) {
  var hex = String(char)
    .charCodeAt(0)
    .toString(16)
    .toUpperCase();
  return hex.length === 1
    ? '%0' + hex
    : '%' + hex
}

/**
 * Quote a string for HTTP.
 *
 * @param {string} val
 * @return {string}
 * @api private
 */

function qstring (val) {
  var str = String(val);

  return '"' + str.replace(QUOTE_REGEXP, '\\$1') + '"'
}

/**
 * Encode a Unicode string for HTTP (RFC 5987).
 *
 * @param {string} val
 * @return {string}
 * @api private
 */

function ustring (val) {
  var str = String(val);

  // percent encode as UTF-8
  var encoded = encodeURIComponent(str)
    .replace(ENCODE_URL_ATTR_CHAR_REGEXP, pencode);

  return 'UTF-8\'\'' + encoded
}

/**
 * Class for parsed Content-Disposition header for v8 optimization
 */

function ContentDisposition (type, parameters) {
  this.type = type;
  this.parameters = parameters;
}

contentDisposition_1.parse = parse_1$1;

var download = createCommonjsModule(function (module, exports) {
//download.js v4.2, by dandavis; 2008-2016. [CCBY2] see http://danml.com/download.html for tests/usage
// v1 landed a FF+Chrome compat way of downloading strings to local un-named files, upgraded to use a hidden frame and optional mime
// v2 added named files via a[download], msSaveBlob, IE (10+) support, and window.URL support for larger+faster saves than dataURLs
// v3 added dataURL and Blob Input, bind-toggle arity, and legacy dataURL fallback was improved with force-download mime and base64 support. 3.1 improved safari handling.
// v4 adds AMD/UMD, commonJS, and plain browser support
// v4.1 adds url download capability via solo URL argument (same domain/CORS only)
// v4.2 adds semantic variable names, long (over 2MB) dataURL support, and hidden by default temp anchors
// https://github.com/rndme/download

(function (root, factory) {
	if (typeof undefined === 'function' && undefined.amd) {
		// AMD. Register as an anonymous module.
		undefined([], factory);
	} else {
		// Node. Does not work with strict CommonJS, but
		// only CommonJS-like environments that support module.exports,
		// like Node.
		module.exports = factory();
	}
}(commonjsGlobal, function () {

	return function download(data, strFileName, strMimeType) {

		var self = window, // this script is only for browsers anyway...
			defaultMime = "application/octet-stream", // this default mime also triggers iframe downloads
			mimeType = strMimeType || defaultMime,
			payload = data,
			url = !strFileName && !strMimeType && payload,
			anchor = document.createElement("a"),
			toString = function(a){return String(a);},
			myBlob = (self.Blob || self.MozBlob || self.WebKitBlob || toString),
			fileName = strFileName || "download",
			blob,
			reader;
			myBlob= myBlob.call ? myBlob.bind(self) : Blob ;
	  
		if(String(this)==="true"){ //reverse arguments, allowing download.bind(true, "text/xml", "export.xml") to act as a callback
			payload=[payload, mimeType];
			mimeType=payload[0];
			payload=payload[1];
		}


		if(url && url.length< 2048){ // if no filename and no mime, assume a url was passed as the only argument
			fileName = url.split("/").pop().split("?")[0];
			anchor.href = url; // assign href prop to temp anchor
		  	if(anchor.href.indexOf(url) !== -1){ // if the browser determines that it's a potentially valid url path:
        		var ajax=new XMLHttpRequest();
        		ajax.open( "GET", url, true);
        		ajax.responseType = 'blob';
        		ajax.onload= function(e){ 
				  download(e.target.response, fileName, defaultMime);
				};
        		setTimeout(function(){ ajax.send();}, 0); // allows setting custom ajax headers using the return:
			    return ajax;
			} // end if valid url?
		} // end if url?


		//go ahead and download dataURLs right away
		if(/^data\:[\w+\-]+\/[\w+\-]+[,;]/.test(payload)){
		
			if(payload.length > (1024*1024*1.999) && myBlob !== toString ){
				payload=dataUrlToBlob(payload);
				mimeType=payload.type || defaultMime;
			}else{			
				return navigator.msSaveBlob ?  // IE10 can't do a[download], only Blobs:
					navigator.msSaveBlob(dataUrlToBlob(payload), fileName) :
					saver(payload) ; // everyone else can save dataURLs un-processed
			}
			
		}//end if dataURL passed?

		blob = payload instanceof myBlob ?
			payload :
			new myBlob([payload], {type: mimeType}) ;


		function dataUrlToBlob(strUrl) {
			var parts= strUrl.split(/[:;,]/),
			type= parts[1],
			decoder= parts[2] == "base64" ? atob : decodeURIComponent,
			binData= decoder( parts.pop() ),
			mx= binData.length,
			i= 0,
			uiArr= new Uint8Array(mx);

			for(i;i<mx;++i) { uiArr[i]= binData.charCodeAt(i); }

			return new myBlob([uiArr], {type: type});
		 }

		function saver(url, winMode){

			if ('download' in anchor) { //html5 A[download]
				anchor.href = url;
				anchor.setAttribute("download", fileName);
				anchor.className = "download-js-link";
				anchor.innerHTML = "downloading...";
				anchor.style.display = "none";
				document.body.appendChild(anchor);
				setTimeout(function() {
					anchor.click();
					document.body.removeChild(anchor);
					if(winMode===true){setTimeout(function(){ self.URL.revokeObjectURL(anchor.href);}, 250 );}
				}, 66);
				return true;
			}

			// handle non-a[download] safari as best we can:
			if(/(Version)\/(\d+)\.(\d+)(?:\.(\d+))?.*Safari\//.test(navigator.userAgent)) {
				url=url.replace(/^data:([\w\/\-\+]+)/, defaultMime);
				if(!window.open(url)){ // popup blocked, offer direct download:
					if(confirm("Displaying New Document\n\nUse Save As... to download, then click back to return to this page.")){ location.href=url; }
				}
				return true;
			}

			//do iframe dataURL download (old ch+FF):
			var f = document.createElement("iframe");
			document.body.appendChild(f);

			if(!winMode){ // force a mime that will download:
				url="data:"+url.replace(/^data:([\w\/\-\+]+)/, defaultMime);
			}
			f.src=url;
			setTimeout(function(){ document.body.removeChild(f); }, 333);

		}//end saver




		if (navigator.msSaveBlob) { // IE10+ : (has Blob, but not a[download] or URL)
			return navigator.msSaveBlob(blob, fileName);
		}

		if(self.URL){ // simple fast and modern way using Blob and URL:
			saver(self.URL.createObjectURL(blob), true);
		}else{
			// handle non-Blob()+non-URL browsers:
			if(typeof blob === "string" || blob.constructor===toString ){
				try{
					return saver( "data:" +  mimeType   + ";base64,"  +  self.btoa(blob)  );
				}catch(y){
					return saver( "data:" +  mimeType   + "," + encodeURIComponent(blob)  );
				}
			}

			// Blob but not URL support:
			reader=new FileReader();
			reader.onload=function(e){
				saver(this.result);
			};
			reader.readAsDataURL(blob);
		}
		return true;
	}; /* end download() */
}));
});

var components$3 = {
  /**
   * 一つのコンポーネント情報を取得します。
   * @param {riotx.Context} context
   * @param {String} component_uid
   * @param {Object} component
   * @param {Object} query
   * @return {Promise}
   */
  get: (context, component_uid, component, query) => {
    const method = component.api.method;
    // GETメソッドのみサポート。
    if (method !== 'get') {
      return Promise.reject('only `get` method is allowed.');
    }
    let path = component.api.path;
    if (path.indexOf('/') !== 0) {
      path = '/' + path;
    }
    const actions = context.getter(constants$5.OAS_OPERATION_OBJECTS_AS_ACTION, component);

    const api = context.getter(constants$5.OAS_API_BY_PATH_AND_METHOD, path, method);
    const currentEndpointKey = context.getter(constants$5.CURRENT);
    const currentEndpoint = context.getter(constants$5.ENDPOINTS_ONE, currentEndpointKey);
    const token = currentEndpoint.token;
    const networkingId = `networking_${Date.now()}`;

    return Promise
      .resolve()
      .then(() => context.commit(constants$2.APPLICATION_NETWORKINGS_ADD, {
        id: networkingId
      }))
      .then(() => api(query, {
        requestInterceptor: req => {
          req.headers['Authorization'] = token;
        }
      }))
      .then(res => {
        if (!res.ok) {
          return Promise.reject(res);
        }
        return res;
      })
      .then(res => {
        // tokenを更新する。
        const token = res.headers['Authorization'];
        if (!!token) {
          context.commit(constants$2.ENDPOINTS_UPDATE_TOKEN, currentEndpointKey, token);
        }
        // `component.pagination`からページングをサポートしているか判断する。
        // サポートしていれば手動でページング情報を付加する。
        let hasPagination = false;
        let pagination;
        if (component.pagination) {
          const currentPage = Number(res.headers['x-pagination-current-page'] || 0);
          const size = Number(res.headers['x-pagination-limit'] || 0);
          const maxPage = Number(res.headers['x-pagination-total-pages'] || 0);
          pagination = {
            // `x-pagination-current-page`等は独自仕様。
            // VIRONを使用するサービスはこの仕様に沿う必要がある。
            currentPage,
            size,
            maxPage
          };
          // 2ページ以上存在する場合のみページングをONにする。
          if (maxPage >= 2) {
            hasPagination = true;
          }
        }
        context.commit(constants$2.COMPONENTS_UPDATE_ONE, {
          component_uid,
          response: res.obj,// APIレスポンス内容そのまま。
          schemaObject: context.getter(constants$5.OAS_SCHEMA_OBJECT, path, method),// OASのschema。
          parameterObjects: context.getter(constants$5.OAS_PARAMETER_OBJECTS, path, method),// OASのparameterObject群。
          actions,// 関連API群。
          hasPagination,
          pagination,// ページング関連。
          autoRefreshSec: (component.auto_refresh_sec || 0),
          primaryKey: component.primary || null,// テーブルで使用するprimaryキー。
          table_labels: component.table_labels || []// テーブル行名で優先度が高いkey群。
        });
        context.commit(constants$2.APPLICATION_NETWORKINGS_REMOVE, networkingId);
      })
      .catch(err => {
        context.commit(constants$2.APPLICATION_NETWORKINGS_REMOVE, networkingId);
        throw err;
      });
  },

  /**
   * APIコールします。
   * @param {riotx.Context} context
   * @param {Object} operationObject
   * @param {Object} params
   * @return {Promise}
   */
  operate: (context, operationObject, params) => {
    const api = context.getter(constants$5.OAS_API, operationObject.operationId);
    const token = context.getter(constants$5.ENDPOINTS_ONE, context.getter(constants$5.CURRENT)).token;
    const currentEndpointKey = context.getter(constants$5.CURRENT);
    const networkingId = `networking_${Date.now()}`;

    return Promise
      .resolve()
      .then(() => context.commit(constants$2.APPLICATION_NETWORKINGS_ADD, {
        id: networkingId
      }))
      .then(() => api(params, {
        requestInterceptor: req => {
          req.headers['Authorization'] = token;
        }
      }))
      .then(res => {
        if (!res.ok) {
          return Promise.reject(res);
        }
        return res;
      })
      .then(res => {
        context.commit(constants$2.APPLICATION_NETWORKINGS_REMOVE, networkingId);
        // tokenを更新する。
        const token = res.headers['Authorization'];
        if (!!token) {
          context.commit(constants$2.ENDPOINTS_UPDATE_TOKEN, currentEndpointKey, token);
        }
        // ダウンロード指定されていればダウンロードする。
        const contentDispositionHeader = res.headers['content-disposition'];
        if (!contentDispositionHeader) {
          return res;
        }
        const downloadFileInfo = contentDisposition_1.parse(contentDispositionHeader);
        if (downloadFileInfo.type !== 'attachment') {
          return res;
        }
        download(res.data, downloadFileInfo.parameters.filename, res.headers['content-type']);
        return res;
      })
      .catch(err => {
        context.commit(constants$2.APPLICATION_NETWORKINGS_REMOVE, networkingId);
        throw err;
      });
  },

  /**
   * 一件削除します。
   * @param {riotx.Context} context
   * @param {String} component_uid
   * @return {Promise}
   */
  remove: (context, component_uid) => {
    return Promise
      .resolve()
      .then(() => {
        context.commit(constants$2.COMPONENTS_REMOVE_ONE, component_uid);
      });
  },

  /**
   * 全件削除します。
   * @param {riotx.Context} context
   * @return {Promise}
   */
  removeAll: context => {
    return Promise
      .resolve()
      .then(() => {
        context.commit(constants$2.COMPONENTS_REMOVE_ALL);
      });
  }
};

var current$3 = {
  /**
   * 選択中endpointKeyを更新します。
   * @param {riotx.Context} context
   * @param {String} endpointKey
   * @return {Promise}
   */
  update: (context, endpointKey) => {
    return Promise
      .resolve()
      .then(() => {
        context.commit(constants$2.CURRENT, endpointKey);
      });
  },

  /**
   * 選択中endpointKeyを削除します。
   * @param {riotx.Context} context
   * @return {Promise}
   */
  remove: context => {
    return Promise
      .resolve()
      .then(() => {
        context.commit(constants$2.CURRENT, null);
      });
  }
};

// APIは必須でサポートしなければならない URI
const VIRON_URI = '/viron';

var viron$3 = {
  /**
   * viron情報(各管理画面の基本情報)を取得します。
   * @param {riotx.Context} context
   * @return {Promise}
   */
  get: context => {
    const operationObject = context.getter(constants$5.OAS_OPERATION_OBJECT, VIRON_URI, 'get');
    const api = context.getter(constants$5.OAS_API, operationObject.operationId);
    const currentEndpointKey = context.getter(constants$5.CURRENT);
    const currentEndpoint = context.getter(constants$5.ENDPOINTS_ONE, currentEndpointKey);
    const token = currentEndpoint.token;
    const networkingId = `networking_${Date.now()}`;

    return Promise
      .resolve()
      .then(() => context.commit(constants$2.APPLICATION_NETWORKINGS_ADD, {
        id: networkingId
      }))
      .then(() => api({}, {
        requestInterceptor: req => {
          req.headers['Authorization'] = token;
        }
      }))
      .then(res => {
        if (!res.ok) {
          return Promise.reject(res);
        }
        return res;
      })
      .then(res => {
        // tokenを更新する。
        const token = res.headers['Authorization'];
        if (!!token) {
          context.commit(constants$2.ENDPOINTS_UPDATE_TOKEN, currentEndpointKey, token);
        }
        context.commit(constants$2.VIRON, res.obj);
        const endpoint = objectAssign({}, res.obj);
        // pagesは不要なので削除。
        delete endpoint.pages;
        context.commit(constants$2.ENDPOINTS_UPDATE, currentEndpointKey, endpoint);
        context.commit(constants$2.APPLICATION_NETWORKINGS_REMOVE, networkingId);
      })
      .catch(err => {
        context.commit(constants$2.APPLICATION_NETWORKINGS_REMOVE, networkingId);
        throw err;
      });
  },

  /**
   * viron情報を削除します。
   * @param {riotx.Context} context
   * @return {Promise}
   */
  remove: context => {
    return Promise
      .resolve()
      .then(() => {
        context.commit(constants$2.VIRON, null);
      });
  }
};

var drawers$3 = {
  /**
   * ドローワーを追加します。
   * @param {riotx.Context} context
   * @param {String} tagName
   * @param {Object} tagOpts
   * @param {Object} drawerOpts
   * @return {Promise}
   */
  add: (context, tagName, tagOpts, drawerOpts) => {
    return Promise
      .resolve()
      .then(() => {
        context.commit(constants$2.DRAWERS_ADD, tagName, tagOpts, drawerOpts);
      });
  },

  /**
   * ドローワーを削除します。
   * @param {riotx.Context} context
   * @param {String} drawerId
   * @return {Promise}
   */
  remove: (context, drawerId) => {
    return Promise
      .resolve()
      .then(() => {
        context.commit(constants$2.DRAWERS_REMOVE, drawerId);
      });
  }
};

var endpoints$3 = {
  /**
   * 1件のエンドポイントを追加します。
   * @param {riotx.Context} context
   * @param {String} url
   * @param {String} memo
   * @return {Promise}
   */
  add: (context, url, memo) => {
    return Promise
      .resolve()
      .then(() => commonFetch(context, url))
      .catch(err => {
        // 401エラーは想定内。
        // 401 = endpointが存在しているので認証エラーになる。
        // 401以外 = endpointが存在しない。
        if (err.status !== 401) {
          throw err;
        }
        //
        const key = shortid.generate();
        const newEndpoint = {
          url: url,
          memo: memo,
          token: null,
          title: '',
          name: '',
          description: '',
          version: '',
          color: '',
          thumbnail: './img/viron_default.png',
          tags: []
        };
        context.commit(constants$2.ENDPOINTS_ADD, key, newEndpoint);
      });
  },

  /**
   * 1件のエンドポイントを更新します
   * @param {riotx.Context} context
   * @param {String} url
   * @param {Object} newEndpoint
   * @return {Promise}
   */
  update: (context, key, newEndpoint) => {
    return Promise
      .resolve()
      .then(() => {
        context.commit(constants$2.ENDPOINTS_UPDATE, key, newEndpoint);
      });
  },

  /**
   * 1件のエンドポイントを削除します。
   * @param {riotx.Context} context
   * @param {String} key
   * @return {Promise}
   */
  remove: (context, key) => {
    return Promise
      .resolve()
      .then(() => {
        context.commit(constants$2.ENDPOINTS_REMOVE, key);
      });
  },

  /**
   * 全てのエンドポイントを削除します。
   * @param {riotx.Context} context
   * @return {Promise}
   */
  removeAll: context => {
    return Promise
      .resolve()
      .then(() => {
        context.commit(constants$2.ENDPOINTS_REMOVE_ALL);
      });
  },

  /**
   * 新エンドポイント群を既存エンドポイント群にmergeします。
   * @param {riotx.Context} context
   * @param {Object} endpoints
   * @return {Promise}
   */
  mergeAll: (context, endpoints) => {
    return Promise
      .resolve()
      .then(() => {
        context.commit(constants$2.ENDPOINTS_MERGE_ALL, endpoints);
      });
  },

  /**
   * 一件の新エンドポイントを既存エンドポイント群にmergeします。
   * endpointKeyも新規生成します。
   * @param {riotx.Context} context
   * @param {Object} endpoint
   * @return {Promise}
   */
  mergeOneWithKey: (context, endpoint) => {
    return Promise
      .resolve()
      .then(() => {
        const key = shortid.generate();
        context.commit(constants$2.ENDPOINTS_ADD, key, endpoint);
      });
  },

  /**
   * エンドポイントのorder値を整理します。
   * order値が存在しない等への対応を行います。
   * @param {riotx.Context} context
   * @return {Promise}
   */
  tidyUpOrder: context => {
    return Promise
      .resolve()
      .then(() => {
        context.commit(constants$2.ENDPOINTS_TIDY_UP_ORDER);
      });
  },

  /**
   * 指定されたエンドポイントのorder値を変更します。
   * @param {riotx.Context} context
   * @param {String} endpointKey
   * @param {Number} newOrder
   * @return {Promise}
   */
  changeOrder: (context, endpointKey, newOrder) => {
    return Promise
      .resolve()
      .then(() => {
        context.commit(constants$2.ENDPOINTS_CHANGE_ORDER, endpointKey, newOrder);
      });
  }
};

var layout$3 = {
  /**
   * アプリケーションの表示サイズを更新します。
   * @param {riotx.Context} context
   * @param {Number} width
   * @param {Number} height
   * @return {Promise}
   */
  updateSize: (context, width, height) => {
    return Promise
      .resolve()
      .then(() => {
        context.commit(constants$2.LAYOUT_SIZE, width, height);
      });
  },

  /**
   * componentリストのgridレイアウトのcolumn数を更新します。
   * @param {riotx.Context} context
   * @param {Number} count
   * @return {Promise}
   */
  updateComponentsGridColumnCount: (context, count) => {
    return Promise
      .resolve()
      .then(() => {
        context.commit(constants$2.LAYOUT_COMPONENTS_GRID_COLUMN_COUNT, count);
      });
  }
};

var location$4 = {
  /**
   * 更新します。
   * @param {riotx.Context} context
   * @param {Object} obj
   * @return {Promise}
   */
  update: (context, obj) => {
    return Promise
      .resolve()
      .then(() => {
        context.commit(constants$2.LOCATION, obj);
      });
  }
};

// モーダルを多重起動しないよう判定する変数
let canCreateModal = true;
// タイマーID管理用変数
let timer;

var modals$3 = {
  /**
   * モーダルを追加します。
   * @param {riotx.Context} context
   * @param {String} tagName
   * @param {Object} tagOpts
   * @param {Object} modalOpts
   * @return {Promise}
   */
  add: (context, tagName, tagOpts, modalOpts) => {
    if (!canCreateModal) {
      console.warn('多重に起動しないよう、一定時間のモーダル作成を規制する。'); // eslint-disable-line no-console
      return;
    }

    // モーダル作成を一時的に不可にする。
    canCreateModal = false;
    clearTimeout(timer);

    // 一定時間後にモーダル作成可とする。
    timer = setTimeout(() => {
      canCreateModal = true;
    }, 300);

    return Promise
      .resolve()
      .then(() => {
        context.commit(constants$2.MODALS_ADD, tagName, tagOpts, modalOpts);
      });
  },

  /**
   * モーダルを削除します。
   * @param {riotx.Context} context
   * @param {String} modalId
   * @return {Promise}
   */
  remove: (context, modalId) => {
    return Promise
      .resolve()
      .then(() => {
        context.commit(constants$2.MODALS_REMOVE, modalId);
      });
  }
};

/**
     * Encode object into a query string.
     */
    function encode$2(obj){
        var query = [],
            arrValues, reg;
        forOwn_1$1(obj, function (val, key) {
            if (isArray_1$1(val)) {
                arrValues = key + '=';
                reg = new RegExp('&'+key+'+=$');
                forEach_1$1(val, function (aValue) {
                    arrValues += encodeURIComponent(aValue) + '&' + key + '=';
                });
                query.push(arrValues.replace(reg, ''));
            } else {
               query.push(key + '=' + encodeURIComponent(val));
            }
        });
        return (query.length) ? '?' + query.join('&') : '';
    }

    var encode_1$2 = encode$2;

// swagger-client(swagger-js)は外部ファイル読み込みのため、SwaggerClientオブジェクトはglobal(i.e. window)に格納されている。
const SwaggerClient = window.SwaggerClient;

var oas$3 = {
  /**
   * OAS準拠ファイルを取得/resolveし、SwaggerClientインスタンスを生成します。
   * @see: https://github.com/swagger-api/swagger-js#swagger-specification-resolver
   * @param {riotx.Context} context
   * @param {String} endpointKey
   * @param {String} url
   * @param {String} token
   * @return {Promise}
   */
  setup: (context, endpointKey, url, token) => {
    return Promise
      .resolve()
      .then(() => SwaggerClient.http({
        url,
        headers: {
          'Authorization': token
        }
      }))
      .then(res => {
        // 401エラーは想定内。
        if (res.status === 401) {
          const err = new Error();
          err.name = '401 Authorization Required';
          err.status = res.spec.status;
          return Promise.reject(err);
        }
        return res;
      })
      .then(res => SwaggerClient({
        spec: res.body
      }))
      .then(client => {
        const errors = client.errors;
        if (!!errors && !!errors.length) {
          return Promise.reject(errors);
        }
        return client;
      })
      .then(client => {
        context.commit(constants$2.OAS_CLIENT, client);
        context.commit(constants$2.ENDPOINTS_UPDATE, endpointKey, client.spec.info);
      });
  },

  /**
   * OAS情報をクリアします。
   * @param {riotx.Context} context
   * @return {Promise}
   */
  clear: context => {
    return Promise
      .resolve()
      .then(() => {
        context.commit(constants$2.OAS_CLIENT_CLEAR);
      });
  },

  /**
   * Autocompleteリストを取得します。
   * @param {riotx.Context} context
   * @param {String} path
   * @param {Object} query
   * @return {Promise}
   */
  getAutocomplete: (context, path, query) => {
    const currentEndpointKey = context.getter(constants$5.CURRENT);
    const currentEndpoint = context.getter(constants$5.ENDPOINTS_ONE, currentEndpointKey);
    const token = currentEndpoint.token;
    const url = `${new URL(currentEndpoint.url).origin}${path}${encode_1$2(query)}`;
    return Promise
      .resolve()
      .then(() => commonFetch(context, url, {
        headers: {
          'Authorization': token
        }
      }))
      .then(res => res.json());
  }
};

var page$3 = {
  /**
   * ページ情報を取得します。
   * @param {riotx.Context} context
   * @param {String} pageId
   * @return {Promise}
   */
  get: (context, pageId) => {
    return Promise
      .resolve()
      .then(() => {
        const pages = context.getter(constants$5.VIRON_PAGES);
        const page = find_1$2(pages, page => {
          return (page.id === pageId);
        });
        context.commit(constants$2.PAGE, page);
      });
  },

  /**
   * ページ情報を削除します。
   * @param {riotx.Context} context
   * @return {Promise}
   */
  remove: context => {
    return Promise
      .resolve()
      .then(() => {
        context.commit(constants$2.PAGE, null);
      });
  }
};

var popovers$3 = {
  /**
   * 吹き出しを追加します。
   * @param {riotx.Context} context
   * @param {String} tagName
   * @param {Object} tagOpts
   * @param {Object} popoverOpts
   * @return {Promise}
   */
  add: (context, tagName, tagOpts, popoverOpts) => {
    return Promise
      .resolve()
      .then(() => {
        context.commit(constants$2.POPOVERS_ADD, tagName, tagOpts, popoverOpts);
      });
  },

  /**
   * 吹き出しを削除します。
   * @param {riotx.Context} context
   * @param {String} popoverId
   * @return {Promise}
   */
  remove: (context, popoverId) => {
    return Promise
      .resolve()
      .then(() => {
        context.commit(constants$2.POPOVERS_REMOVE, popoverId);
      });
  }
};

var toasts$3 = {
  /**
   * トーストを追加します。
   * @param {riotx.Context} context
   * @param {Object} obj
   * @return {Promise}
   */
  add: (context, obj) => {
    return Promise
      .resolve()
      .then(() => {
        context.commit(constants$2.TOASTS_ADD, obj);
      });
  },

  /**
   * トーストを削除します。
   * @param {riotx.Context} context
   * @param {String} toastId
   * @return {Promise}
   */
  remove: (context, toastId) => {
    return Promise
      .resolve()
      .then(() => {
        context.commit(constants$2.TOASTS_REMOVE, toastId);
      });
  }

};

var sua = createCommonjsModule(function (module) {
/* Zepto v1.0-1-ga3cab6c - polyfill zepto detect event ajax form fx - zeptojs.com/license */
/**
 * @name sua.js
 * @author Kei Funagayama <kei.topaz@gmail.com>
 * @overview UserAgent decision for browser. fork zepto.js(http://zeptojs.com/)
 * @license MIT
 */

(function (global) {
  'use strict';

  /**
   * UserAgent decision
   *
   * @method
   * @param {String} useragent user agent
   */
  function SUA(useragent) {
    if (!useragent && global && global.navigator && global.navigator.userAgent) {
      // set browser user agent
      useragent = global.navigator.userAgent;
    }
    if (!useragent) {
      throw new Error('useragent setup error. useragent not found.');
    }

    /**
     * Decision: ie
     * @name ie
     * @memberof ua
     * @return {Boolean}
     */
    this.ie = !!(useragent.indexOf('MSIE') >= 0 || useragent.indexOf('Trident') >= 0 || useragent.indexOf('Edge') >= 0), this.webkit = useragent.match(/(WebKit|Webkit)\/([\d.]+)/), this.android = useragent.match(/(Android)\s+([\d.]+)/), this.android23 = useragent.match(/(Android)\s+(2\.3)([\d.]+)/), this.android4 = useragent.match(/(Android)\s+(4)([\d.]+)/), this.android5 = useragent.match(/(Android)\s+(5)([\d.]+)/), this.android6 = useragent.match(/(Android)\s+(6)([\d.]+)/), this.android7 = useragent.match(/(Android)\s+(7)([\d.]+)/), this.ipad = useragent.match(/(iPad).*OS\s([\d_]+)/), this.iphone = !this.ipad && useragent.match(/(iPhone\sOS)\s([\d_]+)/), this.webos = useragent.match(/(webOS|hpwOS)[\s\/]([\d.]+)/), this.touchpad = this.webos && useragent.match(/TouchPad/), this.kindle = useragent.match(/(Kindle)/), this.silk = useragent.match(/(Silk)/), this.blackberry = useragent.match(/(BlackBerry).*/), this.bb10 = useragent.match(/(BB10).*Version\/([\d.]+)/), this.rimtabletos = useragent.match(/(RIM\sTablet\sOS)\s([\d.]+)/), this.playbook = useragent.match(/PlayBook/), this.chrome = useragent.match(/Chrome\/([\d.]+)/) || useragent.match(/CriOS\/([\d.]+)/), this.firefox = useragent.match(/Firefox\/([\d.]+)/), this.wii = useragent.match(/Nintendo (Wii);/), this.wiiu = useragent.match(/Nintendo (WiiU)/), this.ds = useragent.match(/Nintendo (DS|3DS|DSi);/), this.nintendo_switch = useragent.match(/Nintendo (Switch);/), this.ps3 = useragent.match(/PLAYSTATION 3/), this.psp = useragent.match(/(PlayStation Portable)/), this.psvita = useragent.match(/(PlayStation Vita)/), this.windowsphone = useragent.match(/(Windows Phone |Windows Phone OS )([\d.]+)/), this.safari = useragent.match(/(Version)\/([0-9\.]+).*Safari\/([0-9\.]+)/), this.trident = useragent.match(/Trident\/([\d\.]+)/), this.xbox = useragent.match(/Xbox/), this.iphone5 = !('object' !== 'undefined' && module.exports) && this.iphone && screen && screen.width === 320 && screen.height === 568, this.vivaldi = useragent.match(/Vivaldi\/([\d.]+)/)

    ;


    /**
     * Decision: iphone3
     * @name iphone3
     * @memberof ua
     * @return {boolean}
     */
    this.iphone3 = this.iphone && global.devicePixelRatio === 1 ? true : false;


    /**
     * browser information
     * @name browser
     * @memberof ua
     * @return {Object}
     */
    this.browser = {
      locale: undefined, // ja-JP, en-us
      lang: undefined, // ja, en ....
      country: undefined // JP, us ...
    };

    /**
     * os infomation
     * @name os
     * @memberof ua
     * @return {Object}
     */
    this.os = {};

    if (this.webkit && !this.ie) {
      this.browser.webkit = true;
      this.browser.version = this.webkit[1];
    }

    if (this.trident) {
      this.browser.trident = true;
      this.browser.version = this.trident[1];
    }

    if (this.android) {
      this.os.android = true;
      this.os.version = this.android[2];
      try {
        this.browser.locale = useragent.match(/(Android)\s(.+);\s([^;]+);/)[3];
        this.browser.lang = this.browser.locale.substring(0, 2);
        this.browser.country = this.browser.locale.substring(3);
      } catch (e) {
        //console.log('Failed to parse user agent string of Android.', useragent);
      }
    }
    if (this.iphone) {
      this.os.ios = this.os.iphone = true;
      this.os.version = this.iphone[2].replace(/_/g, '.');
    }

    if (this.ipad) {
      this.os.ios = this.os.ipad = true;
      this.os.version = this.ipad[2].replace(/_/g, '.');
    }

    if (this.os.ios) {
      var __ios_v_0 = null;
      if (this.os.version) {
        __ios_v_0 = this.os.version.substring(0, 1);
      }
      for (var i = 3; i < 10; i++) { // IOS 3->9
        /**
         * Decision: ios 3-9
         * @name ios3-9
         * @memberof ua
         * @return {boolean}
         */
        this['ios' + i] = __ios_v_0 === "" + i;
      }
    }

    if (this.webos) {
      this.os.webos = true;
      this.os.version = this.webos[2];
    }
    if (this.touchpad) {
      this.os.touchpad = true;
    }
    if (this.blackberry) {
      this.os.blackberry = true;
    }
    if (this.bb10) {
      this.os.bb10 = true;
      this.os.version = this.bb10[2];
    }
    if (this.rimtabletos) {
      this.os.rimtabletos = true;
      this.os.version = this.rimtabletos[2];
    }
    if (this.playbook) {
      this.browser.playbook = true;
    }
    if (this.kindle) {
      this.os.kindle = true;
    }
    if (this.silk) {
      this.browser.silk = true;
    }
    if (!this.silk && this.os.android && useragent.match(/Kindle Fire/)) {
      this.browser.silk = true;
    }
    if (this.chrome && !this.ie) {
      this.browser.chrome = true;
      this.browser.version = this.chrome[1];
    }
    if (this.firefox) {
      this.browser.firefox = true;
      this.browser.version = this.firefox[1];
      if (useragent.match(/Android/)) { // firefox on android
        this.android = ["Android", "Android", ""];
      }
    }
    if (this.wii || this.ds || this.wiiu || this.nintendo_switch) {
      this.os.nintendo = true;

      if (this.wiiu || this.nintendo_switch) {
        this.browser.nintendo = useragent.match(/NintendoBrowser\/([\d.]+)/);
        this.browser.version = this.browser.nintendo[1];
      }
    }

    if (this.windowsphone) {
      this.browser.windowsphone = true;
      this.browser.version = this.windowsphone[2];
    }
    if (this.safari) {
      this.browser.safari = true;
      this.browser.version = this.safari[2];
    }

    if (this.ie) {
      this.browser.ie = /(MSIE|rv:?)\s?([\d\.]+)/.exec(useragent);
      this.edge = false;

      if (!this.browser.ie) { // Edge
        this.browser.ie = /(Edge\/)(\d.+)/.exec(useragent);
        this.browser.version = this.browser.ie[2];
        this.edge = true;
        // reset
        this.chrome = false;
        this.webkit = false;

      } else if (!this.windowsphone) {
        this.browser.version = (this.browser.ie) ? this.browser.ie[2] : '';
      }

      if (0 < this.browser.version.indexOf('.')) {
        this.browser.majorversion = this.browser.version.substring(0, this.browser.version.indexOf('.'));
      } else {
        this.browser.majorversion = this.browser.version;
      }
    }

    if (this.vivaldi) {
      this.browser.vivaldi = true;
      this.browser.version = this.vivaldi[1];
    }

    /**
     * Decision: table
     * @name table
     * @memberof ua
     * @return {boolean}
     */
    this.os.tablet = !!(this.ipad || this.kindle || this.playbook || (this.android && !useragent.match(/Mobile/)) || (this.firefox && useragent.match(/Tablet/)));

    /**
     * Decision: phone
     * @name phone
     * @memberof ua
     * @return {boolean}
     */
    this.os.phone = !!(!this.os.tablet && (this.android || this.iphone || this.webos || this.blackberry || this.bb10 ||
    (this.chrome && useragent.match(/Android/)) || (this.chrome && useragent.match(/CriOS\/([\d.]+)/)) || (this.firefox && useragent.match(/Mobile/)) || (this.windowsphone && useragent.match(/IEMobile/))));

    /**
     * Decision mobile (tablet or phone)
     * @type {boolean}
     */
    this.mobile = !!(this.os.tablet || this.os.phone);

    this.webview = {};
    /**
     * Decision: TwitterWebView
     * @name twitterwebview
     * @memberof ua
     * @return {boolean}
     */
    if (useragent.match(/Twitter/)) {
      this.webview.twitter = true;
    }
  }

  SUA.VERSION = '2.1.0';

  if ('object' !== 'undefined' && module.exports) {
    // node
    module.exports = SUA;
  }

  if (!global.SUA) {
    // browser
    global.SUA = SUA;
  }

})(commonjsGlobal);
});

var ua$3 = {
  /**
   * 初期設定を行います。
   * @param {riotx.Context} context
   * @return {Promise}
   */
  setup: context => {
    return Promise
      .resolve()
      .then(() => {
        const ua = new sua(navigator.userAgent);
        context.commit(constants$2.UA, ua);
      });
  }
};

const constants$1 = {
  APPLICATION_LAUNCH: 'APPLICATION_LAUNCH',
  APPLICATION_NAVIGATION_START: 'APPLICATION_NAVIGATION_START',
  APPLICATION_NAVIGATION_END: 'APPLICATION_NAVIGATION_END',
  APPLICATION_DRAG_START: 'APPLICATION_DRAG_START',
  APPLICATION_DRAG_END: 'APPLICATION_DRAG_END',
  APPLICATION_UPDATE_ENDPOINT_FILTER_TEXT: 'APPLICATION_UPDATE_ENDPOINT_FILTER_TEXT',
  APPLICATION_RESET_ENDPOINT_FILTER_TEXT: 'APPLICATION_RESET_ENDPOINT_FILTER_TEXT',
  AUTH_UPDATE: 'AUTH_UPADTE',
  AUTH_REMOVE: 'AUTH_REMOVE',
  AUTH_VALIDATE: 'AUTH_VALIDATE',
  AUTH_GET_TYPES: 'AUTH_GET_TYPES',
  AUTH_SIGNIN_OAUTH: 'AUTH_SIGNIN_OAUTH',
  AUTH_SIGNIN_EMAIL: 'AUTH_SIGNIN_EMAIL',
  COMPONENTS_GET_ONE: 'COMPONENTS_GET_ONE',
  COMPONENTS_OPERATE_ONE: 'COMPONENTS_OPERATE_ONE',
  COMPONENTS_REMOVE_ONE: 'COMPONENTS_REMOVE_ONE',
  COMPONENTS_REMOVE_ALL: 'COMPONENTS_REMOVE_ALL',
  CURRENT_UPDATE: 'CURRENT_UPDATE',
  CURRENT_REMOVE: 'CURRENT_REMOVE',
  VIRON_GET: 'VIRON_GET',
  VIRON_REMOVE: 'VIRON_REMOVE',
  DRAWERS_ADD: 'DRAWERS_ADD',
  DRAWERS_REMOVE: 'DRAWERS_REMOVE',
  ENDPOINTS_ADD: 'ENDPOINTS_ADD',
  ENDPOINTS_UPDATE: 'ENDPOINTS_UPDATE',
  ENDPOINTS_REMOVE: 'ENDPOINTS_REMOVE',
  ENDPOINTS_REMOVE_ALL: 'ENDPOINTS_REMOVE_ALL',
  ENDPOINTS_MERGE_ALL: 'ENDPOINTS_MERGE_ALL',
  ENDPOINTS_MERGE_ONE_WITH_KEY: 'ENDPOINTS_MERGE_ONE_WITH_KEY',
  ENDPOINTS_TIDY_UP_ORDER: 'ENDPOINTS_TIDY_UP_ORDER',
  ENDPOINTS_CHANGE_ORDER: 'ENDPOINTS_CHANGE_ORDER',
  LAYOUT_UPDATE_SIZE: 'LAYOUT_UPDATE_SIZE',
  LAYOUT_UPDATE_COMPONENTS_GRID_COLUMN_COUNT: 'LAYOUT_UPDATE_COMPONENTS_GRID_COLUMN_COUNT',
  LOCATION_UPDATE: 'LOCATION_UPDATE',
  MODALS_ADD: 'MODALS_ADD',
  MODALS_REMOVE: 'MODALS_REMOVE',
  OAS_SETUP: 'OAS_SETUP',
  OAS_CLEAR: 'OAS_CLEAR',
  OAS_GET_AUTOCOMPLETE: 'OAS_GET_AUTOCOMPLETE',
  OAUTH_ENDPOINT_KEY_REMOVE: 'OAUTH_ENDPOINT_KEY_REMOVE',
  PAGE_GET: 'PAGE_GET',
  PAGE_REMOVE: 'PAGE_REMOVE',
  POPOVERS_ADD: 'POPOVERS_ADD',
  POPOVERS_REMOVE: 'POPOVERS_REMOVE',
  TOASTS_ADD: 'TOASTS_ADD',
  TOASTS_REMOVE: 'TOASTS_REMOVE',
  UA_SETUP: 'UA_SETUP'
};

var actions = {
  [constants$1.APPLICATION_LAUNCH]: application.launch,
  [constants$1.APPLICATION_NAVIGATION_START]: application.startNavigation,
  [constants$1.APPLICATION_NAVIGATION_END]: application.endNavigation,
  [constants$1.APPLICATION_DRAG_START]: application.startDrag,
  [constants$1.APPLICATION_DRAG_END]: application.endDrag,
  [constants$1.APPLICATION_UPDATE_ENDPOINT_FILTER_TEXT]: application.updateEndpointFilterText,
  [constants$1.APPLICATION_RESET_ENDPOINT_FILTER_TEXT]: application.resetEndpointFilterText,
  [constants$1.AUTH_UPDATE]: auth.update,
  [constants$1.AUTH_REMOVE]: auth.remove,
  [constants$1.AUTH_VALIDATE]: auth.validate,
  [constants$1.AUTH_GET_TYPES]: auth.getTypes,
  [constants$1.AUTH_SIGNIN_OAUTH]: auth.signinOAuth,
  [constants$1.AUTH_SIGNIN_EMAIL]: auth.signinEmail,
  [constants$1.COMPONENTS_GET_ONE]: components$3.get,
  [constants$1.COMPONENTS_OPERATE_ONE]: components$3.operate,
  [constants$1.COMPONENTS_REMOVE_ONE]: components$3.remove,
  [constants$1.COMPONENTS_REMOVE_ALL]: components$3.removeAll,
  [constants$1.CURRENT_UPDATE]: current$3.update,
  [constants$1.CURRENT_REMOVE]: current$3.remove,
  [constants$1.VIRON_GET]: viron$3.get,
  [constants$1.VIRON_REMOVE]: viron$3.remove,
  [constants$1.DRAWERS_ADD]: drawers$3.add,
  [constants$1.DRAWERS_REMOVE]: drawers$3.remove,
  [constants$1.ENDPOINTS_ADD]: endpoints$3.add,
  [constants$1.ENDPOINTS_UPDATE]: endpoints$3.update,
  [constants$1.ENDPOINTS_REMOVE]: endpoints$3.remove,
  [constants$1.ENDPOINTS_REMOVE_ALL]: endpoints$3.removeAll,
  [constants$1.ENDPOINTS_MERGE_ALL]: endpoints$3.mergeAll,
  [constants$1.ENDPOINTS_MERGE_ONE_WITH_KEY]: endpoints$3.mergeOneWithKey,
  [constants$1.ENDPOINTS_TIDY_UP_ORDER]: endpoints$3.tidyUpOrder,
  [constants$1.ENDPOINTS_CHANGE_ORDER]: endpoints$3.changeOrder,
  [constants$1.LAYOUT_UPDATE_SIZE]: layout$3.updateSize,
  [constants$1.LAYOUT_UPDATE_COMPONENTS_GRID_COLUMN_COUNT]: layout$3.updateComponentsGridColumnCount,
  [constants$1.LOCATION_UPDATE]: location$4.update,
  [constants$1.MODALS_ADD]: modals$3.add,
  [constants$1.MODALS_REMOVE]: modals$3.remove,
  [constants$1.OAS_SETUP]: oas$3.setup,
  [constants$1.OAS_CLEAR]: oas$3.clear,
  [constants$1.OAS_GET_AUTOCOMPLETE]: oas$3.getAutocomplete,
  [constants$1.PAGE_GET]: page$3.get,
  [constants$1.PAGE_REMOVE]: page$3.remove,
  [constants$1.POPOVERS_ADD]: popovers$3.add,
  [constants$1.POPOVERS_REMOVE]: popovers$3.remove,
  [constants$1.TOASTS_ADD]: toasts$3.add,
  [constants$1.TOASTS_REMOVE]: toasts$3.remove,
  [constants$1.UA_SETUP]: ua$3.setup
};

var script = function() {
  const updateText = () => {
    const json = JSON.stringify(this.opts.data, undefined, 4);
    let text = json.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    text = text.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, match => {
      let cls = 'number';
      if (/^"/.test(match)) {
        if (/:$/.test(match)) {
          cls = 'key';
        } else {
          cls = 'string';
        }
      } else if (/true|false/.test(match)) {
        cls = 'boolean';
      } else if (/null/.test(match)) {
        cls = 'null';
      }
      return '<span class="Prettyprint__' + cls + '">' + match + '</span>';
    });
    this.refs.canvas.innerHTML = text;
  };

  this.on('mount', () => {
    updateText();
  }).on('updated', () => {
    updateText();
  });
};

riot$1.tag2('viron-prettyprint', '<pre class="Prettyprint__canvas" ref="canvas"></pre>', '', 'class="Prettyprint"', function(opts) {
    this.external(script);
});

var script$1 = function() {
  // タイトル。
  this.title = this.opts.title;
  // メッセージ。
  this.message = this.opts.message;
  // errorが渡された場合は最適化処理を行う。
  if (!!this.opts.error) {
    this.title = this.title || this.opts.error.name || this.opts.error.statusText || 'Error';
    this.message = this.message || this.opts.error.message;
  }

  // prettyprintで表示させる内容。
  this.detail = null;

  this.on('mount', () => {
    // エラーがPromiseであれば解析する。
    const error = this.opts.error;
    if (!error) {
      return;
    }
    if (error instanceof Error) {
      return;
    }
    Promise
      .resolve()
      .then(() => {
        if (!!error.json) {
          return error.json();
        }
        return error.text().then(text => JSON.parse(text));
      })
      .then(json => {
        const error = json.error;
        this.detail = error;
        !this.opts.title && !!error.name && (this.title = error.name);
        !this.opts.message && !!error.data && !!error.data.message && (this.message = error.data.message);
        this.update();
      })
      .catch(() => {
        // do nothing on purpose.
        return Promise.resolve();
      });
  });
};

riot$1.tag2('viron-error', '<div class="Error__title">{title}</div> <div class="Error__message" if="{!!message}">{message}</div> <viron-prettyprint if="{!!detail}" data="{detail}"></viron-prettyprint>', '', 'class="Error"', function(opts) {
    this.external(script$1);
});

var ComponentsRoute = {
  /**
   * ページ遷移前の処理。
   * @param {riotx.Store} store
   * @param {Object} route
   * @param {Function} replace
   * @return {Promise}
   */
  onBefore: (store, route, replace) => {
    const endpointKey = route.params.endpointKey;
    const endpoint = store.getter(constants$5.ENDPOINTS_ONE, endpointKey);

    // endpointが存在しなければTOPに戻す。
    if (!endpoint) {
      return Promise
        .resolve()
        .then(() => {
          replace('/');
        })
        .catch(err => store.action(constants$1.MODALS_ADD, 'viron-error', {
          error: err
        }));
    }

    return Promise
      .resolve()
      .then(() => store.action(constants$1.CURRENT_UPDATE, endpointKey))
      .then(() => {
        // 無駄な通信を減らすために、`viron`データを未取得の場合のみfetchする。
        const isVironExist = store.getter(constants$5.VIRON_EXISTENCE);
        if (isVironExist) {
          return Promise.resolve();
        }
        return Promise
          .resolve()
          .then(() => store.action(constants$1.OAS_SETUP, endpointKey, endpoint.url, endpoint.token))
          .then(() => store.action(constants$1.VIRON_GET));
      })
      .then(() => {
        // pageが指定されていない場合は`viron`のpageリストの先頭項目を自動選択する。
        if (!route.params.page) {
          return Promise.resolve().then(() => {
            const pageName = store.getter(constants$5.VIRON_PAGES_ID_OF, 0);
            replace(`/${endpointKey}/${pageName}`);
          });
        }
        return store.action(constants$1.PAGE_GET, route.params.page);
      })
      .catch(err => {
        // 401 = 認証エラー
        // 通常エラーと認証エラーで処理を振り分ける。
        if (err.status !== 401) {
          return store.action(constants$1.MODALS_ADD, 'viron-error', {
            error: err
          });
        }
        return Promise
          .resolve()
          .then(() => store.action(constants$1.MODALS_ADD, 'viron-error', {
            title: '認証切れ',
            message: '認証が切れました。再度ログインして下さい。'
          }))
          .then(() => {
            replace('/');
          });
      });
  },

  /**
   * ページ遷移時の処理。
   * @param {riotx.Store} store
   * @param {Object} route
   * @return {Promise}
   */
  onEnter: (store, route) => {
    return store.action(constants$1.LOCATION_UPDATE, {
      name: 'components',
      route
    });
  }
};

var EndpointsRoute = {
  /**
   * ページ遷移前の処理。
   * @param {riotx.Store} store
   * @param {Object} route
   * @param {Function} replace
   * @return {Promise}
   */
  onBefore: store => {
    return Promise
      .resolve()
      .then(() => Promise.all([
        store.action(constants$1.CURRENT_REMOVE),
        store.action(constants$1.PAGE_REMOVE),
        store.action(constants$1.OAS_CLEAR),
        store.action(constants$1.VIRON_REMOVE)
      ]))
      .catch(err => store.action(constants$1.MODALS_ADD, 'viron-error', {
        error: err
      }));
  },

  /**
   * ページ遷移時の処理。
   * @param {riotx.Store} store
   * @param {Object} route
   * @return {Promise}
   */
  onEnter: (store, route) => {
    return store.action(constants$1.LOCATION_UPDATE, {
      name: 'endpoints',
      route
    });
  }
};

var EndpointimportRoute = {
  /**
   * ページ遷移前の処理。
   * @param {riotx.Store} store
   * @param {Object} route
   * @param {Function} replace
   * @return {Promise}
   */
  onBefore: (store, route, replace) => {
    let url;
    return Promise
      .resolve()
      .then(() => {
        const endpoint = JSON.parse(decodeURIComponent(route.queries.endpoint));
        url = endpoint.url;
        return store.action(constants$1.ENDPOINTS_MERGE_ONE_WITH_KEY, endpoint);
      })
      .then(() => store.action(constants$1.MODALS_ADD, 'viron-error', {
        title: 'エンドポイント追加',
        message: `エンドポイント(${url})が一覧に追加されました。`
      }))
      .then(() => {
        replace('/');
      })
      .catch(err => store.action(constants$1.MODALS_ADD, 'viron-error', {
        title: 'エンドポイント追加 失敗',
        message: `エンドポイント(${url})を追加出来ませんでした。`,
        error: err
      }));
  }
};

var NotfoundRoute = {
  /**
   * ページ遷移時の処理。
   * @param {riotx.Store} store
   * @param {Object} route
   * @return {Promise}
   */
  onEnter: (store, route) => {
    return store.action(constants$1.LOCATION_UPDATE, {
      name: 'notfound',
      route
    });
  }
};

var OauthredirectRoute = {
  /**
   * ページ遷移前の処理。
   * @param {riotx.Store} store
   * @param {Object} route
   * @param {Function} replace
   * @return {Promise}
   */
  onBefore: (store, route, replace) => {
    const endpointKey = route.params.endpointKey;
    const token = route.queries.token;
    // tokenが存在したらOAuth認証成功とする。
    const isAuthorized = !!token;
    let to;
    const tasks = [];
    if (isAuthorized) {
      to = `/${endpointKey}`;
      tasks.push(store.action(constants$1.AUTH_UPDATE, endpointKey, decodeURIComponent(token)));
    } else {
      to = '/';
      tasks.push(store.action(constants$1.AUTH_REMOVE, endpointKey));
      tasks.push(store.action(constants$1.MODALS_ADD, 'viron-error', {
        title: '認証失敗',
        message: 'OAuth認証に失敗しました。正しいアカウントで再度お試し下さい。詳しいエラー原因については管理者に問い合わせて下さい。'
      }));
    }

    return Promise
      .all(tasks)
      .then(() => {
        replace(to);
      })
      .catch(err => store.action(constants$1.MODALS_ADD, 'viron-error', {
        error: err
      }));
  }
};

let esr;

var router = {
  /**
   * 初期設定。
   * @param {riotx.Store} store
   * @return {Promise}
   */
  init: store => {
    return Promise
      .resolve()
      .then(() => {
        const router = new Router(Router.HASH);
        router
          .onBefore(() => Promise.all([
            store.action(constants$1.APPLICATION_NAVIGATION_START)
          ]))
          .on('/', route => EndpointsRoute.onEnter(store, route), (route, replace) => EndpointsRoute.onBefore(store, route, replace))
          .on('/oauthredirect/:endpointKey', () => Promise.resolve(), (route, replace) => OauthredirectRoute.onBefore(store, route, replace))
          .on('/endpointimport', () => Promise.resolve(), (route, replace) => EndpointimportRoute.onBefore(store, route, replace))
          .on('/:endpointKey/:page?', route => ComponentsRoute.onEnter(store, route), (route, replace) => ComponentsRoute.onBefore(store, route, replace))
          .on('*', route => NotfoundRoute.onEnter(store, route))
          .onAfter(() => Promise.all([
            store.action(constants$1.APPLICATION_NAVIGATION_END)
          ]))
          .onAfterOnce(() => store.action(constants$1.APPLICATION_LAUNCH));
        return router;
      })
      .then(router => {
        router.start();
        esr = router;
        return router;
      });
  },

  /**
   * インスタンスを返します。
   * @return {esr}
   */
  getInstance: () => {
    return esr;
  }
};

// Mouse系かTouch系か。
const isTouchEventSupported = 'ontouchstart' in document;
// 指(or pointer)のstartからendまでの座標移動距離。tapと見なすかの閾値となります。
const TAP_ALLOW_RANGE = 10;
// 指(or pointer)が押されている時にDOM要素に付与されるclass属性値。
const TAP_HOLD_CLASSNAME = 'hold';

var mixin = {
  /**
   * riotのmixinを設定します。
   * @return {Promise}
   */
  init: () => {
    return Promise
      .resolve()
      .then(() => {
        riot$1.settings.autoUpdate = false;
        riot$1.mixin({
          // riotx.riotxChange(store, evtName, func)のショートカット。
          listen: function(...args) {
            const store = this.riotx.get();
            this.riotxChange(store, ...args);
          },
          // pugファイルとjsファイルを分離して実装可能にするため。
          external: function(script) {
            const tag = this;
            script.apply(tag);
          },
          // `modal`等と意識せずにcloseできるようにする。
          close: function() {
            if (this.opts.isModal) {
              this.opts.modalCloser();
            }
            if (this.opts.isDrawer) {
              this.opts.drawerCloser();
            }
            if (this.opts.isPopover) {
              this.opts.popoverCloser();
            }
          },
          getRouter: () => {
            return router.getInstance();
          },
          getClickHandler: function(handlerName) {
            // touch環境は扱わない。
            if (isTouchEventSupported) {
              return false;
            }
            // `parent.parent.handleFoo`な形式への対応。
            let context = this;
            while (handlerName.indexOf('parent.') === 0) {
              handlerName = handlerName.replace('parent.', '');
              context = context.parent;
            }
            return context[handlerName];
          },
          getTouchStartHandler: function() {
            // mouse環境は扱わない。
            if (!isTouchEventSupported) {
              return false;
            }
            return e => {
              const initX = e.touches[0].pageX;
              const initY = e.touches[0].pageY;
              e.currentTarget.setAttribute('touch_start_x', initX);
              e.currentTarget.setAttribute('touch_start_y', initY);
              e.currentTarget.classList.add(TAP_HOLD_CLASSNAME);
            };
          },
          getTouchMoveHandler: function() {
            // mouse環境は扱わない。
            if (!isTouchEventSupported) {
              return false;
            }
            return e => {
              const isPressed = e.currentTarget.classList.contains(TAP_HOLD_CLASSNAME);
              if (!isPressed) {
                return;
              }
              const initX = e.currentTarget.getAttribute('touch_start_x');
              const initY = e.currentTarget.getAttribute('touch_start_y');
              const curX = e.touches[0].pageX;
              const curY = e.touches[0].pageY;
              const distanceX = curX - initX;
              const distanceY = curY - initY;
              const hypotenuse = Math.sqrt(Math.pow(distanceX, 2) + Math.pow(distanceY, 2));
              if (hypotenuse >= TAP_ALLOW_RANGE) {
                e.currentTarget.classList.remove(TAP_HOLD_CLASSNAME);
              }
            };
          },
          getTouchEndHandler: function(handlerName) {
            // mouse環境は扱わない。
            if (!isTouchEventSupported) {
              return false;
            }
            // `parent.parent.handleFoo`な形式への対応。
            let context = this;
            while (handlerName.indexOf('parent.') === 0) {
              handlerName = handlerName.replace('parent.', '');
              context = context.parent;
            }
            const handler = context[handlerName];
            return e => {
              const isPressed = e.currentTarget.classList.contains(TAP_HOLD_CLASSNAME);
              if (isPressed) {
                handler(e);
              }
              e.currentTarget.classList.remove(TAP_HOLD_CLASSNAME);
            };
          }
        });
      });
  }
};

var promise$1 = createCommonjsModule(function (module) {
(function (root) {

  // Store setTimeout reference so promise-polyfill will be unaffected by
  // other code modifying setTimeout (like sinon.useFakeTimers())
  var setTimeoutFunc = setTimeout;

  function noop() {}
  
  // Polyfill for Function.prototype.bind
  function bind(fn, thisArg) {
    return function () {
      fn.apply(thisArg, arguments);
    };
  }

  function Promise(fn) {
    if (typeof this !== 'object') { throw new TypeError('Promises must be constructed via new'); }
    if (typeof fn !== 'function') { throw new TypeError('not a function'); }
    this._state = 0;
    this._handled = false;
    this._value = undefined;
    this._deferreds = [];

    doResolve(fn, this);
  }

  function handle(self, deferred) {
    while (self._state === 3) {
      self = self._value;
    }
    if (self._state === 0) {
      self._deferreds.push(deferred);
      return;
    }
    self._handled = true;
    Promise._immediateFn(function () {
      var cb = self._state === 1 ? deferred.onFulfilled : deferred.onRejected;
      if (cb === null) {
        (self._state === 1 ? resolve : reject)(deferred.promise, self._value);
        return;
      }
      var ret;
      try {
        ret = cb(self._value);
      } catch (e) {
        reject(deferred.promise, e);
        return;
      }
      resolve(deferred.promise, ret);
    });
  }

  function resolve(self, newValue) {
    try {
      // Promise Resolution Procedure: https://github.com/promises-aplus/promises-spec#the-promise-resolution-procedure
      if (newValue === self) { throw new TypeError('A promise cannot be resolved with itself.'); }
      if (newValue && (typeof newValue === 'object' || typeof newValue === 'function')) {
        var then = newValue.then;
        if (newValue instanceof Promise) {
          self._state = 3;
          self._value = newValue;
          finale(self);
          return;
        } else if (typeof then === 'function') {
          doResolve(bind(then, newValue), self);
          return;
        }
      }
      self._state = 1;
      self._value = newValue;
      finale(self);
    } catch (e) {
      reject(self, e);
    }
  }

  function reject(self, newValue) {
    self._state = 2;
    self._value = newValue;
    finale(self);
  }

  function finale(self) {
    if (self._state === 2 && self._deferreds.length === 0) {
      Promise._immediateFn(function() {
        if (!self._handled) {
          Promise._unhandledRejectionFn(self._value);
        }
      });
    }

    for (var i = 0, len = self._deferreds.length; i < len; i++) {
      handle(self, self._deferreds[i]);
    }
    self._deferreds = null;
  }

  function Handler(onFulfilled, onRejected, promise) {
    this.onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : null;
    this.onRejected = typeof onRejected === 'function' ? onRejected : null;
    this.promise = promise;
  }

  /**
   * Take a potentially misbehaving resolver function and make sure
   * onFulfilled and onRejected are only called once.
   *
   * Makes no guarantees about asynchrony.
   */
  function doResolve(fn, self) {
    var done = false;
    try {
      fn(function (value) {
        if (done) { return; }
        done = true;
        resolve(self, value);
      }, function (reason) {
        if (done) { return; }
        done = true;
        reject(self, reason);
      });
    } catch (ex) {
      if (done) { return; }
      done = true;
      reject(self, ex);
    }
  }

  Promise.prototype['catch'] = function (onRejected) {
    return this.then(null, onRejected);
  };

  Promise.prototype.then = function (onFulfilled, onRejected) {
    var prom = new (this.constructor)(noop);

    handle(this, new Handler(onFulfilled, onRejected, prom));
    return prom;
  };

  Promise.all = function (arr) {
    var args = Array.prototype.slice.call(arr);

    return new Promise(function (resolve, reject) {
      if (args.length === 0) { return resolve([]); }
      var remaining = args.length;

      function res(i, val) {
        try {
          if (val && (typeof val === 'object' || typeof val === 'function')) {
            var then = val.then;
            if (typeof then === 'function') {
              then.call(val, function (val) {
                res(i, val);
              }, reject);
              return;
            }
          }
          args[i] = val;
          if (--remaining === 0) {
            resolve(args);
          }
        } catch (ex) {
          reject(ex);
        }
      }

      for (var i = 0; i < args.length; i++) {
        res(i, args[i]);
      }
    });
  };

  Promise.resolve = function (value) {
    if (value && typeof value === 'object' && value.constructor === Promise) {
      return value;
    }

    return new Promise(function (resolve) {
      resolve(value);
    });
  };

  Promise.reject = function (value) {
    return new Promise(function (resolve, reject) {
      reject(value);
    });
  };

  Promise.race = function (values) {
    return new Promise(function (resolve, reject) {
      for (var i = 0, len = values.length; i < len; i++) {
        values[i].then(resolve, reject);
      }
    });
  };

  // Use polyfill for setImmediate for performance gains
  Promise._immediateFn = (typeof setImmediate === 'function' && function (fn) { setImmediate(fn); }) ||
    function (fn) {
      setTimeoutFunc(fn, 0);
    };

  Promise._unhandledRejectionFn = function _unhandledRejectionFn(err) {
    if (typeof console !== 'undefined' && console) {
      console.warn('Possible Unhandled Promise Rejection:', err); // eslint-disable-line no-console
    }
  };

  /**
   * Set the immediate function to execute callbacks
   * @param fn {function} Function to execute
   * @deprecated
   */
  Promise._setImmediateFn = function _setImmediateFn(fn) {
    Promise._immediateFn = fn;
  };

  /**
   * Change the function to execute on unhandled rejection
   * @param {function} fn Function to execute on unhandled rejection
   * @deprecated
   */
  Promise._setUnhandledRejectionFn = function _setUnhandledRejectionFn(fn) {
    Promise._unhandledRejectionFn = fn;
  };
  
  if ('object' !== 'undefined' && module.exports) {
    module.exports = Promise;
  } else if (!root.Promise) {
    root.Promise = Promise;
  }

})(commonjsGlobal);
});

(function(self) {
  'use strict';

  if (self.fetch) {
    return
  }

  var support = {
    searchParams: 'URLSearchParams' in self,
    iterable: 'Symbol' in self && 'iterator' in Symbol,
    blob: 'FileReader' in self && 'Blob' in self && (function() {
      try {
        new Blob();
        return true
      } catch(e) {
        return false
      }
    })(),
    formData: 'FormData' in self,
    arrayBuffer: 'ArrayBuffer' in self
  };

  if (support.arrayBuffer) {
    var viewClasses = [
      '[object Int8Array]',
      '[object Uint8Array]',
      '[object Uint8ClampedArray]',
      '[object Int16Array]',
      '[object Uint16Array]',
      '[object Int32Array]',
      '[object Uint32Array]',
      '[object Float32Array]',
      '[object Float64Array]'
    ];

    var isDataView = function(obj) {
      return obj && DataView.prototype.isPrototypeOf(obj)
    };

    var isArrayBufferView = ArrayBuffer.isView || function(obj) {
      return obj && viewClasses.indexOf(Object.prototype.toString.call(obj)) > -1
    };
  }

  function normalizeName(name) {
    if (typeof name !== 'string') {
      name = String(name);
    }
    if (/[^a-z0-9\-#$%&'*+.\^_`|~]/i.test(name)) {
      throw new TypeError('Invalid character in header field name')
    }
    return name.toLowerCase()
  }

  function normalizeValue(value) {
    if (typeof value !== 'string') {
      value = String(value);
    }
    return value
  }

  // Build a destructive iterator for the value list
  function iteratorFor(items) {
    var iterator = {
      next: function() {
        var value = items.shift();
        return {done: value === undefined, value: value}
      }
    };

    if (support.iterable) {
      iterator[Symbol.iterator] = function() {
        return iterator
      };
    }

    return iterator
  }

  function Headers(headers) {
    this.map = {};

    if (headers instanceof Headers) {
      headers.forEach(function(value, name) {
        this.append(name, value);
      }, this);
    } else if (Array.isArray(headers)) {
      headers.forEach(function(header) {
        this.append(header[0], header[1]);
      }, this);
    } else if (headers) {
      Object.getOwnPropertyNames(headers).forEach(function(name) {
        this.append(name, headers[name]);
      }, this);
    }
  }

  Headers.prototype.append = function(name, value) {
    name = normalizeName(name);
    value = normalizeValue(value);
    var oldValue = this.map[name];
    this.map[name] = oldValue ? oldValue+','+value : value;
  };

  Headers.prototype['delete'] = function(name) {
    delete this.map[normalizeName(name)];
  };

  Headers.prototype.get = function(name) {
    name = normalizeName(name);
    return this.has(name) ? this.map[name] : null
  };

  Headers.prototype.has = function(name) {
    return this.map.hasOwnProperty(normalizeName(name))
  };

  Headers.prototype.set = function(name, value) {
    this.map[normalizeName(name)] = normalizeValue(value);
  };

  Headers.prototype.forEach = function(callback, thisArg) {
    for (var name in this.map) {
      if (this.map.hasOwnProperty(name)) {
        callback.call(thisArg, this.map[name], name, this);
      }
    }
  };

  Headers.prototype.keys = function() {
    var items = [];
    this.forEach(function(value, name) { items.push(name); });
    return iteratorFor(items)
  };

  Headers.prototype.values = function() {
    var items = [];
    this.forEach(function(value) { items.push(value); });
    return iteratorFor(items)
  };

  Headers.prototype.entries = function() {
    var items = [];
    this.forEach(function(value, name) { items.push([name, value]); });
    return iteratorFor(items)
  };

  if (support.iterable) {
    Headers.prototype[Symbol.iterator] = Headers.prototype.entries;
  }

  function consumed(body) {
    if (body.bodyUsed) {
      return Promise.reject(new TypeError('Already read'))
    }
    body.bodyUsed = true;
  }

  function fileReaderReady(reader) {
    return new Promise(function(resolve, reject) {
      reader.onload = function() {
        resolve(reader.result);
      };
      reader.onerror = function() {
        reject(reader.error);
      };
    })
  }

  function readBlobAsArrayBuffer(blob) {
    var reader = new FileReader();
    var promise = fileReaderReady(reader);
    reader.readAsArrayBuffer(blob);
    return promise
  }

  function readBlobAsText(blob) {
    var reader = new FileReader();
    var promise = fileReaderReady(reader);
    reader.readAsText(blob);
    return promise
  }

  function readArrayBufferAsText(buf) {
    var view = new Uint8Array(buf);
    var chars = new Array(view.length);

    for (var i = 0; i < view.length; i++) {
      chars[i] = String.fromCharCode(view[i]);
    }
    return chars.join('')
  }

  function bufferClone(buf) {
    if (buf.slice) {
      return buf.slice(0)
    } else {
      var view = new Uint8Array(buf.byteLength);
      view.set(new Uint8Array(buf));
      return view.buffer
    }
  }

  function Body() {
    this.bodyUsed = false;

    this._initBody = function(body) {
      this._bodyInit = body;
      if (!body) {
        this._bodyText = '';
      } else if (typeof body === 'string') {
        this._bodyText = body;
      } else if (support.blob && Blob.prototype.isPrototypeOf(body)) {
        this._bodyBlob = body;
      } else if (support.formData && FormData.prototype.isPrototypeOf(body)) {
        this._bodyFormData = body;
      } else if (support.searchParams && URLSearchParams.prototype.isPrototypeOf(body)) {
        this._bodyText = body.toString();
      } else if (support.arrayBuffer && support.blob && isDataView(body)) {
        this._bodyArrayBuffer = bufferClone(body.buffer);
        // IE 10-11 can't handle a DataView body.
        this._bodyInit = new Blob([this._bodyArrayBuffer]);
      } else if (support.arrayBuffer && (ArrayBuffer.prototype.isPrototypeOf(body) || isArrayBufferView(body))) {
        this._bodyArrayBuffer = bufferClone(body);
      } else {
        throw new Error('unsupported BodyInit type')
      }

      if (!this.headers.get('content-type')) {
        if (typeof body === 'string') {
          this.headers.set('content-type', 'text/plain;charset=UTF-8');
        } else if (this._bodyBlob && this._bodyBlob.type) {
          this.headers.set('content-type', this._bodyBlob.type);
        } else if (support.searchParams && URLSearchParams.prototype.isPrototypeOf(body)) {
          this.headers.set('content-type', 'application/x-www-form-urlencoded;charset=UTF-8');
        }
      }
    };

    if (support.blob) {
      this.blob = function() {
        var rejected = consumed(this);
        if (rejected) {
          return rejected
        }

        if (this._bodyBlob) {
          return Promise.resolve(this._bodyBlob)
        } else if (this._bodyArrayBuffer) {
          return Promise.resolve(new Blob([this._bodyArrayBuffer]))
        } else if (this._bodyFormData) {
          throw new Error('could not read FormData body as blob')
        } else {
          return Promise.resolve(new Blob([this._bodyText]))
        }
      };

      this.arrayBuffer = function() {
        if (this._bodyArrayBuffer) {
          return consumed(this) || Promise.resolve(this._bodyArrayBuffer)
        } else {
          return this.blob().then(readBlobAsArrayBuffer)
        }
      };
    }

    this.text = function() {
      var rejected = consumed(this);
      if (rejected) {
        return rejected
      }

      if (this._bodyBlob) {
        return readBlobAsText(this._bodyBlob)
      } else if (this._bodyArrayBuffer) {
        return Promise.resolve(readArrayBufferAsText(this._bodyArrayBuffer))
      } else if (this._bodyFormData) {
        throw new Error('could not read FormData body as text')
      } else {
        return Promise.resolve(this._bodyText)
      }
    };

    if (support.formData) {
      this.formData = function() {
        return this.text().then(decode)
      };
    }

    this.json = function() {
      return this.text().then(JSON.parse)
    };

    return this
  }

  // HTTP methods whose capitalization should be normalized
  var methods = ['DELETE', 'GET', 'HEAD', 'OPTIONS', 'POST', 'PUT'];

  function normalizeMethod(method) {
    var upcased = method.toUpperCase();
    return (methods.indexOf(upcased) > -1) ? upcased : method
  }

  function Request(input, options) {
    options = options || {};
    var body = options.body;

    if (input instanceof Request) {
      if (input.bodyUsed) {
        throw new TypeError('Already read')
      }
      this.url = input.url;
      this.credentials = input.credentials;
      if (!options.headers) {
        this.headers = new Headers(input.headers);
      }
      this.method = input.method;
      this.mode = input.mode;
      if (!body && input._bodyInit != null) {
        body = input._bodyInit;
        input.bodyUsed = true;
      }
    } else {
      this.url = String(input);
    }

    this.credentials = options.credentials || this.credentials || 'omit';
    if (options.headers || !this.headers) {
      this.headers = new Headers(options.headers);
    }
    this.method = normalizeMethod(options.method || this.method || 'GET');
    this.mode = options.mode || this.mode || null;
    this.referrer = null;

    if ((this.method === 'GET' || this.method === 'HEAD') && body) {
      throw new TypeError('Body not allowed for GET or HEAD requests')
    }
    this._initBody(body);
  }

  Request.prototype.clone = function() {
    return new Request(this, { body: this._bodyInit })
  };

  function decode(body) {
    var form = new FormData();
    body.trim().split('&').forEach(function(bytes) {
      if (bytes) {
        var split = bytes.split('=');
        var name = split.shift().replace(/\+/g, ' ');
        var value = split.join('=').replace(/\+/g, ' ');
        form.append(decodeURIComponent(name), decodeURIComponent(value));
      }
    });
    return form
  }

  function parseHeaders(rawHeaders) {
    var headers = new Headers();
    rawHeaders.split(/\r?\n/).forEach(function(line) {
      var parts = line.split(':');
      var key = parts.shift().trim();
      if (key) {
        var value = parts.join(':').trim();
        headers.append(key, value);
      }
    });
    return headers
  }

  Body.call(Request.prototype);

  function Response(bodyInit, options) {
    if (!options) {
      options = {};
    }

    this.type = 'default';
    this.status = 'status' in options ? options.status : 200;
    this.ok = this.status >= 200 && this.status < 300;
    this.statusText = 'statusText' in options ? options.statusText : 'OK';
    this.headers = new Headers(options.headers);
    this.url = options.url || '';
    this._initBody(bodyInit);
  }

  Body.call(Response.prototype);

  Response.prototype.clone = function() {
    return new Response(this._bodyInit, {
      status: this.status,
      statusText: this.statusText,
      headers: new Headers(this.headers),
      url: this.url
    })
  };

  Response.error = function() {
    var response = new Response(null, {status: 0, statusText: ''});
    response.type = 'error';
    return response
  };

  var redirectStatuses = [301, 302, 303, 307, 308];

  Response.redirect = function(url, status) {
    if (redirectStatuses.indexOf(status) === -1) {
      throw new RangeError('Invalid status code')
    }

    return new Response(null, {status: status, headers: {location: url}})
  };

  self.Headers = Headers;
  self.Request = Request;
  self.Response = Response;

  self.fetch = function(input, init) {
    return new Promise(function(resolve, reject) {
      var request = new Request(input, init);
      var xhr = new XMLHttpRequest();

      xhr.onload = function() {
        var options = {
          status: xhr.status,
          statusText: xhr.statusText,
          headers: parseHeaders(xhr.getAllResponseHeaders() || '')
        };
        options.url = 'responseURL' in xhr ? xhr.responseURL : options.headers.get('X-Request-URL');
        var body = 'response' in xhr ? xhr.response : xhr.responseText;
        resolve(new Response(body, options));
      };

      xhr.onerror = function() {
        reject(new TypeError('Network request failed'));
      };

      xhr.ontimeout = function() {
        reject(new TypeError('Network request failed'));
      };

      xhr.open(request.method, request.url, true);

      if (request.credentials === 'include') {
        xhr.withCredentials = true;
      }

      if ('responseType' in xhr && support.blob) {
        xhr.responseType = 'blob';
      }

      request.headers.forEach(function(value, name) {
        xhr.setRequestHeader(name, value);
      });

      xhr.send(typeof request._bodyInit === 'undefined' ? null : request._bodyInit);
    })
  };
  self.fetch.polyfill = true;
})(typeof self !== 'undefined' ? self : window);

window.Promise = promise$1;

/* riotx version 0.9.4 */
var VERSION$1 = "0.9.4";

/**
     * Array forEach
     */
    function forEach$4(arr, callback, thisObj) {
        if (arr == null) {
            return;
        }
        var i = -1,
            len = arr.length;
        while (++i < len) {
            // we iterate over sparse items since there is no way to make it
            // work properly on IE 7-8. see #64
            if ( callback.call(thisObj, arr[i], i, arr) === false ) {
                break;
            }
        }
    }

    var forEach_1$2 = forEach$4;

/**
     * Safer Object.hasOwnProperty
     */
     function hasOwn$3(obj, prop){
         return Object.prototype.hasOwnProperty.call(obj, prop);
     }

     var hasOwn_1$3 = hasOwn$3;

var _hasDontEnumBug$2;
var _dontEnums$2;

    function checkDontEnum$2(){
        _dontEnums$2 = [
                'toString',
                'toLocaleString',
                'valueOf',
                'hasOwnProperty',
                'isPrototypeOf',
                'propertyIsEnumerable',
                'constructor'
            ];

        _hasDontEnumBug$2 = true;

        for (var key in {'toString': null}) {
            _hasDontEnumBug$2 = false;
        }
    }

    /**
     * Similar to Array/forEach but works over object properties and fixes Don't
     * Enum bug on IE.
     * based on: http://whattheheadsaid.com/2010/10/a-safer-object-keys-compatibility-implementation
     */
    function forIn$3(obj, fn, thisObj){
        var key, i = 0;
        // no need to check if argument is a real object that way we can use
        // it for arrays, functions, date, etc.

        //post-pone check till needed
        if (_hasDontEnumBug$2 == null) { checkDontEnum$2(); }

        for (key in obj) {
            if (exec$2(fn, obj, key, thisObj) === false) {
                break;
            }
        }


        if (_hasDontEnumBug$2) {
            var ctor = obj.constructor,
                isProto = !!ctor && obj === ctor.prototype;

            while (key = _dontEnums$2[i++]) {
                // For constructor, if it is a prototype object the constructor
                // is always non-enumerable unless defined otherwise (and
                // enumerated above).  For non-prototype objects, it will have
                // to be defined on this object, since it cannot be defined on
                // any prototype objects.
                //
                // For other [[DontEnum]] properties, check if the value is
                // different than Object prototype value.
                if (
                    (key !== 'constructor' ||
                        (!isProto && hasOwn_1$3(obj, key))) &&
                    obj[key] !== Object.prototype[key]
                ) {
                    if (exec$2(fn, obj, key, thisObj) === false) {
                        break;
                    }
                }
            }
        }
    }

    function exec$2(fn, obj, key, thisObj){
        return fn.call(thisObj, obj[key], key, obj);
    }

    var forIn_1$3 = forIn$3;

/**
     * Similar to Array/forEach but works over object properties and fixes Don't
     * Enum bug on IE.
     * based on: http://whattheheadsaid.com/2010/10/a-safer-object-keys-compatibility-implementation
     */
    function forOwn$4(obj, fn, thisObj){
        forIn_1$3(obj, function(val, key){
            if (hasOwn_1$3(obj, key)) {
                return fn.call(thisObj, obj[key], key, obj);
            }
        });
    }

    var forOwn_1$2 = forOwn$4;

/**
     * Get object keys
     */
     var keys$2 = Object.keys || function (obj) {
            var keys = [];
            forOwn_1$2(obj, function(val, key){
                keys.push(key);
            });
            return keys;
        };

    var keys_1$1 = keys$2;

/*
object-assign
(c) Sindre Sorhus
@license MIT
*/

/* eslint-disable no-unused-vars */
var getOwnPropertySymbols$1 = Object.getOwnPropertySymbols;
var hasOwnProperty$1 = Object.prototype.hasOwnProperty;
var propIsEnumerable$1 = Object.prototype.propertyIsEnumerable;

function toObject$1(val) {
	if (val === null || val === undefined) {
		throw new TypeError('Object.assign cannot be called with null or undefined');
	}

	return Object(val);
}

function shouldUseNative$1() {
	try {
		if (!Object.assign) {
			return false;
		}

		// Detect buggy property enumeration order in older V8 versions.

		// https://bugs.chromium.org/p/v8/issues/detail?id=4118
		var test1 = new String('abc');  // eslint-disable-line no-new-wrappers
		test1[5] = 'de';
		if (Object.getOwnPropertyNames(test1)[0] === '5') {
			return false;
		}

		// https://bugs.chromium.org/p/v8/issues/detail?id=3056
		var test2 = {};
		for (var i = 0; i < 10; i++) {
			test2['_' + String.fromCharCode(i)] = i;
		}
		var order2 = Object.getOwnPropertyNames(test2).map(function (n) {
			return test2[n];
		});
		if (order2.join('') !== '0123456789') {
			return false;
		}

		// https://bugs.chromium.org/p/v8/issues/detail?id=3056
		var test3 = {};
		'abcdefghijklmnopqrst'.split('').forEach(function (letter) {
			test3[letter] = letter;
		});
		if (Object.keys(Object.assign({}, test3)).join('') !==
				'abcdefghijklmnopqrst') {
			return false;
		}

		return true;
	} catch (err) {
		// We don't expect any of the above to throw, but better to be safe.
		return false;
	}
}

var index$1$1 = shouldUseNative$1() ? Object.assign : function (target, source) {
	var arguments$1 = arguments;

	var from;
	var to = toObject$1(target);
	var symbols;

	for (var s = 1; s < arguments.length; s++) {
		from = Object(arguments$1[s]);

		for (var key in from) {
			if (hasOwnProperty$1.call(from, key)) {
				to[key] = from[key];
			}
		}

		if (getOwnPropertySymbols$1) {
			symbols = getOwnPropertySymbols$1(from);
			for (var i = 0; i < symbols.length; i++) {
				if (propIsEnumerable$1.call(from, symbols[i])) {
					to[symbols[i]] = from[symbols[i]];
				}
			}
		}
	}

	return to;
};

var commonjsGlobal$2 = typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};





function createCommonjsModule$2(fn, module) {
	return module = { exports: {} }, fn(module, module.exports), module.exports;
}

var promise$2 = createCommonjsModule$2(function (module) {
(function (root) {

  // Store setTimeout reference so promise-polyfill will be unaffected by
  // other code modifying setTimeout (like sinon.useFakeTimers())
  var setTimeoutFunc = setTimeout;

  function noop() {}
  
  // Polyfill for Function.prototype.bind
  function bind(fn, thisArg) {
    return function () {
      fn.apply(thisArg, arguments);
    };
  }

  function Promise(fn) {
    if (typeof this !== 'object') { throw new TypeError('Promises must be constructed via new'); }
    if (typeof fn !== 'function') { throw new TypeError('not a function'); }
    this._state = 0;
    this._handled = false;
    this._value = undefined;
    this._deferreds = [];

    doResolve(fn, this);
  }

  function handle(self, deferred) {
    while (self._state === 3) {
      self = self._value;
    }
    if (self._state === 0) {
      self._deferreds.push(deferred);
      return;
    }
    self._handled = true;
    Promise._immediateFn(function () {
      var cb = self._state === 1 ? deferred.onFulfilled : deferred.onRejected;
      if (cb === null) {
        (self._state === 1 ? resolve : reject)(deferred.promise, self._value);
        return;
      }
      var ret;
      try {
        ret = cb(self._value);
      } catch (e) {
        reject(deferred.promise, e);
        return;
      }
      resolve(deferred.promise, ret);
    });
  }

  function resolve(self, newValue) {
    try {
      // Promise Resolution Procedure: https://github.com/promises-aplus/promises-spec#the-promise-resolution-procedure
      if (newValue === self) { throw new TypeError('A promise cannot be resolved with itself.'); }
      if (newValue && (typeof newValue === 'object' || typeof newValue === 'function')) {
        var then = newValue.then;
        if (newValue instanceof Promise) {
          self._state = 3;
          self._value = newValue;
          finale(self);
          return;
        } else if (typeof then === 'function') {
          doResolve(bind(then, newValue), self);
          return;
        }
      }
      self._state = 1;
      self._value = newValue;
      finale(self);
    } catch (e) {
      reject(self, e);
    }
  }

  function reject(self, newValue) {
    self._state = 2;
    self._value = newValue;
    finale(self);
  }

  function finale(self) {
    if (self._state === 2 && self._deferreds.length === 0) {
      Promise._immediateFn(function() {
        if (!self._handled) {
          Promise._unhandledRejectionFn(self._value);
        }
      });
    }

    for (var i = 0, len = self._deferreds.length; i < len; i++) {
      handle(self, self._deferreds[i]);
    }
    self._deferreds = null;
  }

  function Handler(onFulfilled, onRejected, promise) {
    this.onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : null;
    this.onRejected = typeof onRejected === 'function' ? onRejected : null;
    this.promise = promise;
  }

  /**
   * Take a potentially misbehaving resolver function and make sure
   * onFulfilled and onRejected are only called once.
   *
   * Makes no guarantees about asynchrony.
   */
  function doResolve(fn, self) {
    var done = false;
    try {
      fn(function (value) {
        if (done) { return; }
        done = true;
        resolve(self, value);
      }, function (reason) {
        if (done) { return; }
        done = true;
        reject(self, reason);
      });
    } catch (ex) {
      if (done) { return; }
      done = true;
      reject(self, ex);
    }
  }

  Promise.prototype['catch'] = function (onRejected) {
    return this.then(null, onRejected);
  };

  Promise.prototype.then = function (onFulfilled, onRejected) {
    var prom = new (this.constructor)(noop);

    handle(this, new Handler(onFulfilled, onRejected, prom));
    return prom;
  };

  Promise.all = function (arr) {
    var args = Array.prototype.slice.call(arr);

    return new Promise(function (resolve, reject) {
      if (args.length === 0) { return resolve([]); }
      var remaining = args.length;

      function res(i, val) {
        try {
          if (val && (typeof val === 'object' || typeof val === 'function')) {
            var then = val.then;
            if (typeof then === 'function') {
              then.call(val, function (val) {
                res(i, val);
              }, reject);
              return;
            }
          }
          args[i] = val;
          if (--remaining === 0) {
            resolve(args);
          }
        } catch (ex) {
          reject(ex);
        }
      }

      for (var i = 0; i < args.length; i++) {
        res(i, args[i]);
      }
    });
  };

  Promise.resolve = function (value) {
    if (value && typeof value === 'object' && value.constructor === Promise) {
      return value;
    }

    return new Promise(function (resolve) {
      resolve(value);
    });
  };

  Promise.reject = function (value) {
    return new Promise(function (resolve, reject) {
      reject(value);
    });
  };

  Promise.race = function (values) {
    return new Promise(function (resolve, reject) {
      for (var i = 0, len = values.length; i < len; i++) {
        values[i].then(resolve, reject);
      }
    });
  };

  // Use polyfill for setImmediate for performance gains
  Promise._immediateFn = (typeof setImmediate === 'function' && function (fn) { setImmediate(fn); }) ||
    function (fn) {
      setTimeoutFunc(fn, 0);
    };

  Promise._unhandledRejectionFn = function _unhandledRejectionFn(err) {
    if (typeof console !== 'undefined' && console) {
      console.warn('Possible Unhandled Promise Rejection:', err); // eslint-disable-line no-console
    }
  };

  /**
   * Set the immediate function to execute callbacks
   * @param fn {function} Function to execute
   * @deprecated
   */
  Promise._setImmediateFn = function _setImmediateFn(fn) {
    Promise._immediateFn = fn;
  };

  /**
   * Change the function to execute on unhandled rejection
   * @param {function} fn Function to execute on unhandled rejection
   * @deprecated
   */
  Promise._setUnhandledRejectionFn = function _setUnhandledRejectionFn(fn) {
    Promise._unhandledRejectionFn = fn;
  };
  
  if ('object' !== 'undefined' && module.exports) {
    module.exports = Promise;
  } else if (!root.Promise) {
    root.Promise = Promise;
  }

})(commonjsGlobal$2);
});

/**
 * settings for riotx
 * @type {{debug: boolean, default: string}}
 */
var settings = {
  debug: false,
  default: '@',
  changeBindName: 'riotxChange'
};

/**
 * log output
 */
var log = function () {
  var args = [], len = arguments.length;
  while ( len-- ) { args[ len ] = arguments[ len ]; }

  if (!settings.debug) {
    return;
  }

  args.unshift('[riotx]');
  try {
    console.log.apply(console, args); // eslint-disable-line
  } catch (e) {
    console.log(args); // eslint-disable-line
  }
};


var Store = function Store(_store) {
  /**
   * name of the store.
   * @type {String}
   */
  this.name = _store.name;
  if (!this.name) {
    this.name = settings.default;
    log(("Default store name. name=" + (this.name)));
  }

  /**
   * a object that represents full application state.
   * @type {Object}
   */
  this.state = index$1$1({}, _store.state);

  /**
   * functions to mutate application state.
   * @type {Object}
   */
  this._actions = index$1$1({}, _store.actions);

  /**
   * mutaions.
   * mutaion = a function which mutates the state.
   * all mutation functions take two parameters which are `state` and `obj`.
   * `state` will be TODO.
   * `obj` will be TODO.
   * @type {Object}
   */
  this._mutations = index$1$1({}, _store.mutations);

  /**
   * functions to get data from states.
   * @type {Object}
   */
  this._getters = index$1$1({}, _store.getters);

  riot$1.observable(this);
};

/**
 * Getter state
 * @param {String} name TODO
 * @param {...*} args
 */
Store.prototype.getter = function getter (name) {
    var args = [], len = arguments.length - 1;
    while ( len-- > 0 ) { args[ len ] = arguments[ len + 1 ]; }

  log('[getter]', name, args);
  var context = {
    state : index$1$1({}, this.state)
  };
  return this._getters[name].apply(null, [context ].concat( args));
};

/**
 * Commit mutation.
 * only actions are allowed to execute this function.
 * @param {String} name mutation name
 * @param {...*} args
 */
Store.prototype.commit = function commit (name) {
    var this$1 = this;
    var args = [], len = arguments.length - 1;
    while ( len-- > 0 ) { args[ len ] = arguments[ len + 1 ]; }

  var _state = index$1$1({}, this.state);
  log.apply(void 0, [ '[commit(before)]', name, _state ].concat( args ));
  var context = {
    getter: function (name) {
        var args = [], len = arguments.length - 1;
        while ( len-- > 0 ) { args[ len ] = arguments[ len + 1 ]; }

      return this$1.getter.apply(this$1, [name ].concat( args));
    },
    state : _state
  };
  var triggers = this._mutations[name].apply(null, [context ].concat( args));
  log.apply(void 0, [ '[commit(after)]', name, _state ].concat( args ));
  index$1$1(this.state, _state);

  forEach_1$2(triggers, function (v) {
    // this.trigger(v, null, this.state, this);
    this$1.trigger(v, this$1.state, this$1);
  });
};

/**
 * emit action.
 * only ui components are allowed to execute this function.
 * @param {Stting} name action name
 * @param {...*} args parameter's to action
 * @return {Promise}
 */
Store.prototype.action = function action (name) {
    var this$1 = this;
    var args = [], len = arguments.length - 1;
    while ( len-- > 0 ) { args[ len ] = arguments[ len + 1 ]; }

  log('[action]', name, args);

  var context = {
    getter: function (name) {
        var args = [], len = arguments.length - 1;
        while ( len-- > 0 ) { args[ len ] = arguments[ len + 1 ]; }

      return this$1.getter.apply(this$1, [name ].concat( args));
    },
    state: index$1$1({}, this.state),
    commit: function () {
        var args = [], len = arguments.length;
        while ( len-- ) { args[ len ] = arguments[ len ]; }

      (ref = this$1).commit.apply(ref, args);
        var ref;
    }
  };
  return promise$2
    .resolve()
    .then(function () { return this$1._actions[name].apply(null, [context ].concat( args)); });
};

/**
 * shorthand for `store.on('event', () => {})`.
 * @param {...*} args
 */
Store.prototype.change = function change () {
    var args = [], len = arguments.length;
    while ( len-- ) { args[ len ] = arguments[ len ]; }

  (ref = this).on.apply(ref, args);
    var ref;
};

var RiotX = function RiotX() {
  this.version = VERSION$1 || '';

  /**
   * constructor of RiotX.Store.
   * @type {RiotX.Store}
   */
  this.Store = Store;

  /**
   * instances of RiotX.Store.
   * @type {Object}
   */
  this.stores = {};

  // add and keep event listener for store changes.
  // through this function the event listeners will be unbinded automatically.
  var riotxChange = function(store, evtName, handler) {
    var args = [], len = arguments.length - 3;
    while ( len-- > 0 ) { args[ len ] = arguments[ len + 3 ]; }

    this._riotx_change_handlers.push({
      store: store,
      evtName: evtName,
      handler: handler
    });
    args.unshift(handler);
    args.unshift(evtName);
    store.change.apply(store, args);
  };

  // register a mixin globally.
  riot$1.mixin({
    // intendedly use `function`.
    // switch the context of `this` from `riotx` to `riot tag instance`.
    init: function () {
      var this$1 = this;

      // the context of `this` will be equal to riot tag instant.
      this.on('unmount', function () {
        this$1.off('*');
        forEach_1$2(this$1._riotx_change_handlers, function (obj) {
          obj.store.off(obj.evtName, obj.handler);
        });
        delete this$1.riotx;
        delete this$1._riotx_change_handlers;
        delete this$1[settings.changeBindName];
      });

      if (settings.debug) {
        this.on('*', function (eventName) {
          log(eventName, this$1);
        });
      }

      this._riotx_change_handlers = [];
      // let users set the name.
      this[settings.changeBindName] = riotxChange;
    },
    // give each riot instance the ability to access the globally defined singleton RiotX instance.
    riotx: this
  });
};

/**
 * Add a store instance
 * @param {RiotX.Store} store instance of RiotX.Store
 * @returns {RiotX}
 */
RiotX.prototype.add = function add (store) {
  if (this.stores[store.name]) {
    throw new Error(("The store instance named `" + (store.name) + "` already exists."));
  }

  this.stores[store.name] = store;
  return this;
};

/**
 * Get store instance
 * @param {String} name store name
 * @returns {RiotX.Store} store instance
 */
RiotX.prototype.get = function get (name) {
    if ( name === void 0 ) { name = settings.default; }

  return this.stores[name];
};

/**
 * Set debug flag
 * @param flag
 * @returns {RiotX}
 */
RiotX.prototype.debug = function debug (flag) {
  settings.debug = !!flag;
  return this;
};

/**
 * Set function name to bind store change event.
 * @param {String} name
 * @returns {RiotX}
 */
RiotX.prototype.setChangeBindName = function setChangeBindName (name) {
  settings.changeBindName = name;
  return this;
};

/**
 * Reset riotx instance
 * @returns {RiotX} instance
 */
RiotX.prototype.reset = function reset () {
  this.stores = {};
  return this;
};

/**
 * Store's count
 * @returns {int} size
 */
RiotX.prototype.size = function size () {
  return keys_1$1(this.stores).length;
};

var index$1$2 = new RiotX();

var store$1 = {
  /**
   * riotx初期設定。
   * @return {Promise}
   */
  init: () => {
    return Promise
      .resolve()
      .then(() => {
        const store = new index$1$2.Store({
          state: states,
          actions,
          mutations,
          getters
        });
        index$1$2.add(store);
        return store;
      });
  }
};

var script$2 = function() {};

riot$1.tag2('viron-components-page', '<div>Components!!!</div>', '', 'class="ComponentsPage"', function(opts) {
    this.external(script$2);
});

var script$3 = function() {};

riot$1.tag2('viron-tag', '<div class="Tag__label">{opts.label}</div>', '', 'class="Tag"', function(opts) {
    this.external(script$3);
});

riot$1.tag2('viron-icon-dots', '<svg viewbox="-3614 14066 16 4"> <g transform="translate(-3894 14025)"> <circle cx="2" cy="2" r="2" transform="translate(280 41)"></circle> <circle cx="2" cy="2" r="2" transform="translate(286 41)"></circle> <circle cx="2" cy="2" r="2" transform="translate(292 41)"></circle> </g> </svg>', '', 'class="icon Icon IconDots {opts.class}"', function(opts) {
});

/**
     */
    function isString(val) {
        return isKind_1$1(val, 'String');
    }
    var isString_1 = isString;

var script$6 = function() {
  /**
   * 文字列もしくはnullに変換します。
   * @param {String|null|undefined} value
   * @return {String|null}
   */
  this.normalizeValue = value => {
    if (!isString_1(value)) {
      return null;
    }
    return value;
  };

  this.handleTap = () => {
    this.refs.input.focus();
  };

  this.handleFormSubmit = e => {
    e.preventDefault();
    if (!this.opts.onchange) {
      return;
    }
    const newVal = this.normalizeValue(this.opts.val);
    this.opts.onchange(newVal, this.opts.id);
  };

  // `blur`時にも`change`イベントが発火する。
  // 不都合な挙動なのでイベント伝播を止める。
  this.handleTextareaChange = e => {
    e.stopPropagation();
  };

  this.handleTextareaInput = e => {
    if (!this.opts.onchange) {
      return;
    }
    const newVal = this.normalizeValue(e.target.value);
    this.opts.onchange(newVal, this.opts.id);
  };
};

riot$1.tag2('viron-textarea', '<div class="Textarea__label" if="{!!opts.label}">{opts.label}</div> <form class="Textarea__form" ref="form" onsubmit="{handleFormSubmit}"> <textarea class="Textarea__input" ref="input" riot-value="{normalizeValue(opts.val)}" placeholder="{opts.placeholder}" disabled="{!!opts.isdisabled}" oninput="{handleTextareaInput}" onchange="{handleTextareaChange}"></textarea> </form>', '', 'class="Textarea {\'Textarea--disabled\': opts.isdisabled}" onclick="{getClickHandler(\'handleTap\')}" ontouchstart="{getTouchStartHandler()}" ontouchmove="{getTouchMoveHandler()}" ontouchend="{getTouchEndHandler(\'handleTap\')}"', function(opts) {
    this.external(script$6);
});

var script$7 = function() {
  this.handleTap = () => {
    if (!this.opts.onselect) {
      return;
    }
    this.opts.onselect();
  };
};

riot$1.tag2('viron-button', '<div class="Button__label">{opts.label}</div>', '', 'class="Button Button--{opts.theme || \'primary\'}" onclick="{getClickHandler(\'handleTap\')}" ontouchstart="{getTouchStartHandler()}" ontouchmove="{getTouchMoveHandler()}" ontouchend="{getTouchEndHandler(\'handleTap\')}"', function(opts) {
    this.external(script$7);
});

var script$8 = function() {
  const store = this.riotx.get();

  this.memo = this.opts.endpoint.memo;

  this.handleMemoChange = newMemo => {
    this.memo = newMemo;
    this.update();
  };

  this.handleSaveButtonSelect = () => {
    Promise
      .resolve()
      .then(() => store.action(constants$1.ENDPOINTS_UPDATE, this.opts.endpoint.key, {
        memo: this.memo
      }))
      .then(() => store.action(constants$1.TOASTS_ADD, {
        message: '保存完了。'
      }))
      .then(() => {
        this.close();
      })
      .catch(err => store.action(constants$1.MODALS_ADD, 'viron-error', {
        error: err
      }));
  };

  this.handleCancelButtonSelect = () => {
    this.close();
  };
};

riot$1.tag2('viron-endpoints-page-endpoint-menu-edit', '<div class="EndpointsPage_Endpoint_Menu_Edit__title">エンドポイント編集</div> <div class="EndpointsPage_Endpoint_Menu_Edit__thumbnail" riot-style="background-image:url({opts.endpoint.thumbnail});"></div> <div class="EndpointsPage_Endpoint_Menu_Edit__name">name: {opts.endpoint.name}</div> <div class="EndpointsPage_Endpoint_Menu_Edit__inputs"> <viron-textarea label="メモ" val="{memo}" onchange="{handleMemoChange}"></viron-textarea> </div> <div class="EndpointsPage_Endpoint_Menu_Edit__control"> <viron-button label="保存" onselect="{handleSaveButtonSelect}"></viron-button> <viron-button theme="ghost" label="キャンセル" onselect="{handleCancelButtonSelect}"></viron-button> </div>', '', 'class="EndpointsPage_Endpoint_Menu_Edit"', function(opts) {
    this.external(script$8);
});

var qrious = createCommonjsModule(function (module, exports) {
/*
 * QRious v4.0.2
 * Copyright (C) 2017 Alasdair Mercer
 * Copyright (C) 2010 Tom Zerucha
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */
(function (global, factory) {
  module.exports = factory();
}(commonjsGlobal, (function () { 'use strict';

  /*
   * Copyright (C) 2017 Alasdair Mercer, !ninja
   *
   * Permission is hereby granted, free of charge, to any person obtaining a copy
   * of this software and associated documentation files (the "Software"), to deal
   * in the Software without restriction, including without limitation the rights
   * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
   * copies of the Software, and to permit persons to whom the Software is
   * furnished to do so, subject to the following conditions:
   *
   * The above copyright notice and this permission notice shall be included in all
   * copies or substantial portions of the Software.
   *
   * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
   * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
   * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
   * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
   * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
   * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
   * SOFTWARE.
   */

  /**
   * A bare-bones constructor for surrogate prototype swapping.
   *
   * @private
   * @constructor
   */
  var Constructor = /* istanbul ignore next */ function() {};
  /**
   * A reference to <code>Object.prototype.hasOwnProperty</code>.
   *
   * @private
   * @type {Function}
   */
  var hasOwnProperty = Object.prototype.hasOwnProperty;
  /**
   * A reference to <code>Array.prototype.slice</code>.
   *
   * @private
   * @type {Function}
   */
  var slice = Array.prototype.slice;

  /**
   * Creates an object which inherits the given <code>prototype</code>.
   *
   * Optionally, the created object can be extended further with the specified <code>properties</code>.
   *
   * @param {Object} prototype - the prototype to be inherited by the created object
   * @param {Object} [properties] - the optional properties to be extended by the created object
   * @return {Object} The newly created object.
   * @private
   */
  function createObject(prototype, properties) {
    var result;
    /* istanbul ignore next */
    if (typeof Object.create === 'function') {
      result = Object.create(prototype);
    } else {
      Constructor.prototype = prototype;
      result = new Constructor();
      Constructor.prototype = null;
    }

    if (properties) {
      extendObject(true, result, properties);
    }

    return result;
  }

  /**
   * Extends the constructor to which this method is associated with the <code>prototype</code> and/or
   * <code>statics</code> provided.
   *
   * If <code>name</code> is provided, it will be used as the class name and can be accessed via a special
   * <code>class_</code> property on the child constructor, otherwise the class name of the super constructor will be used
   * instead. The class name may also be used string representation for instances of the child constructor (via
   * <code>toString</code>), but this is not applicable to the <i>lite</i> version of Nevis.
   *
   * If <code>constructor</code> is provided, it will be used as the constructor for the child, otherwise a simple
   * constructor which only calls the super constructor will be used instead.
   *
   * The super constructor can be accessed via a special <code>super_</code> property on the child constructor.
   *
   * @param {string} [name=this.class_] - the class name to be used for the child constructor
   * @param {Function} [constructor] - the constructor for the child
   * @param {Object} [prototype] - the prototype properties to be defined for the child
   * @param {Object} [statics] - the static properties to be defined for the child
   * @return {Function} The child <code>constructor</code> provided or the one created if none was given.
   * @public
   */
  function extend(name, constructor, prototype, statics) {
    var superConstructor = this;

    if (typeof name !== 'string') {
      statics = prototype;
      prototype = constructor;
      constructor = name;
      name = null;
    }

    if (typeof constructor !== 'function') {
      statics = prototype;
      prototype = constructor;
      constructor = function() {
        return superConstructor.apply(this, arguments);
      };
    }

    extendObject(false, constructor, superConstructor, statics);

    constructor.prototype = createObject(superConstructor.prototype, prototype);
    constructor.prototype.constructor = constructor;

    constructor.class_ = name || superConstructor.class_;
    constructor.super_ = superConstructor;

    return constructor;
  }

  /**
   * Extends the specified <code>target</code> object with the properties in each of the <code>sources</code> provided.
   *
   * if any source is <code>null</code> it will be ignored.
   *
   * @param {boolean} own - <code>true</code> to only copy <b>own</b> properties from <code>sources</code> onto
   * <code>target</code>; otherwise <code>false</code>
   * @param {Object} target - the target object which should be extended
   * @param {...Object} [sources] - the source objects whose properties are to be copied onto <code>target</code>
   * @return {void}
   * @private
   */
  function extendObject(own, target, sources) {
    sources = slice.call(arguments, 2);

    var property;
    var source;

    for (var i = 0, length = sources.length; i < length; i++) {
      source = sources[i];

      for (property in source) {
        if (!own || hasOwnProperty.call(source, property)) {
          target[property] = source[property];
        }
      }
    }
  }

  var extend_1 = extend;

  /**
   * The base class from which all others should extend.
   *
   * @public
   * @constructor
   */
  function Nevis() {}
  Nevis.class_ = 'Nevis';
  Nevis.super_ = Object;

  /**
   * Extends the constructor to which this method is associated with the <code>prototype</code> and/or
   * <code>statics</code> provided.
   *
   * If <code>name</code> is provided, it will be used as the class name and can be accessed via a special
   * <code>class_</code> property on the child constructor, otherwise the class name of the super constructor will be used
   * instead. The class name may also be used string representation for instances of the child constructor (via
   * <code>toString</code>), but this is not applicable to the <i>lite</i> version of Nevis.
   *
   * If <code>constructor</code> is provided, it will be used as the constructor for the child, otherwise a simple
   * constructor which only calls the super constructor will be used instead.
   *
   * The super constructor can be accessed via a special <code>super_</code> property on the child constructor.
   *
   * @param {string} [name=this.class_] - the class name to be used for the child constructor
   * @param {Function} [constructor] - the constructor for the child
   * @param {Object} [prototype] - the prototype properties to be defined for the child
   * @param {Object} [statics] - the static properties to be defined for the child
   * @return {Function} The child <code>constructor</code> provided or the one created if none was given.
   * @public
   * @static
   * @memberof Nevis
   */
  Nevis.extend = extend_1;

  var nevis = Nevis;

  var lite = nevis;

  /**
   * Responsible for rendering a QR code {@link Frame} on a specific type of element.
   *
   * A renderer may be dependant on the rendering of another element, so the ordering of their execution is important.
   *
   * The rendering of a element can be deferred by disabling the renderer initially, however, any attempt get the element
   * from the renderer will result in it being immediately enabled and the element being rendered.
   *
   * @param {QRious} qrious - the {@link QRious} instance to be used
   * @param {*} element - the element onto which the QR code is to be rendered
   * @param {boolean} [enabled] - <code>true</code> this {@link Renderer} is enabled; otherwise <code>false</code>.
   * @public
   * @class
   * @extends Nevis
   */
  var Renderer = lite.extend(function(qrious, element, enabled) {
    /**
     * The {@link QRious} instance.
     *
     * @protected
     * @type {QRious}
     * @memberof Renderer#
     */
    this.qrious = qrious;

    /**
     * The element onto which this {@link Renderer} is rendering the QR code.
     *
     * @protected
     * @type {*}
     * @memberof Renderer#
     */
    this.element = element;
    this.element.qrious = qrious;

    /**
     * Whether this {@link Renderer} is enabled.
     *
     * @protected
     * @type {boolean}
     * @memberof Renderer#
     */
    this.enabled = Boolean(enabled);
  }, {

    /**
     * Draws the specified QR code <code>frame</code> on the underlying element.
     *
     * Implementations of {@link Renderer} <b>must</b> override this method with their own specific logic.
     *
     * @param {Frame} frame - the {@link Frame} to be drawn
     * @return {void}
     * @protected
     * @abstract
     * @memberof Renderer#
     */
    draw: function(frame) {},

    /**
     * Returns the element onto which this {@link Renderer} is rendering the QR code.
     *
     * If this method is called while this {@link Renderer} is disabled, it will be immediately enabled and rendered
     * before the element is returned.
     *
     * @return {*} The element.
     * @public
     * @memberof Renderer#
     */
    getElement: function() {
      if (!this.enabled) {
        this.enabled = true;
        this.render();
      }

      return this.element;
    },

    /**
     * Calculates the size (in pixel units) to represent an individual module within the QR code based on the
     * <code>frame</code> provided.
     *
     * Any configured padding will be excluded from the returned size.
     *
     * The returned value will be at least one, even in cases where the size of the QR code does not fit its contents.
     * This is done so that the inevitable clipping is handled more gracefully since this way at least something is
     * displayed instead of just a blank space filled by the background color.
     *
     * @param {Frame} frame - the {@link Frame} from which the module size is to be derived
     * @return {number} The pixel size for each module in the QR code which will be no less than one.
     * @protected
     * @memberof Renderer#
     */
    getModuleSize: function(frame) {
      var qrious = this.qrious;
      var padding = qrious.padding || 0;
      var pixels = Math.floor((qrious.size - (padding * 2)) / frame.width);

      return Math.max(1, pixels);
    },

    /**
     * Calculates the offset/padding (in pixel units) to be inserted before the QR code based on the <code>frame</code>
     * provided.
     *
     * The returned value will be zero if there is no available offset or if the size of the QR code does not fit its
     * contents. It will never be a negative value. This is done so that the inevitable clipping appears more naturally
     * and it is not clipped from all directions.
     *
     * @param {Frame} frame - the {@link Frame} from which the offset is to be derived
     * @return {number} The pixel offset for the QR code which will be no less than zero.
     * @protected
     * @memberof Renderer#
     */
    getOffset: function(frame) {
      var qrious = this.qrious;
      var padding = qrious.padding;

      if (padding != null) {
        return padding;
      }

      var moduleSize = this.getModuleSize(frame);
      var offset = Math.floor((qrious.size - (moduleSize * frame.width)) / 2);

      return Math.max(0, offset);
    },

    /**
     * Renders a QR code on the underlying element based on the <code>frame</code> provided.
     *
     * @param {Frame} frame - the {@link Frame} to be rendered
     * @return {void}
     * @public
     * @memberof Renderer#
     */
    render: function(frame) {
      if (this.enabled) {
        this.resize();
        this.reset();
        this.draw(frame);
      }
    },

    /**
     * Resets the underlying element, effectively clearing any previously rendered QR code.
     *
     * Implementations of {@link Renderer} <b>must</b> override this method with their own specific logic.
     *
     * @return {void}
     * @protected
     * @abstract
     * @memberof Renderer#
     */
    reset: function() {},

    /**
     * Ensures that the size of the underlying element matches that defined on the associated {@link QRious} instance.
     *
     * Implementations of {@link Renderer} <b>must</b> override this method with their own specific logic.
     *
     * @return {void}
     * @protected
     * @abstract
     * @memberof Renderer#
     */
    resize: function() {}

  });

  var Renderer_1 = Renderer;

  /**
   * An implementation of {@link Renderer} for working with <code>canvas</code> elements.
   *
   * @public
   * @class
   * @extends Renderer
   */
  var CanvasRenderer = Renderer_1.extend({

    /**
     * @override
     */
    draw: function(frame) {
      var i, j;
      var qrious = this.qrious;
      var moduleSize = this.getModuleSize(frame);
      var offset = this.getOffset(frame);
      var context = this.element.getContext('2d');

      context.fillStyle = qrious.foreground;
      context.globalAlpha = qrious.foregroundAlpha;

      for (i = 0; i < frame.width; i++) {
        for (j = 0; j < frame.width; j++) {
          if (frame.buffer[(j * frame.width) + i]) {
            context.fillRect((moduleSize * i) + offset, (moduleSize * j) + offset, moduleSize, moduleSize);
          }
        }
      }
    },

    /**
     * @override
     */
    reset: function() {
      var qrious = this.qrious;
      var context = this.element.getContext('2d');
      var size = qrious.size;

      context.lineWidth = 1;
      context.clearRect(0, 0, size, size);
      context.fillStyle = qrious.background;
      context.globalAlpha = qrious.backgroundAlpha;
      context.fillRect(0, 0, size, size);
    },

    /**
     * @override
     */
    resize: function() {
      var element = this.element;

      element.width = element.height = this.qrious.size;
    }

  });

  var CanvasRenderer_1 = CanvasRenderer;

  /* eslint no-multi-spaces: "off" */



  /**
   * Contains alignment pattern information.
   *
   * @public
   * @class
   * @extends Nevis
   */
  var Alignment = lite.extend(null, {

    /**
     * The alignment pattern block.
     *
     * @public
     * @static
     * @type {number[]}
     * @memberof Alignment
     */
    BLOCK: [
      0,  11, 15, 19, 23, 27, 31,
      16, 18, 20, 22, 24, 26, 28, 20, 22, 24, 24, 26, 28, 28, 22, 24, 24,
      26, 26, 28, 28, 24, 24, 26, 26, 26, 28, 28, 24, 26, 26, 26, 28, 28
    ]

  });

  var Alignment_1 = Alignment;

  /* eslint no-multi-spaces: "off" */



  /**
   * Contains error correction information.
   *
   * @public
   * @class
   * @extends Nevis
   */
  var ErrorCorrection = lite.extend(null, {

    /**
     * The error correction blocks.
     *
     * There are four elements per version. The first two indicate the number of blocks, then the data width, and finally
     * the ECC width.
     *
     * @public
     * @static
     * @type {number[]}
     * @memberof ErrorCorrection
     */
    BLOCKS: [
      1,  0,  19,  7,     1,  0,  16,  10,    1,  0,  13,  13,    1,  0,  9,   17,
      1,  0,  34,  10,    1,  0,  28,  16,    1,  0,  22,  22,    1,  0,  16,  28,
      1,  0,  55,  15,    1,  0,  44,  26,    2,  0,  17,  18,    2,  0,  13,  22,
      1,  0,  80,  20,    2,  0,  32,  18,    2,  0,  24,  26,    4,  0,  9,   16,
      1,  0,  108, 26,    2,  0,  43,  24,    2,  2,  15,  18,    2,  2,  11,  22,
      2,  0,  68,  18,    4,  0,  27,  16,    4,  0,  19,  24,    4,  0,  15,  28,
      2,  0,  78,  20,    4,  0,  31,  18,    2,  4,  14,  18,    4,  1,  13,  26,
      2,  0,  97,  24,    2,  2,  38,  22,    4,  2,  18,  22,    4,  2,  14,  26,
      2,  0,  116, 30,    3,  2,  36,  22,    4,  4,  16,  20,    4,  4,  12,  24,
      2,  2,  68,  18,    4,  1,  43,  26,    6,  2,  19,  24,    6,  2,  15,  28,
      4,  0,  81,  20,    1,  4,  50,  30,    4,  4,  22,  28,    3,  8,  12,  24,
      2,  2,  92,  24,    6,  2,  36,  22,    4,  6,  20,  26,    7,  4,  14,  28,
      4,  0,  107, 26,    8,  1,  37,  22,    8,  4,  20,  24,    12, 4,  11,  22,
      3,  1,  115, 30,    4,  5,  40,  24,    11, 5,  16,  20,    11, 5,  12,  24,
      5,  1,  87,  22,    5,  5,  41,  24,    5,  7,  24,  30,    11, 7,  12,  24,
      5,  1,  98,  24,    7,  3,  45,  28,    15, 2,  19,  24,    3,  13, 15,  30,
      1,  5,  107, 28,    10, 1,  46,  28,    1,  15, 22,  28,    2,  17, 14,  28,
      5,  1,  120, 30,    9,  4,  43,  26,    17, 1,  22,  28,    2,  19, 14,  28,
      3,  4,  113, 28,    3,  11, 44,  26,    17, 4,  21,  26,    9,  16, 13,  26,
      3,  5,  107, 28,    3,  13, 41,  26,    15, 5,  24,  30,    15, 10, 15,  28,
      4,  4,  116, 28,    17, 0,  42,  26,    17, 6,  22,  28,    19, 6,  16,  30,
      2,  7,  111, 28,    17, 0,  46,  28,    7,  16, 24,  30,    34, 0,  13,  24,
      4,  5,  121, 30,    4,  14, 47,  28,    11, 14, 24,  30,    16, 14, 15,  30,
      6,  4,  117, 30,    6,  14, 45,  28,    11, 16, 24,  30,    30, 2,  16,  30,
      8,  4,  106, 26,    8,  13, 47,  28,    7,  22, 24,  30,    22, 13, 15,  30,
      10, 2,  114, 28,    19, 4,  46,  28,    28, 6,  22,  28,    33, 4,  16,  30,
      8,  4,  122, 30,    22, 3,  45,  28,    8,  26, 23,  30,    12, 28, 15,  30,
      3,  10, 117, 30,    3,  23, 45,  28,    4,  31, 24,  30,    11, 31, 15,  30,
      7,  7,  116, 30,    21, 7,  45,  28,    1,  37, 23,  30,    19, 26, 15,  30,
      5,  10, 115, 30,    19, 10, 47,  28,    15, 25, 24,  30,    23, 25, 15,  30,
      13, 3,  115, 30,    2,  29, 46,  28,    42, 1,  24,  30,    23, 28, 15,  30,
      17, 0,  115, 30,    10, 23, 46,  28,    10, 35, 24,  30,    19, 35, 15,  30,
      17, 1,  115, 30,    14, 21, 46,  28,    29, 19, 24,  30,    11, 46, 15,  30,
      13, 6,  115, 30,    14, 23, 46,  28,    44, 7,  24,  30,    59, 1,  16,  30,
      12, 7,  121, 30,    12, 26, 47,  28,    39, 14, 24,  30,    22, 41, 15,  30,
      6,  14, 121, 30,    6,  34, 47,  28,    46, 10, 24,  30,    2,  64, 15,  30,
      17, 4,  122, 30,    29, 14, 46,  28,    49, 10, 24,  30,    24, 46, 15,  30,
      4,  18, 122, 30,    13, 32, 46,  28,    48, 14, 24,  30,    42, 32, 15,  30,
      20, 4,  117, 30,    40, 7,  47,  28,    43, 22, 24,  30,    10, 67, 15,  30,
      19, 6,  118, 30,    18, 31, 47,  28,    34, 34, 24,  30,    20, 61, 15,  30
    ],

    /**
     * The final format bits with mask (level << 3 | mask).
     *
     * @public
     * @static
     * @type {number[]}
     * @memberof ErrorCorrection
     */
    FINAL_FORMAT: [
      // L
      0x77c4, 0x72f3, 0x7daa, 0x789d, 0x662f, 0x6318, 0x6c41, 0x6976,
      // M
      0x5412, 0x5125, 0x5e7c, 0x5b4b, 0x45f9, 0x40ce, 0x4f97, 0x4aa0,
      // Q
      0x355f, 0x3068, 0x3f31, 0x3a06, 0x24b4, 0x2183, 0x2eda, 0x2bed,
      // H
      0x1689, 0x13be, 0x1ce7, 0x19d0, 0x0762, 0x0255, 0x0d0c, 0x083b
    ],

    /**
     * A map of human-readable ECC levels.
     *
     * @public
     * @static
     * @type {Object.<string, number>}
     * @memberof ErrorCorrection
     */
    LEVELS: {
      L: 1,
      M: 2,
      Q: 3,
      H: 4
    }

  });

  var ErrorCorrection_1 = ErrorCorrection;

  /**
   * Contains Galois field information.
   *
   * @public
   * @class
   * @extends Nevis
   */
  var Galois = lite.extend(null, {

    /**
     * The Galois field exponent table.
     *
     * @public
     * @static
     * @type {number[]}
     * @memberof Galois
     */
    EXPONENT: [
      0x01, 0x02, 0x04, 0x08, 0x10, 0x20, 0x40, 0x80, 0x1d, 0x3a, 0x74, 0xe8, 0xcd, 0x87, 0x13, 0x26,
      0x4c, 0x98, 0x2d, 0x5a, 0xb4, 0x75, 0xea, 0xc9, 0x8f, 0x03, 0x06, 0x0c, 0x18, 0x30, 0x60, 0xc0,
      0x9d, 0x27, 0x4e, 0x9c, 0x25, 0x4a, 0x94, 0x35, 0x6a, 0xd4, 0xb5, 0x77, 0xee, 0xc1, 0x9f, 0x23,
      0x46, 0x8c, 0x05, 0x0a, 0x14, 0x28, 0x50, 0xa0, 0x5d, 0xba, 0x69, 0xd2, 0xb9, 0x6f, 0xde, 0xa1,
      0x5f, 0xbe, 0x61, 0xc2, 0x99, 0x2f, 0x5e, 0xbc, 0x65, 0xca, 0x89, 0x0f, 0x1e, 0x3c, 0x78, 0xf0,
      0xfd, 0xe7, 0xd3, 0xbb, 0x6b, 0xd6, 0xb1, 0x7f, 0xfe, 0xe1, 0xdf, 0xa3, 0x5b, 0xb6, 0x71, 0xe2,
      0xd9, 0xaf, 0x43, 0x86, 0x11, 0x22, 0x44, 0x88, 0x0d, 0x1a, 0x34, 0x68, 0xd0, 0xbd, 0x67, 0xce,
      0x81, 0x1f, 0x3e, 0x7c, 0xf8, 0xed, 0xc7, 0x93, 0x3b, 0x76, 0xec, 0xc5, 0x97, 0x33, 0x66, 0xcc,
      0x85, 0x17, 0x2e, 0x5c, 0xb8, 0x6d, 0xda, 0xa9, 0x4f, 0x9e, 0x21, 0x42, 0x84, 0x15, 0x2a, 0x54,
      0xa8, 0x4d, 0x9a, 0x29, 0x52, 0xa4, 0x55, 0xaa, 0x49, 0x92, 0x39, 0x72, 0xe4, 0xd5, 0xb7, 0x73,
      0xe6, 0xd1, 0xbf, 0x63, 0xc6, 0x91, 0x3f, 0x7e, 0xfc, 0xe5, 0xd7, 0xb3, 0x7b, 0xf6, 0xf1, 0xff,
      0xe3, 0xdb, 0xab, 0x4b, 0x96, 0x31, 0x62, 0xc4, 0x95, 0x37, 0x6e, 0xdc, 0xa5, 0x57, 0xae, 0x41,
      0x82, 0x19, 0x32, 0x64, 0xc8, 0x8d, 0x07, 0x0e, 0x1c, 0x38, 0x70, 0xe0, 0xdd, 0xa7, 0x53, 0xa6,
      0x51, 0xa2, 0x59, 0xb2, 0x79, 0xf2, 0xf9, 0xef, 0xc3, 0x9b, 0x2b, 0x56, 0xac, 0x45, 0x8a, 0x09,
      0x12, 0x24, 0x48, 0x90, 0x3d, 0x7a, 0xf4, 0xf5, 0xf7, 0xf3, 0xfb, 0xeb, 0xcb, 0x8b, 0x0b, 0x16,
      0x2c, 0x58, 0xb0, 0x7d, 0xfa, 0xe9, 0xcf, 0x83, 0x1b, 0x36, 0x6c, 0xd8, 0xad, 0x47, 0x8e, 0x00
    ],

    /**
     * The Galois field log table.
     *
     * @public
     * @static
     * @type {number[]}
     * @memberof Galois
     */
    LOG: [
      0xff, 0x00, 0x01, 0x19, 0x02, 0x32, 0x1a, 0xc6, 0x03, 0xdf, 0x33, 0xee, 0x1b, 0x68, 0xc7, 0x4b,
      0x04, 0x64, 0xe0, 0x0e, 0x34, 0x8d, 0xef, 0x81, 0x1c, 0xc1, 0x69, 0xf8, 0xc8, 0x08, 0x4c, 0x71,
      0x05, 0x8a, 0x65, 0x2f, 0xe1, 0x24, 0x0f, 0x21, 0x35, 0x93, 0x8e, 0xda, 0xf0, 0x12, 0x82, 0x45,
      0x1d, 0xb5, 0xc2, 0x7d, 0x6a, 0x27, 0xf9, 0xb9, 0xc9, 0x9a, 0x09, 0x78, 0x4d, 0xe4, 0x72, 0xa6,
      0x06, 0xbf, 0x8b, 0x62, 0x66, 0xdd, 0x30, 0xfd, 0xe2, 0x98, 0x25, 0xb3, 0x10, 0x91, 0x22, 0x88,
      0x36, 0xd0, 0x94, 0xce, 0x8f, 0x96, 0xdb, 0xbd, 0xf1, 0xd2, 0x13, 0x5c, 0x83, 0x38, 0x46, 0x40,
      0x1e, 0x42, 0xb6, 0xa3, 0xc3, 0x48, 0x7e, 0x6e, 0x6b, 0x3a, 0x28, 0x54, 0xfa, 0x85, 0xba, 0x3d,
      0xca, 0x5e, 0x9b, 0x9f, 0x0a, 0x15, 0x79, 0x2b, 0x4e, 0xd4, 0xe5, 0xac, 0x73, 0xf3, 0xa7, 0x57,
      0x07, 0x70, 0xc0, 0xf7, 0x8c, 0x80, 0x63, 0x0d, 0x67, 0x4a, 0xde, 0xed, 0x31, 0xc5, 0xfe, 0x18,
      0xe3, 0xa5, 0x99, 0x77, 0x26, 0xb8, 0xb4, 0x7c, 0x11, 0x44, 0x92, 0xd9, 0x23, 0x20, 0x89, 0x2e,
      0x37, 0x3f, 0xd1, 0x5b, 0x95, 0xbc, 0xcf, 0xcd, 0x90, 0x87, 0x97, 0xb2, 0xdc, 0xfc, 0xbe, 0x61,
      0xf2, 0x56, 0xd3, 0xab, 0x14, 0x2a, 0x5d, 0x9e, 0x84, 0x3c, 0x39, 0x53, 0x47, 0x6d, 0x41, 0xa2,
      0x1f, 0x2d, 0x43, 0xd8, 0xb7, 0x7b, 0xa4, 0x76, 0xc4, 0x17, 0x49, 0xec, 0x7f, 0x0c, 0x6f, 0xf6,
      0x6c, 0xa1, 0x3b, 0x52, 0x29, 0x9d, 0x55, 0xaa, 0xfb, 0x60, 0x86, 0xb1, 0xbb, 0xcc, 0x3e, 0x5a,
      0xcb, 0x59, 0x5f, 0xb0, 0x9c, 0xa9, 0xa0, 0x51, 0x0b, 0xf5, 0x16, 0xeb, 0x7a, 0x75, 0x2c, 0xd7,
      0x4f, 0xae, 0xd5, 0xe9, 0xe6, 0xe7, 0xad, 0xe8, 0x74, 0xd6, 0xf4, 0xea, 0xa8, 0x50, 0x58, 0xaf
    ]

  });

  var Galois_1 = Galois;

  /**
   * Contains version pattern information.
   *
   * @public
   * @class
   * @extends Nevis
   */
  var Version = lite.extend(null, {

    /**
     * The version pattern block.
     *
     * @public
     * @static
     * @type {number[]}
     * @memberof Version
     */
    BLOCK: [
      0xc94, 0x5bc, 0xa99, 0x4d3, 0xbf6, 0x762, 0x847, 0x60d, 0x928, 0xb78, 0x45d, 0xa17, 0x532,
      0x9a6, 0x683, 0x8c9, 0x7ec, 0xec4, 0x1e1, 0xfab, 0x08e, 0xc1a, 0x33f, 0xd75, 0x250, 0x9d5,
      0x6f0, 0x8ba, 0x79f, 0xb0b, 0x42e, 0xa64, 0x541, 0xc69
    ]

  });

  var Version_1 = Version;

  /**
   * Generates information for a QR code frame based on a specific value to be encoded.
   *
   * @param {Frame~Options} options - the options to be used
   * @public
   * @class
   * @extends Nevis
   */
  var Frame = lite.extend(function(options) {
    var dataBlock, eccBlock, index, neccBlock1, neccBlock2;
    var valueLength = options.value.length;

    this._badness = [];
    this._level = ErrorCorrection_1.LEVELS[options.level];
    this._polynomial = [];
    this._value = options.value;
    this._version = 0;
    this._stringBuffer = [];

    while (this._version < 40) {
      this._version++;

      index = ((this._level - 1) * 4) + ((this._version - 1) * 16);

      neccBlock1 = ErrorCorrection_1.BLOCKS[index++];
      neccBlock2 = ErrorCorrection_1.BLOCKS[index++];
      dataBlock = ErrorCorrection_1.BLOCKS[index++];
      eccBlock = ErrorCorrection_1.BLOCKS[index];

      index = (dataBlock * (neccBlock1 + neccBlock2)) + neccBlock2 - 3 + (this._version <= 9);

      if (valueLength <= index) {
        break;
      }
    }

    this._dataBlock = dataBlock;
    this._eccBlock = eccBlock;
    this._neccBlock1 = neccBlock1;
    this._neccBlock2 = neccBlock2;

    /**
     * The data width is based on version.
     *
     * @public
     * @type {number}
     * @memberof Frame#
     */
    // FIXME: Ensure that it fits instead of being truncated.
    var width = this.width = 17 + (4 * this._version);

    /**
     * The image buffer.
     *
     * @public
     * @type {number[]}
     * @memberof Frame#
     */
    this.buffer = Frame._createArray(width * width);

    this._ecc = Frame._createArray(dataBlock + ((dataBlock + eccBlock) * (neccBlock1 + neccBlock2)) + neccBlock2);
    this._mask = Frame._createArray(((width * (width + 1)) + 1) / 2);

    this._insertFinders();
    this._insertAlignments();

    // Insert single foreground cell.
    this.buffer[8 + (width * (width - 8))] = 1;

    this._insertTimingGap();
    this._reverseMask();
    this._insertTimingRowAndColumn();
    this._insertVersion();
    this._syncMask();
    this._convertBitStream(valueLength);
    this._calculatePolynomial();
    this._appendEccToData();
    this._interleaveBlocks();
    this._pack();
    this._finish();
  }, {

    _addAlignment: function(x, y) {
      var i;
      var buffer = this.buffer;
      var width = this.width;

      buffer[x + (width * y)] = 1;

      for (i = -2; i < 2; i++) {
        buffer[x + i + (width * (y - 2))] = 1;
        buffer[x - 2 + (width * (y + i + 1))] = 1;
        buffer[x + 2 + (width * (y + i))] = 1;
        buffer[x + i + 1 + (width * (y + 2))] = 1;
      }

      for (i = 0; i < 2; i++) {
        this._setMask(x - 1, y + i);
        this._setMask(x + 1, y - i);
        this._setMask(x - i, y - 1);
        this._setMask(x + i, y + 1);
      }
    },

    _appendData: function(data, dataLength, ecc, eccLength) {
      var bit, i, j;
      var polynomial = this._polynomial;
      var stringBuffer = this._stringBuffer;

      for (i = 0; i < eccLength; i++) {
        stringBuffer[ecc + i] = 0;
      }

      for (i = 0; i < dataLength; i++) {
        bit = Galois_1.LOG[stringBuffer[data + i] ^ stringBuffer[ecc]];

        if (bit !== 255) {
          for (j = 1; j < eccLength; j++) {
            stringBuffer[ecc + j - 1] = stringBuffer[ecc + j] ^
              Galois_1.EXPONENT[Frame._modN(bit + polynomial[eccLength - j])];
          }
        } else {
          for (j = ecc; j < ecc + eccLength; j++) {
            stringBuffer[j] = stringBuffer[j + 1];
          }
        }

        stringBuffer[ecc + eccLength - 1] = bit === 255 ? 0 : Galois_1.EXPONENT[Frame._modN(bit + polynomial[0])];
      }
    },

    _appendEccToData: function() {
      var i;
      var data = 0;
      var dataBlock = this._dataBlock;
      var ecc = this._calculateMaxLength();
      var eccBlock = this._eccBlock;

      for (i = 0; i < this._neccBlock1; i++) {
        this._appendData(data, dataBlock, ecc, eccBlock);

        data += dataBlock;
        ecc += eccBlock;
      }

      for (i = 0; i < this._neccBlock2; i++) {
        this._appendData(data, dataBlock + 1, ecc, eccBlock);

        data += dataBlock + 1;
        ecc += eccBlock;
      }
    },

    _applyMask: function(mask) {
      var r3x, r3y, x, y;
      var buffer = this.buffer;
      var width = this.width;

      switch (mask) {
      case 0:
        for (y = 0; y < width; y++) {
          for (x = 0; x < width; x++) {
            if (!((x + y) & 1) && !this._isMasked(x, y)) {
              buffer[x + (y * width)] ^= 1;
            }
          }
        }

        break;
      case 1:
        for (y = 0; y < width; y++) {
          for (x = 0; x < width; x++) {
            if (!(y & 1) && !this._isMasked(x, y)) {
              buffer[x + (y * width)] ^= 1;
            }
          }
        }

        break;
      case 2:
        for (y = 0; y < width; y++) {
          for (r3x = 0, x = 0; x < width; x++, r3x++) {
            if (r3x === 3) {
              r3x = 0;
            }

            if (!r3x && !this._isMasked(x, y)) {
              buffer[x + (y * width)] ^= 1;
            }
          }
        }

        break;
      case 3:
        for (r3y = 0, y = 0; y < width; y++, r3y++) {
          if (r3y === 3) {
            r3y = 0;
          }

          for (r3x = r3y, x = 0; x < width; x++, r3x++) {
            if (r3x === 3) {
              r3x = 0;
            }

            if (!r3x && !this._isMasked(x, y)) {
              buffer[x + (y * width)] ^= 1;
            }
          }
        }

        break;
      case 4:
        for (y = 0; y < width; y++) {
          for (r3x = 0, r3y = (y >> 1) & 1, x = 0; x < width; x++, r3x++) {
            if (r3x === 3) {
              r3x = 0;
              r3y = !r3y;
            }

            if (!r3y && !this._isMasked(x, y)) {
              buffer[x + (y * width)] ^= 1;
            }
          }
        }

        break;
      case 5:
        for (r3y = 0, y = 0; y < width; y++, r3y++) {
          if (r3y === 3) {
            r3y = 0;
          }

          for (r3x = 0, x = 0; x < width; x++, r3x++) {
            if (r3x === 3) {
              r3x = 0;
            }

            if (!((x & y & 1) + !(!r3x | !r3y)) && !this._isMasked(x, y)) {
              buffer[x + (y * width)] ^= 1;
            }
          }
        }

        break;
      case 6:
        for (r3y = 0, y = 0; y < width; y++, r3y++) {
          if (r3y === 3) {
            r3y = 0;
          }

          for (r3x = 0, x = 0; x < width; x++, r3x++) {
            if (r3x === 3) {
              r3x = 0;
            }

            if (!((x & y & 1) + (r3x && r3x === r3y) & 1) && !this._isMasked(x, y)) {
              buffer[x + (y * width)] ^= 1;
            }
          }
        }

        break;
      case 7:
        for (r3y = 0, y = 0; y < width; y++, r3y++) {
          if (r3y === 3) {
            r3y = 0;
          }

          for (r3x = 0, x = 0; x < width; x++, r3x++) {
            if (r3x === 3) {
              r3x = 0;
            }

            if (!((r3x && r3x === r3y) + (x + y & 1) & 1) && !this._isMasked(x, y)) {
              buffer[x + (y * width)] ^= 1;
            }
          }
        }

        break;
      }
    },

    _calculateMaxLength: function() {
      return (this._dataBlock * (this._neccBlock1 + this._neccBlock2)) + this._neccBlock2;
    },

    _calculatePolynomial: function() {
      var i, j;
      var eccBlock = this._eccBlock;
      var polynomial = this._polynomial;

      polynomial[0] = 1;

      for (i = 0; i < eccBlock; i++) {
        polynomial[i + 1] = 1;

        for (j = i; j > 0; j--) {
          polynomial[j] = polynomial[j] ? polynomial[j - 1] ^
            Galois_1.EXPONENT[Frame._modN(Galois_1.LOG[polynomial[j]] + i)] : polynomial[j - 1];
        }

        polynomial[0] = Galois_1.EXPONENT[Frame._modN(Galois_1.LOG[polynomial[0]] + i)];
      }

      // Use logs for generator polynomial to save calculation step.
      for (i = 0; i <= eccBlock; i++) {
        polynomial[i] = Galois_1.LOG[polynomial[i]];
      }
    },

    _checkBadness: function() {
      var b, b1, h, x, y;
      var bad = 0;
      var badness = this._badness;
      var buffer = this.buffer;
      var width = this.width;

      // Blocks of same colour.
      for (y = 0; y < width - 1; y++) {
        for (x = 0; x < width - 1; x++) {
          // All foreground colour.
          if ((buffer[x + (width * y)] &&
            buffer[x + 1 + (width * y)] &&
            buffer[x + (width * (y + 1))] &&
            buffer[x + 1 + (width * (y + 1))]) ||
            // All background colour.
            !(buffer[x + (width * y)] ||
            buffer[x + 1 + (width * y)] ||
            buffer[x + (width * (y + 1))] ||
            buffer[x + 1 + (width * (y + 1))])) {
            bad += Frame.N2;
          }
        }
      }

      var bw = 0;

      // X runs.
      for (y = 0; y < width; y++) {
        h = 0;

        badness[0] = 0;

        for (b = 0, x = 0; x < width; x++) {
          b1 = buffer[x + (width * y)];

          if (b === b1) {
            badness[h]++;
          } else {
            badness[++h] = 1;
          }

          b = b1;
          bw += b ? 1 : -1;
        }

        bad += this._getBadness(h);
      }

      if (bw < 0) {
        bw = -bw;
      }

      var count = 0;
      var big = bw;
      big += big << 2;
      big <<= 1;

      while (big > width * width) {
        big -= width * width;
        count++;
      }

      bad += count * Frame.N4;

      // Y runs.
      for (x = 0; x < width; x++) {
        h = 0;

        badness[0] = 0;

        for (b = 0, y = 0; y < width; y++) {
          b1 = buffer[x + (width * y)];

          if (b === b1) {
            badness[h]++;
          } else {
            badness[++h] = 1;
          }

          b = b1;
        }

        bad += this._getBadness(h);
      }

      return bad;
    },

    _convertBitStream: function(length) {
      var bit, i;
      var ecc = this._ecc;
      var version = this._version;

      // Convert string to bit stream. 8-bit data to QR-coded 8-bit data (numeric, alphanumeric, or kanji not supported).
      for (i = 0; i < length; i++) {
        ecc[i] = this._value.charCodeAt(i);
      }

      var stringBuffer = this._stringBuffer = ecc.slice();
      var maxLength = this._calculateMaxLength();

      if (length >= maxLength - 2) {
        length = maxLength - 2;

        if (version > 9) {
          length--;
        }
      }

      // Shift and re-pack to insert length prefix.
      var index = length;

      if (version > 9) {
        stringBuffer[index + 2] = 0;
        stringBuffer[index + 3] = 0;

        while (index--) {
          bit = stringBuffer[index];

          stringBuffer[index + 3] |= 255 & (bit << 4);
          stringBuffer[index + 2] = bit >> 4;
        }

        stringBuffer[2] |= 255 & (length << 4);
        stringBuffer[1] = length >> 4;
        stringBuffer[0] = 0x40 | (length >> 12);
      } else {
        stringBuffer[index + 1] = 0;
        stringBuffer[index + 2] = 0;

        while (index--) {
          bit = stringBuffer[index];

          stringBuffer[index + 2] |= 255 & (bit << 4);
          stringBuffer[index + 1] = bit >> 4;
        }

        stringBuffer[1] |= 255 & (length << 4);
        stringBuffer[0] = 0x40 | (length >> 4);
      }

      // Fill to end with pad pattern.
      index = length + 3 - (version < 10);

      while (index < maxLength) {
        stringBuffer[index++] = 0xec;
        stringBuffer[index++] = 0x11;
      }
    },

    _getBadness: function(length) {
      var i;
      var badRuns = 0;
      var badness = this._badness;

      for (i = 0; i <= length; i++) {
        if (badness[i] >= 5) {
          badRuns += Frame.N1 + badness[i] - 5;
        }
      }

      // FBFFFBF as in finder.
      for (i = 3; i < length - 1; i += 2) {
        if (badness[i - 2] === badness[i + 2] &&
          badness[i + 2] === badness[i - 1] &&
          badness[i - 1] === badness[i + 1] &&
          badness[i - 1] * 3 === badness[i] &&
          // Background around the foreground pattern? Not part of the specs.
          (badness[i - 3] === 0 || i + 3 > length ||
          badness[i - 3] * 3 >= badness[i] * 4 ||
          badness[i + 3] * 3 >= badness[i] * 4)) {
          badRuns += Frame.N3;
        }
      }

      return badRuns;
    },

    _finish: function() {
      // Save pre-mask copy of frame.
      this._stringBuffer = this.buffer.slice();

      var currentMask, i;
      var bit = 0;
      var mask = 30000;

      /*
       * Using for instead of while since in original Arduino code if an early mask was "good enough" it wouldn't try for
       * a better one since they get more complex and take longer.
       */
      for (i = 0; i < 8; i++) {
        // Returns foreground-background imbalance.
        this._applyMask(i);

        currentMask = this._checkBadness();

        // Is current mask better than previous best?
        if (currentMask < mask) {
          mask = currentMask;
          bit = i;
        }

        // Don't increment "i" to a void redoing mask.
        if (bit === 7) {
          break;
        }

        // Reset for next pass.
        this.buffer = this._stringBuffer.slice();
      }

      // Redo best mask as none were "good enough" (i.e. last wasn't bit).
      if (bit !== i) {
        this._applyMask(bit);
      }

      // Add in final mask/ECC level bytes.
      mask = ErrorCorrection_1.FINAL_FORMAT[bit + (this._level - 1 << 3)];

      var buffer = this.buffer;
      var width = this.width;

      // Low byte.
      for (i = 0; i < 8; i++, mask >>= 1) {
        if (mask & 1) {
          buffer[width - 1 - i + (width * 8)] = 1;

          if (i < 6) {
            buffer[8 + (width * i)] = 1;
          } else {
            buffer[8 + (width * (i + 1))] = 1;
          }
        }
      }

      // High byte.
      for (i = 0; i < 7; i++, mask >>= 1) {
        if (mask & 1) {
          buffer[8 + (width * (width - 7 + i))] = 1;

          if (i) {
            buffer[6 - i + (width * 8)] = 1;
          } else {
            buffer[7 + (width * 8)] = 1;
          }
        }
      }
    },

    _interleaveBlocks: function() {
      var i, j;
      var dataBlock = this._dataBlock;
      var ecc = this._ecc;
      var eccBlock = this._eccBlock;
      var k = 0;
      var maxLength = this._calculateMaxLength();
      var neccBlock1 = this._neccBlock1;
      var neccBlock2 = this._neccBlock2;
      var stringBuffer = this._stringBuffer;

      for (i = 0; i < dataBlock; i++) {
        for (j = 0; j < neccBlock1; j++) {
          ecc[k++] = stringBuffer[i + (j * dataBlock)];
        }

        for (j = 0; j < neccBlock2; j++) {
          ecc[k++] = stringBuffer[(neccBlock1 * dataBlock) + i + (j * (dataBlock + 1))];
        }
      }

      for (j = 0; j < neccBlock2; j++) {
        ecc[k++] = stringBuffer[(neccBlock1 * dataBlock) + i + (j * (dataBlock + 1))];
      }

      for (i = 0; i < eccBlock; i++) {
        for (j = 0; j < neccBlock1 + neccBlock2; j++) {
          ecc[k++] = stringBuffer[maxLength + i + (j * eccBlock)];
        }
      }

      this._stringBuffer = ecc;
    },

    _insertAlignments: function() {
      var i, x, y;
      var version = this._version;
      var width = this.width;

      if (version > 1) {
        i = Alignment_1.BLOCK[version];
        y = width - 7;

        for (;;) {
          x = width - 7;

          while (x > i - 3) {
            this._addAlignment(x, y);

            if (x < i) {
              break;
            }

            x -= i;
          }

          if (y <= i + 9) {
            break;
          }

          y -= i;

          this._addAlignment(6, y);
          this._addAlignment(y, 6);
        }
      }
    },

    _insertFinders: function() {
      var i, j, x, y;
      var buffer = this.buffer;
      var width = this.width;

      for (i = 0; i < 3; i++) {
        j = 0;
        y = 0;

        if (i === 1) {
          j = width - 7;
        }
        if (i === 2) {
          y = width - 7;
        }

        buffer[y + 3 + (width * (j + 3))] = 1;

        for (x = 0; x < 6; x++) {
          buffer[y + x + (width * j)] = 1;
          buffer[y + (width * (j + x + 1))] = 1;
          buffer[y + 6 + (width * (j + x))] = 1;
          buffer[y + x + 1 + (width * (j + 6))] = 1;
        }

        for (x = 1; x < 5; x++) {
          this._setMask(y + x, j + 1);
          this._setMask(y + 1, j + x + 1);
          this._setMask(y + 5, j + x);
          this._setMask(y + x + 1, j + 5);
        }

        for (x = 2; x < 4; x++) {
          buffer[y + x + (width * (j + 2))] = 1;
          buffer[y + 2 + (width * (j + x + 1))] = 1;
          buffer[y + 4 + (width * (j + x))] = 1;
          buffer[y + x + 1 + (width * (j + 4))] = 1;
        }
      }
    },

    _insertTimingGap: function() {
      var x, y;
      var width = this.width;

      for (y = 0; y < 7; y++) {
        this._setMask(7, y);
        this._setMask(width - 8, y);
        this._setMask(7, y + width - 7);
      }

      for (x = 0; x < 8; x++) {
        this._setMask(x, 7);
        this._setMask(x + width - 8, 7);
        this._setMask(x, width - 8);
      }
    },

    _insertTimingRowAndColumn: function() {
      var x;
      var buffer = this.buffer;
      var width = this.width;

      for (x = 0; x < width - 14; x++) {
        if (x & 1) {
          this._setMask(8 + x, 6);
          this._setMask(6, 8 + x);
        } else {
          buffer[8 + x + (width * 6)] = 1;
          buffer[6 + (width * (8 + x))] = 1;
        }
      }
    },

    _insertVersion: function() {
      var i, j, x, y;
      var buffer = this.buffer;
      var version = this._version;
      var width = this.width;

      if (version > 6) {
        i = Version_1.BLOCK[version - 7];
        j = 17;

        for (x = 0; x < 6; x++) {
          for (y = 0; y < 3; y++, j--) {
            if (1 & (j > 11 ? version >> j - 12 : i >> j)) {
              buffer[5 - x + (width * (2 - y + width - 11))] = 1;
              buffer[2 - y + width - 11 + (width * (5 - x))] = 1;
            } else {
              this._setMask(5 - x, 2 - y + width - 11);
              this._setMask(2 - y + width - 11, 5 - x);
            }
          }
        }
      }
    },

    _isMasked: function(x, y) {
      var bit = Frame._getMaskBit(x, y);

      return this._mask[bit] === 1;
    },

    _pack: function() {
      var bit, i, j;
      var k = 1;
      var v = 1;
      var width = this.width;
      var x = width - 1;
      var y = width - 1;

      // Interleaved data and ECC codes.
      var length = ((this._dataBlock + this._eccBlock) * (this._neccBlock1 + this._neccBlock2)) + this._neccBlock2;

      for (i = 0; i < length; i++) {
        bit = this._stringBuffer[i];

        for (j = 0; j < 8; j++, bit <<= 1) {
          if (0x80 & bit) {
            this.buffer[x + (width * y)] = 1;
          }

          // Find next fill position.
          do {
            if (v) {
              x--;
            } else {
              x++;

              if (k) {
                if (y !== 0) {
                  y--;
                } else {
                  x -= 2;
                  k = !k;

                  if (x === 6) {
                    x--;
                    y = 9;
                  }
                }
              } else if (y !== width - 1) {
                y++;
              } else {
                x -= 2;
                k = !k;

                if (x === 6) {
                  x--;
                  y -= 8;
                }
              }
            }

            v = !v;
          } while (this._isMasked(x, y));
        }
      }
    },

    _reverseMask: function() {
      var x, y;
      var width = this.width;

      for (x = 0; x < 9; x++) {
        this._setMask(x, 8);
      }

      for (x = 0; x < 8; x++) {
        this._setMask(x + width - 8, 8);
        this._setMask(8, x);
      }

      for (y = 0; y < 7; y++) {
        this._setMask(8, y + width - 7);
      }
    },

    _setMask: function(x, y) {
      var bit = Frame._getMaskBit(x, y);

      this._mask[bit] = 1;
    },

    _syncMask: function() {
      var x, y;
      var width = this.width;

      for (y = 0; y < width; y++) {
        for (x = 0; x <= y; x++) {
          if (this.buffer[x + (width * y)]) {
            this._setMask(x, y);
          }
        }
      }
    }

  }, {

    _createArray: function(length) {
      var i;
      var array = [];

      for (i = 0; i < length; i++) {
        array[i] = 0;
      }

      return array;
    },

    _getMaskBit: function(x, y) {
      var bit;

      if (x > y) {
        bit = x;
        x = y;
        y = bit;
      }

      bit = y;
      bit += y * y;
      bit >>= 1;
      bit += x;

      return bit;
    },

    _modN: function(x) {
      while (x >= 255) {
        x -= 255;
        x = (x >> 8) + (x & 255);
      }

      return x;
    },

    // *Badness* coefficients.
    N1: 3,
    N2: 3,
    N3: 40,
    N4: 10

  });

  var Frame_1 = Frame;

  /**
   * The options used by {@link Frame}.
   *
   * @typedef {Object} Frame~Options
   * @property {string} level - The ECC level to be used.
   * @property {string} value - The value to be encoded.
   */

  /**
   * An implementation of {@link Renderer} for working with <code>img</code> elements.
   *
   * This depends on {@link CanvasRenderer} being executed first as this implementation simply applies the data URL from
   * the rendered <code>canvas</code> element as the <code>src</code> for the <code>img</code> element being rendered.
   *
   * @public
   * @class
   * @extends Renderer
   */
  var ImageRenderer = Renderer_1.extend({

    /**
     * @override
     */
    draw: function() {
      this.element.src = this.qrious.toDataURL();
    },

    /**
     * @override
     */
    reset: function() {
      this.element.src = '';
    },

    /**
     * @override
     */
    resize: function() {
      var element = this.element;

      element.width = element.height = this.qrious.size;
    }

  });

  var ImageRenderer_1 = ImageRenderer;

  /**
   * Defines an available option while also configuring how values are applied to the target object.
   *
   * Optionally, a default value can be specified as well a value transformer for greater control over how the option
   * value is applied.
   *
   * If no value transformer is specified, then any specified option will be applied directly. All values are maintained
   * on the target object itself as a field using the option name prefixed with a single underscore.
   *
   * When an option is specified as modifiable, the {@link OptionManager} will be required to include a setter for the
   * property that is defined on the target object that uses the option name.
   *
   * @param {string} name - the name to be used
   * @param {boolean} [modifiable] - <code>true</code> if the property defined on target objects should include a setter;
   * otherwise <code>false</code>
   * @param {*} [defaultValue] - the default value to be used
   * @param {Option~ValueTransformer} [valueTransformer] - the value transformer to be used
   * @public
   * @class
   * @extends Nevis
   */
  var Option = lite.extend(function(name, modifiable, defaultValue, valueTransformer) {
    /**
     * The name for this {@link Option}.
     *
     * @public
     * @type {string}
     * @memberof Option#
     */
    this.name = name;

    /**
     * Whether a setter should be included on the property defined on target objects for this {@link Option}.
     *
     * @public
     * @type {boolean}
     * @memberof Option#
     */
    this.modifiable = Boolean(modifiable);

    /**
     * The default value for this {@link Option}.
     *
     * @public
     * @type {*}
     * @memberof Option#
     */
    this.defaultValue = defaultValue;

    this._valueTransformer = valueTransformer;
  }, {

    /**
     * Transforms the specified <code>value</code> so that it can be applied for this {@link Option}.
     *
     * If a value transformer has been specified for this {@link Option}, it will be called upon to transform
     * <code>value</code>. Otherwise, <code>value</code> will be returned directly.
     *
     * @param {*} value - the value to be transformed
     * @return {*} The transformed value or <code>value</code> if no value transformer is specified.
     * @public
     * @memberof Option#
     */
    transform: function(value) {
      var transformer = this._valueTransformer;
      if (typeof transformer === 'function') {
        return transformer(value, this);
      }

      return value;
    }

  });

  var Option_1 = Option;

  /**
   * Returns a transformed value for the specified <code>value</code> to be applied for the <code>option</code> provided.
   *
   * @callback Option~ValueTransformer
   * @param {*} value - the value to be transformed
   * @param {Option} option - the {@link Option} for which <code>value</code> is being transformed
   * @return {*} The transform value.
   */

  /**
   * Contains utility methods that are useful throughout the library.
   *
   * @public
   * @class
   * @extends Nevis
   */
  var Utilities = lite.extend(null, {

    /**
     * Returns the absolute value of a given number.
     *
     * This method is simply a convenient shorthand for <code>Math.abs</code> while ensuring that nulls are returned as
     * <code>null</code> instead of zero.
     *
     * @param {number} value - the number whose absolute value is to be returned
     * @return {number} The absolute value of <code>value</code> or <code>null</code> if <code>value</code> is
     * <code>null</code>.
     * @public
     * @static
     * @memberof Utilities
     */
    abs: function(value) {
      return value != null ? Math.abs(value) : null;
    },

    /**
     * Returns whether the specified <code>object</code> has a property with the specified <code>name</code> as an own
     * (not inherited) property.
     *
     * @param {Object} object - the object on which the property is to be checked
     * @param {string} name - the name of the property to be checked
     * @return {boolean} <code>true</code> if <code>object</code> has an own property with <code>name</code>.
     * @public
     * @static
     * @memberof Utilities
     */
    hasOwn: function(object, name) {
      return Object.prototype.hasOwnProperty.call(object, name);
    },

    /**
     * A non-operation method that does absolutely nothing.
     *
     * @return {void}
     * @public
     * @static
     * @memberof Utilities
     */
    noop: function() {},

    /**
     * Transforms the specified <code>string</code> to upper case while remaining null-safe.
     *
     * @param {string} string - the string to be transformed to upper case
     * @return {string} <code>string</code> transformed to upper case if <code>string</code> is not <code>null</code>.
     * @public
     * @static
     * @memberof Utilities
     */
    toUpperCase: function(string) {
      return string != null ? string.toUpperCase() : null;
    }

  });

  var Utilities_1 = Utilities;

  /**
   * Manages multiple {@link Option} instances that are intended to be used by multiple implementations.
   *
   * Although the option definitions are shared between targets, the values are maintained on the targets themselves.
   *
   * @param {Option[]} options - the options to be used
   * @public
   * @class
   * @extends Nevis
   */
  var OptionManager = lite.extend(function(options) {
    /**
     * The available options for this {@link OptionManager}.
     *
     * @public
     * @type {Object.<string, Option>}
     * @memberof OptionManager#
     */
    this.options = {};

    options.forEach(function(option) {
      this.options[option.name] = option;
    }, this);
  }, {

    /**
     * Returns whether an option with the specified <code>name</code> is available.
     *
     * @param {string} name - the name of the {@link Option} whose existence is to be checked
     * @return {boolean} <code>true</code> if an {@link Option} exists with <code>name</code>; otherwise
     * <code>false</code>.
     * @public
     * @memberof OptionManager#
     */
    exists: function(name) {
      return this.options[name] != null;
    },

    /**
     * Returns the value of the option with the specified <code>name</code> on the <code>target</code> object provided.
     *
     * @param {string} name - the name of the {@link Option} whose value on <code>target</code> is to be returned
     * @param {Object} target - the object from which the value of the named {@link Option} is to be returned
     * @return {*} The value of the {@link Option} with <code>name</code> on <code>target</code>.
     * @public
     * @memberof OptionManager#
     */
    get: function(name, target) {
      return OptionManager._get(this.options[name], target);
    },

    /**
     * Returns a copy of all of the available options on the <code>target</code> object provided.
     *
     * @param {Object} target - the object from which the option name/value pairs are to be returned
     * @return {Object.<string, *>} A hash containing the name/value pairs of all options on <code>target</code>.
     * @public
     * @memberof OptionManager#
     */
    getAll: function(target) {
      var name;
      var options = this.options;
      var result = {};

      for (name in options) {
        if (Utilities_1.hasOwn(options, name)) {
          result[name] = OptionManager._get(options[name], target);
        }
      }

      return result;
    },

    /**
     * Initializes the available options for the <code>target</code> object provided and then applies the initial values
     * within the speciifed <code>options</code>.
     *
     * This method will throw an error if any of the names within <code>options</code> does not match an available option.
     *
     * This involves setting the default values and defining properties for all of the available options on
     * <code>target</code> before finally calling {@link OptionMananger#setAll} with <code>options</code> and
     * <code>target</code>. Any options that are configured to be modifiable will have a setter included in their defined
     * property that will allow its corresponding value to be modified.
     *
     * If a change handler is specified, it will be called whenever the value changes on <code>target</code> for a
     * modifiable option, but only when done so via the defined property's setter.
     *
     * @param {Object.<string, *>} options - the name/value pairs of the initial options to be set
     * @param {Object} target - the object on which the options are to be initialized
     * @param {Function} [changeHandler] - the function to be called whenever the value of an modifiable option changes on
     * <code>target</code>
     * @return {void}
     * @throws {Error} If <code>options</code> contains an invalid option name.
     * @public
     * @memberof OptionManager#
     */
    init: function(options, target, changeHandler) {
      if (typeof changeHandler !== 'function') {
        changeHandler = Utilities_1.noop;
      }

      var name, option;

      for (name in this.options) {
        if (Utilities_1.hasOwn(this.options, name)) {
          option = this.options[name];

          OptionManager._set(option, option.defaultValue, target);
          OptionManager._createAccessor(option, target, changeHandler);
        }
      }

      this._setAll(options, target, true);
    },

    /**
     * Sets the value of the option with the specified <code>name</code> on the <code>target</code> object provided to
     * <code>value</code>.
     *
     * This method will throw an error if <code>name</code> does not match an available option or matches an option that
     * cannot be modified.
     *
     * If <code>value</code> is <code>null</code> and the {@link Option} has a default value configured, then that default
     * value will be used instead. If the {@link Option} also has a value transformer configured, it will be used to
     * transform whichever value was determined to be used.
     *
     * This method returns whether the value of the underlying field on <code>target</code> was changed as a result.
     *
     * @param {string} name - the name of the {@link Option} whose value is to be set
     * @param {*} value - the value to be set for the named {@link Option} on <code>target</code>
     * @param {Object} target - the object on which <code>value</code> is to be set for the named {@link Option}
     * @return {boolean} <code>true</code> if the underlying field on <code>target</code> was changed; otherwise
     * <code>false</code>.
     * @throws {Error} If <code>name</code> is invalid or is for an option that cannot be modified.
     * @public
     * @memberof OptionManager#
     */
    set: function(name, value, target) {
      return this._set(name, value, target);
    },

    /**
     * Sets all of the specified <code>options</code> on the <code>target</code> object provided to their corresponding
     * values.
     *
     * This method will throw an error if any of the names within <code>options</code> does not match an available option
     * or matches an option that cannot be modified.
     *
     * If any value within <code>options</code> is <code>null</code> and the corresponding {@link Option} has a default
     * value configured, then that default value will be used instead. If an {@link Option} also has a value transformer
     * configured, it will be used to transform whichever value was determined to be used.
     *
     * This method returns whether the value for any of the underlying fields on <code>target</code> were changed as a
     * result.
     *
     * @param {Object.<string, *>} options - the name/value pairs of options to be set
     * @param {Object} target - the object on which the options are to be set
     * @return {boolean} <code>true</code> if any of the underlying fields on <code>target</code> were changed; otherwise
     * <code>false</code>.
     * @throws {Error} If <code>options</code> contains an invalid option name or an option that cannot be modiifed.
     * @public
     * @memberof OptionManager#
     */
    setAll: function(options, target) {
      return this._setAll(options, target);
    },

    _set: function(name, value, target, allowUnmodifiable) {
      var option = this.options[name];
      if (!option) {
        throw new Error('Invalid option: ' + name);
      }
      if (!option.modifiable && !allowUnmodifiable) {
        throw new Error('Option cannot be modified: ' + name);
      }

      return OptionManager._set(option, value, target);
    },

    _setAll: function(options, target, allowUnmodifiable) {
      if (!options) {
        return false;
      }

      var name;
      var changed = false;

      for (name in options) {
        if (Utilities_1.hasOwn(options, name) && this._set(name, options[name], target, allowUnmodifiable)) {
          changed = true;
        }
      }

      return changed;
    }

  }, {

    _createAccessor: function(option, target, changeHandler) {
      var descriptor = {
        get: function() {
          return OptionManager._get(option, target);
        }
      };

      if (option.modifiable) {
        descriptor.set = function(value) {
          if (OptionManager._set(option, value, target)) {
            changeHandler(value, option);
          }
        };
      }

      Object.defineProperty(target, option.name, descriptor);
    },

    _get: function(option, target) {
      return target['_' + option.name];
    },

    _set: function(option, value, target) {
      var fieldName = '_' + option.name;
      var oldValue = target[fieldName];
      var newValue = option.transform(value != null ? value : option.defaultValue);

      target[fieldName] = newValue;

      return newValue !== oldValue;
    }

  });

  var OptionManager_1 = OptionManager;

  /**
   * Called whenever the value of a modifiable {@link Option} is changed on a target object via the defined property's
   * setter.
   *
   * @callback OptionManager~ChangeHandler
   * @param {*} value - the new value for <code>option</code> on the target object
   * @param {Option} option - the modifable {@link Option} whose value has changed on the target object.
   * @return {void}
   */

  /**
   * A basic manager for {@link Service} implementations that are mapped to simple names.
   *
   * @public
   * @class
   * @extends Nevis
   */
  var ServiceManager = lite.extend(function() {
    this._services = {};
  }, {

    /**
     * Returns the {@link Service} being managed with the specified <code>name</code>.
     *
     * @param {string} name - the name of the {@link Service} to be returned
     * @return {Service} The {@link Service} is being managed with <code>name</code>.
     * @throws {Error} If no {@link Service} is being managed with <code>name</code>.
     * @public
     * @memberof ServiceManager#
     */
    getService: function(name) {
      var service = this._services[name];
      if (!service) {
        throw new Error('Service is not being managed with name: ' + name);
      }

      return service;
    },

    /**
     * Sets the {@link Service} implementation to be managed for the specified <code>name</code> to the
     * <code>service</code> provided.
     *
     * @param {string} name - the name of the {@link Service} to be managed with <code>name</code>
     * @param {Service} service - the {@link Service} implementation to be managed
     * @return {void}
     * @throws {Error} If a {@link Service} is already being managed with the same <code>name</code>.
     * @public
     * @memberof ServiceManager#
     */
    setService: function(name, service) {
      if (this._services[name]) {
        throw new Error('Service is already managed with name: ' + name);
      }

      if (service) {
        this._services[name] = service;
      }
    }

  });

  var ServiceManager_1 = ServiceManager;

  var optionManager = new OptionManager_1([
    new Option_1('background', true, 'white'),
    new Option_1('backgroundAlpha', true, 1, Utilities_1.abs),
    new Option_1('element'),
    new Option_1('foreground', true, 'black'),
    new Option_1('foregroundAlpha', true, 1, Utilities_1.abs),
    new Option_1('level', true, 'L', Utilities_1.toUpperCase),
    new Option_1('mime', true, 'image/png'),
    new Option_1('padding', true, null, Utilities_1.abs),
    new Option_1('size', true, 100, Utilities_1.abs),
    new Option_1('value', true, '')
  ]);
  var serviceManager = new ServiceManager_1();

  /**
   * Enables configuration of a QR code generator which uses HTML5 <code>canvas</code> for rendering.
   *
   * @param {QRious~Options} [options] - the options to be used
   * @throws {Error} If any <code>options</code> are invalid.
   * @public
   * @class
   * @extends Nevis
   */
  var QRious = lite.extend(function(options) {
    optionManager.init(options, this, this.update.bind(this));

    var element = optionManager.get('element', this);
    var elementService = serviceManager.getService('element');
    var canvas = element && elementService.isCanvas(element) ? element : elementService.createCanvas();
    var image = element && elementService.isImage(element) ? element : elementService.createImage();

    this._canvasRenderer = new CanvasRenderer_1(this, canvas, true);
    this._imageRenderer = new ImageRenderer_1(this, image, image === element);

    this.update();
  }, {

    /**
     * Returns all of the options configured for this {@link QRious}.
     *
     * Any changes made to the returned object will not be reflected in the options themselves or their corresponding
     * underlying fields.
     *
     * @return {Object.<string, *>} A copy of the applied options.
     * @public
     * @memberof QRious#
     */
    get: function() {
      return optionManager.getAll(this);
    },

    /**
     * Sets all of the specified <code>options</code> and automatically updates this {@link QRious} if any of the
     * underlying fields are changed as a result.
     *
     * This is the preferred method for updating multiple options at one time to avoid unnecessary updates between
     * changes.
     *
     * @param {QRious~Options} options - the options to be set
     * @return {void}
     * @throws {Error} If any <code>options</code> are invalid or cannot be modified.
     * @public
     * @memberof QRious#
     */
    set: function(options) {
      if (optionManager.setAll(options, this)) {
        this.update();
      }
    },

    /**
     * Returns the image data URI for the generated QR code using the <code>mime</code> provided.
     *
     * @param {string} [mime] - the MIME type for the image
     * @return {string} The image data URI for the QR code.
     * @public
     * @memberof QRious#
     */
    toDataURL: function(mime) {
      return this.canvas.toDataURL(mime || this.mime);
    },

    /**
     * Updates this {@link QRious} by generating a new {@link Frame} and re-rendering the QR code.
     *
     * @return {void}
     * @protected
     * @memberof QRious#
     */
    update: function() {
      var frame = new Frame_1({
        level: this.level,
        value: this.value
      });

      this._canvasRenderer.render(frame);
      this._imageRenderer.render(frame);
    }

  }, {

    /**
     * Configures the <code>service</code> provided to be used by all {@link QRious} instances.
     *
     * @param {Service} service - the {@link Service} to be configured
     * @return {void}
     * @throws {Error} If a {@link Service} has already been configured with the same name.
     * @public
     * @static
     * @memberof QRious
     */
    use: function(service) {
      serviceManager.setService(service.getName(), service);
    }

  });

  Object.defineProperties(QRious.prototype, {

    canvas: {
      /**
       * Returns the <code>canvas</code> element being used to render the QR code for this {@link QRious}.
       *
       * @return {*} The <code>canvas</code> element.
       * @public
       * @memberof QRious#
       * @alias canvas
       */
      get: function() {
        return this._canvasRenderer.getElement();
      }
    },

    image: {
      /**
       * Returns the <code>img</code> element being used to render the QR code for this {@link QRious}.
       *
       * @return {*} The <code>img</code> element.
       * @public
       * @memberof QRious#
       * @alias image
       */
      get: function() {
        return this._imageRenderer.getElement();
      }
    }

  });

  var QRious_1$2 = QRious;

  /**
   * The options used by {@link QRious}.
   *
   * @typedef {Object} QRious~Options
   * @property {string} [background="white"] - The background color to be applied to the QR code.
   * @property {number} [backgroundAlpha=1] - The background alpha to be applied to the QR code.
   * @property {*} [element] - The element to be used to render the QR code which may either be an <code>canvas</code> or
   * <code>img</code>. The element(s) will be created if needed.
   * @property {string} [foreground="black"] - The foreground color to be applied to the QR code.
   * @property {number} [foregroundAlpha=1] - The foreground alpha to be applied to the QR code.
   * @property {string} [level="L"] - The error correction level to be applied to the QR code.
   * @property {string} [mime="image/png"] - The MIME type to be used to render the image for the QR code.
   * @property {number} [padding] - The padding for the QR code in pixels.
   * @property {number} [size=100] - The size of the QR code in pixels.
   * @property {string} [value=""] - The value to be encoded within the QR code.
   */

  var index = QRious_1$2;

  /**
   * Defines a service contract that must be met by all implementations.
   *
   * @public
   * @class
   * @extends Nevis
   */
  var Service = lite.extend({

    /**
     * Returns the name of this {@link Service}.
     *
     * @return {string} The service name.
     * @public
     * @abstract
     * @memberof Service#
     */
    getName: function() {}

  });

  var Service_1 = Service;

  /**
   * A service for working with elements.
   *
   * @public
   * @class
   * @extends Service
   */
  var ElementService = Service_1.extend({

    /**
     * Creates an instance of a canvas element.
     *
     * Implementations of {@link ElementService} <b>must</b> override this method with their own specific logic.
     *
     * @return {*} The newly created canvas element.
     * @public
     * @abstract
     * @memberof ElementService#
     */
    createCanvas: function() {},

    /**
     * Creates an instance of a image element.
     *
     * Implementations of {@link ElementService} <b>must</b> override this method with their own specific logic.
     *
     * @return {*} The newly created image element.
     * @public
     * @abstract
     * @memberof ElementService#
     */
    createImage: function() {},

    /**
     * @override
     */
    getName: function() {
      return 'element';
    },

    /**
     * Returns whether the specified <code>element</code> is a canvas.
     *
     * Implementations of {@link ElementService} <b>must</b> override this method with their own specific logic.
     *
     * @param {*} element - the element to be checked
     * @return {boolean} <code>true</code> if <code>element</code> is a canvas; otherwise <code>false</code>.
     * @public
     * @abstract
     * @memberof ElementService#
     */
    isCanvas: function(element) {},

    /**
     * Returns whether the specified <code>element</code> is an image.
     *
     * Implementations of {@link ElementService} <b>must</b> override this method with their own specific logic.
     *
     * @param {*} element - the element to be checked
     * @return {boolean} <code>true</code> if <code>element</code> is an image; otherwise <code>false</code>.
     * @public
     * @abstract
     * @memberof ElementService#
     */
    isImage: function(element) {}

  });

  var ElementService_1 = ElementService;

  /**
   * An implementation of {@link ElementService} intended for use within a browser environment.
   *
   * @public
   * @class
   * @extends ElementService
   */
  var BrowserElementService = ElementService_1.extend({

    /**
     * @override
     */
    createCanvas: function() {
      return document.createElement('canvas');
    },

    /**
     * @override
     */
    createImage: function() {
      return document.createElement('img');
    },

    /**
     * @override
     */
    isCanvas: function(element) {
      return element instanceof HTMLCanvasElement;
    },

    /**
     * @override
     */
    isImage: function(element) {
      return element instanceof HTMLImageElement;
    }

  });

  var BrowserElementService_1 = BrowserElementService;

  index.use(new BrowserElementService_1());

  var QRious_1 = index;

  return QRious_1;

})));


});

var script$9 = function() {
  this.on('mount', () => {
    new qrious(objectAssign({}, this.opts.data, {
      element: this.refs.canvas
    }));
  });
};

riot$1.tag2('viron-qrcode', '<canvas class="Qrcode_canvas" ref="canvas"></canvas>', '', 'class="Qrcode"', function(opts) {
    this.external(script$9);
});

var script$10 = function() {
  const optimizedEndpoint = objectAssign({}, {
    url: this.opts.endpoint.url,
    memo: this.opts.endpoint.memo
  });
  const encodedEndpoint = encodeURIComponent(JSON.stringify(optimizedEndpoint));
  const value = `${location.origin}/#/endpointimport?endpoint=${encodedEndpoint}`;

  this.data = {
    // background: 'green',
    // backgroundAlpha: 0.8,
    // element: <Canvas>,
    // foreground: 'blue',
    // foregroundAlpha: 0.8,
    level: 'L',
    mime: 'image/png',
    // padding: 5,
    size: 200,
    value
  };
};

riot$1.tag2('viron-endpoints-page-endpoint-menu-qrcode', '<div class="EndpointsPage_Endpoint_Menu_QRCode__message">モバイル端末にエンドポイントを追加できます。<br>お好きなQRコードリーダーで読み込んで下さい。</div> <div class="EndpointsPage_Endpoint_Menu_QRCode__canvas"> <viron-qrcode data="{data}"></viron-qrcode> </div>', '', 'class="EndpointsPage_Endpoint_Menu_QRCode"', function(opts) {
    this.external(script$10);
});

var script$5 = function() {
  const store = this.riotx.get();

  this.handleEditButtonTap = () => {
    Promise
      .resolve()
      .then(() => store.action(constants$1.MODALS_ADD, 'viron-endpoints-page-endpoint-menu-edit', {
        endpoint: this.opts.endpoint
      }))
      .then(() => {
        this.close();
      })
      .catch(err => store.action(constants$1.MODALS_ADD, 'viron-error', {
        error: err
      }));
  };

  this.handleDeleteButtonTap = () => {
    Promise
      .resolve()
      .then(() => store.action(constants$1.ENDPOINTS_REMOVE, this.opts.endpoint.key))
      .then(() => store.action(constants$1.TOASTS_ADD, {
        message: 'エンドポイントを削除しました。'
      }))
      .then(() => {
        this.close();
      })
      .catch(err => store.action(constants$1.MODALS_ADD, 'viron-error', {
        error: err
      }));
  };

  this.handleQRCodeButtonTap = () => {
    Promise
      .resolve()
      .then(() => store.action(constants$1.MODALS_ADD, 'viron-endpoints-page-endpoint-menu-qrcode', {
        endpoint: this.opts.endpoint
      }))
      .then(() => {
        this.close();
      })
      .catch(err => store.action(constants$1.MODALS_ADD, 'viron-error', {
        error: err
      }));
  };

  this.handleSignoutButtonTap = () => {
    Promise
      .resolve()
      .then(() => store.action(constants$1.AUTH_REMOVE, this.opts.endpoint.key))
      .then(() => store.action(constants$1.TOASTS_ADD, {
        message: 'ログアウトしました。'
      }))
      .then(() => {
        this.close();
      })
      .catch(err => store.action(constants$1.MODALS_ADD, 'viron-error', {
        error: err
      }));
  };
};

riot$1.tag2('viron-endpoints-page-endpoint-menu', '<div onclick="{getClickHandler(\'handleEditButtonTap\')}" ontouchstart="{getTouchStartHandler()}" ontouchmove="{getTouchMoveHandler()}" ontouchend="{getTouchEndHandler(\'handleEditButtonTap\')}">編集</div> <div onclick="{getClickHandler(\'handleDeleteButtonTap\')}" ontouchstart="{getTouchStartHandler()}" ontouchmove="{getTouchMoveHandler()}" ontouchend="{getTouchEndHandler(\'handleDeleteButtonTap\')}">削除</div> <div onclick="{getClickHandler(\'handleQRCodeButtonTap\')}" ontouchstart="{getTouchStartHandler()}" ontouchmove="{getTouchMoveHandler()}" ontouchend="{getTouchEndHandler(\'handleQRCodeButtonTap\')}">QR Code</div> <div onclick="{getClickHandler(\'handleSignoutButtonTap\')}" ontouchstart="{getTouchStartHandler()}" ontouchmove="{getTouchMoveHandler()}" ontouchend="{getTouchEndHandler(\'handleSignoutButtonTap\')}">サインアウト</div>', '', 'class="EndpointsPage_Endpoint_Menu"', function(opts) {
    this.external(script$5);
});

var script$11 = function() {};

riot$1.tag2('viron-horizontal-rule', '<div class="HorizontalRule__line"></div> <virtual if="{!!opts.label}"> <div class="HorizontalRule__label">{opts.label}</div> <div class="HorizontalRule__line"></div> </virtual>', '', 'class="HorizontalRule"', function(opts) {
    this.external(script$11);
});

var script$12 = function() {
  /**
   * 文字列もしくはnullに変換します。
   * @param {String|null|undefined} value
   * @return {String|null}
   */
  this.normalizeValue = value => {
    if (!isString_1(value)) {
      return null;
    }
    return value;
  };

  this.handleTap = () => {
    this.refs.input.focus();
  };

  this.handleFormSubmit = e => {
    e.preventDefault();
    if (!this.opts.onchange) {
      return;
    }
    const newVal = this.normalizeValue(this.opts.val);
    this.opts.onchange(newVal, this.opts.id);
  };

  // `blur`時にも`change`イベントが発火する。
  // 不都合な挙動なのでイベント伝播を止める。
  this.handleInputChange = e => {
    e.stopPropagation();
  };

  this.handleInputInput = e => {
    if (!this.opts.onchange) {
      return;
    }
    const newVal = this.normalizeValue(e.target.value);
    this.opts.onchange(newVal, this.opts.id);
  };
};

riot$1.tag2('viron-textinput', '<div class="Textinput__label" if="{!!opts.label}">{opts.label}</div> <form class="Textinput__form" ref="form" onsubmit="{handleFormSubmit}"> <input class="Textinput__input" ref="input" type="{opts.type || \'text\'}" riot-value="{normalizeValue(opts.val)}" placeholder="{opts.placeholder}" disabled="{!!opts.isdisabled}" oninput="{handleInputInput}" onchange="{handleInputChange}"> </form>', '', 'class="Textinput {\'Textinput--disabled\': opts.isdisabled}" onclick="{getClickHandler(\'handleTap\')}" ontouchstart="{getTouchStartHandler()}" ontouchmove="{getTouchMoveHandler()}" ontouchend="{getTouchEndHandler(\'handleTap\')}"', function(opts) {
    this.external(script$12);
});

var script$13 = function() {
  const store = this.riotx.get();

  this.mailAddress = '';
  this.password = '';

  this.handleMailAddressChange = newMailAddress => {
    this.mailAddress = newMailAddress;
    this.update();
  };

  this.handlePasswordChange = newPassword => {
    this.password = newPassword;
    this.update();
  };

  this.handleSigninButtonSelect = () => {
    this.opts.closer();
    Promise
      .resolve()
      .then(() => store.action(constants$1.AUTH_SIGNIN_EMAIL, this.opts.endpointkey, this.opts.authtype, this.mailAddress, this.password))
      .then(() => {
        this.getRouter().navigateTo(`/${this.opts.endpointkey}`);
      })
      .catch(err => store.action(constants$1.MODALS_ADD, 'viron-error', {
        title: 'ログイン失敗',
        message: 'ログイン出来ませんでした。正しいメールアドレスとパスワードを使用しているか確認して下さい。使用したメールアドレスが予め管理者として登録されているか確認して下さい。',
        error: err
      }));
  };
};

riot$1.tag2('viron-endpoints-page-endpoint-signin-email', '<viron-textinput placeholder="mail address" val="{mailAddress}" onchange="{handleMailAddressChange}"></viron-textinput> <viron-textinput placeholder="password" type="password" val="{password}" onchange="{handlePasswordChange}"></viron-textinput> <viron-button label="ログイン" onselect="{handleSigninButtonSelect}"></viron-button>', '', 'class="EndpointsPage_Endpoint_Signin_Email"', function(opts) {
    this.external(script$13);
});

var script$14 = function() {
  const store = this.riotx.get();

  this.handleButtonSelect = () => {
    this.opts.closer();
    Promise
      .resolve()
      .then(() => store.action(constants$1.AUTH_SIGNIN_OAUTH, this.opts.endpointkey, this.opts.authtype))
      .catch(err => store.action(constants$1.MODALS_ADD, 'viron-error', {
        error: err
      }));
  };
};

riot$1.tag2('viron-endpoints-page-endpoint-signin-oauth', '<viron-button label="{opts.authtype.provider}" onselect="{handleButtonSelect}"></viron-button>', '', 'class="EndpointsPage_Endpoint_Signin_Oauth"', function(opts) {
    this.external(script$14);
});

var script$15 = function() {
  const store = this.riotx.get();

  this.isDesktop = store.getter(constants$5.LAYOUT_IS_DESKTOP);
  this.emails = filter_1$1(this.opts.authtypes, authtype => {
    return (authtype.type === constants$4.authtypeEmail);
  });
  this.oauths = filter_1$1(this.opts.authtypes, authtype => {
    return (authtype.type === constants$4.authtypeOauth);
  });

  this.listen(constants$3.LAYOUT, () => {
    this.isDesktop = store.getter(constants$5.LAYOUT_IS_DESKTOP);
    this.update();
  });

  // 子コンポーネントに渡す。モーダルを閉じるため。
  this.closer = () => {
    this.close();
  };
};

riot$1.tag2('viron-endpoints-page-endpoint-signin', '<div class="EndpointsPage_Endpoint_Signin__main"> <div class="EndpointsPage_Endpoint_Signin__thumbnail" riot-style="background-image:url({opts.endpoint.thumbnail});"></div> <div class="EndpointsPage_Endpoint_Signin__name">name: {opts.endpoint.name}</div> <div class="EndpointsPage_Endpoint_Signin__url">url: {opts.endpoint.url}</div> <div class="EndpointsPage_Endpoint_Signin__emails" if="{!!emails.length}"> <viron-endpoints-page-endpoint-signin-email each="{authtype in emails}" authtype="{authtype}" endpointkey="{parent.opts.endpoint.key}" closer="{closer}"></viron-endpoints-page-endpoint-signin-email> </div> <virtual if="{!isDesktop &amp;&amp; !!oauths.length}"> <viron-horizontal-rule label="または"></viron-horizontal-rule> <div class="EndpointsPage_Endpoint_Signin__oauths"> <viron-endpoints-page-endpoint-signin-oauth each="{authtype in oauths}" authtype="{authtype}" endpointkey="{parent.opts.endpoint.key}" closer="{closer}"></viron-endpoints-page-endpoint-signin-oauth> </div> </virtual> </div> <div class="EndpointsPage_Endpoint_Signin__aside" if="{isDesktop &amp;&amp; !!oauths.length}"> <div class="EndpointsPage_Endpoint_Signin__oauthMessage">または、こちらを<br>利用してログイン</div> <div class="EndpointsPage_Endpoint_Signin__oauths"> <viron-endpoints-page-endpoint-signin-oauth each="{authtype in oauths}" authtype="{authtype}" endpointkey="{parent.opts.endpoint.key}" closer="{closer}"></viron-endpoints-page-endpoint-signin-oauth> </div> </div>', '', 'class="EndpointsPage_Endpoint_Signin"', function(opts) {
    this.external(script$15);
});

var script$4 = function() {
  const store = this.riotx.get();

  this.handleTap = () => {
    // サインイン済みならばendpointページに遷移させる。
    // サインインしていなければ認証モーダルを表示する。
    const endpointKey = this.opts.endpoint.key;
    Promise
      .resolve()
      .then(() => store.action(constants$1.AUTH_VALIDATE, endpointKey))
      .then(isValid => {
        if (isValid) {
          this.getRouter().navigateTo(`/${endpointKey}`);
          return Promise.resolve();
        }
        return Promise
          .resolve()
          .then(() => store.action(constants$1.AUTH_GET_TYPES, endpointKey))
          .then(authtypes => store.action(constants$1.MODALS_ADD, 'viron-endpoints-page-endpoint-signin', {
            endpoint: this.opts.endpoint,
            authtypes
          }, { isSpread: true }));
      })
      .catch(err => store.action(constants$1.MODALS_ADD, 'viron-error', {
        error: err
      }));
  };

  this.handleMenuTap = e => {
    e.stopPropagation();
    const rect = this.refs.menu.root.getBoundingClientRect();
    store.action(constants$1.POPOVERS_ADD, 'viron-endpoints-page-endpoint-menu', {
      endpoint: this.opts.endpoint
    }, {
      x: rect.left + (rect.width / 2),
      y: rect.bottom,
      direction: 'TL'
    });
  };
};

riot$1.tag2('viron-endpoints-page-endpoint', '<viron-icon-dots class="EndpointsPage_Endpoint__menu" ref="menu" onclick="{getClickHandler(\'handleMenuTap\')}" ontouchstart="{getTouchStartHandler()}" ontouchmove="{getTouchMoveHandler()}" ontouchend="{getTouchEndHandler(\'handleMenuTap\')}"></viron-icon-dots> <div class="EndpointsPage_Endpoint__thumbnail" riot-style="background-image:url({opts.endpoint.thumbnail});"></div> <div class="EndpointsPage_Endpoint__name">name: {opts.endpoint.name}</div> <div class="EndpointsPage_Endpoint__description">description: {opts.endpoint.description}</div> <div class="EndpointsPage_Endpoint__memo">memo: {opts.endpoint.memo}</div> <div class="EndpointsPage_Endpoint__url">url: {opts.endpoint.url}</div> <div class="EndpointsPage_Endpoint__version">version: {opts.endpoint.version}</div> <div class="EndpointsPage_Endpoint__token">token: {opts.endpoint.token}</div> <div class="EndpointsPage_Endpoint__theme">theme: {opts.endpoint.color}</div> <div class="EndpointsPage_Endpoint__tags"> <viron-tag each="{tag in opts.endpoint.tags}" label="{tag}"></viron-tag> </div>', '', 'class="card EndpointsPage_Endpoint" onclick="{getClickHandler(\'handleTap\')}" ontouchstart="{getTouchStartHandler()}" ontouchmove="{getTouchMoveHandler()}" ontouchend="{getTouchEndHandler(\'handleTap\')}"', function(opts) {
    this.external(script$4);
});

var script$16 = function() {
  const store = this.riotx.get();

  this.endpoints = store.getter(constants$5.ENDPOINTS_BY_ORDER_FILTERED);

  this.listen(constants$3.ENDPOINTS, () => {
    this.endpoints = store.getter(constants$5.ENDPOINTS_BY_ORDER_FILTERED);
    this.update();
  });
};

riot$1.tag2('viron-endpoints-page', '<div class="EndpointsPage__list"> <viron-endpoints-page-endpoint each="{endpoint in endpoints}" endpoint="{endpoint}"></viron-endpoints-page-endpoint> </div>', '', 'class="EndpointsPage"', function(opts) {
    this.external(script$16);
});

var script$17 = function() {};

riot$1.tag2('viron-notfound-page', '<div>Not Found...</div>', '', 'class="NotfoundPage"', function(opts) {
    this.external(script$17);
});

var script$18 = function() {
};

riot$1.tag2('viron-icon', '', '', 'class="Icon Icon--{opts.type || \'question\'} {opts.class}"', function(opts) {
    this.external(script$18);
});

var script$19 = function() {
};

riot$1.tag2('viron-progress-circular', '<div class="ProgressCircular__spinner"> <viron-icon type="loading"></viron-icon> </div>', '', 'class="ProgressCircular"', function(opts) {
    this.external(script$19);
});

var script$20 = function() {
};

riot$1.tag2('viron-progress-linear', '<div class="ProgressLinear__bar"> <div class="ProgressLinear__particle"></div> <div class="ProgressLinear__particle"></div> </div>', '', 'class="ProgressLinear {\'ProgressLinear--active\' : opts.isactive}"', function(opts) {
    this.external(script$20);
});

riot$1.tag2('viron-application-blocker', '', '', 'class="Application_Blocker"', function(opts) {
});

var script$21 = function() {
  const store = this.riotx.get();

  // `tag` = drawer内に展開されるriot tagインスタンス。
  let tag;

  const fadeIn = () => {
    setTimeout(() => {
      this.root.classList.add('Drawer--visible');
    }, 100);
  };

  const fadeOut = () => {
    this.root.classList.remove('Drawer--visible');

    setTimeout(() => {
      store.action(constants$1.DRAWERS_REMOVE, this.opts.id);
    }, 1000);
  };

  this.on('mount', () => {
    tag = riot$1.mount(this.refs.content, this.opts.tagname, objectAssign({
      isDrawer: true,
      drawerCloser: this.fadeOut
    }, this.opts.tagopts))[0];
    fadeIn();
    window.addEventListener('keydown', this.handleKeyDown);
  }).on('before-unmount', () => {
    tag.unmount(true);
  }).on('unmount', () => {
    window.removeEventListener('keydown', this.handleKeyDown);
  });

  this.handleTap = e => {
    if (!e.target.classList.contains('Drawer')) {
      return;
    }
    fadeOut();
  };

  this.handleKeyDown = e => {
    switch (e.keyCode) {
    case 27:// Esc
      this.fadeOut();
      break;
    default:
      break;
    }
  };
};

riot$1.tag2('viron-drawer', '<div class="Drawer__frame"> <div class="Drawer__content" ref="content"></div> </div>', '', 'class="Drawer Drawer--{opts.theme}" onclick="{getClickHandler(\'handleTap\')}" ontouchstart="{getTouchStartHandler()}" ontouchmove="{getTouchMoveHandler()}" ontouchend="{getTouchEndHandler(\'handleTap\')}"', function(opts) {
    this.external(script$21);
});

var script$22 = function() {
  const store = this.riotx.get();

  this.drawers = store.getter(constants$5.DRAWERS);

  this.listen(constants$3.DRAWERS, () => {
    this.drawers = store.getter(constants$5.DRAWERS);
    this.update();
  });
};

riot$1.tag2('viron-application-drawers', '<virtual each="{drawers}"> <viron-drawer id="{id}" tagname="{tagName}" tagopts="{tagOpts}" theme="{drawerOpts.theme}"></viron-drawer> </virtual>', '', 'class="Application_Drawers"', function(opts) {
    this.external(script$22);
});

riot$1.tag2('viron-icon-search', '<svg viewbox="-3434 14059.999 15.999 16.003"> <path d="M3710.818-13811.056l-3.051-3.05a6.957,6.957,0,0,1-3.768,1.1,7.008,7.008,0,0,1-7-7,7.008,7.008,0,0,1,7-7,7.008,7.008,0,0,1,7,7,6.957,6.957,0,0,1-1.107,3.773l3.051,3.049a.205.205,0,0,1,0,.284l-1.839,1.839a.206.206,0,0,1-.142.058A.206.206,0,0,1,3710.818-13811.056ZM3700-13820a4,4,0,0,0,4,4,4,4,0,0,0,4-4,4,4,0,0,0-4-4A4,4,0,0,0,3700-13820Z" transform="translate(-7131 27887)"></path> </svg>', '', 'class="icon Icon IconSearch {opts.class}"', function(opts) {
});

riot$1.tag2('viron-icon-square', '<svg viewbox="-3674 14061 15.998 13.998"> <path d="M1869-16726h-14a1,1,0,0,1-1-1v-12a1,1,0,0,1,1-1h14a1,1,0,0,1,1,1v12A1,1,0,0,1,1869-16726Zm-12-11v8h10v-8Z" transform="translate(-5528 30801)"></path> </svg>', '', 'class="icon Icon IconSquare {opts.class}"', function(opts) {
});

var script$24 = function() {};

riot$1.tag2('viron-application-header-autocomplete', '<div>autocomplete!!!</div>', '', 'class="Application_Header_Autocomplete"', function(opts) {
    this.external(script$24);
});

var script$26 = function() {
  const store = this.riotx.get();

  this.endpointURL = '';
  this.memo = '';

  this.handleEndpointURLChange = newEndpointURL => {
    this.endpointURL = newEndpointURL;
    this.update();
  };

  this.handleMemoChange = newMemo => {
    this.memo = newMemo;
    this.update();
  };


  this.handleAddButtonSelect = () => {
    Promise
      .resolve()
      .then(() => store.action(constants$1.ENDPOINTS_ADD, this.endpointURL, this.memo))
      .then(() => store.action(constants$1.TOASTS_ADD, {
        message: 'エンドポイントを追加しました。'
      }))
      .then(() => {
        this.close();
      })
      .catch(err => {
        let autoHide = true;
        let linkText;
        let link;
        // サーバが自己証明書を使用している場合にページ遷移を促す。
        if (this.endpointURL.startsWith('https://')) {
          autoHide = false;
          linkText = 'Self-Signed Certificate?';
          link = this.endpointURL;
        }
        store.action(constants$1.TOASTS_ADD, {
          message: err.message,
          autoHide,
          linkText,
          link
        });
      });
  };

  this.handleCancelButtonSelect = () => {
    this.close();
  };
};

riot$1.tag2('viron-application-header-menu-entry', '<div>新しい管理画面を追加する</div> <div class="Application_Header_Menu_Entry__inputs"> <viron-textinput label="エンドポイント" val="{endpointURL}" onchange="{handleEndpointURLChange}"></viron-textinput> <viron-textarea label="メモ" val="{memo}" onchange="{handleMemoChange}"></viron-textarea> </div> <div class="Application_Header_Menu_Entry__control"> <viron-button label="追加" onselect="{handleAddButtonSelect}"></viron-button> <viron-button theme="ghost" label="キャンセル" onselect="{handleCancelButtonSelect}"></viron-button> </div>', '', 'class="Application_Header_Menu_Entry"', function(opts) {
    this.external(script$26);
});

var script$25 = function() {
  const store = this.riotx.get();
  const generalActions = [
    { label: 'クレジット', id: 'show_credit' },
    { label: 'ヘルプ', id: 'navigate_to_doc' },
    { label: 'ラーニング', id: 'navigate_to_doc' },
    { label: 'キャッシュクリア', id: 'clear_cache' }
  ];
  const endpointActions = [
    { label: '追加', id: 'add_endpoint' },
    { label: 'ホームを保存', id: 'export_endpoints' },
    { label: 'ホームを読み込み', id: 'import_endpoints' },
    { label: '全てのカードを削除', id: 'remove_all_endpoints' }
  ];

  // メニュー項目群。
  this.actions = [];
  switch (this.opts.type) {
  case 'general':
    this.actions = generalActions;
    break;
  case 'endpoint':
    this.actions = endpointActions;
    break;
  default:
    break;
  }

  /**
   * エンドポイント追加用のモーダルを表示します。
   */
  this.showModalToAddEndpoint = () => {
    store.action(constants$1.MODALS_ADD, 'viron-application-header-menu-entry');
  };

  /**
   * メニュー項目がクリック/タップされた時の処理。
   * @param {Object} e
   */
  this.handleItemTap = e => {
    const actionId = e.item.action.id;
    switch (actionId) {
    case 'show_credit':
      // TODO:
      // TODO: debug用なので後で消すこと。
      store.action(constants$1.TOASTS_ADD, {
        message: 'testes',
        autoHide: false
      });
      this.close();
      break;
    case 'navigate_to_doc':
      window.open('https://cam-inc.github.io/viron-doc/', '_blank');
      this.close();
      break;
    case 'clear_cache':
      // TODO:
      this.close();
      break;
    case 'add_endpoint':
      this.showModalToAddEndpoint();
      this.close();
      break;
    case 'export_endpoints':
      // TODO:
      this.close();
      break;
    case 'import_endpoints':
      // TODO:
      this.close();
      break;
    case 'remove_all_endpoints':
      // TODO:
      this.close();
      break;
    default:
      this.close();
      break;
    }
  };
};

riot$1.tag2('viron-application-header-menu', '<div class="Application_Header_Menu__list"> <div class="Application_Header_Menu__item" each="{action in actions}" onclick="{getClickHandler(\'handleItemTap\')}" ontouchstart="{getTouchStartHandler()}" ontouchmove="{getTouchMoveHandler()}" ontouchend="{getTouchEndHandler(\'handleItemTap\')}">{action.label}</div> </div>', '', 'class="Application_Header_Menu"', function(opts) {
    this.external(script$25);
});

var script$23 = function() {
  const store = this.riotx.get();

  this.handleSearchIconTap = () => {
    // 検索用オートコンプリートをpopoverで開きます。
    const rect = this.refs.searchIcon.root.getBoundingClientRect();
    store.action(constants$1.POPOVERS_ADD, 'viron-application-header-autocomplete', null, {
      x: rect.left + (rect.width / 2),
      y: rect.bottom,
      direction: 'TL'
    });
  };

  this.handleSquareIconTap = () => {
    // menu(エンドポイント関連のやつ)をpopoverで開きます。
    const rect = this.refs.squareIcon.root.getBoundingClientRect();
    store.action(constants$1.POPOVERS_ADD, 'viron-application-header-menu', {
      type: 'endpoint'
    }, {
      x: rect.left + (rect.width / 2),
      y: rect.bottom,
      width: 228,
      direction: 'TR'
    });
  };

  this.handleDotsIconTap = () => {
    // menu(一般的なやつ)をpopoverで開きます。
    const rect = this.refs.dotsIcon.root.getBoundingClientRect();
    store.action(constants$1.POPOVERS_ADD, 'viron-application-header-menu', {
      type: 'general'
    }, {
      x: rect.left + (rect.width / 2),
      y: rect.bottom,
      width: 228,
      direction: 'TR'
    });
  };
};

riot$1.tag2('viron-application-header', '<div class="Application_Header__aside"> <viron-icon-search class="Application_Header__searchIcon" ref="searchIcon" onclick="{getClickHandler(\'handleSearchIconTap\')}" ontouchstart="{getTouchStartHandler()}" ontouchmove="{getTouchMoveHandler()}" ontouchend="{getTouchEndHandler(\'handleSearchIconTap\')}"></viron-icon-search> </div> <div class="Application_Header__aside"> <viron-icon-square class="Application_Header__squareIcon" ref="squareIcon" onclick="{getClickHandler(\'handleSquareIconTap\')}" ontouchstart="{getTouchStartHandler()}" ontouchmove="{getTouchMoveHandler()}" ontouchend="{getTouchEndHandler(\'handleSquareIconTap\')}"></viron-icon-square> <viron-icon-dots class="Application_Header__dotsIcon" ref="dotsIcon" onclick="{getClickHandler(\'handleDotsIconTap\')}" ontouchstart="{getTouchStartHandler()}" ontouchmove="{getTouchMoveHandler()}" ontouchend="{getTouchEndHandler(\'handleDotsIconTap\')}"></viron-icon-dots> </div>', '', 'class="Application_Header"', function(opts) {
    this.external(script$23);
});

riot$1.tag2('viron-icon-arrow-left', '<svg viewbox="-3581 14060.002 10.04 16.002"> <path d="M1793.942-16723.971l-7.4-7.4-.018-.023-.385-.385a.2.2,0,0,1,0-.281l7.8-7.8a.2.2,0,0,1,.281,0l1.84,1.84a.2.2,0,0,1,0,.281l-5.82,5.82,5.82,5.816a.2.2,0,0,1,0,.287l-1.84,1.84a.2.2,0,0,1-.141.057A.2.2,0,0,1,1793.942-16723.971Z" transform="translate(-5367.083 30799.918)"></path> </svg>', '', 'class="icon Icon IconArrowLeft {opts.class}"', function(opts) {
});

riot$1.tag2('viron-icon-logo', '<svg viewbox="-3675 13992 24 24"> <path d="M13.333,0H0V24H24V0Zm0,2.667h8V5.333h-8Zm-10.667,0h8v8h-8ZM21.333,21.333H2.667v-8H21.333Zm0-10.667h-8V8h8Z" transform="translate(-3675 13992)"></path> </svg>', '', 'class="icon Icon IconLogo {opts.class}"', function(opts) {
});

riot$1.tag2('viron-icon-arrow-up', '<svg viewbox="-3494.002 14063 16.002 10.037"> <path d="M1706.943-16726.971l-5.963-5.963-1.433-1.434a.122.122,0,0,1-.019-.021l-.384-.385a.2.2,0,0,1,0-.283l7.8-7.8a.2.2,0,0,1,.281,0l1.84,1.842a.2.2,0,0,1,0,.281l-5.82,5.82,5.82,5.818a.2.2,0,0,1,0,.281l-1.84,1.842a.2.2,0,0,1-.141.059A.2.2,0,0,1,1706.943-16726.971Z" transform="translate(-20220.914 12363.916) rotate(90)"></path> </svg>', '', 'class="icon Icon IconArrowUp {opts.class}"', function(opts) {
});

var script$27 = function() {
  const store = this.riotx.get();

  this.isOpened = false;

  this.handleHeadTap = () => {
    this.isOpened = !this.isOpened;
    this.update();
  };

  this.handleIndependentHeadTap = () => {
    const id = this.opts.group.pages[0].id;
    this.getRouter().navigateTo(`/${store.getter(constants$5.CURRENT)}/${id}`);
  };

  this.handlePageTap = e => {
    const id = e.item.page.id;
    this.getRouter().navigateTo(`/${store.getter(constants$5.CURRENT)}/${id}`);
  };
};

riot$1.tag2('viron-application-menu-group', '<virtual if="{!opts.group.isIndependent}"> <div class="Application_Menu_Group__head" onclick="{getClickHandler(\'handleHeadTap\')}" ontouchstart="{getTouchStartHandler()}" ontouchmove="{getTouchMoveHandler()}" ontouchend="{getTouchEndHandler(\'handleHeadTap\')}"> <div class="Application_Menu_Group__name">{opts.group.name}</div> <viron-icon-arrow-up class="Application_Menu_Group__arrow"></viron-icon-arrow-up> </div> <div class="Application_Menu_Group__pages" if="{isOpened}"> <div class="Application_Menu_Group__page" each="{page in opts.group.pages}" onclick="{getClickHandler(\'handlePageTap\')}" ontouchstart="{getTouchStartHandler()}" ontouchmove="{getTouchMoveHandler()}" ontouchend="{getTouchEndHandler(\'handlePageTap\')}">{page.name}</div> </div> </virtual> <virtual if="{opts.group.isIndependent}"> <div class="Application_Menu_Group__head" onclick="{getClickHandler(\'handleIndependentHeadTap\')}" ontouchstart="{getTouchStartHandler()}" ontouchmove="{getTouchMoveHandler()}" ontouchend="{getTouchEndHandler(\'handleIndependentHeadTap\')}"> <div class="Application_Menu_Group__name">{opts.group.pages[0].name}</div> </div> </virtual>', '', 'class="Application_Menu_Group {\'Application_Menu_Group--open\': isOpened}"', function(opts) {
    this.external(script$27);
});

var script$28 = function() {
  const store = this.riotx.get();

  this.menu = store.getter(constants$5.VIRON_MENU);
  this.listen(constants$3.VIRON, () => {
    this.menu = store.getter(constants$5.VIRON_MENU);
    this.update();
  });

  this.handleLogoTap = () => {
    this.getRouter().navigateTo('/');
  };
};

riot$1.tag2('viron-application-menu', '<div class="Application_Menu__head"> <viron-icon-arrow-left class="Application_Menu__arrow"></viron-icon-arrow-left> <viron-icon-logo class="Application_Menu__logo" onclick="{getClickHandler(\'handleLogoTap\')}" ontouchstart="{getTouchStartHandler()}" ontouchmove="{getTouchMoveHandler()}" ontouchend="{getTouchEndHandler(\'handleLogoTap\')}"></viron-icon-logo> </div> <div class="Application_Menu__body"> <div class="Application_Menu__section" each="{section in menu}"> <div class="Application_Menu__sectionName">{section.name}</div> <div class="Application_Menu__groups"> <viron-application-menu-group each="{group in section.groups}" group="{group}"></viron-application-menu-group> </div> </div> </div>', '', 'class="Application_Menu"', function(opts) {
    this.external(script$28);
});

riot$1.tag2('viron-icon-close', '<svg viewbox="-3644.002 14060.002 16.001 16.002"> <path d="M1859.9-16723.971l-5.819-5.822-5.818,5.818a.2.2,0,0,1-.281,0l-1.84-1.842a.2.2,0,0,1,0-.281l5.818-5.816-5.818-5.82a.2.2,0,0,1,0-.281l1.84-1.84a.2.2,0,0,1,.281,0l5.818,5.818,5.82-5.818a.2.2,0,0,1,.286,0l1.84,1.84a.2.2,0,0,1,0,.281l-5.823,5.82,5.819,5.82a.2.2,0,0,1,0,.283l-1.836,1.84a.21.21,0,0,1-.143.057A.21.21,0,0,1,1859.9-16723.971Z" transform="translate(-5490.083 30799.918)"></path> </svg>', '', 'class="icon Icon IconClose {opts.class}"', function(opts) {
});

var script$29 = function() {
  const store = this.riotx.get();

  let tag;

  const fadeIn = () => {
    setTimeout(() => {
      this.isVisible = true;
      this.update();
    }, 100);
  };

  const fadeOut = () => {
    this.isVisible = false;
    this.update();
    setTimeout(() => {
      store.action(constants$1.MODALS_REMOVE, this.opts.id);
    }, 1000);
  };

  this.layoutType = store.getter(constants$5.LAYOUT_TYPE);
  this.listen(constants$3.LAYOUT, () => {
    this.layoutType = store.getter(constants$5.LAYOUT_TYPE);
    this.update();
  });

  this.on('mount', () => {
    tag = riot$1.mount(this.refs.content, this.opts.tagname, objectAssign({
      isModal: true,
      modalCloser: fadeOut
    }, this.opts.tagopts))[0];
    fadeIn();
    window.addEventListener('keydown', this.handleKeyDown);
  }).on('before-unmount', () => {
    tag.unmount(true);
  }).on('unmount', () => {
    window.removeEventListener('keydown', this.handleKeyDown);
  });

  this.handleTap = () => {
    fadeOut();
  };

  this.handleFrameTap = e => {
    // 内部イベントを外部に伝播させない。
    e.stopPropagation();
  };

  this.handleCloseButtonTap = () => {
    fadeOut();
  };

  this.handleKeyDown = e => {
    switch (e.keyCode) {
    case 27: // Esc
      fadeOut();
      break;
    default:
      break;
    }
  };
};

riot$1.tag2('viron-modal', '<div class="Modal__frame" onclick="{getClickHandler(\'handleFrameTap\')}" ontouchstart="{getTouchStartHandler()}" ontouchmove="{getTouchMoveHandler()}" ontouchend="{getTouchEndHandler(\'handleFrameTap\')}"> <viron-icon-close class="Modal__closeButton" onclick="{getClickHandler(\'handleCloseButtonTap\')}" ontouchstart="{getTouchStartHandler()}" ontouchmove="{getTouchMoveHandler()}" ontouchend="{getTouchEndHandler(\'handleCloseButtonTap\')}"></viron-icon-close> <div class="Modal__content" ref="content"></div> </div>', '', 'class="Modal {isVisible ? \'Modal--visible\' : \'\'} Modal--{opts.modalopts.theme} Modal--{layoutType} {opts.modalopts.isSpread ? \'Modal--spread\': \'\'}" onclick="{getClickHandler(\'handleTap\')}" ontouchstart="{getTouchStartHandler()}" ontouchmove="{getTouchMoveHandler()}" ontouchend="{getTouchEndHandler(\'handleTap\')}"', function(opts) {
    this.external(script$29);
});

var script$30 = function() {
  const store = this.riotx.get();

  this.modals = store.getter(constants$5.MODALS);
  this.listen(constants$3.MODALS, () => {
    this.modals = store.getter(constants$5.MODALS);
    this.update();
  });
};

riot$1.tag2('viron-application-modals', '<virtual each="{modals}"> <viron-modal id="{id}" tagname="{tagName}" tagopts="{tagOpts}" modalopts="{modalOpts}"></viron-modal> </virtual>', '', 'class="Application_Modals"', function(opts) {
    this.external(script$30);
});

// Mouse系かTouch系か。
const isTouchEventSupported$1 = 'ontouchstart' in document;

var script$31 = function() {
  const store = this.riotx.get();

  let tag;

  const fadeIn = () => {
    setTimeout(() => {
      this.root.classList.add('Popover--visible');
    }, 100);
  };

  const fadeOut = () => {
    this.root.classList.remove('Popover--visible');
    setTimeout(() => {
      store.action(constants$1.POPOVERS_REMOVE, this.opts.id);
    }, 1000);
  };

  this.on('mount', () => {
    tag = riot$1.mount(this.refs.content, this.opts.tagname, objectAssign({
      isPopover: true,
      popoverCloser: fadeOut
    }, this.opts.tagopts))[0];
    fadeIn();
    window.addEventListener('resize', this.handleWindowResize);
    window.addEventListener('scroll', this.handleWindowScroll);
    window.addEventListener('click', this.handleWindowClick);
    window.addEventListener('touchend', this.handleWindowTouchEnd);
  }).on('before-unmount', () => {
    tag.unmount(true);
  }).on('unmount', () => {
    window.removeEventListener('resize', this.handleWindowResize);
    window.removeEventListener('scroll', this.handleWindowScroll);
    window.removeEventListener('click', this.handleWindowClick);
    window.removeEventListener('touchend', this.handleWindowTouchend);
  });

  /**
   * 配置座標を返します。
   * @return {String}
   */
  this.getPosition = () => {
    const opts = this.opts.popoveropts;
    const styles = [];
    styles.push(`left:${opts.x}px;`);
    styles.push(`top:${opts.y}px;`);
    return styles.join('');
  };

  /**
   * サイズを返します。
   * @return {String}
   */
  this.getSize = () => {
    const opts = this.opts.popoveropts;
    const styles = [];
    styles.push(`width:${opts.width}px;`);
    // directionが`R`か`L`の時はheight必須。
    if (!!opts.height) {
      styles.push(`height:${opts.height}px;`);
    }
    return styles.join('');
  };

  this.handleFrameInnerTap = e => {
    // 内部イベントを外部に伝播させない。
    e.stopPropagation();
  };

  this.handleFrameInnerScroll = e => {
    // 内部イベントを外部に伝播させない。
    e.stopPropagation();
  };

  this.handleWindowResize = () => {
    fadeOut();
  };

  this.handleWindowScroll = () => {
    fadeOut();
  };

  this.handleWindowClick = () => {
    // mouse環境は扱わない。
    if (isTouchEventSupported$1) {
      return;
    }
    fadeOut();
  };

  this.handleWindowTouchEnd = () => {
    fadeOut();
  };
};

riot$1.tag2('viron-popover', '<div class="Popover__frameOuter"> <div class="Popover__frameInner" riot-style="{getSize()};" onclick="{getClickHandler(\'handleFrameInnerTap\')}" ontouchstart="{getTouchStartHandler()}" ontouchmove="{getTouchMoveHandler()}" ontouchend="{getTouchEndHandler(\'handleFrameInnerTap\')}" onscroll="{handleFrameInnerScroll}"> <div class="Popover__content" ref="content"></div> </div> </div> <div class="Popover__arrow"></div>', '', 'class="Popover Popover--{opts.popoveropts.direction}" riot-style="{getPosition()};"', function(opts) {
    this.external(script$31);
});

var script$32 = function() {
  const store = this.riotx.get();

  this.popovers = store.getter(constants$5.POPOVERS);
  this.listen(constants$3.POPOVERS, () => {
    this.popovers = store.getter(constants$5.POPOVERS);
    this.update();
  });
};

riot$1.tag2('viron-application-popovers', '<virtual each="{popovers}"> <viron-popover id="{id}" tagname="{tagName}" tagopts="{tagOpts}" popoveropts="{popoverOpts}"></viron-popover> </virtual>', '', 'class="Application_Popovers"', function(opts) {
    this.external(script$32);
});

var script$33 = function() {};

riot$1.tag2('viron-application-poster', '<div class="Application_Poster__bg"></div> <div class="Application_Poster__overlay"></div> <div class="Application_Poster__content"> <viron-icon-logo class="Application_Poster__logo"></viron-icon-logo> <div>ホーム</div> </div>', '', 'class="Application_Poster"', function(opts) {
    this.external(script$33);
});

riot$1.tag2('viron-application-splash', '<div>TODO</div>', '', 'class="Application_Splash"', function(opts) {
});

var script$34 = function() {
  const store = this.riotx.get();

  let autoHideTimerID;

  const show = () => {
    // need to set delay after dom mountation.
    setTimeout(() => {
      this.root.classList.add('Toast--visible');
    }, 100);
  };

  const hide = () => {
    this.root.classList.remove('Toast--visible');
    // call action after the hide animation completes.
    setTimeout(() => {
      store.action(constants$1.TOASTS_REMOVE, this.opts.id);
    }, 1000);
  };

  this.on('mount', () => {
    show();
    if (this.opts.autohide) {
      autoHideTimerID = setTimeout(() => {
        hide();
      }, this.opts.timeout);
    }
  }).on('unmount', () => {
    clearTimeout(autoHideTimerID);
  });

  this.handleTap = () => {
    clearTimeout(autoHideTimerID);
    hide();
  };

  this.handleLinkTap = () => {
    window.open(this.opts.link);
  };
};

riot$1.tag2('viron-toast', '<div class="Toast__icon">TODO</div> <div class="Toast__message">{opts.message}</div> <div class="Toast__link" if="{!!opts.link}" onclick="{getClickHandler(\'handleLinkTap\')}" ontouchstart="{getTouchStartHandler()}" ontouchmove="{getTouchMoveHandler()}" ontouchend="{getTouchEndHandler(\'handleLinkTap\')}">{opts.linktext}</div>', '', 'class="Toast Toast--{opts.type}" onclick="{getClickHandler(\'handleTap\')}" ontouchstart="{getTouchStartHandler()}" ontouchmove="{getTouchMoveHandler()}" ontouchend="{getTouchEndHandler(\'handleTap\')}"', function(opts) {
    this.external(script$34);
});

var script$35 = function() {
  const store = this.riotx.get();

  this.toasts = store.getter(constants$5.TOASTS);

  this.listen(constants$3.TOASTS, () => {
    this.toasts = store.getter(constants$5.TOASTS);
    this.update();
  });
};

riot$1.tag2('viron-application-toasts', '<virtual each="{toasts}"> <viron-toast id="{id}" type="{type}" message="{message}" autohide="{autoHide}" timeout="{timeout}" link="{link}" linktext="{linkText}"></viron-toast> </virtual>', '', 'class="Application_Toasts"', function(opts) {
    this.external(script$35);
});

/**
     * Get current time in miliseconds
     */
    function now(){
        // yes, we defer the work to another function to allow mocking it
        // during the tests
        return now.get();
    }

    now.get = (typeof Date.now === 'function')? Date.now : function(){
        return +(new Date());
    };

    var now_1 = now;

/**
     */
    function throttle(fn, delay){
        var context, timeout, result, args,
            diff, prevCall = 0;
        function delayed(){
            prevCall = now_1();
            timeout = null;
            result = fn.apply(context, args);
        }
        function throttled(){
            context = this;
            args = arguments;
            diff = delay - (now_1() - prevCall);
            if (diff <= 0) {
                clearTimeout(timeout);
                delayed();
            } else if (! timeout) {
                timeout = setTimeout(delayed, diff);
            }
            return result;
        }
        throttled.cancel = function(){
            clearTimeout(timeout);
        };
        return throttled;
    }

    var throttle_1 = throttle;

var script$37 = function() {
  const updateText = () => {
    const json = JSON.stringify(this.opts.data, undefined, 4);
    let text = json.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    text = text.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, match => {
      let cls = 'number';
      if (/^"/.test(match)) {
        if (/:$/.test(match)) {
          cls = 'key';
        } else {
          cls = 'string';
        }
      } else if (/true|false/.test(match)) {
        cls = 'boolean';
      } else if (/null/.test(match)) {
        cls = 'null';
      }
      return '<span class="PrettyPrint__' + cls + '">' + match + '</span>';
    });
    this.refs.canvas.innerHTML = text;
  };

  this.on('mount', () => {
    updateText();
  }).on('updated', () => {
    updateText();
  });
};

riot$1.tag2('viron-prettyprint', '<pre class="PrettyPrint__pre" ref="canvas"></pre>', '', 'class="PrettyPrint {opts.class}"', function(opts) {
    this.external(script$37);
});

var script$38 = function() {
  // タイプ。
  this.type = this.opts.type || 'info';
  // iconの種類。
  this.icon = '';
  switch (this.opts.type) {
  case 'info':
    this.icon = 'info';
    break;
  case 'error':
    this.icon = 'exclamation';
    break;
  default:
    this.icon = 'info';
    break;
  }

  // タイトル。
  this.title = this.opts.title;
  // メッセージ。
  this.message = this.opts.message;

  // errorが渡された場合は最適化処理を行う。
  if (!!this.opts.error) {
    this.type = 'error';
    this.icon = 'close';
    this.title = this.title || this.opts.error.name || this.opts.error.statusText || 'Error';
    this.message = this.message || this.opts.error.message;
  }

  // prettyprintで表示させる内容。
  this.detail = null;

  this.on('mount', () => {
    // エラーがPromiseであれば解析する。
    const error = this.opts.error;
    if (!error) {
      return;
    }
    if (error instanceof Error) {
      return;
    }
    Promise
      .resolve()
      .then(() => {
        if (!!error.json) {
          return error.json();
        }
        return error.text().then(text => JSON.parse(text));
      })
      .then(json => {
        const error = json.error;
        this.detail = error;
        !this.opts.title && !!error.name && (this.title = error.name);
        !this.opts.message && !!error.data && !!error.data.message && (this.message = error.data.message);
        this.update();
      })
      .catch(() => {
        // do nothing on purpose.
        return Promise.resolve();
      });
  });
};

riot$1.tag2('viron-message', '<div class="Message__head"> <div class="Message__icon"> <viron-icon type="{icon}"></viron-icon> </div> <div class="Message__title">{title}</div> </div> <div class="Message__text" if="{!!message}">{message}</div> <viron-prettyprint class="Message__error" if="{!!detail}" data="{detail}"></viron-prettyprint>', '', 'class="Message Message--{type}"', function(opts) {
    this.external(script$38);
});

var script$39 = function() {
  this.handleDeleteButtonClick = () => {
    this.opts.onConfirm();
    this.close();
  };

  this.handleCancelButtonClick = () => {
    this.close();
  };
};

riot$1.tag2('viron-application-confirm', '<div class="Application__confirmHead"> <div class="Application__confirmTitle">エンドポイント削除</div> <div class="Application__confirmDescription">全てのエンドポイントが削除されます。個別に削除したい場合は各エンドポイントカード内の削除ボタンから行って下さい。</div> </div> <div class="Application__confirmTail"> <viron-button label="全て削除する" type="emphasis" onclick="{handleDeleteButtonClick}"></viron-button> <viron-button label="キャンセル" onclick="{handleCancelButtonClick}"></viron-button> </div>', '', 'class="Application__confirm"', function(opts) {
    this.external(script$39);
});

var script$40 = function() {
  this.handleClick = () => {
    if (this.opts.isdisabled) {
      return;
    }
    this.opts.onclick && this.opts.onclick(this.opts.id);
  };
};

riot$1.tag2('viron-button_', '<div class="Button__content"> <div class="Button__icon" if="{!!opts.icon}"> <viron-icon type="{opts.icon}"></viron-icon> </div> <div class="Button__label">{opts.label}</div> </div>', '', 'class="Button Button--{opts.type || \'primary\'} {opts.class} {opts.isdisabled ? \'Button--disabled\' : \'\'}" onclick="{handleClick}"', function(opts) {
    this.external(script$40);
});

var script$41 = function() {
  /**
   * undefined等の値を考慮した最適な値を返します。
   * @param {String|null} value
   * @return {String|null}
   */
  this.normalizeValue = value => {
    if (!isString_1(value)) {
      return null;
    }
    return value;
  };

  this.on('mount', () => {
    this.refs.input.value = this.normalizeValue(this.opts.text);
    this.opts.onchange(this.normalizeValue(this.opts.text), this.opts.id);
  }).on('updated', () => {
    const text = this.opts.text;
    if (!isString_1(text)) {
      this.refs.input.value = this.normalizeValue(text);
    }
  });

  this.handleClick = () => {
    this.refs.form.focus();
  };

  this.handleFormSubmit = e => {
    e.preventDefault();
    this.opts.onchange && this.opts.onchange(this.normalizeValue(this.opts.text), this.opts.id);
  };

  // `blur`時に`change`イベントが発火する等、`change`イベントでは不都合が多い。
  // そのため、`input`イベントを積極的に使用する。
  this.handleInputInput = e => {
    e.preventUpdate = true;
    this.opts.onchange && this.opts.onchange(this.normalizeValue(e.target.value), this.opts.id);
  };

  this.handleInputChange = e => {
    // `blur`時に`change`イベントが発火する。
    // 不都合な挙動なのでイベント伝播を止める。
    e.stopPropagation();
  };
};

riot$1.tag2('viron-textinputtt', '<div class="Textinput__label" if="{!!opts.label}">{opts.label}</div> <form ref="form" onsubmit="{handleFormSubmit}"> <input class="Textinput__input" ref="input" type="{opts.type || \'text\'}" riot-value="{normalizeValue(opts.text)}" placeholder="{opts.placeholder || \'\'}" pattern="{opts.pattern}" disabled="{!!opts.isdisabled}" oninput="{handleInputInput}" onchange="{handleInputChange}"> </form>', '', 'class="Textinput {\'Textinput--ghost\' : (opts.theme === \'ghost\'), \'Textinput--disabled\' : opts.isdisabled}" onclick="{handleClick}"', function(opts) {
    this.external(script$41);
});

var script$42 = function() {
  /**
   * undefined等の値を考慮した最適な値を返します。
   * @param {String|null} value
   * @return {String|null}
   */
  this.normalizeValue = value => {
    if (!isString_1(value)) {
      return null;
    }
    return value;
  };

  this.on('mount', () => {
    this.refs.textarea.value = this.normalizeValue(this.opts.text);
    this.opts.onchange(this.normalizeValue(this.opts.text), this.opts.id);
  }).on('updated', () => {
    const text = this.opts.text;
    if (!isString_1(text)) {
      this.refs.textarea.value = this.normalizeValue(text);
    }
  });

  this.handleClick = () => {
    this.refs.form.focus();
  };

  this.handleFormSubmit = e => {
    e.preventDefault();
    this.opts.onchange && this.opts.onchange(this.normalizeValue(this.opts.text), this.opts.id);
  };

  // `blur`時に`change`イベントが発火する等、`change`イベントでは不都合が多い。
  // そのため、`input`イベントを積極的に使用する。
  this.handleTextareaInput = e => {
    e.preventUpdate = true;
    this.opts.onchange && this.opts.onchange(this.normalizeValue(e.target.value), this.opts.id);
  };

  this.handleTextareaChange = e => {
    // `blur`時に`change`イベントが発火する。
    // 不都合な挙動なのでイベント伝播を止める。
    e.stopPropagation();
  };
};

riot$1.tag2('viron-textarea', '<div class="Textarea__label" if="{!!opts.label}">{opts.label}</div> <form class="Textarea__content" ref="form" onsubmit="{handleFormSubmit}"> <textarea class="Textarea__input" ref="textarea" riot-value="{normalizeValue(opts.text)}" maxlength="{opts.maxlength}" placeholder="{opts.placeholder || \'\'}" disabled="{!!opts.isdisabled}" oninput="{handleTextareaInput}" onchange="{handleTextareaChange}"></textarea> </form>', '', 'class="Textarea {\'Textarea--disabled\' : opts.isdisabled}" onclick="{handleClick}"', function(opts) {
    this.external(script$42);
});

var script$43 = function() {
  const store = this.riotx.get();

  this.isExist = false;
  this.endpointURL = '';
  this.memo = '';

  this.handleEndpointURLChange = newEndpointURL => {
    this.endpointURL = newEndpointURL;
    this.isExist = !!store.getter(constants$5.ENDPOINTS_ONE_BY_URL, newEndpointURL);
    this.update();
  };

  this.handleMemoChange = newMemo => {
    this.memo = newMemo;
    this.update();
  };

  this.handleRegisterButtonClick = () => {
    Promise
      .resolve()
      .then(() => store.action(constants$1.ENDPOINTS_ADD, this.endpointURL, this.memo))
      .then(() => store.action(constants$1.TOASTS_ADD, {
        message: 'エンドポイントを追加しました。'
      }))
      .then(() => {
        this.close();
      })
      .catch(err => {
        let autoHide = true;
        let linkText;
        let link;
        // サーバが自己証明書を使用している場合にページ遷移を促す。
        if (this.endpointURL.startsWith('https://')) {
          autoHide = false;
          linkText = 'Self-Signed Certificate?';
          link = this.endpointURL;
        }
        store.action(constants$1.TOASTS_ADD, {
          message: err.message,
          autoHide,
          linkText,
          link
        });
      });
  };

  this.handleCancelButtonClick = () => {
    this.close();
  };
};

riot$1.tag2('viron-application-entry', '<div class="Application__entryTitle">新しい管理画面を作成する</div> <div class="Application__entryMessage" if="{isExist}">そのエンドポイントは既に登録済みです。</div> <div class="Application__entryForm"> <viron-textinput label="エンドポイント" text="{endpointURL}" onchange="{handleEndpointURLChange}"></viron-textinput> <viron-textarea label="メモ" text="{memo}" onchange="{handleMemoChange}"></viron-textarea> </div> <div class="Application__entryControls"> <viron-button type="primary" isdisabled="{isExist}" onclick="{handleRegisterButtonClick}" label="新規作成"></viron-button> <viron-button type="secondary" onclick="{handleCancelButtonClick}" label="キャンセル"></viron-button> </div>', '', 'class="Application__entry"', function(opts) {
    this.external(script$43);
});

var script$44 = function() {
  const store = this.riotx.get();

  // ドロップ待受中か否か。
  this.isWatching = store.getter(constants$5.APPLICATION_ISDRAGGING);
  // ドロップ可能な状態か否か。
  this.isDroppable = false;

  this.listen(constants$3.APPLICATION, () => {
    this.isWatching = store.getter(constants$5.APPLICATION_ISDRAGGING);
    this.update();
  });

  // ドラッグしている要素がドロップ領域に入った時の処理。
  this.handleDragEnter = e => {
    e.preventDefault();
    this.isDroppable = true;
    this.update();
  };

  // ドラッグしている要素がドロップ領域にある間の処理。
  this.handleDragOver = e => {
    e.preventDefault();
  };

  // ドラッグしている要素がドロップ領域から出た時の処理。
  this.handleDragLeave = () => {
    this.isDroppable = false;
    this.update();
  };

  // ドラッグしている要素がドロップ領域にドロップされた時の処理。
  this.handleDrop = e => {
    this.isDroppable = false;
    this.update();

    const endpointKey = e.dataTransfer.getData('text/plain');
    const newOrder = this.opts.order;
    Promise
      .resolve()
      .then(() => store.action(constants$1.ENDPOINTS_CHANGE_ORDER, endpointKey, newOrder))
      .catch(err => store.action(constants$1.MODALS_ADD, 'viron-message', {
        error: err
      }));
  };
};

riot$1.tag2('viron-application-order-droparea', '<div class="Application__orderDropareaContent"></div> <div class="Application__orderDropareaHandler" ondragenter="{handleDragEnter}" ondragover="{handleDragOver}" ondragleave="{handleDragLeave}" ondrop="{handleDrop}"></div>', '', 'class="Application__orderDroparea {\'Application__orderDroparea--watching\' : isWatching, \'Application__orderDroparea--droppable\' : isDroppable}"', function(opts) {
    this.external(script$44);
});

var script$45 = function() {
  const store = this.riotx.get();

  // ドラッグ開始時の処理。
  this.handleDragStart = e => {
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', this.opts.endpoint.key);

    Promise
      .resolve()
      .then(() => store.action(constants$1.APPLICATION_DRAG_START))
      .catch(err => store.action(constants$1.MODALS_ADD, 'viron-message', {
        error: err
      }));
  };

  // ドラッグしている間の処理。
  this.handleDrag = () => {
  };

  // ドラッグ終了時の処理。
  this.handleDragEnd = () => {
    Promise
      .resolve()
      .then(() => store.action(constants$1.APPLICATION_DRAG_END))
      .catch(err => store.action(constants$1.MODALS_ADD, 'viron-message', {
        error: err
      }));
  };
};

riot$1.tag2('viron-application-order-item', '<div class="Application__orderItemHead"> <div class="Application__orderItemThumbnail" riot-style="background-image:url({opts.endpoint.thumbnail});"></div> <div class="Application__orderItemName">{opts.endpoint.name || \'-\'}</div> </div> <div class="Application__orderItemBody"> <div class="Application__orderItemUrl"> <div class="Application__orderItemUrlIcon"> <viron-icon type="link"></viron-icon> </div> <div class="Application__orderItemUrlLabel">{opts.endpoint.url}</div> </div> </div>', '', 'class="Application__orderItem" draggable="{true}" ondragstart="{handleDragStart}" ondrag="{handleDrag}" ondragend="{handleDragEnd}"', function(opts) {
    this.external(script$45);
});

var script$46 = function() {
  const store = this.riotx.get();

  this.endpoints = store.getter(constants$5.ENDPOINTS_BY_ORDER);

  this.listen(constants$3.ENDPOINTS, () => {
    this.endpoints = store.getter(constants$5.ENDPOINTS_BY_ORDER);
    this.update();
  });
};

riot$1.tag2('viron-application-order', '<div class="Application__orderTitle">並び順を変更</div> <div class="Application__orderDescription">ドラッグ&ドロップでエンドポイントの並び順を変更できます。</div> <div class="Application__orderPlayground"> <viron-application-order-droparea order="{0}"></viron-application-order-droparea> <virtual each="{endpoint, idx in endpoints}"> <viron-application-order-item endpoint="{endpoint}"></viron-application-order-item> <viron-application-order-droparea order="{idx + 1}"></viron-application-order-droparea> </virtual> </div>', '', 'class="Application__order"', function(opts) {
    this.external(script$46);
});

var script$36 = function() {
  const store = this.riotx.get();

  this.isLaunched = store.getter(constants$5.APPLICATION_ISLAUNCHED);
  this.isNavigating = store.getter(constants$5.APPLICATION_ISNAVIGATING);
  this.isNetworking = store.getter(constants$5.APPLICATION_ISNETWORKING);
  // 表示すべきページの名前。
  this.pageName = store.getter(constants$5.LOCATION_NAME);
  // TOPページか否か。
  this.isTopPage = store.getter(constants$5.LOCATION_IS_TOP);
  // 表示すべきページのルーティング情報。
  this.pageRoute = store.getter(constants$5.LOCATION_ROUTE);
  // エンドポイント数。
  this.endpointsCount = store.getter(constants$5.ENDPOINTS_COUNT);
  // エンドポイントフィルター用のテキスト。
  this.endpointFilterText = store.getter(constants$5.APPLICATION_ENDPOINT_FILTER_TEXT);
  // バグに対処するため、ブラウザ毎クラス設定目的でブラウザ名を取得する。
  this.usingBrowser = store.getter(constants$5.UA_USING_BROWSER);
  // レスポンシブデザイン用。
  this.layoutType = store.getter(constants$5.LAYOUT_TYPE);
  this.isDesktop = store.getter(constants$5.LAYOUT_IS_DESKTOP);
  this.isMobile = store.getter(constants$5.LAYOUT_IS_MOBILE);

  this.listen(constants$3.APPLICATION, () => {
    this.isLaunched = store.getter(constants$5.APPLICATION_ISLAUNCHED);
    this.isNavigating = store.getter(constants$5.APPLICATION_ISNAVIGATING);
    this.isNetworking = store.getter(constants$5.APPLICATION_ISNETWORKING);
    this.endpointFilterText = store.getter(constants$5.APPLICATION_ENDPOINT_FILTER_TEXT);
    this.update();
  });
  this.listen(constants$3.LOCATION, () => {
    this.pageName = store.getter(constants$5.LOCATION_NAME);
    this.isTopPage = store.getter(constants$5.LOCATION_IS_TOP);
    this.pageRoute = store.getter(constants$5.LOCATION_ROUTE);
    this.update();
  });
  this.listen(constants$3.ENDPOINTS, () => {
    this.endpointsCount = store.getter(constants$5.ENDPOINTS_COUNT);
    this.update();
  });
  this.listen(constants$3.UA, () => {
    this.usingBrowser = store.getter(constants$5.UA_USING_BROWSER);
    this.update();
  });
  this.listen(constants$3.LAYOUT, () => {
    this.layoutType = store.getter(constants$5.LAYOUT_TYPE);
    this.isDesktop = store.getter(constants$5.LAYOUT_IS_DESKTOP);
    this.isMobile = store.getter(constants$5.LAYOUT_IS_MOBILE);
    this.update();
  });

  // resize時にvironアプリケーションの表示サイズを更新します。
  // resizeイベントハンドラーの発火回数を減らす。
  const handleResize = throttle_1(() => {
    const width = window.innerWidth;
    const height = window.innerHeight;
    store.action(constants$1.LAYOUT_UPDATE_SIZE, width, height);
  }, 1000);
  this.on('mount', () => {
    window.addEventListener('resize', handleResize);
  }).on('unmount', () => {
    window.removeEventListener('resize', handleResize);
  });

  this.handleEntryMenuItemClick = () => {
    Promise
      .resolve()
      .then(() => store.action(constants$1.MODALS_ADD, 'viron-application-entry'))
      .catch(err => store.action(constants$1.MODALS_ADD, 'viron-message', {
        error: err
      }));
  };

  this.handleDownloadMenuItemClick = () => {
    const endpoints = store.getter(constants$5.ENDPOINTS_WITHOUT_TOKEN);
    download(JSON.stringify(endpoints), 'endpoints.json', 'application/json');
  };

  this.handleFileChange = e => {
    const inputFile = e.target;
    const file = inputFile.files[0];

    // ファイルを取得出来たか。
    if (!file) {
      inputFile.value = null;
      return;
    }

    // ファイルがjsonであるか
    // Edge v.15環境で`file/type`値が空文字になるため、Edge以外の環境のみtypeチェックを行う。
    if (!store.getter(constants$5.UA_IS_EDGE) && file.type !== 'application/json') {
      store.action(constants$1.MODALS_ADD, 'viron-message', {
        title: 'エンドポイント追加 失敗',
        message: 'JSONファイルを指定してください。',
        type: 'error'
      });
      inputFile.value = null;
      return;
    }

    // ファイルをテキストとして読み込む。
    const reader = new FileReader();
    reader.readAsText(file);

    // 読み込みが失敗した。
    reader.onerror = err => {
      store.action(constants$1.MODALS_ADD, 'viron-message', {
        title: 'エンドポイント追加 失敗',
        message: 'ファイルの読み込みに失敗しました。',
        error: err
      });
      inputFile.value = null;
    };

    // 読み込みが成功し、完了した。
    reader.onload = event => {
      const text = event.target.result;

      // エンドポイント追加処理開始
      Promise
        .resolve()
        .then(() => {
          const endpoints = JSON.parse(text);
          return store.action(constants$1.ENDPOINTS_MERGE_ALL, endpoints);
        })
        .then(() => store.action(constants$1.MODALS_ADD, 'viron-message', {
          title: 'エンドポイント追加',
          message: 'エンドポイントが一覧に追加されました。'
        }))
        .catch(err => store.action(constants$1.MODALS_ADD, 'viron-message', {
          title: 'エンドポイント追加 失敗',
          error: err
        }));
      // inputしたjsonをリセットする。
      inputFile.value = null;
    };
  };

  this.handleOrderMenuItemClick = () => {
    store.action(constants$1.MODALS_ADD, 'viron-application-order');
  };

  this.handleClearMenuItemClick = () => {
    Promise
      .resolve()
      .then(() => store.action(constants$1.MODALS_ADD, 'viron-application-confirm', {
        onConfirm: () => {
          store.action(constants$1.ENDPOINTS_REMOVE_ALL);
        }
      }))
      .catch(err => store.action(constants$1.MODALS_ADD, 'viron-message', {
        error: err
      }));
  };

  this.handleFilterChange = newText => {
    Promise
      .resolve()
      .then(() => store.action(constants$1.APPLICATION_UPDATE_ENDPOINT_FILTER_TEXT, newText))
      .catch(err => store.action(constants$1.MODALS_ADD, 'viron-message', {
        error: err
      }));
  };
};

riot$1.tag2('viron', '<div class="Application__container"> <div class="Application__aside" if="{isDesktop}"> <viron-application-poster if="{isTopPage}"></viron-application-poster> <viron-application-menu if="{!isTopPage}"></viron-application-menu> </div> <div class="Application__header"> <viron-application-header></viron-application-header> </div> <div class="Application__main"> <div class="Application__pageInfo">TODO</div> <div class="Application__page"> <div data-is="viron-{pageName}-page" route="{pageRoute}"></div> </div> </div> </div> <viron-application-drawers></viron-application-drawers> <viron-application-modals></viron-application-modals> <viron-application-popovers></viron-application-popovers> <viron-application-toasts></viron-application-toasts> <viron-progress-linear isactive="{isNavigating || isNetworking}"></viron-progress-linear> <viron-progress-circular if="{isNetworking}"></viron-progress-circular> <viron-application-blocker if="{isNavigating}"></viron-application-blocker> <viron-application-splash if="{!isLaunched}"></viron-application-splash>', '', 'class="Application Application--{usingBrowser} Application--{layoutType}"', function(opts) {
    this.external(script$36);
});

// エントリーポイント。
document.addEventListener('DOMContentLoaded', () => {
  let mainStore;
  Promise
    .resolve()
    .then(() => mixin.init())
    .then(() => store$1.init())
    .then(store => {
      mainStore = store;
      // debug用にglobal公開しておく。
      window.store = store;
    })
    .then(() => {
      riot$1.mount('viron');
    })
    .then(() => Promise.all([
      mainStore.action(constants$1.ENDPOINTS_TIDY_UP_ORDER),
      mainStore.action(constants$1.UA_SETUP)
    ]))
    .then(() => router.init(mainStore))
    .catch(err => mainStore.action(constants$1.MODALS_ADD, 'viron-message', {
      message: 'Viron起動に失敗しました。Viron担当者にお問い合わせ下さい。',
      error: err
    }));
});

}());
