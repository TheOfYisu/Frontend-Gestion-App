import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AttendanceComponent } from './components/attendance/attendance.component';
import { ProductivityComponent } from './components/productivity/productivity.component';

const routes: Routes = [
  {path:'attendance', component:AttendanceComponent},
  {path:'productivity', component:ProductivityComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReportsRoutingModule { }
