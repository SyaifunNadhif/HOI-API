module.exports = {
	// 200 OK
	successOK: (res, message, data = null) => {
		return res.status(200).json({
			status: true,
			message: message,
			data: data
		});
	},

	// 201 CREATED
	successCreated: (res, message, data = null) => {
		return res.status(200).json({
			status: true,
			message: message,
			data: data
		});
	},

	errorJoiValidation: (res, error) => {
		const detailError = error.details.map(x => {return x.message;});
    
		return res.status(400).json({
			status: false,
			message: "Validation error",
			error: detailError
		});
	},

	// 400 BAD REQUEST
	errorBadRequest: (res, error, detail = null) => {
		return res.status(400).json({
			status: false,
			message: error,
			error: detail
		});
	},

	// 401 UNAUTHORIZED
	errorUnauthorized: (res, error, detail = null) => {
		return res.status(401).json({
			status: false, 
			message: error,
			error: detail
		});
	},

	// 422 Unprocessable Entity
	errorEntity: (res, error, detail = null) => {
		return res.status(422).json({
			status: false, 
			message: error,
			error: detail
		});
	}
};