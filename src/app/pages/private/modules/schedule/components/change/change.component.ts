import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ScheduleService } from 'src/app/core/services/schedule.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-change',
  templateUrl: './change.component.html',
  styleUrls: ['./change.component.scss'],
})
export class ChangeComponent implements OnInit {
  private formget: any;
  public form_shedules: FormGroup = this.create_form();

  constructor(
    private SchedulesService: ScheduleService,
    private FormBuilder: FormBuilder
  ) {
    this.getdataschedule();
  }

  getdataschedule() {
    const id_schedules = this.SchedulesService.id_schedules;
    this.SchedulesService.getdataschedule(id_schedules).subscribe(
      (data) => {
        this.form_shedules.setValue(data);
        const convertedDate = this.convert_DateString_DateObjet(data.date);
        this.form_shedules.get('date')?.setValue(convertedDate);
        this.formget = this.form_shedules.value;
        this.form_shedules.disable();
      },
      (error) => {}
    );
  }

  ngOnInit() {}

  create_form() {
    return (this.form_shedules = this.FormBuilder.group({
      id_shedule: ['', Validators.required],
      hour_lunch: ['', Validators.required],
      hour_exit: ['', Validators.required],
      hour_entry: ['', Validators.required],
      hour_brake_2: ['', Validators.required],
      hour_brake_1: ['', Validators.required],
      dni: ['', Validators.required],
      name: ['', Validators.required],
      date: ['', Validators.required],
      id_staff: [''],
    }));
  }

  async savedata() {
    let hasChanges = false;
    Object.keys(this.form_shedules.controls).forEach((key) => {
      const currentValue = this.form_shedules.controls[key].value;
      const initialValue = this.formget[key];
      if (currentValue !== initialValue) {
        hasChanges = true;
      } else {
        this.form_shedules.disable();
      }
    });

    if (hasChanges) {
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
          this.form_shedules.disable();
          this.SchedulesService.update_schedule(
            this.form_shedules.value
          ).subscribe(
            (data) => {
              this.getdataschedule();
              Swal.fire({
                position: 'top-end',
                icon: 'success',
                title: 'Your work has been saved',
                showConfirmButton: false,
                timer: 1500,
                toast: true,
              });
              this.SchedulesService.closeModal();
              this.SchedulesService.get_schedules();
            },
            (error) => {}
          );
        }
      });
    }
  }

  update() {
    const list_form = [
      'hour_lunch',
      'hour_exit',
      'hour_entry',
      'hour_brake_2',
      'hour_brake_1',
    ];
    list_form.forEach((element: string) => this.disableform(element));
  }

  cancel() {
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

  convert_DateString_DateObjet(dateString: string): {
    year: number;
    month: number;
    day: number;
  } {
    const fechaPartes = dateString.split('-');
    const year = parseInt(fechaPartes[0], 10);
    const month = parseInt(fechaPartes[1], 10);
    const day = parseInt(fechaPartes[2], 10);
    return { year, month, day };
  }

  disableform(form: string) {
    this.form_shedules.get(form)?.enable();
  }
}
