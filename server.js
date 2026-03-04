import express from "express";
import fetch from "node-fetch";

const app = express();
app.use(express.json());

const JOBBER_API_KEY = process.env.JOBBER_API_KEY;

app.get("/clients", async (req, res) => {
  const response = await fetch("https://api.getjobber.com/graphql", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${JOBBER_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query: `
        query {
          clients {
            nodes {
              id
              firstName
              lastName
            }
          }
        }
      `
    })
  });

  const data = await response.json();
  res.json(data);
});

app.listen(3000, () => console.log("Server running"));
app.get("/connect", (req, res) => {
  const redirectUri = "https://your-app-name.onrender.com/oauth/callback";

  const url = `https://api.getjobber.com/api/oauth/authorize?client_id=${process.env.CLIENT_ID}&redirect_uri=${redirectUri}&response_type=code`;

  res.redirect(url);
});
app.get("/oauth/callback", async (req, res) => {
  const code = req.query.code;

  const response = await fetch("https://api.getjobber.com/api/oauth/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      client_id: process.env.CLIENT_ID,
      client_secret: process.env.CLIENT_SECRET,
      grant_type: "authorization_code",
      code: code,
      redirect_uri: "https://your-app-name.onrender.com/oauth/callback"
    })
  });

  const data = await response.json();

  // For now, just display the token
  res.json(data);
});
