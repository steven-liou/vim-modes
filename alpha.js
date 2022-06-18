function addAlpha(color, opacity) {
  // coerce values so ti is between 0 and 1.
  let alpha = Math.round(Math.min(Math.max(opacity || 1, 0), 1) * 255);
  let alphaString = alpha.toString(16).toUpperCase();
  alphaString = alpha < 16 ? '0' + alphaString : alphaString;
  return color + alphaString;
}
console.log(addAlpha('FF0000', 0.05)); // returns 'FF0000FF'
console.log(addAlpha('FF0000', 0.5)); // returns 'FF000080'
