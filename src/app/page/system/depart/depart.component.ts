import { Component , OnInit } from '@angular/core';
import { MsgService, ShopService } from '../../../service';
import { FormBuilder, FormGroup , Validators} from "@angular/forms";
import { DepartService } from "../../../service/system";
import { ENUM, RESPONSE } from '../../../models' ;
import { AdaptorUtils } from '@shared/utils';
import { ngIfAnimation } from '../../../routes/router-animation';
import { Service } from '../../../../decorators/service.decorator';

@Component({
	selector : "sys-depart" ,
	templateUrl : "./depart.component.html",
	styleUrls : ['./depart.component.less'],
	animations: [ ngIfAnimation ]
})
export class DepartComponent implements OnInit {
	constructor(
		private msg: MsgService ,
		private fb: FormBuilder ,
		private service: DepartService
	){} ;


	ngOnInit(): void{
		this.getList() ;

	};

	departList: any[] = [] ;

	hHeight: number = document.body.clientHeight - 204 ;

	mouseHeight: number = 30 ;

	loading: boolean = true ;

	menuShow: boolean = false ;

	infoBoxShow: boolean = false ;

	editMark: boolean = false ;

	form: FormGroup = this.fb.group({
		'name' : [null , [Validators.required]] ,
		'description' : [null , [Validators.required]] ,
		'parentId' : [ 0 ] ,
		'shopId' : [ null ] ,
		'id' : [ null ]
	});

	isVisible: boolean = false ;

	currentItem: any = {} ;

	ENUM_Shop : ENUM[] ;

	getList(): void{
		this.service.get()
		  .subscribe( ( res : RESPONSE) => {
			this.departList = AdaptorUtils.makeTreeNode({title : 'name' , key : 'id' } , res.data ) ;
			this.loading = false ;
		  });
	};

	showMenu($event): void{
		this.mouseHeight = $event.event.pageY - 70;
		this.menuShow = true ;
		this.currentItem = $event.node ;
	};

	add( isParent : boolean ): void{
		this.menuShow = false ;
		this.form.reset() ;

		if(isParent)
			this.form.patchValue({ parentId:  0 , id : null } ) ;
		else{
			const pid = this.currentItem.key ;
			this.form.patchValue({ parentId: pid } ) ;
		}

		this.infoBoxShow = true ;
		this.editMark = false ;
	};

	del(): void{
		this.menuShow = false ;
		this.isVisible = true ;
		this.form.patchValue({ id: this.currentItem.key }) ;
	};

	edit(): void{
		this.menuShow = false ;
		this.infoBoxShow = true ;
		this.editMark = true ;
		this.form.patchValue({
			id: this.currentItem.key ,
			name: this.currentItem.title ,
			description: this.currentItem.origin.description ,
			parentId: this.currentItem.origin.parentId ? this.currentItem.origin.parentId : 0
		});
	};
	@Service("service.delete" , true , function(){
		return (this as DepartComponent).form.value ;
	})
	modalConfirm($event: MouseEvent): void{
		this.msg.success("删除成功") ;
		this.isVisible = false ;
		this.getList() ;
	};

	@Service("service.post" , true ,function(){
		return (this as DepartComponent).form.value ;
	})
	makeNew($event: MouseEvent): void{
		this.msg.success("新建部门成功");
		this.infoBoxShow = false ;
		this.getList() ;
	};

	@Service("service.put" , true , function(){
		return (this as DepartComponent).form.value ;
	})
	save( $event: MouseEvent ){
		this.msg.success("部门修改成功") ;
		this.infoBoxShow = false ;
		this.getList() ;
	};
}
