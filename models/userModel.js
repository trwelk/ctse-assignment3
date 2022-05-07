var userSchema = mongoose.Schema({
    id: String,
    name: String,
    password: String,
    userName: String
 });

 module.exports = {userSchema};