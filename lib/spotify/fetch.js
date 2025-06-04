/**
 * author: Manuel Rodriguez
 * 
 * 
 * fetch.js
 * /lib/spotify/fetch,js
 * Helper function to forward HTTP requests to the Spotify API.
 * Avoids database calls for to read and write tokens for each request.
 * This is a simple wrapper around the fetch API to handle Spotify's token management.
 * Caller must ensure that the token is valid before calling this function.
 * 
 * Example usage:
 * import { fetchSpotify } from '@/lib/spotify/fetch.js';
 * const data await fetchSpotify("me/player", "GET", token);
 */

export async function fetchSpotify(
    endpoint,       // The Spotify API endpoint to call, e.g., "me/player"
    method,         // HTTP method, e.g., "GET", "POST"
    accessToken,    // The OAuth access token for Spotify API
    body            // Optional body for POST requests, JSON object or undefined
) {
    
    const res = await fetch( `https://api.spotify.com/v1/${endpoint}`, { //
        method: method,
        headers: {
            Authorization: `Bearer ${accessToken}`, 
            'Content-Type': 'application/json'  
        },
        body: body ? JSON.stringify(body) : undefined // Convert body to JSON string if provided
    });
    if (!res.ok) { // Check if the response is OK (status in the range 200-299)
        const errorText = await res.text(); // Read the error response text
        throw new Error(`Spotify API request failed: ${res.status} ${res.statusText} - ${errorText}`);
    }
    return res.json(); // Parse and return the JSON response
}