import jwt from 'jsonwebtoken'
import { NextResponse } from 'next/server'
import { headers } from 'next/headers'

export async function GET() {
  try {
    const headersInstance = await headers()
    const authHeader = headersInstance.get('authorization')

    if (!authHeader) {
      throw new Error('Authorization header is missing')
    }
    const token = authHeader.split(' ')[1]
    if (!process.env.JWT_SECRET) {
        throw new Error('JWT_SECRET is not defined in environment variables')
      }
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    if (!decoded || typeof decoded === 'string') {
      return NextResponse.json(
        { message: 'Expired' },
        {
          status: 400,
        },
      )
    } else if (decoded.exp && decoded.exp < Math.floor(Date.now() / 1000)) {
      return NextResponse.json(
        { message: 'Expired' },
        {
          status: 400,
        },
      )
    } else {
      // If the token is valid, return some protected data.
      return NextResponse.json(
        { data: 'Protected data' },
        {
          status: 200,
        },
      )
    }
  } catch (error) {
    console.error('Token verification failed', error)
    return NextResponse.json(
      { message: 'Unauthorized' },
      {
        status: 400,
      },
    )
  }
}