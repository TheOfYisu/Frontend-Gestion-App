import { Component, HostListener, OnInit } from '@angular/core';
import { PrivateService } from 'src/app/core/services/private.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-private',
  templateUrl: './private.component.html',
  styleUrls: ['./private.component.scss'],
})
export class PrivateComponent implements OnInit {
  //cambiar a false
  public isLoading: boolean = true;
  public sidebarVisible: boolean = true;

  constructor(private privateService: PrivateService) {
    this.privateService.upload_data_user();
    this.privateService.isLoading$.subscribe((data) => {
      this.isLoading = data;
    });
  }

  ngOnInit(): void {
    this.privateService.BooleanSideNav$.subscribe((data) => {
      this.sidebarVisible = data;
    });
    this.sidebarVisible = window.innerWidth < 992;
    this.privateService.id_rol_user$.subscribe((data) => {});
  }

  @HostListener('window:resize', ['$event'])
  onResize(_: Event) {
    if (window.innerWidth < 992) {
      this.sidebarVisible = true;
    } else {
      this.sidebarVisible = false;
    }
  }
}
