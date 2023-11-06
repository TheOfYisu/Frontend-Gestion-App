import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ReportsRoutingModule } from './reports-routing.module';
import { AttendanceComponent } from './components/attendance/attendance.component';
import { ProductivityComponent } from './components/productivity/productivity.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AgGridModule } from 'ag-grid-angular';

@NgModule({
  declarations: [AttendanceComponent, ProductivityComponent],
  imports: [
    CommonModule,
    ReportsRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    AgGridModule,
  ],
})
export class ReportsModule {}
