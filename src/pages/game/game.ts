import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { AchievementPage } from '../achievement/achievement';
@Component({
  selector: 'page-game',
  templateUrl: 'game.html'
})
export class GamePage {

  constructor(public navCtrl: NavController, public navParams: NavParams) {}

  ionViewDidLoad() {
    console.log('ionViewDidLoad GamePage');
  }

}
