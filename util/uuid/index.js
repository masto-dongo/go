/*********************************************************************\
|                                                                     |
|   UUID                                                              |
|   ====                                                              |
|                                                                     |
|   `uuid()` generates a random (version 4) [UUID][]. They are used   |
|   in a couple places where we need a reasonably-unique identifier   |
|   to identify a component, request, or some such. Don't worry too   |
|   much about the actual code lol.                                   |
|                                                                     |
|   [UUID]: https://en.wikipedia.org/wiki/UUID                        |
|                                                                     |
|                                             ~ @kibi@glitch.social   |
|                                                                     |
\*********************************************************************/

//  Generates a random UUID. Dwbi tbh.
export default function uuid () {
  return function(a,b){for(b=a='';a++<36;b+=a*51&52?(a^15?8^Math.random()*(a^20?16:4):4).toString(16):'-');return b}(); // eslint-disable-line
};
