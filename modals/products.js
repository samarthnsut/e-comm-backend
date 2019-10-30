const mongoose= require("mongoose")


const productSchema= new mongoose.Schema({
    pname :{
        type : String,
        require : true
    },
    description:{
        type : String
    },
    account :{
        type : mongoose.Schema.Types.ObjectId,
        ref : "Account"
    },
    comment:{
        type: mongoose.Schema.Types.ObjectId,
        ref : "Comment"
    }
},{
    timestamps: true
})
console.log("Made the product schema")
const Product= mongoose.model("Product",productSchema);
module.exports= Product;