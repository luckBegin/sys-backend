import { Injectable, OnInit } from '@angular/core';
import { HttpInterceptor, HttpHandler, HttpRequest, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { MsgService } from '../service/msg/msg.service' ;
import { SesssionStorageService } from '../service/storage';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

@Injectable()
export class HttpIntercept implements HttpInterceptor {
	constructor(
		private router: Router,
		private msg: MsgService,
		private sgo: SesssionStorageService,
	) {
	}

	intercept(req: HttpRequest<any>, next: HttpHandler): any {
		let headers = {};
		let obj = {
			// 'withCredentials': true ,
			setParams: {},
		};

		const token = this.sgo.get('token');
		if ( token ) {
			headers['jwt-token'] = token;
		}

		const loginInfo = this.sgo.get("loginInfo") ;
		
		if( loginInfo ) {
			headers['jwt-user-id'] = loginInfo.id.toString() ;
		}
		const shopId = this.sgo.get('selectShopId');
		if ( shopId ) {
			headers['jwt-shop'] = shopId.toString();

			if ( req.method === 'GET' ) {
				obj.setParams['shopId'] = shopId;
			}

			if ( req.method === 'POST' ) {
				if(!req.body['shopId'])
					req.body['shopId'] = shopId;
			}
		}

		obj['headers'] = new HttpHeaders(headers);

		req = req.clone(obj);

		return next.handle(req)
			.pipe(
				catchError((err: any) => {
					if ( err.status === 0 ) {
						this.msg.error(err.message);
					}
					if ( err.status === 401 ) {
						this.msg.error('登录失效,请重新登录');
						this.router.navigate(['/passport/login']);
					}
					if ( err.status === 302 ) {
						this.msg.error('登录失效,请重新登录');
						this.router.navigate(['/passport/login']);
					}
					if ( err.status === 500 ) {
						this.msg.error('服务器挂了,请联系开发');
						this.router.navigate(['/500']);
					}

					if ( err.status === 404 ) {
						this.msg.error('页面在来的路上走丢了');
						this.router.navigate(['/404']);
					}

					if ( err.status === 403 ) {
						this.msg.error('管理员告诉我你没权限访问这个');
						this.router.navigate(['/403']);
					}

					return throwError(err);
				}),
			);
	};
}
