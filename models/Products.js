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
        type : String,
        required :true
    },
    featured : {
        type : String,
        required : true
    },/*imgPath needs to be part of the model if not, record will not be saved. Every form 
    element must be defined in the model. But it should not be required because its not saved
    immediately. The id of a particular saved record is unique and this is used in naming the 
    images. This is done to avoid name clashes. And since ids can only be gotten only after 
    image has been saved, then image will always be updated on the record. Thus, it should
    not be set to "required: true"*/
    imgPath : {   
        type : String,
        /*required : true*/
    },
    category : {
        type : String,
        required : true
    },
    quantity : {
        type: String,
        require : true
    },
    dateCreated : {
        type : Date,
        default : Date.now()
    },
    inCart : {
        type: String,
        default : "false"
    }
});

/*For every Schema you create (create a schema per collection), you must also create a model
The model will allow you to perform CRUD operations on a given collection*/

const productModel = mongoose.model('Product', productSchema);

module.exports = productModel;