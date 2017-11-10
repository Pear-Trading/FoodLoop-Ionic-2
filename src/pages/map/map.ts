import { Component, ElementRef, ViewChild } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Geolocation } from '@ionic-native/geolocation';
import { LocationAccuracy } from '@ionic-native/location-accuracy';
import { ConnectivityServiceProvider } from '../../providers/connectivity-service/connectivity-service';
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
    mapStatus: boolean = false;
    locationStatus : any = "loading";
    connectionStatus: boolean = false;

    constructor(
    public nav: NavController,
    public connectivityService: ConnectivityServiceProvider,
    private geolocation: Geolocation,
    private locationAccuracy: LocationAccuracy,
    public peopleService: PeopleService
    ) { }

    ionViewDidEnter() {
      this.loadGoogleMaps();
    }

    loadGoogleMaps() {
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
            script.src = 'https://maps.googleapis.com/maps/api/js?key=' + this.apiKey + '&callback=mapInit';
          } else {
            script.src = 'https://maps.googleapis.com/maps/api/js?callback=mapInit';
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

    initMap() {
      this.createMap();
      this.mapInitialised = true;
      this.locationAccuracy.canRequest().then((canRequest: boolean) => {
        if(canRequest) {
          // the accuracy option will be ignored by iOS
          this.locationAccuracy.request(this.locationAccuracy.REQUEST_PRIORITY_HIGH_ACCURACY).then(
            () => this.geoPan(),
            error => console.log('Error requesting location permissions', error)
          );
        } else {
          console.log("cannot request location accuracy settings");
        }
      });
    }

    geoPan() {
      console.log("loading location");
      let posOptions = {
        maximumAge: 300000,
        timeout: 20000,
        enableHighAccuracy: true,
      }
      // find position and create map
      this.geolocation.getCurrentPosition(posOptions).then((position) => {
        let latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
        this.map.panTo(latLng);
        // watch position and move to location
        let watch = this.geolocation.watchPosition();
        watch.subscribe((data) => {
          let latLng = new google.maps.LatLng(data.coords.latitude, data.coords.longitude);
          this.map.panTo(latLng);
        });
      }, (err) => {
        console.log(err);
        console.log("location not found");
        this.locationStatus = "not found";
      });
    }

    createMap() {
      // find position and create map
      this.peopleService.loadMap().subscribe(
        result => {
          if (result) {
            let latLng = new google.maps.LatLng(result.coords.latitude, result.coords.longitude);
            let mapOptions = {
              center: latLng,
              zoom: 12,
              gestureHandling: "cooperative",
              mapTypeId: google.maps.MapTypeId.ROADMAP
            }
            this.mapStatus = true;
            console.log("found location");
            this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);
          } else {
            console.log('No data received');
          }
        },
        err => {
          console.log(err);
          console.log("Could not load static map");
        }
      );
    }

    // connection lost
    disableMap() {
      console.log("disable map");
      //this.connectionStatus = false;
    }

    // connection established
    enableMap() {
      console.log("enable map");
      this.connectionStatus = true;
    }

    addConnectivityListeners() {
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