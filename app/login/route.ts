import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'
const crypto = await import('crypto')
const querystring = await import('querystring');


export async function GET() {
    const cookieStore = await cookies()

    // Make random string 
    const generateRandomString = (length: number) => {
        return crypto
            .randomBytes(60)
            .toString('hex')
            .slice(0, length);
    }

    const stateKey = 'spotify_auth_state';
    const state = generateRandomString(16);

    // Set cookie
    cookieStore.set(stateKey, state)

    // your application requests authorization
    const scope = 'user-read-private user-read-email user-modify-playback-state';
    const r = 'https://accounts.spotify.com/authorize?' +
        querystring.stringify({
            response_type: 'code',
            client_id: process.env.NEXT_PUBLIC_CLIENT_ID,
            scope: scope,
            redirect_uri: process.env.REDIRECT_URI,
            state: state
        })
    redirect(r);
}
