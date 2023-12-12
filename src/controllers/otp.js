const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const {User} = require("../db/models");
const {JWT_SECRET_KEY} = process.env;
const mail = require("../utils/mail");
const otp = require("../utils/otp");
const respone = require("../utils/respone");

module.exports = {
	resendEmailVerfication: async (req, res, next) => {
		try {
			const {token} = req.query;
			const {email} = req.body;

			jwt.verify(token, JWT_SECRET_KEY, async (err) => {
				if(err){
					if(err.name != "TokenExpiredError"){
						return respone.errorUnauthorized(res, err.name, err.message);	
					}
				}

				const user = await User.findOne({where: {email: email}});
				if(user.email_verified == true){
					return respone.errorBadRequest(res, "user already verified");
				}

				const otpCode = otp.generateOTP();

				const payload = {
					email: user.email,
					otp: otpCode
				};
			
				const token = jwt.sign(payload, JWT_SECRET_KEY, {expiresIn: "5m"});
				const url = `${req.protocol}://${req.get("host")}/register/verifyAccount?token=${token}`;

				mail.sendEmailVerification({fullname: user.fullname, email: user.email, otp: otpCode, url});

				return respone.successOK(res, "success resend email", {email, token});
				
			});
		} catch (error) {
			next(error);
		}
	},

	verifyAccount: async (req, res, next) => {
		try {
			const {token} = req.query;

			const data = jwt.verify(token, JWT_SECRET_KEY);
			if(!data.email || !data.otp){
				return respone.errorUnauthorized(res, "invalid token");
			}

			const user = await User.findOne({where: {email: data.email}});

			if (user.email_verified == true){
				return respone.errorBadRequest(res, "user already verify");
			}

			const {otp} = req.body;
			if(!otp) {
				return respone.errorBadRequest(res, "missing otp input");
			}

			// check otp input and otp in token
			if (otp != data.otp){
				return respone.errorBadRequest(res, "invalid otp", "otp not matched");
			}

			const updated = await User.update({email_verified: true},{where: {email: data.email}});

			if(updated[0] == 0){
				return respone.errorBadRequest(res, "verify account failed");
			}

			return respone.successOK(res, "verify account success, now you can login with this email");

		} catch (error) {
			if(error.name == "TokenExpiredError"){
				return respone.errorBadRequest(res, "jwt expired", "jwt expired");
			}
			next(error);
		}
	},

	resetPassword: async (req, res, next) => {
		try {
			const {token} = req.query;
			const {new_password} = req.body;

			const data = jwt.verify(token, JWT_SECRET_KEY);
			
			const hashPassword = await bcrypt.hash(new_password, 10);
			
			await User.update({password: hashPassword}, {where: {email: data.email}});

			return respone.successOK(res, "success reset password");

		} catch (error) {
			if(error.name == "TokenExpiredError"){
				return respone.errorUnauthorized(res, "jwt expired", "jwt expired");
			}
			next(error);
		}
	}
};