import { NgModule } from '@angular/core' ;
import { NgZorroAntdModule } from 'ng-zorro-antd' ;
import { SharedModule } from '@shared/shared.module' ;
import { RouterModule , Routes } from '@angular/router' ;
import { TypeComponent } from './type/type.component';
import { AreaComponent } from './area/area.component';
import { ListComponent } from './list/list.component';
import {TimeComponent} from "./time/time.component";
import {PriceComponent} from "./price/price.component";

const routes: Routes = [
	{ path: 'type' , component : TypeComponent , data : { title: '房台类型'}},
	{ path: 'area' , component : AreaComponent , data : { title: '房台区域'}},
	{ path: 'list' , component : ListComponent , data : { title: '房台列表'}},
	{ path: 'time' , component : TimeComponent , data : { title: '房台时段'}},
	{ path: 'price' , component : PriceComponent , data : { title: '房台时段价格'}},
];

const component = [
	TypeComponent ,
	AreaComponent ,
	ListComponent ,
	TimeComponent ,
	PriceComponent
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
export class RoomModule {}
