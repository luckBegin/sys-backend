import { NgModule } from '@angular/core' ;
import { NgZorroAntdModule } from 'ng-zorro-antd' ;
import { SharedModule } from '@shared/shared.module' ;
import { RouterModule , Routes } from '@angular/router' ;
import { PaymentComponent } from "./payment/payment.component";

const routes: Routes = [
	{ path: 'payment' , component : PaymentComponent , data : { title: '结账储值方式'}},
];

const component = [
	PaymentComponent
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
export class BasicModule {
}
