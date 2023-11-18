import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PrivateRoutingModule } from './private-routing.module';
import { PrivateComponent } from './private.component';
import { SidenavComponent } from './layout/sidenav/sidenav.component';
import { NavbarComponent } from './layout/navbar/navbar.component';
import { ChatbotComponent } from './components/chatbot/chatbot.component';
import { FormsModule } from '@angular/forms';
import { SelectLoginComponent } from './components/select-login/select-login.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';

@NgModule({
  declarations: [
    PrivateComponent,
    SidenavComponent,
    NavbarComponent,
    DashboardComponent,
    ChatbotComponent,
    SelectLoginComponent,
  ],
  imports: [CommonModule, PrivateRoutingModule, FormsModule],
})
export class PrivateModule {}
