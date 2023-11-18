import { Injectable } from '@angular/core';
import { login_interface } from '../interfaces/public.interfaces';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';
import { PrivateService } from './private.service';
import {
  NgbModal,
  NgbModalOptions,
  NgbModalRef,
} from '@ng-bootstrap/ng-bootstrap';
import { SelectLoginComponent } from 'src/app/pages/private/components/select-login/select-login.component';

@Injectable({
  providedIn: 'root',
})
export class PublicService {
  private urlBack: string = environment.url_backend;
  public BooleanSideNav$: any;

  private modalRef: NgbModalRef | null = null;

  constructor(
    private httpClient: HttpClient,
    private router: Router,
    private PrivateService: PrivateService,
    private NgbModal: NgbModal
  ) {}

  setModalRef(modalRef: NgbModalRef): void {
    this.modalRef = modalRef;
  }

  closeModal(): void {
    console.log(this.modalRef);
    if (this.modalRef) {
      this.modalRef.dismiss();
      this.modalRef = null;
    }
  }

  validLogin(data: login_interface) {
    this.httpClient.post(`${this.urlBack}/login`, data).subscribe(
      (res: any) => {
        if (res.status_code === 200) {
          // Inicio de sesión exitoso
          // Puedes manejar el token aquí y redirigir al usuario
          // localStorage.setItem('token', res.token);
          localStorage.setItem('id', res.user_id);
          this.setModalRef(this.NgbModal.open(SelectLoginComponent));
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: res.detail,
            toast: true,
          });
        }
      },
      (error) => {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Pongase en contacto con el administrador.',
          toast: true,
        });
        console.error(error);
      }
    );
  }
}
