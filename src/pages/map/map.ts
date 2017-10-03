import { Component, ElementRef, ViewChild } from '@angular/core';
import { NavController } from 'ionic-angular';
import { ConnectivityServiceProvider } from '../../providers/connectivity-service/connectivity-service';
import { Geolocation } from '@ionic-native/geolocation';
import { PeopleService } from '../../providers/people-service';
import { ConfigurationService } from '../../providers/configuration.service';

declare var google;

@Component({
  selector: 'map',
  templateUrl: 'map.html',
  providers: [PeopleService]
})
export class MapPage {

  @ViewChild('map') mapElement: ElementRef;

    map: any;
    mapInitialised: boolean = false;
    private apiKey = ConfigurationService.mapApiKey;

    constructor(
    public nav: NavController,
    public connectivityService: ConnectivityServiceProvider,
    private geolocation: Geolocation
    ) {
      this.loadGoogleMaps();
    }

    loadGoogleMaps(){
      this.addConnectivityListeners();
    if(typeof google == "undefined" || typeof google.maps == "undefined"){
      console.log("Google maps JavaScript needs to be loaded.");
      this.disableMap();
      if(this.connectivityService.isOnline()){
        console.log("online, loading map");
        //Load the SDK
        window['mapInit'] = () => {
          this.initMap();
          this.enableMap();
        }
        let script = document.createElement("script");
        script.id = "googleMaps";
        if(this.apiKey){
          script.src = 'http://maps.google.com/maps/api/js?key=' + this.apiKey + '&callback=mapInit';
        } else {
          script.src = 'http://maps.google.com/maps/api/js?callback=mapInit';
        }
        document.body.appendChild(script);
      }
    }
    else {
      if(this.connectivityService.isOnline()){
        console.log("showing map");
        this.initMap();
        this.enableMap();
      }
      else {
        console.log("disabling map");
        this.disableMap();
      }
    }
    }

    initMap(){
      this.mapInitialised = true;
      this.geolocation.getCurrentPosition().then((position) => {
        let latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
        let mapOptions = {
          center: latLng,
          zoom: 15,
          mapTypeId: google.maps.MapTypeId.ROADMAP
        }
        this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);
      });
    }

    // connection lost
    disableMap(){
      console.log("disable map");
    }

    // connection established
    enableMap(){
      console.log("enable map");
    }

    addConnectivityListeners(){
      let onOnline = () => {
        setTimeout(() => {
          if(typeof google == "undefined" || typeof google.maps == "undefined"){
            this.loadGoogleMaps();
          } else {
            if(!this.mapInitialised){
              this.initMap();
            }
            this.enableMap();
          }
        }, 2000);
      };
      let onOffline = () => {
        this.disableMap();
      };
      document.addEventListener('online', onOnline, false);
      document.addEventListener('offline', onOffline, false);
    }
  }
