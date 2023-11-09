import { Component, OnInit } from '@angular/core';
import { PrivateService } from 'src/app/core/services/private.service';
import { PublicService } from 'src/app/core/services/public.service';
import { environment } from 'src/environments/environment.development';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent implements OnInit {
  private boolean_nav: boolean = true;
  public name_user: string = '';
  public photo_user: string = '';

  constructor(private privateService: PrivateService) {}

  ngOnInit() {
    this.privateService.BooleanSideNav$.subscribe(
      (data) => (this.boolean_nav = data)
    );
    this.upload_data_user();
  }

  toggleSidebar() {
    this.privateService.ChangeSideNav(!this.boolean_nav);
  }

  upload_data_user() {
    this.privateService.data_User$.subscribe((data) => {
      const name = data.name + ' ' + data.lastname;
      this.name_user = name;
      if (data.photo === null || data.photo === '') {
        this.photo_user = environment.photo_user;
      }
    });
  }
}
