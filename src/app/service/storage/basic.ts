export class Storage {
	constructor(storageObj: Object) {
		this.storage = storageObj;
	};

	storage: Object;

	private typeCheck: Function = (type: string, obj: any): boolean => {
		return Object.prototype.toString.call(obj) === '[object ' + type + ']';
	};

	set(key: string, value: Array<any> | Object | number | string | boolean): Storage {

		if ( this.typeCheck('String', value) ) {
			this.storage[key] = value;
		} else {
			this.storage[key] = JSON.stringify(value);
		}

		return this;
	};

	get(key: string): any {
		const value = this.storage[key];
		try {
			return JSON.parse(value);
		} catch (e) {
			return value;
		}
	};

	clear(): Storage {
		this.storage['clear']();
		return this;
	};

	remove(list: Array<String>): Storage {
		for (var key in list) {
			this.storage['removeItem'](list[key]);
		}

		return this;
	};
}
