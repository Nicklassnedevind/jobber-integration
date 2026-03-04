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
