const nodemailer = require("../config/nodemailer");
const ejs = require("ejs");
const path = require("path");

const templateDirectory = `${__dirname}/../templates/`;

module.exports = {
	sendEmailVerification: async (data) => {
		try {
			const templateEmail = await ejs.renderFile(path.join(templateDirectory, "emailVerifiaction.ejs"), data);
			await nodemailer.sendMail(data.email, "Account Verification", templateEmail);
		} catch (error) {
			console.error(error);
		}
	},
	sendForgotPassword: (data) => {
		// eslint-disable-next-line no-async-promise-executor
		return new Promise (async (resolve, reject) => {
			try {
				const templateEmail = await ejs.renderFile(path.join(templateDirectory, "forgotPassword.ejs"), data);
				await nodemailer.sendMail(data.email, "Forgot Password", templateEmail);
				return resolve();
			} catch (error) {
				return reject(error);
			}
		});
	},
	sendInvoice: async (data) => {
		try {
			const templateEmail = await ejs.renderFile(path.join(templateDirectory, "invoice.ejs"), data);
			await nodemailer.sendMail(data.user.email, "Invoice", templateEmail);
		} catch (error) {
			console.error(error);
		}
	}
};