import { Component } from '@angular/core';
import {
  NgbCalendar,
  NgbDate,
  NgbDateParserFormatter,
} from '@ng-bootstrap/ng-bootstrap';
import { ColDef, GridOptions } from 'ag-grid-community';
import { environment } from 'src/environments/environment.development';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.scss'],
})
export class ReportsComponent {
  gridOptions: GridOptions = {
    defaultColDef: {
      filter: true,
      resizable: true,
      width: 150,
      minWidth: 100,
      maxWidth: 200,
    },
    suppressMenuHide: true,
    onCellDoubleClicked: this.onCellDoubleClicked.bind(this),
    // ... otras opciones de configuración ...
  };
  columnDefs: ColDef[] = [
    {
      headerName: 'Fecha',
      field: 'date',
      sortable: true,
    },
    { headerName: 'Hora de entrada', field: 'h_entry' },
    { headerName: 'Entrada', field: 'entry' },
    { headerName: 'Hora de descanso 1', field: 'h_break_1' },
    { headerName: 'Descanso 1', field: 'break_1' },
    { headerName: 'Tiempo de descanso 1', field: 't_break_1' },
    { headerName: 'Hora de almuerzo', field: 'h_lunch' },
    { headerName: 'Almuerzo', field: 'lunch' },
    { headerName: 'Tiempo de almuerzo', field: 't_lunch' },
    { headerName: 'Hora de descanso 2', field: 'h_break_2' },
    { headerName: 'Descanso 2', field: 'break_2' },
    { headerName: 'Tiempo de descanso 2', field: 't_break_2' },
    { headerName: 'Hora de salida', field: 'h_exit' },
    { headerName: 'Salida', field: 'exit' },
  ];

  fromDate: NgbDate | null;
  toDate: NgbDate | null;
  maxDate: NgbDate | null;
  hoveredDate: NgbDate | null = null;
  isCurrentDateDisabled: boolean = true;

  constructor(
    private calendar: NgbCalendar,
    public formatter: NgbDateParserFormatter
  ) {
    this.toDate = calendar.getNext(calendar.getToday(), 'd', -15);
    this.fromDate = calendar.getNext(calendar.getToday(), 'd', -15);
    this.maxDate = NgbDate.from({
      year: new Date().getFullYear(),
      month: new Date().getMonth() + 1,
      day: new Date().getDate(),
    });
  }

  rowData = [];

  onCellDoubleClicked(event: any) {
    console.log(event);
  }

  isRange(date: NgbDate) {
    return (
      date.equals(this.fromDate) ||
      (this.toDate && date.equals(this.toDate)) ||
      this.isInside(date) ||
      this.isHovered(date)
    );
  }
  isHovered(date: NgbDate) {
    return (
      this.fromDate &&
      !this.toDate &&
      this.hoveredDate &&
      date.after(this.fromDate) &&
      date.before(this.hoveredDate)
    );
  }

  isInside(date: NgbDate) {
    return this.toDate && date.after(this.fromDate) && date.before(this.toDate);
  }

  onDateSelection(date: NgbDate) {
    if (date && date.before(this.maxDate)) {
      // Procede con la selección de la fecha
      if (!this.fromDate) {
        this.fromDate = date;
      } else if (this.fromDate && !this.toDate && date.after(this.fromDate)) {
        this.toDate = date;
      } else {
        this.toDate = null;
        this.fromDate = date;
      }
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

  //Buscar el horario con dos fechas
  search_date() {
    const date_init = this.parseDateStringToDate(this.fromDate);
    const date_finish = this.parseDateStringToDate(this.toDate);
    if (date_init !== null && date_finish !== null) {
      // this.UserService.get_data_schedules(date_init, date_finish).subscribe(
      //   (res) => {
      //     this.rowData = res;
      //     this.isLoading = false;
      //   },
      //   (err) => {
      //     console.error(err);
      //   }
      // );
    }
  }
}
