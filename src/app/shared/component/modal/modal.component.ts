import { Component, DoCheck, EventEmitter, Input, Output } from '@angular/core';


@Component({
	selector: 'common-modal',
	template: `
		<nz-modal [nzVisible]="isVisible" [nzTitle]="modalTitle" [nzContent]="modalContent" [nzFooter]="modalFooter"
				  (nzOnCancel)="isVisible = false">
			<ng-template #modalTitle>
				{{ title }}
			</ng-template>

			<ng-template #modalContent>
				<div class="c-flex-row-start">
					<i nz-icon type="info-circle" theme="outline" class="modal-icon"
					   [ngClass]="{'icon-success' : type === 'success' , 'icon-error' : type ==='error' , 'icon-error' : type==='warn'}"></i>
					<p style="margin : 0 ; padding: 0">
						{{ body }}
					</p>
				</div>
			</ng-template>

			<ng-template #modalFooter>
				<button nz-button nzType="default" (click)="handle('cancel')">取消</button>
				<button nz-button nzType="primary" (click)="handle('confirm')">确定</button>
			</ng-template>

		</nz-modal>`,
	styles: [`
        .modal-icon {
            font-size: 30px;
            margin-right: 20px;
        }

        .icon-success {
            color: #579e59
        }

        .icon-error {
            color: #e4322e
        }

        .icon-warn {
            color: #8a6d3b
        }
	`],
})
export class ModalComponent {
	constructor() {
	} ;

	@Input() isVisible: boolean = false;

	@Input() title: string = '提示';

	@Input() body: string = '确认操作?';

	@Input() type: 'success' | 'error' | 'warn' = 'success';

	@Output() confirm: EventEmitter<any> = new EventEmitter();

	@Input() cancel: EventEmitter<any> = new EventEmitter();


	handle(type: string): void {
		type === 'confirm' ?
			this.confirm.emit() : this.cancel.emit();
	};
}
