import { Injectable } from '@angular/core' ;
import { HttpClient, HttpHeaders } from '@angular/common/http' ;
import { API } from '../API';
import { DELETE, GET, POST, PUT } from '../../../decorators/request.decorator';
import { ENUM } from '../../models';
import { Observable, Subject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ShopService {
	constructor(
		private http: HttpClient,
	) {};

	@GET(API.system.shop , "获取店铺列表失败,原因:")
	get( query: any ): any {};

	@GET(API.system.shop +'/all', "获取店铺枚举失败,原因:")
	getAll(): any {};

	@POST(API.system.shop  , true , "新增失败,原因:")
	post( data: any ): any {};

	@PUT(API.system.shop  , false , "修改失败,原因:")
	put( data: any ): any {};

	@DELETE(API.system.shop)
	delete(data: any): any{}

	ENUM_ShopType(): Observable< ENUM[] > {
		return new Observable( obsr => {
			obsr.next( [
				{ key : "总店" , value : 1 } ,
				{ key : "旗舰店" , value : 2 } ,
				{ key : "分店" , value : 3 } ,
			])
		});
	}
	shopChanged$ : Subject<any> = new Subject() ;
}
