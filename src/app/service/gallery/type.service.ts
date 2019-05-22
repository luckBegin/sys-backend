import { Injectable } from '@angular/core';
import { API } from '../API';
import { HttpClient } from '@angular/common/http';
import { MsgService } from '../msg/msg.service';
import { GET, DELETE, POST, PUT } from '../../../decorators/request.decorator';

@Injectable({ providedIn: 'root' })
export class TypeService {
	constructor(
		private http: HttpClient,
		private msg: MsgService,
	) {
	}

	@GET(API.gallery.type)
	get(obj ?: Object): any {
	};

	@GET(API.gallery.type + '/all')
	getAll(): any {
	};

	@POST(API.gallery.type)
	post(data: object): any {
	};

	@DELETE(API.gallery.type)
	delete(data: any): any {
	}

	@PUT(API.gallery.type)
	put(data: object): any {
	};
}
