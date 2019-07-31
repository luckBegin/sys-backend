import { NgModule } from '@angular/core' ;
import { NgZorroAntdModule } from 'ng-zorro-antd' ;
import { SharedModule } from '@shared/shared.module' ;
import { RouterModule , Routes } from '@angular/router' ;
import {TypeComponent} from "./type/type.component";
import {VipIntegralComponent} from "./vipIntegral/vipIntegral.component";

const routes: Routes = [
	{ path: 'type' , component : TypeComponent , data : { title: '会员类型'}},
	{ path: 'integral' , component : VipIntegralComponent , data : { title: '会员积分配置'}},
];

const component = [
	TypeComponent ,
	VipIntegralComponent
];

@NgModule({
	declarations: [
		...component,
	],
	imports: [
		SharedModule,
		NgZorroAntdModule,
		RouterModule.forChild(routes),
	],
	providers: [],
	bootstrap: [],
})
export class VipModule {
}
