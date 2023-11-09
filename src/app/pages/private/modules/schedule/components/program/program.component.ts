import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ColDef, GridOptions } from 'ag-grid-community';
import { ScheduleService } from 'src/app/core/services/schedule.service';
import { ChangeComponent } from '../change/change.component';
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { SchedulesGenerateComponent } from '../schedules.generate/schedules.generate.component';

@Component({
  selector: 'app-program',
  templateUrl: './program.component.html',
  styleUrls: ['./program.component.scss'],
})
export class ProgramComponent implements OnInit {
  rowData: any[] = [];
  selectedDate: string = '';

  columnDefs = [
    { headerName: 'ID', field: 'id_schedule' },
    { headerName: 'Fecha', field: 'date' },
    { headerName: 'Usuario', field: 'name' },
    { headerName: 'Cargo', field: 'position' },
    { headerName: 'Cédula', field: 'dni' },
    { headerName: 'Hora de entrada', field: 'entry_time' },
    { headerName: 'Hora de salida', field: 'exit_time' },
    { headerName: 'Tiempo de descanso 1', field: 'brake_time_1' },
    { headerName: 'Tiempo de descanso 2', field: 'brake_time_2' },
    { headerName: 'Tiempo de almuerzo', field: 'lunch_time' },
  ];

  gridOptions: GridOptions = {
    defaultColDef: {
      filter: true,
      resizable: true,
    },
    domLayout: 'autoHeight',
    suppressMenuHide: true,
    onCellDoubleClicked: this.onRowDoubleClicked.bind(this),
    // ... otras opciones de configuración ...
  };

  constructor(
    private http: HttpClient,
    private ScheduleService: ScheduleService,
    private NgbModal: NgbModal
  ) {}

  ngOnInit() {
    const today = new Date();
    this.selectedDate = today.toISOString().split('T')[0]; // Formato ISO: "YYYY-MM-DD"
    this.ScheduleService.charge_program_all(this.selectedDate);
    this.loadSampleData();
  }

  loadSampleData() {
    this.ScheduleService.program_all$.subscribe((data) => {
      this.rowData = data;
    });
  }

  onDateChange() {
    this.ScheduleService.charge_program_all(this.selectedDate);
  }

  onRowDoubleClicked(event: any) {
    if (event.rowIndex !== undefined && event.rowIndex !== null) {
      const options: NgbModalOptions = {
        size: 'lg',
        centered: true,
      };
      this.NgbModal.open(ChangeComponent, options);
    }
  }

  open_modal_generate() {
    const options: NgbModalOptions = {
      size: 'xl',
      centered: true,
      backdrop: 'static',
    };
    this.ScheduleService.setModalRef(
      this.NgbModal.open(SchedulesGenerateComponent, options)
    );
  }
}
