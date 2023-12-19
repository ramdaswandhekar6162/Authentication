//jshint esversion:6
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const encrypt = require("mongoose-encryption");

const app = express();


app.use(express.static("public"));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({
    extended : true
}));


mongoose.connect("mongodb://127.0.0.1:27017/userDB", {useNewUrlParser : true});

const userSchema = new mongoose.Schema({
    email : String,
    password : String
});
const secret = "thisisourscretekey.";

userSchema.plugin(encrypt,{secret : secret, encryptedFields:["password"]});

const User = new mongoose.model("User",userSchema);

app.get("/",function(req,res){
    res.render("home");
});
app.get("/login",function(req,res){
    res.render("login");
});
app.get("/register",function(req,res){
    res.render("register");
});

app.post("/register",function(req,res){
    // const email = 
    // const password = ;

    const newUser = new User({
        email : req.body.username,
        password : req.body.password
    });
    
    newUser.save(newUser).then(function(result){
        if(result){
            res.render("secrets");
        }
    }).catch(function(err){
        console.log(err);
    })
});

app.post("/login",function(req,res){
    const email = req.body.username;
    const password = req.body.password;

    User.findOne({email : email}).then(function(result){
        if(result){
            if(result.password === password){
                res.render("secrets");
            }
        }
    }).catch(function(err){
        console.log(err);
    })

});







app.listen("3000",function(req,res){
    console.log("Server run on 3000 port...");
});