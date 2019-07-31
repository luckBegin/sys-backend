import { environment } from '../../environments/environment' ;

const host: string = environment.host;
const system = {
	depart: {
		list: host + '/system/department/tree',
		opera: host + '/system/department',
	},
	menu: {
		tree: host + '/system/menu/tree',
		menu: host + '/system/menu',
	},
	role: {
		list: host + '/system/role',
	},
	staff: {
		staff: host + '/system/staff',
		login: host + '/system/staff/login',
	},
	shop: host + '/system/shop' ,
	config: {
		list :  host + '/system/config' ,
	}
};

const gallery = {
	type: host + '/gallery/type',
	list: host + '/gallery/list',
};

const room = {
	type: host + '/room/type',
	list: host + '/room/list',
	area: host + '/room/area',
	time: host + '/room/time',
	price: host + '/room/price' ,
};
const vip = {
	type: host + '/vip/type'
};
const basic = {
	payment: host + '/basic/payment'
};

export const API = { system , gallery , room , vip , basic };
