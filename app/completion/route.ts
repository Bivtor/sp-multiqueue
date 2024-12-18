import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { cookies } from 'next/headers'
const querystring = await import('querystring');


// Initialize OpenAI with API key
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

interface Track {
    id: string;
}


interface SongResponseInterface {
    artist_name: string | null;
    song_name: string | null;
    album_name: string | null;
    id: string | null;
}

function pickRandomNumber(min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function pickRandomSong(data: { tracks: { items: Track[] } }): Track | null {
    if (data.tracks.items && data.tracks.items.length > 0) {
        const randomIndex = pickRandomNumber(0, data.tracks.items.length - 1);
        return data.tracks.items[randomIndex];
    } else {
        console.error('song not found')
        return null
    }
}



function pickFirstSong(data: { tracks: { items: Track[] } }): Track | null {
    if (data.tracks.items && data.tracks.items.length > 0) {
        return data.tracks.items[0];
    } else {
        console.log('song not found')
        return null
    }
}



// Find the track 
const searchTrack = async (songInfo: SongResponseInterface) => {
    try {
        const cookieStore = await cookies();
        const accessToken = cookieStore.get('access_token')?.value;


        if (!accessToken) {
            throw new Error('Access token is missing or invalid');
        }

        // Build query string dynamically
        const query = querystring.stringify({
            q: [
                songInfo.song_name ? `track:"${songInfo.song_name}"` : null,
                songInfo.artist_name ? `artist:"${songInfo.artist_name}"` : null,
                songInfo.album_name ? `album:"${songInfo.album_name}"` : null,
            ]
                .filter(Boolean)
                .join(' '),
            type: 'track',
        });

        const url = `https://api.spotify.com/v1/search?${query}`;

        const authOptions = {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        };

        // Send request to Spotify search API
        const searchResponse = await fetch(url, authOptions);

        if (!searchResponse.ok) {
            throw new Error(`Spotify API request failed with status: ${searchResponse.status}`);
        }

        // Get response data
        const data = await searchResponse.json();

        // Target random item in 20 response songs if song name is not specified
        if (songInfo.song_name == null) {
            const randomSong = pickRandomSong(data)

            if (randomSong) {
                // Assign ID value
                songInfo.id = randomSong.id
                return songInfo;
            } else {
                return null;
            }


        } else {
            const nonrandomsong = pickFirstSong(data);
            if (nonrandomsong) {
                // Assign ID value
                songInfo.id = nonrandomsong.id
                return songInfo;
            } else {
                return null;
            }
        }

    } catch (error) {
        console.error('Error in searchTrack:', error);
        throw error;
    }
};


export async function GET(req: NextRequest) {
    let textResponse = "";
    // Function to play a song
    const playSong = async (track: SongResponseInterface) => {
        const cookieStore = await cookies();
        const accessToken = cookieStore.get('access_token')?.value;

        const id = track.id;
        const url = `https://api.spotify.com/v1/me/player/play`;

        const response = await fetch(url, {
            method: 'PUT',
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
            body: JSON.stringify({
                uris: [`spotify:track:${id}`]
            })
        });

        if (response.ok) {
            textResponse += "Playing " + track.artist_name + "!\n"
        } else if (response.status === 404) {
            textResponse += "No active device found!\n"
        }
        else {
            textResponse += "Could not find song or artist!\n";
            // const errorText = await response.text();
            // console.error(`Failed to play the song: ${response.status} - ${errorText}`);
        }
    }

    // Function to add a song to the playback queue
    const addToQueue = async (track: SongResponseInterface) => {
        const cookieStore = await cookies();
        const accessToken = cookieStore.get('access_token')?.value;

        const id = track.id;

        const url = `https://api.spotify.com/v1/me/player/queue?uri=spotify:track:${id}`;

        await fetch(url, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        }).then(response => {
            if (response.ok) {
                textResponse += "Queued " + track.artist_name + "!\n"
            } else if (response.status === 404) {
                textResponse += "No active device found!\n"
            }
            else {
                textResponse += "Could not find song or artist!\n";
                const errorText = response.text();
                console.error(`Failed to add to queue: ${response.status} - ${errorText}`);
            }
        });


    }

    try {
        // Extract query parameter or body text from the request
        const userContent = req.nextUrl.searchParams.get('text');

        if (!userContent) {
            return NextResponse.json(
                { error: 'No input!' },
                { status: 400 }
            );
        }

        // Request openai
        const response = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
                {
                    "role": "system",
                    "content": [
                        {
                            "type": "text",
                            "text": "The instructions presented to you will concern one or more interactions with Spotify, you will return a json object.\n\nFor each command that you identify in the prompt, add 'COMMAND_TYPE' : {} to the json object before returning it\n\nThese are the different types of commands:\n'queue'\n'play'\n\nFor example, if your prompt is  'Queue 3 foo fighters songs and then queue the emotion by borns and then the Dune soundtrack, also, play despacito first' you would add\n\n{\n  \"play\": {\n    \"songs\": [\n      {\n        \"artist_name\": null,\n        \"song_name\": \"despacito\",\n        \"album_name\": null\n      }\n    ]\n  },\n  \"queue\": {\n    \"songs\": [\n      {\n        \"artist_name\": \"foo fighters\",\n        \"song_name\": null,\n        \"album_name\": null\n      },\n      {\n        \"artist_name\": \"foo fighters\",\n        \"song_name\": null,\n        \"album_name\": null\n      },\n      {\n        \"artist_name\": \"foo fighters\",\n        \"song_name\": null,\n        \"album_name\": null\n      },\n      {\n        \"artist_name\": \"borns\",\n        \"song_name\": \"the emotion\",\n        \"album_name\": null\n      },\n      {\n        \"artist_name\": null\n        \"song_name\": null\n        \"album_name\": \"Dune Soundtrack:\"\n      }\n    ]\n  }\n}\n\n\n\nThere can only be one 'play' command per return object, and the play command should be the song or artist that the request indicates they want to hear now. The 'play' command should come first in the object you return, and everything else should be a 'queue' command. \n\nadditionally, use context clues and your own knowledge to fill in for common artist abbreviations\n\nFor example, rhcp should be Red Hot Chili Peppers etc\n\nDo not include 'play' if nothing has been asked to be played now\nDo not include 'queue' if nothing has been asked to be queued\n\nRequest:\n"
                        }
                    ]
                },
                { role: 'user', content: userContent }
            ],
            temperature: 1,
            max_tokens: 2048,
            top_p: 1,
            frequency_penalty: 0,
            presence_penalty: 0,
            response_format: {
                "type": "json_object"
            },
        });
        // Extract the message content from the OpenAI response
        const messageContent = response.choices[0]?.message?.content;

        // Handle error
        if (!messageContent) {
            return NextResponse.json(
                { error: 'OpenAI API returned no message content' },
                { status: 500 }
            );
        }

        // Process contents of the request and get specified tracks 
        try {
            // Assuming messageContent is a JSON string
            const responseObject = JSON.parse(messageContent);

            // Ensure the parsed object is indeed an object
            if (typeof responseObject === 'object' && responseObject !== null) {

                // Check for 'play' and extract its 'songs' object
                if (responseObject.hasOwnProperty('play')) {
                    const playSongs = responseObject['play']['songs'];

                    // Assuming playSongs is an array of song objects
                    for (const song of playSongs) {
                        if (song.artist_name || song.song_name) {
                            const r = await searchTrack({
                                artist_name: song.artist_name || null,
                                song_name: song.song_name || null,
                                album_name: song.album_name || null,
                                id: null
                            });

                            // Play the given song
                            if (r) { await playSong(r) }
                        }
                    }
                }

                // Check for 'queue' and extract its 'songs' object
                if (responseObject.hasOwnProperty('queue')) {
                    const queueSongs = responseObject['queue']['songs'];

                    // Assuming queueSongs is an array of song objects
                    for (const song of queueSongs) {
                        if (song.artist_name || song.song_name) {
                            const r = await searchTrack({
                                artist_name: song.artist_name || null,
                                song_name: song.song_name || null,
                                album_name: song.album_name || null,
                                id: null
                            });
                            // Add song to queue
                            if (r) {
                                await addToQueue(r)
                            }

                        }
                    }

                }
            } else {
                console.error('Expected a JSON object, but got something else:', responseObject);
            }
        } catch (error) {
            console.error('Error parsing or processing messageContent:', error);
        }

        console.log(messageContent)
        return NextResponse.json({ response: textResponse });
    } catch (error) {
        console.error('Error in API handler:', error);
        return NextResponse.json(
            { error: 'An error occurred while processing the request' },
            { status: 500 }
        );
    }
}
