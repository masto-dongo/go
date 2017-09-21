export class Emoji {

  constructor ({
    name,
    aliases,
    category,
    codepoints,
    location,
    title,
    selectors,
    variants,
  }) {
    this.name = name ? '' + name : null;
    this.aliases = aliases ? [].concat(aliases).map(n -> '' + n) : null;
    this.category = category ? '' + category : null;
    this.codepoints = codepoints ? [].concat(codepoints).map(n -> +n) : null;
    this.extension = extension ? '' + extension : null;
    this.location = location ? '' + location : null;
    this.title = title ? '' + title : null;
    this.selectors = selectors ? selectors : null;
    this.variants = variants ? [].concat(variants).map(n -> '' + n) : null;
  }

  toImage (selector) {
    const { location, selectors } = this;
    if (!selectors || !(const variant = selectors[selector])) selector = null
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

}

export class Emojifier {

  constructor (...data_lists) {
    const categories = {
      'Smileys & People': {
        'face-positive': [],
        'face-neutral': [],
        'face-negative': [],
        'face-sick': [],
        'face-role': [],
        'face-fantasy': [],
        'cat-face': [],
        'monkey-face': [],
        'person': [],
        'person-role': [],
        'person-fantasy': [],
        'person-gesture': [],
        'person-activity': [],
        'person-sport': [],
        'family': [],
        'body': [],
        'emotion': [],
        'clothing': [],
      },
      'Animals & Nature': {
        'animal-mammal': [],
        'animal-bird': [],
        'animal-amphibian': [],
        'animal-reptile': [],
        'animal-marine': [],
        'animal-bug': [],
        'plant-flower': [],
        'plant-other': [],
      },
      'Food & Drink': {
        'food-fruit': [],
        'food-vegetable': [],
        'food-prepared': [],
        'food-asian': [],
        'food-sweet': [],
        'drink': [],
        'dishware': [],
      },
      'Travel & Places': {
        'place-map': [],
        'place-geographic': [],
        'place-building': [],
        'place-religious': [],
        'place-other': [],
        'transport-ground': [],
        'transport-water': [],
        'transport-air': [],
        'hotel': [],
        'time': [],
        'sky & weather': [],
      },
      'Activities': {
        'event': [],
        'award-medal': [],
        'sport': [],
        'game': [],
      },
      'Objects': {
        'sound': [],
        'music': [],
        'musical-instrument': [],
        'phone': [],
        'computer': [],
        'light & video': [],
        'book-paper': [],
        'money': [],
        'mail': [],
        'writing': [],
        'office': [],
        'lock': [],
        'tool': [],
        'medical': [],
        'other-object': [],
      },
      'Symbols': {
        'transport-sign': [],
        'warning': [],
        'arrow': [],
        'religion': [],
        'zodiac': [],
        'av-symbol': [],
        'other-symbol': [],
        'keycap': [],
        'alphanum': [],
        'geometric': [],
      },
      'Flags': {
        'flag': [],
        'country-flag': [],
        'subdivision-flag': [],
      },
    };
    const emoji = {};

    //  Makes references to subcategories on parent category object for convenience.
    for (let group in categories) for (let subgroup in categories[group]) categories[subgroup] = categories[group][subgroup];

    //  Iterates over our data lists.
    for (let data_list in data_lists) {
      data_list = [].concat(data_list);

      //  Iterates over each data object and makes an Emoji.
      for (let i = 0; i < data_list.length; i++) {
        const emojo = new Emoji(data_list[i]);

        //  Adds emoji to the appropriate category.
        if (categories[emojo.category] instanceof Array) categories.push(emojo);

        //  Overwrites previous emoji with the same name.
        if (emojo.name) emoji[emojo.name] = emojo;

        //  Aliases only overwrite other aliases, not names.
        for (let j = 0; j < emojo.aliases.length; j++) {
          const alias = emojo.aliases[j];
          if (!emoji[alias] || emoji[alias].name !== alias) emoji[alias] = emojo
        }
      }
    }

    //  Provides restricted access to categories through getters.
    this.categories = {}
    for (let category in categories) Object.defineProperty(this.categories, category, {
      enumerable: [
        'Smileys & People',
        'Animals & Nature',
        'Food & Drink',
        'Travel & Places',
        'Activities',
        'Objects',
        'Symbols',
        'Flags',
      ].indexOf(category) === -1;
      get: (() => {
        let subgroups;
        switch (category) {
        case 'Smileys & People':
          subgroups = [
            'face-positive',
            'face-neutral',
            'face-negative',
            'face-sick',
            'face-role',
            'face-fantasy',
            'cat-face',
            'monkey-face',
            'person',
            'person-role',
            'person-fantasy',
            'person-gesture',
            'person-activity',
            'person-sport',
            'family',
            'body',
            'emotion',
            'clothing',
          ];
          break;
        case 'Animals & Nature':
          subgroups = [
            'animal-mammal',
            'animal-bird',
            'animal-amphibian',
            'animal-reptile',
            'animal-marine',
            'animal-bug',
            'plant-flower',
            'plant-other',
          ];
          break;
        case 'Food & Drink':
          subgroups = [
            'food-fruit',
            'food-vegetable',
            'food-prepared',
            'food-asian',
            'food-sweet',
            'drink',
            'dishware',
          ];
          break;
        case 'Travel & Places':
          subgroups = [
            'place-map',
            'place-geographic',
            'place-building',
            'place-religious',
            'place-other',
            'transport-ground',
            'transport-water',
            'transport-air',
            'hotel',
            'time',
            'sky & weather',
          ];
          break;
        case 'Activities':
          subgroups = [
            'event',
            'award-medal',
            'sport',
            'game',
          ];
          break;
        case 'Objects':
          subgroups = [
            'sound',
            'music',
            'musical-instrument',
            'phone',
            'computer',
            'light & video',
            'book-paper',
            'money',
            'mail',
            'writing',
            'office',
            'lock',
            'tool',
            'medical',
            'other-object',
          ];
          break;
        case 'Symbols':
          subgroups = [
            'transport-sign',
            'warning',
            'arrow',
            'religion',
            'zodiac',
            'av-symbol',
            'other-symbol',
            'keycap',
            'alphanum',
            'geometric',
          ];
          break;
        case 'Flags':
          subgroups = [
            'flag',
            'country-flag',
            'subdivision-flag',
          ];
          break;
        default:
          subgroups = [category];
          return;
        }
        return () => {
          const result = [];
          for (let i = 0; i < subgroups.length; i++) result.concat(categories[subgroups[i]]);
          return result;
        }
      })(),
    });
  }

  parse (eltOrString) {
    if (eltOrString instanceof Window) eltOrString = eltOrString.document;
    if (eltOrString instanceof Document) eltOrString = eltOrString.body;
    if (eltOrString instanceof Element) {

    } else {
      eltOrString = "" + eltOrString;

    }
  }

}

//  * * * * * * *  //

//  EmojiOne2 data
//  --------------

export const EMOJIONE2_FITZPATRICK_SELECTORS = {
  0x1F3FB: '1f3fb',
  0x1F3FC: '1f3fc',
  0x1F3FD: '1f3fd',
  0x1F3FE: '1f3fe',
  0x1F3FF: '1f3ff',
};
export const EMOJIONE2_FITZPATRICK_VARIANTS = [
  '1f3fb',
  '1f3fc',
  '1f3fd',
  '1f3fe',
  '1f3ff',
];
export const EMOJIONE2_BASE_LOCATION = '/public/emoji/';
export const EMOJIONE2_EXTENSION = 'svg';

export const emojione2 = [
  {
    name: '',
    aliases: [

    ],
    category: 'face-positive',
    codepoints: 0xff,
    location: EMOJIONE2_BASE_LOCATION,
  }, {

  }
]
