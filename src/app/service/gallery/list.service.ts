import { Injectable } from '@angular/core';
import { API } from '../API';
import { HttpClient } from '@angular/common/http';
import { MsgService } from '../msg/msg.service';
import { GET, DELETE, POST, PUT } from '../../../decorators/request.decorator';
@Injectable({ providedIn: 'root' })
export class ListService {
	constructor(
		private http: HttpClient,
		private msg: MsgService,
	) {
	}

	@GET(API.gallery.list)
	get(obj ?: Object): any {
	};

	@POST(API.gallery.list, false)
	post(data: object): any {
	};

	@DELETE(API.gallery.list)
	delete(data: any): any {
	}

	@PUT(API.gallery.list)
	put(data: object): any {
	};
}
