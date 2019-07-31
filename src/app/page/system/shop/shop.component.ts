import { Component,  OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MsgService , ShopService } from '../../../service';
import { ENUM, RESPONSE } from '../../../models';
import { combineLatest } from 'rxjs';
import { DateUtils, ObjectUtils } from '@shared/utils';
import { QueryModel } from './query.model';
import { Service } from '../../../../decorators/service.decorator';
@Component({
	selector: 'system-role',
	templateUrl: './shop.component.html',
	styleUrls: ['./shop.component.less'],
})
export class ShopComponent implements OnInit{
	constructor(
		private fb: FormBuilder,
		private msg: MsgService,
		private service : ShopService
	) {} ;

	ngOnInit() {
		this.getENUMS() ;
		this.getList() ;
	}

	form: FormGroup = this.fb.group({
		name : [ null , [ Validators.required ]] ,
		remark : [ null ] ,
		lat : [ null , [Validators.required ]] ,
		lng : [ null , [Validators.required ]] ,
		type : [ null , [ Validators.required ]] ,
		owner : [ null ] ,
		tel : [ null , [Validators.required ] ] ,
		address : [ null , [Validators.required ] ] ,
		icon : [ null ] ,
		id : [ null ]
	});
	ENUM_shopType : ENUM[] ;
	queryModel : QueryModel = new QueryModel ;
	editMark : boolean = false ;
	infoBoxShow : boolean = false ;
	isVisible: boolean = false ;

	tableData = {
		loading: true,
		page: 1,
		total: 0,
		columns: [
			{ title: '店铺名称', type: 'text', reflect: 'name' },
			{ title: '店铺类型', type: 'text', filter: ( val ) => {
				const data = this.ENUM_shopType.filter( item => item.value === val.type );
				return data[0].key ;
			}},
			{ title: '经度' , type: 'text' , reflect: 'lng'} ,
			{ title: '纬度' , type: 'text' , reflect: 'lat'} ,
			{ title: '店铺地址' , type: 'text'  , reflect : 'address' } ,
			{ title: '店长' , type: 'text' , reflect: 'owner'} ,
			{ title: 'LOGO' , type: 'img' , reflect: 'icon' , preview: true } ,
			{ title: "创建时间" , type: 'text' , filter: ( val ) => {
				return DateUtils.format( val.createTime , 'y-m-d') ;
			}},
			{ title: '启用', type: 'switch', filter: (column) => {
					return column.enabled === 1;
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
				}, {
					type: 'edit',
					title: '编辑',
					fn: (data) => {
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
			this.getList()
		},
	};

	searchBarData = {
		conditions: [
			{ name: '店名', type: 'input' , model : "name" , placeHolder: '请输入店名'},
			{ name: '类型', type: 'select' , data : [] , default : "null",model : "type" , placeHolder: '请选择店铺类型' },
		],
		notify : {
			query : ( data : QueryModel ) =>  { this.queryModel = ObjectUtils.extend(this.queryModel , data)  as QueryModel ; this.getList();  },
			reset : ( data : QueryModel ) => { this.queryModel = new QueryModel ; this.tableData.page = 1 ;this.getList(); } ,
		}
	};

	getENUMS(): void{
		combineLatest(
			this.service.ENUM_ShopType()
		)
			.subscribe( (data : Array< ENUM[] > ) => {
				this.ENUM_shopType = data[0];
				this.searchBarData.conditions[1].data = data[0] ;
			})
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
		return (this as ShopComponent).form.value ;
	})
	makeNew( $event : MouseEvent ): void{
		this.msg.success("添加成功") ;
		this.infoBoxShow = false ;
		this.getList();
	};

	@Service("service.put" , true , function(){
		return (this as ShopComponent).form.value ;
	})
	save( $event : MouseEvent ): void{
		this.msg.success("修改成功");
		this.infoBoxShow = false ;
		this.getList() ;
	};

	changeStatus(data : any ) {
		const postData = {
			id :  data.id ,
			enabled : data.enabled === 1 ? 0 : 1
		};

		this.service.put(postData)
			.subscribe( res => {
				data.enabled === 1 ? data.enabled = 0 : data.enabled = 1 ;
				this.msg.success("修改成功") ;
			})
	};

	@Service('service.delete', true, function(){
		return this.form.value ;
	})
	modalConfirm($event: Event) {
		this.msg.success('删除成功');
		this.isVisible = false;
		this.getList() ;
	};
}
