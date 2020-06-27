const express = require("express");
const cors = require("cors");
const { uuid, isUuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

function validateRepositoryID(request, response, next){
  const { id } = request.params;

  if(!isUuid(id)){
    return response.status(400).json({ error: "Invalid Repository ID"});
  }

  return next();
}

app.get("/repositories", (request, response) => {
  const {title} = request.query
  const {url} = request.query
  const {techs} = request.query

  const results = title ? repositories.filter(repository => repository.title.includes(title)
    || repository.url.includes(url))
  : repositories;
  return response.json(results);
});

app.post("/repositories", (request, response) => {
  const {title,url,techs} = request.body
  const repository = {id: uuid(),title, url, techs, likes: 0 };

  repositories.push(repository);

  return response.json(repository);
});

app.put("/repositories/:id", validateRepositoryID, (request, response) => {
  const {id} = request.params
  const {title,url,techs} = request.body
  const repositoryIndex = repositories.findIndex( repository => repository.id === id);
  const likes = repositories[repositoryIndex].likes
  if(repositoryIndex < 0 ){
    return response.status(400).json({ error: "RepositoryIndex not found"})
  }

  const repository = {
    id,
    title,
    url,
    techs,
    likes
  };

  repositories[repositoryIndex] = repository 
 
  return response.json(repository);
});

app.delete("/repositories/:id", validateRepositoryID,(request, response) => {
  const {id} = request.params
  const repositoryIndex = repositories.findIndex( repository => repository.id === id);


  if(repositoryIndex < 0 ){
    return response.status(400).json({ error: "Repository not found"})
  }

  repositories.splice(repositoryIndex, 1)

  return response.status(204).send();
});

app.post("/repositories/:id/like", (request, response) => {
  const {id} = request.params
  const repositoryIndex = repositories.findIndex( repository => repository.id === id);
  if(repositoryIndex < 0 ){
    return response.status(400).json({ error: "Repository not found"})
  }

  repositories[repositoryIndex].likes++; 

  return response.json(repositories[repositoryIndex]);
});

module.exports = app;
