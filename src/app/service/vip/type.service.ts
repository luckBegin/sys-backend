import {Injectable } from "@angular/core";
import { API } from '../API';
import { HttpClient } from '@angular/common/http';
import { MsgService } from '../msg/msg.service';
import { GET , DELETE , POST , PUT } from '../../../decorators/request.decorator';
import {Observable} from "rxjs";
import {RESPONSE} from "../../models";

@Injectable({providedIn: 'root'})
export class TypeService{
	constructor(
		private http : HttpClient ,
		private msg : MsgService
	){}
	
	@GET(API.vip.type)
	get(obj ?: Object): Observable< RESPONSE >| any{};
	
	@POST(API.vip.type)
	post(data: object): Observable< RESPONSE >| any{};
	
	@DELETE(API.vip.type)
	delete(data : any ): Observable< RESPONSE >| any{}
	
	@PUT(API.vip.type)
	put(data: object): Observable< RESPONSE >| any{};
	
	@GET(API.vip.type + '/all')
	getAll(): Observable< RESPONSE >| any{} ;
}
