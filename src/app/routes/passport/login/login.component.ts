import { SettingsService, _HttpClient } from '@delon/theme';
import { Component, OnDestroy, Inject, Optional } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NzMessageService, NzModalService } from 'ng-zorro-antd';
import {
  SocialService,
  TokenService,
  DA_SERVICE_TOKEN,
} from '@delon/auth';
import { ReuseTabService } from '@delon/abc';
import { StartupService } from '@core/startup/startup.service';
import { StaffService } from '../../../service/system';
import { SesssionStorageService } from '../../../service/storage';
import { GLOBAL_CONFIG } from '@shared/GLOBAL.config';
import * as md5 from 'md5' ;

@Component({
	selector: 'passport-login',
	templateUrl: './login.component.html',
	styleUrls: ['./login.component.less'],
	providers: [SocialService],
})
export class UserLoginComponent implements OnDestroy {
	form: FormGroup;
	error = '';
	type = 0;

	constructor(
		fb: FormBuilder,
		modalSrv: NzModalService,
		public msg: NzMessageService,
		private router: Router,
		private settingsService: SettingsService,
		private socialService: SocialService,
		@Optional()
		@Inject(ReuseTabService)
		private reuseTabService: ReuseTabService,
		@Inject(DA_SERVICE_TOKEN) private tokenService: TokenService,
		private startupSrv: StartupService,
		public http: _HttpClient,
		private staffSer : StaffService ,
		private ss : SesssionStorageService
	) {
		this.form = fb.group({
		userName: [null, [ Validators.required ]],
		password: [null, Validators.required],
		mobile: [null, [ Validators.required, Validators.pattern(/^1\d{10}$/)]],
		captcha: [null, [ Validators.required ] ],
		remember: [true],
	});
		modalSrv.closeAll();
	}

  // #region fields

	get userName() {
		return this.form.controls.userName;
	}
	get password() {
		return this.form.controls.password;
	}
	get mobile() {
		return this.form.controls.mobile;
	}
	get captcha() {
		return this.form.controls.captcha;
	}

  // #endregion

	switch(ret: any) {
		this.type = ret.index;
	}

	copyRight: string = GLOBAL_CONFIG.copyRight ;
  // #region get captcha

	count = 0;
	interval$: any;
	loading : boolean = false ;
	getCaptcha() {
		if (this.mobile.invalid) {
			this.mobile.markAsDirty({ onlySelf: true });
			this.mobile.updateValueAndValidity({ onlySelf: true });
			return;
		}

		this.count = 59;
		this.interval$ = setInterval(() => {
			this.count -= 1;
			if (this.count <= 0) clearInterval(this.interval$);
		}, 1000);
	}

	// #endregion
	submit() {
		this.error = '';
		if (this.type === 0) {
			this.userName.markAsDirty();
			this.userName.updateValueAndValidity();
			this.password.markAsDirty();
			this.password.updateValueAndValidity();
			if (this.userName.invalid || this.password.invalid) return;
		} else {
			this.mobile.markAsDirty();
			this.mobile.updateValueAndValidity();
			this.captcha.markAsDirty();
			this.captcha.updateValueAndValidity();
			if (this.mobile.invalid || this.captcha.invalid) return;
		}

	// 默认配置中对所有HTTP请求都会强制 [校验](https://ng-alain.com/auth/getting-started) 用户 Token
	// 然一般来说登录请求不需要校验，因此可以在请求URL加上：`/login?_allow_anonymous=true` 表示不触发用户 Token 校验

		const formData = new FormData() ;
		formData.append("username" , this.userName.value ) ;
		formData.append("password" , this.password.value ) ;
		// this.getMenu(3) ;
		// this.loading = !this.loading ;
		//
		this.staffSer.login( { username : this.userName.value , password : md5(this.password.value)})
			.subscribe( ( res : any ) => {
				this.loading = false ;
				this.ss.set('loginInfo' , res.data.userInfo) ;
		
				const menuInfo = res.data.menuInfo.filter( item => item.id === 1 ) ;
				this.ss.set("menuInfo" , menuInfo[0].children) ;
				this.ss.set("token" , res.data.token.value) ;
				this.ss.set("shopInfo" , res.data.shopInfo) ;
				this.router.navigate(['/']) ;
				this.reuseTabService.clear();
				// this.getMenu(res.data.id) ;
				// this.startupSrv.load().then(() => this.router.navigate(['/']));
				} , err => {
				this.msg.error( err ) ;
				this.loading = false ;
			});

	// this.http
	//   .post('/login/account?_allow_anonymous=true', {
	//     type: this.type,
	//     userName: this.userName.value,
	//     password: this.password.value,
	//   })
	//   .subscribe((res: any) => {
	//     if (res.msg !== 'ok') {
	//       this.error = res.msg;
	//       return;
	//     }
	//     // 清空路由复用信息
	//     this.reuseTabService.clear();
	//     // 设置用户Token信息
	//     this.tokenService.set(res.user);
	//     // 重新获取 StartupService 内容，我们始终认为应用信息一般都会受当前用户授权范围而影响
	//     this.startupSrv.load().then(() => this.router.navigate(['/']));
	//   });
	}
	ngOnDestroy(): void {
		if (this.interval$) clearInterval(this.interval$);
	};
}
