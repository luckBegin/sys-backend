import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { TableData } from '@shared/component/table/table.model';
import { ngIfAnimation } from '../../../routes/router-animation';

@Component({
    selector: 'common-table',
    templateUrl: './table.component.html',
    styleUrls: ['./table.component.less'],
    animations: [ngIfAnimation],
})
export class TableComponent implements OnInit {
    ngOnInit() {
    };
    
    @Input()
    TableData: TableData;
    
    @Output()
    change: EventEmitter<any> = new EventEmitter();
    icoActive: string = 'top';
    icoIndex: number;
    isVisible: boolean = false;
    imgSrc: string = '';
    thChecked: boolean = false;
    setUp(fn, idx) {
        if (this.icoActive == 'top') {
            this.icoActive = 'bottom';
        } else {
            this.icoActive = 'top';
        }
        this.icoIndex = idx;
        fn(this.icoActive);
    };
    
    pageChange(type: string, number: number) {
        this.TableData.change(type, number);
    };
    
    private isStr(str: any): boolean {
        return typeof str === 'string';
    };
    
    imgTrigger(column: any, data: any) {
        if (column.preview) {
            this.isVisible = true;
            this.imgSrc = data[column.reflect];
            return;
        }
        
        if (column.fn) {
            column.fn(data);
        }
    };
    
    thCheckedChange($event: boolean): void {
        if ($event) {
            for (let i = 0; i < this.TableData.data.length; i++) {
                this.TableData.checkedRows.push(i);
            }
        } else {
            this.TableData.checkedRows = [];
        }
    }
    
    tdCheckedChange($event: boolean, idx: number): void {
        if ($event) {
            this.TableData.checkedRows.push(idx);
        } else {
            const index = this.TableData.checkedRows.indexOf(idx);
            this.TableData.checkedRows.splice(index, 1);
        }
    }
}
