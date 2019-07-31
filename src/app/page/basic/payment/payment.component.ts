import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MsgService} from '../../../service';
import { ENUM, RESPONSE } from '../../../models';
import { AdaptorUtils, DateUtils } from '@shared/utils';
import { QueryModel } from './query.model';
import { Service } from '../../../../decorators/service.decorator';
import {ngIfAnimation} from "../../../routes/router-animation";
import {PaymentService} from "../../../service/basic";

@Component({
	selector: 'galley-type',
	templateUrl: './payment.component.html',
	styleUrls: ['./payment.component.less'],
	animations: [ngIfAnimation]
})
export class PaymentComponent implements OnInit {
	constructor(
		private fb: FormBuilder,
		private msg: MsgService,
		private service : PaymentService
	) {} ;

	ngOnInit() {
		this.getList() ;
	};

	form: FormGroup = this.fb.group({
		id : [ null ],
		name: [ null , [Validators.required ]] ,
		shopId: [ null ] ,
		remark : [ null ] ,
		isCheckout: [ null , [Validators.required ]] ,
		isCancel: [ null , [Validators.required ]] ,
		isInvest: [ null , [Validators.required ]] ,
		isTurnover: [ null , [Validators.required ]] ,
		isIncome: [ null , [Validators.required ]] ,
		isDefault: [ null , [Validators.required ]]
	});

	queryModel : QueryModel = new QueryModel ;
	editMark : boolean = false ;
	infoBoxShow : boolean = false ;
	isVisible: boolean = false ;
	
	tableData = {
		loading: true,
		page: 1,
		total: 0,
		columns: [
			{ title: '名称', type: 'text', reflect: 'name' },
			{ title: '是否结账方式' ,type: 'mark' , filter: val => val.isCheckout == '1'? '是' : '否' } ,
			{ title: '是否销账方式' ,type: 'mark' , filter: val => val.isCancel == '1'? '是' : '否' } ,
			{ title: '是否充值方式' ,type: 'mark' , filter: val => val.isInvest == '1'? '是' : '否' } ,
			{ title: '计入营业统计' ,type: 'mark' , filter: val => val.isTurnover == '1'? '计入' : '不计入' } ,
			{ title: '计入实收统计' ,type: 'mark' , filter: val => val.isIncome == '1'? '计入' : '不计入' } ,
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
		return (this as PaymentComponent).form.value ;
	})
	makeNew( $event : MouseEvent ): void{
		this.msg.success("添加成功") ;
		this.infoBoxShow = false ;
		this.getList();
	};

	@Service("service.put" , true , function(){
		return (this as PaymentComponent).form.value ;
	})
	save( $event : MouseEvent ): void{
		this.msg.success("修改成功");
		this.infoBoxShow = false ;
		this.getList() ;
	};


	@Service('service.delete', true, function(){
		return (this as PaymentComponent).form.value ;
	})
	modalConfirm($event: Event) {
		this.msg.success('删除成功');
		this.isVisible = false;
		this.getList() ;
	};
}
