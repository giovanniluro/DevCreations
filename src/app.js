const express = require("express");
const cors = require("cors");
const { uuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

app.get("/repositories", (request, response) => {
  return response.json(repositories);
});

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body;

  if (!url.includes('git')) return response.status(400).json({error:"URL must be a git repository!"});

  const id = uuid();

  const repositorie = { id, title, url, techs, likes: 0 };

  repositories.push(repositorie);

  return response.status(200).json(repositorie);
});

app.put("/repositories/:id", (request, response) => {
  const { title, url, techs } = request.body;
  const { id } = request.params;

  const pos = repositories.findIndex(repositorie => repositorie.id === id);
  if (pos < 0) return response.status(400).json({ error: "Project ID not found!" });

  const currentRepositorie = repositories[pos];

  const newRepositorie = { id: currentRepositorie.id, title, url, techs, likes: currentRepositorie.likes }

  repositories.splice(pos, 1, newRepositorie);

  return response.status(200).json(newRepositorie);

});

app.delete("/repositories/:id", (request, response) => {
  const {id} = request.params;

  const pos = repositories.findIndex(repositorie => repositorie.id === id);
  if (pos < 0) return response.status(400).json({ error: "Project ID not found!" });

  repositories.splice(pos, 1);

  return response.status(204).send();
});

app.post("/repositories/:id/like", (request, response) => {
  const {id} = request.params;

  const pos = repositories.findIndex(repositorie => repositorie.id === id);
  if (pos < 0) return response.status(400).json({ error: "Project ID not found!" });

  repositories[pos].likes ++;

  return response.status(200).json({likes:repositories[pos].likes});
});

module.exports = app;
