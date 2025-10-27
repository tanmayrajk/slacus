import 'dotenv/config'
import SpotifyWebApi from 'spotify-web-api-node';

const spotifyClientId = process.env.SPOTIFY_CLIENT_ID;
const spotifyClientSecret = process.env.SPOTIFY_CLIENT_SECRET;
const spotifyRefreshToken = process.env.SPOTIFY_REFRESH_TOKEN;

const spotify = new SpotifyWebApi({
    clientId: spotifyClientId,
    clientSecret: spotifyClientSecret
})

spotify.setRefreshToken(spotifyRefreshToken as string);

async function getCurrentlyPlayingTrack() {
    try {
        const playback = await spotify.getMyCurrentPlayingTrack();
        if (!playback.body || !playback.body.item) return null;
        return playback.body.item;
    } catch (err) {
        if ((err as any).statusCode === 401) {
            const data = await spotify.refreshAccessToken();
            spotify.setAccessToken(data.body.access_token);
            return getCurrentlyPlayingTrack();
        }
        return null;
    }
}

console.log(await getCurrentlyPlayingTrack());