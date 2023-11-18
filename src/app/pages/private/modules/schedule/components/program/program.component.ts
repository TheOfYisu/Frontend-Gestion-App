import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { ColDef, GridOptions } from 'ag-grid-community';
import { ScheduleService } from 'src/app/core/services/schedule.service';
import { ChangeComponent } from '../change/change.component';
import {
  NgbCalendar,
  NgbDate,
  NgbDateParserFormatter,
  NgbModal,
  NgbModalOptions,
} from '@ng-bootstrap/ng-bootstrap';
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
    private NgbModal: NgbModal,
    private calendar: NgbCalendar,
    public formatter: NgbDateParserFormatter
  ) {
    this.fromDate = calendar.getToday();
    this.toDate = calendar.getNext(calendar.getToday(), 'd', 15);
  }

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
      this.ScheduleService.id_schedules = event.data.id_schedule;
      this.ScheduleService.setModalRef(
        this.NgbModal.open(ChangeComponent, options)
      );
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

  isMenuOpen: boolean = false;

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  downloadReport(reportNumber: number) {
    console.log(`Descargar informe ${reportNumber}`);
  }

  fromDate: NgbDate;
  toDate: NgbDate | null;
  hoveredDate: NgbDate | null = null;

  //Input de fecha
  isRange(date: NgbDate) {
    return (
      date.equals(this.fromDate) ||
      (this.toDate && date.equals(this.toDate)) ||
      this.isInside(date) ||
      this.isHovered(date)
    );
  }

  //Input de fecha
  isHovered(date: NgbDate) {
    return (
      this.fromDate &&
      !this.toDate &&
      this.hoveredDate &&
      date.after(this.fromDate) &&
      date.before(this.hoveredDate)
    );
  }

  //Input de fecha
  isInside(date: NgbDate) {
    return this.toDate && date.after(this.fromDate) && date.before(this.toDate);
  }

  //Input de fecha
  onDateSelection(date: NgbDate) {
    if (!this.fromDate && !this.toDate) {
      this.fromDate = date;
    } else if (
      this.fromDate &&
      !this.toDate &&
      date &&
      date.after(this.fromDate)
    ) {
      this.toDate = date;
    } else {
      this.toDate = null;
      this.fromDate = date;
    }
  }

  //Buscar el horario con dos fechas
  search_date() {
    const date_init = this.parseDateStringToDate(this.fromDate);
    const date_finish = this.parseDateStringToDate(this.toDate);
    if (date_init !== null && date_finish !== null) {
      this.ScheduleService.get_horario_range_date(
        date_init,
        date_finish
      ).subscribe(
        (response: HttpResponse<ArrayBuffer>) => {
          this.descargarArchivo(response, 'reporte_horario_rango_dia');
        },
        (error) => {
          alert(error.detail);
        }
      );
    }
  }

  //Convertir la fecha de objeto a string
  parseDateStringToDate(dateObject: any) {
    const { year, month, day } = dateObject;

    if (day < 1 || day > 31 || month < 1 || month > 12) {
      return null;
    }

    const dateStr = `${year}-${month.toString().padStart(2, '0')}-${day
      .toString()
      .padStart(2, '0')}`;
    return dateStr;
  }

  report_day() {
    this.ScheduleService.get_horario_day(this.selectedDate).subscribe(
      (response: HttpResponse<ArrayBuffer>) => {
        this.descargarArchivo(response, 'reporte_horario_dia');
      },
      (error) => {
        alert(error.detail);
      }
    );
  }

  get_horario() {
    this.ScheduleService.get_horario().subscribe(
      (response: HttpResponse<ArrayBuffer>) => {
        this.descargarArchivo(response, 'reporte_horario_todo');
      },
      (error) => {
        alert(error.error.detail);
      }
    );
  }

  descargarArchivo(response: HttpResponse<ArrayBuffer>, name: string): void {
    if (response.body) {
      let filename = name + '.xlsx'; // Nombre de archivo predeterminado

      // Verifica si el encabezado "Content-Disposition" está presente
      const contentDispositionHeader = response.headers.get(
        'content-disposition'
      );
      if (contentDispositionHeader) {
        filename = contentDispositionHeader.split(';')[1].trim().split('=')[1];
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

      // Añade el enlace al DOM y haz clic en él
      document.body.appendChild(a);
      a.click();

      // Limpia el enlace del DOM
      document.body.removeChild(a);

      window.URL.revokeObjectURL(url);
    } else {
      console.error('El cuerpo de la respuesta es nulo.');
    }
  }
}
