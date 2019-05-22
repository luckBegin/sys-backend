import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
// delon
import { AlainThemeModule } from '@delon/theme';
import { DelonABCModule } from '@delon/abc';
import { DelonACLModule } from '@delon/acl';
import { DelonFormModule } from '@delon/form';
// #region third libs
import { NgZorroAntdModule } from 'ng-zorro-antd';
import { CountdownModule } from 'ngx-countdown';
const THIRDMODULES = [
  NgZorroAntdModule,
  // CountdownModule
];
// #endregion
import { TableComponent } from './component/table/table.component';
import { SearchBarComponent } from './component/search-bar/search-bar.component';
import { ModalComponent } from './component/modal/modal.component';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
// import { HttpIntercept } from '@shared/interceptor.service';
import { HttpIntercept } from './interceptor.service' ;
// #region your componets & directives
const COMPONENTS = [ TableComponent , SearchBarComponent , ModalComponent  ];
const DIRECTIVES = [];
// #endregion

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    ReactiveFormsModule,
    AlainThemeModule.forChild(),
    DelonABCModule,
    DelonACLModule,
    DelonFormModule,
    // third libs
    ...THIRDMODULES
  ],
  declarations: [
    // your components
    ...COMPONENTS,
    ...DIRECTIVES
  ],
  exports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    AlainThemeModule,
    DelonABCModule,
    DelonACLModule,
    DelonFormModule,
    // third libs
    ...THIRDMODULES,
    // your components
    ...COMPONENTS,
    ...DIRECTIVES ,
  ],
  providers : [
    { provide: HTTP_INTERCEPTORS, useClass: HttpIntercept, multi: true }
  ]
})
export class SharedModule { }
