const express = require("express");
const port = process.env.PORT || 3000;
const axios = require ('axios');
const app = express();

app.use(express.json({ type: "application/json" }));
//This is a config that axios will use to pass the request on to the http api
let config = {
  method: "post",
  //We can pass in the url via a url param ?http://example.com, or we can just use an env variable to handle it
  url: process.env.HTTP_URL,
  headers: {
    "Content-Type": "application/json",
  },
};

const httpRequester = async (auth, body, httpUrl) => {
  //We assign the necessary info to the config object
  Object.assign(config.headers, {
    auth,
  });
  Object.assign(config, {
    url: httpUrl,
    data: body,
  });
  // we call the endpoint and then return the response
  const resp = await axios(config);
  return resp.data;
};


app.post("/zd", async (req, res) => {
  if (req.headers["authorization"] && req.body) {
    let authorization = req.headers["authorization"] 
    let zedBody = req.body
    //decodes URL and splits it to the part we want
    let httpUrl = decodeURI(req.url).split('?')[1]
    const response = await httpRequester(authorization, zedBody, httpUrl);
    // once the httpRequester method has received a response, we pass it back to Zendesk
    res.json(response);
  }
});
//This is so we can actively monitor the responses of the requests
app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
