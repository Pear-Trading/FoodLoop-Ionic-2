import { Component } from '@angular/core';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { NavController, ToastController, LoadingController } from 'ionic-angular';
import { PeopleService } from '../../providers/people-service';

@Component({
  selector: 'page-signup',
  templateUrl: 'signup.html',
  providers: [PeopleService]  
})

export class SignupPage {
  signup: FormGroup;
  years: Array<number>;

  constructor(
    private formBuilder: FormBuilder,
    private peopleService: PeopleService,
    private loadingCtrl: LoadingController,
    private toastCtrl: ToastController,
    private navCtrl: NavController,
  ) {
    let startYear = new Date().getFullYear() - 11;
    this.years = Array.from( new Array(140), (val, index) => startYear - index );

    this.signup = this.formBuilder.group({
      token         : ['', [Validators.required]],
      full_name     : ['', [Validators.required]],
      display_name  : ['', [Validators.required]],
      email         : ['', [Validators.required]],
      postcode      : ['', [Validators.required]],
      year_of_birth : ['', [Validators.required]],
      password      : ['', [Validators.required]],
    });
  }

  onSubmit() {
    console.log(this.signup.value, this.signup.valid);

    let loading = this.loadingCtrl.create({
       content: 'Registering your account...'
    });
    loading.present();

    // Currently we only accept customer signup in the app
    this.signup.value.usertype = 'customer';

    this.peopleService
      .register(this.signup.value)
      .subscribe(
        result => {
          loading.dismiss();
          let toast = this.toastCtrl.create({
            message: 'Registered Successfully',
            duration: 3000,
            position: 'top'
          });
          toast.present();
          this.navCtrl.popToRoot();
        },
        error => {
          loading.dismiss();
          console.log( error._body );
          let toast = this.toastCtrl.create({
            message: JSON.parse(error._body).message,
            duration: 3000,
            position: 'top'
          });
          toast.present();
        }
      );
  }
}
