import { NgModule } from '@angular/core' ;
import { NgZorroAntdModule } from 'ng-zorro-antd' ;
import { SharedModule } from '@shared/shared.module' ;
import { RouterModule , Routes } from '@angular/router' ;
import { TypeComponent } from './type/type.component';
import { ListComponent } from './list/list.component';

const routes: Routes = [
	{ path: 'type' , component : TypeComponent , data : { title: '图片类型'}},
	{ path: 'list' , component : ListComponent , data : { title: '图片列表'}},
];

const component = [
	TypeComponent ,
	ListComponent
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
export class GalleryModule {
}
