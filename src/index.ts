import 'dotenv/config'
import SpotifyWebApi from 'spotify-web-api-node';
import { WebClient } from '@slack/web-api';

const slackToken = process.env.SLACK_USER_OAUTH_TOKEN;
const spotifyClientId = process.env.SPOTIFY_CLIENT_ID;
const spotifyClientSecret = process.env.SPOTIFY_CLIENT_SECRET;
const spotifyRefreshToken = process.env.SPOTIFY_REFRESH_TOKEN;

const spotify = new SpotifyWebApi({
    clientId: spotifyClientId,
    clientSecret: spotifyClientSecret
})

const slack = new WebClient(slackToken);

spotify.setRefreshToken(spotifyRefreshToken as string);
spotify.setAccessToken((await spotify.refreshAccessToken()).body.access_token);

async function getCurrentlyPlayingTrack() {
    try {
        const data = await fetch("https://api.spotify.com/v1/me/player/currently-playing", {
            headers: {
                Authorization: `Bearer ${spotify.getAccessToken()}`,
            }
        })
        if (data.status === 401) throw { statusCode: 401 };
        const playback = await data.json();
        if (!playback || !playback.item) return null;
        return playback;
    } catch (err) {
        if ((err as any).statusCode === 401) {
            const data = await spotify.refreshAccessToken();
            spotify.setAccessToken(data.body.access_token);
            return getCurrentlyPlayingTrack();
        }
        return null;
    }
}

async function setSlackStatus(text: string, emoji: string) {
    try {
        await slack.users.profile.set({
            profile: {
                status_text: text,
                status_emoji: emoji,
                status_expiration: 0
            }
        })
        console.log("status updated");
    } catch (err) {
        console.error(err);
    }
}

async function setSpotifyStatus() {
    const track = await getCurrentlyPlayingTrack();
    if (!track || !track.is_playing) return await setSlackStatus("", "")
    const trackName = track.item.name;
    const artists = track.item.artists.map((artist: any) => artist.name).join(", ");
    await setSlackStatus(`${artists} - ${trackName}`, ":disc-spinning:");
}

await setSpotifyStatus();

setInterval(async () => {
    await setSpotifyStatus();
}, 10000);