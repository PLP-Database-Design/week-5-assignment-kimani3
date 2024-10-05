// import dependncies
const express = require("express");
const app = express()
const mysql = require('mysql2')
const dotenv = require('dotenv')

// configure a connection object
dotenv.config();

// create a connection object
const db = mysql.createConnection({
    host:process.env.DB_HOST,
    user:process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE

})
// test the db connection 
db.connect((err)=>{

    if(err){
        return console.log('server is running on port 3300..', err)
    }
    console.log('succesfully connected to the database')
})

// Root route to handle GET /
app.get('/', (req, res) => {
    res.send("Welcome to the Healthcare API");
});

//basic endpoint to retrieve patients 
app.get('/patients', (req, res) =>{
    // res.send("hello World! I dont know what I'm ding but I'm going to do it")
    const getPatients = "SELECT patient_id, first_name, last_name, date_of_birth FROM patients"
    db.query(getPatients,(err, data) =>{
        if(err) {
            return res.status(400).send("failed to get patients", err)
        }

        res.status(200).send(data)
    })
})
// retrieve all providers
app.get('/providers', (req, res) =>{
    const getProviders = "SELECT first_name, last_name, provider_speciality FROM providers"
    db.query(getProviders,(err,data)=>{
        if(err){
            return res.status(400).send("failed to retrieve providers", err)

        }
        res.status(200).send(data)
    })

})
app.get('/patients/search',(req, res) => {
    const { first_name } = req.query
    const getPatientsByFirstName = " SELECT patient_id, first_name, last_name, date_of_birth FROM patients WHERE first_name = ?"
    db.query(getPatientsByFirstName, (err, data)=>{
        if(err){
            return res.status(400).send("failed to retrieve  patients data",err)
        }
        res.status(200).send(data)
    })

})

app.get('/providers/search', (req , res) =>{
    const { specialty }= req.query
    const getProvidersBySpecialty = " SELECT first_name, last_name, provider_specialty FROM providers WHERE provider_specialty = ?"
     db.query(getProvidersBySpecialty, [specialty], (err, data) => {
        if (err) {
            return res.status(400).send({ error: "Failed to retrieve providers by specialty", details: err })
        }
        res.status(200).send(data)
    })
})

// start and listen to the server
app.listen(3300, () =>{
    console.log("server is runnign on port 3300")
})