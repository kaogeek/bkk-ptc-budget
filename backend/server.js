const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const db = require('./queries')
const port = 3000

app.use(bodyParser.json())
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
)

app.get('/', (request, response) => {
  response.json({ info: 'Node.js, Express, and Postgres API' })
})

app.get('/districts', db.getDistrict)
app.get('/districts/:id', db.getDistrictById)
app.get('/project/status', db.getProjectStatus)
app.get('/project/status/:id', db.getProjectStatusById)
app.get('/project/', db.getProject)

app.listen(port, () => {
  console.log(`App running on port ${port}.`)
})