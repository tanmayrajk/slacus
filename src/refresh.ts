import 'dotenv/config'
import express from "express";
import SpotifyWebApi from "spotify-web-api-node";

const app = express();

const spotifyAPI = new SpotifyWebApi({
    clientId: process.env.SPOTIFY_CLIENT_ID,
    clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
    redirectUri: "http://127.0.0.1:8888/callback"
});

const scopes = ["user-read-currently-playing", "user-read-playback-state"];

app.get("/login", (req, res) => {
  res.redirect(spotifyAPI.createAuthorizeURL(scopes, "state"));
});

app.get("/callback", async (req, res) => {
  const code = req.query.code;
  try {
    const data = await spotifyAPI.authorizationCodeGrant(code as string);
    console.log("access:", data.body.access_token);
    console.log("refresh:", data.body.refresh_token);
  } catch (err) {
    console.error(err);
    res.send("auth failed");
  }
});

app.listen(8888, () => {
  console.log("Server started on http://127.0.0.1:8888/login");
});