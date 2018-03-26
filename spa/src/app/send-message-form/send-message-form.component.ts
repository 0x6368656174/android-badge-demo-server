import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { map } from 'rxjs/operators';
import { SuccessModalComponent } from '../success-modal/success-modal.component';

interface IFormControlClass {
  'is-valid': boolean;
  'is-invalid': boolean;
}

interface IFormHintClass {
  'text-muted': boolean;
  'valid-feedback': boolean;
  'invalid-feedback': boolean;
}
@Component({
  selector: 'app-send-message-form',
  templateUrl: './send-message-form.component.html',
  styleUrls: ['./send-message-form.component.css']
})

export class SendMessageFormComponent implements OnInit {
  _form: FormGroup;
  @ViewChild(SuccessModalComponent) private _successModal: SuccessModalComponent;

  constructor(private _fb: FormBuilder,
              private _http: HttpClient,
              private _activeRoute: ActivatedRoute) {
  }

  ngOnInit() {
    this._form = this._fb.group({
      token: this._fb.control('', Validators.required),
      title: this._fb.control('', Validators.required),
      body: this._fb.control('', Validators.required),
      badge: this._fb.control(''),
    });

    this._activeRoute.params.pipe(
      map(params => params['token']),
    ).subscribe(token => this._form.get('token').setValue(token));
  }

  _submit() {
    this._validateAllFormFields(this._form);

    if (this._form.valid) {
      this._http.post('https://us-central1-android-badge-demo.cloudfunctions.net/sendMessage/', this._form.value)
        .subscribe(result => {
          console.log('Success', result);
          if (result['success']) {
            this._successModal.open();
          }
        });

    } else {
      console.log('Form invalid');
    }
  }

  _formControlClass(controlName: string): IFormControlClass {
    return {
      'is-valid': this._form.get(controlName).valid && this._form.get(controlName).touched,
      'is-invalid': this._form.get(controlName).invalid && this._form.get(controlName).touched,
    }
  }

  _formHintClass(controlName: string): IFormHintClass {
    return {
      'valid-feedback': this._form.get(controlName).valid && this._form.get(controlName).touched,
      'invalid-feedback': this._form.get(controlName).invalid && this._form.get(controlName).touched,
      'text-muted': this._form.get(controlName).untouched,
    }
  }

  private _validateAllFormFields(formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach(field => {
      const control = formGroup.get(field);
      if (control instanceof FormControl) {
        control.markAsTouched({ onlySelf: true });
      } else if (control instanceof FormGroup) {
        this._validateAllFormFields(control);
      }
    });
  }

}
