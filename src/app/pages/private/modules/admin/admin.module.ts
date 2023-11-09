import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminRoutingModule } from './admin-routing.module';
import { AgGridModule } from 'ag-grid-angular';
import { UsersAllComponent } from './components/users.all/users.all.component';
import { UserFormComponent } from './components/user.form/user.form.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbDatepickerModule } from '@ng-bootstrap/ng-bootstrap';
import { ListableComponent } from './components/listable/listable.component';
import { UserComponent } from './components/user/user.component';

@NgModule({
  declarations: [UsersAllComponent, UserFormComponent, ListableComponent, UserComponent],
  imports: [
    CommonModule,
    AdminRoutingModule,
    AgGridModule,
    NgbDatepickerModule,
    FormsModule,
    ReactiveFormsModule,
  ],
})
export class AdminModule {}
