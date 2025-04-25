import { NextRequest, NextResponse } from 'next/server';
import { getOrCreatePartId } from '../../../lib/server/db';

export async function POST(req: NextRequest) {
  const { input } = await req.json();
  const currentYear = new Date().getFullYear().toString();
  const yearIndex = input.indexOf(currentYear);
  const beforeYear = input.substring(0, yearIndex);
  const afterYear = input.substring(yearIndex + 4);

  const id = getOrCreatePartId(beforeYear);
  const idEncoded = toBase62(id);
  const afterEncoded = toBase62(afterYear);

  return NextResponse.json({ encoded: idEncoded + currentYear.substring(2) + afterEncoded });
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