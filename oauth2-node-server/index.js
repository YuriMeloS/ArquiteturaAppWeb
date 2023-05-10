import 'bootstrap/dist/css/bootstrap.min.css'
const express = require("express");
const axios = require("axios");
var cors = require("cors");
const CLIENT_ID = "<dce22d6fa62972b24755>";
const CLIENT_SECRET = "<7a63620d3e7cd4baf01357b3d17a892650de46dd>";
const GITHUB_URL = "https://github.com/login/oauth/access_token";
const app = express();
app.use(cors({ credentials: true, origin: true }));
app.get("/oauth/redirect", (req, res) => {
    axios({
        method: "POST",
        url: `${GITHUB_URL}?client_id=${CLIENT_ID}&client_secret=${CLIENT_SECRET}&code=${req.query.code}`,
        headers: {
            Accept: "application/json",
        },
    }).then((response) => {
        res.redirect(
            `http://localhost:3000?access_token=${response.data.access_token}`
        );
    });
});
const PORT = 8080;
app.listen(PORT, () => {
    console.log(`Listening at port ${PORT}`);
});