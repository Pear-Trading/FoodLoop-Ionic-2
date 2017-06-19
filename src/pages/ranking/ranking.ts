import { Component } from '@angular/core';
import { NavController, NavParams, ToastController} from 'ionic-angular';
import { PeopleService } from '../../providers/people-service';

/*
 This page represent a ranking page/leaderboard. 
 display players in leaderboard and highlight important information
*/
@Component({
  selector: 'page-ranking',
  templateUrl: 'ranking.html',
  providers: [PeopleService]
})
export class RankingPage {

  rankingData: Array<any>;
  currentPos: number;
  listType = 'daily_total';

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams ,
    private toastCtrl: ToastController,
    private peopleService : PeopleService,
  ) {}

  private fetchLeaderboard() {
    this.peopleService.leaderboard(this.listType)
      .subscribe(
        result => {
          this.rankingData = result.leaderboard;
          this.currentPos = result.user_position;
        }
      );
  }

  public changeLeaderboard(event) {
    this.fetchLeaderboard();
  }

  // dynamically changes the row style based on  player's position
  // for instance, top three player and the player him/herself should
  // be hightlighted
  public getClass(item) {
    if( item.position < 4 ) {
      return "topThree";
    } else if( item.position == this.currentPos ) {
      return "user";
    }
    return "otherUsers";
  }

  // show changes by using icon, trending up and trending down or no trend.
  public getTrendIcon(item){
    if( item.trend < 0 ){
      return "md-trending-up";
    } else if( item.trend > 0 ){
      return "md-trending-down";
    }
    return "md-remove";
  }

  // need to merge this function with getIcon
  // this function shows different icon color based on the direction of the position shifted
  public getTrendIconColor(item){
    if( item.trend < 0 ) {
      return "secondary";
    } else if( item.trend > 0 ){
      return "danger";
    }
    return "dark";
  }

}
