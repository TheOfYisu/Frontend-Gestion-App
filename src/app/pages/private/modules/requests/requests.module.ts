import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RequestsRoutingModule } from './requests-routing.module';
import { PermissionsComponent } from './components/permissions/permissions.component';
import { ScheduleChangeComponent } from './components/schedule-change/schedule-change.component';


@NgModule({
  declarations: [
    PermissionsComponent,
    ScheduleChangeComponent
  ],
  imports: [
    CommonModule,
    RequestsRoutingModule
  ]
})
export class RequestsModule { }
