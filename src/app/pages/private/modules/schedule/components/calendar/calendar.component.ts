import { Component } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { PrivateComponent } from 'src/app/pages/private/private.component';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss'],
})
export class CalendarComponent {
  selectedMonth: string;
  selectedYear: number;
  days: string[] = ['DOM', 'LUN', 'MAR', 'MIÉ', 'JUE', 'VIE', 'SÁB'];
  months: string[] = [
    'Enero',
    'Febrero',
    'Marzo',
    'Abril',
    'Mayo',
    'Junio',
    'Julio',
    'Agosto',
    'Septiembre',
    'Octubre',
    'Noviembre',
    'Diciembre',
  ];
  years: number[] = [2023, 2024, 2025, 2026, 2027, 2028, 2029, 2030]; // Rango de años

  weeks: number[][] = [];
  date_day_permissions: number[] = [];

  constructor(
    private ngbModal: NgbModal,
    //private schedulesService: SchedulesService,
    private PrivateComponent: PrivateComponent
  ) {
    this.selectedMonth = this.months[new Date().getMonth()];
    this.selectedYear = new Date().getFullYear();
    this.generateCalendar();
    //this.uploadpages();
  }

  name_rol = '';
  // uploadpages() {
  //   this.PrivateComponent.data_user$.subscribe((data: any) => {
  //     console.log(data[0].typeuser);
  //     this.name_rol = data[0].typeuser;
  //   });
  // }

  onMonthChange() {
    this.generateCalendar();
  }

  onYearChange() {
    this.generateCalendar();
  }

  generateCalendar() {
    const monthIndex = this.months.indexOf(this.selectedMonth);
    const startDate = new Date(this.selectedYear, monthIndex, 1);
    const endDate = new Date(this.selectedYear, monthIndex + 1, 0);
    const numDays = endDate.getDate();
    const startDay = startDate.getDay();

    const weeks: number[][] = [[]];
    let currentWeekIndex = 0;

    for (let i = 0; i < startDay; i++) {
      weeks[currentWeekIndex].push(0);
    }
    for (let i = 1; i <= numDays; i++) {
      if (weeks[currentWeekIndex].length === 7) {
        weeks.push([]);
        currentWeekIndex++;
      }
      weeks[currentWeekIndex].push(i);
    }

    this.weeks = weeks;

    const data = { startDate: startDate, endDate: endDate };
    // this.schedulesService.get_perssmises_horario(data).subscribe(
    //   (res: any) => {
    //     const fechasCompletas = res.map((obj: any) => obj);
    //     const dias = fechasCompletas.map(
    //       (fecha: any) => new Date(fecha).getDate() + 1
    //     );
    //     this.date_day_permissions = dias;
    //   },
    //   () => {}
    // );
  }

  selectDate(day: number) {
    const fullDate = new Date(
      this.selectedYear,
      this.months.indexOf(this.selectedMonth),
      day
    );
    // this.schedulesService.date_calendar = fullDate;
    // const options: NgbModalOptions = {
    //   size: 'lg',
    //   centered: true,
    // };
    // const modalRef = this.ngbModal.open(
    //   SchedulesModalPermissionComponent,
    //   options
    // );
  }

  isDateSelected(day: number): boolean {
    const currentDate = new Date();
    return (
      this.selectedMonth === this.months[currentDate.getMonth()] &&
      day === currentDate.getDate() &&
      this.selectedYear === currentDate.getFullYear()
    );
  }

  hasEvent(day: number): boolean {
    return this.date_day_permissions.includes(day);
  }

  reset_date() {
    this.selectedMonth = this.months[new Date().getMonth()];
    this.selectedYear = new Date().getFullYear();
    this.generateCalendar();
  }

  // open_modal_solicitud() {
  //   const options: NgbModalOptions = {
  //     size: 'lg',
  //     centered: true,
  //   };
  //   this.schedulesService.setModalRef(
  //     this.ngbModal.open(SchedulesFormpermissionsComponent, options)
  //   );
  // }
}
