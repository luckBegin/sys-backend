import { Component, OnInit } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd';
import { MenuService, SettingsService } from '@delon/theme';
import { filter, map } from 'rxjs/operators';
import { SesssionStorageService } from '../../../service/storage';

@Component({
	selector: 'layout-sidebar',
	templateUrl: './sidebar.component.html',
	styles : [`    
		::ng-deep .ant-menu-inline .ant-menu-submenu-title{
		padding-left: 20px !important;
		}
		::ng-deep .ant-menu-sub.ant-menu-inline{
		margin-left: 15px;
		}
	`]
})
export class SidebarComponent implements OnInit{
	constructor(
		public settings: SettingsService,
		public msgSrv: NzMessageService,
		private ss : SesssionStorageService ,
		private menuService : MenuService
	) { };

	ngOnInit(): void {
		this.collapsed() ;
		this.getMenu() ;
	};

	isCollapsed : boolean = false ;

	collapsed(): void{
		this.settings.notify
			.pipe(
				filter( ( data : any ) => data.type === 'layout' && data.name === 'collapsed') ,
				map( (data : any ) => data.value )
			)
			.subscribe( data => this.isCollapsed = data )
	};

	menu : any [] ;
	getMenu(){
		this.menu = this.ss.get("menuInfo") ;
		const _menu = [] ;
		recusive(this.menu , _menu) ;
		this.menuService.add(_menu);
	};
}

const recusive = function(data , arr){
	data.forEach( item => {
		const menuItem = {} ;

		menuItem['text'] = item.name ;

		menuItem['children'] = [] ;

		menuItem['link'] = item.path ;

		menuItem['icon'] = item.iconClass ;

		arr.push( menuItem ) ;

		if(item.children && item.children.length > 0){
			menuItem['group'] = true ;
			recusive( item.children , menuItem['children']) ;
		}else{
			menuItem['group'] = false ;
		}
	});
};
