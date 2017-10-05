import { Component, ElementRef, ViewChild } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Geolocation } from '@ionic-native/geolocation';
import { Diagnostic } from '@ionic-native/diagnostic';
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

    constructor(
    public nav: NavController,
    public connectivityService: ConnectivityServiceProvider,
    private geolocation: Geolocation,
    private diagnostic: Diagnostic
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
      this.mapInitialised = true;
      this.diagnostic.isLocationEnabled().then(
      (isAvailable) => {
        if ( isAvailable == true ) {
          this.createMap();
        } else {
          this.diagnostic.switchToLocationSettings();
        }
      }).catch( (e) => {
        console.log(e);
        this.locationStatus = "not found";
      });
    }

    createMap() {
      // find position and create map
      this.geolocation.getCurrentPosition(0,10000,false).then((position) => {
        let latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
        let mapOptions = {
          center: latLng,
          zoom: 13,
          gestureHandling: "cooperative",
          mapTypeId: google.maps.MapTypeId.ROADMAP
        }
        this.locationStatus = "found";
        this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);

        // watch position and move to location
        let watch = this.geolocation.watchPosition();
        watch.subscribe((data) => {
         let latLng = new google.maps.LatLng(data.coords.latitude, data.coords.longitude);
         this.map.panTo(latLng);
        });
      }, (err) => {
        console.log(err);
      });
    }

    // connection lost
    disableMap() {
      console.log("disable map");
      this.mapStatus = false;
    }

    // connection established
    enableMap() {
      console.log("enable map");
      this.mapStatus = true;
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
