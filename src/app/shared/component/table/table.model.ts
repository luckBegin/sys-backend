interface column {
	title: string;
	reflect: any;
	type: 'text | img | mark | switch';
	fn?: any;
	filter?: any;
}

interface btnGroup {
	type?: 'edit' | 'add' | 'del'
	title?: string;
	fn?: Function
};

export interface TableData {
	columns?: column[];
	data?: object[];
	showIndex?: boolean;
	loading?: boolean;
	btn?: btnGroup;
	page: number;
	change?: Function;
	total?: number;
	preview: boolean;
}
