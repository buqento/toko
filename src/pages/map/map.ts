import { Component, ViewChild, ElementRef } from '@angular/core';
import { IonicPage, NavController, Platform, AlertController, ActionSheetController } from 'ionic-angular';
import { AuthService } from '../../providers/auth-service/auth-service';
import { GoogleMaps, GoogleMap, GoogleMapsEvent, GoogleMapOptions } from '@ionic-native/google-maps';
import { HomePage } from '../home/home';

declare var google:any;

@IonicPage()
@Component({
  selector: 'page-map',
  templateUrl: 'map.html',
})
export class MapPage {
  peta: GoogleMap;
  userDetails: any;
  userLocation: any;
  lat: any;
  lng: any;
  id_user: any;
  responseData : any;
  dataSet : any;
  vLat: any;
  vLng: any;
  vInfoAddress: any;
  vAlamat: any;
  userPostData = {
    "id_user":"", 
    "coordLat":"", 
    "coordLng":"",
    "address":""
  };

  @ViewChild('map') mapRef:ElementRef;
  constructor(public navCtrl: NavController, 
    public actionSheetCtrl: ActionSheetController,
    public platform: Platform,
    public authService:AuthService, 
    private googleMaps: GoogleMaps, 
    public alertCtrl: AlertController) {
      const data = JSON.parse(localStorage.getItem('userData'));
      this.userDetails = data.userData;
      this.userPostData.id_user = this.userDetails.id;
  }

  ionViewDidLoad() {
    this.platform.ready().then( () => {
      this.loadMap();
    });
  }

  presentActionSheet(respon) {
    let actionSheet = this.actionSheetCtrl.create({
      title: 'Current Address',

      buttons: [
        {
          text: respon,
          handler: () => {
            console.log('Archive clicked');
          }
        },{
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        }
      ]
    });
    actionSheet.present();
    setTimeout(() => { actionSheet.dismiss(); }, 3000);
  }

  
  loadMap(){

    let mapOptions: GoogleMapOptions = {
      camera: {
        target: { lat: -3.693485, lng: 128.182395 },
        zoom: 18,
        // tilt: 30
      }
    };

    this.peta = this.googleMaps.create('map', mapOptions);
    this.peta.one(GoogleMapsEvent.MAP_READY)
      .then(()=>{
        this.peta.getMyLocation().then(pos=>{
          this.peta.animateCamera({
            target: pos.latLng,
            zoom: 16
          })
          this.geocodeLatLng(pos.latLng.lat, pos.latLng.lng).then(respon=>{
            this.vInfoAddress = respon;
            this.vLat = pos.latLng.lat;
            this.vLng = pos.latLng.lng;
          })
        })

        this.peta.on(GoogleMapsEvent.MAP_DRAG_END).subscribe(()=>{
          let pos = this.peta.getCameraTarget();
          this.geocodeLatLng(pos.lat, pos.lng).then(respon=>{
            this.vInfoAddress = respon;
            this.vLat = pos.lat;
            this.vLng = pos.lng;
            // this.presentActionSheet(respon);
          })
        })



        this.peta.setMyLocationEnabled(true);
        // this.peta.addMarker({
        //     title: 'Alamat Pengiriman',
        //     icon: 'blue',
        //     animation: GoogleMapsAnimation.BOUNCE,
        //     position: result.latLng,
        //     // position: new LatLng(21.3813892, -157.93307),
        //     draggable: true
        //   })
        //   .then((marker:Marker) => {
        //     marker.on(GoogleMapsEvent.MARKER_CLICK)
        //       .subscribe(() => {
        //         alert('Drag marker untuk menentukan alamat pengiriman');
        //      });
    
        //     marker.on(GoogleMapsEvent.MARKER_DRAG_END).subscribe( (data) => {
        //       this.vLat = data[0].lat;
        //       this.vLng = data[0].lng;
        //       this.geocodeLatLng(parseFloat(this.vLat), parseFloat(this.vLng)).then(respon => {
        //         this.showConfirm('Alamat pengiriman', respon, this.vLat, this.vLng)
        //       })
        //     })
        //   })
      })
  }

  showConfirm() {
    let confirm = this.alertCtrl.create({
      title: 'Alamat Pengiriman',
      message: this.vInfoAddress,
      buttons: [
        {
          text: 'Alamat lain',
          handler: () => {
            console.log('Disagree clicked');
          }
        },
        {
          text: 'Simpan',
          handler: () => {
            this.updateLokasi(this.vLat, this.vLng, this.vInfoAddress);
          }
        }
      ]
    })
    confirm.present();
  }

  updateLokasi(lat, lng, address){
    this.userPostData.coordLat = lat;
    this.userPostData.coordLng = lng;
    this.userPostData.address = address;
    this.authService.postData(this.userPostData,'updateLokasi').then((result) => {
    this.responseData = result;
    this.dataSet = this.responseData.lokasiData;
    localStorage.setItem('userLocation','{"userLocation":{"lat":"'+lat+'","lng":"'+lng+'","address":"'+address+'"}}');  
    this.navCtrl.setRoot(HomePage);
    }, (err) => {
      // Error log
    })
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