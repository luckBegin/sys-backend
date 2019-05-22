import { HttpParams } from '@angular/common/http';

export const ObjToQuery = function(obj: Object) {
	let para = new HttpParams();
	for (let keys in obj) {
		let val = obj[keys];
		if ( val !== '' && val !== null && val !== 'null' && val !== 'undefined' && val !== undefined )
			para = para.set(keys, val);
	}

	return para;
};
