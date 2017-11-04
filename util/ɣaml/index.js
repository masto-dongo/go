/*********************************************************************\
|                                                                     |
|   ƔAML (pronounced "garglamel")                                     |
|   =============================                                     |
|                                                                     |
|   The syntax recognized by _Mastodon GO!_ for its bio metadata is   |
|   a limited subset of that provided by the YAML 1.2 specification   |
|   (we will henceforth call this subset ƔAML).  Generally speaking   |
|   this syntax matches that of a YAML implicit map, with the extra   |
|   requirement that each key-value pair take up only a single line   |
|   and with character escaping in double-quoted strings forbidden.   |
|                                                                     |
|   As with YAML, the beginning of a ƔAML document is marked with a   |
|   sequence of three hyphens (`---`), and the ending is marked via   |
|   a sequence of either three hyphens or three dots (`...`).  Only   |
|   ƔAML documents whose opening sequence occurs within the initial   |
|   text node of the account bio should be processed.                 |
|                                                                     |
|   The parsing requirements of ƔAML documents require that the bio   |
|   be passed to the parser in plain text.  This can make rendering   |
|   account and hashtag links inside of bio metadata something of a   |
|   challenge.  Additionally, `<p>` and `<br>` elements will not be   |
|   converted to line-breaks, so this **must** be taken care of via   |
|   some other means prior to invoking the script.                    |
|                                                                     |
|   The keys and values of this map are both interpreted as strings   |
|   with no additional processing.  Unlike YAML, ƔAML preserves any   |
|   duplicate keys, as well as key ordering.                          |
|                                                                     |
|                                             ~ @kibi@glitch.social   |
|                                                                     |
\*********************************************************************/

//  Initial setup
//  -------------

//  We enter "`compat_mode`" if the current browser doesn't support
//  RegExp with the `u` flag.
let compat_mode = false;
try {
  new RegExp('.', 'u');
} catch (e) {
  compat_mode = true;
}

//  * * * * * * *  //

//  Convenience functions
//  ---------------------

//  `unirex()` takes a string and creates a unicode (if supported)
//  RegExp object.
const unirex = str => compat_mode ? new RegExp(str) : new RegExp(str, 'u');

//  `rexstr()` turns a RegExp into a grouped string.
const rexstr = exp => '(?:' + exp.source + ')';

//  * * * * * * *  //

//  Character classes
//  -----------------

//  String beginning and ending.
const STRING_BEGIN      = /^/;
const STRING_END        = /$/;

//  Our allowed characters.  This matches `c-printable` in the YAML 1.2
//  spec.  If we're in `compat_mode`, we also allow surrogates.
const ALLOWED_CHAR      =  unirex(
    compat_mode ? '[\t\n\r\x20-\x7e\x85\xa0-\ufffd]' : '[\t\n\r\x20-\x7e\x85\xa0-\ud7ff\ue000-\ufffd\u{10000}-\u{10FFFF}]'
  );

//  Whitespace characters.  We only recognize spaces and tabs.
const WHITE_SPACE       = /[ \t]/;

//  Our line break can be an `\r`, an `\r\n`, or an `\n`.
const LINE_BREAK        = /\r?\n|\r/;

//  These are indicator characters in YAML.
const INDICATOR         = /[-?:,[\]{}&#*!|>'"%@`]/;

//  These are YAML flow characters.
const FLOW_CHAR         = /[,[\]{}]/;

//  * * * * * * *  //

//  Negated character classes
//  -------------------------

//  Negated versions of the above. We use lookaheads to ensure that
//  the next character isn't in the given class, and then match any
//  character via `[^]`.
const NOT_WHITE_SPACE   = unirex('(?!' + rexstr(WHITE_SPACE) + ')[^]');
const NOT_LINE_BREAK    = unirex('(?!' + rexstr(LINE_BREAK) + ')[^]');
const NOT_INDICATOR     = unirex('(?!' + rexstr(INDICATOR) + ')[^]');
const NOT_FLOW_CHAR     = unirex('(?!' + rexstr(FLOW_CHAR) + ')[^]');
const NOT_ALLOWED_CHAR  = unirex(
  '(?!' + rexstr(ALLOWED_CHAR) + ')[^]'
);

//  * * * * * * *  //

//  Basic constructs
//  ----------------

//  These are pluralized versions of the above.
const ANY_WHITE_SPACE   = unirex(rexstr(WHITE_SPACE) + '*');
const ANY_ALLOWED_CHARS = unirex(rexstr(ALLOWED_CHAR) + '*');

//  Newlines eat the whitespace which precede them.
const NEW_LINE          = unirex(
  rexstr(ANY_WHITE_SPACE) + rexstr(LINE_BREAK)
);
const SOME_NEW_LINES    = unirex(
  '(?:' + rexstr(NEW_LINE) + ')+'
);

//  The document must be the first thing in the input string, but other
//  characters are allowed to follow it if there is a newline between
//  the two.  We do allow empty newlines before the start of the
//  document, though.
const POSSIBLE_STARTS   = unirex(
  rexstr(STRING_BEGIN) + rexstr(SOME_NEW_LINES) + '?'
);
const POSSIBLE_ENDS     = unirex(
  rexstr(SOME_NEW_LINES) + '|' +
  rexstr(STRING_END)
);

//  Double-quoted strings can contain any (non-line-break) character,
//  except for the double quote.
const QUOTE_CHAR         = unirex(
  '(?=' + rexstr(NOT_LINE_BREAK) + ')[^"]'
);
const ANY_QUOTE_CHAR    = unirex(
  rexstr(QUOTE_CHAR) + '*'
);

//  Single-quoted strings can contain any (non-line-break) character,
//  but single-quotes must be escaped via doubling.
const ESCAPED_APOS      = unirex(
  '(?=' + rexstr(NOT_LINE_BREAK) + ')[^\']|\'\''
);
const ANY_ESCAPED_APOS  = unirex(
  rexstr(ESCAPED_APOS) + '*'
);

//  The first character in a key can't be an indicator, with the
//  exception that it can be a colon or hyphen if a line-break,
//  whitespace, or flow character doesn't follow it.
const FIRST_KEY_CHAR    = unirex(
  '(?=' + rexstr(NOT_LINE_BREAK) + ')' +
  '(?=' + rexstr(NOT_WHITE_SPACE) + ')' +
  rexstr(NOT_INDICATOR) + '|' +
  '[?:-]' +
  '(?=' + rexstr(NOT_LINE_BREAK) + ')' +
  '(?=' + rexstr(NOT_WHITE_SPACE) + ')' +
  '(?=' + rexstr(NOT_FLOW_CHAR) + ')'
);

//  The first character in a value has the same RegExp as that for
//  keys, except that flow characters are allowed to follow a colon
//  or hyphen.
const FIRST_VALUE_CHAR  = unirex(
  '(?=' + rexstr(NOT_LINE_BREAK) + ')' +
  '(?=' + rexstr(NOT_WHITE_SPACE) + ')' +
  rexstr(NOT_INDICATOR) + '|' +
  '[?:-]' +
  '(?=' + rexstr(NOT_LINE_BREAK) + ')' +
  '(?=' + rexstr(NOT_WHITE_SPACE) + ')'
  //  Flow indicators are allowed in values.
);

//  Flow characters aren't allowed in keys, but they are allowed in
//  values.  These RegExps give the remaining characters.
const LATER_KEY_CHAR    = unirex(
  rexstr(WHITE_SPACE) + '|' +
  '(?=' + rexstr(NOT_LINE_BREAK) + ')' +
  '(?=' + rexstr(NOT_WHITE_SPACE) + ')' +
  '(?=' + rexstr(NOT_FLOW_CHAR) + ')' +
  '[^:#]#?|:(?=' + rexstr(NOT_WHITE_SPACE) + ')'
);
const LATER_VALUE_CHAR  = unirex(
  rexstr(WHITE_SPACE) + '|' +
  '(?=' + rexstr(NOT_LINE_BREAK) + ')' +
  '(?=' + rexstr(NOT_WHITE_SPACE) + ')' +
  //  Flow indicators are allowed in values.
  '[^:#]#?|:(?=' + rexstr(NOT_WHITE_SPACE) + ')'
);

//  * * * * * * *  //

//  ƔAML constructs
//  ---------------

//  We allow whitespace before the start of the document, but that's
//  it.
const ƔAML_START        = unirex(
  rexstr(ANY_WHITE_SPACE) + '---'
);

//  Similarly, whitespace can precede the document terminator.
const ƔAML_END          = unirex(
  rexstr(ANY_WHITE_SPACE) + '(?:---|\.\.\.)'
);

//  This lookahead quickly ensures that only allowed characters exist
//  in the ƔAML document, so we don't have to worry about checking that
//  later.
const ƔAML_LOOKAHEAD    = unirex(
  '(?=' +
    rexstr(ƔAML_START) +
    rexstr(ANY_ALLOWED_CHARS) + rexstr(NEW_LINE) +
    rexstr(ƔAML_END) + rexstr(POSSIBLE_ENDS) +
  ')'
);

//  These are our double- and single-quoted keys/values.
const ƔAML_DOUBLE_QUOTE = unirex(
  '"' + rexstr(ANY_QUOTE_CHAR) + '"'
);
const ƔAML_SINGLE_QUOTE = unirex(
  '\'' + rexstr(ANY_ESCAPED_APOS) + '\''
);

//  For the simple (non-quoted) syntax, keys and values differ
//  slightly.
const ƔAML_SIMPLE_KEY   = unirex(
  rexstr(FIRST_KEY_CHAR) + rexstr(LATER_KEY_CHAR) + '*'
);
const ƔAML_SIMPLE_VALUE = unirex(
  rexstr(FIRST_VALUE_CHAR) + rexstr(LATER_VALUE_CHAR) + '*'
);

//  This collects our keys and values.
const ƔAML_KEY          = unirex(
  rexstr(ƔAML_DOUBLE_QUOTE) + '|' +
  rexstr(ƔAML_SINGLE_QUOTE) + '|' +
  rexstr(ƔAML_SIMPLE_KEY)
);
const ƔAML_VALUE        = unirex(
  rexstr(ƔAML_DOUBLE_QUOTE) + '|' +
  rexstr(ƔAML_SINGLE_QUOTE) + '|' +
  rexstr(ƔAML_SIMPLE_VALUE)
);

//  Separators must be followed by at least one whitespace character,
//  and gobble up any surrounding whitespace.
const ƔAML_SEPARATOR    = unirex(
  rexstr(ANY_WHITE_SPACE) +
  ':' + rexstr(WHITE_SPACE) +
  rexstr(ANY_WHITE_SPACE)
);

//  This is a single line.  Note the grouping parentheses.  These will
//  allow us to later extract the keys and values.
const ƔAML_LINE         = unirex(
  '(' + rexstr(ƔAML_KEY) + ')' +
  rexstr(ƔAML_SEPARATOR) +
  '(' + rexstr(ƔAML_VALUE) + ')'
);

//  * * * * * * *  //

//  ƔAML constructs
//  ---------------

//  If our document has one of our `POSSIBLE_STARTS`, we run the
//  `ƔAML_LOOKAHEAD` to ensure that it only contains allowed characters
//  before bothering to proceed.  Whitespace which precedes a line can
//  safely be ignored.  The maximum number of lines we are willing to
//  process is `5`.
const ƔAML_FRONTMATTER  = unirex(
  rexstr(POSSIBLE_STARTS) +
  rexstr(ƔAML_LOOKAHEAD) +
  rexstr(ƔAML_START) + rexstr(SOME_NEW_LINES) +
  '(?:' +
    rexstr(ANY_WHITE_SPACE) + rexstr(ƔAML_LINE) + rexstr(SOME_NEW_LINES) +
  '){0,5}' +
  rexstr(ƔAML_END) + rexstr(POSSIBLE_ENDS)
);

//  * * * * * * *  //

//  Searches
//  --------

//  This RegExp allows us to quickly find a ƔAML_LINE in a ƔAML
//  document.
const FIND_ƔAML_LINE    = unirex(
  rexstr(NEW_LINE) + rexstr(ANY_WHITE_SPACE) + rexstr(ƔAML_LINE)
);

//  * * * * * * *  //

//  String processing
//  -----------------

//  This function extracts the contents from a ƔAML string.  It
//  assumes that `str` is well-formed.
function processString (str) {
  switch (str.charAt(0)) {
  case '"':
    return str.substring(1, str.length - 1);
  case '\'':
    return str
      .substring(1, str.length - 1)
      .replace(/''/g, '\'');
  default:
    return str;
  }
}

//  * * * * * * *  //

//  Bio processing
//  --------------

//  This function takes a `content` string and returns an object with
//  two properties: `metadata`, which gives the metadata from the
//  string's ƔAML (if found), and `text`, which gives the remaining
//  text.
export function readƔaml (content) {

  //  Sets up our result.
  const result = {
    metadata: [],
    text: content,
  };

  //  If the `content` doesn't contain any ƔAML, we can return.
  //  Otherwise, we store the match.
  let ɣaml = content.match(ƔAML_FRONTMATTER);
  if (!ɣaml) {
    return result;
  } else {
    ɣaml = ɣaml[0];
  }

  //  Here we use the length of the match to remove it from our
  //  `text` string.
  const start = content.search(ƔAML_START);
  const end = start + ɣaml.length - ɣaml.search(ƔAML_START);
  result.text = content.substr(end);

  //  Otherwise, we query our `ɣaml` for each line and extract their
  //  keys and values.
  let metadata = null;
  let query = new RegExp(rexstr(FIND_ƔAML_LINE), 'g');  //  Some browsers don't allow flags unless both args are strings
  while ((metadata = query.exec(ɣaml))) {
    result.metadata.push([
      processString(metadata[1]),
      processString(metadata[2]),
    ]);
  }

  //  Finally, we can return the result.
  return result;
}

//  * * * * * * *  //

//  Bio creation
//  ------------

//  `makeƔaml()` takes in a `note` and prepends the `data` to it as
//  ƔAML.
export function makeƔaml (note, data) {
  if (!note) note = '';
  let frontmatter = '';
  if ((data && data.length) || note.match(/^\s*---\s+/)) {

    //  If we don't have any `data` but our `note` starts with three
    //  hyphens, we add an empty ƔAML document to prevent accidental
    //  processing.
    if (!data) {
      frontmatter = '---\n...\n';
    } else {
      frontmatter += '---\n';

      //  We now iterate over our key-value pairs.
      for (let i = 0; i < data.length; i++) {
        let key = '' + data[i][0];
        let val = '' + data[i][1];

        //  If our key matches the construction for a simple key, we
        //  can leave it as-is.
        if (key === (key.match(ƔAML_SIMPLE_KEY) || [])[0]) {

        //  Similarly, if the key is acceptable in a double-quoted
        //  string, we just wrap it in quotes.
        } else if (key === (key.match(ANY_QUOTE_CHAR) || [])[0]) {
          key = '"' + key + '"';

        //  Otherwise, we produce a single-quoted string, with invalid
        //  characters replaced with U+FFFD � REPLACEMENT CHARACTER.
        } else {
          key = key
            .replace(/'/g, '\'\'')
            .replace(new RegExp(rexstr(NOT_ALLOWED_CHAR), compat_mode ? 'g' : 'gu'), '�');
          key = '\'' + key + '\'';
        }

        //  We now repeat the same steps for our value.
        if (val === (val.match(ƔAML_SIMPLE_VALUE) || [])[0]) {
        } else if (val === (val.match(ANY_QUOTE_CHAR) || [])[0]) {
          val = '"' + val + '"';
        } else {
          key = key
            .replace(/'/g, '\'\'')
            .replace(new RegExp(rexstr(NOT_ALLOWED_CHAR), compat_mode ? 'g' : 'gu'), '�');
          key = '\'' + key + '\'';
        }

        //  We add the key-value pair to the `frontmatter`.
        frontmatter += key + ': ' + val + '\n';
      }

      //  When we're all done, we end our `frontmatter` with three
      //  periods.
      frontmatter += '...\n';
    }
  }

  //  Finally, we return our `note` with our `frontmatter` prepended.
  return frontmatter + note;
}
