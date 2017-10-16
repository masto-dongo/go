import { Emoji } from 'themes/mastodon-go/util/emojify';

export class Emojifier {

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
    };
    const emoji = {};

    //  Makes references to subcategories on parent category object for convenience.
    for (let group in categories) {
      for (let subgroup in categories[group]) {
        categories[subgroup] = categories[group][subgroup];
      }
    }

    //  Iterates over our data lists.
    for (let dataList in dataLists) {
      dataList = [].concat(dataList);

      //  Iterates over each data object and makes an Emoji.
      for (let i = 0; i < dataList.length; i++) {
        const data = dataList[i];
        const emojo = data instanceof Emoji ? data : new Emoji(data);
        all.push(emojo);

        //  Adds emoji to the appropriate category.
        if (categories[emojo.category] instanceof Array) categories.push(emojo);

        //  Overwrites previous emoji with the same name.
        if (emojo.name) emoji[emojo.name] = emojo;

        //  Aliases only overwrite other aliases, not names.
        if (emojo.aliases) {
          for (let j = 0; j < emojo.aliases.length; j++) {
            const alias = emojo.aliases[j];
            if (!emoji[alias] || emoji[alias].name !== alias) emoji[alias] = emojo;
          }
        }
      }
    }

    //  Restricted access to all emoji.
    Object.defineProperty(this, 'emoji', { get: (
      () => [...all]
    ) });

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
        ].indexOf(category) === -1,
        get: function () {
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
            break;
          }
          return function () {
            const result = [];
            for (let i = 0; i < subgroups.length; i++) {
              result.concat(categories[subgroups[i]]);
            }
            return result;
          };
        }(),
      });
    }
  }

  parse (string) {
    string = '' + string;
    const { emoji } = this;
    const result = document.createDocumentFragment();
    for (let i = 0; i < string.length; i++) {
      const matches = emoji.filter(
        emojo => {
          const emojiString = '' + emojo;
          return string.substr(i, emojiString.length) === emojiString;
        }
      );
      if (matches.length) {
        const emojo = matches.reduce(
          (longest, current) => ('' + longest).length > ('' + current).length ? longest : current,
        0);
        result.appendChild(document.createTextNode(string.substr(0, i)));
        result.appendChild(emojo.toImage());
        string = string.substr(i + ('' + emojo).length);
        i = 0;
      }
    }
    if (string) {
      result.appendChild(document.createTextNode(string));
    }
    return result;
  }

}
