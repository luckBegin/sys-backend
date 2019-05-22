import { Storage } from './basic' ;
import { Injectable } from '@angular/core';

@Injectable({
	providedIn: 'root',
})
export class SesssionStorageService extends Storage {
	constructor() {
		super(window.sessionStorage);
	};
};
