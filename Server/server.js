require('dotenv').config()

// DEFINE BASE VARIABLES
const express = require("express")
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const fs = require("fs")
const path = require("path")
let app = express()

// ADD MIDDLEWARES
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

// SETUP ROUTES
for (let file of fs.readdirSync("./routes")){
    let Name = file.substring(0, file.length-3)
    app.use("/" + Name, require("./routes/" + Name))
}

// SETUP VIEWS
for (let file of fs.readdirSync("./views")){
    let Name = file.substring(0, file.length-5).toLowerCase()
    console.log(file, Name)
    app.get("/" + Name, (req, res) => {
        res.sendFile(path.resolve("./views/" + file))
    })

    if (Name == "index"){
        app.get("/", (req, res) => {
            res.sendFile(path.resolve("./views/" + file))
        })
    }
}

// START SERVER
app.listen(process.env.PORT, () => {
    console.log("Server is on: http://localhost:" + process.env.PORT)
})