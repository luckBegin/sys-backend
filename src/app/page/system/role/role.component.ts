import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RoleService } from '../../../service/system/role.service';
import { MsgService } from '../../../service/msg/msg.service';
import { ShopService, SysMenuService } from '../../../service/system';
import { NzTreeComponent } from 'ng-zorro-antd';
import { RESPONSE } from '../../../models';
import { QueryModel } from './query.model';
import { Service } from '../../../../decorators/service.decorator';
import { AdaptorUtils } from '@shared/utils';
import { Before, CombineAll } from '../../../../decorators/function.decorator';
import { Observable } from 'rxjs';

@Component({
  selector: 'system-role',
  templateUrl: './role.component.html',
  styleUrls: ['./role.component.less'],
})
export class RoleComponent implements OnInit {
	constructor(
		private fb: FormBuilder,
		private msg: MsgService,
		private service: RoleService,
		private menuService: SysMenuService,
	) {} ;

	ngOnInit() {
		this.getAllMenu() ;
		this.getRoleList() ;
	};

	form: FormGroup = this.fb.group({
		'name': [ null, [Validators.required]],
		'remark': [ null ],
		'id': [ null ],
		'shopId' : [ null ]
	});

	tableData = {
		loading: true,
		page: 1,
		total : 0 ,
		columns: [
			{ title: '角色名', type: 'text', reflect: 'name' },
			{ title: '备注', type: 'text', reflect: 'remark' },
		],
		data: [],
		btn: {
			title: '操作',
			items: [{
				type: 'del',
				title: '删除',
				fn: (data) => {
					this.isVisible = true;
					this.form.patchValue(data);
				},
			}, {
				type: 'edit',
				title: '编辑',
				fn: (data) => {
					this.form.patchValue(data);
					this.editMark = true ;
					this.showEdit( data );
				},
			},],
		},
		change : (type : string , size : number ) => {
			if(type === 'size')
				this.queryModel.pageSize = size ;
			if(type === 'page'){
				this.tableData.page = size ;
				this.queryModel.currentPage = size ;
			}
			this.getRoleList();
		}
	};

	queryModel: QueryModel = new QueryModel;

	isVisible: boolean = false;

	selectRoles: string[] = [];

	editMark: boolean = false;

	infoBoxShow: boolean = false;

	menuTree: any[];

	raw_data : any[];

	@ViewChild('treeCom') treeCom: NzTreeComponent;

	showEdit( data: any) {
		let selectdKeys = data.menuIds.split(",") ;

		let _obj = [] ;

		this.menuTree.forEach( item => {
			_obj.push(new Tree(item, selectdKeys , null));
		});

		this.selectRoles = selectdKeys.map( item => item / 1 ) ;

		this.infoBoxShow = true ;

		this.menuTree = _obj ;
	};

	addNewRole() {
		this.form.reset();
		this.selectRoles = [];
		this.editMark = false;
		this.infoBoxShow = true;
	};


	getRoleList(): void {
		this.service.getList(this.queryModel)
		.subscribe((res: RESPONSE) => {
			this.tableData.loading = false;
			this.tableData.data = res.data;

			if(res.page)
			this.tableData.total = res.page.totalNumber ;
		});
	}

	@Service('service.delete', true, function(){
		return this.form.value ;
	})
	modalConfirm($event: Event) {
		this.msg.success('删除成功');
		this.isVisible = false;
		this.getRoleList();
	};

	@Before(function($event){
		const selectKeys = this.treeCom.nzTreeService.getSelectedNodeList() ;
		if(selectKeys.length === 0 )
			this.msg.warn("注意,创建的该角色未包含任何权限") ;

		return new Observable( obsr => {
			const _arr= [] ;

			selectId(selectKeys , _arr) ;

			obsr.next(_arr)
		})
	})
	@CombineAll()
	makeNew($event :Event, selectdRoles?: string[] ): void {
		const value = this.form.value ;
		value['menuIds'] = selectdRoles ;

		const ele = $event.target as HTMLButtonElement ;

		ele.disabled = true  ;

		this.service.post(value)
			.subscribe( ( res : RESPONSE) => {
				this.infoBoxShow = false ;
				this.msg.success('操作成功') ;
				this.getRoleList() ;
			})
	};

	@Before(function($event){
		const selectKeys = (this as RoleComponent).treeCom.nzTreeService.getSelectedNodeList() ;
		if(selectKeys.length === 0 )
			(this as RoleComponent).msg.warn("注意,创建的该角色未包含任何权限") ;

		return new Observable( obsr => {
			const _arr= [] ;
			selectId(selectKeys , _arr) ;
			obsr.next(_arr);
		});
	})
	@CombineAll()
	save($event : Event ,  selectdRoles?: string[]): void {
		const value = this.form.value ;
		value['menuIds'] = selectdRoles ;
		const ele = $event.target as HTMLButtonElement ;
		ele.disabled = true  ;
		this.service.put(value)
			.subscribe( ( res : RESPONSE) => {
				this.infoBoxShow = false ;
				ele.disabled = false ;
				this.msg.success('操作成功') ;
				this.getRoleList() ;
			})
	};

	getAllMenu(): void {
		this.menuService.getMenuTree( { id: "1,2,3" })
			.subscribe((res: RESPONSE) => {
				this.menuTree = AdaptorUtils.makeTreeNode({ title: 'name', key: 'id' }, res.data);
				this.raw_data = AdaptorUtils.makeTreeNode({ title: 'name', key: 'id' }, res.data) ;
			});
	};
}

const selectId = function(arr : any[] , tar : string[] ){
	arr.forEach( item => {
		if( tar.indexOf( item.key.toString() ) == - 1)
			tar.push(item.key.toString()) ;
	});
};
let Tree = function(option , selectKeys? ,  parent?){
	let _parent = this ;

	this.title = option.title || '---';

	this.key = option.key || null;

	this.parentNode = parent;

	// this.isSelected = (selectKeys && selectKeys.indexOf(option.key) ) > -1 ? true : false ;
	this.children = [];

	if (typeof (option.children) !== 'undefined' && option.children !== null) {
		option.children.forEach(function (nodeOptions) {
			_parent.children.push(new Tree(nodeOptions , selectKeys , _parent ));
		});
	}
};
