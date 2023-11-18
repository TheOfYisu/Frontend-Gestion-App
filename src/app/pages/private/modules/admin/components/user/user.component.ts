import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { forkJoin } from 'rxjs';
import {
  get_listable_modules_interface,
  get_listable_rol_interface,
} from 'src/app/core/interfaces/admin.interfaces';
import { AdminService } from 'src/app/core/services/admin.service';
import { environment } from 'src/environments/environment.development';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss'],
})
export class UserComponent implements OnInit {
  public form_data: FormGroup = this.create_form_data();
  public form_rol: FormGroup = this.create_form_rol();
  public form_modules: FormGroup = this.create_form_modules();
  private form_data_copy: any;

  public list_rol: any;
  public list_modules: any;

  private id_table: string = '';
  public edit_tables: boolean = false;
  private file_img: any;
  private formget: any;

  public valid_edit: boolean = false;
  public imgUser: string = '';
  public fileselected: boolean = false;
  public generatepassword: boolean = false;
  public leader: any;
  public selectstatus: boolean = false;
  public isLoading: boolean = true;

  public data_table_module: any = [];
  public data_table_rol: any = [];

  constructor(
    private FormBuilder: FormBuilder,
    private Router: Router,
    private modalService: NgbModal,
    private AdminService: AdminService
  ) {
    this.AdminService.id_user$.subscribe((data) => {
      this.updatedata(data);
    });
  }

  ngOnInit(): void {
    this.uploade_listable();
  }

  name_butom_password = { value: '', rol: '', edit_id: false, id: '' };

  create_form_data() {
    return (this.form_data = this.FormBuilder.group({
      id_users: [''],
      name: ['', Validators.required],
      name2: [''],
      lastname: ['', Validators.required],
      lastname2: [''],
      photo: [''],
      dni: ['', Validators.required],
      dob: ['', Validators.required],
      phone: ['', Validators.required],
      email: ['', [Validators.email, Validators.required]],
      address: ['', Validators.required],
      entry_date: ['', Validators.required],
      exit_date: [''],
      weekly_hours: ['', Validators.required],
      position: ['', Validators.required],
      card: [''],
    }));
  }

  get valid_form(): boolean {
    return this.valid_edit && this.form_data.valid;
  }

  create_form_rol() {
    return (this.form_rol = this.FormBuilder.group({
      id_rol: [{ value: null }, Validators.required],
      description: [{ value: null }, Validators.required],
      status: [null, Validators.required],
    }));
  }

  create_form_modules() {
    return (this.form_modules = this.FormBuilder.group({
      id_rol: [{ value: null }, Validators.required],
      id_modules: [{ value: null }, Validators.required],
      description: [{ value: null }, Validators.required],
      status: [null, Validators.required],
    }));
  }

  //Carge de datos del usuario
  updatedata(data_id: number) {
    this.AdminService.get_id_user(data_id).subscribe(
      (data: any) => {
        console.log(data_id, data);
        this.form_data.setValue(data);
        if (data.photo === '' || data.photo === null) {
          data.photo = environment.photo_user;
        }

        data.dob = this.convert_DateString_DateObjet(data.dob);
        data.entry_date = this.convert_DateString_DateObjet(data.entry_date);

        const exit_date = data.exit_date;

        if (exit_date !== null) {
          data.exit_date = this.convert_DateString_DateObjet(data.exit_date);
        } else {
          data.exit_date = this.convert_DateString_DateObjet('0000-00-00');
        }

        data.weekly_hours = this.convertirhora(data.weekly_hours);
        this.form_data.setValue(data);
        this.form_data_copy = data;
        this.form_data.disable();

        this.AdminService.get_userxrol_user(data.id_users).subscribe((data) => {
          this.data_table_rol = data;
        });

        this.AdminService.get_user_modules(data.id_users).subscribe((data) => {
          this.data_table_module = data;
        });
      },
      (error) => {
        alert(error.detail);
      }
    );
  }

  //Cargar los datos de las listas al momento de agregar.
  uploade_listable() {
    this.AdminService.get_listable('rol').subscribe((data) => {
      this.list_rol = data;
    });
    this.AdminService.get_listable('modules').subscribe((data) => {
      this.list_modules = data;
    });
  }

  add_listable(content: any, table: string) {
    this.edit_tables = false;
    this.form_rol.get('id_rol')?.enable();
    this.form_rol.updateValueAndValidity();
    if (table === 'rol') {
    } else if (table === 'modules') {
      this.form_modules.get('id_modules')?.enable();
      this.form_modules.get('id_rol')?.enable();
      this.form_modules.updateValueAndValidity();
      if (this.id_table) {
        this.form_modules.removeControl(this.id_table);
        this.form_modules.reset();
      }
    }
    this.modalService.open(content);
  }

  async update_listable(item: any, table: string, content: any) {
    this.edit_tables = true;
    if (table === 'rol') {
      const datauser = {
        id_rolxuser: item.id_rolxuser,
        id_rol: item.id_rol,
        description: item.description,
        status: item.status,
      };
      this.id_table = 'id_rolxuser';
      if (this.form_rol.get(this.id_table)) {
        this.form_rol.removeControl(this.id_table);
        this.form_rol.updateValueAndValidity();
      }
      this.form_rol.addControl(
        this.id_table,
        this.FormBuilder.control([
          { value: null, disabled: true },
          Validators.required,
        ])
      );
      this.form_rol.updateValueAndValidity();
      this.form_rol.setValue(datauser);
      const list_campos = ['id_rolxuser', 'id_rol', 'description'];
      for (let item of list_campos) {
        this.desactivarCampo(this.form_rol, item);
      }
    }
    if (table === 'modules') {
      const datauser = {
        id_userxrolxmod: item.id_userxrolxmod,
        id_rol: item.id_rol,
        id_modules: item.id_module,
        description: item.description,
        status: item.status,
      };
      this.id_table = 'id_userxrolxmod';
      if (this.form_modules.get(this.id_table)) {
        this.form_modules.removeControl(this.id_table);
        this.form_modules.updateValueAndValidity();
      }
      this.form_modules.addControl(
        this.id_table,
        this.FormBuilder.control([{ value: null }, Validators.required])
      );
      this.form_modules.updateValueAndValidity();
      this.form_modules.setValue(datauser);
      const list_campos = [
        'id_rolxuser',
        'id_rol',
        'id_modules',
        'description',
        'id_userxrolxmod',
      ];
      for (let item of list_campos) {
        this.desactivarCampo(this.form_modules, item);
      }
    }

    this.modalService.open(content);
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
        this.modalService.dismissAll();
      }
    });
  }

  edit_form_data() {
    this.valid_edit = true;
    this.form_data.enable();
  }

  save_form_data() {
    let hasChanges = false;
    Object.keys(this.form_data.controls).forEach((key) => {
      const currentValue = this.form_data.controls[key].value;
      const initialValue = this.form_data_copy[key];
      if (currentValue !== initialValue) {
        hasChanges = true;
      } else {
        this.form_data.disable();
        this.valid_edit = false;
      }
    });
    if (hasChanges) {
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
          alert(' si camibio');
          this.valid_edit = false;
        }
      });
    }
  }

  //Carge de foto del usuario- ==>
  onFileSelected(event: any) {
    this.file_img = event.target.files[0];
    this.fileselected = true;
  }

  //Style de las validaciones de los imput- ==>
  isFieldInvalid(fieldName: string) {
    const field = this.form_data.get(fieldName);
    return field?.invalid && (field.dirty || field.touched);
  }

  isFieldDirty(fieldName: string): boolean {
    const field = this.form_data.get(fieldName);
    return field?.dirty ?? false;
  }

  isFieldValid(fieldName: string): boolean {
    const field = this.form_data.get(fieldName);
    return field?.valid ?? false;
  }

  // Convertir Hora a numero entero.
  convertirhora(tiempoString: any) {
    const partesTiempo = tiempoString.split(':');
    if (partesTiempo.length === 3) {
      const horas = parseInt(partesTiempo[0], 10);
      return horas;
    } else {
      return '';
    }
  }

  //Converrir fecha de string a objetos
  convert_DateString_DateObjet(dateString: string): {
    year: number;
    month: number;
    day: number;
  } {
    const fechaPartes = dateString.split('-');
    const year = parseInt(fechaPartes[0], 10);
    const month = parseInt(fechaPartes[1], 10);
    const day = parseInt(fechaPartes[2], 10);
    return { year, month, day };
  }

  desactivarCampo(formulario: FormGroup, nombreCampo: string) {
    if (formulario.get(nombreCampo)) {
      formulario.get(nombreCampo)?.disable();
    }
  }
}
