var db=require('mongoose')
db.connect('mongodb://localhost/post',{
    useNewUrlParser:true,
    useUnifiedTopology:true
});
var postSchema=db.Schema({
    username:String,
    title:String,
    subtitle:String,
    content:String,
    image:String,
    createAt:{
        type:Date,
        default:new Date()
    }
})
var Post=db.model('Post',postSchema)
module.exports=Post