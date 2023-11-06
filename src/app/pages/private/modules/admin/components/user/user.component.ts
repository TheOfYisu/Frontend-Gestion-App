import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
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

  public data_table_module: any;
  public data_table_rol: any;

  constructor(
    private FormBuilder: FormBuilder,
    private Router: Router,
    private modalService: NgbModal,
    private AdminService: AdminService
  ) {
    this.updatedata();
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
      id_rol: [{ value: null, disabled: true }, Validators.required],
      description: [{ value: null, disabled: true }, Validators.required],
      status: [null, Validators.required],
    }));
  }

  create_form_modules() {
    return (this.form_modules = this.FormBuilder.group({
      id_rol: [{ value: null, disabled: true }, Validators.required],
      id_modules: [{ value: null, disabled: true }, Validators.required],
      description: [{ value: null, disabled: true }, Validators.required],
      status: [null, Validators.required],
    }));
  }

  //Carge de datos del usuario
  updatedata() {
    // this.AdminService.get_id_user().subscribe(
    //   (data: any) => {
    //     this.FormData.setValue(data.data);
    let data = this.AdminService.get_id_user();
    if (data.data.photo === '') {
      data.data.photo = environment.photo_user;
    }
    data.data.dob = this.convert_DateString_DateObjet(data.data.dob);
    data.data.entry_date = this.convert_DateString_DateObjet(
      data.data.entry_date
    );
    const exit_date = data.data.exit_date;
    if (exit_date != '' || exit_date != null) {
      data.data.exit_date = this.convert_DateString_DateObjet(
        data.data.exit_date
      );
    } else {
      data.data.exit_date(this.convert_DateString_DateObjet('0000-00-00'));
    }
    data.data.weekly_hours = this.convertirhora(data.data.weekly_hours);
    this.data_table_rol = data.roles;
    this.data_table_module = data.modules;
    this.form_data.setValue(data.data);
    this.form_data_copy = data.data;
    this.form_data.disable();

    //   },
    //   (error: any) => {}
    // );
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
      if (this.id_table) {
        this.form_rol.removeControl(this.id_table);
        this.form_rol.reset();
      }
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

  update_listable(item: any, table: string, content: any) {
    console.log(item);
    delete item.name;
    this.edit_tables = true;
    if (table === 'rol') {
      this.id_table = 'id_userxrol';
      if (!this.form_rol.get('id_rol')) {
        this.form_rol.removeControl(this.id_table);
        this.form_rol.updateValueAndValidity();
      }
      const newControlName = this.id_table;
      this.form_rol.addControl(
        newControlName,
        this.FormBuilder.control({ value: null, disabled: true })
      );
      this.form_rol.reset();
      this.form_rol.setValue(item);
    } else if (table === 'modules') {
      this.id_table = 'id_userxrolxmod';
      if (!this.form_modules.get('id_rol')) {
        this.form_modules.removeControl(this.id_table);
        this.form_modules.updateValueAndValidity();
      }
      const newControlName = this.id_table;
      this.form_modules.addControl(
        newControlName,
        this.FormBuilder.control({ value: null, disabled: true })
      );
      this.form_modules.reset();
      this.form_modules.setValue(item);
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
      console.log('El formato de tiempo no es válido');
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
}
