
import rainbowCombine from './combine';
import rainbowHash from './hash';

//  From The \u2764 16-Colour Pallete
const colours = [
  0xa6627a,  //  Unity
  0x9e6960,  //  Age
  0x8d7249,  //  Energy
  0x58814d,  //  Truth
  0x03867e,  //  Independence
  0x268395,  //  Youth
  0x567ba4,  //  Peace
  0x9765a3,  //  Mystery
];

//  `rainbow()` creates a spectrum of colours from the hash of the
//  provided `text`. The `numColours` must be strictly less than 32.
export default function rainbow (text, numColours) {

  //  If `numColours` isn't provided, we return a single colour as
  //  text.
  let returnText = false;
  if (numColours === void 0 || numColours === null) {
    numColours = 1;
    returnText = true;
  }

  //  `numColours` must be a positive integer less than 32.
  if (!Number.isInteger(numColours) || numColours < 1 || numColours > 31) {
    throw new RangeError('MASTODON_GO:RAINBOW : numColours must be a positive integer less than 32');
  }

  //  First, we get our FNV-1a hash of our text. This gives us 32 bits
  //  to work with.
  const hash = rainbowHash(text);

  //  We will store our colours in a simple `result` array.
  const result = [];

  //  Our first colour selection will be a value in the range [0, 8),
  //  but our later colour values will range from [-2, 2]. This means
  //  that the number of bits for the first colour must be one more than
  //  the number of bits for all later colours (`8 - 0 === 2 ** 3`,
  //  whereas `2 - -2 === 2 ** 2`). Consequently, we do all of our
  //  arithmetic using 31 instead of 32, and the extra bit simply winds
  //  with our initial value.
  const bitsPerColour = 31 / numColours | 0;
  let colourBits = hash >>> 31 - bitsPerColour;

  //  `onesPlace` gives the one's place for our colour. Of course, if
  //  `bitsPerColour` is 1, we will have to handle things separately.
  let onesPlace = 1 << bitsPerColour - 2;
  let n;

  //  If our `bitsPerColour` is 0, we can't generate any colours.
  if (!bitsPerColour) {
    return returnText ? '#636363' : ['#636363'];
  }

  //  As a special case, when `bitsPerColour` is `1`, our starting
  //  colour is drawn from the even indices of `colours`.
  if (bitsPerColour === 1) {
    result.push(colours[n = colourBits * 2]);
  }

  //  Otherwise the first 3 bits of `startingBits` give us our two
  //  adjacent colours in `colours`, and the remaining bits provide
  //  the position of our colour in-between them.
  if (!result[0]) {
    n = colourBits / onesPlace;
    result.push(rainbowCombine(colours[~~n], colours[~~(n + 1) % 8], n % 1));
  }

  //  We can now iterate over our remaining colours.
  let i = 1;
  while (i < numColours) {

    //  This gets the bits for our current colour.
    colourBits = (hash >>> 31 - bitsPerColour * ++i) % (1 << bitsPerColour);

    //  As a special case, if our `bitsPerColour` is `1`, our starting
    //  colour is the next or previous one. We don't need to worry
    //  about fractional components here, since `n` will always be an
    //  integer.
    if (bitsPerColour === 1) {
      if (colourBits) {
        n = (n + 1) % 8;
      } else {
        n = (n - 1) % 8;
      }
      result.push(colours[n]);
    }

    //  Otherwise we offset our colour position based on our
    //  `colourBits` and get our new colour.
    n = (n + colourBits / onesPlace - 2) % 8;
    if (n < 0) {
      n += 8;
    }
    result.push(rainbowCombine(colours[~~n], colours[~~(n + 1) % 8], n % 1));
  }

  //  Finally, we can return our `result`.
  const computedResult = result.map(
    colour => {
      const string = colour.toString(16);
      return '#' + new Array(6 - string.length).fill(0).join('') + string;
    }
  );
  return returnText ? '' + computedResult : computedResult;
}
