import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  create_user_interface,
  get_listable_rol_interface,
} from '../interfaces/admin.interfaces';
import { BehaviorSubject, Observable } from 'rxjs';
import Swal from 'sweetalert2';
import { environment } from 'src/environments/environment';
import { async } from '@angular/core/testing';

@Injectable({
  providedIn: 'root',
})
export class AdminService {
  data_user: any = {
    data: {
      id_users: 1,
      name: 'Jesus',
      name2: 'Daniel',
      lastname: 'Garizao',
      lastname2: 'Mejia',
      dni: '1044210431',
      dob: '2023-12-11',
      phone: '3044300928',
      email: 'jesudgm.11@gmail.com',
      address: 'Carrera 11 #39-28',
      entry_date: '2023-12-11',
      card: '',
      exit_date: '2023-12-11',
      weekly_hours: '48:00:00',
      photo: '',
      position: 1,
    },
    roles: [
      {
        id_userxrol: 1,
        id_rol: 1,
        name: 'admin',
        description: 'hola mundo',
        status: 1,
      },
      {
        id_userxrol: 2,
        id_rol: 1,
        name: 'admin',
        description: 'hola mundo',
        status: 1,
      },
      {
        id_userxrol: 3,
        id_rol: 2,
        name: 'admin',
        description: 'hola mundo',
        status: 1,
      },
    ],
    modules: [
      { id_modules: 1, name: 'module_1', description: 'hola mundo', status: 1 },
      { id_modules: 2, name: 'module_2', description: 'hola mundo', status: 1 },
      { id_modules: 3, name: 'module_3', description: 'hola mundo', status: 1 },
    ],
    additional_data: [],
  };

  private urlBack: string = environment.url_backend;
  private list_user = new BehaviorSubject<[]>([]);
  list_user$ = this.list_user.asObservable();
  private id_user = new BehaviorSubject<number>(0);
  id_user$ = this.id_user.asObservable();

  constructor(private httpClient: HttpClient) {}

  get_listable(id_listable: string) {
    return this.httpClient.get(`${this.urlBack}/get_${id_listable}`);
  }

  delete_listable(id_listable: string, id: number) {
    return this.httpClient.delete(
      `${this.urlBack}/delete_${id_listable}/${id}`
    );
  }

  create_listable(id_listable: string, data_listable: any) {
    return this.httpClient.post(
      `${this.urlBack}/create_${id_listable}`,
      data_listable
    );
  }

  update_listable(
    id_listable: string,
    data_listable: any,
    id_listable_1: number
  ) {
    return this.httpClient.put(
      `${this.urlBack}/update_${id_listable}/${id_listable_1}`,
      data_listable
    );
  }

  get_listuser() {
    this.httpClient.get(`${this.urlBack}/get_userss`).subscribe(
      (data: any) => {
        this.list_user.next(data);
      },
      (error) => {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'No se ha podido establecer la conexion, pongase en contacto con el administrador.',
          toast: true,
        });
        console.error(error);
      }
    );
  }

  add_user(data_user: create_user_interface): Observable<any> {
    return this.httpClient.post(`${this.urlBack}/create_users`, data_user);
  }

  upgrader_id_user(id: number) {
    this.id_user.next(id);
  }

  get_id_user() {
    let id_user: string = '';
    this.id_user.subscribe((data) => {
      id_user = data.toString();
    });
    return this.httpClient.get(`${this.urlBack}/get_user/${id_user}`);
  }

  get_userxrol_user(id_user_send: string) {
    return this.httpClient.get(
      `${this.urlBack}/get_userxrol_user/${id_user_send}`
    );
  }

  get_user_modules(id_user_send: string) {
    return this.httpClient.get(
      `${this.urlBack}/get_user_modules/${id_user_send}`
    );
  }

  //Enviar el archivo csv para insertar usuarios
  file_users(data: FormData) {
    return this.httpClient.post(`${this.urlBack}/send_file_users`, data);
  }

  down_users() {
    const url = `${this.urlBack}/get_users_excel`;

    return this.httpClient.get(url, {
      responseType: 'arraybuffer', // Importante para manejar archivos binarios
      observe: 'response', // Para obtener información sobre la respuesta
    });
  }
}
