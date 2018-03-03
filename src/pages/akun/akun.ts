import { Component } from '@angular/core';
import { NavController, App, LoadingController } from 'ionic-angular';
import { AuthService } from '../../providers/auth-service/auth-service';
import { DepositPage } from '../deposit/deposit';
import { Geolocation } from '@ionic-native/geolocation';
import { BantuanPage } from '../bantuan/bantuan';
import { HomePage } from '../home/home';
import { LoginPage } from '../login/login';
import { MapPage } from '../map/map';

declare var google:any;

@Component({
  selector: 'page-akun',
  templateUrl: 'akun.html'
})
export class AkunPage {
  PushPage: any;
  userDetails: any;
  updateSaldo: any;
  userLokasi: any;
  vSaldo: any;
  userSaldos: any;
  responseData: any;
  lat: any;
  lng: any;
  vAlamat: any;
  userLocation: any;
  userPostData = {"id":""}

  constructor(private geolocation: Geolocation, 
    public navCtrl: NavController, 
    public app: App, 
    public loadingCtrl: LoadingController,
    public authService:AuthService) {
      this.PushPage = HomePage;
      const data = JSON.parse(localStorage.getItem('userData'));
      this.userDetails = data.userData;
      const dataSaldo = JSON.parse(localStorage.getItem('userSaldo'));
      this.userSaldos = dataSaldo.userSaldo;
      const dataLokasi = JSON.parse(localStorage.getItem('userLocation'));
      this.userLokasi = dataLokasi.userLocation;
      let loading = this.loadingCtrl.create({
        spinner: 'crescent',
        showBackdrop: true
      })
      loading.present();
      this.geocodeLatLng(parseFloat(this.userLokasi.lat), parseFloat(this.userLokasi.lng)).then(data=>{
        this.vAlamat = data;
      })
      loading.dismiss();
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
  
  openDeposit(){
    this.navCtrl.push(DepositPage)
  }

  openSlide(){
    this.navCtrl.push(BantuanPage);
  }

  openMap(){
    this.navCtrl.push(MapPage);
  }

  logOut(){
    localStorage.clear();
    this.navCtrl.setRoot(LoginPage);
  }

}