import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';


/* this provider handles the interaction between server and client */
 
@Injectable()
export class PeopleService {
  api_url =  'https://dev.app.peartrade.org';

  constructor(
    private http: Http
  ) {} 

  getAgeRanges () {
    return this.http.get(
      this.api_url + '/api/info/ages'
    ).map( res => res.json() );
  }

  register (data) {
    let register_url = this.api_url + 'register';

    return this.http.post(
      register_url,
      data
    ).map( res => res.json() );
  }

  /* Links to server, these should be stored in config.js */
  foodloop_root_url = "http://app.peartrade.org/";
  foodloop_root_url_register = this.foodloop_root_url + "register";
  foodloop_root_url_upload =  this.foodloop_root_url+ "upload";
  foodloop_root_url_edit = this.foodloop_root_url + "edit";
  foodloop_root_url_token = this.foodloop_root_url + "token";
  foodloop_root_url_login = this.foodloop_root_url + "login";
  foodloop_root_url_search = this.foodloop_root_url + "search";
  foodloop_root_url_approve = this.foodloop_root_url + "admin-approve";
  foodloop_root_url_user_history = this.foodloop_root_url + "user-history";


  getUserHistory(data){
    return this.http.post(this.foodloop_root_url_user_history,data);
  }
  search(data){
    return this.http.post(this.foodloop_root_url_search,data);
  }

  upload(data){ 
    return this.http.post(this.foodloop_root_url_upload,data).map(res=> res.json());
  }

  edit(data){ 
    return this.http.post(this.foodloop_root_url_edit,data);
  }
  
  verifyToken(data){ 
    return this.http.post(this.foodloop_root_url_token,data);
  }

  approve(data){
    return this.http.post(this.foodloop_root_url_approve,data);
  }
  login(data){

    return this.http.post(this.foodloop_root_url_login,data).map(res=>res.json());
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
