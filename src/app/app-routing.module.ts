import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PublicModule } from './pages/public/public.module';
import { NotFoundComponent } from './pages/public/layout/not-found/not-found.component';
import { PrivateModule } from './pages/private/private.module';

const routes: Routes = [
  { path: '', redirectTo: '/public/home', pathMatch: 'full' },
  { path: 'public', loadChildren: () => PublicModule },
  { path: 'manager', loadChildren: () => PrivateModule },
  { path: '**', component: NotFoundComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
