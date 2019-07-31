import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MsgService } from '../../../service';
import { RESPONSE } from '../../../models';
import {DateUtils} from '@shared/utils';
import { QueryModel } from './query.model';
import { Service } from '../../../../decorators/service.decorator';
import { AreaService } from '../../../service/room';

@Component({
	selector: 'galley-type',
	templateUrl: './area.component.html',
	styleUrls: ['./area.component.less'],
})
export class AreaComponent implements OnInit {
	constructor(
		private fb: FormBuilder,
		private msg: MsgService,
		private service : AreaService ,
	) {} ;

	ngOnInit() {
		this.getList() ;
	};

	form: FormGroup = this.fb.group({
		name : [ null , [ Validators.required ]] ,
		remark : [ null ] ,
		shopId: [ null ] ,
		id : [ null ]
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
		return (this as AreaComponent).form.value ;
	})
	makeNew( $event : MouseEvent ): void{
		this.msg.success("添加成功") ;
		this.infoBoxShow = false ;
		this.getList();
	};

	@Service("service.put" , true , function(){
		return (this as AreaComponent).form.value ;
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
