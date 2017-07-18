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

  constructor(
    private formBuilder: FormBuilder,
    private toastCtrl: ToastController,
    private peopleService: PeopleService,
    private userData: UserData,
  ) {
    this.feedbackForm = this.formBuilder.group({
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
        },
        error => {
          console.log(JSON.parse(error._body).message);
          this.presentToast('Error submitting Feedback.');
        }
      );
  }

  private presentToast(text) {
    let toast = this.toastCtrl.create({
      message: text,
      duration: 3000,
      position: 'top'
    });
    toast.present();
  }

}
