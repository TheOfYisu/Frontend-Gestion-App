import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StaffRoutingModule } from './staff-routing.module';
import { AgGridModule } from 'ag-grid-angular';
import { TablestaffComponent } from './components/tablestaff/tablestaff.component';

@NgModule({
  declarations: [TablestaffComponent],
  imports: [CommonModule, StaffRoutingModule, AgGridModule],
})
export class StaffModule {}
