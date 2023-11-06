import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { NgbDateStruct, NgbCalendar } from '@ng-bootstrap/ng-bootstrap';
import { ScheduleService } from 'src/app/core/services/schedule.service';
@Component({
  selector: 'app-schedules.formpermissions',
  templateUrl: './schedules.formpermissions.component.html',
  styleUrls: ['./schedules.formpermissions.component.scss'],
})
export class SchedulesFormpermissionsComponent implements OnInit {
  constructor(
    private SchedulesService: ScheduleService,
    private FormBuilder: FormBuilder
  ) {
    this.getdata();
    const currentDate = new Date();
    this.today = {
      year: currentDate.getFullYear(),
      month: currentDate.getMonth() + 1,
      day: currentDate.getDate(),
    };
  }

  today: NgbDateStruct;

  private file_img: any;
  public FormData: FormGroup = this.CreateFormDataBasic();
  public fileselected: boolean = false;

  ngOnInit() {}

  CreateFormDataBasic() {
    return this.FormBuilder.group({
      id_staff: [''],
      name: [{ value: '' }],
      position: [{ value: '' }],
      permission_date: ['', Validators.required],
      permission_type: ['', Validators.required],
      type_solicitud: ['', Validators.required],
      range_init_operation: ['', Validators.required],
      range_finish_operation: ['', Validators.required],
      reason: ['', Validators.required],
    });
  }

  //Cargar Archivo
  onFileSelected(event: any) {
    this.file_img = event.target.files[0];
    this.fileselected = true;
    console.log(this.file_img);
  }

  getdata() {
    // this.GeneralService.data_user$.subscribe((data) => {
    //   this.FormData.get('id_staff')?.setValue(data[0].id_staff);
    //   this.FormData.get('name')?.setValue(data[0].name);
    //   this.FormData.get('position')?.setValue(data[0].typeuser);
    // });
    // console.log(this.FormData.value);
  }

  get_type_solicitud() {
    const typeSolicitud = this.FormData.get('type_solicitud')?.value;
    if (typeSolicitud === 'cambio_de_horario') {
      this.FormData.get('permission_type')?.disable();
      this.FormData.get('permission_type')?.setValidators(null);
      this.FormData.get('range_init_operation')?.disable();
      this.FormData.get('range_init_operation')?.setValidators(null);
      this.FormData.get('range_finish_operation')?.disable();
      this.FormData.get('range_finish_operation')?.setValidators(null);
    } else if (typeSolicitud === 'permsiso') {
      this.FormData.get('permission_type')?.enable();
      this.FormData.get('permission_type')?.setValidators(Validators.required);
      this.FormData.get('range_init_operation')?.enable();
      this.FormData.get('range_init_operation')?.setValidators(
        Validators.required
      );
      this.FormData.get('range_finish_operation')?.enable();
      this.FormData.get('range_finish_operation')?.setValidators(
        Validators.required
      );
    }
    this.FormData.get('range_finish_operation')?.updateValueAndValidity();
    this.FormData.get('range_init_operation')?.updateValueAndValidity();
    this.FormData.get('permission_type')?.updateValueAndValidity();
  }

  save_solicitud() {
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
        console.log(this.FormData.value);
        this.SchedulesService.save_solicitud(this.FormData.value).subscribe(
          (data: any) => {
            console.log(data);
            const body: FormData = new FormData();
            body.append('file_img', this.file_img);
            body.append('id', data.id);
            console.log(body);
            this.SchedulesService.save_pdf(body).subscribe(
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
              (error) => {}
            );
          },
          (error) => {}
        );
      }
    });
  }

  get valid_form(): boolean {
    return this.FormData.valid;
  }
}
