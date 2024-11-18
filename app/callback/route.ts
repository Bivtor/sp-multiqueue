import { NextResponse, NextRequest } from "next/server";
var querystring = require('querystring');
import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'


export async function GET(req: NextRequest, res: NextResponse) {
    const cookieStore = await cookies()

    // your application requests refresh and access tokens
    // after checking the state parameter

    var stateKey = 'spotify_auth_state';
    const url = new URL(req.url);

    const code = url.searchParams.get('code') || null;
    const state = url.searchParams.get('state') || null;

    var storedState = cookieStore.get(stateKey)?.value || null
    if (state === null || state !== storedState!) {
        redirect('/#' +
            querystring.stringify({
                error: 'state_mismatch'
            }));
    } else {
        // Delete cookie
        req.cookies.delete(stateKey);
        var authOptions = {
            method: 'POST',
            headers: {
                'content-type': 'application/x-www-form-urlencoded',
                Authorization: 'Basic ' + (Buffer.from(process.env.NEXT_PUBLIC_CLIENT_ID + ':' + process.env.NEXT_PUBLIC_CLIENT_SECRET).toString('base64'))
            },
            body: querystring.stringify({
                grant_type: 'authorization_code',
                code: code,
                redirect_uri: process.env.REDIRECT_URI
            })
        };

        // Request access and refresh tokens from Spotify
        const tokenResponse = await fetch('https://accounts.spotify.com/api/token', authOptions);
        const tokenData = await tokenResponse.json();

        if (tokenResponse.ok) {
            const access_token = tokenData.access_token;
            const refresh_token = tokenData.refresh_token;
            const expires_in = tokenData.expires_in;

            // Fetch user information using the access token
            const userOptions = {
                headers: { 'Authorization': 'Bearer ' + access_token }
            };
            const userResponse = await fetch('https://api.spotify.com/v1/me', userOptions);
            const userData = await userResponse.json();

            // Redirect with access and refresh tokens as query params
            cookieStore.set('access_token', access_token)
            cookieStore.set('current_time', Date.now().toString());

            redirect('/'
                // querystring.stringify({
                //     access_token: access_token,
                //     refresh_token: refresh_token
                // })
            );
        } else {
            // Handle error
            redirect('/#' +
                querystring.stringify({
                    error: 'invalid_token'
                })
            );
        }
    }
}


