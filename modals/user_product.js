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
    }
},{
    timestamps: true
})
const Product= mongoose.model("Product",productSchema);
module.exports= Product;