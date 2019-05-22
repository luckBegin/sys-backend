import {Injectable } from "@angular/core";
import { API } from '../API';
import { HttpClient } from '@angular/common/http';
import { MsgService } from '../msg/msg.service';
import { GET , DELETE , POST , PUT } from '../../../decorators/request.decorator';

@Injectable({providedIn: 'root'})
export class TypeService{
	constructor(
		private http : HttpClient ,
		private msg : MsgService
	){}
	
	@GET(API.vip.type)
	get(obj ?: Object): any{};
	
	@POST(API.vip.type)
	post(data: object): any{};
	
	@DELETE(API.vip.type)
	delete(data : any ): any{}
	
	@PUT(API.vip.type)
	put(data: object): any{};
	
	@GET(API.vip.type + '/all')
	getAll(): any{} ;
}
