import { Examples } from '../interfaces/api-response.interface';

export const merge = (examples: Examples, newExamples: Examples) => {
  for (const newExampleKey of Object.keys(newExamples)) {
    const existingExampleKeys = Object.keys(examples);
    const matchingExampleKeys = existingExampleKeys.filter(
      eKey => eKey.startsWith(`${newExampleKey} #`) || eKey === newExampleKey,
    );

    if (matchingExampleKeys.length) {
      let startingNumber = matchingExampleKeys.reduce((acc, val) => {
        const SEPARATOR = ' #';
        const indexOfNo = val.lastIndexOf(SEPARATOR);

        if (indexOfNo >= 0) {
          const number = parseInt(val.substring(indexOfNo + SEPARATOR.length), 10);
          if (number > acc) {
            return number;
          }
        }

        return acc;
      }, 0);

      if (startingNumber === 0) {
        examples[`${newExampleKey} #${++startingNumber}`] = examples[newExampleKey];
        delete examples[newExampleKey];
      }

      examples[`${newExampleKey} #${++startingNumber}`] = newExamples[newExampleKey];
    } else {
      examples[newExampleKey] = newExamples[newExampleKey];
    }
  }
};
