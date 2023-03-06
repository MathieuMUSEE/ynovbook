let Lib = {}

// VARIABLES
const BDD = require("./base")
const crypto = require('crypto');

const Tokens = {}

// METHODS

Lib.GetConnectionToken = async function(nom_utilisateur, mot_de_passe) {
    //let [err, res, fields] = await Connection.query(`SELECT UserId FROM users WHERE UserName = ${Username} AND UserPassword = ${Password}`)
    //console.log(BDD.GetConnection())
    const [rows] = await BDD.GetConnection().execute('SELECT id FROM users WHERE nom_utilisateur = ? AND mot_de_passe = ?', [nom_utilisateur, mot_de_passe]);

    //console.log(rows[0])
    if (rows[0]){
        let Token = crypto.randomUUID() 
        Tokens[Token] = rows[0].UserId
        return Token
    }
}

Lib.IsTokenValid = function(Token) {
    return Tokens[Token] ? true : false
}

Lib.GetUsernameFromToken = async function(Token) {
    if (!Lib.IsTokenValid(Token)) return
    let UserId = Tokens[Token]

    let [rows] = await BDD.GetConnection().execute('SELECT nom_utilisateur FROM users WHERE id = ?', [id]);
    return rows[0] ? rows[0].nom_utilisateur : false
}

Lib.CreateAccount = async function(nom_utilisateur, mot_de_passe){
    // Check if it already exist
    let [rows] = await BDD.GetConnection().execute('SELECT id FROM users WHERE nom_utilisateur = ?', [nom_utilisateur]);
    if (rows[0]) return 1

    console.log("CREATING ACCOUNT", nom_utilisateur, mot_de_passe)
    let [rows2] = await BDD.GetConnection().execute('INSERT INTO users (nom_utilisateur, mot_de_passe) VALUES (?, ?)', [nom_utilisateur, mot_de_passe])
    console.log(rows2)
    if (rows2 && rows2.affectedRows == 1) return 0

    return 2
}

module.exports = Lib
