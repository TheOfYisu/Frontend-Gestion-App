import { Component } from '@angular/core';
import { ColDef, GridOptions } from 'ag-grid-community';
import { data_user_uploader_interface } from 'src/app/core/interfaces/private.interfaces';
import { PrivateService } from 'src/app/core/services/private.service';

@Component({
  selector: 'app-tablestaff',
  templateUrl: './tablestaff.component.html',
  styleUrls: ['./tablestaff.component.scss'],
})
export class TablestaffComponent {
  private data_user: data_user_uploader_interface = {
    id: '',
    name: '',
    photo: '',
    lastname: '',
  };

  public navbar_profile = [
    {
      id: 0,
      value: 'Datos',
      icon: 'bi bi-person-circle',
      url: '/manager/user/profile',
    },
    {
      id: 1,
      value: 'Horarios',
      icon: 'bi bi-calendar-event',
      url: '/manager/user/schedules',
    },
    {
      id: 2,
      value: 'Reportes',
      icon: 'bi bi-table',
      url: '/manager/user/reports',
    },
    {
      id: 3,
      value: 'Solicitudes',
      icon: 'bi bi-envelope-fill',
      url: '/manager/user/requests',
    },
  ];

  constructor(private PrivateService: PrivateService) {
    this.get_data_user();
  }

  get_data_user() {
    this.PrivateService.data_User$.subscribe((data) => {
      this.data_user = data;
    });
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
    { headerName: 'Operacion', field: 'operator' },
    { headerName: 'Lider', field: 'leader' },
    { headerName: 'Correo', field: 'address' },
    { headerName: 'Telefono', field: 'phone' },
  ];

  rowData = [
    {
      id: 1,
      photo_user:
        'https://yt3.ggpht.com/a/AATXAJxtTlFRXCXa2p9Hwt51nAb_OjW0fvT1KMae8w=s900-c-k-c0xffffffff-no-rj-mo',
      dni: '123456789',
      name: 'Ejemplo 1',
      status: true,
      position: 'Gerente',
    },
    {
      id: 2,
      photo_user:
        'https://yt3.ggpht.com/a/AATXAJxtTlFRXCXa2p9Hwt51nAb_OjW0fvT1KMae8w=s900-c-k-c0xffffffff-no-rj-mo',
      dni: '987654321',
      name: 'Ejemplo 2',
      status: false,
      position: 'Analista',
    },
  ];

  onCellDoubleClicked(event: any) {
    console.log(event.data);
  }

  getStatusText(status: boolean): string {
    return status ? 'Activo' : 'Inactivo';
  }

  imageRenderer(params: any) {
    return `<img src="${params.value}" alt="" style="width: 30px; height: 30px" class="rounded-circle">`;
  }
}
