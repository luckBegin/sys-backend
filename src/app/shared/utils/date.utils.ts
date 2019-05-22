class DateDeal {
	static isDateStr(timeStamp: string): boolean {
		const reg = /^\d{4}-\d{2}-\d{2}$/g;

		return reg.test(timeStamp);
	};

	static transtoTimeStamp = function(dataStr: string | number | Date) {
		if ( DateDeal.isDateStr(dataStr as string) )
			return (new Date(dataStr)).getTime();

		if ( dataStr instanceof Date )
			return dataStr.getTime();

		return dataStr;
	};

	static fixZero(str: any) {
		const reg = /^\d{1}$/;
		if ( reg.test(str) ) {
			return '0' + str;
		} else {
			return str;
		}
	};

	getNow(timeStamp: boolean = true, format: string = 'y-m-d h:i:s') {
		const _stamp = Date.now();
		return timeStamp ? _stamp : this.format(_stamp, format);
	};

	toTimeStamp = DateDeal.transtoTimeStamp;

	format(dateStr: any, format: string = 'y-m-d h:i:s') {


		if ( !dateStr )
			return null;

		const isStamp = /^\d+$/g;

		let _date = null;

		const _arr = [];

		for (let code of format) {
			_arr.push(code.toUpperCase());
		}


		if ( isStamp.test(dateStr) ) {
			_date = new Date();
			_date.setTime(Number(dateStr));
		} else {
			_date = new Date(dateStr);
		}

		let dateObj = {
			Y: _date.getFullYear(),
			M: DateDeal.fixZero(_date.getMonth() + 1),
			D: DateDeal.fixZero(_date.getDate()),
			H: DateDeal.fixZero(_date.getHours()),
			I: DateDeal.fixZero(_date.getMinutes()),
			S: DateDeal.fixZero(_date.getSeconds()),
		};

		let __arr = [];

		_arr.forEach((item) => {
			let val = dateObj[item];
			val ? __arr.push(val) : __arr.push(item);
		});

		return __arr.join('');
	};

	getTimeZone(timeZone: any, format: string = 'y-m-d h:i:s', timeStamp: any = Date.now()) {

		if ( timeZone )
			return null;

		const date = new Date();

		const len = Number(timeStamp);

		const offset = date.getTimezoneOffset() * 60000;

		const utcTime = len + offset;

		const raw = this.format(timeStamp, format);

		const _stamp = Number(utcTime) + Number(3600000) * Number(timeZone);

		const target = this.format(_stamp, format);

		return {
			raw: raw,
			target: target,
		};
	};

	campare(start: string | number, end: string | number = Date.now()): boolean {
		const start_date = DateDeal.transtoTimeStamp(start);
		const end_date = DateDeal.transtoTimeStamp(end);
		return end_date > start_date;
	};
};
export const DateUtils = new DateDeal();
