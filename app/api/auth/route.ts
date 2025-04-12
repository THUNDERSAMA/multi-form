import { NextResponse } from 'next/server'

import jwt from 'jsonwebtoken'

async function authenticateUser(username: any, password: any) {
   if (username === "admin@quantum.com" && password === "password") {
  return {"id": 1, "username": username, "password": password}
   }
   else {
    return {"error": "Invalid credentials"}
    }
}

export async function POST(req: { json: () => any }) {
  const body = await req.json()
  const { email, password } = body

  // Perform user authentication here against your database or authentication service
  const user = await authenticateUser(email, password)
  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET is not defined in environment variables')
  }
  const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
    expiresIn: '1m', // Token expiration time
  })
  return NextResponse.json({ token })
}