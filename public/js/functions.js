	const methods = {

		checkNull : (key, field, errors, loginVals) => {
		    if (field == "") {
		    	errors.null[`${key}`] = ' should not be empty';
		    } else {
		    	loginVals[`${key}`] = field;
		    }
		},

		capitalise : (word) => {
			return word.charAt(0).toUpperCase() + word.slice(1);
		}

	}

	module.exports = methods;	
