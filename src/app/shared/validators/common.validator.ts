import { FormControl } from "@angular/forms";
import { RegUtils } from "@shared/utils";

export class CommonValidator {
	static isNumber(length: string | number ): any{
		return ( control: FormControl ): any => {
			const val = control.value ;
			const valid = RegUtils.isNumber( val , length ) ;
			return valid ? null : { 'invalid': true };
		}
	}
}