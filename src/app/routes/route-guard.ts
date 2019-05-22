import { Injectable , OnInit } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Router } from "@angular/router";
import { SesssionStorageService } from '../service/storage'

@Injectable({providedIn : 'root'})
export class RouteguardService implements CanActivate ,OnInit{

  constructor(
    private router: Router ,
		private sgo : SesssionStorageService,
	) { };
	
	ngOnInit(){
	}
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean{
  	let userInfo = this.sgo.get("loginInfo") ;

  	if(userInfo){
  		return true ;
  	}else{
  		this.router.navigate(['/passport/login'])
	  	return true ;
  	};
  };
}
