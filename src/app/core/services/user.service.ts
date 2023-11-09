import { HttpClient } from '@angular/common/http';
import { Injectable, OnInit } from '@angular/core';
import { PrivateService } from './private.service';
import { data_user_profile_interface } from '../interfaces/private.interfaces';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class UserService implements OnInit {
  private id_user: number = 0;
  private urlBack: string = environment.url_backend;

  constructor(
    private httpClient: HttpClient,
    private PrivateService: PrivateService
  ) {}

  ngOnInit(): void {}

  //optiene el id del usuario almacenado en el servicio privado
  get_id_user() {
    this.PrivateService.id_user$.subscribe((data) => {
      this.id_user = data;
    });
  }

  //get para los datos del perfil del usuario
  get_data_user() {
    return this.httpClient.get<data_user_profile_interface>(
      `${this.urlBack}/get_user/${this.id_user}`
    );
  }

  //get para los horarios dentro del rango de dias
  get_data_schedules(date_init: string, date_finish: string) {
    return this.httpClient.get<any>(
      `${this.urlBack}/get_schedules_user/${this.id_user}/${date_init}/${date_finish}`
    );
  }

  update_user_profile(data: any, id: number) {
    return this.httpClient.put(
      `${this.urlBack}/update_user_profile/${id}`,
      data
    );
  }
}
