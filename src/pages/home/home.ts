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
import { SettingPage } from '../setting/setting';

@IonicPage()
@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
})
export class HomePage {
  PushBantuan: any;
  PushSetting: any;
  produk: string = "populer";
  isAndroid: boolean = false;
  userDetails: any;
  kodeBelanja: any;
  responseData: any;
  dataSet: any;
  dataSetPenyedia: any;
  productPostData = {"kategori":"", "id":"", "kodeBelanja":"", "id_user":"", "penyedia_id":""}
  productPenyedia = {}

  constructor(platform: Platform, 
    public toastCtrl: ToastController,
    public loadingCtrl: LoadingController, 
    public navCtrl: NavController, 
    public authService: AuthService){

    this.PushSetting = SettingPage;
    this.PushBantuan = BantuanPage;
    this.isAndroid = platform.is('android');    
    const data = JSON.parse(localStorage.getItem('userData'));
    this.userDetails = data.userData;
    const dataKodeBelanja = JSON.parse(localStorage.getItem('kodeBelanja'));
    this.kodeBelanja = dataKodeBelanja.kodeBelanja;
    this.productPostData.kodeBelanja = this.kodeBelanja.kode;
    this.productPostData.id_user = this.userDetails.id;

  }

  ionViewDidLoad(){
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
    setTimeout(() => { loading.dismiss(); }, 5000);
    this.authService.postData(this.productPostData,'getNewProduct').then((result) => {
      this.responseData = result;
      this.dataSet = this.responseData.newproductData;
      loading.dismiss();
    });
  }

  getPenyedia(){
    this.authService.postData(this.productPenyedia,'penyedia').then((hasil) => {
      this.responseData = hasil;
      this.dataSetPenyedia = this.responseData.penyediaData;
    });
  }

  getProductCategory(kategori, judul){
    let data1 = { dt1: kategori, dt2: judul }
    this.navCtrl.push(KategoriPage, data1);
  }

  openDetail(nama, foto, lat, lng, suka, harga_satuan, nama_penyedia, alamat, kode_item, id, id_penyedia, jml){
    let data2 = { 
      pNama:nama,
      pFoto:foto, 
      pLat:lat, 
      pLng:lng, 
      pSuka:suka, 
      pHargaSatuan:harga_satuan, 
      pNamaPenyedia:nama_penyedia, 
      pAlamat:alamat, 
      pKodeItem:kode_item, 
      pId:id, 
      pIdPenyedia:id_penyedia,
      pJml:jml
    }
    this.navCtrl.push(DetailPage, data2);
  }

  getProductPenyedia(id, nama){
    let data3 = { dt1: id, dt2: nama }
    this.navCtrl.push(PenyediaPage, data3);
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