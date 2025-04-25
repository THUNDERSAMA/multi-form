import { NextRequest, NextResponse } from 'next/server';

import { getPartById } from '../../../lib/server/db';

export async function POST(req: NextRequest) {
  const { input } = await req.json();
  const yearShort = new Date().getFullYear().toString().substring(2);
  const yearIndex = input.indexOf(yearShort);

  const idEncoded = input.substring(0, yearIndex);
  const id = fromBase62(idEncoded);
  const beforeYear = getPartById(id) || '';
  const afterEncoded = input.substring(yearIndex + yearShort.length);
  const afterYear = fromBase62(afterEncoded);

  let decodedString = beforeYear + "20" + yearShort + afterYear.toString();
  if (decodedString.length < 12) decodedString = "0" + decodedString;

  return NextResponse.json({ decoded: decodedString });
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