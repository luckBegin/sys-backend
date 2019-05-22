import { Storage } from './basic' ;
import { Injectable } from '@angular/core' ;

@Injectable({
	providedIn: 'root',
})
export class LocalStorageService extends Storage {
	constructor() {
		super(window.localStorage);
	}
};
