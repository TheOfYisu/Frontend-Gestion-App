import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ScheduleService {
  private program_all = new BehaviorSubject<any>([]);
  program_all$ = this.program_all.asObservable();

  charge_program_all(date: string) {
    this.HttpClient.get(`${this.urlBack}/get_schedules_date/${date}`).subscribe(
      (date) => {
        this.program_all.next(date);
      },
      (error) => {
        console.log('si', error);
        if (error.status === 400) {
          this.program_all.next([]);
        }
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
      `${this.urlBack}/get_schedule_id/${id_schedules}`
    );
  }

  update_schedule(id_schedule: any, data: any) {
    return this.HttpClient.put(
      `${this.urlBack}/update_schedule/${id_schedule}`,
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

  //Reporte de horario en un rango de dias
  get_horario_range_date(date_init: string, date_finish: string) {
    return this.HttpClient.get(
      `${this.urlBack}/get_horario_range_date/${date_init}/${date_finish}`,
      {
        responseType: 'arraybuffer', // Importante para manejar archivos binarios
        observe: 'response', // Para obtener información sobre la respuesta
      }
    );
  }

  //Reporte de horario en un dia
  get_horario_day(date: string) {
    return this.HttpClient.get(
      `${this.urlBack}/get_schedules_date_report/${date}`,
      {
        responseType: 'arraybuffer', // Importante para manejar archivos binarios
        observe: 'response', // Para obtener información sobre la respuesta
      }
    );
  }

  //Reporte de todos los horarios
  get_horario() {
    return this.HttpClient.get(`${this.urlBack}/get_horarios_excel`, {
      responseType: 'arraybuffer', // Importante para manejar archivos binarios
      observe: 'response', // Para obtener información sobre la respuesta
    });
  }
}
