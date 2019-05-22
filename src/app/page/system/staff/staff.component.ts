import { Component, OnInit, ViewChild } from '@angular/core';
import { MsgService } from '../../../service/msg/msg.service';
import { StaffService } from '../../../service/system/staff.service';
import { QueryModel } from './query.model';
import { ENUM, RESPONSE } from '../../../models';
import { AdaptorUtils, ObjectUtils } from '@shared/utils';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Service } from '../../../../decorators/service.decorator';
import { DepartService, RoleService, ShopService, SysMenuService } from '../../../service/system';
import { NzTreeComponent } from 'ng-zorro-antd';
import { Before, CombineAll } from '../../../../decorators/function.decorator';
import { Observable } from 'rxjs';

@Component({
	selector: 'sys-staff',
	templateUrl: './staff.component.html',
	styleUrls: ['./staff.component.less'],
})
export class StaffComponent implements OnInit {
	constructor(
		private msg: MsgService,
		private service: StaffService,
		private menu: SysMenuService,
		private departSer: DepartService,
		private roleSer: RoleService,
		private fb: FormBuilder,
		private shopSer: ShopService
	) {} ;

	ngOnInit(): void {
		this.getRoleList();
		this.getDepart();
		this.getStaffList();
		this.getShops() ;
	};

	isVisible: boolean = false;
	queryModel: QueryModel = new QueryModel;
	editMark: boolean = false;
	formShow: boolean = false;
	passFormShow: boolean = false ;

	form: FormGroup = this.fb.group({
		'username': [null, [Validators.required]],
		'name': [null, [Validators.required]],
		'remark': [ null ],
		'phoneNumber': [null],
		'password': [null],
		'roleIds': [null, [Validators.required]],
		'shopId' : [null , [Validators.required ]] ,
		'id': [null],
	});

	passForm: FormGroup = this.fb.group({
		'password' : [null , [Validators.required]] ,
		'passwordAgain' : [null , [Validators.required]] ,
		'id': [ null ]
	});

	roles: ENUM[] = [];
	ENUM_Shops: ENUM[] ;

	departs: any[] = [];
	selectDepart: string[];
	@ViewChild('treeCom') treeCom: NzTreeComponent;

	tableData = {
		loading: true,
		page: 1,
		total: 0,
		columns: [
			{ title: '用户名', type: 'text', reflect: 'username' },
			{ title: '手机号', type: 'text', filter : ( val ) => {
				return val.phoneNumber ? val.phoneNumber : "未填写" ;
			}},
			{ title: '真实姓名', type: 'text', reflect: 'name' },
			{ title: '部门' , type: 'text' , filter : ( val ) => {
				let str = '' ;
				val.departmentDTOS.forEach( item => {
					str += item.name + "," ;
				});

				return str ;
			}},
			{ title: '所属店' , type: 'text' , filter : ( val ) => {
					let str = '' ;
					val.shopOutputVOS.forEach( item => {
						str += item.name + "," ;
					});

					return str ;
				}},
			{ title: '角色' , type: 'text' , filter : ( val ) => {
				let str = '' ;
				val.roleOutputVOS.forEach( item => {
					str += item.name + "," ;
				});

				return str ;
			}},
			{ title: '冻结', type: 'switch', filter: (column) => {
					return column.status === 1;
				}, fn: (data) => {
					this.changeStatus( data );
				},
			}
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
				},{
					type: 'edit',
					title: '编辑',
					fn: (data) => {
						this.editMark = true;
						this.editShow(data);
					},
				},{
					type: 'reset',
					title: '修改密码',
					fn: ( data ) => {
						this.passForm.patchValue({
							id: data.id
						});
						this.passFormShow = true ;
					},
				},
			],
		},
		change: (type: string, size: number) => {
			if (type === 'size')
				this.queryModel.pageSize = size;
			if (type === 'page') {
				this.tableData.page = size;
				this.queryModel.currentPage = size;
			}
			this.getStaffList();
		},
	};

	searchBarData = {
		conditions: [
			{ name: '用户名', type: 'input', model: 'username', placeHolder: '请输入用户名' },
			{ name: '手机号', type: 'input', model: 'phoneNumber', placeHolder: '请输入手机号' },
			{ name: '真实姓名', type: 'input', model: 'description', placeHolder: '请输入真实姓名' }
		],
		notify: {
			query: (data: QueryModel) => {
				this.queryModel = ObjectUtils.extend(this.queryModel, data) as QueryModel;
				this.getStaffList();
			},
			reset: (data: QueryModel) => {
				this.queryModel = new QueryModel;
				this.getStaffList();
			},
		}
	};

	getStaffList() {
		this.tableData.loading = true ;
		this.service.getList(this.queryModel)
			.subscribe((res: RESPONSE) => {
				this.tableData.data = res.data ;
				this.tableData.loading = false;
				if(res.page)
					this.tableData.total = res.page.totalNumber ;
			},err => {
				this.tableData.loading = false ;
				this.msg.error( err ) ;
			});
	};

	add() {
		this.editMark = false;
		this.formShow = true;
		this.selectDepart = [];
		this.form.reset();
	};

	@Service('service.delete', true, function() {
		return this.form.value;
	})
	modalConfirm($event: MouseEvent) {
		this.msg.success('删除成功');
		this.isVisible = false;
		this.getStaffList();
	};

	@Before(function($event: Event) {
		const selectKeys = (this as StaffComponent).treeCom.nzTreeService.getSelectedNodeList();

		if (selectKeys.length === 0) {
			(this as StaffComponent).msg.warn('未选择部门');
			return;
		}

		if (!(this as StaffComponent).form.value.password) {
			(this as StaffComponent).msg.warn('未设置初始密码');
			return;
		}

		return new Observable(obsr => {
			const _arr = [];

			selectId(selectKeys, _arr);

			obsr.next(_arr);
		});
	})
	@CombineAll()
	makeNew($event: Event, selectKeys: string[]): void {
		const value = this.form.value;
		value['departIds'] = selectKeys;
		this.service.post(value)
			.subscribe((res: RESPONSE) => {
				this.msg.notifySuccess('新建管理员成功', `用户名为: ${value.username} , 密码:${value.password}`);
				this.formShow = false;
				this.getStaffList();
			});
	};

	@Before(function($event: Event) {
		const selectKeys = (this as StaffComponent).treeCom.nzTreeService.getSelectedNodeList();
		if (selectKeys.length === 0) {
			(this as StaffComponent).msg.warn('未选择部门');
			return;
		}

		return new Observable(obsr => {
			const _arr = [];
			selectId(selectKeys, _arr);
			obsr.next(_arr);
		});
	})
	@CombineAll()
	save($event: Event, selectKeys: string[]): void {
		const value = this.form.value;
		const data = {
			"username": value.username,
			"name": value.name,
			"remark": value.remark,
			"phoneNumber": value.phoneNumber ,
			"password": "123123",
			"roleIds": value.roleIds,
			"shopId": value.shopId,
			"id": value.id ,
			"departIds": selectKeys
		};

		this.service.put(data)
			.subscribe((res: RESPONSE) => {
				this.msg.success('修改成功');
				this.formShow = false;
				this.getStaffList() ;
			});
	};

	getRoleList(): void {
		this.roleSer.getList({})
			.subscribe((res: RESPONSE) => {
				res.data.forEach(item => {
					this.roles.push({
						key: item.name,
						value: item.id,
					});
				});
			});
	};

	getDepart(): void {
		this.departSer.get()
			.subscribe((res: RESPONSE) => {
				this.departs = AdaptorUtils.makeTreeNode({ title: 'name', key: 'id' }, res.data);
			});
	};

	editShow(data: any) {
		let roles = [];

		let departs = [];

		let shop = [] ;

		data.roleOutputVOS.forEach(item => {
			roles.push(item.id);
		});

		data.departmentDTOS.forEach(item => {
			departs.push( item.id );
		});

		data.shopOutputVOS.forEach(item => {
			shop.push( item.id );
		});

		data.roleIds = roles;
		data.shopId = shop ;
		this.selectDepart = departs;

		this.form.patchValue(data);

		this.formShow = true;
	};

	@Service("service.put", true , function(){
		const formValue = (this as StaffComponent).passForm.value ;
		return {
			id: formValue.id,
			password: formValue.password
		} ;
	})
	changePass( $event: MouseEvent): void{
		this.msg.success("修改成功") ;
		this.passFormShow = false ;
		this.passForm.reset() ;
	}

	changeStatus(data : any ) {
		const postData = {
			id :  data.id ,
			status : data.status === 1 ? 0 : 1
		};

		this.service.put(postData)
			.subscribe( ( res ) => {
				data.status === 1 ? data.status = 0 : data.status = 1 ;
				this.msg.success("修改成功") ;
			})
	};

	getShops(): void{
		this.shopSer.getAll()
			.subscribe( ( res : RESPONSE ) => {
				this.ENUM_Shops = AdaptorUtils.reflect( res.data , {'name': 'key' , id: 'value' })
			});
	};

}

const selectId = function(arr: any[], tar: string[]) {
	arr.forEach(item => {
		tar.push(item.key.toString());
			if (item.children.length > 0) {
			selectId(item.children, tar);
		}
	});
};
