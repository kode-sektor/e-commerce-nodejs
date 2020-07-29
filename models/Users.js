const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require("bcryptjs"); /*Import bcrypt*/

/*createdBy and dateCreated are 2 important things when creating a DB.
Just good practice*/

const userSchema = new Schema({

    firstName : {
        type : String,
        required : true
    },
    lastName : {
        type : String,
        required : true
    },
    email : {
        type : String,
        required : true
    },
    dateCreated : {
        type : Date,
        default : Date.now()
    },
    password : {
        type : String,
        required : true
    },
    profilePic : {
        type : String 
    }, 
    type : {
        type : String
    }
});

// Double hashing is used 
userSchema.pre("save", function(next) {
    // salt random generated characters or strings 
    bcrypt.genSalt(10).then((salt) => {
        // this.password refers to the password in User.js/controllers (ln 20)
        console.log("PASSWORD FROM MODEL: ", this.password)
        bcrypt.hash(this.password, salt).then((encryptPassword) => {
            this.password = encryptPassword;
            next();
        }).catch(err => console.log(`Error occured when hashing ${err}`));
    });

});


/*For every Schema you create (create a schema per collection), you must also create a model
The model will allow you to perform CRUD operations on a given collection*/

const userModel = mongoose.model('User', userSchema);

module.exports = userModel;