import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { GridOptions } from 'ag-grid-community';

@Component({
  selector: 'app-attendance',
  templateUrl: './attendance.component.html',
  styleUrls: ['./attendance.component.scss'],
})
export class AttendanceComponent {
  rowData: any[] = [];
  selectedDate: string = '';

  columnDefs = [
    { headerName: 'ID Reporte', field: 'id_reports' },
    { headerName: 'Fecha', field: 'date' },
    { headerName: 'Nombre', field: 'name' },
    { headerName: 'DNI', field: 'dni' },
    { headerName: 'Entrada', field: 'entry_time' },
    { headerName: 'Salida', field: 'exit_time' },
    { headerName: 'Horas dentro', field: 'hours_inside' },
  ];

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
    onCellDoubleClicked: this.onRowDoubleClicked.bind(this),
  };

  constructor(private http: HttpClient, private NgbModal: NgbModal) {
    this.rowData = [
      {
        id_reports: 1,
        date: '2023-10-25',
        name: 'Juan Pérez',
        dni: '12345678',
        entry_time: '08:00:00',
        exit_time: '17:00:00',
        hours_inside: '08:00:00',
      },
      {
        id_reports: 2,
        date: '2023-10-25',
        name: 'María Rodríguez',
        dni: '87654321',
        entry_time: '08:30:00',
        exit_time: '16:30:00',
        hours_inside: '08:00:00',
      },
      {
        id_reports: 3,
        date: '2023-10-26',
        name: 'Juan Pérez',
        dni: '12345678',
        entry_time: '07:45:00',
        exit_time: '16:15:00',
        hours_inside: '08:30:00',
      },
      {
        id_reports: 4,
        date: '2023-10-26',
        name: 'Pedro Sánchez',
        dni: '54321678',
        entry_time: '08:15:00',
        exit_time: '17:15:00',
        hours_inside: '09:00:00',
      },
    ];
  }

  ngOnInit() {
    const today = new Date();
    this.selectedDate = today.toISOString().split('T')[0]; // Formato ISO: "YYYY-MM-DD"
    //this.ScheduleService.charge_program_all(this.selectedDate);
    this.loadSampleData();
  }

  loadSampleData() {
    // this.ScheduleService.program_all$.subscribe((data) => {
    //   this.rowData = data;
    // });
  }

  onDateChange() {
    //this.ScheduleService.charge_program_all(this.selectedDate);
  }

  onRowDoubleClicked(event: any) {
    if (event.rowIndex !== undefined && event.rowIndex !== null) {
      // const options: NgbModalOptions = {
      //   size: 'lg',
      //   centered: true,
      // };
      // this.NgbModal.open(ChangeComponent, options);
    }
  }
}
