const express =require('express')
const cookieParser = require('cookie-parser')
const path = require('path')
const port=1000;
const db = require("./config/moongose");
const app=express();
const Account = require('./modals/Account')

let yourAccount = undefined;

app.set("view engine",'ejs')
app.set('views',path.join(__dirname, 'views'))
app.use(express.urlencoded())
app.use(cookieParser());
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
    return res.render('home', {
        your_account: yourAccount
    });
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
        if(req.body.password!=req.body.confirm_password){
           console.log("password did not match")
           console.log(req.body.password)
           console.log(req.body.confirm_password)
           return res.redirect("back")
        }
        else{
       
        console.log("******",yourAccount)

        return res.redirect("signin")
        }
        
    })
   
})
app.post("/create-session",function(req,res){
    Account.findOne({u_name:req.body.u_name},function(err,account){
       if(err) 
       {
           console.log("error in finding account",err)
           return;
       }

        if(account){
         console.log("found acc")
         // handling incorrect password
         if(account.password!=req.body.password){
            return res.redirect("back")
         }
         //correct password 
         else{
             console.log(account._id)
             res.cookie('user_id',account.id)
            return res.redirect("/accinfo")
             
         }
        }
        //handling account (found/not-found)
        else{
            console.log("no acc found")
            return res.redirect("back")
        }
    })
})
app.get("/accinfo",function(req,res){
    if(req.cookies.user_id)
    {
        Account.findById(req.cookies.user_id,function(err,account){
            return res.render("accinfo",{
                title : account.u_name ,
                name : account.name,
                phone : yourAccount.phone,
                lname : account.l_name,
                email : account.e_mail,
                uname : account.u_name
            })
        })
    
   }
   else{
       return res.redirect("signin")
   }
})
