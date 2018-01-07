//  RAINBOW:COMBINE
//  ===============

//  Combines two colours. `amount` specifies the amount of `colour2` to
//  mix into `colour1`.
export default function rainbowCombine (colour1, colour2, amount) {
  const weight1 = 1-amount;
  const weight2 = amount;
  return (
    (colour1 >>> 16 & 0xFF) * weight1 + (colour2 >>> 16 & 0xFF) * weight2 << 16 |
    (colour1 >>> 8 & 0xFF) * weight1 + (colour2 >>> 8 & 0xFF) * weight2 << 8 |
    (colour1 >>> 0 & 0xFF) * weight1 + (colour2 >>> 0 & 0xFF) * weight2 << 0
  );
}
