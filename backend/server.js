const express = require('express')
const bodyParser = require('body-parser')
swaggerJsdoc = require("swagger-jsdoc"),
swaggerUi = require("swagger-ui-express");
const app = express()
const db = require('./queries')
const port = 8090
const cors = require('cors');
const jwt = require('jsonwebtoken');
app.use(cors({
    origin: '*',
    methods: ['GET','POST','DELETE','UPDATE','PUT','PATCH']
}));
app.use(bodyParser.json())
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
)


const dotenv = require('dotenv');

dotenv.config();

process.env.TOKEN_SECRET;

function generateAccessToken(username) {
  return jwt.sign(username, process.env.TOKEN_SECRET, { expiresIn: '1800s' });
}


app.get('/api', (request, response) => {
  response.json({ info: 'Node.js, Express, and Postgres API' })
})

app.get('/api/districts', db.getDistrict)
app.get('/api/districts/:id', db.getDistrictById)
app.get('/api/subdistrict', db.getSubDistrict)
app.get('/api/subdistrict/:id',db.getSubDistrictByDistrictId)
app.get('/api/zipcode/:id',db.getZipCodeBySubDistrictId)
app.get('/api/project/status', db.getProjectStatus)
app.get('/api/project/status/:id', db.getProjectStatusById)
app.get('/api/project/', db.getProject)
app.post('/api/user/register',db.postRegistUser)
app.get('/api/role',db.getRole)
app.get('/api/community/district/:id',db.getCommunityDistrictId)
app.get('/api/community/',db.getCommunity)
app.post('/api/createNewUser', (req, res) => {
  const token = generateAccessToken({ username: req.body.username });
  res.json(token);
});

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Participatory Budgeting",
      version: "0.1.0",
      description:
        "Participatory Budgeting RESTFUL API",
      license: {
        name: "MIT",
        url: "https://spdx.org/licenses/MIT.html",
      },
      contact: {
        name: "Kaogeek",
        url: "",
        email: "",
      },
    },
    servers: [
      {
        url: "http://bkkpb.ath.cx/api",
      },
    ],
  },
  apis: ["./routes/*.js"],
};

const specs = swaggerJsdoc(options);
app.use(
  "/api/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(specs, { explorer: true })
);
app.listen(port, () => {
  console.log(`App running on port ${port}.`)
})
