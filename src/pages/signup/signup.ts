import { Component } from '@angular/core';
import { NavController, NavParams, ToastController, Loading ,LoadingController  } from 'ionic-angular';
import { PeopleService} from '../../providers/people-service';
import { UserData} from '../../providers/user-data';
import { Validators, FormBuilder,FormGroup } from '@angular/forms'; // angular js 2 form dependency
import { IndexPage } from '../index/index';
import { LoginPage } from '../login/login';

@Component({
  selector: 'page-signup',
  templateUrl: 'signup.html',
  providers: [PeopleService]  
})

export class SignupPage {
  signup: FormGroup;
  token: string;
  submitForm: boolean = false; 
  constructor(
    private formBuilder: FormBuilder,
    public navCtrl: NavController,
    public navParams: NavParams,
    private peopleService: PeopleService,
    public toastCtrl: ToastController,
    public loadingCtrl: LoadingController,
    public userData: UserData) {
      
      this.token = navParams.get('token'); 
      /* Specifying the sign up form and validation setting */
      this.signup = this.formBuilder.group({
      username:['',
         Validators.compose([
           Validators.maxLength(30),
           Validators.required
        ])
      ],

      name:['',
        Validators.compose([
          Validators.maxLength(30),
          Validators.required
        ])
      ],
      
      age:['',
        Validators.compose([
          Validators.required
        ])
      ],
      
      email:['',
        Validators.compose([
          Validators.required,
          Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')])
      ],
      
      postcode:['',
        Validators.required
      ],  
      
      
      password:['',
        Validators.required
      ],
      
      passwordConfirmation:['',
        Validators.required
      ],

    }); 

  } 

  signupForm(){
    this.submitForm = true;
    // create json data to upload
    var registerData= JSON.stringify({
      usertype: 'customer',
      token: this.token,
      username: this.signup.value.username,
      email: this.signup.value.email,
      postcode: this.signup.value.postcode,
      password: this.signup.value.password,
      age: this.signup.value.age
    }); 
    
    // create toast showing that the signup 
    let loading = this.loadingCtrl.create({
       spinner: 'hide',
       content: 'Loading Please Wait...'
    });
   loading.present();
   
     this.peopleService.register(registerData).subscribe(
       data => {
        loading.dismiss();  
        this.userData.signup(this.signup.value.username);
        this.navCtrl.push(IndexPage,{"username":this.signup.value.username});
      },
       error=> {
        loading.dismiss();  
        let toast = this.toastCtrl.create({
          message: JSON.parse(error._body).message,
          duration: 3000,
          position: 'top'
        });
        toast.present();
      });
  }
}
