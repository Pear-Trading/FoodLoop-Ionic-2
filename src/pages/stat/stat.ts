import { Component , ViewChild, ElementRef } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Chart } from 'chart.js';
import { PeopleService } from '../../providers/people-service';
import { UserData } from '../../providers/user-data';

/*
  this defines the representation of data in list and chart
*/
@Component({
  selector: 'page-stat',
  templateUrl: 'stat.html',
  providers: [PeopleService,UserData]

})
export class StatPage {
  // get element by id -> barCanvas
  @ViewChild('lineCanvas') lineCanvas: ElementRef;


  innerTabCtrl; // set default style of the page as list 
  sessionToken;
  //  varibles of chart
  rankChart: any;   // shows changes in rankChart
  pointChart: any;  // shows changes in pear point over a period of time
  spentChart: any;  // shows changes in spent over a period of time
  respentChart: any; // shows changes in respent over a period of time 

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public peopleService: PeopleService,
    public userData : UserData
    ) {
    this.innerTabCtrl = "Chart";  // Default representation of the page is Chart 
     // get session token
     this.userData.getSessionKey().then(token => { 
    this.sessionToken = token;
  }).catch(error => alert(error));
  }


  ionViewDidEnter() {
   // getting chart data
   this.initCharts();
  }


// testing, getting user history of duing 09/03/2017-09/03/2019
tst(){
  var data = JSON.stringify({
  retrieveType: 2, 
  startDayNumber: 9,
  startMonthNumber: 3 ,
  startYear:2017 ,
  endDayNumber: 9,
  endMonthNumber:3 ,
  endYear: 2019,
    sessionToken: this.sessionToken,
  });

  this.peopleService.getUserHistory(data).subscribe(data=>{
    console.log(data);
  },error=>{
    console.log(error);
  });
  console.log(this.lineCanvas)
} 

/*********************** --  Data representation part -- **************************/
  /* including calling provider whihc calls api to retrieve user data */
  /* navigation and respresentation of the retrieved data */

  initCharts(){
    console.log("initCharts");
    this.pointChart = new Chart(this.lineCanvas.nativeElement,this.peopleService.getChartData("point"));
  }


}
