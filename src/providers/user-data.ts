import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/map';
/*
  this ts file handles the user-data, including login, logout event
  user-data management by storing data in the local storage
  other pages can import this page and call method to retrieve user-data
  such as getUsername()
*/
@Injectable()
export class UserData {

  constructor(
    private storage: Storage
  ) {
    this.loadTestingData();
  }

  // Session Key transactions

  public setSessionKey(key: string) {
    console.log("set sessionKey");
    this.storage.set('SessionKey',key);
  }

  public getSessionKey() {
    console.log("get sessionKey");
    return Observable.fromPromise(
      this.storage.get('SessionKey')
    );
  }

  public removeSessionKey() {
    console.log("remove sessionKey");
    this.storage.remove('SessionKey');
  }

  // Checks for first time entering app status

  public setReturningEntry() {
    console.log("set returning");
    // this.storage.set('returning',true);
  }

  public getReturningEntry() {
    console.log("get returning");
    return Observable.fromPromise(
      this.storage.get('returning')
    );
  }

  // Checks for first time login

  public setReturningLogin() {
    console.log("set returninglogin");
    this.storage.set('returninglogin',true);
  }

  public getReturningLogin() {
    console.log("get returninglogin");
    return Observable.fromPromise(
      this.storage.get('returninglogin')
    );
  }

  // Checks for login status

  public hasLoggedIn() {
    return this.getSessionKey().map(
      result => result ? true : false
    );
  }

  // Pulls user info to store locally on login

  public setUserInfo(
    email: string,
    display_name: string) {
    console.log("set UserInfo");
    this.storage.set('email',email);
    this.storage.set('displayname',display_name);
  }

  // Deletes account details on logout

  public removeUserInfo() {
    console.log("remove UserInfo");
    this.storage.remove('email');
    this.storage.remove('displayname');
  }

  public getFullName() {
    console.log("get Full Name");
    return Observable.fromPromise(
      this.storage.get('fullname')
    );
  }

  public getDisplayName() {
    console.log("get Display Name");
    return Observable.fromPromise(
      this.storage.get('displayname')
    );
  }

  public getPostcode() {
    console.log("get Postcode");
    return Observable.fromPromise(
      this.storage.get('postcode')
    );
  }

  public getYearOfBirth() {
    console.log("get Year of Birth");
    return Observable.fromPromise(
      this.storage.get('yearofbirth')
    );
  }

  public getEmail() {
    console.log("get email");
    return Observable.fromPromise(
      this.storage.get('email')
    );
  }

  // Remove below if above code works

  public setEmail(email: string) {
    console.log("set Email");
    this.storage.set('email',email);
  }

  public removeEmail() {
    console.log("remove email");
    this.storage.remove('email');
  }

  /* Testing purpose, ideally, these variable should be initilizaed via calling */
  /* server APIs */
  /* myData stores user detail including email, fullname, username and invitation token */
  /* rankingData stores ranking data including monthly spend of user */
  /* testingData store all data required for testing */

  public myData:any;
  public rankingData: any;
  public testingData;

  HAS_LOGGED_IN = 'hasLoggedIn';

  /* Storage */
  /* The data stored in storage is like cache data, the system should periodically update
  these data to maintain the latest state */
  // Game data, set of personal goals, ongoing progress of a goal
  // User data, set of personal data to be displayed, username, profile pic, theme color


  loadTestingData() {

    /* Internal database for user testing, handles login, logoff and retrieves user-data */
    this.testingData = {
      test007: [
        {"username": "testingc@test.com","password":"admin","token": "test007","fullname": "John Smtih","email" : "testingc@test.com","rankingID": "0"}
      ],
      ranking:[
        {token:"d","ref":"testingc@test.com","username": "Dave Brookes","previousPos":1,"currentPos":1,"pearPoint":620.57,"retailerSpent":20,"receiptSubmitted":161,"firstStart":"20-Jun-15"},

        {token:"e","ref":"admin","username": "Michael Hallam","previousPos":2,"currentPos":2,"pearPoint":391.10,"retailerSpent":51,"receiptSubmitted":429,"firstStart":"1-Jun-15"},

        {token:"f","ref":"test003","username": "Steve Jenkins","previousPos":3,"currentPos":3,"pearPoint":208.62,"retailerSpent":13,"receiptSubmitted":97,"firstStart":"12-Feb-16"},

        {token:"g","ref":"test004","username": "Dawn Keyse","previousPos":5,"currentPos":4,"pearPoint":202.58,"retailerSpent":20,"receiptSubmitted":60,"firstStart":"1-Jun-15"},

        {token:"h","ref":"test005","username": "Beccy Whittle","previousPos":7,"currentPos":5,"pearPoint":173.20,"retailerSpent":12,"receiptSubmitted":64,"firstStart":"22-Jul-15"},

        {token:"i","ref":"test006","username": "Anna Clayton","previousPos":4,"currentPos":6,"pearPoint":169.93,"retailerSpent":18,"receiptSubmitted":51,"firstStart":"10-Jun-15"},

        {token:"j","ref":"test007","username": "Emily Heath","previousPos":6,"currentPos":7,"pearPoint":147.39,"retailerSpent":5,"receiptSubmitted":65,"firstStart":"30-Jun-15"},

        {token:"k","ref":"test008","username": "Mark Keating","previousPos":9,"currentPos":8,"pearPoint":143.46,"retailerSpent":11,"receiptSubmitted":56,"firstStart":"14-Mar-16"},

        {token:"l","ref":"test009","username": "Hannah Reade","previousPos":8,"currentPos":9,"pearPoint":138.77,"retailerSpent":9,"receiptSubmitted":40,"firstStart":"15-Jan-16"},

        {token:"m","ref":"test010","username": "Tony Haslam","previousPos":10,"currentPos":10,"pearPoint":113.02,"retailerSpent":14,"receiptSubmitted":61,"firstStart":"10-Jun-15"},

        {token:"w","ref":"test011","username": "Ruta Hallam","previousPos":11,"currentPos":11,"pearPoint":111.66,"retailerSpent":21,"receiptSubmitted":57,"firstStart":"17-Jun-15"},

        {token:"m","ref":"test012","username": "Andrew Willis","previousPos":12,"currentPos":12,"pearPoint":91.88,"retailerSpent":3,"receiptSubmitted":13,"firstStart":"30-Apr-16"}
      ],
      tokens:[
        {"tokenString":"test007"},
        {"tokenString":"test008"},
        {"tokenString":"test009"},
        {"tokenString":"test0010"},
        {"tokenString":"test0011"},
      ]
    };
    /* Testing */

  }

  random_data(username,fullname){
       return   {token:"d","ref":username,"username": fullname,"previousPos":1,"currentPos":1,"pearPoint":620.57,"retailerSpent":20,"receiptSubmitted":161,"firstStart":"20-Jun-15"};
  }

  /* Storage management and data access method */
  getRankingData(){
    return this.testingData.ranking;
  }

  getUsername() {
    return this.storage.get('username').then((value) => {
      return value;
    });
  };

  setUsername(username: string) {
    this.storage.set('username', username);
  };



  /* Storage management and data access method end */

  /* Testing */
  /* Gather data of the specified username and return packed data */
  getMyData(username){

    var filtered = this.testingData.ranking.filter(function(item) {
      return item.ref === "admin";});
      // console.log(filtered[1].username);
      return new Promise((resolve,reject)=>resolve(filtered["0"]));
  }

}
