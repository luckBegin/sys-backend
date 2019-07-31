import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MsgService } from '../../../service';
import {ENUM, RESPONSE} from '../../../models';
import {AdaptorUtils, DateUtils, ObjectUtils} from '@shared/utils';
import { QueryModel } from './query.model';
import { Service } from '../../../../decorators/service.decorator';
import { RegUtils } from '@shared/utils/reg.utils' ;
import {PriceService, TimeService , TypeService } from "../../../service/room";
import {combineLatest} from "rxjs";

@Component({
	selector: 'room-time',
	templateUrl: './price.component.html',
	styleUrls: ['./price.component.less'],
})
export class PriceComponent implements OnInit {
	constructor(
		private fb: FormBuilder,
		private msg: MsgService,
		private service : PriceService ,
		private timeSer: TimeService ,
		private roomTypeSer: TypeService
	) {} ;

	ngOnInit() {
		this.getList() ;
		this.getEnums() ;
	};

	form: FormGroup = this.fb.group({
		timePrice : [ null , [ Validators.required ]] ,
		vipTimePrice : [ null , [ Validators.required ]] ,
		outrightPrice : [ null , [ Validators.required ]] ,
		vipOutrightPrice : [ null , [ Validators.required ]] ,
		advancePrice : [ null , [ Validators.required ]] ,
		vipAdvancePrice : [ null , [ Validators.required ]] ,
		timeTypeId : [ null , [ Validators.required ]] ,
		roomTypeId : [ null , [ Validators.required ]] ,
		week: [ null , [Validators.required ]] ,
		remark : [ null ] ,
		shopId: [ null ] ,
		id : [ null ]
	});

	queryModel : QueryModel = new QueryModel ;
	editMark : boolean = false ;
	infoBoxShow : boolean = false ;
	isVisible: boolean = false ;
	ENUM_Time: ENUM[] = [] ;
	ENUM_Type: ENUM[] = [] ;
	
	tableData = {
		loading: true,
		page: 1,
		total: 0,
		columns: [
			{ title: '所属时段', type: 'text', filter: ( val ) => {
				const item = this.ENUM_Time.filter( item => val.timeTypeId == item.value )[0];
				return item ? item.key : "未配置" ;
			}},
			{ title: '房台类型', type: 'text',  filter: ( val ) => {
					const item = this.ENUM_Type.filter( item => val.roomTypeId == item.value )[0];
					return item ? item.key : "未配置" ;
			}},
			{ title: '计时(价格 - 会员价)' , type: 'text' , filter: ( val ) => {
				return val.timePrice + ' - ' + val.vipTimePrice ;
			}},
			{ title: '买断(价格 - 会员价)' , type: 'text' , filter: ( val ) => {
				return val.outrightPrice + ' - ' + val.vipOutrightPrice ;
			}},
			{ title: '预买(价格 - 会员价)' , type: 'text' , filter: ( val ) => {
				return val.advancePrice + ' - ' + val.vipAdvancePrice ;
			}},
			{ title: '适用星期' , type: 'text' , reflect: 'week'} ,
			{ title: '所属店' , type: 'text' , filter: ( val ) => {
				if(val.shopInfo)
					return val.shopInfo.name ;
				else
					return "未配置" ;
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
					if( typeof data.week === 'string')
						data.week = data.week.split(",");
					this.form.patchValue( data ) ;
					this.editMark = true ;
					this.infoBoxShow = true ;
				},
			}],
		},
		change: (type: string, size: number) => {
			if ( type === 'size' )
				this.queryModel.pageSize = size;
			if ( type === 'page' ) {
				this.tableData.page = size;
				this.queryModel.currentPage = size;
			}
			this.getList();
		},
	};
	
	searchBarData = {
		conditions: [
			{ name: '类型', data: [] ,default : "null" , type: 'select', model: 'roomTypeId', placeHolder: '请选择类型' },
			{ name: '时段', data: [] ,default : "null" , type: 'select', model: 'timeTypeId', placeHolder: '请选择时段' },
			// { name: '星期', data: [] ,default : "null" , type: 'select', model: 'week', placeHolder: '请选择星期' },
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
		this.editMark = false ;
		this.infoBoxShow = !this.infoBoxShow ;
	};

	@Service("service.post" , true , function(){
		const val =  (this as PriceComponent).form.value ;
		val.week = val.week.join(",") ;
		return val ;
	})
	makeNew( $event : MouseEvent ): void{
		this.msg.success("添加成功") ;
		this.infoBoxShow = false ;
		this.getList();
	};
	
	@Service("service.put" , true , function(){
		const val =  (this as PriceComponent).form.value ;
		val.week = val.week.join(",") ;
		return val ;
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
	
	getEnums(): void{
		combineLatest(
			this.roomTypeSer.getAll(),
			this.timeSer.getAll()
		)
			.subscribe( ( res: RESPONSE[] ) => {
				if( res[0].success){
					this.ENUM_Type = AdaptorUtils.reflect(res[0].data , { id: 'value' , name: 'key'}) ;
					this.searchBarData.conditions[0].data = this.ENUM_Type;
				}
				
				if( res[1].success){
					this.ENUM_Time = AdaptorUtils.reflect(res[1].data , { id: 'value' , name: 'key'}) ;
					this.searchBarData.conditions[1].data = this.ENUM_Time;
				}
			})
	}
}
