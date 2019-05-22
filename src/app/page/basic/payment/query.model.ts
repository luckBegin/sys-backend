import {Validators} from "@angular/forms";

export class QueryModel{
	currentPage: number = 1 ;
	pageSize: number =  10 ;
	isCheckout: string ;
	isCancel: string ;
	isInvest: string ;
	isTurnover: string ;
	isIncome: string ;
}
