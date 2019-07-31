import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MsgService , ShopService } from '../../../service';
import { ENUM, RESPONSE } from '../../../models';
import { AdaptorUtils, DateUtils, ObjectUtils, RegUtils } from '@shared/utils';
import { QueryModel } from './query.model';
import { Service } from '../../../../decorators/service.decorator';
import { ListService, TypeService } from '../../../service/gallery';
import { Before, CombineAll } from '../../../../decorators/function.decorator';
import {Observable} from 'rxjs';
import { CmdService } from '../../../service/command/cmd.service';

@Component({
	selector: 'galley-type',
	templateUrl: './list.component.html',
	styleUrls: ['./list.component.less'],
})
export class ListComponent implements OnInit {
	constructor(
		private fb: FormBuilder,
		private msg: MsgService,
		private typeService : TypeService ,
		private service: ListService ,
		private shopSer: ShopService ,
	) {} ;

	ngOnInit() {
		this.getShopList() ;
		this.getList() ;
		this.getTypes() ;
	};

	form: FormGroup = this.fb.group({
		name : [ null , [ Validators.required ]] ,
		remark : [ null ] ,
		shopId: [ null , [Validators.required ] ] ,
		typeId: [ null , [Validators.required ] ] ,
		id : [ null ] ,
		link: [ null ]
	});

	ENUM_shopList: ENUM[] ;
	ENUM_typeList: ENUM[] ;
	queryModel : QueryModel = new QueryModel ;
	editMark : boolean = false ;
	infoBoxShow : boolean = false ;
	isVisible: boolean = false ;
	imgShow: boolean = false ;
	imgSrc: string ;

	tableData = {
		loading: true,
		page: 1,
		total: 0,
		columns: [
			{ title: '名称', type: 'text', reflect: 'name' },
			{ title: '所属店' , type: 'text' , filter: ( val ) => {
				if(val.shopInfo)
					return val.shopInfo.name ;
				else
					return "未配置" ;
			}} ,
			{ title: '类型' , type: 'text' , filter: ( val ) => {
				if(val.typeInfo)
					return val.typeInfo.name ;
				else
					return "未配置" ;
			}} ,
			{ title: "创建时间" , type: 'text' , filter: ( val ) => {
					return DateUtils.format( val.createTime , 'y-m-d') ;
			}},
			{ title: "小图" , type: 'img' , reflect: 'url' , fn: ( val ) => {
				this.imgSrc = val.url ;
				this.imgShow = true ;
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
						this.form.patchValue( data ) ;
						this.editMark = true ;
						this.infoBoxShow = true ;
					},
				},{
					type: "add",
					title: "复制地址" ,
					fn: ( data ) => {
						CmdService.copy(data.url)
							.subscribe( ( res:boolean ) => {
								res ? this.msg.success("复制成功") : this.msg.warn("复制失败") ;
							});
					}
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
			{ name: '类型', data: [] ,default : "null" , type: 'select', model: 'typeId', placeHolder: '请选择类型' },
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

	getShopList(): void{
		this.shopSer.getAll()
			.subscribe( ( res: RESPONSE ) => {
				this.ENUM_shopList = AdaptorUtils.reflect( res.data , { name : "key" , id: "value"}) ;
			})
	};

	getTypes(): void{
		this.typeService.getAll()
			.subscribe( ( res: RESPONSE ) => {
				this.ENUM_typeList = AdaptorUtils.reflect( res.data , { name : "key" , id: "value"}) ;
				this.searchBarData.conditions[0].data = this.ENUM_typeList ;
			});
	}

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
		this.editMark = false ;
		this.infoBoxShow = !this.infoBoxShow ;
	};

	@Before(function(){
		return new Observable( obsr => {
			const img = <HTMLInputElement>document.getElementById("image") ;
			const file = img.files[0] ;

			const isImage = RegUtils.isImage( file.name ) ;

			if( !file ){
				this.msg.warn('请选择图片') ;
				return ;
			}

			if(!isImage){
				this.msg.warn('请只允许上传图片') ;
				return ;
			}

			const formData = new FormData();
			const form = this.form.value ;
			formData.append('name' , form.name ) ;
			formData.append('shopId' , form.shopId) ;
			formData.append('typeId' , form.typeId) ;
			
			if( form.remark)
				formData.append('remark' , form.remark) ;
			if( form.link)
				formData.append('link' , form.link) ;
			
			formData.append('time' , DateUtils.getNow(true).toString() ) ;
			formData.append('file' , file) ;
			obsr.next( formData ) ;
		});
	})
	@CombineAll()
	makeNew( $event : MouseEvent , data: FormData ): void{
		const el = <HTMLButtonElement>$event.target ;
		el.disabled = true ;
		const input = <HTMLInputElement>document.getElementById("image") ;
		this.service.post( data )
			.subscribe( ( res: RESPONSE ) => {
				this.msg.success("添加成功") ;
				this.infoBoxShow = false ;
				this.getList();
				el.disabled = false;
				input.outerHTML = input.outerHTML;
			} , err => {
				el.disabled =false ;
			})

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
}
