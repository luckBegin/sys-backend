import {Component, Inject} from '@angular/core';
import {Router} from '@angular/router';
import {SettingsService} from '@delon/theme';
import {DA_SERVICE_TOKEN, ITokenService} from '@delon/auth';
import {SesssionStorageService} from '../../../../service/storage';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Before, CombineAll} from '../../../../../decorators/function.decorator';
import {Observable} from 'rxjs';
import {MsgService} from '../../../../service/msg/msg.service';
import {StaffService} from '../../../../service/system';

@Component({
	selector: 'header-user',
	template: `
		<nz-dropdown nzPlacement="bottomRight">
			<div class="alain-default__nav-item d-flex align-items-center px-sm" nz-dropdown>
				<nz-avatar [nzSrc]="settings.user.avatar" nzSize="small" class="mr-sm"></nz-avatar>
				{{settings.user.name}}
			</div>
			<div nz-menu class="width-sm">
				<div nz-menu-item (click)="changePassWord()"><i nz-icon type="user" class="mr-sm"></i>
					修改密码
				</div>
				<!--<div nz-menu-item routerLink="/pro/account/settings"><i nz-icon type="setting" class="mr-sm"></i>-->
				<!--个人设置-->
				<!--</div>-->
				<!--<li nz-menu-divider></li>-->
				<div nz-menu-item (click)="logout()"><i nz-icon type="logout" class="mr-sm"></i>
					退出登录
				</div>
			</div>
		</nz-dropdown>


		<nz-modal [(nzVisible)]="formVisible" [nzTitle]="formTitle" [nzContent]="formContent" [nzFooter]="formFooter"
				  (nzOnCancel)="formVisible = false">
			<ng-template #formTitle>
				修改密码
			</ng-template>

			<ng-template #formContent>

				<form nz-form [nzLayout]="'inline'" [formGroup]="form">
					<nz-form-item class='c-formSec'>
						<nz-form-label [nzSm]="9" nzRequired nzFor="projectType">输入新密码</nz-form-label>
						<nz-form-control [nzSm]="14" [nzOffset]='1'>
							<input nz-input formControlName="password" id="password" placeholder="请输入新密码">
							<nz-form-explain *ngIf="form.get('password').dirty && form.get('password').errors">新密码不能为空
							</nz-form-explain>
						</nz-form-control>
					</nz-form-item>

					<nz-form-item class='c-formSec'>
						<nz-form-label [nzSm]="9" nzRequired nzFor="passwordAgain">再次输入新密码</nz-form-label>
						<nz-form-control [nzSm]="14" [nzOffset]='1'>
							<input nz-input formControlName="passwordAgain" id="passwordAgain" placeholder="请再次输入新密码">
							<nz-form-explain
									*ngIf="form.get('passwordAgain').dirty && form.get('passwordAgain').errors">新密码不能为空
							</nz-form-explain>
						</nz-form-control>
					</nz-form-item>

				</form>
			</ng-template>

			<ng-template #formFooter>
				<button nz-button nzType="primary" (click)="send($event)" [disabled]="!form.valid">确定</button>
				<button nz-button nzType="default" (click)="formVisible = false">取消</button>
			</ng-template>
		</nz-modal>

	`,
})
export class HeaderUserComponent {
	constructor(
		public settings: SettingsService,
		private router: Router,
		@Inject(DA_SERVICE_TOKEN) private tokenService: ITokenService,
		private ss: SesssionStorageService,
		private fb: FormBuilder,
		private msg: MsgService,
		private staffSer: StaffService
	) {
	}

	logout() {
		this.tokenService.clear();
		this.ss.clear();
		this.router.navigate(['/passport/login']);
	};

	formVisible: boolean = false;

	form: FormGroup = this.fb.group({
		password: [null, [Validators.required]],
		passwordAgain: [null, [Validators.required]]
	});


	changePassWord() {
		this.formVisible = true;
		this.form.reset();
	};

	@Before(function ($event) {
		return new Observable(obsr => {
			const value = this.form.value;

			if ( value.password != value.passwordAgain ) {
				this.msg.warn("两次输入的密码不一致");
				return;
			}
			;

			obsr.next("success");
		});
	})
	@CombineAll()
	send($event) {
		const obj = {};
		obj['password'] = this.form.value.password;
		obj['id'] = this.ss.get('loginInfo')['id'];
		(<any>this.staffSer.put(obj))
			.subscribe(data => {
				this.msg.success("修改成功");
				this.formVisible = false;
			})
	};
}
