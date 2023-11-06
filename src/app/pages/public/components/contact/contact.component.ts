import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss'],
})
export class ContactComponent {
  constructor(private fb: FormBuilder) {
    this.CreateFormContact();
  }
  public FormContact: FormGroup = this.CreateFormContact();

  CreateFormContact() {
    return (this.FormContact = this.fb.group({
      firstname: ['', Validators.required],
      lastname: ['', Validators.required],
      email: ['', Validators.required],
      message: ['', Validators.required],
    }));
  }
  get ValidFormContact(): boolean {
    return this.FormContact.valid;
  }

  SendDataFormContact() {
    console.log(this.FormContact.value);
  }
}
