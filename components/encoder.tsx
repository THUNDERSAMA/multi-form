// //let the string to be encoded
// // const input = "ELEsamadritdas2025042590080769";
// function encode(input: string): string {
// //get current year
//  const currentYear = new Date().getFullYear().toString();

// //get index where the year starts in the string
//  const yearIndex = input.indexOf(currentYear.toString());
// //get the string before the year
//     const beforeYear = input.substring(0, yearIndex);
// //get the string after the year
//     const afterYear = input.substring(yearIndex + currentYear.toString().length);
//     const final_string = btoa(beforeYear)+currentYear.substring(2)+toBase62(afterYear);
//     console.log("Encoded String: ", final_string);
//   return final_string;
// }
// function decode(input: string): string {
//     //get the current year
//     const currentYear = new Date().getFullYear().toString();
//     const yearIndex = input.indexOf(currentYear.substring(2));
//     //get the string before the year
//     const beforeYear = input.substring(0, yearIndex);
//     //get the string after the year
//     const afterYear = input.substring(yearIndex + currentYear.substring(2).length);
//     const decodedString = atob(beforeYear) + "20"+currentYear.substring(2) + fromBase62(afterYear);
//     console.log("Decoded String: ", decodedString);
//     return decodedString;
//     }
import { getOrCreatePartId, getPartById } from '../lib/server/db';

 export function encode(input: string): string {
  const currentYear = new Date().getFullYear().toString();
  const yearIndex = input.indexOf(currentYear);
  const beforeYear = input.substring(0, yearIndex);
  const afterYear = input.substring(yearIndex + 4);

  const id = getOrCreatePartId(beforeYear); // from SQLite
  const idEncoded = toBase62(id);           // short form
  const afterEncoded = toBase62(afterYear);
  const final_string = idEncoded + currentYear.substring(2) + afterEncoded;

  return final_string;
}

export function decode(input: string): string {
  const yearShort = new Date().getFullYear().toString().substring(2);
  const yearIndex = input.indexOf(yearShort);

  const idEncoded = input.substring(0, yearIndex);
  const id = fromBase62(idEncoded);
  const beforeYear = getPartById(id) || '';
  const afterEncoded = input.substring(yearIndex + yearShort.length);
  const afterYear = fromBase62(afterEncoded);

  let decodedString = beforeYear + "20" + yearShort + afterYear.toString();
  if (decodedString.length < 12) decodedString = "0" + decodedString;

  return decodedString;
}

    function toBase62(num: any) {
        const chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
        let result = '';
        while (num > 0) {
          result = chars[num % 62] + result;
          num = Math.floor(num / 62);
        }
        return result || '0';
      }
      function fromBase62(str: any) {
        const chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
        let result = 0;
        for (let i = 0; i < str.length; i++) {
          result = result * 62 + chars.indexOf(str[i]);
        }
        return result;
      }