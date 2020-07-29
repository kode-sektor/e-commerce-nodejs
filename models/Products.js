const mongoose = require('mongoose');
const Schema = mongoose.Schema;

/*createdBy and dateCreated are 2 important things when creating a DB.
Just good practice*/

const productSchema = new Schema({
    title : {
        type : String,
        required : true
    },
    description : {
        type : String,
        required : true
    },
    price : {
        type : Date,
        required : Date.now()
    },
    featured : {
        type : String,
        required : true
    },
    imgPath : {
        type : String,
        required : true
    },
    category : {
        type : String,
        required : true
    }
    
});

/*For every Schema you create (create a schema per collection), you must also create a model
The model will allow you to perform CRUD operations on a given collection*/

const productModel = mongoose.model('Product', productSchema);

module.exports = productModel;