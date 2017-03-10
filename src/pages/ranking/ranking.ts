import { Component } from '@angular/core';
import {ComponentFactoryResolver} from '@angular/core';
import { NavController, NavParams, ToastController} from 'ionic-angular';
import { UserData } from '../../providers/user-data';


/*
 This page represent a ranking page/leaderboard. 
 display players in leaderboard and highlight important information
*/
@Component({
  selector: 'page-ranking',
  templateUrl: 'ranking.html',
  providers: [UserData]
})
export class RankingPage {

  searchQuery: string = '';
  username: any;
  rankingData: any;
  currentPos: any;
  listType = 'All';
  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams ,
    private toastCtrl: ToastController,
    public userData : UserData
  
  ) {
    // get username and display my position in the board differently 
    this.userData.getUsername().then(value=>{
      this.username = value; 
      this.fetchData();
      this.userData.getMyData(this.username).then(
        value=>{
          var temp;
          temp = value; 
          this.currentPos = temp.currentPos;
       })
    });
  }

// create sample test data 
// to-do, initilize an API call to foodloop server to
// retrieve data regarding leaderboard
 fetchData(){
  this.rankingData = this.userData.getRankingData();
  console.log(this.rankingData);
 }

// dynamically changes the row style based on  player's position
// for instance, top three player and the player him/herself should
// be hightlighted 
getClass(item){
  if(item.currentPos<4)
  return "topThree";
  else if(item.currentPos==this.currentPos)
  return "user";
  else 
  return "otherUsers";
}

// show changes by using icon, trending up and trending down or no trend. 
getIcon(item){
  if(item.currentPos<item.previousPos){
    return "md-trending-up";
  } else if(item.currentPos==item.previousPos){
    return "md-remove";
  }  else {
    return "md-trending-down";
  }
}  

// need to merge this function with getIcon
// this function shows different icon color based on the direction of the position shifted 
getIconColor(item){
  if(item.currentPos<item.previousPos){
    return "secondary";
  } else if(item.currentPos==item.previousPos){
    return "dark";
  }  else {
    return "danger";
  }
}

}
