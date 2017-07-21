import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Transfer, FileUploadOptions, TransferObject } from '@ionic-native/transfer';
import { UserData } from './user-data';
import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/map';
import { AppVersion } from '@ionic-native/app-version';



/* this provider handles the interaction between server and client */

@Injectable()
export class PeopleService {
  private apiUrl = 'https://dev.peartrade.org/api';
  //  private apiUrl = 'http://localhost:3000/api';

  constructor(
    private http: Http,
    private transfer: Transfer,
    private userData: UserData,
    private appVersion: AppVersion,
  ) {}

  public feedback(data) {
    data.app_name = this.appVersion.getAppName();
    data.package_name = this.appVersion.getPackageName();
    data.version_code = this.appVersion.getVersionCode();
    data.version_number = this.appVersion.getVersionNumber();
    return this.http.post(
      this.apiUrl + '/feedback',
      data
    ).map( response => response.json() );
  }

  public register(data) {
    return this.http.post(
      this.apiUrl + '/register',
      data
    ).map( response => response.json() );
  }

  public login(data) {
    return this.http.post(
      this.apiUrl + '/login',
      data
    ).map( response => response.json() );
  }

  public logout() {
    return this.userData.getSessionKey()
      .flatMap(
        key => {
          this.userData.removeSessionKey();
          this.userData.removeEmail();
          this.userData.removeDisplayName();
          return this.http.post(
            this.apiUrl + '/logout',
            { session_key : key }
          );
        }
      ).map( response => response.json );
  }

  public upload(data, filePath) {
    return this.userData.getSessionKey()
      .flatMap(
        key => {
          data.session_key = key;
          let options: FileUploadOptions = {
            fileKey: 'file',
            fileName: 'receipt.jpg',
            chunkedMode: false,
            params: {
              json: JSON.stringify(data)
            }
          };
          const fileTransfer: TransferObject = this.transfer.create();
          return Observable.fromPromise(
            fileTransfer.upload(
              filePath,
              this.apiUrl + '/upload',
              options
            )
          )
        }
      ).map( response => JSON.parse(response.response) );
  }

  public search(data) {
    return this.userData.getSessionKey()
      .flatMap(
        value => {
          data.session_key = value;
          return this.http.post(
            this.apiUrl + '/search',
            data
          );
        }
      ).map( response => response.json() );
  }

  public basicStats() {
    return this.userData.getSessionKey()
      .flatMap(
        key => {
          return this.http.post(
            this.apiUrl + '/stats',
            { session_key : key },
          );
        },
      ).map( response => response.json() );
  }

  public leaderboard(lb_type) {
    return this.userData.getSessionKey()
      .flatMap(
        key => {
          return this.http.post(
            this.apiUrl + '/stats/leaderboard',
            {
              session_key : key,
              type : lb_type,
            },
          );
        },
      ).map( response => response.json() );
  }

  /* Links to server, these should be stored in config.js */
  foodloop_root_url = "http://app.peartrade.org/";
  foodloop_root_url_edit = this.foodloop_root_url + "edit";
  foodloop_root_url_token = this.foodloop_root_url + "token";
  foodloop_root_url_approve = this.foodloop_root_url + "admin-approve";

  edit(data){
    return this.http.post(this.foodloop_root_url_edit,data);
  }

  verifyToken(data){
    return this.http.post(this.foodloop_root_url_token,data);
  }

  approve(data){
    return this.http.post(this.foodloop_root_url_approve,data);
  }


/*********************** --  Data representation part -- **************************/
  /* including get request to server to retrieve user data */
  /* manipulation , calculation and respresentation of the retrieved data */

getChartData(type){
  // api
  // get request to retrieve user's point over different period of time
  var chartData;
  switch(type){
    case "point":
        chartData = {
         type: 'line',
         data:{
           labels:["Mon","Tue","Wed","Thur","Fri","Sat","Sun"],
           datasets: [{

             data: [333.30,350.55, 366.50, 400.00, 450.00, 506.66],
             backgroundColor: [
                'rgba(255, 99, 132, 0.2)',
                'rgba(54, 162, 235, 0.2)',
                'rgba(255, 206, 86, 0.2)',
                'rgba(75, 192, 192, 0.2)',
                'rgba(153, 102, 255, 0.2)',
                'rgba(255, 159, 64, 0.2)'
             ],
             borderColor:[
                'rgba(255,99,132,1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(75, 192, 192, 1)',
                'rgba(153, 102, 255, 1)',
                'rgba(255, 159, 64, 1)'
             ],
             borderWidth: 1
           }]
         },options: {
                  scales: {
            yAxes: [{
                ticks: {
                    beginAtZero:true
                }
            }]
        },
                title: {
            display: true,
            text: 'Daily overview'
        }

         }
      };
      return chartData;

    case "spent":
      break;
    case "respent":
      break;
    case "Daily":
      chartData = {
         type: 'line',
         data:{
           labels:["Mon","Tue","Wed","Thur","Fri","Sat","Sun"],
           datasets: [{

               data: [12, 19, 3, 5, 2, 3],
             backgroundColor: [
                'rgba(255, 99, 132, 0.2)',
                'rgba(54, 162, 235, 0.2)',
                'rgba(255, 206, 86, 0.2)',
                'rgba(75, 192, 192, 0.2)',
                'rgba(153, 102, 255, 0.2)',
                'rgba(255, 159, 64, 0.2)'
             ],
             borderColor:[
                'rgba(255,99,132,1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(75, 192, 192, 1)',
                'rgba(153, 102, 255, 1)',
                'rgba(255, 159, 64, 1)'
             ],
             borderWidth: 1
           }]
         },options: {
                  scales: {
            yAxes: [{
                ticks: {
                    beginAtZero:true
                }
            }]
        },
                title: {
            display: true,
            text: 'Daily overview'
        }

         }
      };
      return chartData;

    case "Weekly":
      chartData = {
        type: "bar",
        data:{
        labels: ["1st", "2nd", "3rd", "4th", "5th"],
        datasets: [
        {
            label: "Top 5 Player",
            backgroundColor: [
                'rgba(255, 99, 132, 0.2)',
                'rgba(54, 162, 235, 0.2)',
                'rgba(255, 206, 86, 0.2)',
                'rgba(75, 192, 192, 0.2)',
                'rgba(153, 102, 255, 0.2)',
                'rgba(255, 159, 64, 0.2)'
            ],
            borderColor: [
                'rgba(255,99,132,1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(75, 192, 192, 1)',
                'rgba(153, 102, 255, 1)',
                'rgba(255, 159, 64, 1)'
            ],
            borderWidth: 1,
            data: [500, 400, 350, 325, 256],
        }
      ]
        }
      };
      return chartData;

    case "Monthly":
      chartData = {};
      return chartData;

  }
}


}
