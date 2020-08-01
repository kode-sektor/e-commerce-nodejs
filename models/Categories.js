const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const categorySchema = new Schema({
    title : {
        type : String,
        required : true
    }
});

/*For every Schema you create (create a schema per collection), you must also create a model
The model will allow you to perform CRUD operations on a given collection*/

const categoryModel = mongoose.model('Category', categorySchema);

module.exports = categoryModel;