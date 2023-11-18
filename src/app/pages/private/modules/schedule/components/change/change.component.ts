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
  buttom_save: Boolean = true;
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
        console.log(data);
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
      id_schedule: ['', Validators.required],
      lunch_time: ['', Validators.required],
      exit_time: ['', Validators.required],
      entry_time: ['', Validators.required],
      brake_time_2: ['', Validators.required],
      brake_time_1: ['', Validators.required],
      dni: ['', Validators.required],
      name: ['', Validators.required],
      date: ['', Validators.required],
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
      const id_schedule = this.form_shedules.get('id_schedule')?.value;
      const data = {
        entry_time: this.form_shedules.get('entry_time')?.value,
        exit_time: this.form_shedules.get('exit_time')?.value,
        brake_time_1: this.form_shedules.get('brake_time_1')?.value,
        brake_time_2: this.form_shedules.get('brake_time_2')?.value,
        lunch_time: this.form_shedules.get('lunch_time')?.value,
      };
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
          this.SchedulesService.update_schedule(id_schedule, data).subscribe(
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
              this.buttom_save = true;
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
    this.buttom_save = false;
    const list_form = [
      'lunch_time',
      'exit_time',
      'entry_time',
      'brake_time_1',
      'brake_time_2',
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
        this.buttom_save = true;
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
