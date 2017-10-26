//  Polyfills HTML DOM Parsing for older browsers which only support
//  XML.
export default class DOMParser {

  constructor () {
    this._parser = new window.DOMParser;
  }

  parseFromString (markup, type) {
    const parser = this._parser;
    const nativeParse = parser.parseFromString.bind(parser);
    let result;

    //  If this produces an object, then DOM Parsing is natively
    //  supported and we don't have to do anything.
    try {
      result = nativeParse(markup, 'text/html');
      if (result) {
        return result;
      }

    //  We'll get an error in some browsers if it isn't, though.
    } catch (error) {}

    //  If our markup is "text/html", we attempt a parse.
    if (/^\s*text\/html\s*(?:;|$)/i.test(type)) {
      result = document.implementation.createHTMLDocument('');

      //  If we are given a doctype, then we put our HTML in the
      //  <html> element.
      if (markup.toLowerCase().indexOf('<!doctype') !== -1) {
        result.documentElement.innerHTML = markup;

      //  Otherwise, it goes in the <body>.
      } else {
        result.body.innerHTML = markup;
      }

      return result;

    //  We use the native parsing for types other than `"text/html"`.
    } else {
      return nativeParse.apply(this, arguments);
    }
  }

}
