import { Component } from '@angular/core';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { ToastController } from 'ionic-angular';
import { PeopleService } from '../../providers/people-service';
import { UserData } from '../../providers/user-data';
import 'rxjs/add/operator/timeout';


/* interface of home page*/
@Component({
  selector: 'page-feedback',
  templateUrl: 'feedback.html',
  providers: [ UserData, PeopleService ]
})

export class FeedbackPage {
  feedbackForm: FormGroup;
  loggedIn: boolean;
  loggedInEmail: any;
  username: any;

  constructor(
    private formBuilder: FormBuilder,
    private toastCtrl: ToastController,
    private peopleService: PeopleService,
    private userData: UserData,
  ) {
    this.userData.hasLoggedIn().subscribe(
      result => {
        if (result) {
          console.log('User is logged in');
          this.getUserEmail();
        } else {
          console.log('User is not logged in');
          this.loggedIn = false;
        }
      },
      err => {
        console.log('Error checking if logged in, assuming not');
        this.loggedIn = false;
      }
    );

    this.feedbackForm = this.formBuilder.group({
      email:           ['', [Validators.required]],
      feedbacktext:    ['', [Validators.required]],
    });
  }

  onSubmit() {
    this.peopleService
      .feedback(this.feedbackForm.value)
      .subscribe(
        result => {
          console.log('Form submitted!');
          this.presentToast('Feedback succesfully submitted.');
          this.feedbackForm.patchValue({
            feedbacktext: '',
          });
        },
        error => {
          console.log(JSON.parse(error._body).message);
          this.presentToast('Error submitting Feedback.');
        }
      );
  }

  getUserEmail() {
    this.userData.getEmail().subscribe(
      result => {
        if (result) {
          console.log('Email has been received');
          this.loggedInEmail = result;
          this.loggedIn = true;
        } else {
          console.log('Email is not available');
          this.loggedIn = false;
        }
      },
      err => {
        console.log('Email could not be received');
        this.loggedIn = false;
      }
    );
  }

  private presentToast(text) {
    let toast = this.toastCtrl.create({
      message: text,
      duration: 6000,
      position: 'top'
    });
    toast.present();
  }

}
