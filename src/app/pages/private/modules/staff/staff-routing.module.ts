import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TablestaffComponent } from './components/tablestaff/tablestaff.component';

const routes: Routes = [{ path: 'all', component: TablestaffComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class StaffRoutingModule {}
