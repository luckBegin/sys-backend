interface column {
	title: string;
	reflect?: any;
	type: 'text' | 'img' | 'mark' | 'switch';
	fn?: any;
	filter?: any;
	preview?: boolean;
}
interface btnItem {
	type?: 'edit' | 'add' | 'del'
	title?: string;
	fn?: Function ;
	show?: ( data?: any)=> {}
}
interface btnGroup {
	title?: string ,
	items?: btnItem[]
}

export interface TableData {
	columns?: column[];
	data?: object[];
	showIndex?: boolean;
	loading?: boolean;
	btn?: btnGroup;
	page: number;
	change?: Function;
	total?: number;
	hidePage?: boolean;
	showCheckBox?: boolean ;
	checkedRows?: number[] ;
	checkedShow?: ( data?: any)=> {}
}
