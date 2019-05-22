import { Component } from '@angular/core';
import { GLOBAL_CONFIG } from '@shared/GLOBAL.config';

@Component({
	selector: 'layout-passport',
	templateUrl: './passport.component.html',
	styleUrls: ['./passport.component.less'],
})
export class LayoutPassportComponent {
	title: string = GLOBAL_CONFIG.title;
	subTitle: string = GLOBAL_CONFIG.subTitle ;
}
