const moment = require("moment-timezone");
const {TZ = "Asia/Jakarta"} = process.env; 

module.exports = {
	timeWithTimeZone: (time) => {
		return moment(time).tz(TZ).format("HH:mm");
	},

	dateToDatabaseFormat: (date) => {
		return moment(date).tz(TZ).format("YYYY-MM-DD HH:mm:ss.SSS");
	},

	databaseToDateFormat: (date) => {
		return moment(date).tz(TZ).format("DD MMMM YYYY HH:mm");
	},

	DurationToString: (duration) => {
		const parse = duration.split(":");
		let hour = +parse[0];
		let minute = +parse[1];

		if (hour == "01"){
			hour = `${hour} hour`;
		}else{
			hour = `${hour} hours`;
		}
        
		if (minute == "01"){
			minute = `${minute} minute`;
		}else{
			minute = `${minute} minutes`;
		}

		return `${hour} ${minute}`;
	},

	NumberToCurrency: (number) => {
		return new Intl.NumberFormat("id", {
			style: "currency",
			currency: "IDR"
		}).format(number).slice(0, -3);
	},

	capitalFirstLetter: (string) => {
		return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
	}
};