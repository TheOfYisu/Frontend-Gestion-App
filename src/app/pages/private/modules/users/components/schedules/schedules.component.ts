import { Component, OnInit } from '@angular/core';
import {
  NgbDate,
  NgbCalendar,
  NgbDateParserFormatter,
  NgbModalOptions,
  NgbModal,
} from '@ng-bootstrap/ng-bootstrap';
import { ColDef, GridOptions } from 'ag-grid-community';
import { environment } from 'src/environments/environment.development';
import { SchedulesFormpermissionsComponent } from '../../../schedule/components/schedules.formpermissions/schedules.formpermissions.component';
import { UserService } from 'src/app/core/services/user.service';

@Component({
  selector: 'app-schedules',
  templateUrl: './schedules.component.html',
  styleUrls: ['./schedules.component.scss'],
})
export class SchedulesComponent implements OnInit {
  //Variable para controlar el estilo de carga
  public isLoading: boolean = true;

  //Opciones de la tabla
  gridOptions: GridOptions = {
    defaultColDef: {
      filter: true,
      resizable: true,
    },
    domLayout: 'autoHeight',
    suppressMenuHide: true,
  };

  //Configuracion de columnas
  columnDefs: ColDef[] = [
    {
      headerName: 'Fecha',
      field: 'date',
    },
    { headerName: 'Entrada', field: 'entry_time' },
    { headerName: 'Descanso 1', field: 'brake_time_1' },
    { headerName: 'Almuerzo', field: 'lunch_time' },
    { headerName: 'Descanso 2', field: 'brake_time_2' },
    { headerName: 'Salida', field: 'exit_time' },
  ];

  fromDate: NgbDate;
  toDate: NgbDate | null;
  hoveredDate: NgbDate | null = null;
  rowData = [];

  constructor(
    private calendar: NgbCalendar,
    public formatter: NgbDateParserFormatter,
    private UserService: UserService
  ) {
    this.fromDate = calendar.getToday();
    this.toDate = calendar.getNext(calendar.getToday(), 'd', 15);
  }

  ngOnInit(): void {
    this.UserService.get_id_user();
    this.search_date();
  }

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
      this.UserService.get_data_schedules(date_init, date_finish).subscribe(
        (res) => {
          this.rowData = res;
          this.isLoading = false;
        },
        (err) => {
          console.error(err);
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

  //Restablecer la fecha de busqueda
  reload_date() {
    this.fromDate = this.calendar.getToday();
    this.toDate = this.calendar.getNext(this.calendar.getToday(), 'd', 15);
    this.search_date();
  }
}
