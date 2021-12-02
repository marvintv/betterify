require('dotenv').config()

const express = require('express');
const spotifyWebApi = require('spotify-web-api-node');
const cors = require('cors')
const lyricsFinder = require('lyrics-finder')

const app = express()
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.post("/refresh", (req, res) => {
    const refreshToken = req.body.refreshToken
    const spotifyApi = new spotifyWebApi({
      clientId: 'b83a6ca33f8a4e9298179c57bc7f5d48',
      clientSecret:  '956c2dd09e2a4ced934fe92357454f61',
      redirectUri: 'https://client-betterify.herokuapp.com',
        refreshToken,
    })
  
    spotifyApi
      .refreshAccessToken()
      .then(data => {
        res.json({
          accessToken: data.body.accessToken,
          expiresIn: data.body.expiresIn,
        })
      })
      .catch(err => {
        console.log(err)
        res.sendStatus(400)
      })
  })
  

app.post('/login', function(req, res) {

    const code = req.body.code;

    const spotifyApi = new spotifyWebApi({
      clientId: 'b83a6ca33f8a4e9298179c57bc7f5d48',
      clientSecret:  '956c2dd09e2a4ced934fe92357454f61',
      redirectUri: 'https://client-betterify.herokuapp.com',
    })

    spotifyApi.authorizationCodeGrant(code)
        .then(data => {
            res.json({
                accessToken: data.body.access_token,
                refreshToken: data.body.refresh_token,
                expiresIn: data.body.expires_in
            })
    })
    .catch((err) => {
        console.log(err)
        res.sendStatus(400)
    })

})

app.get("/lyrics", async (req, res) => {
  const lyrics =
    (await lyricsFinder(req.query.artist, req.query.track)) || "No Lyrics Found"
  res.json({ lyrics })
})

.listen(process.env.PORT || 3001)
