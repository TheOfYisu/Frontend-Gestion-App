import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { GridOptions } from 'ag-grid-community';

@Component({
  selector: 'app-productivity',
  templateUrl: './productivity.component.html',
  styleUrls: ['./productivity.component.scss'],
})
export class ProductivityComponent {
  rowData: any[] = [];
  selectedDate: string = '';

  columnDefs = [
    { headerName: 'ID Reporte', field: 'id_reports' },
    { headerName: 'Inicio del Descanso 1', field: 'start_hour_break_1' },
    { headerName: 'Fin del Descanso 1', field: 'end_hour_break_1' },
    { headerName: 'Tiempo de Descanso 1', field: 'time_break_1' },
    { headerName: 'Inicio del Descanso 2', field: 'start_hour_break_2' },
    { headerName: 'Fin del Descanso 2', field: 'end_hour_break_2' },
    { headerName: 'Tiempo de Descanso 2', field: 'time_break_2' },
    { headerName: 'Inicio del Almuerzo', field: 'start_hour_lunch' },
    { headerName: 'Fin del Almuerzo', field: 'end_hour_lunch' },
    { headerName: 'Tiempo de Almuerzo', field: 'time_lunch' },
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
        start_hour_break_1: '09:00:00',
        end_hour_break_1: '09:30:00',
        time_break_1: '00:30:00',
        start_hour_break_2: '12:00:00',
        end_hour_break_2: '12:30:00',
        time_break_2: '00:30:00',
        start_hour_lunch: '13:00:00',
        end_hour_lunch: '14:00:00',
        time_lunch: '01:00:00',
      },
      {
        id_reports: 2,
        start_hour_break_1: '09:15:00',
        end_hour_break_1: '09:45:00',
        time_break_1: '00:30:00',
        start_hour_break_2: '12:15:00',
        end_hour_break_2: '12:45:00',
        time_break_2: '00:30:00',
        start_hour_lunch: '13:15:00',
        end_hour_lunch: '14:15:00',
        time_lunch: '01:00:00',
      },
      // Agrega más datos de ejemplo aquí
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
