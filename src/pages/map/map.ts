import { Component } from '@angular/core';
import { PeopleService } from '../../providers/people-service';
import {
 GoogleMaps,
 GoogleMap,
 GoogleMapsEvent,
 GoogleMapOptions,
 CameraPosition,
 LatLng,
 LatLngBounds,
 MarkerOptions,
 Marker
} from '@ionic-native/google-maps';
import { Geolocation } from '@ionic-native/geolocation';
import { Platform } from 'ionic-angular';
import { PeopleService } from '../../providers/people-service';

@Component({
  selector: 'map',
  templateUrl: 'map.html'
})
export class MapPage {
  map: GoogleMap;
  mapElement: HTMLElement;
  constructor(
    private googleMaps: GoogleMaps,
    public platform: Platform,
    private geolocation: Geolocation,
  ) {
    // Wait the native plugin is ready.
    platform.ready().then(() => {
      this.loadMap();
      let watch = this.geolocation.watchPosition();
        watch.subscribe((data) => {
          let location = new LatLng(data.coords.latitude, data.coords.longitude);
          map.animateCamera({
           target: {lat: data.coords.latitude, lng: data.coords.longitude},
           zoom: 18,
           tilt: 30,
           bearing: 140,
           duration: 5000,
           padding: 0  // default = 20px
         });
      });
    });
  }

  // Don't use the ngAfterViewInit(). The native plugin is not ready.
  //ngAfterViewInit() {
  // this.loadMap();
  //}

 loadMap() {
  this.geolocation.getCurrentPosition({ maximumAge: 3000, timeout: 5000, enableHighAccuracy: true })
    .then((resp) => {
      this.mapElement = document.getElementById('map_orgs');

      let mapOptions: GoogleMapOptions = {
        camera: {
          target: {
            lat: resp.coords.latitude,
            lng: resp.coords.longitude
          },
          zoom: 18,
          tilt: 30
        }
      };

      this.map = this.googleMaps.create(this.mapElement, mapOptions);
    }).catch((error) => {
      console.log('Error getting location', error);
  });

  // Wait the MAP_READY before using any methods.
  this.map.one(GoogleMapsEvent.MAP_READY)
    .then(() => {
      console.log('Map is ready!');

      let mapBox = new this.LatLngBounds

      // Now you can use all methods safely.
      this.map.addMarker({
          title: 'Ionic',
          icon: 'blue',
          animation: 'DROP',
          position: {
            lat: 43.0741904,
            lng: -89.3809802
          }
        })
        .then(marker => {
          marker.on(GoogleMapsEvent.MARKER_CLICK)
            .subscribe(() => {
              alert('clicked');
            });
        });

    });
  }
}
