const express =require('express')
const cookieParser = require('cookie-parser')
const path = require('path')
const port=2000;
const db = require("./config/moongose");
const app=express();
const Account = require('./modals/Account')
const Product = require("./modals/products")
const Comment = require("./modals/comment")

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

com=[undefined];
i=0;
app.get("/home",function(req,res){
  
 
    Product.find({})
    .populate('account')
    .populate({
        path: 'comment',
        populate: {
            path: 'user'
        }
    })
    .exec(function(err,product){
     
        if(err){
            console.log("eror in finding user products",err)
        }
      //  console.log(product);
       return res.render('home', {
           your_account : yourAccount,
           product: product,
           comment: com,
           i: i
    })
 })

  
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
            
             console.log("password did not match")
            return res.redirect("back")
         }
         //correct password 
         else{
             
             your_account=yourAccount;
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

app.post('/comment',function(req,res){
    Product.findById(req.body.product,function(err,product){
    
     if(product)
     {    console.log("found product", product);
         Comment.create({
             content: req.body.content,
             product: req.body.product,
             account: yourAccount._id
         },function(err,comm){
             if(err){
             console.log("error in creating comment",err)}
        com[i]=comm;
        console.log(com[i])
        i++;
          // console.log("the comment is" , comm);
           // product.comment.push(comm)
             product.save();

            return res.redirect("back");
         })
     }else{
     console.log("no product found");}

    })


})
app.post('/createproduct',function(req,res){
    console.log(yourAccount);
    Product.create({
        pname: req.body.pname,
        description: req.body.description,
        //comments: req.body.comment,
        account: yourAccount._id
    }),function(err,product){
        console.log("error in creating product",err);
        return res.redirect("back");
    }
    return res.redirect("home");
})

app.get("/accinfo",function(req,res){
    if(req.cookies.user_id)
    {
        Account.findById(req.cookies.user_id,function(err,account){
            if(err)
            {console.log("errpr in creating account",err)}
            yourAccount=account;
            return res.render("accinfo",{
                title : account.u_name ,
                name : account.name,
                phone : account.phone,
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

app.get("/sign-out",function(req,res){
    
    res.clearCookie("user_id")


    return res.render("home")
    your_account = undefined;
    return res.render("signin")
})
