import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { API } from '../API';
import { Observable } from 'rxjs';
import { DELETE, GET, POST, PUT } from '../../../decorators/request.decorator';
import { MsgService } from '../msg/msg.service';
import { ENUM } from '../../models';

@Injectable({ providedIn: 'root' })
export class SysMenuService {
	constructor(private http: HttpClient, private msg: MsgService) {
	}

	getLoginMenu(usrId: Number) {
		return new Observable(obsr => {
			obsr.next({
				success: true,
				data: [{
					'id': 11,
					'createTime': 1530189316000,
					'modifyTime': 1530196529000,
					'createOperatorId': null,
					'modifyOperatorId': 3,
					'modifyOperatorName': null,
					'parentId': null,
					'isButton': 0,
					'buttonKey': null,
					'iconPath': 'anticon anticon-bars',
					'enabled': 1,
					'menuDescriptions': [{
						'id': 269,
						'createTime': 1535957388000,
						'modifyTime': null,
						'createOperatorId': 3,
						'modifyOperatorId': null,
						'modifyOperatorName': null,
						'menuId': 11,
						'locale': 'zh_CN',
						'description': '系统设置',
						'enabled': 1,
					}],
					'children': [{
						'id': 11,
						'createTime': 1530189316000,
						'modifyTime': 1530196529000,
						'createOperatorId': null,
						'modifyOperatorId': 3,
						'modifyOperatorName': null,
						'parentId': null,
						'isButton': 0,
						'buttonKey': null,
						'iconPath': 'anticon anticon-bars',
						'enabled': 1,
						'url': '/system/menu',
						'menuDescriptions': [{
							'id': 269,
							'createTime': 1535957388000,
							'modifyTime': null,
							'createOperatorId': 3,
							'modifyOperatorId': null,
							'modifyOperatorName': null,
							'menuId': 11,
							'locale': 'zh_CN',
							'description': '系统菜单设置',
							'enabled': 1,
						}],
						'children': [],
					}, {
						'id': 11,
						'createTime': 1530189316000,
						'modifyTime': 1530196529000,
						'createOperatorId': null,
						'modifyOperatorId': 3,
						'modifyOperatorName': null,
						'parentId': null,
						'isButton': 0,
						'buttonKey': null,
						'iconPath': 'anticon anticon-bars',
						'enabled': 1,
						'url': '/system/depart',
						'menuDescriptions': [{
							'id': 269,
							'createTime': 1535957388000,
							'modifyTime': null,
							'createOperatorId': 3,
							'modifyOperatorId': null,
							'modifyOperatorName': null,
							'menuId': 11,
							'locale': 'zh_CN',
							'description': '管理员设置',
							'enabled': 1,
						}],
						'children': [],
					}],
				}],
			});
		});
	};

	@GET(API.system.menu.tree)
	getMenuTree(param: any): any {
	};

	@POST(API.system.menu.menu, true, '新增菜单失败,原因:')
	post(data: object): any {
	};

	@DELETE(API.system.menu.menu)
	delete(data: any): any {
	};

	@PUT(API.system.menu.menu)
	put(data: object): any {
	};
}
