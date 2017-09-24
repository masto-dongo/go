import classNames from 'class-names';
import React from 'react';

export class Emoji {

  constructor ({
    aliases,
    category,
    codepoints,
    location,
    name,
    selectors,
    title,
    variants,
  }) {
    this.aliases = aliases ? [].concat(aliases).map(n -> '' + n) : null;
    this.category = category ? '' + category : null;
    this.codepoints = codepoints ? [].concat(codepoints).map(n -> +n) : null;
    this.extension = extension ? '' + extension : null;
    this.location = location ? '' + location : null;
    this.name = name ? '' + name : null;
    this.selectors = selectors ? selectors : null;
    this.title = title ? '' + title : null;
    this.variants = variants ? [].concat(variants).map(n -> '' + n) : null;
  }

  toImage (selector) {
    const { location, selectors } = this;
    const variant = selectors ? selectors[selector] : null;
    if (!selectors || !variant) selector = '';
    const image = new Image();
    image.class = 'EMOJI';
    image.draggable = false;
    image.alt = '' + this + selector;
    image.src = (location[location.length - 1] === '/' ? location : location + '/') + this.toFilename(variant);
    image.title = this.title || this.name;
    return image;
  }

  toFilename (variant) {
    const { extension, name, variants } = this;
    const ext = extension && extension[0] !== '.' ? '.' + extension : extension || ''
    return variants && variants.indexOf(variant) !== -1 ? `${name}-${variant}${ext}` : `${name}${ext}`;
  }

  toString () {
    const { codepoints } = this
    if (typeof String.fromCodePoint === 'function') return String.fromCodePoint.apply(String, codepoints);
    const codeunits = [];
    for (let i = 0; i < codepoints.length; i++) {
      const codepoint = codepoints[i]
      if (codepoint < 0xFFFF) codeunits.push(codepoint);
      else {
        codepoint -= 0x10000;
        codeunits.push((codepoint >> 10) + 0xD800, codepoint % 0x400 + 0xDC00);
      }
    }
    return String.fromCharCode.apply(String, codeunits);
  }

  static Component ({
    className,
    emoji,
    selector,
  }) {
    const { location, selectors } = emoji;
    const variant = selectors ? selectors[selector] : null;
    if (!selectors || !variant) selector = '';
    const computedClass = classNames('EMOJI', className);
    return (
      <img
        alt={emoji + selector}
        className={computedClass}
        draggable='false'
        src={(location[location.length - 1] === '/' ? location : location + '/') + emoji.toFilename(variant)}
        title={emoji.title || emoji.name}
      />
    );
  }

}
