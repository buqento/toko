import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, ToastController } from 'ionic-angular';
import { AuthService } from '../../providers/auth-service/auth-service';
import { Platform } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
})
export class HomePage {
  pushPage: any;
  produk: string = "populer";
  isAndroid: boolean = false;
  userDetails: any;
  kodeBelanja: any;
  responseData: any;
  dataSet: any;
  dataSetPenyedia: any;
  productPostData = {"kategori":"", "id":"", "kodeBelanja":"", "id_user":"", "penyedia_id":""}

  constructor(platform: Platform, 
    public toastCtrl: ToastController,
    public loadingCtrl: LoadingController, 
    public navCtrl: NavController, 
    public authService: AuthService){

    this.isAndroid = platform.is('android');    
    const data = JSON.parse(localStorage.getItem('userData'));
    this.userDetails = data.userData;
    const dataKodeBelanja = JSON.parse(localStorage.getItem('kodeBelanja'));
    this.kodeBelanja = dataKodeBelanja.kodeBelanja;
    this.productPostData.kodeBelanja = this.kodeBelanja.kode;
    this.productPostData.id_user = this.userDetails.id;
    
    this.getProduct();
    this.getPenyedia();
  }

  doRefresh(refresher){
    this.getProduct();
    refresher.complete();
  }

  getProduct(){
    let loading = this.loadingCtrl.create({
      spinner: 'crescent',
      showBackdrop: true
    })
    loading.present();
    this.authService.postData(this.productPostData,'getNewProduct').then((result) => {
      this.responseData = result;
      this.dataSet = this.responseData.newproductData;
      loading.dismiss();
    });
  }

  getPenyedia(){
    this.authService.postData(this.productPostData,'penyedia').then((result) => {
      this.responseData = result;
      this.dataSetPenyedia = this.responseData.penyediaData;
    });
  }

}