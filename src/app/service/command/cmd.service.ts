import {Observable} from 'rxjs';

export class CmdService {
	constructor() {
	}

	static copy(text: string): Observable<boolean> {
		let textArea = document.createElement("textarea");
		textArea.value = text;
		document.body.appendChild(textArea);
		textArea.focus();
		textArea.select();

		return new Observable(obsr => {
			try {
				let successful = document.execCommand('copy');
				obsr.next(successful);
			} catch (err) {
				obsr.error(err);
			}
			document.body.removeChild(textArea);
		});
	}
}
