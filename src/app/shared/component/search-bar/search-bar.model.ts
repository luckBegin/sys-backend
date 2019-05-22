interface classifyModel {
	fn: Function,
	data: { id: any, name: string }[];
	name: string
}

interface btnModel {
	name: string;
	type: 'search' | 'reset'
	fn: Function
}

interface sectionModel {
	name?: string,
	type: 'input' | 'select' | 'date' | 'dateRange',
	data?: any[],
	placeHolder?: string,
	placeHolders?: string[],
	default?: string;
	model?: string | any;
	format?: string;
}

export interface SearchBarModel {
	classify?: classifyModel;
	btn?: btnModel[],
	sections?: sectionModel[],
	conditions?: sectionModel[],
	notify?: { query: Function, reset: Function }
}
