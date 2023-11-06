import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AdminService } from 'src/app/core/services/admin.service';
import { PrivateService } from 'src/app/core/services/private.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-user.form',
  templateUrl: './user.form.component.html',
  styleUrls: ['./user.form.component.scss'],
})
export class UserFormComponent {
  public list_rol: any;
  public list_position: any;
  constructor(
    private FormBuilder: FormBuilder,
    private PrivateService: PrivateService,
    private AdminService: AdminService
  ) {
    this.CreateFormDataBasic();
    this.get_rol();
    this.get_position();
  }

  private file_img: any;
  public fileselected: boolean = false;

  public FormData: FormGroup = this.CreateFormDataBasic();
  public generatepassword: boolean = false;

  CreateFormDataBasic() {
    return (this.FormData = this.FormBuilder.group({
      name: ['', Validators.required],
      name2: [''],
      lastname: ['', Validators.required],
      lastname2: [''],
      dni: ['', Validators.required],
      dob: ['', Validators.required],
      phone: ['', Validators.required],
      email: ['', [Validators.email, Validators.required]],
      address: ['', Validators.required],
      date_entry: ['', Validators.required],
      status: ['', Validators.required],
      password: ['', Validators.required],
      rol: ['', Validators.required],
      hours_weekly: ['', Validators.required],
      position: ['', Validators.required],
      card: [''],
    }));
  }

  save_form() {
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
        this.FormData.get('dob')?.setValue(
          this.parseDateStringToDate(this.FormData.get('dob')?.value)
        );
        this.FormData.get('date_entry')?.setValue(
          this.parseDateStringToDate(this.FormData.get('date_entry')?.value)
        );
        this.FormData.get('hours_weekly')?.setValue(
          this.numberToTimeWithSeconds(this.FormData.get('hours_weekly')?.value)
        );
        this.FormData.get('rol')?.setValue(
          Number(this.FormData.get('rol')?.value)
        );
        this.FormData.get('position')?.setValue(
          Number(this.FormData.get('position')?.value)
        );
        this.FormData.get('status')?.setValue(
          Number(this.FormData.get('status')?.value)
        );
        console.log(this.FormData.value);
        this.AdminService.add_user(this.FormData.value).subscribe(
          (response) => {
            if (response.status === 203) {
              Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: response.error,
                toast: true,
              });
            } else if (response.status === 200) {
              this.AdminService.get_listuser();
              Swal.fire({
                position: 'top-end',
                icon: 'success',
                title: 'Your work has been saved',
                showConfirmButton: false,
                timer: 1500,
                toast: true,
              });
              this.PrivateService.closeModal();
            }
          },
          (error) => {
            console.log(error);
            Swal.fire({
              icon: 'error',
              title: 'Oops...',
              text: error.message,
              toast: true,
            });
          }
        );
      }
    });
  }

  get valid_form(): boolean {
    return this.FormData.valid;
  }

  //Cargar Archivo
  onFileSelected(event: any) {
    this.file_img = event.target.files[0];
    this.fileselected = true;
  }

  //Genera la contraseña automatica
  generatePassword() {
    const charset =
      'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*_?/';
    let password = '';
    for (let i = 0; i < 12; i++) {
      const randomIndex = Math.floor(Math.random() * charset.length);
      password += charset.charAt(randomIndex);
    }
    this.FormData.get('password')?.setValue(password);
    this.generatepassword = true;
  }

  isFieldInvalid(fieldName: string) {
    const field = this.FormData.get(fieldName);
    return field?.invalid && (field.dirty || field.touched);
  }

  isFieldDirty(fieldName: string): boolean {
    const field = this.FormData.get(fieldName);
    return field?.dirty ?? false;
  }

  isFieldValid(fieldName: string): boolean {
    const field = this.FormData.get(fieldName);
    return field?.valid ?? false;
  }

  close_modal() {
    Swal.fire({
      title: '¿Estás seguro?',
      text: 'Que quiere cancelar?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, estoy seguro!',
      toast: true,
    }).then((result) => {
      if (result.isConfirmed) {
        this.PrivateService.closeModal();
      }
    });
  }

  parseDateStringToDate(dateObject: {
    year: number;
    month: number;
    day: number;
  }): string | null {
    const { year, month, day } = dateObject;

    if (day < 1 || day > 31 || month < 1 || month > 12) {
      return null;
    }

    const dateStr = `${year}-${month.toString().padStart(2, '0')}-${day
      .toString()
      .padStart(2, '0')}`;
    return dateStr;
  }

  get_rol() {
    this.AdminService.get_listable('rol').subscribe(
      (res) => {
        this.list_rol = res;
      },
      (error) => {
        console.log(error);
      }
    );
  }

  get_position() {
    this.AdminService.get_listable('position').subscribe(
      (res) => {
        this.list_position = res;
      },
      (error) => {
        console.log(error);
      }
    );
  }

  numberToTimeWithSeconds(totalHours: number): string {
    const hours = Math.floor(totalHours);
    const minutes = Math.round((totalHours - hours) * 60);
    return `${hours.toString().padStart(2, '0')}:${minutes
      .toString()
      .padStart(2, '0')}:00`;
  }

  // updateleader($event: any) {
  //   this.StaffService.getupdateleader($event.target.value).subscribe(
  //     (res) => {
  //       console.log(res);
  //       this.leader = res;
  //     },
  //     (error) => {}
  //   );
  // }
}
