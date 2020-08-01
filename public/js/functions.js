	const methods = {

		checkNull : (key, field, errors, loginVals) => {
		    (field == "") ? errors.null[`${key}`] = ' should not be empty' : loginVals[`${key}`] = field;
		},

		capitalise : (word) => {
			return word.charAt(0).toUpperCase() + word.slice(1);
		}

	}

	module.exports = methods;	
