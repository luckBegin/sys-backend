import {Component, OnInit} from '@angular/core';
import {MsgService} from "../../../service/msg/msg.service";
import {SysConfigService} from "../../../service/system/config.service";
import {TypeService} from "../../../service/vip";
import {ENUM, RESPONSE} from "../../../models";
import {filter, map} from "rxjs/operators";
import {AdaptorUtils, ObjectUtils} from "@shared/utils";
import {QueryModel} from "./query.model";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Observable} from "rxjs";

@Component({
	selector: 'vip-integral' ,
	templateUrl: './vipIntegral.component.html' ,
	styleUrls: ['./vipIntegral.component.less'],
})
export class VipIntegralComponent implements OnInit{
	constructor(
		private readonly msg: MsgService ,
		private readonly service: SysConfigService ,
		private readonly typeService : TypeService ,
		private readonly fb: FormBuilder
	){};
	
	public ngOnInit(): void {
		this.getENUM();
		this.getIntegralConfig() ;
		this.getList() ;
		console.log( this ) ;
	}

	public ENUM_VipType: ENUM[] = [] ;
	
	public ENUM_Strategy: ENUM[] = [] ;
	
	private getENUM(): void {
		this.typeService.getAll()
			.pipe( map( (res: RESPONSE ) => res.data ))
			.subscribe( ( data: any[] ) => {
				this.ENUM_VipType = AdaptorUtils.reflect( data , { 'id': 'value' , 'name': 'key' }) ;
				this.searchBarData.conditions[0].data =  AdaptorUtils.reflect( data , { 'id': 'value' , 'name': 'key' }) ;
			})
	}
	
	public integralConfig : { [key: string]: any } = {} ;
	public integralConstant: boolean = false ;
	public integralEnable: boolean = false ;
	
	private getIntegralConfig(): void{
		this.service.get( { type: '会员积分配置'})
			.pipe( map( ( res:RESPONSE ) => res.data ))
			.subscribe( ( data: any[] ) => {
				const obj = { strategy: null , enable: null } ;
				data.forEach( item => {
					if( item.key === '策略' )
						obj.strategy = item ;
					if( item.key === '启用')
						obj.enable = item ;
				});
				this.integralConfig = obj ;
				
				if( this.integralConfig.strategy.value  === '固定数值' ) {
					this.integralConstant = true ;
				}
				
				if( this.integralConfig.enable.value === '启用') {
					this.integralEnable = true ;
				}
				this.ENUM_Strategy = [
					{ key: '固定数值' , value: obj.strategy.id } ,
					{ key: '百分比' , value: obj.enable.id }
				];
				this.searchBarData.conditions[1].data = this.ENUM_Strategy ;
			})
	}
	
	public searchBarData = {
		conditions: [
			{ name: '会员类型', data: [] ,default : "null" , type: 'select', model: 'key', placeHolder: '请选择会员类型' },
			{ name: '积分赠送策略', data: [] ,default : "null" , type: 'select', model: 'parentId', placeHolder: '请选择积分赠送策略' },
		],
		notify: {
			query: (data: QueryModel) => {
				this.queryModel = ObjectUtils.extend(this.queryModel, data) as QueryModel;
				this.getList();
			},
			reset: (data: QueryModel) => {
				this.queryModel = new QueryModel;
				this.getList();
			}
		}
	};
	
	public tableData = {
		loading: true,
		page: 1,
		total: 0,
		columns: [
			{ title: '会员类型' , type: 'text' , reflect: 'key' },
			{ title: '固定数值' , type: 'text' , reflect: 'constant' },
			{ title: '百分比' , type: 'text' , filter: ( item ) => item.percent + '%' },
			{ title: '最低消费(元)' , type: 'text' , reflect: 'limit' },
		],
		data: [],
		btn: {
			title: '操作',
			items: [{
				type: 'edit',
				title: '编辑',
				fn: (data) => {
					this.editMark = true ;
					this.form.patchValue( data ) ;
					this.modalShow = true ;
				},
			},{
				type: 'del',
				title: '删除',
				fn: (data) => {
					this.form.patchValue( data ) ;
					this.deleteModal = true ;
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
	
	
	public queryModel: QueryModel = new QueryModel ;
	private getList(): void {
		this.tableData.loading = true ;
		this.service.get( this.queryModel )
			.pipe(
				filter( (res: RESPONSE ) => res.success ) ,
			)
			.subscribe(( res: RESPONSE ) => {
				this.tableData.data = res.data.flatMap(item => {
					const info = JSON.parse(item.value);
					return [{
						id: item.id,
						type: item.type,
						key: item.key,
						parentId: item.parentId,
						constant: info.constant,
						percent: info.percent,
						limit: info.limit
					}];
				}) ;
				this.tableData.loading = false;
				if(res.page)
					this.tableData.total = res.page.totalNumber ;
		})
	}
	
	public editMark: boolean = false ;
	public modalShow: boolean = false ;
	public form: FormGroup = this.fb.group({
		id: [ null ] ,
		type: [ null ] ,
		key: [null , [Validators.required ]] ,
		parentId: [ null, [ Validators.required ] ] ,
		constant: [ null , [Validators.required ]] ,
		percent: [ null , [Validators.required ]] ,
		limit: [ null , [Validators.required ]],
	}) ;
	
	public new(): void {
		this.modalShow = true ;
		this.editMark = false ;
		this.form.reset() ;
		this.form.patchValue({ parentId: this.integralConfig.strategy.id }) ;
	}
	
	public addOrSave($event: MouseEvent ): void {
		const val = this.form.value ;
		const obj = {
			id: val.id ,
			parentId: val.parentId ,
			type: '会员类型积分配置' ,
			key: val.key ,
			value: JSON.stringify({
				percent: val.percent ,
				limit: val.limit ,
				constant: val.constant
			}),
			remark: this.ENUM_VipType.filter( item => item.key === val.key)[0].value
		};
		
		let service$: Observable< RESPONSE > ;
		
		if( this.editMark ) {
			service$ = this.service.put( obj );
		} else {
			service$ = this.service.post( obj ) ;
		}
		
		const el = $event.target as HTMLButtonElement ;
		el.disabled = true ;
		
		service$
			.subscribe( (res: RESPONSE ) => {
				el.disabled = false ;
				this.msg.success('操作成功') ;
				this.modalShow = false ;
				this.getList() ;
			});
	}
	
	public deleteModal: boolean = false ;
	
	public delete( $event: MouseEvent ):void {
		const value = this.form.value ;
		const el = $event.target as HTMLButtonElement ;
		el.disabled = true ;
		this.service.delete({ id: value.id })
			.subscribe( res => {
				el.disabled = false ;
				this.msg.success('操作成功') ;
				this.getList() ;
				this.deleteModal = false ;
			})
	}
	
	configForm: FormGroup = this.fb.group({
		id: [ null ] ,
		parentId: [ null ] ,
		key: [ null ] ,
		type: [ null ] ,
		value: [ null ] ,
		shopId: [ null ]
	});
	
	public configChange( type: 'strategy' | 'enable'): void {
		if( type === 'strategy') {
			const data = this.integralConfig.strategy ;
			data.value = this.integralConstant ? '百分比' : '固定数值' ;
			this.configForm.patchValue( data ) ;
		}
		
		if( type === 'enable') {
			const data = this.integralConfig.enable ;
			data.value = this.integralEnable ? '停用' : '启用' ;
			this.configForm.patchValue( data ) ;
		}
		
		this.service.put(this.configForm.value).subscribe( ( res: RESPONSE ) => {
			this.msg.success('操作成功') ;
			this.configForm.reset() ;
		});
	}
}
