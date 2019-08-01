import { Injectable } from '@angular/core' ;
import {MsgService} from "..";
import {HttpClient} from "@angular/common/http";
import {DELETE, GET, POST, PUT} from "../../../decorators/request.decorator";
import {API} from "../API";
import {Observable} from "rxjs";
import {RESPONSE} from "../../models";

@Injectable({ providedIn: "root"})
export class SysConfigService {
	constructor(
		private readonly msg: MsgService ,
		private readonly http: HttpClient ,
	){}
	
	@GET(API.system.config.list)
	get( query?: any) : Observable< RESPONSE > | any {} ;
	
	@POST(API.system.config.list)
	post( query?: any) : Observable< RESPONSE > | any {} ;
	
	@PUT(API.system.config.list)
	put( query?: any) : Observable< RESPONSE > | any {} ;
	
	@DELETE(API.system.config.list)
	delete( query?: any) : Observable< RESPONSE > | any {} ;
}
