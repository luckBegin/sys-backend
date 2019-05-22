import {Injectable } from "@angular/core";
import { API } from '../API';
import { HttpClient } from '@angular/common/http';
import { MsgService } from '../msg/msg.service';
import { GET , DELETE , POST , PUT } from '../../../decorators/request.decorator';

@Injectable({providedIn: 'root'})
export class RoleService{
	constructor(
		private http : HttpClient ,
		private msg : MsgService
	){}

	@GET(API.system.role.list)
	getList(obj ?: Object): any{};

	@POST(API.system.role.list)
	post(data: object): any{};

	@DELETE(API.system.role.list)
	delete(data : any ): any{}

	@PUT(API.system.role.list)
	put(data: object): any{};
}
