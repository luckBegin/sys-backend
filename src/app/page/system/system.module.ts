import { NgModule } from '@angular/core' ;
import { NgZorroAntdModule } from 'ng-zorro-antd' ;
import { SharedModule } from '@shared/shared.module' ;
import { RouterModule , Routes } from '@angular/router' ;
import { DepartComponent } from './depart/depart.component';
import { RoleComponent } from './role/role.component';
import { MenuComponent } from './menu/menu.component';
import { StaffComponent } from './staff/staff.component';
import { ShopComponent } from './shop/shop.component';

const routes: Routes = [
	{ path: 'depart', component: DepartComponent, data: { title: '部门配置' }},
	{ path: 'role', component: RoleComponent, data: { title: '角色配置'} },
	{ path: 'menu', component: MenuComponent, data: { title: '菜单配置'} },
	{ path: 'staff', component: StaffComponent, data: { title: '管理员配置' } },
	{ path: 'shop', component: ShopComponent, data: { title: '店铺配置'} },
];

const component = [
	DepartComponent,
	RoleComponent,
	MenuComponent,
	StaffComponent,
	ShopComponent,
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
export class SystemModule {
}
