import { Component, OnInit } from '@angular/core';
import { SysMenuService } from '../../../service/system/menu.service';
import { ENUM, RESPONSE } from '../../../models';
import { MsgService } from '../../../service/msg/msg.service';
import { AdaptorUtils } from '@shared/utils';
import { ngIfAnimation } from '../../../routes/router-animation';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Service } from '../../../../decorators/service.decorator';
import { combineLatest } from 'rxjs';

@Component({
	selector: 'sys-menu',
	templateUrl: './menu.component.html',
	styleUrls: ['./menu.component.less'],
	animations: [ngIfAnimation],
})
export class MenuComponent implements OnInit {
	constructor(
		private service: SysMenuService,
		private msg: MsgService,
		private fb: FormBuilder,
	){};

	ngOnInit(): void {
		this.getList();
	};

	menuList: any[] = [];

	loading: boolean = true;

	hHeight: number = document.body.clientHeight - 204;

	menuShow: boolean = false;

	mouseHeight: number = 30;

	currentItem: any;

	isVisible: boolean = false;

	infoBoxShow: boolean = false;

	editMark: boolean = false;

	form: FormGroup = this.fb.group({
		'name' : [null , [Validators.required ]] ,
		'path' : [ null ] ,
		'iconClass': ['anticon anticon-appstore', [ Validators.required ]],
		"id" : [ null ] ,
		"parentId" : [null ]
	});


	getList() {
		this.service.getMenuTree({ id : '1,2,3'})
			.subscribe((res: RESPONSE) => {
				this.menuList = AdaptorUtils.makeTreeNode({ title: 'name', key: 'id' }, res.data);
				this.loading = false;
			});
	};

	add(isParent: boolean) {
		this.menuShow = false;
		this.form.reset();
		this.infoBoxShow = true;
		this.editMark = false;

		this.form.patchValue({ iconClass: 'anticon anticon-appstore'} ) ;

		if (isParent)
			this.form.patchValue({ id: 0 });
		else {
			const pid =  this.currentItem.key ;
			this.form.patchValue({ parentId: pid });
		}
	};

	edit(): void {
		this.menuShow = false;

		this.infoBoxShow = true;

		this.editMark = true;

		this.currentItem.origin.isButton += "" ;

		this.form.patchValue(this.currentItem.origin);

		let controlArr = < FormArray >this.form.controls['menuDescriptionVOS'] ;
		controlArr.patchValue(this.currentItem.origin.menuDescriptions) ;
	};

	del(): void {
		this.menuShow = false;
		this.isVisible = true;
		this.form.patchValue({ id: this.currentItem.key });
	};

	showMenu($event) {
		this.mouseHeight = $event.event.pageY - 70;
		this.menuShow = true;
		this.currentItem = $event.node;
	};

	@Service('service.delete', true , function(){
		return ( this as MenuComponent ).form.value
	})
	modalConfirm( $event: MouseEvent ) {
		this.msg.success('删除成功');
		this.isVisible = false;
		this.getList();
	};

	@Service('service.post', true, function(){
		return ( this as MenuComponent ).form.value
	})
	makeNew($event: Event): void {
		this.msg.success("新建菜单成功") ;
		this.infoBoxShow = false ;
		this.getList() ;
	};

	@Service('service.put', true,function(){
		return ( this as MenuComponent ).form.value ;
	})
	save($event: MouseEvent): void {
		this.msg.success("修改成功") ;
		this.infoBoxShow = false ;
		this.getList() ;
	};
}

