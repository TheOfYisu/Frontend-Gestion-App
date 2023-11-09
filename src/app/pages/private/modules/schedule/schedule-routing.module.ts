import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CalendarComponent } from './components/calendar/calendar.component';
import { ProgramComponent } from './components/program/program.component';

const routes: Routes = [
  { path: 'calendar', component: CalendarComponent },
  { path: 'program', component: ProgramComponent }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ScheduleRoutingModule {}
