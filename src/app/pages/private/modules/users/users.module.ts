import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UsersRoutingModule } from './users-routing.module';
import { ProfileComponent } from './components/profile/profile.component';
import { NavbarUserComponent } from '../../layout/navbar-user/navbar-user.component';
import { SchedulesComponent } from './components/schedules/schedules.component';
import { ReportsComponent } from './components/reports/reports.component';
import { RequestsComponent } from './components/requests/requests.component';
import { AgGridModule } from 'ag-grid-angular';
import { NgbDatepickerModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    ProfileComponent,
    NavbarUserComponent,
    SchedulesComponent,
    ReportsComponent,
    RequestsComponent,
  ],
  imports: [
    CommonModule,
    UsersRoutingModule,
    AgGridModule,
    NgbDatepickerModule,
    FormsModule,
    ReactiveFormsModule,
  ],
})
export class UsersModule {}
