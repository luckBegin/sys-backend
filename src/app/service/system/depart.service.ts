import { Injectable } from '@angular/core' ;
import { HttpClient, HttpHeaders } from '@angular/common/http' ;
import { API } from '../API';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class DepartService {
	constructor(
		private http: HttpClient,
	) {
	};

	get() {
		const url = API.system.depart.list;
		return this.http.get(url);
	};

	post(departObj: object) {
		const url = API.system.depart.opera;
		let postData = departObj;
		return this.http.post(url, postData);
	};

	put(departObj: object) {
		const url = API.system.depart.opera;

		const postData = departObj;

		const header = new HttpHeaders()
			.set('Content-type', 'application/json');

		return this.http.put(url, postData, {
			headers: header,
		});
	};

	delete(data: { id: number }) {
		const url = API.system.depart.opera + '/' + data.id;
		return this.http.delete(url);
	}
};
