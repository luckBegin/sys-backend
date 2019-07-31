import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MsgService} from '../../../service';
import { ENUM, RESPONSE } from '../../../models';
import { AdaptorUtils, DateUtils } from '@shared/utils';
import { QueryModel } from './query.model';
import { Service } from '../../../../decorators/service.decorator';
import { TypeService } from '../../../service/vip';
import {ngIfAnimation} from "../../../routes/router-animation";

@Component({
	selector: 'galley-type',
	templateUrl: './type.component.html',
	styleUrls: ['./type.component.less'],
	animations: [ngIfAnimation]
})
export class TypeComponent implements OnInit {
	constructor(
		private fb: FormBuilder,
		private msg: MsgService,
		private service : TypeService
	) {} ;

	ngOnInit() {
		this.getList() ;
	};

	form: FormGroup = this.fb.group({
		name : [ null , [ Validators.required ]] ,
		prefix: [ null , [Validators.required ]] ,
		isTurnover: [ null , [Validators.required ]] ,
		discount: [ null , [Validators.required ]] ,
		investToIntegral: [ null , [Validators.required ]] ,
		investToAccount: [ null , [Validators.required ]] ,
		upgrade: [ null , [Validators.required ]] ,
		upgradeByPurchase: [ null ] ,
		upgradeByIntegral: [null ] ,
		enabled: [ '1'  , [Validators.required ]] ,
		nextLevel: [ null ] ,
		cover: [ null , [Validators.required ]] ,
		remark : [ null ] ,
		shopId: [ null ] ,
		id : [ null ]
	});

	queryModel : QueryModel = new QueryModel ;
	editMark : boolean = false ;
	infoBoxShow : boolean = false ;
	isVisible: boolean = false ;
	Enum_Type: ENUM[] = [] ;
	
	tableData = {
		loading: true,
		page: 1,
		total: 0,
		columns: [
			{ title: '会员类型', type: 'text', reflect: 'name' },
			{ title: '卡号前缀' , type: 'text' , reflect: 'prefix'} ,
			{ title: '折扣率' , type: 'text' , reflect: 'discount'} ,
			{ title: '充值送积分率' , type: 'text' , reflect: 'investToIntegral'} ,
			{ title: '充值到账率' , type: 'text' , reflect: 'investToAccount'} ,
			{ title: '升级策略' , type: 'mark' , filter: val => val.upgrade == '1' ? '消费积分': '充值金额'} ,
			{ title: '充值累计升级' , type: 'text' , reflect: 'upgradeByPurchase'} ,
			{ title: '积分累计升级' , type: 'text' , reflect: 'upgradeByIntegral'} ,
			{ title: '卡面' , type: 'img' , reflect: 'cover'} ,
			{ title: '计入营业统计' ,type: 'mark' , filter: val => val.isTurnover == '1'? '计入' : '不计入' } ,
			{ title: "创建时间" , type: 'text' , filter: ( val ) => {
					return DateUtils.format( val.createTime , 'y-m-d') ;
			}},
			{ title: '下一等级' , type: 'mark' , filter: val => {
				const item = this.Enum_Type.find( item => item.value == val.nextLevel);
				return item ? item.key : "未设置"
			}} ,
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

	getList(): void{
		this.tableData.loading = true ;
		this.service.get( this.queryModel )
			.subscribe((res: RESPONSE) => {
				this.tableData.data = res.data ;
				this.tableData.loading = false;
				this.Enum_Type = AdaptorUtils.reflect( res.data , { name: 'key' , id: "value" }) ;
				console.log(this.Enum_Type)
				console.log(this.Enum_Type) ;
				if(res.page)
					this.tableData.total = res.page.totalNumber ;
			},err => {
				this.tableData.loading = false ;
				this.msg.error( err ) ;
			});
	};

	add(): void{
		this.form.reset() ;
		this.form.patchValue({ enabled: '1'}) ;
		this.editMark = false ;
		this.infoBoxShow = !this.infoBoxShow ;
	};

	@Service("service.post" , true , function(){
		return (this as TypeComponent).form.value ;
	})
	makeNew( $event : MouseEvent ): void{
		this.msg.success("添加成功") ;
		this.infoBoxShow = false ;
		this.getList();
	};

	@Service("service.put" , true , function(){
		return (this as TypeComponent).form.value ;
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
