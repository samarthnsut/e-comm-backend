const express =require('express')
const path = require('path')
const port=1000;
const db = require("./config/moongose");
const app=express();
const Account = require('./modals/Account')


app.set("view engine",'ejs')
app.set('views',path.join(__dirname, 'views'))
app.use(express.urlencoded())
app.use(express.static("assests"))



app.listen(port,function(err){
    if(err)
    console.log("error")

    console.log("server running")
})
app.get("/", function(req,res){

    return res.render('index')
})
app.get("/home",function(req,res){
    return res.render('home')
})
app.get("/signin",function(req,res){
    return res.render("signin")
})
app.get('/maintain', function(req,res){
    return res.render('maintain')
})
app.get("/signup",function(req,res){
    return res.render("signup")
})
let yourAccount={};
app.post("/new-account",function(req,res){
    Account.create({
        name : req.body.name,
        phone : req.body.phone,
        l_name : req.body.l_name,
        e_mail : req.body.email,
        u_name: req.body.uname,
        password : req.body.password
    },function(err,newAccount){
        if(err){
            console.log("error in creating acc  ", err);
            return;
        }
        yourAccount=newAccount;
        console.log("******",yourAccount)

        return res.redirect("accinfo")
        
    })
   
})
app.get("/accinfo",function(req,res){
    
    return res.render("accinfo",{
        title : yourAccount.u_name ,
        name : yourAccount.name,
        phone : yourAccount.phone,
        lname : yourAccount.l_name,
        email : yourAccount.e_mail,
        uname : yourAccount.u_name
    })
})
