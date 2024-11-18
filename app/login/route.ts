import { NextResponse, NextRequest } from "next/server";
import { redirect } from 'next/navigation'
var crypto = require('crypto');
var querystring = require('querystring');
import { cookies } from 'next/headers'



export async function GET(req: NextRequest, res: NextResponse) {
    const cookieStore = await cookies()

    // Make random string 
    const generateRandomString = (length: number) => {
        return crypto
            .randomBytes(60)
            .toString('hex')
            .slice(0, length);
    }

    var stateKey = 'spotify_auth_state';
    var state = generateRandomString(16);

    // Set cookie
    cookieStore.set(stateKey, state)

    // your application requests authorization
    var scope = 'user-read-private user-read-email user-modify-playback-state';
    var r = 'https://accounts.spotify.com/authorize?' +
        querystring.stringify({
            response_type: 'code',
            client_id: process.env.NEXT_PUBLIC_CLIENT_ID,
            scope: scope,
            redirect_uri: process.env.REDIRECT_URI,
            state: state
        })
    redirect(r);
}
