	const methods = {

		checkNull : (key, field, errors, loginVals) => {
		    //(field == "") ? errors.null[`${key}`] = ' should not be empty' : loginVals[`${key}`] = field;

		    if (field == "") {
		    	errors.null[`${key}`] = ' should not be empty';
		    } else {
		    	loginVals[`${key}`] = field;
		    }

		    	console.log ("KEY : ", key);
		    	console.log ("FIELD : ", field);
		    	/*console.log ("ERRORS : ", errors);
		    	console.log ("LOGINVALS : ", loginVals);*/
		},

		capitalise : (word) => {
			return word.charAt(0).toUpperCase() + word.slice(1);
		}

	}

	module.exports = methods;	
