const express = require("express")
const router = express.Router()

const AccountDB = require("../models/account")

router.get("/login", async (req, res) => {
    if (!req.query.username) return res.json({Success: false, Message: "Missing username"})
    if (!req.query.password) return res.json({Success: false, Message: "Missing password"})

    let Token = await AccountDB.GetConnectionToken(req.query.username, req.query.password)

    if (Token) {
        res.cookie(`TOKEN`, Token,{
            maxAge: 24 * 60 * 60 * 1000,
            secure: true,
            httpOnly: false, // As this is a test project, we allow the use of HTTP.
            sameSite: 'lax'
        });

        res.json({Success: true})
    }else{
        res.json({Success: false, Message: "Auth failed"})
    }
})

router.get("/getUsername", async (req, res) => {
    if (!req.cookies.TOKEN) return res.json({Success: false, Message: "No token"})
    if (!AccountDB.IsTokenValid(req.cookies.TOKEN)) return res.json({Success: false, Message: "Token expired"})

    let Username = await AccountDB.GetUsernameFromToken(req.cookies.TOKEN)

    if (Username) {
        res.json({Success: true, Message: Username})
    }else{
        res.json({Success: false, Message: "Unknown error"})
    }
})

router.get("/logout", (req, res) => {
    res.clearCookie()
    res.redirect('/');
})

router.post("/create", async (req, res) => {
    if (!req.body.username) return res.json({Success: false, Message: "Missing username"})
    if (!req.body.password) return res.json({Success: false, Message: "Missing password"})

    let Code = await AccountDB.CreateAccount(req.body.username, req.body.password)
    if (Code == 0) {
        return res.json({"Success": true})
    }else if(Code == 1){
        return res.json({"Success": false, "Message": "Username already used"})
    }else if(Code == 2){
        return res.json({"Success": false, "Message": "Mysql internal error"})
    }
})

module.exports = router