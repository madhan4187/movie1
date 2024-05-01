const express = require('express')
const path = require('path')
const {open} = require('sqlite')
const sqlite3 = require('sqlite3')
const app = express()

const dbPath = path.join(__dirname, 'moviesData.db')

db = null

const initilizeDbAndServer = async () => {
  db = await open({
    filename: dbPath,
    driver: sqlite3.Database,
  })
  app.listen(3000, () => {
    console.log('Server Running at http://localhost:3000/')
  })
}

initilizeDbAndServer()

const convertDbObjectToResponseObject = dbObject => {
  return {
    movieId: dbObject.movie_id,
    directorId: dbObject.director_id,
    movieName: dbObject.movie_name,
    leadActor: dbObject.lead_actor,
  }
}

app.get('/movies/', async (request, response) => {
  const getmoviesQuery = `SELECT * 
  FROM movie
  ORDER BY movie_id`
  const movieArray = await db.all(getmoviesQuery)
  response.send(
    movieArray.map(eachMovie => convertDbObjectToResponseObject(eachMovie)),
  )
})

app.get('/movies/:movieId/', async (request, response) => {
  const {movieId} = request.params
  const getMoviesQuery = `SELECT * 
  FROM movie
  WHERE movie_id = ${movieId}`
  const movie = await db.get(getMoviesQuery)
  response.send(movie)
})

app.post('/movies/', async (request, response) => {
  const {directorId, movieName, leadActor} = request.body
  const addmovieQuery = `INSEART INTO 
    movie(director_id,movie_name,lead_actor)
   VALUES ('${directorId}','${movieName}','${leadActor}')`
  const dbResponse = await db.run(addmovieQuery)
  response.send('Movie Successfully Added')
})
