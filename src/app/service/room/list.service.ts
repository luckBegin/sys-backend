import { Injectable } from '@angular/core';
import { API } from '../API';
import { HttpClient } from '@angular/common/http';
import { MsgService } from '../msg/msg.service';
import { GET, DELETE, POST, PUT } from '../../../decorators/request.decorator';
import { ENUM } from '../../models';
import { Observable } from 'rxjs';

const urlPrefix = API.room.list;

@Injectable({ providedIn: 'root' })
export class ListService {
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

	ENUM_Status(): Observable<ENUM[]> {
		return new Observable(obsr => {
			obsr.next([
				{ key: '置空', value: 0 },
				{ key: '预定', value: 1 },
				{ key: '待客', value: 2 },
				{ key: '清洁', value: 3 },
				{ key: '故障', value: 4 },
				{ key: '线上', value: 5 },
				{ key: '计时', value: 6 },
				{ key: '预买', value: 7 },
				{ key: '买断', value: 8 },
			]);
		});
	}
}
