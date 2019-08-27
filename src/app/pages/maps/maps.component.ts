import { Component, OnInit } from '@angular/core';
declare const google: any;

@Component({
  selector: 'app-maps',
  templateUrl: './maps.component.html',
  styleUrls: ['./maps.component.scss']
})
export class MapsComponent implements OnInit {

  constructor() { }

  ngOnInit() {
    let map = document.getElementById('map-canvas');
    const lat = map.getAttribute('data-lat');
    const lng = map.getAttribute('data-lng');

    const myLatlng = new google.maps.LatLng(lat, lng);
    const mapOptions = {
        zoom: 12,
        scrollwheel: false,
        center: myLatlng,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        styles: [
          {'featureType': 'administrative', 'elementType': 'labels.text.fill', 'stylers': [{'color': '#444444'}]},
          {'featureType': 'landscape', 'elementType': 'all', 'stylers': [{'color': '#f2f2f2'}]},
          {'featureType': 'poi', 'elementType': 'all', 'stylers': [{'visibility': 'off'}]},
          {'featureType': 'road', 'elementType': 'all', 'stylers': [{'saturation': -100}, {'lightness': 45}]},
          {'featureType': 'road.highway', 'elementType': 'all', 'stylers': [{'visibility': 'simplified'}]},
          {'featureType': 'road.arterial', 'elementType': 'labels.icon', 'stylers': [{'visibility': 'off'}]},
          {'featureType': 'transit', 'elementType': 'all', 'stylers': [{'visibility': 'off'}]},
          {'featureType': 'water', 'elementType': 'all', 'stylers': [{'color': '#5e72e4'}, {'visibility': 'on'}]}]
    };

    map = new google.maps.Map(map, mapOptions);

    const marker = new google.maps.Marker({
        position: myLatlng,
        map: map,
        animation: google.maps.Animation.DROP,
        title: 'Hello World!'
    });

    const contentString = '<div class="info-window-content"><h2>Argon Dashboard</h2>' +
        '<p>A beautiful Dashboard for Bootstrap 4. It is Free and Open Source.</p></div>';

    const infowindow = new google.maps.InfoWindow({
        content: contentString
    });

    google.maps.event.addListener(marker, 'click', function() {
        infowindow.open(map, marker);
    });
  }

}
