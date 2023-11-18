import { Component, OnInit } from '@angular/core';
import {
  NgbModal,
  NgbModalConfig,
  NgbModalOptions,
} from '@ng-bootstrap/ng-bootstrap';
import { ColDef, GridOptions } from 'ag-grid-community';
import { PrivateService } from 'src/app/core/services/private.service';
import { UserFormComponent } from '../user.form/user.form.component';
import { AdminService } from 'src/app/core/services/admin.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { HttpResponse } from '@angular/common/http';

@Component({
  selector: 'app-users.all',
  templateUrl: './users.all.component.html',
  styleUrls: ['./users.all.component.scss'],
})
export class UsersAllComponent implements OnInit {
  public isloading: boolean = true;
  private imageUrl = 'assets/img/private/photo_user_default.png';

  private file_img: any;
  public fileselected: boolean = false;

  constructor(
    private NgbModal: NgbModal,
    private PrivateService: PrivateService,
    private AdminService: AdminService,
    private router: Router,
    private config: NgbModalConfig
  ) {
    config.backdrop = 'static';
    config.keyboard = false;
  }

  ngOnInit(): void {
    this.get_list_users();
  }

  gridOptions: GridOptions = {
    defaultColDef: {
      resizable: true,
      filter: true,
      width: 150,
      minWidth: 100,
      maxWidth: 200,
      cellStyle: { textAlign: 'center' },
    },
    suppressMenuHide: true,
    onCellDoubleClicked: this.onCellDoubleClicked.bind(this),
  };

  columnDefs: ColDef[] = [
    {
      headerName: 'No.',
      field: 'id',
      width: 100,
      minWidth: 75,
      maxWidth: 125,
    },
    {
      headerName: 'Foto',
      field: 'photo_user',
      cellRenderer: this.imageRenderer,
    },
    {
      headerName: 'Cedula',
      field: 'dni',
    },
    { headerName: 'Nombre', field: 'name' },
    { headerName: 'Apellido', field: 'lastname' },
    {
      headerName: 'Estado',
      field: 'status',
      valueFormatter: (params) => this.getStatusText(params.value),
    },
    { headerName: 'Cargo', field: 'position' },
    {
      headerName: 'Correo',
      field: 'email',
      width: 250,
      minWidth: 200,
      maxWidth: 300,
    },
    { headerName: 'Telefono', field: 'phone' },
  ];

  rowData = [];

  onCellDoubleClicked(event: any) {
    if (event.rowIndex !== undefined && event.rowIndex !== null) {
      this.AdminService.upgrader_id_user(event.data.id);
      this.router.navigate(['manager/admin/user']);
    }
  }

  getStatusText(status: boolean): string {
    return status ? 'Activo' : 'Inactivo';
  }

  imageRenderer(params: any) {
    if (params.value) {
      return `<img src="${params.value}" alt="" style="width: 30px; height: 30px" class="rounded-circle">`;
    } else {
      return `<img src="assets/img/private/photo_user_default.png" alt="" style="width: 30px; height: 30px" class="rounded-circle">`;
    }
  }

  openModal_add() {
    const options: NgbModalOptions = {
      size: 'xl',
      centered: true,
      backdrop: 'static',
    };
    this.PrivateService.setModalRef(
      this.NgbModal.open(UserFormComponent, options)
    );
  }

  async get_list_users() {
    this.isloading = true;
    await this.AdminService.get_listuser();
    this.AdminService.list_user$.subscribe((data) => {
      this.rowData = data;
      this.isloading = false;
    });
  }

  //Carge de archivo con muchos usuarios
  upload_users(content: any) {
    this.NgbModal.open(content);
  }

  onFileSelected(event: any) {
    this.file_img = event.target.files[0];
    this.fileselected = true;
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
    const body: FormData = new FormData();
    body.append('file_users', this.file_img);
    this.AdminService.file_users(body).subscribe(
      (res) => {},
      (err) => {}
    );
  }

  downloadFile() {
    this.AdminService.down_users().subscribe(
      (response: HttpResponse<ArrayBuffer>) => {
        if (response.body) {
          let filename = 'Reporte Usuarios.xlsx'; // Nombre de archivo predeterminado

          // Verifica si el encabezado "Content-Disposition" está presente
          const contentDispositionHeader = response.headers.get(
            'content-disposition'
          );
          if (contentDispositionHeader) {
            filename = contentDispositionHeader
              .split(';')[1]
              .trim()
              .split('=')[1];
          }

          // Extrae los datos binarios de la respuesta
          const blob = new Blob([response.body], {
            type: 'application/octet-stream',
          });

          // Crea un enlace de descarga y haz clic en él
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = filename;
          a.click();
          window.URL.revokeObjectURL(url);
        } else {
          console.error('El cuerpo de la respuesta es nulo.');
        }
      }
    );
  }
}
