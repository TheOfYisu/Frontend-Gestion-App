import { Component } from '@angular/core';
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { ColDef, GridOptions } from 'ag-grid-community';
import { SchedulesFormpermissionsComponent } from '../../../schedule/components/schedules.formpermissions/schedules.formpermissions.component';

@Component({
  selector: 'app-requests',
  templateUrl: './requests.component.html',
  styleUrls: ['./requests.component.scss'],
})
export class RequestsComponent {
  constructor(private NgbModal: NgbModal) {}
  gridOptions: GridOptions = {
    defaultColDef: {
      filter: true,
    },
    suppressMenuHide: true,
    onCellDoubleClicked: this.onCellDoubleClicked.bind(this),
    // ... otras opciones de configuración ...
  };
  columnDefs: ColDef[] = [
    { field: 'make' },
    { field: 'model' },
    { field: 'price' },
  ];

  rowData = [
    { make: 'Toyota', model: 'Celica', price: 35000 },
    { make: 'Ford', model: 'Mondeo', price: 32000 },
    { make: 'Porsche', model: 'Boxster', price: 72000 },
  ];

  onCellDoubleClicked(event: any) {
    console.log(event);
  }

  open_modal() {
    const options: NgbModalOptions = {
      size: 'lg',
      centered: true,
    };
    this.NgbModal.open(SchedulesFormpermissionsComponent, options);
  }
}
