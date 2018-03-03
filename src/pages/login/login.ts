import { Component } from '@angular/core';
import { IonicPage, NavController, LoadingController, ToastController } from 'ionic-angular';
import { AuthService } from '../../providers/auth-service/auth-service';
import { HomePage } from '../home/home';
import { SignupPage } from '../signup/signup';

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {
  PushSignup: any;
  responseData : any;
  userDetails: any;
  uLat: any;
  uLng: any;
  userData = {"username": "carlos","password": "111111"};

  constructor(public navCtrl: NavController, 
    public authService: AuthService,
    public loadingCtrl: LoadingController,
    public toastCtrl: ToastController) {
      this.PushSignup = SignupPage;
  }

  ionViewDidLoad(){
    let userLogin = localStorage.getItem("userData");
		if(userLogin){
      this.navCtrl.setRoot(HomePage);
    }
  }

  presentToast(msg){
    let toast = this.toastCtrl.create({
      message: msg,
      duration: 2000,
      position: 'top',
    });
    toast.present();
  }

  getRandom(length){
    return Math.floor(Math.pow(10, length-1) + Math.random() * 9 * Math.pow(10, length-1));
  }

  logIn(){
    if(this.userData.username && this.userData.password){
      let loading = this.loadingCtrl.create({
        spinner: 'crescent',
        showBackdrop: true
      })
      loading.present();
      this.authService.postData(this.userData,'login').then((result) => {
      this.responseData = result;
      if(this.responseData.userData){
        localStorage.setItem('userData', JSON.stringify(this.responseData));
        const data = JSON.parse(localStorage.getItem('userData'));
        this.userDetails = data.userData;
        this.uLat = this.userDetails.lat;
        this.uLng = this.userDetails.lng;
        let saldo: any = this.userDetails.saldo;
        localStorage.setItem('userLocation','{"userLocation":{"lat":"'+this.uLat+'","lng":"'+this.uLng+'"}}');
        localStorage.setItem('userSaldo','{"userSaldo":{"saldo":"'+saldo+'"}}');
        localStorage.setItem('kodeBelanja','{"kodeBelanja":{"kode":"'+this.getRandom(12)+'"}}');
        loading.dismiss();
        this.navCtrl.setRoot(HomePage);
      }else{
        loading.dismiss();
        this.presentToast("Nama pengguna atau kata sandi tidak valid.");
      }
    }, (err) => {
   });

  }else{
    this.presentToast("Data login tidak valid.");
  }}

}