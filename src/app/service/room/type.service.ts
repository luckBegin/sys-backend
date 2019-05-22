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

	@GET(API.room.type)
	get(obj ?: Object): any {
	};

	@GET(API.room.type + '/all')
	getAll(): any {
	};

	@POST(API.room.type)
	post(data: object): any {
	};

	@DELETE(API.room.type)
	delete(data: any): any {
	}

	@PUT(API.room.type)
	put(data: object): any {
	};
}
