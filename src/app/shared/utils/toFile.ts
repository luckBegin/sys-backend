export class FileUtils {
	static CSV(data: Array<any>, columns: string[], fileName: string | number = Date.now()): void {
		const columnStr = columns.join(',') + '\n';

		let dataStr = '';

		data.forEach(item => {
			Object.keys(item).forEach(key => {
				dataStr += item[key] + '\t';
			});
			dataStr += '\n';
		});

		const dataURI = 'data:text/csv;charset=utf-8,\ufeff' + encodeURIComponent(columnStr + dataStr);

		let link = <HTMLAnchorElement>document.createElement('a');

		link.href = dataURI;

		link.download = fileName + '.csv';

		link.click();

		link = null;
	}
}
