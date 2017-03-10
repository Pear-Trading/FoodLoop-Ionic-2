import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { Events } from 'ionic-angular';
import { Storage } from '@ionic/storage';

/*
 this provides data for application to run, for instance, list of known stores. 
 unlike data-user, this provide doesnt have to be unique. 
 set of goals to be complete 
*/
@Injectable()
export class FoodloopData {

  /* Storage */
  /* Cached data, the items in here should be updated periodically */
  /* to aviod foodloop data consume excessive amount of space, these data should 
    either have upper boundary or remove from time to time, etiher way, the storage 
    should maintain the least amount of foodloop data that ensures a functional app */
  public storeList; 
  public tutorialGoalList; 
  
  constructor(
    public http: Http,
    public storage: Storage
  ) {
  }

  updateList(){
    console.log("This will update list of store");
  }


}
