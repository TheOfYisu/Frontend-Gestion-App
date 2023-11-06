import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { AdminService } from 'src/app/core/services/admin.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-listable',
  templateUrl: './listable.component.html',
  styleUrls: ['./listable.component.scss'],
})
export class ListableComponent implements OnInit {
  public data_table: any;
  public id_table: string = '';
  public id_table2: string = '';
  public name_table: string = '';
  public isloading: boolean = true;
  public error_back: boolean = false;
  public formulario: FormGroup = this.create_form_listable();
  public select_edit: boolean = false;
  private id_table_copy: string = '';

  constructor(
    private AdminService: AdminService,
    private config: NgbModalConfig,
    private modalService: NgbModal,
    private formBuilder: FormBuilder
  ) {
    config.backdrop = 'static';
    config.keyboard = false;
  }

  create_form_listable() {
    return (this.formulario = this.formBuilder.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      status: [null, Validators.required],
    }));
  }

  ngOnInit(): void {
    this.charge_listable('rol', 'Roles');
  }
  public navbar_profile = [
    {
      id: 'rol',
      value: 'Roles',
      icon: 'bi bi-person-circle',
    },
    {
      id: 'modules',
      value: 'Modulos',
      icon: 'bi bi-calendar-event',
    },
    {
      id: 'position',
      value: 'Cargos',
      icon: 'bi bi-table',
    },
    {
      id: 'additional_fields',
      value: 'Campos adicionales',
      icon: 'bi bi-envelope-fill',
    },
    {
      id: 'status_requests',
      value: 'Estado de solicitud',
      icon: 'bi bi-envelope-fill',
    },
    {
      id: 'type_requests',
      value: 'Tipos de solicitudes',
      icon: 'bi bi-envelope-fill',
    },
    {
      id: 'status_time',
      value: 'Estado de tiempos',
      icon: 'bi bi-envelope-fill',
    },
  ];

  charge_listable(get_table_string: string, get_name: string) {
    this.error_back = false;
    this.isloading = true;
    this.AdminService.get_listable(get_table_string).subscribe(
      (res) => {
        this.id_table_copy = this.id_table;
        this.id_table = `id_${get_table_string}`;
        this.id_table2 = get_table_string;
        this.name_table = get_name;
        this.isloading = false;
        this.data_table = res;
      },
      (error) => {
        this.error_back_fun(error);
      }
    );
  }

  async edit_list(items: any, content: any) {
    if (this.id_table_copy) {
      await this.formulario.removeControl(this.id_table_copy);
      await this.formulario.updateValueAndValidity();
    }
    const newControlName = this.id_table;
    await this.formulario.addControl(
      newControlName,
      this.formBuilder.control({ value: null, disabled: true })
    );
    await this.formulario.updateValueAndValidity();
    this.formulario.reset();
    this.formulario.setValue(items);
    this.modalService.open(content);
    this.select_edit = true;
  }

  eliminar_list(items: any) {
    Swal.fire({
      title: '¿Estás seguro?',
      text: `Que quiere eliminarlo?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, estoy seguro!',
      toast: true,
    }).then((result) => {
      this.AdminService.delete_listable(this.id_table2, items).subscribe(
        (data) => {
          this.charge_listable(this.id_table2, this.name_table);
          Swal.fire({
            position: 'top-end',
            icon: 'success',
            title: `${this.name_table} ha sido eliminado`,
            showConfirmButton: false,
            timer: 1500,
            toast: true,
          });
        },
        (error) => {
          this.error_back_fun(error);
        }
      );
    });
  }

  add_listable(content: any) {
    this.select_edit = false;
    this.formulario.removeControl(this.id_table);
    this.formulario.reset();
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

  create_listable() {}

  save_add_listable() {
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
        if (this.select_edit == false) {
          this.AdminService.create_listable(
            this.id_table2,
            this.formulario.value
          ).subscribe(
            (data) => {
              Swal.fire({
                position: 'top-end',
                icon: 'success',
                title: 'Your work has been saved',
                showConfirmButton: false,
                timer: 1500,
                toast: true,
              });
              this.charge_listable(this.id_table2, this.name_table);
              this.modalService.dismissAll();
            },
            (error) => {
              this.error_back_fun(error);
              this.modalService.dismissAll();
            }
          );
        } else {
          const id = this.formulario.get(this.id_table)?.value;
          this.formulario
            .get('status')
            ?.setValue(Number(this.formulario.get('status')?.value));
          this.AdminService.update_listable(
            this.id_table2,
            this.formulario.value,
            id
          ).subscribe(
            (data) => {
              Swal.fire({
                position: 'top-end',
                icon: 'success',
                title: 'Your work has been saved',
                showConfirmButton: false,
                timer: 1500,
                toast: true,
              });
              this.charge_listable(this.id_table2, this.name_table);
              this.modalService.dismissAll();
            },
            (error) => {
              this.error_back_fun(error);
              this.modalService.dismissAll();
            }
          );
        }
      }
    });
  }

  error_back_fun(error: any) {
    Swal.fire({
      icon: 'error',
      title: 'Oops...',
      text: 'No se ha podido establecer la conexion, pongase en contacto con el administrador.',
      toast: true,
    });
    console.error(error);
  }
}
