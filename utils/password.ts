const UPPERCASE_LETTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
const LOWERCASE_LETTERS = 'abcdefghijklmnopqrstuvwxyz'.split('');
const DIGITS = '0123456789'.split('');
const SPECIAL_CHARACTERS = '!"#$%&\'()*+,-./:;<=>?@[\\]^_`{|}~'.split('');

export interface PasswordGenerationOptions {
  length: number;
  hasUpperCaseLetters?: boolean;
  hasLowerCaseLetters?: boolean;
  hasDigits?: boolean;
  hasSpecialCharacters?: boolean;
}

const generatePassword = (options: PasswordGenerationOptions): string => {
  if (
    !options.hasLowerCaseLetters &&
    !options.hasSpecialCharacters &&
    !options.hasUpperCaseLetters &&
    !options.hasDigits
  )
    throw new Error('É necessário definir pelo menos um critério !');

  const availableCharacters = [];
  if (options.hasDigits) {
    availableCharacters.push(DIGITS);
  }

  if (options.hasLowerCaseLetters) {
    availableCharacters.push(LOWERCASE_LETTERS);
  }

  if (options.hasUpperCaseLetters) {
    availableCharacters.push(UPPERCASE_LETTERS);
  }

  if (options.hasSpecialCharacters) {
    availableCharacters.push(SPECIAL_CHARACTERS);
  }

  let generatedPassword = '';
  const choiceList = Array.from(Array(options.length).keys())
    .map((item) => item % availableCharacters.length)
    .sort(() => Math.random() - 0.5);

  for (let i = 0; i < options.length; i++) {
    const currentCharacters = availableCharacters[choiceList[i]];
    generatedPassword +=
      currentCharacters[
        Math.round(Math.random() * (currentCharacters.length - 1))
      ];
  }

  return generatedPassword;
};

export default generatePassword;
