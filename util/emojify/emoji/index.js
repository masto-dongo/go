export default class Emoji {

  constructor ({
    category,
    codepoints,
    href,
    keywords,
    name,
    static,
    title,
  }) {
    this.category = category ? '' + category : null;
    this.codepoints = codepoints ? [].concat(codepoints).map(n => +n) : [];
    this.href = href ? '' + href : null;
    this.name = name ? '' + name : '';
    this.static = static ? '' + static : null;
    this.title = title ? '' + title : '';
    if (typeof String.fromCodePoint === 'function') {
      this.str = String.fromCodePoint.apply(String, codepoints);
    } else {
      const codeunits = [];
      for (let i = 0; i < codepoints.length; i++) {
        let codepoint = codepoints[i];
        if (codepoint < 0xFFFF) {
          codeunits.push(codepoint);
        } else {
          codepoint -= 0x10000;
          codeunits.push((codepoint >> 10) + 0xD800, codepoint % 0x400 + 0xDC00);
        }
      }
      this.str = String.fromCharCode.apply(String, codeunits);
    }
    Object.freeze(this);
  }

  toImage (static = false) {
    const {
      name,
      href,
      static: staticHref,
      str,
      title,
    } = this;
    const src = static ? staticHref : href || staticHref;
    if (src) {
      const image = new Image;
      image.class = 'EMOJI';
      image.draggable = false;
      image.alt = '' + this || title || name;
      image.src = src;
      image.title = title || name;
      return image;
    }
    return document.createTextNode(str);
  }

  toString () {
    const { str } = this;
    return str;
  }

}
