import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ScheduleRoutingModule } from './schedule-routing.module';
import { CalendarComponent } from './components/calendar/calendar.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ProgramComponent } from './components/program/program.component';
import { AgGridModule } from 'ag-grid-angular';
import { ChangeComponent } from './components/change/change.component';
import { NgbDatepickerModule } from '@ng-bootstrap/ng-bootstrap';
import { SchedulesFormpermissionsComponent } from './components/schedules.formpermissions/schedules.formpermissions.component';
import { SchedulesGenerateComponent } from './components/schedules.generate/schedules.generate.component';

@NgModule({
  declarations: [
    CalendarComponent,
    ProgramComponent,
    ChangeComponent,
    SchedulesFormpermissionsComponent,
    SchedulesGenerateComponent,
  ],

  imports: [
    CommonModule,
    ScheduleRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    AgGridModule,
    NgbDatepickerModule,
  ],
})
export class ScheduleModule {}
