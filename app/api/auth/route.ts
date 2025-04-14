import { NextResponse } from 'next/server'

import jwt from 'jsonwebtoken'
import { Console } from 'console'
import { json } from 'stream/consumers'
import { User } from 'lucide-react';

async function authenticateUser(username: any, password: any) {
  const body = new FormData();
body.set("email", username);
body.set("password", password);
const resp = await fetch('https://courierwallah.in/api/login.php', {
    method: 'POST',
    body,
  });

if (!resp.ok) {
  throw new Error('Network response was not ok');
}
if (resp.status !== 200) {
  throw new Error('Invalid credentials');
}
    console.log(
      "STATUS:",
      resp.status,
      "\nCONTENT TYPE:",
      resp.headers.get("content-type"),
    );
   // console.log("RAW BODY:", await resp.text());
    return JSON.parse(await resp.text());
    return {"id": 1, "username": username, "password": password}
    return {"error": "Invalid credentials"};
  //  if (username === "admin@quantum.com" && password === "password") {
  // return {"id": 1, "username": username, "password": password}
  //  }
  //  else {
  //   return {"error": "Invalid credentials"}
  //   }
}

export async function POST(req: { json: () => any }) {
  const body = await req.json()
  const { email, password } = body

  // Perform user authentication here against your database or authentication service
  const user = await authenticateUser(email, password)
  //console.log("USER:", user);
  //console.log(typeof user);
  if (user.status=="error") { 
    return NextResponse.json(
      { message: 'Invalid credentials' },
      {
        status: 401,
      },
    )
  }
  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET is not defined in environment variables')
  }
  const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
    expiresIn: '1y' 
    })
  return NextResponse.json({ token })
}