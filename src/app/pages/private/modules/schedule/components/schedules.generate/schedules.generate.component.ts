import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  NgbDate,
  NgbCalendar,
  NgbDateParserFormatter,
} from '@ng-bootstrap/ng-bootstrap';
import { ScheduleService } from 'src/app/core/services/schedule.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-schedules.generate',
  templateUrl: './schedules.generate.component.html',
  styleUrls: ['./schedules.generate.component.scss'],
})
export class SchedulesGenerateComponent implements OnInit {
  public isLoading: boolean = false;
  private check_brake_1 = ['start_brake_1', 'finish_brake_1'];
  private check_brake_2 = ['start_brake_2', 'finish_brake_2'];
  private check_lunch = ['start_lunch', 'finish_lunch'];
  public days: string[] = [
    'Lunes',
    'Martes',
    'Miércoles',
    'Jueves',
    'Viernes',
    'Sábado',
    'Domingo',
  ];
  public selectedDays: boolean[] = [
    false,
    false,
    false,
    false,
    false,
    false,
    false,
  ];

  public generate_shedules: FormGroup = this.create_formgenerate();
  hoveredDate: NgbDate | null = null;

  fromDate: NgbDate | null;
  toDate: NgbDate | null;

  constructor(
    private calendar: NgbCalendar,
    public formatter: NgbDateParserFormatter,
    private FormBuilder: FormBuilder,
    private SchedulesService: ScheduleService
  ) {
    this.fromDate = calendar.getToday();
    this.toDate = calendar.getNext(calendar.getToday(), 'd', 15);
  }

  ngOnInit() {
    this.create_formgenerate();
  }

  create_formgenerate() {
    return (this.generate_shedules = this.FormBuilder.group({
      select_personal: ['', Validators.required],
      select_day: ['', Validators.required],
      day_init: [{}],
      day_finish: [{}],
      range_init_operation: ['', Validators.required],
      range_finish_operation: ['', Validators.required],
      select_turnos: ['', Validators.required],
      hour_turno: ['', Validators.required],
      check_brake_1: [false, Validators.required],
      start_brake_1: [{ value: '', disabled: true }],
      finish_brake_1: [{ value: '', disabled: true }],
      check_lunch: [false, Validators.required],
      start_lunch: [{ value: '', disabled: true }],
      finish_lunch: [{ value: '', disabled: true }],
      check_brake_2: [false, Validators.required],
      start_brake_2: [{ value: '', disabled: true }],
      finish_brake_2: [{ value: '', disabled: true }],
      day_brake: [[]],
      turno_exact: [false],
      sobrescribir: [false],
    }));
  }

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

  isRange(date: NgbDate) {
    return (
      date.equals(this.fromDate) ||
      (this.toDate && date.equals(this.toDate)) ||
      this.isInside(date) ||
      this.isHovered(date)
    );
  }

  onCheckboxChange(event: any) {
    const { value, checked } = event.target;
    this.selectedDays[value] = checked;
  }

  isCheckboxDisabled(index: number): boolean {
    return !this.selectedDays[index];
  }

  save_shedules() {
    Swal.fire({
      title: '¿Estás seguro?',
      text: '¿Toda la informacion es correcta?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, estoy seguro!',
      toast: true,
    }).then((result) => {
      if (result.isConfirmed) {
        this.isLoading = true;
        this.generate_shedules.get('day_brake')?.setValue(this.selectedDays);
        this.generate_shedules.get('day_init')?.setValue(this.fromDate);
        this.generate_shedules.get('day_finish')?.setValue(this.toDate);
        this.SchedulesService.create_schedules(
          this.generate_shedules.value
        ).subscribe(
          (data) => {
            Swal.fire({
              position: 'top-end',
              icon: 'success',
              title: 'Your work has been saved',
              showConfirmButton: false,
              timer: 1500,
              toast: true,
            });
            this.SchedulesService.closeModal();
          },
          (error) => {
            this.isLoading = false;
            Swal.fire({
              icon: 'error',
              title: 'Oops...',
              text: error.error.message,
              toast: true,
            }).then((result) => {
              if (result.isConfirmed) {
                Swal.fire({
                  title: '¿Desea sobreescribir?',
                  icon: 'question',
                  showCancelButton: true,
                  confirmButtonText: 'Sobreescribir',
                  cancelButtonText: 'Cancelar',
                  toast: true,
                }).then((overwriteResult) => {
                  if (overwriteResult.isConfirmed) {
                    this.generate_shedules.get('sobrescribir')?.setValue(true);
                    this.save_shedules();
                  }
                });
              }
            });
          }
        );
      }
    });
  }

  check(chechdata: string) {
    const dataMap: { [key: string]: string[] } = {
      check_brake_1: this.check_brake_1,
      check_brake_2: this.check_brake_2,
      check_lunch: this.check_lunch,
    };

    const shouldEnable = this.generate_shedules.get(chechdata)?.value;
    const controlArray = dataMap[chechdata];

    if (controlArray) {
      controlArray.forEach((control: string) => {
        if (control) {
          this.habilitarOpciones(control, shouldEnable);
        }
      });
    }
  }

  onRangeFinishOperationChange() {
    console.log('funciona');
    const rangeInitOperation = this.generate_shedules.get(
      'range_init_operation'
    )?.value;
    const rangeFinishOperation = this.generate_shedules.get(
      'range_finish_operation'
    )?.value;
    if (rangeInitOperation && rangeFinishOperation) {
      const [initHours, initMinutes] = rangeInitOperation
        .split(':')
        .map(Number);
      const initTime = new Date();
      initTime.setHours(initHours, initMinutes);

      const [finishHours, finishMinutes] = rangeFinishOperation
        .split(':')
        .map(Number);
      const finishTime = new Date();
      finishTime.setHours(finishHours, finishMinutes);

      const differenceInHours =
        (finishTime.getTime() - initTime.getTime()) / (1000 * 60 * 60);

      console.log(initTime, finishTime, differenceInHours);
      if (differenceInHours > 15 || differenceInHours < 0) {
        alert(
          'La diferencia entre las horas de inicio y finalización debe estar entre 0 y 15 horas'
        );
        this.generate_shedules.get('range_finish_operation')?.setValue(null);
      }
    }
  }

  habilitarOpciones(controlName: string, disable: boolean) {
    const control = this.generate_shedules.get(controlName);
    if (control) {
      if (disable) {
        control.disable();
        control.setValidators(null);
      } else {
        control.enable();
        control.setValidators(Validators.required);
      }
      control.updateValueAndValidity();
    }
  }

  get valid_form(): boolean {
    return this.generate_shedules.valid;
  }

  change_day_brake(event: any) {
    const select_day = event.target.value;
    const dayMap: { [key: string]: boolean[] } = {
      l_to_v: [false, false, false, false, false, true, true],
      l_to_s: [false, false, false, false, false, false, true],
      l_to_d: [false, false, false, false, false, false, false],
    };
    this.generate_shedules.get('day_brake')?.disable;
    this.selectedDays = dayMap[select_day] || [];
  }

  cancel_shedules() {
    Swal.fire({
      title: '¿Estás seguro?',
      text: 'Que quiere cancelar?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, estoy seguro!',
      toast: true,
    }).then((result) => {
      if (result.isConfirmed) {
        this.SchedulesService.closeModal();
      }
    });
  }
}
