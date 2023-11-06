import { Component } from '@angular/core';

@Component({
  selector: 'app-navbar-user',
  templateUrl: './navbar-user.component.html',
  styleUrls: ['./navbar-user.component.scss'],
})
export class NavbarUserComponent {
  public navbar_profile = [
    {
      id: 0,
      value: 'Datos',
      icon: 'bi bi-person-circle',
      url: '/manager/user/profile',
    },
    {
      id: 1,
      value: 'Horarios',
      icon: 'bi bi-calendar-event',
      url: '/manager/user/schedules',
    },
    {
      id: 2,
      value: 'Reportes',
      icon: 'bi bi-table',
      url: '/manager/user/reports',
    },
    // {
    //   id: 3,
    //   value: 'Solicitudes',
    //   icon: 'bi bi-envelope-fill',
    //   url: '/manager/user/requests',
    // },
  ];
}
