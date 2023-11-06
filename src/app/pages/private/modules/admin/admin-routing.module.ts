import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UsersAllComponent } from './components/users.all/users.all.component';
import { ListableComponent } from './components/listable/listable.component';
import { UserComponent } from './components/user/user.component';

const routes: Routes = [
  { path: 'all', component: UsersAllComponent },
  { path: 'listable', component: ListableComponent },
  { path: 'user', component: UserComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdminRoutingModule {}
