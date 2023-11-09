import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProfileComponent } from './components/profile/profile.component';
import { ReportsComponent } from './components/reports/reports.component';
import { SchedulesComponent } from './components/schedules/schedules.component';
import { RequestsComponent } from './components/requests/requests.component';

const routes: Routes = [
  { path: 'profile', component: ProfileComponent },
  {
    path: 'reports',
    component: ReportsComponent,
  },
  { path: 'schedules', component: SchedulesComponent },
  { path: 'requests', component: RequestsComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UsersRoutingModule {}
