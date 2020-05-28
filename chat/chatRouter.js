const  express  = require("express");
const connect = require("./dbconnection.js");
const Chat = require("./chatschema.js");

const  router  =  express.Router();

router.route("/chat").get((req, res, next) =>  {
        res.setHeader("Content-Type", "application/json");
        res.statusCode  =  200;
        connect.then(db  =>  {
            Chat.find({}).then(chat  =>  {
            res.json(chat);
        });
    });
});

module.exports  =  router;
