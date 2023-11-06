import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { data_user_profile_interface } from 'src/app/core/interfaces/private.interfaces';
import { UserService } from 'src/app/core/services/user.service';
import { environment } from 'src/environments/environment.development';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit {
  public isLoading: boolean = true;

  constructor(
    private UserService: UserService,
    private NgbModal: NgbModal,
    private fb: FormBuilder
  ) {
    this.UserService.get_id_user();
  }

  public formulario: FormGroup = this.creteform();

  creteform() {
    return (this.formulario = this.fb.group({
      phone: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      address: ['', Validators.required],
    }));
  }

  public data_user: data_user_profile_interface = {
    id_users: 0,
    name: '',
    charge: '',
    leader: '',
    photo: '',
    dni: '',
    dob: '',
    age: 0,
    phone: '',
    email: '',
    address: '',
    date_enter: '',
    status: '',
  };

  upgrade_data_user() {
    this.UserService.get_data_user().subscribe(
      (data) => {
        console.log(data);
        if (data.photo === null || data.photo === '') {
          data.photo = environment.photo_user;
        }
        this.data_user = data;
        this.isLoading = false;
      },
      (err) => {
        console.error(err);
      }
    );
  }

  ngOnInit(): void {
    this.upgrade_data_user();
    this.formulario.patchValue({
      phone: '1234567890',
      email: 'correo@ejemplo.com',
      address: '123 Calle Ejemplo',
    });
  }

  //Carge de archivo con muchos usuarios
  upload_users(content: any, data_user: any) {
    const data = {
      phone: data_user.phone,
      email: data_user.email,
      address: data_user.address,
    };
    this.formulario.setValue(data);
    this.NgbModal.open(content);
  }

  close_modal(modal: any, type: string) {
    Swal.fire({
      title: '¿Estás seguro?',
      text: `Que quiere ${type}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, estoy seguro!',
      toast: true,
    }).then((result) => {
      if (result.isConfirmed) {
        this.NgbModal.dismissAll();
      }
    });
  }

  send_file() {
    Swal.fire({
      title: '¿Estás seguro?',
      text: '¿Toda la informacion es correcta?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, estoy seguro!',
      toast: true,
    }).then((result) => {
      if (result.isConfirmed) {
        this.UserService.update_user_profile(
          this.formulario.value,
          this.data_user.id_users
        ).subscribe(
          (res) => {
            this.upgrade_data_user();
            Swal.fire({
              position: 'top-end',
              icon: 'success',
              title: 'Your work has been saved',
              showConfirmButton: false,
              timer: 1500,
              toast: true,
            });
            this.NgbModal.dismissAll();
          },
          (err) => {
            Swal.fire({
              icon: 'error',
              title: 'Oops...',
              text: err.message,
              toast: true,
            });
          }
        );
      }
    });
  }
}
