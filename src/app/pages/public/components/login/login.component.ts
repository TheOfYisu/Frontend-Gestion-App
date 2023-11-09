import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PublicService } from 'src/app/core/services/public.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  public formLogin: FormGroup = this.createFormLogin();
  public menssage_error: string = '';

  constructor(
    private FormBuilder: FormBuilder,
    private publicService: PublicService
  ) {
    this.createFormLogin();
  }

  createFormLogin() {
    return (this.formLogin = this.FormBuilder.group({
      email: ['', Validators.required],
      password: ['', Validators.required],
    }));
  }

  sendDataFormLogin() {
    if (!this.formLogin.valid) {
      this.menssage_error = 'Verifique los campos de credenciales.';
    } else {
      this.publicService.validLogin(this.formLogin.value);
    }
  }
}
