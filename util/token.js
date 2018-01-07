//  The token.
let save;

//  `token()` saves and recalls our token.
export default function token (value, force = false) {
  if (value || force) {
    save = value;
  }
  return save;
}
