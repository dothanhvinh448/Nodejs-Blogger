var db =require("mongoose");
var bcrypt = require("bcrypt");
db.connect("mongodb://localhost/post")
var userSchema = db.Schema({
    username: {
        type: String,
         require: true
        },
        email: {
        type: String,
         require: true,
         unique: true
        },
        password: {
        type: String,
         require: true
}},
        {versionKey:false}
);
userSchema.pre('save', function(next) {
    var user = this
    bcrypt.hash(user.password, 10, function(err, encrypted) {
        user.password = encrypted
        next()
    })
})
var user = db.model('user', userSchema)
module.exports = user
