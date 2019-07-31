import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MsgService } from '../../../service';
import { ENUM, RESPONSE } from '../../../models';
import { AdaptorUtils, DateUtils, ObjectUtils } from '@shared/utils';
import { QueryModel } from './query.model';
import { Service } from '../../../../decorators/service.decorator';
import { AreaService, ListService, TypeService } from '../../../service/room';

@Component({
	selector: 'galley-type',
	templateUrl: './list.component.html',
	styleUrls: ['./list.component.less'],
})
export class ListComponent implements OnInit {
	constructor(
		private fb: FormBuilder,
		private msg: MsgService,
		private service : ListService ,
		private typeSer: TypeService ,
		private areaSer: AreaService
	) {} ;

	ngOnInit() {
		this.getList() ;
		this.getArea() ;
		this.getType();
	};

	form: FormGroup = this.fb.group({
		name : [ null , [ Validators.required ]] ,
		remark : [ null ] ,
		shopId: [ null ] ,
		areaId: [null , [Validators.required] ] ,
		typeId: [null , [Validators.required] ] ,
		id : [ null ]
	});

	queryModel : QueryModel = new QueryModel ;
	editMark : boolean = false ;
	infoBoxShow : boolean = false ;
	isVisible: boolean = false ;

	ENUM_Area: ENUM[] = [] ;
	ENUM_Type: ENUM[] = [];

	tableData = {
		loading: true,
		page: 1,
		total: 0,
		columns: [
			{ title: '名称', type: 'text', reflect: 'name' },
			{ title: '所属店' , type: 'text' , filter: val => {
				return val.shopInfo ? val.shopInfo.name : "未配置" ;
			}} ,
			{ title: '区域' , type: 'text' , filter: ( val ) => {
				const item = this.ENUM_Area.filter( item => val.areaId == item.value )[0];
				return item ? item.key : "未配置" ;
			}} ,
			{ title: '类型' , type: 'text' , filter: val => {
					const item = this.ENUM_Type.filter( item => val.typeId == item.value )[0];
					return item ? item.key : "未配置" ;
			}} ,
			{ title: "创建时间" , type: 'text' , filter: ( val ) => {
					return DateUtils.format( val.createTime , 'y-m-d') ;
			}},
			{ title: '备注', type: 'text', filter: (val) => {
					return val.remark ? val.remark : "无" ;
			}},
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
					console.log( data ) ;
					this.form.patchValue( data ) ;
					this.editMark = true ;
					this.infoBoxShow = true ;
				},
			}
			],
		},
		change: (type: string, size: number) => {
			if ( type === 'size' )
				this.queryModel.pageSize = size;
			if ( type === 'page' ) {
				this.tableData.page = size;
				this.queryModel.currentPage = size;
			}
			this.getList() ;
		},
	};

	searchBarData = {
		conditions: [
			{ name: '区域', data: [] ,default : "null" , type: 'select', model: 'areaId', placeHolder: '请选择区域' },
			{ name: '类型', data: [] ,default : "null" , type: 'select', model: 'typeId', placeHolder: '请选择区域' },
		],
		notify: {
			query: (data: QueryModel) => {
				this.queryModel = ObjectUtils.extend(this.queryModel, data) as QueryModel;
				this.getList();
			},
			reset: (data: QueryModel) => {
				this.queryModel = new QueryModel;
				this.getList();
			},
		}
	};

	getList(): void{
		this.tableData.loading = true ;
		this.service.get( this.queryModel )
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

	add(): void{
		this.form.reset() ;
		this.infoBoxShow = !this.infoBoxShow ;
		this.editMark = false ;
	};

	@Service("service.post" , true , function(){
		return (this as ListComponent).form.value ;
	})
	makeNew( $event : MouseEvent ): void{
		this.msg.success("添加成功") ;
		this.infoBoxShow = false ;
		this.getList();
	};

	@Service("service.put" , true , function(){
		return (this as ListComponent).form.value ;
	})
	save( $event : MouseEvent ): void{
		this.msg.success("修改成功");
		this.infoBoxShow = false ;
		this.getList() ;
	};


	@Service('service.delete', true, function(){
		return this.form.value ;
	})
	modalConfirm($event: Event) {
		this.msg.success('删除成功');
		this.isVisible = false;
		this.getList() ;
	};

	getArea(): void{
		this.areaSer.getAll()
			.subscribe( ( res: RESPONSE ) => {
				this.ENUM_Area = AdaptorUtils.reflect(res.data , { id: 'value' , name: 'key'});
				this.searchBarData.conditions[0].data = this.ENUM_Area ;
			})
	}

	getType(): void{
		this.typeSer.getAll()
			.subscribe( ( res: RESPONSE ) => {
				this.ENUM_Type = AdaptorUtils.reflect(res.data , { id: 'value' , name: 'key'});
				this.searchBarData.conditions[1].data = this.ENUM_Type ;
			})
	}
}
