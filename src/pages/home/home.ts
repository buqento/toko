import { Component } from '@angular/core';
import { IonicPage, NavController, LoadingController, ToastController } from 'ionic-angular';
import { AuthService } from '../../providers/auth-service/auth-service';
import { Platform } from 'ionic-angular';
import { DetailPage } from '../detail/detail';
import { PenyediaPage } from '../penyedia/penyedia';
import { KategoriPage } from '../kategori/kategori';
import { KeranjangPage } from '../keranjang/keranjang';
import { OrderPage } from '../order/order';
import { BantuanPage } from '../bantuan/bantuan';
import { AkunPage } from '../akun/akun';

@IonicPage()
@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
})
export class HomePage {
  PushBantuan: any;
  PushAkun: any;
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

    this.PushAkun = AkunPage;
    this.PushBantuan = BantuanPage;
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

  getProductCategory(kategori, judul){
    let data = { dt1: kategori, dt2: judul }
    this.navCtrl.push(KategoriPage, data);
  }

  getProductDetail(id){
    let loading = this.loadingCtrl.create({
      spinner: 'crescent',
      showBackdrop: true
    });
    loading.present();
    this.productPostData.id = id;
    this.authService.postData(this.productPostData,'productDetail').then((result) => {
    this.responseData = result;
    this.navCtrl.push(DetailPage, result);  
    loading.dismiss();  
    });
  }

  getProductPenyedia(id, nama){
    let data = { dt1: id, dt2: nama }
    this.navCtrl.push(PenyediaPage, data);
  }

  openToast(msg){
    let toast = this.toastCtrl.create({
      message: msg,
      duration: 2000,
      position: 'top'
    });
    toast.present();
  }

  openKeranjang(){
    this.authService.postData(this.productPostData,'userBasket').then((result)=>{
      this.responseData = result;
      if(this.responseData.userDataBasket){
        this.navCtrl.push(KeranjangPage);
      }else{
        this.openToast("Tidak ada produk dalam keranjang.")
      }
    });
  }

  openOrder(){
    this.authService.postData(this.productPostData,'userOrder').then((result)=>{
      this.responseData = result;
      if(this.responseData.userDataOrder){
        this.navCtrl.push(OrderPage);
      }else{
        this.openToast("Tidak ada orderan.")
      }
    });  
  }
}