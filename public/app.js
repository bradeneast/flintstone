(() => {
  // source/js/lit-html/lib/directive.js
  /**
   * @license
   * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
   * This code may only be used under the BSD style license found at
   * http://polymer.github.io/LICENSE.txt
   * The complete set of authors may be found at
   * http://polymer.github.io/AUTHORS.txt
   * The complete set of contributors may be found at
   * http://polymer.github.io/CONTRIBUTORS.txt
   * Code distributed by Google as part of the polymer project is also
   * subject to an additional IP rights grant found at
   * http://polymer.github.io/PATENTS.txt
   */
  const directives = new WeakMap();
  const directive = (f) => (...args) => {
    const d = f(...args);
    directives.set(d, true);
    return d;
  };
  const isDirective = (o) => {
    return typeof o === "function" && directives.has(o);
  };

  // source/js/lit-html/lib/dom.js
  /**
   * @license
   * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
   * This code may only be used under the BSD style license found at
   * http://polymer.github.io/LICENSE.txt
   * The complete set of authors may be found at
   * http://polymer.github.io/AUTHORS.txt
   * The complete set of contributors may be found at
   * http://polymer.github.io/CONTRIBUTORS.txt
   * Code distributed by Google as part of the polymer project is also
   * subject to an additional IP rights grant found at
   * http://polymer.github.io/PATENTS.txt
   */
  const isCEPolyfill = typeof window !== "undefined" && window.customElements != null && window.customElements.polyfillWrapFlushCallback !== void 0;
  const reparentNodes = (container, start, end = null, before = null) => {
    while (start !== end) {
      const n = start.nextSibling;
      container.insertBefore(start, before);
      start = n;
    }
  };
  const removeNodes = (container, start, end = null) => {
    while (start !== end) {
      const n = start.nextSibling;
      container.removeChild(start);
      start = n;
    }
  };

  // source/js/lit-html/lib/part.js
  /**
   * @license
   * Copyright (c) 2018 The Polymer Project Authors. All rights reserved.
   * This code may only be used under the BSD style license found at
   * http://polymer.github.io/LICENSE.txt
   * The complete set of authors may be found at
   * http://polymer.github.io/AUTHORS.txt
   * The complete set of contributors may be found at
   * http://polymer.github.io/CONTRIBUTORS.txt
   * Code distributed by Google as part of the polymer project is also
   * subject to an additional IP rights grant found at
   * http://polymer.github.io/PATENTS.txt
   */
  const noChange = {};
  const nothing = {};

  // source/js/lit-html/lib/template.js
  /**
   * @license
   * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
   * This code may only be used under the BSD style license found at
   * http://polymer.github.io/LICENSE.txt
   * The complete set of authors may be found at
   * http://polymer.github.io/AUTHORS.txt
   * The complete set of contributors may be found at
   * http://polymer.github.io/CONTRIBUTORS.txt
   * Code distributed by Google as part of the polymer project is also
   * subject to an additional IP rights grant found at
   * http://polymer.github.io/PATENTS.txt
   */
  const marker = `{{lit-${String(Math.random()).slice(2)}}}`;
  const nodeMarker = `<!--${marker}-->`;
  const markerRegex = new RegExp(`${marker}|${nodeMarker}`);
  const boundAttributeSuffix = "$lit$";
  class Template {
    constructor(result, element) {
      this.parts = [];
      this.element = element;
      const nodesToRemove = [];
      const stack = [];
      const walker = document.createTreeWalker(element.content, 133, null, false);
      let lastPartIndex = 0;
      let index = -1;
      let partIndex = 0;
      const {strings, values: {length}} = result;
      while (partIndex < length) {
        const node = walker.nextNode();
        if (node === null) {
          walker.currentNode = stack.pop();
          continue;
        }
        index++;
        if (node.nodeType === 1) {
          if (node.hasAttributes()) {
            const attributes = node.attributes;
            const {length: length2} = attributes;
            let count = 0;
            for (let i = 0; i < length2; i++) {
              if (endsWith(attributes[i].name, boundAttributeSuffix)) {
                count++;
              }
            }
            while (count-- > 0) {
              const stringForPart = strings[partIndex];
              const name = lastAttributeNameRegex.exec(stringForPart)[2];
              const attributeLookupName = name.toLowerCase() + boundAttributeSuffix;
              const attributeValue = node.getAttribute(attributeLookupName);
              node.removeAttribute(attributeLookupName);
              const statics = attributeValue.split(markerRegex);
              this.parts.push({type: "attribute", index, name, strings: statics});
              partIndex += statics.length - 1;
            }
          }
          if (node.tagName === "TEMPLATE") {
            stack.push(node);
            walker.currentNode = node.content;
          }
        } else if (node.nodeType === 3) {
          const data = node.data;
          if (data.indexOf(marker) >= 0) {
            const parent = node.parentNode;
            const strings2 = data.split(markerRegex);
            const lastIndex = strings2.length - 1;
            for (let i = 0; i < lastIndex; i++) {
              let insert;
              let s = strings2[i];
              if (s === "") {
                insert = createMarker();
              } else {
                const match = lastAttributeNameRegex.exec(s);
                if (match !== null && endsWith(match[2], boundAttributeSuffix)) {
                  s = s.slice(0, match.index) + match[1] + match[2].slice(0, -boundAttributeSuffix.length) + match[3];
                }
                insert = document.createTextNode(s);
              }
              parent.insertBefore(insert, node);
              this.parts.push({type: "node", index: ++index});
            }
            if (strings2[lastIndex] === "") {
              parent.insertBefore(createMarker(), node);
              nodesToRemove.push(node);
            } else {
              node.data = strings2[lastIndex];
            }
            partIndex += lastIndex;
          }
        } else if (node.nodeType === 8) {
          if (node.data === marker) {
            const parent = node.parentNode;
            if (node.previousSibling === null || index === lastPartIndex) {
              index++;
              parent.insertBefore(createMarker(), node);
            }
            lastPartIndex = index;
            this.parts.push({type: "node", index});
            if (node.nextSibling === null) {
              node.data = "";
            } else {
              nodesToRemove.push(node);
              index--;
            }
            partIndex++;
          } else {
            let i = -1;
            while ((i = node.data.indexOf(marker, i + 1)) !== -1) {
              this.parts.push({type: "node", index: -1});
              partIndex++;
            }
          }
        }
      }
      for (const n of nodesToRemove) {
        n.parentNode.removeChild(n);
      }
    }
  }
  const endsWith = (str, suffix) => {
    const index = str.length - suffix.length;
    return index >= 0 && str.slice(index) === suffix;
  };
  const isTemplatePartActive = (part3) => part3.index !== -1;
  const createMarker = () => document.createComment("");
  const lastAttributeNameRegex = /([ \x09\x0a\x0c\x0d])([^\0-\x1F\x7F-\x9F "'>=/]+)([ \x09\x0a\x0c\x0d]*=[ \x09\x0a\x0c\x0d]*(?:[^ \x09\x0a\x0c\x0d"'`<>=]*|"[^"]*|'[^']*))$/;

  // source/js/lit-html/lib/template-instance.js
  /**
   * @license
   * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
   * This code may only be used under the BSD style license found at
   * http://polymer.github.io/LICENSE.txt
   * The complete set of authors may be found at
   * http://polymer.github.io/AUTHORS.txt
   * The complete set of contributors may be found at
   * http://polymer.github.io/CONTRIBUTORS.txt
   * Code distributed by Google as part of the polymer project is also
   * subject to an additional IP rights grant found at
   * http://polymer.github.io/PATENTS.txt
   */
  class TemplateInstance {
    constructor(template6, processor, options) {
      this.__parts = [];
      this.template = template6;
      this.processor = processor;
      this.options = options;
    }
    update(values) {
      let i = 0;
      for (const part3 of this.__parts) {
        if (part3 !== void 0) {
          part3.setValue(values[i]);
        }
        i++;
      }
      for (const part3 of this.__parts) {
        if (part3 !== void 0) {
          part3.commit();
        }
      }
    }
    _clone() {
      const fragment = isCEPolyfill ? this.template.element.content.cloneNode(true) : document.importNode(this.template.element.content, true);
      const stack = [];
      const parts6 = this.template.parts;
      const walker = document.createTreeWalker(fragment, 133, null, false);
      let partIndex = 0;
      let nodeIndex = 0;
      let part3;
      let node = walker.nextNode();
      while (partIndex < parts6.length) {
        part3 = parts6[partIndex];
        if (!isTemplatePartActive(part3)) {
          this.__parts.push(void 0);
          partIndex++;
          continue;
        }
        while (nodeIndex < part3.index) {
          nodeIndex++;
          if (node.nodeName === "TEMPLATE") {
            stack.push(node);
            walker.currentNode = node.content;
          }
          if ((node = walker.nextNode()) === null) {
            walker.currentNode = stack.pop();
            node = walker.nextNode();
          }
        }
        if (part3.type === "node") {
          const part4 = this.processor.handleTextExpression(this.options);
          part4.insertAfterNode(node.previousSibling);
          this.__parts.push(part4);
        } else {
          this.__parts.push(...this.processor.handleAttributeExpressions(node, part3.name, part3.strings, this.options));
        }
        partIndex++;
      }
      if (isCEPolyfill) {
        document.adoptNode(fragment);
        customElements.upgrade(fragment);
      }
      return fragment;
    }
  }

  // source/js/lit-html/lib/template-result.js
  /**
   * @license
   * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
   * This code may only be used under the BSD style license found at
   * http://polymer.github.io/LICENSE.txt
   * The complete set of authors may be found at
   * http://polymer.github.io/AUTHORS.txt
   * The complete set of contributors may be found at
   * http://polymer.github.io/CONTRIBUTORS.txt
   * Code distributed by Google as part of the polymer project is also
   * subject to an additional IP rights grant found at
   * http://polymer.github.io/PATENTS.txt
   */
  const commentMarker = ` ${marker} `;
  class TemplateResult {
    constructor(strings, values, type, processor) {
      this.strings = strings;
      this.values = values;
      this.type = type;
      this.processor = processor;
    }
    getHTML() {
      const l = this.strings.length - 1;
      let html3 = "";
      let isCommentBinding = false;
      for (let i = 0; i < l; i++) {
        const s = this.strings[i];
        const commentOpen = s.lastIndexOf("<!--");
        isCommentBinding = (commentOpen > -1 || isCommentBinding) && s.indexOf("-->", commentOpen + 1) === -1;
        const attributeMatch = lastAttributeNameRegex.exec(s);
        if (attributeMatch === null) {
          html3 += s + (isCommentBinding ? commentMarker : nodeMarker);
        } else {
          html3 += s.substr(0, attributeMatch.index) + attributeMatch[1] + attributeMatch[2] + boundAttributeSuffix + attributeMatch[3] + marker;
        }
      }
      html3 += this.strings[l];
      return html3;
    }
    getTemplateElement() {
      const template6 = document.createElement("template");
      template6.innerHTML = this.getHTML();
      return template6;
    }
  }
  class SVGTemplateResult extends TemplateResult {
    getHTML() {
      return `<svg>${super.getHTML()}</svg>`;
    }
    getTemplateElement() {
      const template6 = super.getTemplateElement();
      const content = template6.content;
      const svgElement = content.firstChild;
      content.removeChild(svgElement);
      reparentNodes(content, svgElement.firstChild);
      return template6;
    }
  }

  // source/js/lit-html/lib/parts.js
  /**
   * @license
   * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
   * This code may only be used under the BSD style license found at
   * http://polymer.github.io/LICENSE.txt
   * The complete set of authors may be found at
   * http://polymer.github.io/AUTHORS.txt
   * The complete set of contributors may be found at
   * http://polymer.github.io/CONTRIBUTORS.txt
   * Code distributed by Google as part of the polymer project is also
   * subject to an additional IP rights grant found at
   * http://polymer.github.io/PATENTS.txt
   */
  const isPrimitive = (value) => {
    return value === null || !(typeof value === "object" || typeof value === "function");
  };
  const isIterable = (value) => {
    return Array.isArray(value) || !!(value && value[Symbol.iterator]);
  };
  class AttributeCommitter {
    constructor(element, name, strings) {
      this.dirty = true;
      this.element = element;
      this.name = name;
      this.strings = strings;
      this.parts = [];
      for (let i = 0; i < strings.length - 1; i++) {
        this.parts[i] = this._createPart();
      }
    }
    _createPart() {
      return new AttributePart(this);
    }
    _getValue() {
      const strings = this.strings;
      const l = strings.length - 1;
      let text3 = "";
      for (let i = 0; i < l; i++) {
        text3 += strings[i];
        const part3 = this.parts[i];
        if (part3 !== void 0) {
          const v = part3.value;
          if (isPrimitive(v) || !isIterable(v)) {
            text3 += typeof v === "string" ? v : String(v);
          } else {
            for (const t of v) {
              text3 += typeof t === "string" ? t : String(t);
            }
          }
        }
      }
      text3 += strings[l];
      return text3;
    }
    commit() {
      if (this.dirty) {
        this.dirty = false;
        this.element.setAttribute(this.name, this._getValue());
      }
    }
  }
  class AttributePart {
    constructor(committer) {
      this.value = void 0;
      this.committer = committer;
    }
    setValue(value) {
      if (value !== noChange && (!isPrimitive(value) || value !== this.value)) {
        this.value = value;
        if (!isDirective(value)) {
          this.committer.dirty = true;
        }
      }
    }
    commit() {
      while (isDirective(this.value)) {
        const directive4 = this.value;
        this.value = noChange;
        directive4(this);
      }
      if (this.value === noChange) {
        return;
      }
      this.committer.commit();
    }
  }
  class NodePart {
    constructor(options) {
      this.value = void 0;
      this.__pendingValue = void 0;
      this.options = options;
    }
    appendInto(container) {
      this.startNode = container.appendChild(createMarker());
      this.endNode = container.appendChild(createMarker());
    }
    insertAfterNode(ref) {
      this.startNode = ref;
      this.endNode = ref.nextSibling;
    }
    appendIntoPart(part3) {
      part3.__insert(this.startNode = createMarker());
      part3.__insert(this.endNode = createMarker());
    }
    insertAfterPart(ref) {
      ref.__insert(this.startNode = createMarker());
      this.endNode = ref.endNode;
      ref.endNode = this.startNode;
    }
    setValue(value) {
      this.__pendingValue = value;
    }
    commit() {
      if (this.startNode.parentNode === null) {
        return;
      }
      while (isDirective(this.__pendingValue)) {
        const directive4 = this.__pendingValue;
        this.__pendingValue = noChange;
        directive4(this);
      }
      const value = this.__pendingValue;
      if (value === noChange) {
        return;
      }
      if (isPrimitive(value)) {
        if (value !== this.value) {
          this.__commitText(value);
        }
      } else if (value instanceof TemplateResult) {
        this.__commitTemplateResult(value);
      } else if (value instanceof Node) {
        this.__commitNode(value);
      } else if (isIterable(value)) {
        this.__commitIterable(value);
      } else if (value === nothing) {
        this.value = nothing;
        this.clear();
      } else {
        this.__commitText(value);
      }
    }
    __insert(node) {
      this.endNode.parentNode.insertBefore(node, this.endNode);
    }
    __commitNode(value) {
      if (this.value === value) {
        return;
      }
      this.clear();
      this.__insert(value);
      this.value = value;
    }
    __commitText(value) {
      const node = this.startNode.nextSibling;
      value = value == null ? "" : value;
      const valueAsString = typeof value === "string" ? value : String(value);
      if (node === this.endNode.previousSibling && node.nodeType === 3) {
        node.data = valueAsString;
      } else {
        this.__commitNode(document.createTextNode(valueAsString));
      }
      this.value = value;
    }
    __commitTemplateResult(value) {
      const template6 = this.options.templateFactory(value);
      if (this.value instanceof TemplateInstance && this.value.template === template6) {
        this.value.update(value.values);
      } else {
        const instance = new TemplateInstance(template6, value.processor, this.options);
        const fragment = instance._clone();
        instance.update(value.values);
        this.__commitNode(fragment);
        this.value = instance;
      }
    }
    __commitIterable(value) {
      if (!Array.isArray(this.value)) {
        this.value = [];
        this.clear();
      }
      const itemParts = this.value;
      let partIndex = 0;
      let itemPart;
      for (const item of value) {
        itemPart = itemParts[partIndex];
        if (itemPart === void 0) {
          itemPart = new NodePart(this.options);
          itemParts.push(itemPart);
          if (partIndex === 0) {
            itemPart.appendIntoPart(this);
          } else {
            itemPart.insertAfterPart(itemParts[partIndex - 1]);
          }
        }
        itemPart.setValue(item);
        itemPart.commit();
        partIndex++;
      }
      if (partIndex < itemParts.length) {
        itemParts.length = partIndex;
        this.clear(itemPart && itemPart.endNode);
      }
    }
    clear(startNode = this.startNode) {
      removeNodes(this.startNode.parentNode, startNode.nextSibling, this.endNode);
    }
  }
  class BooleanAttributePart {
    constructor(element, name, strings) {
      this.value = void 0;
      this.__pendingValue = void 0;
      if (strings.length !== 2 || strings[0] !== "" || strings[1] !== "") {
        throw new Error("Boolean attributes can only contain a single expression");
      }
      this.element = element;
      this.name = name;
      this.strings = strings;
    }
    setValue(value) {
      this.__pendingValue = value;
    }
    commit() {
      while (isDirective(this.__pendingValue)) {
        const directive4 = this.__pendingValue;
        this.__pendingValue = noChange;
        directive4(this);
      }
      if (this.__pendingValue === noChange) {
        return;
      }
      const value = !!this.__pendingValue;
      if (this.value !== value) {
        if (value) {
          this.element.setAttribute(this.name, "");
        } else {
          this.element.removeAttribute(this.name);
        }
        this.value = value;
      }
      this.__pendingValue = noChange;
    }
  }
  class PropertyCommitter extends AttributeCommitter {
    constructor(element, name, strings) {
      super(element, name, strings);
      this.single = strings.length === 2 && strings[0] === "" && strings[1] === "";
    }
    _createPart() {
      return new PropertyPart(this);
    }
    _getValue() {
      if (this.single) {
        return this.parts[0].value;
      }
      return super._getValue();
    }
    commit() {
      if (this.dirty) {
        this.dirty = false;
        this.element[this.name] = this._getValue();
      }
    }
  }
  class PropertyPart extends AttributePart {
  }
  let eventOptionsSupported = false;
  (() => {
    try {
      const options = {
        get capture() {
          eventOptionsSupported = true;
          return false;
        }
      };
      window.addEventListener("test", options, options);
      window.removeEventListener("test", options, options);
    } catch (_e) {
    }
  })();
  class EventPart {
    constructor(element, eventName, eventContext) {
      this.value = void 0;
      this.__pendingValue = void 0;
      this.element = element;
      this.eventName = eventName;
      this.eventContext = eventContext;
      this.__boundHandleEvent = (e) => this.handleEvent(e);
    }
    setValue(value) {
      this.__pendingValue = value;
    }
    commit() {
      while (isDirective(this.__pendingValue)) {
        const directive4 = this.__pendingValue;
        this.__pendingValue = noChange;
        directive4(this);
      }
      if (this.__pendingValue === noChange) {
        return;
      }
      const newListener = this.__pendingValue;
      const oldListener = this.value;
      const shouldRemoveListener = newListener == null || oldListener != null && (newListener.capture !== oldListener.capture || newListener.once !== oldListener.once || newListener.passive !== oldListener.passive);
      const shouldAddListener = newListener != null && (oldListener == null || shouldRemoveListener);
      if (shouldRemoveListener) {
        this.element.removeEventListener(this.eventName, this.__boundHandleEvent, this.__options);
      }
      if (shouldAddListener) {
        this.__options = getOptions(newListener);
        this.element.addEventListener(this.eventName, this.__boundHandleEvent, this.__options);
      }
      this.value = newListener;
      this.__pendingValue = noChange;
    }
    handleEvent(event) {
      if (typeof this.value === "function") {
        this.value.call(this.eventContext || this.element, event);
      } else {
        this.value.handleEvent(event);
      }
    }
  }
  const getOptions = (o) => o && (eventOptionsSupported ? {capture: o.capture, passive: o.passive, once: o.once} : o.capture);

  // source/js/lit-html/lib/default-template-processor.js
  /**
   * @license
   * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
   * This code may only be used under the BSD style license found at
   * http://polymer.github.io/LICENSE.txt
   * The complete set of authors may be found at
   * http://polymer.github.io/AUTHORS.txt
   * The complete set of contributors may be found at
   * http://polymer.github.io/CONTRIBUTORS.txt
   * Code distributed by Google as part of the polymer project is also
   * subject to an additional IP rights grant found at
   * http://polymer.github.io/PATENTS.txt
   */
  class DefaultTemplateProcessor {
    handleAttributeExpressions(element, name, strings, options) {
      const prefix = name[0];
      if (prefix === ".") {
        const committer2 = new PropertyCommitter(element, name.slice(1), strings);
        return committer2.parts;
      }
      if (prefix === "@") {
        return [new EventPart(element, name.slice(1), options.eventContext)];
      }
      if (prefix === "?") {
        return [new BooleanAttributePart(element, name.slice(1), strings)];
      }
      const committer = new AttributeCommitter(element, name, strings);
      return committer.parts;
    }
    handleTextExpression(options) {
      return new NodePart(options);
    }
  }
  const defaultTemplateProcessor = new DefaultTemplateProcessor();

  // source/js/lit-html/lib/template-factory.js
  /**
   * @license
   * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
   * This code may only be used under the BSD style license found at
   * http://polymer.github.io/LICENSE.txt
   * The complete set of authors may be found at
   * http://polymer.github.io/AUTHORS.txt
   * The complete set of contributors may be found at
   * http://polymer.github.io/CONTRIBUTORS.txt
   * Code distributed by Google as part of the polymer project is also
   * subject to an additional IP rights grant found at
   * http://polymer.github.io/PATENTS.txt
   */
  function templateFactory(result) {
    let templateCache = templateCaches.get(result.type);
    if (templateCache === void 0) {
      templateCache = {
        stringsArray: new WeakMap(),
        keyString: new Map()
      };
      templateCaches.set(result.type, templateCache);
    }
    let template6 = templateCache.stringsArray.get(result.strings);
    if (template6 !== void 0) {
      return template6;
    }
    const key = result.strings.join(marker);
    template6 = templateCache.keyString.get(key);
    if (template6 === void 0) {
      template6 = new Template(result, result.getTemplateElement());
      templateCache.keyString.set(key, template6);
    }
    templateCache.stringsArray.set(result.strings, template6);
    return template6;
  }
  const templateCaches = new Map();

  // source/js/lit-html/lib/render.js
  /**
   * @license
   * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
   * This code may only be used under the BSD style license found at
   * http://polymer.github.io/LICENSE.txt
   * The complete set of authors may be found at
   * http://polymer.github.io/AUTHORS.txt
   * The complete set of contributors may be found at
   * http://polymer.github.io/CONTRIBUTORS.txt
   * Code distributed by Google as part of the polymer project is also
   * subject to an additional IP rights grant found at
   * http://polymer.github.io/PATENTS.txt
   */
  const parts4 = new WeakMap();
  const render = (result, container, options) => {
    let part3 = parts4.get(container);
    if (part3 === void 0) {
      removeNodes(container, container.firstChild);
      parts4.set(container, part3 = new NodePart(Object.assign({templateFactory}, options)));
      part3.appendInto(container);
    }
    part3.setValue(result);
    part3.commit();
  };

  // source/js/lit-html/lit-html.js
  /**
   * @license
   * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
   * This code may only be used under the BSD style license found at
   * http://polymer.github.io/LICENSE.txt
   * The complete set of authors may be found at
   * http://polymer.github.io/AUTHORS.txt
   * The complete set of contributors may be found at
   * http://polymer.github.io/CONTRIBUTORS.txt
   * Code distributed by Google as part of the polymer project is also
   * subject to an additional IP rights grant found at
   * http://polymer.github.io/PATENTS.txt
   */
  if (typeof window !== "undefined") {
    (window["litHtmlVersions"] || (window["litHtmlVersions"] = [])).push("1.2.1");
  }
  const html = (strings, ...values) => new TemplateResult(strings, values, "html", defaultTemplateProcessor);
  const svg = (strings, ...values) => new SVGTemplateResult(strings, values, "svg", defaultTemplateProcessor);

  // source/js/functions/setCurrentDocument.js
  var setCurrentDocument_default = (index) => {
    setState("currentDocument", state_default.currentUser.documents[index]);
    if (state_default.showPreview)
      renderPreview_default();
  };

  // source/js/functions/addDocument.js
  var addDocument_default = () => {
    let newDocument = {id: "New Document", body: ""};
    let documents = state_default.currentUser.documents;
    documents.push(newDocument);
    setState("currentUser", state_default.currentUser);
    setCurrentDocument_default(documents.length - 1);
  };

  // source/js/functions/removeDocument.js
  var removeDocument_default = (index) => {
    let docs = state_default.currentUser.documents;
    let currentDocument = docs[index];
    if (!confirm(`Are you sure you want to delete ${currentDocument.id}?`))
      return;
    docs.splice(index, 1);
    state_default.currentUser.documents = docs;
    setState("currentUser", state_default.currentUser);
    setState("currentDocument", state_default.currentUser.documents[0]);
    if (state_default.showPreview)
      renderPreview_default();
  };

  // source/js/functions/renameDocument.js
  var renameDocument_default = (newName) => {
    state_default.currentDocument.id = newName;
    setState("currentDocument", state_default.currentDocument);
  };

  // source/js/utils.js
  let $ = (selector, context = document) => context.querySelector(selector);
  let deepCopy = (obj) => JSON.parse(JSON.stringify(obj));
  let ls = (key, value) => value == void 0 ? JSON.parse(localStorage.getItem(key)) : localStorage.setItem(key, JSON.stringify(value));

  // source/js/functions/duplicateDocument.js
  var duplicateDocument_default = (index) => {
    let sourceDoc = state_default.currentUser.documents[index];
    let newDoc = deepCopy(sourceDoc);
    newDoc.id = sourceDoc.id + " copy";
    state_default.currentUser.documents.push(newDoc);
    setState("currentUser", state_default.currentUser);
    setState("currentDocument", newDoc);
    if (state_default.showPreview)
      renderPreview_default();
  };

  // source/js/components/Button.js
  var Button_default = ({
    title = "",
    action = null,
    content = "",
    className = "",
    disabled = false
  }) => html`<button ?disabled=${disabled} title=${title} class=${className} @click=${action}>${content}</button>`;

  // source/js/components/DocumentsPane.js
  var DocumentsPane_default = () => html`
<div class=pane>
  <h2>Documents</h2>
  ${state_default.currentDocument ? html`
    <div class=mount-children>
      <h3 data-active=true>
        <input type=text .value=${state_default.currentDocument.id} @input=${(event) => renameDocument_default(event.target.value)} />
      </h3>
    </div>
    ` : nothing}

  <ul class="sets mount-children">
    ${state_default.currentUser.documents.map((document2, documentIndex) => html`
    <li>
      ${Button_default({
    title: `Select ${document2.id}`,
    className: "link",
    action: () => setCurrentDocument_default(documentIndex),
    content: html`<h4>${document2.id}</h4>`
  })}
      ${Button_default({
    title: `Duplicate ${document2.id}`,
    className: "icon",
    action: () => duplicateDocument_default(documentIndex),
    content: "📄"
  })}
      ${state_default.currentUser.documents.length > 1 ? Button_default({
    title: `Delete ${document2.id}`,
    className: "icon",
    action: () => removeDocument_default(documentIndex),
    content: "🗑️"
  }) : nothing}
    </li>
    `)}
    <button @click=${addDocument_default}>Add Document</button>
  </ul>
</div>
`;

  // source/js/functions/setCurrentDataset.js
  var setCurrentDataset_default = (index) => {
    setState("currentDataset", state_default.currentUser.datasets[index]);
    if (state_default.showPreview)
      renderPreview_default();
  };

  // source/js/functions/addDataset.js
  var addDataset_default = () => {
    let newDataset = {id: "New Dataset", fields: [["", ""]]};
    let datasets = state_default.currentUser.datasets;
    datasets.push(newDataset);
    setState("currentUser", state_default.currentUser);
    setCurrentDataset_default(datasets.length - 1);
  };

  // source/js/functions/addField.js
  var addField_default = () => {
    state_default.currentDataset.fields.push(["", ""]);
    setState("currentDataset", state_default.currentDataset);
  };

  // source/js/functions/duplicateDataset.js
  var duplicateDataset_default = (index) => {
    let sourceSet = state_default.currentUser.datasets[index];
    let newSet = deepCopy(sourceSet);
    newSet.id = sourceSet.id + " copy";
    state_default.currentUser.datasets.push(newSet);
    setState("currentUser", state_default.currentUser);
    setState("currentDataset", newSet);
    if (state_default.showPreview)
      renderPreview_default();
  };

  // source/js/functions/removeDataset.js
  var removeDataset_default = (index) => {
    let sets = state_default.currentUser.datasets;
    let currentSet = sets[index];
    if (!confirm(`Are you sure you want to delete ${currentSet.id}?`))
      return;
    sets.splice(index, 1);
    state_default.currentUser.datasets = sets;
    setState("currentUser", state_default.currentUser);
    setState("currentDataset", state_default.currentUser.datasets[0]);
    if (state_default.showPreview)
      renderPreview_default();
  };

  // source/js/functions/renameDataset.js
  var renameDataset_default = (newName) => {
    state_default.currentDataset.id = newName;
    setState("currentDataset", state_default.currentDataset);
  };

  // source/js/functions/removeField.js
  var removeField_default = (index) => {
    state_default.currentDataset.fields.splice(index, 1);
    setState("currentDataset", state_default.currentDataset);
  };

  // source/js/functions/renameField.js
  var renameField_default = (index, newKey) => {
    let [key, value] = state_default.currentDataset.fields[index];
    state_default.currentDataset.fields[index] = [newKey, value];
    setState("currentDataset", state_default.currentDataset);
  };

  // source/js/functions/updateFieldValue.js
  var updateFieldValue_default = (index, newValue) => {
    let [key, value] = state_default.currentDataset.fields[index];
    state_default.currentDataset.fields[index] = [key, newValue];
    setState("currentDataset", state_default.currentDataset);
  };

  // source/js/functions/moveField.js
  var moveField_default = (fieldIndex, amount) => {
    let direction = amount > 0 ? "down" : "up";
    let field = state_default.currentDataset.fields[fieldIndex];
    let newIndex = fieldIndex + amount;
    state_default.currentDataset.fields.splice(fieldIndex, 1);
    state_default.currentDataset.fields.splice(newIndex, 0, field);
    setState("currentDataset", state_default.currentDataset);
    $(`.fields [data-index="${newIndex}"] [title*="${direction}"]`).focus();
  };

  // source/js/components/Icon.js
  var Icon_default = (content, className = "") => svg`
<svg class=${className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 216 216">
  ${content}
</svg>
`;

  // source/js/components/Field.js
  var Field_default = ([key, value], fieldIndex, datasetIndex) => {
    let keyID = `${datasetIndex}_${fieldIndex}_key`;
    let valueID = `${datasetIndex}_${fieldIndex}_value`;
    return html`
  <li data-index=${fieldIndex}>
    <key>
      <input @input=${(event) => renameField_default(fieldIndex, event.target.value)} .value=${key} type=text id=${keyID} />
    </key>
    <value>
      <input @input=${(event) => updateFieldValue_default(fieldIndex, event.target.value)} .value=${value} type=text
      id=${valueID} />
    </value>
    <actions>
      <div class=join-buttons>
        ${Button_default({
      title: "Move field up",
      className: "icon",
      disabled: fieldIndex == 0,
      content: Icon_default(svg`<polyline points="184.69 146.81 108 70.12 31.31 146.81" />`, "line"),
      action: () => moveField_default(fieldIndex, -1)
    })}
        ${Button_default({
      title: "Move field down",
      className: "icon",
      disabled: fieldIndex == state_default.currentDataset.fields.length - 1,
      content: Icon_default(svg`<polyline points="184.69 70.12 108 146.81 31.31 70.12" />`, "line"),
      action: () => moveField_default(fieldIndex, 1)
    })}
      </div>
      ${Button_default({
      title: "Delete field",
      className: "icon",
      content: "🗑️",
      action: () => removeField_default(fieldIndex)
    })}
    </actions>
  </li>
  `;
  };

  // source/js/components/DataPane.js
  var DataPane_default = () => html`
<div class=pane>
  <h2>Data</h2>
  ${state_default.currentDataset ? html`
    <div class=mount-children>

      <h3 data-active=true>
        <input type=text .value=${state_default.currentDataset.id} @input=${(event) => renameDataset_default(event.target.value)} />
      </h3>

      <ul class="fields mount-children">
        <li>
          <label>Name</label>
          <label>Value</label>
          <span></span>
        </li>
        ${state_default.currentDataset.fields.map((field, index) => Field_default(field, index, state_default.currentDataset.id))}
        <button @click=${addField_default}>Add Field</button>
      </ul>

    </div>` : nothing}

  <ul class="sets mount-children">
    ${state_default.currentUser.datasets.map((dataset, datasetIndex) => html`
    <li>
      ${Button_default({
    title: `Select ${dataset.id}`,
    className: "link",
    action: () => setCurrentDataset_default(datasetIndex),
    content: html`<h4>${dataset.id}</h4>`
  })}
      ${Button_default({
    title: `Duplicate ${dataset.id}`,
    className: "icon",
    action: () => duplicateDataset_default(datasetIndex),
    content: "📄"
  })}
      ${Button_default({
    title: `Delete ${dataset.id}`,
    className: "icon",
    action: () => removeDataset_default(datasetIndex),
    content: "🗑️"
  })}
    </li>
    `)}
    <button @click=${addDataset_default}>Add Data</button>
  </ul>
</div>
`;

  // source/js/lit-html/directives/unsafe-html.js
  /**
   * @license
   * Copyright (c) 2017 The Polymer Project Authors. All rights reserved.
   * This code may only be used under the BSD style license found at
   * http://polymer.github.io/LICENSE.txt
   * The complete set of authors may be found at
   * http://polymer.github.io/AUTHORS.txt
   * The complete set of contributors may be found at
   * http://polymer.github.io/CONTRIBUTORS.txt
   * Code distributed by Google as part of the polymer project is also
   * subject to an additional IP rights grant found at
   * http://polymer.github.io/PATENTS.txt
   */
  const previousValues = new WeakMap();
  const unsafeHTML = directive((value) => (part3) => {
    if (!(part3 instanceof NodePart)) {
      throw new Error("unsafeHTML can only be used in text bindings");
    }
    const previousValue = previousValues.get(part3);
    if (previousValue !== void 0 && isPrimitive(value) && value === previousValue.value && part3.value === previousValue.fragment) {
      return;
    }
    const template6 = document.createElement("template");
    template6.innerHTML = value;
    const fragment = document.importNode(template6.content, true);
    part3.setValue(fragment);
    previousValues.set(part3, {value, fragment});
  });

  // source/js/components/PreviewPane.js
  var PreviewPane_default = () => {
    let previewStyles = `<style>\r
  ${Object.entries(state_default.styles).map(([tagName, prop]) => `\r
      .preview ${tagName} {\r
        ${Object.entries(prop).map(([propName, propValue]) => {
      if (propName == "content")
        propValue = `"${propValue.replace(/"/g, '\\"')}"`;
      return [propName, propValue.replace(dataMatcher, hydrateFromDataset)].join(":");
    }).join(";")}\r
      }`).join("")}\r
  </style>`;
    return html`

  <toolbar>
    <button 
    ?data-active=${!state_default.showPreview} 
    title="Show editor" 
    class=icon
    @click=${() => setState("showPreview", false)}>
      ✍️
    </button>
    <button 
    ?data-active=${state_default.showPreview} 
    title="Show preview" 
    class=icon
    @click=${renderPreview_default}>
      👀
    </button>
  </toolbar>

  ${state_default.showPreview ? html`
      <div class=preview>
        <div class=preview__wrapper></div>
      </div>
      ${unsafeHTML(previewStyles)}` : html`
      <textarea class=editor @input=${(event) => state_default.currentDocument.body = event.target.value}>${state_default.currentDocument.body}</textarea>`}
`;
  };

  // source/js/functions/toggleDarkMode.js
  var toggleDarkMode_default = () => {
    document.documentElement.classList.toggle("dark", !state_default.dark);
    setState("dark", !state_default.dark);
  };

  // source/js/components/Header.js
  var Header_default = () => html`
<h1 id="logo">Contractly</h1>
<nav>
  <button title="Print the current document" class=icon @click=${() => {
    renderPreview_default();
    window.print();
  }}>🖨️</button>
  <button title="Switch to ${state_default.dark ? "light" : "dark"} theme" class=icon @click=${toggleDarkMode_default}>
    ${state_default.dark ? "🌝" : "🌞"}
  </button>
</nav>
`;

  // source/js/style_data.js
  let headingAdjustments = ["font-size", "font-weight", "line-height", "letter-spacing", "text-transform", "color"];
  let inlineElementAdjustments = ["font-weight", "letter-spacing", "text-transform", "color"];
  let headerFooterAdjustments = ["content", "color", "font-size", "font-weight", "text-transform", "letter-spacing"];
  let tags = {
    ".preview__wrapper": {
      normieName: "Global",
      useAdjustments: ["font-size", "line-height", "--space"]
    },
    ".preview__page": {
      normieName: "Pages",
      useAdjustments: ["padding-top", "padding-bottom", "padding-left", "padding-right"]
    },
    ".preview__page::before": {
      normieName: "Headers",
      useAdjustments: headerFooterAdjustments
    },
    ".preview__page::after": {
      normieName: "Footers",
      useAdjustments: headerFooterAdjustments
    },
    h1: {
      normieName: "Level 1 Headings",
      useAdjustments: headingAdjustments
    },
    h2: {
      normieName: "Level 2 Headings",
      useAdjustments: headingAdjustments
    },
    h3: {
      normieName: "Level 3 Headings",
      useAdjustments: headingAdjustments
    },
    h4: {
      normieName: "Level 4 Headings",
      useAdjustments: headingAdjustments
    },
    h5: {
      normieName: "Level 5 Headings",
      useAdjustments: headingAdjustments
    },
    h6: {
      normieName: "Level 6 Headings",
      useAdjustments: headingAdjustments
    },
    a: {
      normieName: "Links",
      useAdjustments: inlineElementAdjustments
    },
    strong: {
      normieName: "Bold Text",
      useAdjustments: inlineElementAdjustments
    },
    em: {
      normieName: "Italic Text",
      useAdjustments: inlineElementAdjustments
    },
    del: {
      normieName: "Strikethroughs",
      useAdjustments: inlineElementAdjustments
    },
    blockquote: {
      normieName: "Block Quotes",
      useAdjustments: ["color", "padding-top", "padding-bottom", "padding-left", "padding-right", "border-width", "border-color"]
    }
  };
  class Adjustment {
    constructor(type) {
      this.type = type;
    }
  }
  class Text extends Adjustment {
    constructor({placeholder}) {
      super("text");
      this.placeholder = placeholder || "";
    }
  }
  class Range extends Adjustment {
    constructor({
      min,
      max,
      step,
      unit
    }) {
      super("range");
      this.min = min || 0;
      this.max = max || 100;
      this.step = step || 1;
      this.unit = unit || "";
    }
  }
  class Select extends Adjustment {
    constructor({
      options,
      defaultValue
    }) {
      super("select");
      this.options = options || [];
      this.defaultValue = defaultValue || "";
    }
  }
  let adjustments = {
    content: new Text({
      placeholder: "{ date }"
    }),
    "font-size": new Range({
      min: 8,
      max: 72,
      step: 1,
      unit: "px"
    }),
    "font-weight": new Range({
      min: 300,
      max: 900,
      step: 50
    }),
    "letter-spacing": new Range({
      min: -5,
      max: 5,
      step: 0.2,
      unit: "px"
    }),
    "line-height": new Range({
      min: 0.5,
      max: 3,
      step: 0.1
    }),
    "--space": new Range({
      min: 0,
      max: 56,
      step: 1,
      unit: "px"
    }),
    "text-transform": new Select({
      defaultValue: "none",
      options: [
        "capitalize",
        "uppercase",
        "lowercase",
        "none"
      ]
    }),
    color: new Text({
      placeholder: "tomato"
    }),
    "border-color": new Text({
      placeholder: "dodgerblue"
    }),
    "border-width": new Range({
      min: 0,
      max: 10,
      step: 0.5,
      unit: "px"
    }),
    "padding-top": new Range({
      min: 0,
      max: 56,
      step: 1,
      unit: "px"
    }),
    "padding-bottom": new Range({
      min: 0,
      max: 56,
      step: 1,
      unit: "px"
    }),
    "padding-left": new Range({
      min: 0,
      max: 56,
      step: 1,
      unit: "px"
    }),
    "padding-right": new Range({
      min: 0,
      max: 56,
      step: 1,
      unit: "px"
    })
  };

  // source/js/functions/setPreviewStyle.js
  var setPreviewStyle_default = (tagName, propName, propValue) => {
    state_default.styles[tagName][propName] = propValue;
    setState("styles", state_default.styles);
  };

  // source/js/components/StyleAdjustment.js
  let range = ([tagName, {normieName}], [propName, {min, max, step, unit}]) => {
    let unitValue = state_default.styles[tagName][propName];
    return html`
  <label>
    <span class=label>
      <span class=label__name>${propName.replace(/-/g, " ")}</span>
      <span class=label__value>${unitValue || ""}</span>
    </span>
    <input value=${parseFloat(unitValue)} title='${normieName} ${propName}' min=${min} max=${max} step=${step} type=range
      @input=${(event) => setPreviewStyle_default(tagName, propName, event.target.value + unit)} />
  </label>`;
  };
  let text = ([tagName, {normieName}], [propName, {placeholder}]) => {
    let unitValue = state_default.styles[tagName][propName];
    return html`
  <label>
    <span class=label>
      <span class=label__name>${propName.replace(/-/g, " ")}</span>
    </span>
    <input placeholder=${placeholder} value=${unitValue || ""} title='${normieName} ${propName}' type=text
      @input=${(event) => setPreviewStyle_default(tagName, propName, event.target.value)} />
  </label>`;
  };
  let select = ([tagName, {normieName}], [propName, {options, defaultValue}]) => {
    let unitValue = state_default.styles[tagName][propName] || defaultValue;
    return html`
  <label>
    <span class=label>
      <span class=label__name>${propName.replace(/-/g, " ")}</span>
    </span>
    <select title='${normieName} ${propName}' value=${unitValue || ""} @input=${(event) => setPreviewStyle_default(tagName, propName, event.target.value)}>
      ${options.map((opt) => html`<option ?selected=${opt == unitValue}>${opt}</option>`)}
    </select>
  </label>`;
  };

  // source/js/components/StylesPane.js
  var StylesPane_default = () => html`
<div ?data-active=${state_default.showStyles} class="styles">
  <h2>Styles</h2>
  ${Button_default({
    title: `${state_default.showStyles ? "Close" : "Open"} style editor`,
    content: "✨",
    className: "icon style-editor-toggle",
    action: () => setState("showStyles", !state_default.showStyles)
  })}
  <div class=adjustments>
  ${Object.entries(tags).map(([tagName, {normieName, useAdjustments}]) => html`
    <div class=adjustment>
      <h3>${normieName}</h3>
      ${Object.entries(adjustments).map(([propName, propData]) => {
    if (!useAdjustments.includes(propName))
      return;
    let tagArgument = [tagName, {normieName, useAdjustments}];
    let propArgument = [propName, propData];
    switch (propData.type) {
      case "range":
        return range(tagArgument, propArgument);
      case "text":
        return text(tagArgument, propArgument);
      case "select":
        return select(tagArgument, propArgument);
    }
  })}
    </div>
  `)}
  </div>
</div>`;

  // source/js/state.js
  let state27 = ls("contractly_user") || {
    savedLocally: false,
    showPreview: false,
    showStyles: false,
    dark: false,
    currentDocument: null,
    currentDataset: null,
    styles: {},
    currentUser: {
      documents: [
        {
          id: "",
          body: ""
        }
      ],
      datasets: [
        {
          id: "",
          fields: []
        }
      ]
    }
  };
  let autoSaveWaiter = setTimeout(() => null, 0);
  function autoSave() {
    clearTimeout(autoSaveWaiter);
    autoSaveWaiter = setTimeout(() => {
      state27.savedLocally = true;
      ls("contractly_user", state27);
    }, 1e3);
  }
  function renderAll() {
    render(DocumentsPane_default(), $("section.left"));
    render(PreviewPane_default(), $("section.center"));
    render(html`${DataPane_default()}${StylesPane_default()}`, $("section.right"));
    render(Header_default(), $("header"));
  }
  function setState(key, value) {
    state27[key] = value;
    renderAll();
    autoSave();
  }
  var state_default = state27;

  // source/js/dom-purify/purify.js
  /*! @license DOMPurify | (c) Cure53 and other contributors | Released under the Apache license 2.0 and Mozilla Public License 2.0 | github.com/cure53/DOMPurify/blob/2.2.2/LICENSE */
  function _toConsumableArray(arr) {
    if (Array.isArray(arr)) {
      for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) {
        arr2[i] = arr[i];
      }
      return arr2;
    } else {
      return Array.from(arr);
    }
  }
  var hasOwnProperty = Object.hasOwnProperty;
  var setPrototypeOf = Object.setPrototypeOf;
  var isFrozen = Object.isFrozen;
  var freeze = Object.freeze;
  var seal = Object.seal;
  var create = Object.create;
  var _ref = typeof Reflect !== "undefined" && Reflect;
  var apply = _ref.apply;
  var construct = _ref.construct;
  if (!apply) {
    apply = function apply2(fun, thisValue, args) {
      return fun.apply(thisValue, args);
    };
  }
  if (!freeze) {
    freeze = function freeze2(x) {
      return x;
    };
  }
  if (!seal) {
    seal = function seal2(x) {
      return x;
    };
  }
  if (!construct) {
    construct = function construct2(Func, args) {
      return new (Function.prototype.bind.apply(Func, [null].concat(_toConsumableArray(args))))();
    };
  }
  var arrayForEach = unapply(Array.prototype.forEach);
  var arrayPop = unapply(Array.prototype.pop);
  var arrayPush = unapply(Array.prototype.push);
  var stringToLowerCase = unapply(String.prototype.toLowerCase);
  var stringMatch = unapply(String.prototype.match);
  var stringReplace = unapply(String.prototype.replace);
  var stringIndexOf = unapply(String.prototype.indexOf);
  var stringTrim = unapply(String.prototype.trim);
  var regExpTest = unapply(RegExp.prototype.test);
  var typeErrorCreate = unconstruct(TypeError);
  function unapply(func) {
    return function(thisArg) {
      for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        args[_key - 1] = arguments[_key];
      }
      return apply(func, thisArg, args);
    };
  }
  function unconstruct(func) {
    return function() {
      for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
        args[_key2] = arguments[_key2];
      }
      return construct(func, args);
    };
  }
  function addToSet(set, array) {
    if (setPrototypeOf) {
      setPrototypeOf(set, null);
    }
    var l = array.length;
    while (l--) {
      var element = array[l];
      if (typeof element === "string") {
        var lcElement = stringToLowerCase(element);
        if (lcElement !== element) {
          if (!isFrozen(array)) {
            array[l] = lcElement;
          }
          element = lcElement;
        }
      }
      set[element] = true;
    }
    return set;
  }
  function clone(object) {
    var newObject = create(null);
    var property = void 0;
    for (property in object) {
      if (apply(hasOwnProperty, object, [property])) {
        newObject[property] = object[property];
      }
    }
    return newObject;
  }
  var html2 = freeze(["a", "abbr", "acronym", "address", "area", "article", "aside", "audio", "b", "bdi", "bdo", "big", "blink", "blockquote", "body", "br", "button", "canvas", "caption", "center", "cite", "code", "col", "colgroup", "content", "data", "datalist", "dd", "decorator", "del", "details", "dfn", "dialog", "dir", "div", "dl", "dt", "element", "em", "fieldset", "figcaption", "figure", "font", "footer", "form", "h1", "h2", "h3", "h4", "h5", "h6", "head", "header", "hgroup", "hr", "html", "i", "img", "input", "ins", "kbd", "label", "legend", "li", "main", "map", "mark", "marquee", "menu", "menuitem", "meter", "nav", "nobr", "ol", "optgroup", "option", "output", "p", "picture", "pre", "progress", "q", "rp", "rt", "ruby", "s", "samp", "section", "select", "shadow", "small", "source", "spacer", "span", "strike", "strong", "style", "sub", "summary", "sup", "table", "tbody", "td", "template", "textarea", "tfoot", "th", "thead", "time", "tr", "track", "tt", "u", "ul", "var", "video", "wbr"]);
  var svg2 = freeze(["svg", "a", "altglyph", "altglyphdef", "altglyphitem", "animatecolor", "animatemotion", "animatetransform", "audio", "canvas", "circle", "clippath", "defs", "desc", "ellipse", "filter", "font", "g", "glyph", "glyphref", "hkern", "image", "line", "lineargradient", "marker", "mask", "metadata", "mpath", "path", "pattern", "polygon", "polyline", "radialgradient", "rect", "stop", "style", "switch", "symbol", "text", "textpath", "title", "tref", "tspan", "video", "view", "vkern"]);
  var svgFilters = freeze(["feBlend", "feColorMatrix", "feComponentTransfer", "feComposite", "feConvolveMatrix", "feDiffuseLighting", "feDisplacementMap", "feDistantLight", "feFlood", "feFuncA", "feFuncB", "feFuncG", "feFuncR", "feGaussianBlur", "feMerge", "feMergeNode", "feMorphology", "feOffset", "fePointLight", "feSpecularLighting", "feSpotLight", "feTile", "feTurbulence"]);
  var mathMl = freeze(["math", "menclose", "merror", "mfenced", "mfrac", "mglyph", "mi", "mlabeledtr", "mmultiscripts", "mn", "mo", "mover", "mpadded", "mphantom", "mroot", "mrow", "ms", "mspace", "msqrt", "mstyle", "msub", "msup", "msubsup", "mtable", "mtd", "mtext", "mtr", "munder", "munderover"]);
  var text2 = freeze(["#text"]);
  var html$1 = freeze(["accept", "action", "align", "alt", "autocapitalize", "autocomplete", "autopictureinpicture", "autoplay", "background", "bgcolor", "border", "capture", "cellpadding", "cellspacing", "checked", "cite", "class", "clear", "color", "cols", "colspan", "controls", "controlslist", "coords", "crossorigin", "datetime", "decoding", "default", "dir", "disabled", "disablepictureinpicture", "disableremoteplayback", "download", "draggable", "enctype", "enterkeyhint", "face", "for", "headers", "height", "hidden", "high", "href", "hreflang", "id", "inputmode", "integrity", "ismap", "kind", "label", "lang", "list", "loading", "loop", "low", "max", "maxlength", "media", "method", "min", "minlength", "multiple", "muted", "name", "noshade", "novalidate", "nowrap", "open", "optimum", "pattern", "placeholder", "playsinline", "poster", "preload", "pubdate", "radiogroup", "readonly", "rel", "required", "rev", "reversed", "role", "rows", "rowspan", "spellcheck", "scope", "selected", "shape", "size", "sizes", "span", "srclang", "start", "src", "srcset", "step", "style", "summary", "tabindex", "title", "translate", "type", "usemap", "valign", "value", "width", "xmlns"]);
  var svg$1 = freeze(["accent-height", "accumulate", "additive", "alignment-baseline", "ascent", "attributename", "attributetype", "azimuth", "basefrequency", "baseline-shift", "begin", "bias", "by", "class", "clip", "clippathunits", "clip-path", "clip-rule", "color", "color-interpolation", "color-interpolation-filters", "color-profile", "color-rendering", "cx", "cy", "d", "dx", "dy", "diffuseconstant", "direction", "display", "divisor", "dur", "edgemode", "elevation", "end", "fill", "fill-opacity", "fill-rule", "filter", "filterunits", "flood-color", "flood-opacity", "font-family", "font-size", "font-size-adjust", "font-stretch", "font-style", "font-variant", "font-weight", "fx", "fy", "g1", "g2", "glyph-name", "glyphref", "gradientunits", "gradienttransform", "height", "href", "id", "image-rendering", "in", "in2", "k", "k1", "k2", "k3", "k4", "kerning", "keypoints", "keysplines", "keytimes", "lang", "lengthadjust", "letter-spacing", "kernelmatrix", "kernelunitlength", "lighting-color", "local", "marker-end", "marker-mid", "marker-start", "markerheight", "markerunits", "markerwidth", "maskcontentunits", "maskunits", "max", "mask", "media", "method", "mode", "min", "name", "numoctaves", "offset", "operator", "opacity", "order", "orient", "orientation", "origin", "overflow", "paint-order", "path", "pathlength", "patterncontentunits", "patterntransform", "patternunits", "points", "preservealpha", "preserveaspectratio", "primitiveunits", "r", "rx", "ry", "radius", "refx", "refy", "repeatcount", "repeatdur", "restart", "result", "rotate", "scale", "seed", "shape-rendering", "specularconstant", "specularexponent", "spreadmethod", "startoffset", "stddeviation", "stitchtiles", "stop-color", "stop-opacity", "stroke-dasharray", "stroke-dashoffset", "stroke-linecap", "stroke-linejoin", "stroke-miterlimit", "stroke-opacity", "stroke", "stroke-width", "style", "surfacescale", "systemlanguage", "tabindex", "targetx", "targety", "transform", "text-anchor", "text-decoration", "text-rendering", "textlength", "type", "u1", "u2", "unicode", "values", "viewbox", "visibility", "version", "vert-adv-y", "vert-origin-x", "vert-origin-y", "width", "word-spacing", "wrap", "writing-mode", "xchannelselector", "ychannelselector", "x", "x1", "x2", "xmlns", "y", "y1", "y2", "z", "zoomandpan"]);
  var mathMl$1 = freeze(["accent", "accentunder", "align", "bevelled", "close", "columnsalign", "columnlines", "columnspan", "denomalign", "depth", "dir", "display", "displaystyle", "encoding", "fence", "frame", "height", "href", "id", "largeop", "length", "linethickness", "lspace", "lquote", "mathbackground", "mathcolor", "mathsize", "mathvariant", "maxsize", "minsize", "movablelimits", "notation", "numalign", "open", "rowalign", "rowlines", "rowspacing", "rowspan", "rspace", "rquote", "scriptlevel", "scriptminsize", "scriptsizemultiplier", "selection", "separator", "separators", "stretchy", "subscriptshift", "supscriptshift", "symmetric", "voffset", "width", "xmlns"]);
  var xml = freeze(["xlink:href", "xml:id", "xlink:title", "xml:space", "xmlns:xlink"]);
  var MUSTACHE_EXPR = seal(/\{\{[\s\S]*|[\s\S]*\}\}/gm);
  var ERB_EXPR = seal(/<%[\s\S]*|[\s\S]*%>/gm);
  var DATA_ATTR = seal(/^data-[\-\w.\u00B7-\uFFFF]/);
  var ARIA_ATTR = seal(/^aria-[\-\w]+$/);
  var IS_ALLOWED_URI = seal(/^(?:(?:(?:f|ht)tps?|mailto|tel|callto|cid|xmpp):|[^a-z]|[a-z+.\-]+(?:[^a-z+.\-:]|$))/i);
  var IS_SCRIPT_OR_DATA = seal(/^(?:\w+script|data):/i);
  var ATTR_WHITESPACE = seal(/[\u0000-\u0020\u00A0\u1680\u180E\u2000-\u2029\u205F\u3000]/g);
  var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function(obj) {
    return typeof obj;
  } : function(obj) {
    return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
  };
  function _toConsumableArray$1(arr) {
    if (Array.isArray(arr)) {
      for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) {
        arr2[i] = arr[i];
      }
      return arr2;
    } else {
      return Array.from(arr);
    }
  }
  var getGlobal = function getGlobal2() {
    return typeof window === "undefined" ? null : window;
  };
  var _createTrustedTypesPolicy = function _createTrustedTypesPolicy2(trustedTypes, document2) {
    if ((typeof trustedTypes === "undefined" ? "undefined" : _typeof(trustedTypes)) !== "object" || typeof trustedTypes.createPolicy !== "function") {
      return null;
    }
    var suffix = null;
    var ATTR_NAME = "data-tt-policy-suffix";
    if (document2.currentScript && document2.currentScript.hasAttribute(ATTR_NAME)) {
      suffix = document2.currentScript.getAttribute(ATTR_NAME);
    }
    var policyName = "dompurify" + (suffix ? "#" + suffix : "");
    try {
      return trustedTypes.createPolicy(policyName, {
        createHTML: function createHTML(html$$1) {
          return html$$1;
        }
      });
    } catch (_) {
      console.warn("TrustedTypes policy " + policyName + " could not be created.");
      return null;
    }
  };
  function createDOMPurify() {
    var window2 = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : getGlobal();
    var DOMPurify = function DOMPurify2(root) {
      return createDOMPurify(root);
    };
    DOMPurify.version = "2.2.2";
    DOMPurify.removed = [];
    if (!window2 || !window2.document || window2.document.nodeType !== 9) {
      DOMPurify.isSupported = false;
      return DOMPurify;
    }
    var originalDocument = window2.document;
    var document2 = window2.document;
    var DocumentFragment = window2.DocumentFragment, HTMLTemplateElement = window2.HTMLTemplateElement, Node2 = window2.Node, NodeFilter = window2.NodeFilter, _window$NamedNodeMap = window2.NamedNodeMap, NamedNodeMap = _window$NamedNodeMap === void 0 ? window2.NamedNodeMap || window2.MozNamedAttrMap : _window$NamedNodeMap, Text2 = window2.Text, Comment = window2.Comment, DOMParser = window2.DOMParser, trustedTypes = window2.trustedTypes;
    if (typeof HTMLTemplateElement === "function") {
      var template6 = document2.createElement("template");
      if (template6.content && template6.content.ownerDocument) {
        document2 = template6.content.ownerDocument;
      }
    }
    var trustedTypesPolicy = _createTrustedTypesPolicy(trustedTypes, originalDocument);
    var emptyHTML = trustedTypesPolicy && RETURN_TRUSTED_TYPE ? trustedTypesPolicy.createHTML("") : "";
    var _document = document2, implementation = _document.implementation, createNodeIterator = _document.createNodeIterator, getElementsByTagName = _document.getElementsByTagName, createDocumentFragment = _document.createDocumentFragment;
    var importNode = originalDocument.importNode;
    var documentMode = {};
    try {
      documentMode = clone(document2).documentMode ? document2.documentMode : {};
    } catch (_) {
    }
    var hooks = {};
    DOMPurify.isSupported = implementation && typeof implementation.createHTMLDocument !== "undefined" && documentMode !== 9;
    var MUSTACHE_EXPR$$1 = MUSTACHE_EXPR, ERB_EXPR$$1 = ERB_EXPR, DATA_ATTR$$1 = DATA_ATTR, ARIA_ATTR$$1 = ARIA_ATTR, IS_SCRIPT_OR_DATA$$1 = IS_SCRIPT_OR_DATA, ATTR_WHITESPACE$$1 = ATTR_WHITESPACE;
    var IS_ALLOWED_URI$$1 = IS_ALLOWED_URI;
    var ALLOWED_TAGS = null;
    var DEFAULT_ALLOWED_TAGS = addToSet({}, [].concat(_toConsumableArray$1(html2), _toConsumableArray$1(svg2), _toConsumableArray$1(svgFilters), _toConsumableArray$1(mathMl), _toConsumableArray$1(text2)));
    var ALLOWED_ATTR = null;
    var DEFAULT_ALLOWED_ATTR = addToSet({}, [].concat(_toConsumableArray$1(html$1), _toConsumableArray$1(svg$1), _toConsumableArray$1(mathMl$1), _toConsumableArray$1(xml)));
    var FORBID_TAGS = null;
    var FORBID_ATTR = null;
    var ALLOW_ARIA_ATTR = true;
    var ALLOW_DATA_ATTR = true;
    var ALLOW_UNKNOWN_PROTOCOLS = false;
    var SAFE_FOR_TEMPLATES = false;
    var WHOLE_DOCUMENT = false;
    var SET_CONFIG = false;
    var FORCE_BODY = false;
    var RETURN_DOM = false;
    var RETURN_DOM_FRAGMENT = false;
    var RETURN_DOM_IMPORT = true;
    var RETURN_TRUSTED_TYPE = false;
    var SANITIZE_DOM = true;
    var KEEP_CONTENT = true;
    var IN_PLACE = false;
    var USE_PROFILES = {};
    var FORBID_CONTENTS = addToSet({}, ["annotation-xml", "audio", "colgroup", "desc", "foreignobject", "head", "iframe", "math", "mi", "mn", "mo", "ms", "mtext", "noembed", "noframes", "plaintext", "script", "style", "svg", "template", "thead", "title", "video", "xmp"]);
    var DATA_URI_TAGS = null;
    var DEFAULT_DATA_URI_TAGS = addToSet({}, ["audio", "video", "img", "source", "image", "track"]);
    var URI_SAFE_ATTRIBUTES = null;
    var DEFAULT_URI_SAFE_ATTRIBUTES = addToSet({}, ["alt", "class", "for", "id", "label", "name", "pattern", "placeholder", "summary", "title", "value", "style", "xmlns"]);
    var CONFIG = null;
    var formElement = document2.createElement("form");
    var _parseConfig = function _parseConfig2(cfg) {
      if (CONFIG && CONFIG === cfg) {
        return;
      }
      if (!cfg || (typeof cfg === "undefined" ? "undefined" : _typeof(cfg)) !== "object") {
        cfg = {};
      }
      cfg = clone(cfg);
      ALLOWED_TAGS = "ALLOWED_TAGS" in cfg ? addToSet({}, cfg.ALLOWED_TAGS) : DEFAULT_ALLOWED_TAGS;
      ALLOWED_ATTR = "ALLOWED_ATTR" in cfg ? addToSet({}, cfg.ALLOWED_ATTR) : DEFAULT_ALLOWED_ATTR;
      URI_SAFE_ATTRIBUTES = "ADD_URI_SAFE_ATTR" in cfg ? addToSet(clone(DEFAULT_URI_SAFE_ATTRIBUTES), cfg.ADD_URI_SAFE_ATTR) : DEFAULT_URI_SAFE_ATTRIBUTES;
      DATA_URI_TAGS = "ADD_DATA_URI_TAGS" in cfg ? addToSet(clone(DEFAULT_DATA_URI_TAGS), cfg.ADD_DATA_URI_TAGS) : DEFAULT_DATA_URI_TAGS;
      FORBID_TAGS = "FORBID_TAGS" in cfg ? addToSet({}, cfg.FORBID_TAGS) : {};
      FORBID_ATTR = "FORBID_ATTR" in cfg ? addToSet({}, cfg.FORBID_ATTR) : {};
      USE_PROFILES = "USE_PROFILES" in cfg ? cfg.USE_PROFILES : false;
      ALLOW_ARIA_ATTR = cfg.ALLOW_ARIA_ATTR !== false;
      ALLOW_DATA_ATTR = cfg.ALLOW_DATA_ATTR !== false;
      ALLOW_UNKNOWN_PROTOCOLS = cfg.ALLOW_UNKNOWN_PROTOCOLS || false;
      SAFE_FOR_TEMPLATES = cfg.SAFE_FOR_TEMPLATES || false;
      WHOLE_DOCUMENT = cfg.WHOLE_DOCUMENT || false;
      RETURN_DOM = cfg.RETURN_DOM || false;
      RETURN_DOM_FRAGMENT = cfg.RETURN_DOM_FRAGMENT || false;
      RETURN_DOM_IMPORT = cfg.RETURN_DOM_IMPORT !== false;
      RETURN_TRUSTED_TYPE = cfg.RETURN_TRUSTED_TYPE || false;
      FORCE_BODY = cfg.FORCE_BODY || false;
      SANITIZE_DOM = cfg.SANITIZE_DOM !== false;
      KEEP_CONTENT = cfg.KEEP_CONTENT !== false;
      IN_PLACE = cfg.IN_PLACE || false;
      IS_ALLOWED_URI$$1 = cfg.ALLOWED_URI_REGEXP || IS_ALLOWED_URI$$1;
      if (SAFE_FOR_TEMPLATES) {
        ALLOW_DATA_ATTR = false;
      }
      if (RETURN_DOM_FRAGMENT) {
        RETURN_DOM = true;
      }
      if (USE_PROFILES) {
        ALLOWED_TAGS = addToSet({}, [].concat(_toConsumableArray$1(text2)));
        ALLOWED_ATTR = [];
        if (USE_PROFILES.html === true) {
          addToSet(ALLOWED_TAGS, html2);
          addToSet(ALLOWED_ATTR, html$1);
        }
        if (USE_PROFILES.svg === true) {
          addToSet(ALLOWED_TAGS, svg2);
          addToSet(ALLOWED_ATTR, svg$1);
          addToSet(ALLOWED_ATTR, xml);
        }
        if (USE_PROFILES.svgFilters === true) {
          addToSet(ALLOWED_TAGS, svgFilters);
          addToSet(ALLOWED_ATTR, svg$1);
          addToSet(ALLOWED_ATTR, xml);
        }
        if (USE_PROFILES.mathMl === true) {
          addToSet(ALLOWED_TAGS, mathMl);
          addToSet(ALLOWED_ATTR, mathMl$1);
          addToSet(ALLOWED_ATTR, xml);
        }
      }
      if (cfg.ADD_TAGS) {
        if (ALLOWED_TAGS === DEFAULT_ALLOWED_TAGS) {
          ALLOWED_TAGS = clone(ALLOWED_TAGS);
        }
        addToSet(ALLOWED_TAGS, cfg.ADD_TAGS);
      }
      if (cfg.ADD_ATTR) {
        if (ALLOWED_ATTR === DEFAULT_ALLOWED_ATTR) {
          ALLOWED_ATTR = clone(ALLOWED_ATTR);
        }
        addToSet(ALLOWED_ATTR, cfg.ADD_ATTR);
      }
      if (cfg.ADD_URI_SAFE_ATTR) {
        addToSet(URI_SAFE_ATTRIBUTES, cfg.ADD_URI_SAFE_ATTR);
      }
      if (KEEP_CONTENT) {
        ALLOWED_TAGS["#text"] = true;
      }
      if (WHOLE_DOCUMENT) {
        addToSet(ALLOWED_TAGS, ["html", "head", "body"]);
      }
      if (ALLOWED_TAGS.table) {
        addToSet(ALLOWED_TAGS, ["tbody"]);
        delete FORBID_TAGS.tbody;
      }
      if (freeze) {
        freeze(cfg);
      }
      CONFIG = cfg;
    };
    var _forceRemove = function _forceRemove2(node) {
      arrayPush(DOMPurify.removed, {element: node});
      try {
        node.parentNode.removeChild(node);
      } catch (_) {
        node.outerHTML = emptyHTML;
      }
    };
    var _removeAttribute = function _removeAttribute2(name, node) {
      try {
        arrayPush(DOMPurify.removed, {
          attribute: node.getAttributeNode(name),
          from: node
        });
      } catch (_) {
        arrayPush(DOMPurify.removed, {
          attribute: null,
          from: node
        });
      }
      node.removeAttribute(name);
    };
    var _initDocument = function _initDocument2(dirty) {
      var doc = void 0;
      var leadingWhitespace = void 0;
      if (FORCE_BODY) {
        dirty = "<remove></remove>" + dirty;
      } else {
        var matches = stringMatch(dirty, /^[\r\n\t ]+/);
        leadingWhitespace = matches && matches[0];
      }
      var dirtyPayload = trustedTypesPolicy ? trustedTypesPolicy.createHTML(dirty) : dirty;
      try {
        doc = new DOMParser().parseFromString(dirtyPayload, "text/html");
      } catch (_) {
      }
      if (!doc || !doc.documentElement) {
        doc = implementation.createHTMLDocument("");
        var _doc = doc, body = _doc.body;
        body.parentNode.removeChild(body.parentNode.firstElementChild);
        body.outerHTML = dirtyPayload;
      }
      if (dirty && leadingWhitespace) {
        doc.body.insertBefore(document2.createTextNode(leadingWhitespace), doc.body.childNodes[0] || null);
      }
      return getElementsByTagName.call(doc, WHOLE_DOCUMENT ? "html" : "body")[0];
    };
    var _createIterator = function _createIterator2(root) {
      return createNodeIterator.call(root.ownerDocument || root, root, NodeFilter.SHOW_ELEMENT | NodeFilter.SHOW_COMMENT | NodeFilter.SHOW_TEXT, function() {
        return NodeFilter.FILTER_ACCEPT;
      }, false);
    };
    var _isClobbered = function _isClobbered2(elm) {
      if (elm instanceof Text2 || elm instanceof Comment) {
        return false;
      }
      if (typeof elm.nodeName !== "string" || typeof elm.textContent !== "string" || typeof elm.removeChild !== "function" || !(elm.attributes instanceof NamedNodeMap) || typeof elm.removeAttribute !== "function" || typeof elm.setAttribute !== "function" || typeof elm.namespaceURI !== "string") {
        return true;
      }
      return false;
    };
    var _isNode = function _isNode2(object) {
      return (typeof Node2 === "undefined" ? "undefined" : _typeof(Node2)) === "object" ? object instanceof Node2 : object && (typeof object === "undefined" ? "undefined" : _typeof(object)) === "object" && typeof object.nodeType === "number" && typeof object.nodeName === "string";
    };
    var _executeHook = function _executeHook2(entryPoint, currentNode, data) {
      if (!hooks[entryPoint]) {
        return;
      }
      arrayForEach(hooks[entryPoint], function(hook) {
        hook.call(DOMPurify, currentNode, data, CONFIG);
      });
    };
    var _sanitizeElements = function _sanitizeElements2(currentNode) {
      var content = void 0;
      _executeHook("beforeSanitizeElements", currentNode, null);
      if (_isClobbered(currentNode)) {
        _forceRemove(currentNode);
        return true;
      }
      if (stringMatch(currentNode.nodeName, /[\u0080-\uFFFF]/)) {
        _forceRemove(currentNode);
        return true;
      }
      var tagName = stringToLowerCase(currentNode.nodeName);
      _executeHook("uponSanitizeElement", currentNode, {
        tagName,
        allowedTags: ALLOWED_TAGS
      });
      if ((tagName === "svg" || tagName === "math") && currentNode.querySelectorAll("p, br, form, table").length !== 0) {
        _forceRemove(currentNode);
        return true;
      }
      if (!_isNode(currentNode.firstElementChild) && (!_isNode(currentNode.content) || !_isNode(currentNode.content.firstElementChild)) && regExpTest(/<[/\w]/g, currentNode.innerHTML) && regExpTest(/<[/\w]/g, currentNode.textContent)) {
        _forceRemove(currentNode);
        return true;
      }
      if (!ALLOWED_TAGS[tagName] || FORBID_TAGS[tagName]) {
        if (KEEP_CONTENT && !FORBID_CONTENTS[tagName] && typeof currentNode.insertAdjacentHTML === "function") {
          try {
            var htmlToInsert = currentNode.innerHTML;
            currentNode.insertAdjacentHTML("AfterEnd", trustedTypesPolicy ? trustedTypesPolicy.createHTML(htmlToInsert) : htmlToInsert);
          } catch (_) {
          }
        }
        _forceRemove(currentNode);
        return true;
      }
      if ((tagName === "noscript" || tagName === "noembed") && regExpTest(/<\/no(script|embed)/i, currentNode.innerHTML)) {
        _forceRemove(currentNode);
        return true;
      }
      if (SAFE_FOR_TEMPLATES && currentNode.nodeType === 3) {
        content = currentNode.textContent;
        content = stringReplace(content, MUSTACHE_EXPR$$1, " ");
        content = stringReplace(content, ERB_EXPR$$1, " ");
        if (currentNode.textContent !== content) {
          arrayPush(DOMPurify.removed, {element: currentNode.cloneNode()});
          currentNode.textContent = content;
        }
      }
      _executeHook("afterSanitizeElements", currentNode, null);
      return false;
    };
    var _isValidAttribute = function _isValidAttribute2(lcTag, lcName, value) {
      if (SANITIZE_DOM && (lcName === "id" || lcName === "name") && (value in document2 || value in formElement)) {
        return false;
      }
      if (ALLOW_DATA_ATTR && regExpTest(DATA_ATTR$$1, lcName))
        ;
      else if (ALLOW_ARIA_ATTR && regExpTest(ARIA_ATTR$$1, lcName))
        ;
      else if (!ALLOWED_ATTR[lcName] || FORBID_ATTR[lcName]) {
        return false;
      } else if (URI_SAFE_ATTRIBUTES[lcName])
        ;
      else if (regExpTest(IS_ALLOWED_URI$$1, stringReplace(value, ATTR_WHITESPACE$$1, "")))
        ;
      else if ((lcName === "src" || lcName === "xlink:href" || lcName === "href") && lcTag !== "script" && stringIndexOf(value, "data:") === 0 && DATA_URI_TAGS[lcTag])
        ;
      else if (ALLOW_UNKNOWN_PROTOCOLS && !regExpTest(IS_SCRIPT_OR_DATA$$1, stringReplace(value, ATTR_WHITESPACE$$1, "")))
        ;
      else if (!value)
        ;
      else {
        return false;
      }
      return true;
    };
    var _sanitizeAttributes = function _sanitizeAttributes2(currentNode) {
      var attr = void 0;
      var value = void 0;
      var lcName = void 0;
      var l = void 0;
      _executeHook("beforeSanitizeAttributes", currentNode, null);
      var attributes = currentNode.attributes;
      if (!attributes) {
        return;
      }
      var hookEvent = {
        attrName: "",
        attrValue: "",
        keepAttr: true,
        allowedAttributes: ALLOWED_ATTR
      };
      l = attributes.length;
      while (l--) {
        attr = attributes[l];
        var _attr = attr, name = _attr.name, namespaceURI = _attr.namespaceURI;
        value = stringTrim(attr.value);
        lcName = stringToLowerCase(name);
        hookEvent.attrName = lcName;
        hookEvent.attrValue = value;
        hookEvent.keepAttr = true;
        hookEvent.forceKeepAttr = void 0;
        _executeHook("uponSanitizeAttribute", currentNode, hookEvent);
        value = hookEvent.attrValue;
        if (hookEvent.forceKeepAttr) {
          continue;
        }
        _removeAttribute(name, currentNode);
        if (!hookEvent.keepAttr) {
          continue;
        }
        if (regExpTest(/\/>/i, value)) {
          _removeAttribute(name, currentNode);
          continue;
        }
        if (SAFE_FOR_TEMPLATES) {
          value = stringReplace(value, MUSTACHE_EXPR$$1, " ");
          value = stringReplace(value, ERB_EXPR$$1, " ");
        }
        var lcTag = currentNode.nodeName.toLowerCase();
        if (!_isValidAttribute(lcTag, lcName, value)) {
          continue;
        }
        try {
          if (namespaceURI) {
            currentNode.setAttributeNS(namespaceURI, name, value);
          } else {
            currentNode.setAttribute(name, value);
          }
          arrayPop(DOMPurify.removed);
        } catch (_) {
        }
      }
      _executeHook("afterSanitizeAttributes", currentNode, null);
    };
    var _sanitizeShadowDOM = function _sanitizeShadowDOM2(fragment) {
      var shadowNode = void 0;
      var shadowIterator = _createIterator(fragment);
      _executeHook("beforeSanitizeShadowDOM", fragment, null);
      while (shadowNode = shadowIterator.nextNode()) {
        _executeHook("uponSanitizeShadowNode", shadowNode, null);
        if (_sanitizeElements(shadowNode)) {
          continue;
        }
        if (shadowNode.content instanceof DocumentFragment) {
          _sanitizeShadowDOM2(shadowNode.content);
        }
        _sanitizeAttributes(shadowNode);
      }
      _executeHook("afterSanitizeShadowDOM", fragment, null);
    };
    DOMPurify.sanitize = function(dirty, cfg) {
      var body = void 0;
      var importedNode = void 0;
      var currentNode = void 0;
      var oldNode = void 0;
      var returnNode = void 0;
      if (!dirty) {
        dirty = "<!-->";
      }
      if (typeof dirty !== "string" && !_isNode(dirty)) {
        if (typeof dirty.toString !== "function") {
          throw typeErrorCreate("toString is not a function");
        } else {
          dirty = dirty.toString();
          if (typeof dirty !== "string") {
            throw typeErrorCreate("dirty is not a string, aborting");
          }
        }
      }
      if (!DOMPurify.isSupported) {
        if (_typeof(window2.toStaticHTML) === "object" || typeof window2.toStaticHTML === "function") {
          if (typeof dirty === "string") {
            return window2.toStaticHTML(dirty);
          }
          if (_isNode(dirty)) {
            return window2.toStaticHTML(dirty.outerHTML);
          }
        }
        return dirty;
      }
      if (!SET_CONFIG) {
        _parseConfig(cfg);
      }
      DOMPurify.removed = [];
      if (typeof dirty === "string") {
        IN_PLACE = false;
      }
      if (IN_PLACE)
        ;
      else if (dirty instanceof Node2) {
        body = _initDocument("<!---->");
        importedNode = body.ownerDocument.importNode(dirty, true);
        if (importedNode.nodeType === 1 && importedNode.nodeName === "BODY") {
          body = importedNode;
        } else if (importedNode.nodeName === "HTML") {
          body = importedNode;
        } else {
          body.appendChild(importedNode);
        }
      } else {
        if (!RETURN_DOM && !SAFE_FOR_TEMPLATES && !WHOLE_DOCUMENT && dirty.indexOf("<") === -1) {
          return trustedTypesPolicy && RETURN_TRUSTED_TYPE ? trustedTypesPolicy.createHTML(dirty) : dirty;
        }
        body = _initDocument(dirty);
        if (!body) {
          return RETURN_DOM ? null : emptyHTML;
        }
      }
      if (body && FORCE_BODY) {
        _forceRemove(body.firstChild);
      }
      var nodeIterator = _createIterator(IN_PLACE ? dirty : body);
      while (currentNode = nodeIterator.nextNode()) {
        if (currentNode.nodeType === 3 && currentNode === oldNode) {
          continue;
        }
        if (_sanitizeElements(currentNode)) {
          continue;
        }
        if (currentNode.content instanceof DocumentFragment) {
          _sanitizeShadowDOM(currentNode.content);
        }
        _sanitizeAttributes(currentNode);
        oldNode = currentNode;
      }
      oldNode = null;
      if (IN_PLACE) {
        return dirty;
      }
      if (RETURN_DOM) {
        if (RETURN_DOM_FRAGMENT) {
          returnNode = createDocumentFragment.call(body.ownerDocument);
          while (body.firstChild) {
            returnNode.appendChild(body.firstChild);
          }
        } else {
          returnNode = body;
        }
        if (RETURN_DOM_IMPORT) {
          returnNode = importNode.call(originalDocument, returnNode, true);
        }
        return returnNode;
      }
      var serializedHTML = WHOLE_DOCUMENT ? body.outerHTML : body.innerHTML;
      if (SAFE_FOR_TEMPLATES) {
        serializedHTML = stringReplace(serializedHTML, MUSTACHE_EXPR$$1, " ");
        serializedHTML = stringReplace(serializedHTML, ERB_EXPR$$1, " ");
      }
      return trustedTypesPolicy && RETURN_TRUSTED_TYPE ? trustedTypesPolicy.createHTML(serializedHTML) : serializedHTML;
    };
    DOMPurify.setConfig = function(cfg) {
      _parseConfig(cfg);
      SET_CONFIG = true;
    };
    DOMPurify.clearConfig = function() {
      CONFIG = null;
      SET_CONFIG = false;
    };
    DOMPurify.isValidAttribute = function(tag, attr, value) {
      if (!CONFIG) {
        _parseConfig({});
      }
      var lcTag = stringToLowerCase(tag);
      var lcName = stringToLowerCase(attr);
      return _isValidAttribute(lcTag, lcName, value);
    };
    DOMPurify.addHook = function(entryPoint, hookFunction) {
      if (typeof hookFunction !== "function") {
        return;
      }
      hooks[entryPoint] = hooks[entryPoint] || [];
      arrayPush(hooks[entryPoint], hookFunction);
    };
    DOMPurify.removeHook = function(entryPoint) {
      if (hooks[entryPoint]) {
        arrayPop(hooks[entryPoint]);
      }
    };
    DOMPurify.removeHooks = function(entryPoint) {
      if (hooks[entryPoint]) {
        hooks[entryPoint] = [];
      }
    };
    DOMPurify.removeAllHooks = function() {
      hooks = {};
    };
    return DOMPurify;
  }
  var purify = createDOMPurify();
  var purify_default = purify;

  // source/js/marked/marked.js
  function createCommonjsModule(fn, module) {
    return module = {exports: {}}, fn(module, module.exports), module.exports;
  }
  var defaults = createCommonjsModule(function(module) {
    function getDefaults2() {
      return {
        baseUrl: null,
        breaks: false,
        gfm: true,
        headerIds: true,
        headerPrefix: "",
        highlight: null,
        langPrefix: "language-",
        mangle: true,
        pedantic: false,
        renderer: null,
        sanitize: false,
        sanitizer: null,
        silent: false,
        smartLists: false,
        smartypants: false,
        tokenizer: null,
        walkTokens: null,
        xhtml: false
      };
    }
    function changeDefaults2(newDefaults) {
      module.exports.defaults = newDefaults;
    }
    module.exports = {
      defaults: getDefaults2(),
      getDefaults: getDefaults2,
      changeDefaults: changeDefaults2
    };
  });
  var defaults_1 = defaults.defaults;
  var defaults_2 = defaults.getDefaults;
  var defaults_3 = defaults.changeDefaults;
  const escapeTest = /[&<>"']/;
  const escapeReplace = /[&<>"']/g;
  const escapeTestNoEncode = /[<>"']|&(?!#?\w+;)/;
  const escapeReplaceNoEncode = /[<>"']|&(?!#?\w+;)/g;
  const escapeReplacements = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  };
  const getEscapeReplacement = (ch) => escapeReplacements[ch];
  function escape(html3, encode) {
    if (encode) {
      if (escapeTest.test(html3)) {
        return html3.replace(escapeReplace, getEscapeReplacement);
      }
    } else {
      if (escapeTestNoEncode.test(html3)) {
        return html3.replace(escapeReplaceNoEncode, getEscapeReplacement);
      }
    }
    return html3;
  }
  const unescapeTest = /&(#(?:\d+)|(?:#x[0-9A-Fa-f]+)|(?:\w+));?/ig;
  function unescape(html3) {
    return html3.replace(unescapeTest, (_, n) => {
      n = n.toLowerCase();
      if (n === "colon")
        return ":";
      if (n.charAt(0) === "#") {
        return n.charAt(1) === "x" ? String.fromCharCode(parseInt(n.substring(2), 16)) : String.fromCharCode(+n.substring(1));
      }
      return "";
    });
  }
  const caret = /(^|[^\[])\^/g;
  function edit(regex, opt) {
    regex = regex.source || regex;
    opt = opt || "";
    const obj = {
      replace: (name, val) => {
        val = val.source || val;
        val = val.replace(caret, "$1");
        regex = regex.replace(name, val);
        return obj;
      },
      getRegex: () => {
        return new RegExp(regex, opt);
      }
    };
    return obj;
  }
  const nonWordAndColonTest = /[^\w:]/g;
  const originIndependentUrl = /^$|^[a-z][a-z0-9+.-]*:|^[?#]/i;
  function cleanUrl(sanitize, base, href) {
    if (sanitize) {
      let prot;
      try {
        prot = decodeURIComponent(unescape(href)).replace(nonWordAndColonTest, "").toLowerCase();
      } catch (e) {
        return null;
      }
      if (prot.indexOf("javascript:") === 0 || prot.indexOf("vbscript:") === 0 || prot.indexOf("data:") === 0) {
        return null;
      }
    }
    if (base && !originIndependentUrl.test(href)) {
      href = resolveUrl(base, href);
    }
    try {
      href = encodeURI(href).replace(/%25/g, "%");
    } catch (e) {
      return null;
    }
    return href;
  }
  const baseUrls = {};
  const justDomain = /^[^:]+:\/*[^/]*$/;
  const protocol = /^([^:]+:)[\s\S]*$/;
  const domain = /^([^:]+:\/*[^/]*)[\s\S]*$/;
  function resolveUrl(base, href) {
    if (!baseUrls[" " + base]) {
      if (justDomain.test(base)) {
        baseUrls[" " + base] = base + "/";
      } else {
        baseUrls[" " + base] = rtrim(base, "/", true);
      }
    }
    base = baseUrls[" " + base];
    const relativeBase = base.indexOf(":") === -1;
    if (href.substring(0, 2) === "//") {
      if (relativeBase) {
        return href;
      }
      return base.replace(protocol, "$1") + href;
    } else if (href.charAt(0) === "/") {
      if (relativeBase) {
        return href;
      }
      return base.replace(domain, "$1") + href;
    } else {
      return base + href;
    }
  }
  const noopTest = {exec: function noopTest2() {
  }};
  function merge(obj) {
    let i = 1, target, key;
    for (; i < arguments.length; i++) {
      target = arguments[i];
      for (key in target) {
        if (Object.prototype.hasOwnProperty.call(target, key)) {
          obj[key] = target[key];
        }
      }
    }
    return obj;
  }
  function splitCells(tableRow, count) {
    const row = tableRow.replace(/\|/g, (match, offset, str) => {
      let escaped = false, curr = offset;
      while (--curr >= 0 && str[curr] === "\\")
        escaped = !escaped;
      if (escaped) {
        return "|";
      } else {
        return " |";
      }
    }), cells = row.split(/ \|/);
    let i = 0;
    if (cells.length > count) {
      cells.splice(count);
    } else {
      while (cells.length < count)
        cells.push("");
    }
    for (; i < cells.length; i++) {
      cells[i] = cells[i].trim().replace(/\\\|/g, "|");
    }
    return cells;
  }
  function rtrim(str, c, invert) {
    const l = str.length;
    if (l === 0) {
      return "";
    }
    let suffLen = 0;
    while (suffLen < l) {
      const currChar = str.charAt(l - suffLen - 1);
      if (currChar === c && !invert) {
        suffLen++;
      } else if (currChar !== c && invert) {
        suffLen++;
      } else {
        break;
      }
    }
    return str.substr(0, l - suffLen);
  }
  function findClosingBracket(str, b) {
    if (str.indexOf(b[1]) === -1) {
      return -1;
    }
    const l = str.length;
    let level = 0, i = 0;
    for (; i < l; i++) {
      if (str[i] === "\\") {
        i++;
      } else if (str[i] === b[0]) {
        level++;
      } else if (str[i] === b[1]) {
        level--;
        if (level < 0) {
          return i;
        }
      }
    }
    return -1;
  }
  function checkSanitizeDeprecation(opt) {
    if (opt && opt.sanitize && !opt.silent) {
      console.warn("marked(): sanitize and sanitizer parameters are deprecated since version 0.7.0, should not be used and will be removed in the future. Read more here: https://marked.js.org/#/USING_ADVANCED.md#options");
    }
  }
  function repeatString(pattern, count) {
    if (count < 1) {
      return "";
    }
    let result = "";
    while (count > 1) {
      if (count & 1) {
        result += pattern;
      }
      count >>= 1;
      pattern += pattern;
    }
    return result + pattern;
  }
  var helpers = {
    escape,
    unescape,
    edit,
    cleanUrl,
    resolveUrl,
    noopTest,
    merge,
    splitCells,
    rtrim,
    findClosingBracket,
    checkSanitizeDeprecation,
    repeatString
  };
  const {defaults: defaults$1} = defaults;
  const {
    rtrim: rtrim$1,
    splitCells: splitCells$1,
    escape: escape$1,
    findClosingBracket: findClosingBracket$1
  } = helpers;
  function outputLink(cap, link, raw) {
    const href = link.href;
    const title = link.title ? escape$1(link.title) : null;
    const text3 = cap[1].replace(/\\([\[\]])/g, "$1");
    if (cap[0].charAt(0) !== "!") {
      return {
        type: "link",
        raw,
        href,
        title,
        text: text3
      };
    } else {
      return {
        type: "image",
        raw,
        href,
        title,
        text: escape$1(text3)
      };
    }
  }
  function indentCodeCompensation(raw, text3) {
    const matchIndentToCode = raw.match(/^(\s+)(?:```)/);
    if (matchIndentToCode === null) {
      return text3;
    }
    const indentToCode = matchIndentToCode[1];
    return text3.split("\n").map((node) => {
      const matchIndentInNode = node.match(/^\s+/);
      if (matchIndentInNode === null) {
        return node;
      }
      const [indentInNode] = matchIndentInNode;
      if (indentInNode.length >= indentToCode.length) {
        return node.slice(indentToCode.length);
      }
      return node;
    }).join("\n");
  }
  var Tokenizer_1 = class Tokenizer {
    constructor(options) {
      this.options = options || defaults$1;
    }
    space(src) {
      const cap = this.rules.block.newline.exec(src);
      if (cap) {
        if (cap[0].length > 1) {
          return {
            type: "space",
            raw: cap[0]
          };
        }
        return {raw: "\n"};
      }
    }
    code(src, tokens) {
      const cap = this.rules.block.code.exec(src);
      if (cap) {
        const lastToken = tokens[tokens.length - 1];
        if (lastToken && lastToken.type === "paragraph") {
          return {
            raw: cap[0],
            text: cap[0].trimRight()
          };
        }
        const text3 = cap[0].replace(/^ {4}/gm, "");
        return {
          type: "code",
          raw: cap[0],
          codeBlockStyle: "indented",
          text: !this.options.pedantic ? rtrim$1(text3, "\n") : text3
        };
      }
    }
    fences(src) {
      const cap = this.rules.block.fences.exec(src);
      if (cap) {
        const raw = cap[0];
        const text3 = indentCodeCompensation(raw, cap[3] || "");
        return {
          type: "code",
          raw,
          lang: cap[2] ? cap[2].trim() : cap[2],
          text: text3
        };
      }
    }
    heading(src) {
      const cap = this.rules.block.heading.exec(src);
      if (cap) {
        return {
          type: "heading",
          raw: cap[0],
          depth: cap[1].length,
          text: cap[2]
        };
      }
    }
    nptable(src) {
      const cap = this.rules.block.nptable.exec(src);
      if (cap) {
        const item = {
          type: "table",
          header: splitCells$1(cap[1].replace(/^ *| *\| *$/g, "")),
          align: cap[2].replace(/^ *|\| *$/g, "").split(/ *\| */),
          cells: cap[3] ? cap[3].replace(/\n$/, "").split("\n") : [],
          raw: cap[0]
        };
        if (item.header.length === item.align.length) {
          let l = item.align.length;
          let i;
          for (i = 0; i < l; i++) {
            if (/^ *-+: *$/.test(item.align[i])) {
              item.align[i] = "right";
            } else if (/^ *:-+: *$/.test(item.align[i])) {
              item.align[i] = "center";
            } else if (/^ *:-+ *$/.test(item.align[i])) {
              item.align[i] = "left";
            } else {
              item.align[i] = null;
            }
          }
          l = item.cells.length;
          for (i = 0; i < l; i++) {
            item.cells[i] = splitCells$1(item.cells[i], item.header.length);
          }
          return item;
        }
      }
    }
    hr(src) {
      const cap = this.rules.block.hr.exec(src);
      if (cap) {
        return {
          type: "hr",
          raw: cap[0]
        };
      }
    }
    blockquote(src) {
      const cap = this.rules.block.blockquote.exec(src);
      if (cap) {
        const text3 = cap[0].replace(/^ *> ?/gm, "");
        return {
          type: "blockquote",
          raw: cap[0],
          text: text3
        };
      }
    }
    list(src) {
      const cap = this.rules.block.list.exec(src);
      if (cap) {
        let raw = cap[0];
        const bull = cap[2];
        const isordered = bull.length > 1;
        const list = {
          type: "list",
          raw,
          ordered: isordered,
          start: isordered ? +bull.slice(0, -1) : "",
          loose: false,
          items: []
        };
        const itemMatch = cap[0].match(this.rules.block.item);
        let next = false, item, space, bcurr, bnext, addBack, loose, istask, ischecked;
        let l = itemMatch.length;
        bcurr = this.rules.block.listItemStart.exec(itemMatch[0]);
        for (let i = 0; i < l; i++) {
          item = itemMatch[i];
          raw = item;
          if (i !== l - 1) {
            bnext = this.rules.block.listItemStart.exec(itemMatch[i + 1]);
            if (bnext[1].length > bcurr[0].length || bnext[1].length > 3) {
              itemMatch.splice(i, 2, itemMatch[i] + "\n" + itemMatch[i + 1]);
              i--;
              l--;
              continue;
            } else {
              if (!this.options.pedantic || this.options.smartLists ? bnext[2][bnext[2].length - 1] !== bull[bull.length - 1] : isordered === (bnext[2].length === 1)) {
                addBack = itemMatch.slice(i + 1).join("\n");
                list.raw = list.raw.substring(0, list.raw.length - addBack.length);
                i = l - 1;
              }
            }
            bcurr = bnext;
          }
          space = item.length;
          item = item.replace(/^ *([*+-]|\d+[.)]) ?/, "");
          if (~item.indexOf("\n ")) {
            space -= item.length;
            item = !this.options.pedantic ? item.replace(new RegExp("^ {1," + space + "}", "gm"), "") : item.replace(/^ {1,4}/gm, "");
          }
          loose = next || /\n\n(?!\s*$)/.test(item);
          if (i !== l - 1) {
            next = item.charAt(item.length - 1) === "\n";
            if (!loose)
              loose = next;
          }
          if (loose) {
            list.loose = true;
          }
          if (this.options.gfm) {
            istask = /^\[[ xX]\] /.test(item);
            ischecked = void 0;
            if (istask) {
              ischecked = item[1] !== " ";
              item = item.replace(/^\[[ xX]\] +/, "");
            }
          }
          list.items.push({
            type: "list_item",
            raw,
            task: istask,
            checked: ischecked,
            loose,
            text: item
          });
        }
        return list;
      }
    }
    html(src) {
      const cap = this.rules.block.html.exec(src);
      if (cap) {
        return {
          type: this.options.sanitize ? "paragraph" : "html",
          raw: cap[0],
          pre: !this.options.sanitizer && (cap[1] === "pre" || cap[1] === "script" || cap[1] === "style"),
          text: this.options.sanitize ? this.options.sanitizer ? this.options.sanitizer(cap[0]) : escape$1(cap[0]) : cap[0]
        };
      }
    }
    def(src) {
      const cap = this.rules.block.def.exec(src);
      if (cap) {
        if (cap[3])
          cap[3] = cap[3].substring(1, cap[3].length - 1);
        const tag = cap[1].toLowerCase().replace(/\s+/g, " ");
        return {
          tag,
          raw: cap[0],
          href: cap[2],
          title: cap[3]
        };
      }
    }
    table(src) {
      const cap = this.rules.block.table.exec(src);
      if (cap) {
        const item = {
          type: "table",
          header: splitCells$1(cap[1].replace(/^ *| *\| *$/g, "")),
          align: cap[2].replace(/^ *|\| *$/g, "").split(/ *\| */),
          cells: cap[3] ? cap[3].replace(/\n$/, "").split("\n") : []
        };
        if (item.header.length === item.align.length) {
          item.raw = cap[0];
          let l = item.align.length;
          let i;
          for (i = 0; i < l; i++) {
            if (/^ *-+: *$/.test(item.align[i])) {
              item.align[i] = "right";
            } else if (/^ *:-+: *$/.test(item.align[i])) {
              item.align[i] = "center";
            } else if (/^ *:-+ *$/.test(item.align[i])) {
              item.align[i] = "left";
            } else {
              item.align[i] = null;
            }
          }
          l = item.cells.length;
          for (i = 0; i < l; i++) {
            item.cells[i] = splitCells$1(item.cells[i].replace(/^ *\| *| *\| *$/g, ""), item.header.length);
          }
          return item;
        }
      }
    }
    lheading(src) {
      const cap = this.rules.block.lheading.exec(src);
      if (cap) {
        return {
          type: "heading",
          raw: cap[0],
          depth: cap[2].charAt(0) === "=" ? 1 : 2,
          text: cap[1]
        };
      }
    }
    paragraph(src) {
      const cap = this.rules.block.paragraph.exec(src);
      if (cap) {
        return {
          type: "paragraph",
          raw: cap[0],
          text: cap[1].charAt(cap[1].length - 1) === "\n" ? cap[1].slice(0, -1) : cap[1]
        };
      }
    }
    text(src, tokens) {
      const cap = this.rules.block.text.exec(src);
      if (cap) {
        const lastToken = tokens[tokens.length - 1];
        if (lastToken && lastToken.type === "text") {
          return {
            raw: cap[0],
            text: cap[0]
          };
        }
        return {
          type: "text",
          raw: cap[0],
          text: cap[0]
        };
      }
    }
    escape(src) {
      const cap = this.rules.inline.escape.exec(src);
      if (cap) {
        return {
          type: "escape",
          raw: cap[0],
          text: escape$1(cap[1])
        };
      }
    }
    tag(src, inLink, inRawBlock) {
      const cap = this.rules.inline.tag.exec(src);
      if (cap) {
        if (!inLink && /^<a /i.test(cap[0])) {
          inLink = true;
        } else if (inLink && /^<\/a>/i.test(cap[0])) {
          inLink = false;
        }
        if (!inRawBlock && /^<(pre|code|kbd|script)(\s|>)/i.test(cap[0])) {
          inRawBlock = true;
        } else if (inRawBlock && /^<\/(pre|code|kbd|script)(\s|>)/i.test(cap[0])) {
          inRawBlock = false;
        }
        return {
          type: this.options.sanitize ? "text" : "html",
          raw: cap[0],
          inLink,
          inRawBlock,
          text: this.options.sanitize ? this.options.sanitizer ? this.options.sanitizer(cap[0]) : escape$1(cap[0]) : cap[0]
        };
      }
    }
    link(src) {
      const cap = this.rules.inline.link.exec(src);
      if (cap) {
        const lastParenIndex = findClosingBracket$1(cap[2], "()");
        if (lastParenIndex > -1) {
          const start = cap[0].indexOf("!") === 0 ? 5 : 4;
          const linkLen = start + cap[1].length + lastParenIndex;
          cap[2] = cap[2].substring(0, lastParenIndex);
          cap[0] = cap[0].substring(0, linkLen).trim();
          cap[3] = "";
        }
        let href = cap[2];
        let title = "";
        if (this.options.pedantic) {
          const link = /^([^'"]*[^\s])\s+(['"])(.*)\2/.exec(href);
          if (link) {
            href = link[1];
            title = link[3];
          } else {
            title = "";
          }
        } else {
          title = cap[3] ? cap[3].slice(1, -1) : "";
        }
        href = href.trim().replace(/^<([\s\S]*)>$/, "$1");
        const token = outputLink(cap, {
          href: href ? href.replace(this.rules.inline._escapes, "$1") : href,
          title: title ? title.replace(this.rules.inline._escapes, "$1") : title
        }, cap[0]);
        return token;
      }
    }
    reflink(src, links) {
      let cap;
      if ((cap = this.rules.inline.reflink.exec(src)) || (cap = this.rules.inline.nolink.exec(src))) {
        let link = (cap[2] || cap[1]).replace(/\s+/g, " ");
        link = links[link.toLowerCase()];
        if (!link || !link.href) {
          const text3 = cap[0].charAt(0);
          return {
            type: "text",
            raw: text3,
            text: text3
          };
        }
        const token = outputLink(cap, link, cap[0]);
        return token;
      }
    }
    strong(src, maskedSrc, prevChar = "") {
      let match = this.rules.inline.strong.start.exec(src);
      if (match && (!match[1] || match[1] && (prevChar === "" || this.rules.inline.punctuation.exec(prevChar)))) {
        maskedSrc = maskedSrc.slice(-1 * src.length);
        const endReg = match[0] === "**" ? this.rules.inline.strong.endAst : this.rules.inline.strong.endUnd;
        endReg.lastIndex = 0;
        let cap;
        while ((match = endReg.exec(maskedSrc)) != null) {
          cap = this.rules.inline.strong.middle.exec(maskedSrc.slice(0, match.index + 3));
          if (cap) {
            return {
              type: "strong",
              raw: src.slice(0, cap[0].length),
              text: src.slice(2, cap[0].length - 2)
            };
          }
        }
      }
    }
    em(src, maskedSrc, prevChar = "") {
      let match = this.rules.inline.em.start.exec(src);
      if (match && (!match[1] || match[1] && (prevChar === "" || this.rules.inline.punctuation.exec(prevChar)))) {
        maskedSrc = maskedSrc.slice(-1 * src.length);
        const endReg = match[0] === "*" ? this.rules.inline.em.endAst : this.rules.inline.em.endUnd;
        endReg.lastIndex = 0;
        let cap;
        while ((match = endReg.exec(maskedSrc)) != null) {
          cap = this.rules.inline.em.middle.exec(maskedSrc.slice(0, match.index + 2));
          if (cap) {
            return {
              type: "em",
              raw: src.slice(0, cap[0].length),
              text: src.slice(1, cap[0].length - 1)
            };
          }
        }
      }
    }
    codespan(src) {
      const cap = this.rules.inline.code.exec(src);
      if (cap) {
        let text3 = cap[2].replace(/\n/g, " ");
        const hasNonSpaceChars = /[^ ]/.test(text3);
        const hasSpaceCharsOnBothEnds = text3.startsWith(" ") && text3.endsWith(" ");
        if (hasNonSpaceChars && hasSpaceCharsOnBothEnds) {
          text3 = text3.substring(1, text3.length - 1);
        }
        text3 = escape$1(text3, true);
        return {
          type: "codespan",
          raw: cap[0],
          text: text3
        };
      }
    }
    br(src) {
      const cap = this.rules.inline.br.exec(src);
      if (cap) {
        return {
          type: "br",
          raw: cap[0]
        };
      }
    }
    del(src) {
      const cap = this.rules.inline.del.exec(src);
      if (cap) {
        return {
          type: "del",
          raw: cap[0],
          text: cap[2]
        };
      }
    }
    autolink(src, mangle2) {
      const cap = this.rules.inline.autolink.exec(src);
      if (cap) {
        let text3, href;
        if (cap[2] === "@") {
          text3 = escape$1(this.options.mangle ? mangle2(cap[1]) : cap[1]);
          href = "mailto:" + text3;
        } else {
          text3 = escape$1(cap[1]);
          href = text3;
        }
        return {
          type: "link",
          raw: cap[0],
          text: text3,
          href,
          tokens: [
            {
              type: "text",
              raw: text3,
              text: text3
            }
          ]
        };
      }
    }
    url(src, mangle2) {
      let cap;
      if (cap = this.rules.inline.url.exec(src)) {
        let text3, href;
        if (cap[2] === "@") {
          text3 = escape$1(this.options.mangle ? mangle2(cap[0]) : cap[0]);
          href = "mailto:" + text3;
        } else {
          let prevCapZero;
          do {
            prevCapZero = cap[0];
            cap[0] = this.rules.inline._backpedal.exec(cap[0])[0];
          } while (prevCapZero !== cap[0]);
          text3 = escape$1(cap[0]);
          if (cap[1] === "www.") {
            href = "http://" + text3;
          } else {
            href = text3;
          }
        }
        return {
          type: "link",
          raw: cap[0],
          text: text3,
          href,
          tokens: [
            {
              type: "text",
              raw: text3,
              text: text3
            }
          ]
        };
      }
    }
    inlineText(src, inRawBlock, smartypants2) {
      const cap = this.rules.inline.text.exec(src);
      if (cap) {
        let text3;
        if (inRawBlock) {
          text3 = this.options.sanitize ? this.options.sanitizer ? this.options.sanitizer(cap[0]) : escape$1(cap[0]) : cap[0];
        } else {
          text3 = escape$1(this.options.smartypants ? smartypants2(cap[0]) : cap[0]);
        }
        return {
          type: "text",
          raw: cap[0],
          text: text3
        };
      }
    }
  };
  const {
    noopTest: noopTest$1,
    edit: edit$1,
    merge: merge$1
  } = helpers;
  const block = {
    newline: /^\n+/,
    code: /^( {4}[^\n]+\n*)+/,
    fences: /^ {0,3}(`{3,}(?=[^`\n]*\n)|~{3,})([^\n]*)\n(?:|([\s\S]*?)\n)(?: {0,3}\1[~`]* *(?:\n+|$)|$)/,
    hr: /^ {0,3}((?:- *){3,}|(?:_ *){3,}|(?:\* *){3,})(?:\n+|$)/,
    heading: /^ {0,3}(#{1,6}) +([^\n]*?)(?: +#+)? *(?:\n+|$)/,
    blockquote: /^( {0,3}> ?(paragraph|[^\n]*)(?:\n|$))+/,
    list: /^( {0,3})(bull) [\s\S]+?(?:hr|def|\n{2,}(?! )(?! {0,3}bull )\n*|\s*$)/,
    html: "^ {0,3}(?:<(script|pre|style)[\\s>][\\s\\S]*?(?:</\\1>[^\\n]*\\n+|$)|comment[^\\n]*(\\n+|$)|<\\?[\\s\\S]*?(?:\\?>\\n*|$)|<![A-Z][\\s\\S]*?(?:>\\n*|$)|<!\\[CDATA\\[[\\s\\S]*?(?:\\]\\]>\\n*|$)|</?(tag)(?: +|\\n|/?>)[\\s\\S]*?(?:\\n{2,}|$)|<(?!script|pre|style)([a-z][\\w-]*)(?:attribute)*? */?>(?=[ \\t]*(?:\\n|$))[\\s\\S]*?(?:\\n{2,}|$)|</(?!script|pre|style)[a-z][\\w-]*\\s*>(?=[ \\t]*(?:\\n|$))[\\s\\S]*?(?:\\n{2,}|$))",
    def: /^ {0,3}\[(label)\]: *\n? *<?([^\s>]+)>?(?:(?: +\n? *| *\n *)(title))? *(?:\n+|$)/,
    nptable: noopTest$1,
    table: noopTest$1,
    lheading: /^([^\n]+)\n {0,3}(=+|-+) *(?:\n+|$)/,
    _paragraph: /^([^\n]+(?:\n(?!hr|heading|lheading|blockquote|fences|list|html)[^\n]+)*)/,
    text: /^[^\n]+/
  };
  block._label = /(?!\s*\])(?:\\[\[\]]|[^\[\]])+/;
  block._title = /(?:"(?:\\"?|[^"\\])*"|'[^'\n]*(?:\n[^'\n]+)*\n?'|\([^()]*\))/;
  block.def = edit$1(block.def).replace("label", block._label).replace("title", block._title).getRegex();
  block.bullet = /(?:[*+-]|\d{1,9}[.)])/;
  block.item = /^( *)(bull) ?[^\n]*(?:\n(?! *bull ?)[^\n]*)*/;
  block.item = edit$1(block.item, "gm").replace(/bull/g, block.bullet).getRegex();
  block.listItemStart = edit$1(/^( *)(bull)/).replace("bull", block.bullet).getRegex();
  block.list = edit$1(block.list).replace(/bull/g, block.bullet).replace("hr", "\\n+(?=\\1?(?:(?:- *){3,}|(?:_ *){3,}|(?:\\* *){3,})(?:\\n+|$))").replace("def", "\\n+(?=" + block.def.source + ")").getRegex();
  block._tag = "address|article|aside|base|basefont|blockquote|body|caption|center|col|colgroup|dd|details|dialog|dir|div|dl|dt|fieldset|figcaption|figure|footer|form|frame|frameset|h[1-6]|head|header|hr|html|iframe|legend|li|link|main|menu|menuitem|meta|nav|noframes|ol|optgroup|option|p|param|section|source|summary|table|tbody|td|tfoot|th|thead|title|tr|track|ul";
  block._comment = /<!--(?!-?>)[\s\S]*?(?:-->|$)/;
  block.html = edit$1(block.html, "i").replace("comment", block._comment).replace("tag", block._tag).replace("attribute", / +[a-zA-Z:_][\w.:-]*(?: *= *"[^"\n]*"| *= *'[^'\n]*'| *= *[^\s"'=<>`]+)?/).getRegex();
  block.paragraph = edit$1(block._paragraph).replace("hr", block.hr).replace("heading", " {0,3}#{1,6} ").replace("|lheading", "").replace("blockquote", " {0,3}>").replace("fences", " {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list", " {0,3}(?:[*+-]|1[.)]) ").replace("html", "</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|!--)").replace("tag", block._tag).getRegex();
  block.blockquote = edit$1(block.blockquote).replace("paragraph", block.paragraph).getRegex();
  block.normal = merge$1({}, block);
  block.gfm = merge$1({}, block.normal, {
    nptable: "^ *([^|\\n ].*\\|.*)\\n {0,3}([-:]+ *\\|[-| :]*)(?:\\n((?:(?!\\n|hr|heading|blockquote|code|fences|list|html).*(?:\\n|$))*)\\n*|$)",
    table: "^ *\\|(.+)\\n {0,3}\\|?( *[-:]+[-| :]*)(?:\\n *((?:(?!\\n|hr|heading|blockquote|code|fences|list|html).*(?:\\n|$))*)\\n*|$)"
  });
  block.gfm.nptable = edit$1(block.gfm.nptable).replace("hr", block.hr).replace("heading", " {0,3}#{1,6} ").replace("blockquote", " {0,3}>").replace("code", " {4}[^\\n]").replace("fences", " {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list", " {0,3}(?:[*+-]|1[.)]) ").replace("html", "</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|!--)").replace("tag", block._tag).getRegex();
  block.gfm.table = edit$1(block.gfm.table).replace("hr", block.hr).replace("heading", " {0,3}#{1,6} ").replace("blockquote", " {0,3}>").replace("code", " {4}[^\\n]").replace("fences", " {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list", " {0,3}(?:[*+-]|1[.)]) ").replace("html", "</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|!--)").replace("tag", block._tag).getRegex();
  block.pedantic = merge$1({}, block.normal, {
    html: edit$1(`^ *(?:comment *(?:\\n|\\s*$)|<(tag)[\\s\\S]+?</\\1> *(?:\\n{2,}|\\s*$)|<tag(?:"[^"]*"|'[^']*'|\\s[^'"/>\\s]*)*?/?> *(?:\\n{2,}|\\s*$))`).replace("comment", block._comment).replace(/tag/g, "(?!(?:a|em|strong|small|s|cite|q|dfn|abbr|data|time|code|var|samp|kbd|sub|sup|i|b|u|mark|ruby|rt|rp|bdi|bdo|span|br|wbr|ins|del|img)\\b)\\w+(?!:|[^\\w\\s@]*@)\\b").getRegex(),
    def: /^ *\[([^\]]+)\]: *<?([^\s>]+)>?(?: +(["(][^\n]+[")]))? *(?:\n+|$)/,
    heading: /^ *(#{1,6}) *([^\n]+?) *(?:#+ *)?(?:\n+|$)/,
    fences: noopTest$1,
    paragraph: edit$1(block.normal._paragraph).replace("hr", block.hr).replace("heading", " *#{1,6} *[^\n]").replace("lheading", block.lheading).replace("blockquote", " {0,3}>").replace("|fences", "").replace("|list", "").replace("|html", "").getRegex()
  });
  const inline = {
    escape: /^\\([!"#$%&'()*+,\-./:;<=>?@\[\]\\^_`{|}~])/,
    autolink: /^<(scheme:[^\s\x00-\x1f<>]*|email)>/,
    url: noopTest$1,
    tag: "^comment|^</[a-zA-Z][\\w:-]*\\s*>|^<[a-zA-Z][\\w-]*(?:attribute)*?\\s*/?>|^<\\?[\\s\\S]*?\\?>|^<![a-zA-Z]+\\s[\\s\\S]*?>|^<!\\[CDATA\\[[\\s\\S]*?\\]\\]>",
    link: /^!?\[(label)\]\(\s*(href)(?:\s+(title))?\s*\)/,
    reflink: /^!?\[(label)\]\[(?!\s*\])((?:\\[\[\]]?|[^\[\]\\])+)\]/,
    nolink: /^!?\[(?!\s*\])((?:\[[^\[\]]*\]|\\[\[\]]|[^\[\]])*)\](?:\[\])?/,
    reflinkSearch: "reflink|nolink(?!\\()",
    strong: {
      start: /^(?:(\*\*(?=[*punctuation]))|\*\*)(?![\s])|__/,
      middle: /^\*\*(?:(?:(?!overlapSkip)(?:[^*]|\\\*)|overlapSkip)|\*(?:(?!overlapSkip)(?:[^*]|\\\*)|overlapSkip)*?\*)+?\*\*$|^__(?![\s])((?:(?:(?!overlapSkip)(?:[^_]|\\_)|overlapSkip)|_(?:(?!overlapSkip)(?:[^_]|\\_)|overlapSkip)*?_)+?)__$/,
      endAst: /[^punctuation\s]\*\*(?!\*)|[punctuation]\*\*(?!\*)(?:(?=[punctuation_\s]|$))/,
      endUnd: /[^\s]__(?!_)(?:(?=[punctuation*\s])|$)/
    },
    em: {
      start: /^(?:(\*(?=[punctuation]))|\*)(?![*\s])|_/,
      middle: /^\*(?:(?:(?!overlapSkip)(?:[^*]|\\\*)|overlapSkip)|\*(?:(?!overlapSkip)(?:[^*]|\\\*)|overlapSkip)*?\*)+?\*$|^_(?![_\s])(?:(?:(?!overlapSkip)(?:[^_]|\\_)|overlapSkip)|_(?:(?!overlapSkip)(?:[^_]|\\_)|overlapSkip)*?_)+?_$/,
      endAst: /[^punctuation\s]\*(?!\*)|[punctuation]\*(?!\*)(?:(?=[punctuation_\s]|$))/,
      endUnd: /[^\s]_(?!_)(?:(?=[punctuation*\s])|$)/
    },
    code: /^(`+)([^`]|[^`][\s\S]*?[^`])\1(?!`)/,
    br: /^( {2,}|\\)\n(?!\s*$)/,
    del: noopTest$1,
    text: /^(`+|[^`])(?:(?= {2,}\n)|[\s\S]*?(?:(?=[\\<!\[`*]|\b_|$)|[^ ](?= {2,}\n)))/,
    punctuation: /^([\s*punctuation])/
  };
  inline._punctuation = "!\"#$%&'()+\\-.,/:;<=>?@\\[\\]`^{|}~";
  inline.punctuation = edit$1(inline.punctuation).replace(/punctuation/g, inline._punctuation).getRegex();
  inline._blockSkip = "\\[[^\\]]*?\\]\\([^\\)]*?\\)|`[^`]*?`|<[^>]*?>";
  inline._overlapSkip = "__[^_]*?__|\\*\\*\\[^\\*\\]*?\\*\\*";
  inline._comment = edit$1(block._comment).replace("(?:-->|$)", "-->").getRegex();
  inline.em.start = edit$1(inline.em.start).replace(/punctuation/g, inline._punctuation).getRegex();
  inline.em.middle = edit$1(inline.em.middle).replace(/punctuation/g, inline._punctuation).replace(/overlapSkip/g, inline._overlapSkip).getRegex();
  inline.em.endAst = edit$1(inline.em.endAst, "g").replace(/punctuation/g, inline._punctuation).getRegex();
  inline.em.endUnd = edit$1(inline.em.endUnd, "g").replace(/punctuation/g, inline._punctuation).getRegex();
  inline.strong.start = edit$1(inline.strong.start).replace(/punctuation/g, inline._punctuation).getRegex();
  inline.strong.middle = edit$1(inline.strong.middle).replace(/punctuation/g, inline._punctuation).replace(/overlapSkip/g, inline._overlapSkip).getRegex();
  inline.strong.endAst = edit$1(inline.strong.endAst, "g").replace(/punctuation/g, inline._punctuation).getRegex();
  inline.strong.endUnd = edit$1(inline.strong.endUnd, "g").replace(/punctuation/g, inline._punctuation).getRegex();
  inline.blockSkip = edit$1(inline._blockSkip, "g").getRegex();
  inline.overlapSkip = edit$1(inline._overlapSkip, "g").getRegex();
  inline._escapes = /\\([!"#$%&'()*+,\-./:;<=>?@\[\]\\^_`{|}~])/g;
  inline._scheme = /[a-zA-Z][a-zA-Z0-9+.-]{1,31}/;
  inline._email = /[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+(@)[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+(?![-_])/;
  inline.autolink = edit$1(inline.autolink).replace("scheme", inline._scheme).replace("email", inline._email).getRegex();
  inline._attribute = /\s+[a-zA-Z:_][\w.:-]*(?:\s*=\s*"[^"]*"|\s*=\s*'[^']*'|\s*=\s*[^\s"'=<>`]+)?/;
  inline.tag = edit$1(inline.tag).replace("comment", inline._comment).replace("attribute", inline._attribute).getRegex();
  inline._label = /(?:\[(?:\\.|[^\[\]\\])*\]|\\.|`[^`]*`|[^\[\]\\`])*?/;
  inline._href = /<(?:\\[<>]?|[^\s<>\\])*>|[^\s\x00-\x1f]*/;
  inline._title = /"(?:\\"?|[^"\\])*"|'(?:\\'?|[^'\\])*'|\((?:\\\)?|[^)\\])*\)/;
  inline.link = edit$1(inline.link).replace("label", inline._label).replace("href", inline._href).replace("title", inline._title).getRegex();
  inline.reflink = edit$1(inline.reflink).replace("label", inline._label).getRegex();
  inline.reflinkSearch = edit$1(inline.reflinkSearch, "g").replace("reflink", inline.reflink).replace("nolink", inline.nolink).getRegex();
  inline.normal = merge$1({}, inline);
  inline.pedantic = merge$1({}, inline.normal, {
    strong: {
      start: /^__|\*\*/,
      middle: /^__(?=\S)([\s\S]*?\S)__(?!_)|^\*\*(?=\S)([\s\S]*?\S)\*\*(?!\*)/,
      endAst: /\*\*(?!\*)/g,
      endUnd: /__(?!_)/g
    },
    em: {
      start: /^_|\*/,
      middle: /^()\*(?=\S)([\s\S]*?\S)\*(?!\*)|^_(?=\S)([\s\S]*?\S)_(?!_)/,
      endAst: /\*(?!\*)/g,
      endUnd: /_(?!_)/g
    },
    link: edit$1(/^!?\[(label)\]\((.*?)\)/).replace("label", inline._label).getRegex(),
    reflink: edit$1(/^!?\[(label)\]\s*\[([^\]]*)\]/).replace("label", inline._label).getRegex()
  });
  inline.gfm = merge$1({}, inline.normal, {
    escape: edit$1(inline.escape).replace("])", "~|])").getRegex(),
    _extended_email: /[A-Za-z0-9._+-]+(@)[a-zA-Z0-9-_]+(?:\.[a-zA-Z0-9-_]*[a-zA-Z0-9])+(?![-_])/,
    url: /^((?:ftp|https?):\/\/|www\.)(?:[a-zA-Z0-9\-]+\.?)+[^\s<]*|^email/,
    _backpedal: /(?:[^?!.,:;*_~()&]+|\([^)]*\)|&(?![a-zA-Z0-9]+;$)|[?!.,:;*_~)]+(?!$))+/,
    del: /^(~~?)(?=[^\s~])([\s\S]*?[^\s~])\1(?=[^~]|$)/,
    text: /^([`~]+|[^`~])(?:(?= {2,}\n)|[\s\S]*?(?:(?=[\\<!\[`*~]|\b_|https?:\/\/|ftp:\/\/|www\.|$)|[^ ](?= {2,}\n)|[^a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-](?=[a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-]+@))|(?=[a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-]+@))/
  });
  inline.gfm.url = edit$1(inline.gfm.url, "i").replace("email", inline.gfm._extended_email).getRegex();
  inline.breaks = merge$1({}, inline.gfm, {
    br: edit$1(inline.br).replace("{2,}", "*").getRegex(),
    text: edit$1(inline.gfm.text).replace("\\b_", "\\b_| {2,}\\n").replace(/\{2,\}/g, "*").getRegex()
  });
  var rules = {
    block,
    inline
  };
  const {defaults: defaults$2} = defaults;
  const {block: block$1, inline: inline$1} = rules;
  const {repeatString: repeatString$1} = helpers;
  function smartypants(text3) {
    return text3.replace(/---/g, "—").replace(/--/g, "–").replace(/(^|[-\u2014/(\[{"\s])'/g, "$1‘").replace(/'/g, "’").replace(/(^|[-\u2014/(\[{\u2018\s])"/g, "$1“").replace(/"/g, "”").replace(/\.{3}/g, "…");
  }
  function mangle(text3) {
    let out = "", i, ch;
    const l = text3.length;
    for (i = 0; i < l; i++) {
      ch = text3.charCodeAt(i);
      if (Math.random() > 0.5) {
        ch = "x" + ch.toString(16);
      }
      out += "&#" + ch + ";";
    }
    return out;
  }
  var Lexer_1 = class Lexer {
    constructor(options) {
      this.tokens = [];
      this.tokens.links = Object.create(null);
      this.options = options || defaults$2;
      this.options.tokenizer = this.options.tokenizer || new Tokenizer_1();
      this.tokenizer = this.options.tokenizer;
      this.tokenizer.options = this.options;
      const rules2 = {
        block: block$1.normal,
        inline: inline$1.normal
      };
      if (this.options.pedantic) {
        rules2.block = block$1.pedantic;
        rules2.inline = inline$1.pedantic;
      } else if (this.options.gfm) {
        rules2.block = block$1.gfm;
        if (this.options.breaks) {
          rules2.inline = inline$1.breaks;
        } else {
          rules2.inline = inline$1.gfm;
        }
      }
      this.tokenizer.rules = rules2;
    }
    static get rules() {
      return {
        block: block$1,
        inline: inline$1
      };
    }
    static lex(src, options) {
      const lexer = new Lexer(options);
      return lexer.lex(src);
    }
    static lexInline(src, options) {
      const lexer = new Lexer(options);
      return lexer.inlineTokens(src);
    }
    lex(src) {
      src = src.replace(/\r\n|\r/g, "\n").replace(/\t/g, "    ");
      this.blockTokens(src, this.tokens, true);
      this.inline(this.tokens);
      return this.tokens;
    }
    blockTokens(src, tokens = [], top = true) {
      src = src.replace(/^ +$/gm, "");
      let token, i, l, lastToken;
      while (src) {
        if (token = this.tokenizer.space(src)) {
          src = src.substring(token.raw.length);
          if (token.type) {
            tokens.push(token);
          }
          continue;
        }
        if (token = this.tokenizer.code(src, tokens)) {
          src = src.substring(token.raw.length);
          if (token.type) {
            tokens.push(token);
          } else {
            lastToken = tokens[tokens.length - 1];
            lastToken.raw += "\n" + token.raw;
            lastToken.text += "\n" + token.text;
          }
          continue;
        }
        if (token = this.tokenizer.fences(src)) {
          src = src.substring(token.raw.length);
          tokens.push(token);
          continue;
        }
        if (token = this.tokenizer.heading(src)) {
          src = src.substring(token.raw.length);
          tokens.push(token);
          continue;
        }
        if (token = this.tokenizer.nptable(src)) {
          src = src.substring(token.raw.length);
          tokens.push(token);
          continue;
        }
        if (token = this.tokenizer.hr(src)) {
          src = src.substring(token.raw.length);
          tokens.push(token);
          continue;
        }
        if (token = this.tokenizer.blockquote(src)) {
          src = src.substring(token.raw.length);
          token.tokens = this.blockTokens(token.text, [], top);
          tokens.push(token);
          continue;
        }
        if (token = this.tokenizer.list(src)) {
          src = src.substring(token.raw.length);
          l = token.items.length;
          for (i = 0; i < l; i++) {
            token.items[i].tokens = this.blockTokens(token.items[i].text, [], false);
          }
          tokens.push(token);
          continue;
        }
        if (token = this.tokenizer.html(src)) {
          src = src.substring(token.raw.length);
          tokens.push(token);
          continue;
        }
        if (top && (token = this.tokenizer.def(src))) {
          src = src.substring(token.raw.length);
          if (!this.tokens.links[token.tag]) {
            this.tokens.links[token.tag] = {
              href: token.href,
              title: token.title
            };
          }
          continue;
        }
        if (token = this.tokenizer.table(src)) {
          src = src.substring(token.raw.length);
          tokens.push(token);
          continue;
        }
        if (token = this.tokenizer.lheading(src)) {
          src = src.substring(token.raw.length);
          tokens.push(token);
          continue;
        }
        if (top && (token = this.tokenizer.paragraph(src))) {
          src = src.substring(token.raw.length);
          tokens.push(token);
          continue;
        }
        if (token = this.tokenizer.text(src, tokens)) {
          src = src.substring(token.raw.length);
          if (token.type) {
            tokens.push(token);
          } else {
            lastToken = tokens[tokens.length - 1];
            lastToken.raw += "\n" + token.raw;
            lastToken.text += "\n" + token.text;
          }
          continue;
        }
        if (src) {
          const errMsg = "Infinite loop on byte: " + src.charCodeAt(0);
          if (this.options.silent) {
            console.error(errMsg);
            break;
          } else {
            throw new Error(errMsg);
          }
        }
      }
      return tokens;
    }
    inline(tokens) {
      let i, j, k, l2, row, token;
      const l = tokens.length;
      for (i = 0; i < l; i++) {
        token = tokens[i];
        switch (token.type) {
          case "paragraph":
          case "text":
          case "heading": {
            token.tokens = [];
            this.inlineTokens(token.text, token.tokens);
            break;
          }
          case "table": {
            token.tokens = {
              header: [],
              cells: []
            };
            l2 = token.header.length;
            for (j = 0; j < l2; j++) {
              token.tokens.header[j] = [];
              this.inlineTokens(token.header[j], token.tokens.header[j]);
            }
            l2 = token.cells.length;
            for (j = 0; j < l2; j++) {
              row = token.cells[j];
              token.tokens.cells[j] = [];
              for (k = 0; k < row.length; k++) {
                token.tokens.cells[j][k] = [];
                this.inlineTokens(row[k], token.tokens.cells[j][k]);
              }
            }
            break;
          }
          case "blockquote": {
            this.inline(token.tokens);
            break;
          }
          case "list": {
            l2 = token.items.length;
            for (j = 0; j < l2; j++) {
              this.inline(token.items[j].tokens);
            }
            break;
          }
        }
      }
      return tokens;
    }
    inlineTokens(src, tokens = [], inLink = false, inRawBlock = false) {
      let token;
      let maskedSrc = src;
      let match;
      let keepPrevChar, prevChar;
      if (this.tokens.links) {
        const links = Object.keys(this.tokens.links);
        if (links.length > 0) {
          while ((match = this.tokenizer.rules.inline.reflinkSearch.exec(maskedSrc)) != null) {
            if (links.includes(match[0].slice(match[0].lastIndexOf("[") + 1, -1))) {
              maskedSrc = maskedSrc.slice(0, match.index) + "[" + repeatString$1("a", match[0].length - 2) + "]" + maskedSrc.slice(this.tokenizer.rules.inline.reflinkSearch.lastIndex);
            }
          }
        }
      }
      while ((match = this.tokenizer.rules.inline.blockSkip.exec(maskedSrc)) != null) {
        maskedSrc = maskedSrc.slice(0, match.index) + "[" + repeatString$1("a", match[0].length - 2) + "]" + maskedSrc.slice(this.tokenizer.rules.inline.blockSkip.lastIndex);
      }
      while (src) {
        if (!keepPrevChar) {
          prevChar = "";
        }
        keepPrevChar = false;
        if (token = this.tokenizer.escape(src)) {
          src = src.substring(token.raw.length);
          tokens.push(token);
          continue;
        }
        if (token = this.tokenizer.tag(src, inLink, inRawBlock)) {
          src = src.substring(token.raw.length);
          inLink = token.inLink;
          inRawBlock = token.inRawBlock;
          tokens.push(token);
          continue;
        }
        if (token = this.tokenizer.link(src)) {
          src = src.substring(token.raw.length);
          if (token.type === "link") {
            token.tokens = this.inlineTokens(token.text, [], true, inRawBlock);
          }
          tokens.push(token);
          continue;
        }
        if (token = this.tokenizer.reflink(src, this.tokens.links)) {
          src = src.substring(token.raw.length);
          if (token.type === "link") {
            token.tokens = this.inlineTokens(token.text, [], true, inRawBlock);
          }
          tokens.push(token);
          continue;
        }
        if (token = this.tokenizer.strong(src, maskedSrc, prevChar)) {
          src = src.substring(token.raw.length);
          token.tokens = this.inlineTokens(token.text, [], inLink, inRawBlock);
          tokens.push(token);
          continue;
        }
        if (token = this.tokenizer.em(src, maskedSrc, prevChar)) {
          src = src.substring(token.raw.length);
          token.tokens = this.inlineTokens(token.text, [], inLink, inRawBlock);
          tokens.push(token);
          continue;
        }
        if (token = this.tokenizer.codespan(src)) {
          src = src.substring(token.raw.length);
          tokens.push(token);
          continue;
        }
        if (token = this.tokenizer.br(src)) {
          src = src.substring(token.raw.length);
          tokens.push(token);
          continue;
        }
        if (token = this.tokenizer.del(src)) {
          src = src.substring(token.raw.length);
          token.tokens = this.inlineTokens(token.text, [], inLink, inRawBlock);
          tokens.push(token);
          continue;
        }
        if (token = this.tokenizer.autolink(src, mangle)) {
          src = src.substring(token.raw.length);
          tokens.push(token);
          continue;
        }
        if (!inLink && (token = this.tokenizer.url(src, mangle))) {
          src = src.substring(token.raw.length);
          tokens.push(token);
          continue;
        }
        if (token = this.tokenizer.inlineText(src, inRawBlock, smartypants)) {
          src = src.substring(token.raw.length);
          prevChar = token.raw.slice(-1);
          keepPrevChar = true;
          tokens.push(token);
          continue;
        }
        if (src) {
          const errMsg = "Infinite loop on byte: " + src.charCodeAt(0);
          if (this.options.silent) {
            console.error(errMsg);
            break;
          } else {
            throw new Error(errMsg);
          }
        }
      }
      return tokens;
    }
  };
  const {defaults: defaults$3} = defaults;
  const {
    cleanUrl: cleanUrl$1,
    escape: escape$2
  } = helpers;
  var Renderer_1 = class Renderer {
    constructor(options) {
      this.options = options || defaults$3;
    }
    code(code, infostring, escaped) {
      const lang = (infostring || "").match(/\S*/)[0];
      if (this.options.highlight) {
        const out = this.options.highlight(code, lang);
        if (out != null && out !== code) {
          escaped = true;
          code = out;
        }
      }
      if (!lang) {
        return "<pre><code>" + (escaped ? code : escape$2(code, true)) + "</code></pre>\n";
      }
      return '<pre><code class="' + this.options.langPrefix + escape$2(lang, true) + '">' + (escaped ? code : escape$2(code, true)) + "</code></pre>\n";
    }
    blockquote(quote) {
      return "<blockquote>\n" + quote + "</blockquote>\n";
    }
    html(html3) {
      return html3;
    }
    heading(text3, level, raw, slugger) {
      if (this.options.headerIds) {
        return "<h" + level + ' id="' + this.options.headerPrefix + slugger.slug(raw) + '">' + text3 + "</h" + level + ">\n";
      }
      return "<h" + level + ">" + text3 + "</h" + level + ">\n";
    }
    hr() {
      return this.options.xhtml ? "<hr/>\n" : "<hr>\n";
    }
    list(body, ordered, start) {
      const type = ordered ? "ol" : "ul", startatt = ordered && start !== 1 ? ' start="' + start + '"' : "";
      return "<" + type + startatt + ">\n" + body + "</" + type + ">\n";
    }
    listitem(text3) {
      return "<li>" + text3 + "</li>\n";
    }
    checkbox(checked) {
      return "<input " + (checked ? 'checked="" ' : "") + 'disabled="" type="checkbox"' + (this.options.xhtml ? " /" : "") + "> ";
    }
    paragraph(text3) {
      return "<p>" + text3 + "</p>\n";
    }
    table(header, body) {
      if (body)
        body = "<tbody>" + body + "</tbody>";
      return "<table>\n<thead>\n" + header + "</thead>\n" + body + "</table>\n";
    }
    tablerow(content) {
      return "<tr>\n" + content + "</tr>\n";
    }
    tablecell(content, flags) {
      const type = flags.header ? "th" : "td";
      const tag = flags.align ? "<" + type + ' align="' + flags.align + '">' : "<" + type + ">";
      return tag + content + "</" + type + ">\n";
    }
    strong(text3) {
      return "<strong>" + text3 + "</strong>";
    }
    em(text3) {
      return "<em>" + text3 + "</em>";
    }
    codespan(text3) {
      return "<code>" + text3 + "</code>";
    }
    br() {
      return this.options.xhtml ? "<br/>" : "<br>";
    }
    del(text3) {
      return "<del>" + text3 + "</del>";
    }
    link(href, title, text3) {
      href = cleanUrl$1(this.options.sanitize, this.options.baseUrl, href);
      if (href === null) {
        return text3;
      }
      let out = '<a href="' + escape$2(href) + '"';
      if (title) {
        out += ' title="' + title + '"';
      }
      out += ">" + text3 + "</a>";
      return out;
    }
    image(href, title, text3) {
      href = cleanUrl$1(this.options.sanitize, this.options.baseUrl, href);
      if (href === null) {
        return text3;
      }
      let out = '<img src="' + href + '" alt="' + text3 + '"';
      if (title) {
        out += ' title="' + title + '"';
      }
      out += this.options.xhtml ? "/>" : ">";
      return out;
    }
    text(text3) {
      return text3;
    }
  };
  var TextRenderer_1 = class TextRenderer {
    strong(text3) {
      return text3;
    }
    em(text3) {
      return text3;
    }
    codespan(text3) {
      return text3;
    }
    del(text3) {
      return text3;
    }
    html(text3) {
      return text3;
    }
    text(text3) {
      return text3;
    }
    link(href, title, text3) {
      return "" + text3;
    }
    image(href, title, text3) {
      return "" + text3;
    }
    br() {
      return "";
    }
  };
  var Slugger_1 = class Slugger {
    constructor() {
      this.seen = {};
    }
    serialize(value) {
      return value.toLowerCase().trim().replace(/<[!\/a-z].*?>/ig, "").replace(/[\u2000-\u206F\u2E00-\u2E7F\\'!"#$%&()*+,./:;<=>?@[\]^`{|}~]/g, "").replace(/\s/g, "-");
    }
    getNextSafeSlug(originalSlug, isDryRun) {
      let slug = originalSlug;
      let occurenceAccumulator = 0;
      if (this.seen.hasOwnProperty(slug)) {
        occurenceAccumulator = this.seen[originalSlug];
        do {
          occurenceAccumulator++;
          slug = originalSlug + "-" + occurenceAccumulator;
        } while (this.seen.hasOwnProperty(slug));
      }
      if (!isDryRun) {
        this.seen[originalSlug] = occurenceAccumulator;
        this.seen[slug] = 0;
      }
      return slug;
    }
    slug(value, options = {}) {
      const slug = this.serialize(value);
      return this.getNextSafeSlug(slug, options.dryrun);
    }
  };
  const {defaults: defaults$4} = defaults;
  const {
    unescape: unescape$1
  } = helpers;
  var Parser_1 = class Parser {
    constructor(options) {
      this.options = options || defaults$4;
      this.options.renderer = this.options.renderer || new Renderer_1();
      this.renderer = this.options.renderer;
      this.renderer.options = this.options;
      this.textRenderer = new TextRenderer_1();
      this.slugger = new Slugger_1();
    }
    static parse(tokens, options) {
      const parser = new Parser(options);
      return parser.parse(tokens);
    }
    static parseInline(tokens, options) {
      const parser = new Parser(options);
      return parser.parseInline(tokens);
    }
    parse(tokens, top = true) {
      let out = "", i, j, k, l2, l3, row, cell, header, body, token, ordered, start, loose, itemBody, item, checked, task, checkbox;
      const l = tokens.length;
      for (i = 0; i < l; i++) {
        token = tokens[i];
        switch (token.type) {
          case "space": {
            continue;
          }
          case "hr": {
            out += this.renderer.hr();
            continue;
          }
          case "heading": {
            out += this.renderer.heading(this.parseInline(token.tokens), token.depth, unescape$1(this.parseInline(token.tokens, this.textRenderer)), this.slugger);
            continue;
          }
          case "code": {
            out += this.renderer.code(token.text, token.lang, token.escaped);
            continue;
          }
          case "table": {
            header = "";
            cell = "";
            l2 = token.header.length;
            for (j = 0; j < l2; j++) {
              cell += this.renderer.tablecell(this.parseInline(token.tokens.header[j]), {header: true, align: token.align[j]});
            }
            header += this.renderer.tablerow(cell);
            body = "";
            l2 = token.cells.length;
            for (j = 0; j < l2; j++) {
              row = token.tokens.cells[j];
              cell = "";
              l3 = row.length;
              for (k = 0; k < l3; k++) {
                cell += this.renderer.tablecell(this.parseInline(row[k]), {header: false, align: token.align[k]});
              }
              body += this.renderer.tablerow(cell);
            }
            out += this.renderer.table(header, body);
            continue;
          }
          case "blockquote": {
            body = this.parse(token.tokens);
            out += this.renderer.blockquote(body);
            continue;
          }
          case "list": {
            ordered = token.ordered;
            start = token.start;
            loose = token.loose;
            l2 = token.items.length;
            body = "";
            for (j = 0; j < l2; j++) {
              item = token.items[j];
              checked = item.checked;
              task = item.task;
              itemBody = "";
              if (item.task) {
                checkbox = this.renderer.checkbox(checked);
                if (loose) {
                  if (item.tokens.length > 0 && item.tokens[0].type === "text") {
                    item.tokens[0].text = checkbox + " " + item.tokens[0].text;
                    if (item.tokens[0].tokens && item.tokens[0].tokens.length > 0 && item.tokens[0].tokens[0].type === "text") {
                      item.tokens[0].tokens[0].text = checkbox + " " + item.tokens[0].tokens[0].text;
                    }
                  } else {
                    item.tokens.unshift({
                      type: "text",
                      text: checkbox
                    });
                  }
                } else {
                  itemBody += checkbox;
                }
              }
              itemBody += this.parse(item.tokens, loose);
              body += this.renderer.listitem(itemBody, task, checked);
            }
            out += this.renderer.list(body, ordered, start);
            continue;
          }
          case "html": {
            out += this.renderer.html(token.text);
            continue;
          }
          case "paragraph": {
            out += this.renderer.paragraph(this.parseInline(token.tokens));
            continue;
          }
          case "text": {
            body = token.tokens ? this.parseInline(token.tokens) : token.text;
            while (i + 1 < l && tokens[i + 1].type === "text") {
              token = tokens[++i];
              body += "\n" + (token.tokens ? this.parseInline(token.tokens) : token.text);
            }
            out += top ? this.renderer.paragraph(body) : body;
            continue;
          }
          default: {
            const errMsg = 'Token with "' + token.type + '" type was not found.';
            if (this.options.silent) {
              console.error(errMsg);
              return;
            } else {
              throw new Error(errMsg);
            }
          }
        }
      }
      return out;
    }
    parseInline(tokens, renderer) {
      renderer = renderer || this.renderer;
      let out = "", i, token;
      const l = tokens.length;
      for (i = 0; i < l; i++) {
        token = tokens[i];
        switch (token.type) {
          case "escape": {
            out += renderer.text(token.text);
            break;
          }
          case "html": {
            out += renderer.html(token.text);
            break;
          }
          case "link": {
            out += renderer.link(token.href, token.title, this.parseInline(token.tokens, renderer));
            break;
          }
          case "image": {
            out += renderer.image(token.href, token.title, token.text);
            break;
          }
          case "strong": {
            out += renderer.strong(this.parseInline(token.tokens, renderer));
            break;
          }
          case "em": {
            out += renderer.em(this.parseInline(token.tokens, renderer));
            break;
          }
          case "codespan": {
            out += renderer.codespan(token.text);
            break;
          }
          case "br": {
            out += renderer.br();
            break;
          }
          case "del": {
            out += renderer.del(this.parseInline(token.tokens, renderer));
            break;
          }
          case "text": {
            out += renderer.text(token.text);
            break;
          }
          default: {
            const errMsg = 'Token with "' + token.type + '" type was not found.';
            if (this.options.silent) {
              console.error(errMsg);
              return;
            } else {
              throw new Error(errMsg);
            }
          }
        }
      }
      return out;
    }
  };
  const {
    merge: merge$2,
    checkSanitizeDeprecation: checkSanitizeDeprecation$1,
    escape: escape$3
  } = helpers;
  const {
    getDefaults,
    changeDefaults,
    defaults: defaults$5
  } = defaults;
  function marked2(src, opt, callback) {
    if (typeof src === "undefined" || src === null) {
      throw new Error("marked(): input parameter is undefined or null");
    }
    if (typeof src !== "string") {
      throw new Error("marked(): input parameter is of type " + Object.prototype.toString.call(src) + ", string expected");
    }
    if (typeof opt === "function") {
      callback = opt;
      opt = null;
    }
    opt = merge$2({}, marked2.defaults, opt || {});
    checkSanitizeDeprecation$1(opt);
    if (callback) {
      const highlight = opt.highlight;
      let tokens;
      try {
        tokens = Lexer_1.lex(src, opt);
      } catch (e) {
        return callback(e);
      }
      const done = function(err) {
        let out;
        if (!err) {
          try {
            out = Parser_1.parse(tokens, opt);
          } catch (e) {
            err = e;
          }
        }
        opt.highlight = highlight;
        return err ? callback(err) : callback(null, out);
      };
      if (!highlight || highlight.length < 3) {
        return done();
      }
      delete opt.highlight;
      if (!tokens.length)
        return done();
      let pending = 0;
      marked2.walkTokens(tokens, function(token) {
        if (token.type === "code") {
          pending++;
          setTimeout(() => {
            highlight(token.text, token.lang, function(err, code) {
              if (err) {
                return done(err);
              }
              if (code != null && code !== token.text) {
                token.text = code;
                token.escaped = true;
              }
              pending--;
              if (pending === 0) {
                done();
              }
            });
          }, 0);
        }
      });
      if (pending === 0) {
        done();
      }
      return;
    }
    try {
      const tokens = Lexer_1.lex(src, opt);
      if (opt.walkTokens) {
        marked2.walkTokens(tokens, opt.walkTokens);
      }
      return Parser_1.parse(tokens, opt);
    } catch (e) {
      e.message += "\nPlease report this to https://github.com/markedjs/marked.";
      if (opt.silent) {
        return "<p>An error occurred:</p><pre>" + escape$3(e.message + "", true) + "</pre>";
      }
      throw e;
    }
  }
  marked2.options = marked2.setOptions = function(opt) {
    merge$2(marked2.defaults, opt);
    changeDefaults(marked2.defaults);
    return marked2;
  };
  marked2.getDefaults = getDefaults;
  marked2.defaults = defaults$5;
  marked2.use = function(extension) {
    const opts = merge$2({}, extension);
    if (extension.renderer) {
      const renderer = marked2.defaults.renderer || new Renderer_1();
      for (const prop in extension.renderer) {
        const prevRenderer = renderer[prop];
        renderer[prop] = (...args) => {
          let ret = extension.renderer[prop].apply(renderer, args);
          if (ret === false) {
            ret = prevRenderer.apply(renderer, args);
          }
          return ret;
        };
      }
      opts.renderer = renderer;
    }
    if (extension.tokenizer) {
      const tokenizer = marked2.defaults.tokenizer || new Tokenizer_1();
      for (const prop in extension.tokenizer) {
        const prevTokenizer = tokenizer[prop];
        tokenizer[prop] = (...args) => {
          let ret = extension.tokenizer[prop].apply(tokenizer, args);
          if (ret === false) {
            ret = prevTokenizer.apply(tokenizer, args);
          }
          return ret;
        };
      }
      opts.tokenizer = tokenizer;
    }
    if (extension.walkTokens) {
      const walkTokens = marked2.defaults.walkTokens;
      opts.walkTokens = (token) => {
        extension.walkTokens(token);
        if (walkTokens) {
          walkTokens(token);
        }
      };
    }
    marked2.setOptions(opts);
  };
  marked2.walkTokens = function(tokens, callback) {
    for (const token of tokens) {
      callback(token);
      switch (token.type) {
        case "table": {
          for (const cell of token.tokens.header) {
            marked2.walkTokens(cell, callback);
          }
          for (const row of token.tokens.cells) {
            for (const cell of row) {
              marked2.walkTokens(cell, callback);
            }
          }
          break;
        }
        case "list": {
          marked2.walkTokens(token.items, callback);
          break;
        }
        default: {
          if (token.tokens) {
            marked2.walkTokens(token.tokens, callback);
          }
        }
      }
    }
  };
  marked2.parseInline = function(src, opt) {
    if (typeof src === "undefined" || src === null) {
      throw new Error("marked.parseInline(): input parameter is undefined or null");
    }
    if (typeof src !== "string") {
      throw new Error("marked.parseInline(): input parameter is of type " + Object.prototype.toString.call(src) + ", string expected");
    }
    opt = merge$2({}, marked2.defaults, opt || {});
    checkSanitizeDeprecation$1(opt);
    try {
      const tokens = Lexer_1.lexInline(src, opt);
      if (opt.walkTokens) {
        marked2.walkTokens(tokens, opt.walkTokens);
      }
      return Parser_1.parseInline(tokens, opt);
    } catch (e) {
      e.message += "\nPlease report this to https://github.com/markedjs/marked.";
      if (opt.silent) {
        return "<p>An error occurred:</p><pre>" + escape$3(e.message + "", true) + "</pre>";
      }
      throw e;
    }
  };
  marked2.Parser = Parser_1;
  marked2.parser = Parser_1.parse;
  marked2.Renderer = Renderer_1;
  marked2.TextRenderer = TextRenderer_1;
  marked2.Lexer = Lexer_1;
  marked2.lexer = Lexer_1.lex;
  marked2.Tokenizer = Tokenizer_1;
  marked2.Slugger = Slugger_1;
  marked2.parse = marked2;
  var marked_1 = marked2;
  var marked_default = marked_1;

  // source/js/functions/renderPreview.js
  function getFieldValue(prop) {
    for (let [key, value] of state_default.currentDataset.fields)
      if (key == prop)
        return value;
  }
  function hydrateFromDataset(string) {
    return getFieldValue(string.slice(1, -1).trim(), state_default.currentDataset.fields);
  }
  let dataMatcher = /\{.+?\}/g;
  var renderPreview_default = () => {
    setState("showPreview", true);
    let previewWrapper = $(".preview__wrapper");
    let hydrated = state_default.currentDocument.body.replace(dataMatcher, hydrateFromDataset);
    let sanitized = purify_default.sanitize(marked_default(hydrated));
    previewWrapper.innerHTML = "";
    for (let pageContent of sanitized.split("<hr>")) {
      let pageElement = document.createElement("div");
      pageElement.classList.add("preview__page");
      pageElement.innerHTML = pageContent;
      previewWrapper.append(pageElement);
    }
  };

  // source/js/app.js
  if (!state_default.savedLocally) {
    document.documentElement.classList.add("loading");
    fetch("/db.json").then((r) => r.json()).then((users) => users[0]).then((user) => {
      state_default.currentUser = user;
      state_default.currentDocument = state_default.currentUser.documents[0];
      state_default.currentDataset = state_default.currentUser.datasets[0];
      Object.keys(tags).map((tagName) => state_default.styles[tagName] = {});
    }).then(renderAll).then(autoSave).then(() => document.documentElement.classList.remove("loading"));
  } else {
    state_default.currentDataset = state_default.currentUser.datasets[0];
    state_default.currentDocument = state_default.currentUser.documents[0];
    document.documentElement.classList.toggle("dark", state_default.dark);
    state_default.styles = state_default.styles || {};
    Object.keys(tags).map((tagName) => state_default.styles[tagName] = state_default.styles[tagName] || {});
    state_default.showPreview ? renderPreview_default() : renderAll();
    autoSave();
  }
})();
