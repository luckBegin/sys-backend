import { Injectable } from '@angular/core';
import { API } from '../API';
import { HttpClient } from '@angular/common/http';
import { MsgService } from '../msg/msg.service';
import { GET, DELETE, POST, PUT } from '../../../decorators/request.decorator';

const urlPrefix = API.room.price;

@Injectable({ providedIn: 'root' })
export class PriceService {
	constructor(
		private http: HttpClient,
		private msg: MsgService,
	) {
	}

	@GET(urlPrefix)
	get(obj ?: Object): any {
	};

	@GET(urlPrefix + '/all')
	getAll(): any {
	};

	@POST(urlPrefix)
	post(data: object): any {
	};

	@DELETE(urlPrefix)
	delete(data: any): any {
	}

	@PUT(urlPrefix)
	put(data: object): any {
	};
}
