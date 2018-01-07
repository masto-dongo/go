//  RAINBOW:HASH
//  ============

//  32-bit FNV-1a hash of a UTF-16 string. Returns an unsigned 32-bit
//  integer. See <http://www.isthe.com/chongo/tech/comp/fnv/> for more
//  information on FNV hashes.
export default function rainbowHash (string) {
  string = '' + string;
  let hash = 0x811c9dc5;
  for (let i = 0; i < string.length; i++) {
    let character = string.charCodeAt(i);
    hash ^= character / 0x100;
    hash += (hash << 1) + (hash << 4) + (hash << 7) + (hash << 8) + (hash << 24);
    hash ^= character % 0x100;
    hash += (hash << 1) + (hash << 4) + (hash << 7) + (hash << 8) + (hash << 24);
  }
  return hash;
}
