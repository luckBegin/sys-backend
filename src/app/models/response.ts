export interface RESPONSE {
	success: boolean;
	data: any
	message: string;
	code: number;
	page: Page;
	timeStamp: number ;
};

interface Page {
	pageSize: number
	totalNumber: number
	totalPage: number;
};
