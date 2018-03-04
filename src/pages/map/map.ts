import { Component, ViewChild, ElementRef } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, Platform, AlertController, LoadingController, Icon } from 'ionic-angular';
import { Geolocation } from '@ionic-native/geolocation';
import { AuthService } from '../../providers/auth-service/auth-service';
import { GoogleMaps, GoogleMap, GoogleMapsEvent, GoogleMapOptions, GoogleMapsAnimation,
  // CameraPosition,
  // MarkerOptions,
  // Marker
 } from '@ionic-native/google-maps';
import { HomePage } from '../home/home';

declare var google:any;

@IonicPage()
@Component({
  selector: 'page-map',
  templateUrl: 'map.html',
})
export class MapPage {
  peta: GoogleMap;
  map: GoogleMap;
  userDetails: any;
  Start: any;
  lat: any;
  lng: any;
  dlat: any;
  dlng: any;
  coordinates: any;
  id_user: any;
  responseData : any;
  dataSet : any;
  vAlamat: any;
  vLat: any;
  vLng: any;
  userLocation: any;
  pAlamat: any;
  userPostData = {
    "id_user":"", 
    "coordLat":"", 
    "coordLng":""
  };

  @ViewChild('map') mapRef:ElementRef;
  constructor(public navCtrl: NavController, 
    public navParams: NavParams, 
    public platform: Platform,
    public authService:AuthService, 
    private googleMaps: GoogleMaps, 
    public alertCtrl: AlertController,
    public toastCtrl: ToastController, 
    public loadingCtrl: LoadingController,
    private geolocation: Geolocation) {
      const data = JSON.parse(localStorage.getItem('userData'));
      this.userDetails = data.userData;
      this.userPostData.id_user = this.userDetails.id;
  }

  ionViewDidLoad() {
    let alert = this.alertCtrl.create({
        title: 'Tips!',
        subTitle: 'Ketuk peta untuk menetukan alamat pengiriman.',
        buttons: ['OK']
    });
    alert.present();
    this.loadLocation();
  }

  loadLocation(){
    const dataLocation = JSON.parse(localStorage.getItem('userLocation'));
    this.userLocation = dataLocation.userLocation;
    this.lat = this.userLocation.lat;
    this.lng = this.userLocation.lng;
    if(this.lat != 0){
      this.geocodeLatLng(parseFloat(this.lat), parseFloat(this.lng)).then(data => {
        this.vAlamat = data;
        this.loadMap(this.lat, this.lng, this.vAlamat);
      });
    }else{
      this.geolocation.getCurrentPosition().then(pos=>{
        this.loadMap(pos.coords.latitude, pos.coords.longitude, 'Lokasi Anda');
      })
    }

  }

  loadMap(pLat, pLng, pAlamat) {
    let loading = this.loadingCtrl.create({
      spinner: 'crescent',
      showBackdrop: true
    })
    loading.present();

    let mapOptions: GoogleMapOptions = {
      camera: {
        target: {
          lat: pLat,
          lng: pLng
        },
        zoom: 15,
        tilt: 30
      }
    };

    this.map = this.googleMaps.create('map', mapOptions)
    this.map.setMyLocationEnabled(true)
    this.map.one(GoogleMapsEvent.MAP_READY).then(() => {
      loading.dismiss();
        this.map.addMarker({
          title: pAlamat,
          position: {
            lat: pLat,
            lng: pLng
          },
        })

        this.map.setMapTypeId("MAP_TYPE_ROADMAP")
        
        this.map.on(GoogleMapsEvent.MAP_CLICK).subscribe((data) => {
          this.vLat = data[0].lat;
          this.vLng = data[0].lng;
          this.map.clear();
          this.map.addMarker({
            title: pAlamat,
            position: {
              lat: data[0].lat,
              lng: data[0].lng
            },
            icon: 'https://okedeli.com/apps/images/pin.png',
          })
          this.geocodeLatLng(parseFloat(this.vLat), parseFloat(this.vLng)).then(respon => {
            this.showConfirm('Alamat pengiriman', respon, this.vLat, this.vLng)
          })

        })

      })
  }

  showConfirm(title, message, lat, lng) {
    let confirm = this.alertCtrl.create({
      title: title,
      message: message,
      buttons: [
        {
          text: 'Tidak',
          handler: () => {
            console.log('Disagree clicked');
          }
        },
        {
          text: 'Simpan',
          handler: () => {
            this.ubahLokasi(lat, lng);
          }
        }
      ]
    });
    confirm.present();
  }

  ubahLokasi(lat, lng){
    this.userPostData.coordLat = lat;
    this.userPostData.coordLng = lng;
    this.authService.postData(this.userPostData,'updateLokasi').then((result) => {
    this.responseData = result;
    this.dataSet = this.responseData.lokasiData;
    localStorage.setItem('userLocation','{"userLocation":{"lat":"'+lat+'","lng":"'+lng+'"}}');  
    this.navCtrl.setRoot(HomePage);
    }, (err) => {
      // Error log
    });
  }

  geocodeLatLng(lat, lng) {
    var geocoder = new google.maps.Geocoder;
    var latlng = {lat: lat, lng: lng};
    return new Promise(resolve => {
      geocoder.geocode({'location': latlng}, function(results, status) {
        if (status === 'OK') {
          if (results[0]) {
            resolve(results[0].formatted_address);
          } else {
            console.log('No results found');
          }
        } else {
          console.log('Geocoder failed due to: ' + status);
        }
      });
    });
  }

}