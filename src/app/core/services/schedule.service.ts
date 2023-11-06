import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from 'src/environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class ScheduleService {
  private program_all = new BehaviorSubject<any>([]);
  program_all$ = this.program_all.asObservable();

  charge_program_all(date: string) {
    this.HttpClient.get(`${this.urlBack}/get_program_all/${date}`).subscribe(
      (date) => {
        this.program_all.next(date);
      },
      (error) => {
        const data2: any = [
          {
            id_schedule: 1,
            name: 'Juan Pérez',
            position: 'Gerente',
            dni: '123456789',
            entry_time: '08:00:00',
            exit_time: '17:00:00',
            brake_time_1: '12:00:00',
            brake_time_2: '14:00:00',
            lunch_time: '13:00:00',
            date: '2023-10-27',
          },
        ];
        this.program_all.next(data2);
      }
    );
  }

  private isLoading = new BehaviorSubject<boolean>(false);
  public $isLoading = this.isLoading.asObservable();

  private modalRef: NgbModalRef | null = null;
  private urlBack = environment.url_backend;

  private list_all = new BehaviorSubject<any[]>([]);
  public $list_all = this.list_all.asObservable();

  private list_solicitud = new BehaviorSubject<any[]>([]);
  public $list_solicitud = this.list_solicitud.asObservable();

  public id_schedules: string = '';
  public id_solicitud: string = '';
  public statuslist: string = '';

  private data_model = new BehaviorSubject<{}>({});
  public $data_model = this.data_model.asObservable();

  public date_calendar: Date = new Date();

  constructor(private HttpClient: HttpClient) {}

  create_schedules(data: any) {
    console.log(data);
    return this.HttpClient.post(
      `${this.urlBack}/schedules/create_schedules`,
      data
    );
  }

  get_schedules() {
    const data = this.data_model;
    this.HttpClient.post<any[]>(
      `${this.urlBack}/schedules/get_schedules`,
      data.value
    ).subscribe(
      (res) => {
        this.list_all.next(res);
      },
      (error) => {}
    );
  }

  setModalRef(modalRef: NgbModalRef): void {
    this.modalRef = modalRef;
  }

  closeModal(): void {
    if (this.modalRef) {
      this.modalRef.dismiss();
      this.modalRef = null;
    }
  }

  downloadExcel(data: any): void {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      responseType: 'blob',
    });

    this.HttpClient.post(`${this.urlBack}/reports/get_schedules`, data, {
      headers,
      responseType: 'blob',
    }).subscribe((blob: Blob) => {
      const formattedDate = this.getFormattedDate(data);

      // Parsear la respuesta del backend para obtener la fecha del nombre del archivo
      const fileName = `Horario_${formattedDate}.xlsx`;

      // Crear un enlace temporal para descargar el archivo
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = fileName;
      link.click();

      // Liberar el enlace temporal después de la descarga
      URL.revokeObjectURL(link.href);
    });
  }

  private getFormattedDate(data: any): string {
    const day = data.day;
    const month = data.month;
    const year = data.year;
    return `${day}-${month}-${year}`;
  }

  getdataschedule(id_schedules: string): Observable<any> {
    return this.HttpClient.get<any>(
      `${this.urlBack}/schedules/getdataschedule/${id_schedules}`
    );
  }

  update_schedule(data: any) {
    const id_schedule = data.id_shedule;
    delete data.dni;
    delete data.id_shedule;
    delete data.name;
    delete data.id_staff;
    return this.HttpClient.put(
      `${this.urlBack}/schedules/update_schedule/${id_schedule}`,
      data
    );
  }

  data_model_upload(data: any) {
    this.data_model.next(data);
  }

  get_perssmises_horario(data: {}) {
    return this.HttpClient.post(
      `${this.urlBack}/schedules/get_perssmises_horario`,
      data
    );
  }

  get_data_requests(date: any): Observable<any[]> {
    const data = { date: date };
    return this.HttpClient.post<any[]>(
      `${this.urlBack}/schedules/get_data_requests`,
      data
    );
  }

  getUsuario() {
    this.isLoading.next(true);
    const type = this.statuslist;
    this.HttpClient.get<any[]>(
      `${this.urlBack}/schedules/get_solicitudes/${type}`
    ).subscribe((data) => {
      this.list_solicitud.next(data);
      this.isLoading.next(false);
    });
  }

  getsolicitud(id: string) {
    return this.HttpClient.get(`${this.urlBack}/schedules/get_solicitud/${id}`);
  }

  update_solicitud(data: any) {
    return this.HttpClient.post(
      `${this.urlBack}/schedules/update_solicitud`,
      data
    );
  }

  save_solicitud(data: any) {
    return this.HttpClient.post(
      `${this.urlBack}/schedules/save_solicitud`,
      data
    );
  }

  save_pdf(data: FormData): Observable<any> {
    console.log(data);
    return this.HttpClient.post(`${this.urlBack}/schedules/save_pdf`, data);
  }
}
