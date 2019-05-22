import { Component, OnInit } from '@angular/core';
import { SettingsService } from '@delon/theme';
import { LocalStorageService, SesssionStorageService } from '../../../service/storage';
import { ENUM } from '../../../models';
import { AdaptorUtils } from '@shared/utils';
import { ShopService } from '../../../service/system';

@Component({
	selector: 'layout-header',
	templateUrl: './header.component.html',
})
export class HeaderComponent implements OnInit{
	searchToggleStatus: boolean;

	constructor(
		public settings: SettingsService,
		private ls: LocalStorageService,
		private ss: SesssionStorageService ,
		private shopSer: ShopService
	) {};

	ngOnInit(): void {
		this.ENUM_Shops = AdaptorUtils.reflect( this.ss.get('shopInfo') , { name : 'key' , id :  'value'}) ;
		this.selectShop = this.ENUM_Shops[0].value as number;
		this.ss.set("selectShopId" , this.selectShop ) ;
	}

	toggleCollapsedSidebar() {
		this.settings.setLayout('collapsed', !this.settings.layout.collapsed);
	};

	searchToggleChange() {
		this.searchToggleStatus = !this.searchToggleStatus;
	};

	weekColor() {
		const bodyEle = document.querySelector('body') as HTMLBodyElement;
		const reg = /^weekColor$/g;
		if ( reg.test(bodyEle.className) ) {
			bodyEle.className = '';
			this.ls.set('weekColor', 'false');
		} else {
			bodyEle.className = 'weekColor';
			this.ls.set('weekColor', 'true');
		}

	};

	ENUM_Shops:ENUM[] ;
	selectShop: number ;

	shopChange( $event:any ):void {
		this.ss.set("selectShopId" , $event ) ;
		this.shopSer.shopChanged$.next( { shopId: $event }) ;
	};
}
