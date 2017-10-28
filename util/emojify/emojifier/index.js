import Emoji from '../emoji';

export default class Emojifier {

  constructor (...dataLists) {
    const all = [];
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
      'Custom': {  //  Not a real category
        'other': [],
      },
    };

    //  Makes references to subcategories on parent category object for convenience.
    for (let group in categories) {
      for (let subgroup in categories[group]) {
        categories[subgroup] = categories[group][subgroup];
      }
    }

    //  Iterates over our data lists.
    for (let i = 0; i < dataLists.length; i++) {
      const dataList = [].concat(dataLists[i]);

      //  Iterates over each data object and makes an Emoji.
      for (let ii = 0; ii < dataList.length; ii++) {
        const data = dataList[ii];
        const emojo = data instanceof Emoji ? data : new Emoji(data);
        all.push(emojo);

        //  Adds emoji to the appropriate category.
        if (categories[emojo.category] instanceof Array) categories[emojo.category].push(emojo);
      }
    }

    //  Restricted access to all emoji.
    Object.defineProperty(this, 'emoji', { value: Object.freeze([...all]) });

    //  Provides restricted access to categories through getters.
    this.categories = {};
    for (let category in categories) {
      Object.defineProperty(this.categories, category, {
        enumerable: [
          'Smileys & People',
          'Animals & Nature',
          'Food & Drink',
          'Travel & Places',
          'Activities',
          'Objects',
          'Symbols',
          'Flags',
          'Custom',
        ].indexOf(category) === -1,
        value: function () {
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
            subgroups = ['flag', 'country-flag', 'subdivision-flag'];
            break;
          case 'Custom':
            subgroups = ['other'];
            break;
          default:
            subgroups = [category];
            break;
          }
          const result = [];
          for (let i = 0; i < subgroups.length; i++) {
            result.push(categories[subgroups[i]]);
          }
          return Object.freeze(Array.prototype.concat.apply([], result));
        }(),
      });
    }
  }

  parse (string, useStatic = false) {
    const { emoji } = this;
    const result = document.createDocumentFragment();
    let text = '' + string;
    let i = 0;
    let inWord = false;
    while (i < text.length) {
      const matches = emoji.filter(
        emojo => {
          const emojiString = '' + emojo;
          const shortcodeString = emojo.name ? ':' + emojo.name + ':' : null;
          switch (true) {
          case emojiString && text.substr(i, emojiString.length) === emojiString && (emojiString.charAt(emojiString.length - 1) === '\ufe0f' || text.charAt(emojiString.length) !== '\ufe0e'):
            return true;
          case !inWord && shortcodeString && text.substr(i, shortcodeString.length) === shortcodeString && (!text.charAt(shortcodeString.length) || !/[\w:]/.test(text.charAt(shortcodeString.length))):
            return true;
          default:
            return false;
          }
        }
      );
      if (matches.length) {
        const emojo = matches.reduce(
          (longest, current) => ('' + longest).length > ('' + current).length ? longest : current,
        0);
        const emojiString = '' + emojo;
        const match = emojiString && text.substr(i, emojiString.length) === emojiString && (emojiString.charAt(emojiString.length - 1) === '\ufe0f' || text.charAt(emojiString.length) !== '\ufe0e' ? emojiString : ':' + emojo.name + ':';
        result.appendChild(document.createTextNode(text.substr(0, i)));
        result.appendChild(emojo.toImage(useStatic));
        if (text[match.length] === '\ufe0f' && match.charAt(match.length - 1) !== '\ufe0f') {
          i++;
        }
        text = text.substr(i + match.length);
        i = 0;
        inWord = false;
        continue;
      }
      if (/[\w:]/.test(text.charAt(i))) {
        inWord = true;
      } else {
        inWord = false;
      }
      i++;
    }
    if (text) {
      result.appendChild(document.createTextNode(text));
    }
    return result;
  }

}
