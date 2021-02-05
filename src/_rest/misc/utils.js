/**
 * Generates Random String
 * @param {number} length - Desired length
 */
export const randomString = (length = 10) => {
  const consonants = "bcdfghjklmnpqrstvwxyz";
  const vowels = "aeiou";
  const letters = vowels + consonants;

  let string = "";
  for (length; length > 0; length--) {
    let max = vowels.length - 1;
    if (length % 2 === 0) max += consonants.length;
    const index = Math.ceil(Math.random() * max);
    string += letters[index];
  }
  return string;
};
