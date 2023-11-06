import { HttpClient } from '@angular/common/http';
import { Injectable, OnInit } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { data_user_uploader_interface } from '../interfaces/private.interfaces';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import {
  error_conexion_back,
  message_error_token,
} from 'src/app/constant/message.constant';
import { NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class PrivateService implements OnInit {
  private BooleanSideNav = new BehaviorSubject<boolean>(false);
  BooleanSideNav$ = this.BooleanSideNav.asObservable();

  private id_user = new BehaviorSubject<number>(0);
  id_user$ = this.id_user.asObservable();

  private id_rol_user = new BehaviorSubject<number>(0);
  id_rol_user$ = this.id_rol_user.asObservable();

  private data_User = new BehaviorSubject<data_user_uploader_interface>({
    id: '',
    name: '',
    lastname: '',
    photo: '',
  });
  data_User$ = this.data_User.asObservable();

  private modalRef: NgbModalRef | null = null;

  private isLoading = new BehaviorSubject<boolean>(false);
  isLoading$ = this.isLoading.asObservable();

  private urlBack: string = environment.url_backend;
  private token =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvYW4gUGVyZXoiLCJpYXQiOjE1MTYyMzkwMjJ9.2x8QwKfZ0n7Qb2lqW3a7w9u0s6wv1fK4kWlHmLgZy';

  constructor(private httpClient: HttpClient, private router: Router) {}

  ChangeSideNav(data: boolean) {
    this.BooleanSideNav.next(data);
  }

  ngOnInit(): void {
    this.upload_data_user();
    console.log('as', this.id_user.value);
  }

  async upload_data_user() {
    const token_user: string | null = await localStorage.getItem('token');
    const id_userx: string | null = await localStorage.getItem('id');
    if (id_userx === null || id_userx === '') {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Pongase en contacto con el administrador.',
        toast: true,
      });
      console.error('No tiene id el usuario, no se puede cargar.');
    } else {
      this.id_user.next(Number(id_userx));
      this.httpClient
        .get<data_user_uploader_interface>(
          `${this.urlBack}/get_data_user/${id_userx}`
        )
        .subscribe(
          (res) => {
            this.data_User.next(res);
            this.isLoading.next(true);
          },
          (err) => {
            if (err.status == 404) {
              Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Usuario no encontrado.',
                toast: true,
              });
              this.isLoading.next(true);
            } else {
              Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Pongase en contacto con el administrador.',
                toast: true,
                confirmButtonText: 'OK',
              }).then((result) => {
                if (result.isConfirmed) {
                  this.router.navigate(['/public/login']);
                }
              });
            }
          }
        );
    }
  }

  charge_userId(user_id: number) {
    this.id_user.next(user_id);
  }

  charge_rol_user(id_rol: number) {
    this.id_rol_user.next(id_rol);
  }

  no_charge_data(msn: string) {
    Swal.fire({
      confirmButtonText: 'OK',
      icon: 'error',
      title: 'Oops...',
      text: msn,
    }).then((result) => {
      if (result.isConfirmed) {
        this.router.navigate(['/public/login']);
      }
    });
  }

  setModalRef(modalRef: NgbModalRef): void {
    this.modalRef = modalRef;
  }

  closeModal(): void {
    if (this.modalRef) {
      this.modalRef.dismiss();
      this.modalRef = null;
    }
  }
}
