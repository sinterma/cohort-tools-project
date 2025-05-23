const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema ( {
    name: {type: String, required: true},
    password: {type: String, required: true},
    email: {type: String, unique: true, required: true},
})


const User = mongoose.model( "User", UserSchema)

module.exports = User;

// email: Type String - should be unique
// password: Type String
// name: Type String