import { Component, ViewChild, ElementRef } from '@angular/core';
import { IonicPage, NavController, App, NavParams, AlertController, LoadingController, ToastController } from 'ionic-angular';
import { AuthService } from '../../providers/auth-service/auth-service';
import { Geolocation } from '@ionic-native/geolocation';
import { KeranjangPage } from '../keranjang/keranjang';
import { HomePage } from '../home/home';
import { MapPage } from '../map/map';

declare var google:any;

@IonicPage()
@Component({
  selector: 'page-detail',
  templateUrl: 'detail.html',
})
export class DetailPage {
  userDetails: any;
  userLocation: any;
  kodeBelanja: any;
  nama: any;
  harga_satuan: any;
  vHargaSatuan: any;
  foto: any;
  kode_item: any;
  selectOptions: any;
  responseData : any;
  dataSet : any;
  tHarga: any;
  tBayar: any;
  lokasiPenjual: any;
  lat: any;
  lng: any;
  vPenjual: any;
  dlat: any;
  dlng: any;
  vAlamatPenjual: any;
  updateSaldo: any;
  userSaldos: any;
  vAlamat: any;
  vJarak: any;
  lokasiLatLng: any;
  vOngkir: any;
  vTHarga: any;
  ongKir:any;
  uLat: any;
  uLng: any;
  address: any;
  hargaItem: any;
  id: any;
  like: any;
  userPostData = {
    //suka produk
    "id":"",
    //tambah ke keranjang
    "id_user":"", 
    "kode_item":"",
    "qty":"", 
    "harga_item":"", 
    "keterangan":"",
    "tBayar":"",
    "lat":"",
    "lng":"",
    "kode_belanja":"",
    "id_penyedia":"",
  };

  @ViewChild('map') mapRef:ElementRef;

  constructor(
    public navCtrl: NavController, public app: App, public navParams:NavParams, public alertCtrl: AlertController,
    public authService:AuthService, public toastCtrl: ToastController, public geolocation: Geolocation,
    public loadingController:LoadingController) {

      const data = JSON.parse(localStorage.getItem('userData'));
      this.userDetails = data.userData;
      const dataKodeBelanja = JSON.parse(localStorage.getItem('kodeBelanja'));
      this.kodeBelanja = dataKodeBelanja.kodeBelanja;
      let pData = navParams.get('productDetail');
      this.nama = pData[0].nama;
      this.foto = pData[0].foto;
      this.dlat = pData[0].lat;
      this.dlng = pData[0].lng;
      this.like = pData[0].suka;
      this.harga_satuan = pData[0].harga_satuan;
      this.vHargaSatuan = this.convertCurr(pData[0].harga_satuan);
      this.vPenjual = pData[0].nama_penyedia;
      this.vAlamatPenjual = pData[0].alamat;
      this.userPostData.id_user = this.userDetails.id;
      this.userPostData.kode_item = pData[0].kode_item;
      this.userPostData.id = pData[0].id;
      this.userPostData.id_penyedia = pData[0].id_penyedia;
      this.userPostData.lat = this.userDetails.lat;
      this.userPostData.lng = this.userDetails.lng;
      this.userPostData.kode_belanja = this.kodeBelanja.kode;
  }

  ionViewDidLoad(){
    const dataLocation = JSON.parse(localStorage.getItem('userLocation'));
    this.userLocation = dataLocation.userLocation;
    this.uLat = this.userLocation.lat;
    this.uLng = this.userLocation.lng;
    this.vAlamat = this.userLocation.address;
    const dataSaldo = JSON.parse(localStorage.getItem('userSaldo'));
    this.userSaldos = dataSaldo.userSaldo;
    this.updateSaldo = this.convertCurr(this.userSaldos.saldo);
    this.distance(parseFloat(this.uLat), parseFloat(this.uLng), this.dlat, this.dlng, "K").then(data => {
      this.vJarak = data;
      this.ongKir = 1500 * parseInt(this.vJarak);
      this.vOngkir = this.convertCurr(parseInt(this.ongKir));
      this.tHarga = parseInt(this.ongKir);
      this.vTHarga = this.convertCurr(this.tHarga);
    });
  }

  sukaProduct(){  
    this.like = parseInt(this.like) + 1;
    this.authService.postData(this.userPostData,'sukaProduct');
    this.presentToast("Anda menyukai produk ini.");
  }

  hitung(){
    let jumlah: any = this.userPostData.qty;
    let hrgSatuan = this.harga_satuan;
    let tbayar: any = jumlah * hrgSatuan;
    this.tHarga = parseInt(tbayar + this.ongKir);
    this.hargaItem = this.convertCurr(tbayar);
    this.userPostData.tBayar = this.tHarga;
    this.vTHarga = this.convertCurr(this.tHarga);
  }

  presentToast(msg) {
    let toast = this.toastCtrl.create({
      message: msg,
      duration: 1000,
      position: "top"
    });
    toast.present();
  }
 
  setMap(){
    this.navCtrl.push(MapPage);
  }

  showConfirm() {
    let confirm = this.alertCtrl.create({
      title: 'Yeah!',
      message: 'Produk telah dimasukkan ke dalam keranjang.',
      buttons: [
        {
          text: 'Ok',
          handler: () => {
            this.navCtrl.push(HomePage);
          }
        },
        {
          text: 'Lihat Keranjang',
          handler: () => {
            this.navCtrl.push(KeranjangPage);
          }
        }
      ]
    });
    confirm.present();
  }

  addToBasket(){
    if(this.tHarga && this.userPostData.qty){

      const dataLocation = JSON.parse(localStorage.getItem('userLocation'));
      this.userLocation = dataLocation.userLocation;
      this.lat = this.userLocation.lat;
      if(this.lat != 0){
        let loading = this.loadingController.create({
          spinner: 'crescent',
          showBackdrop: true
        })
        loading.present();
        setTimeout(() => { loading.dismiss(); }, 5000);
        this.authService.postData(this.userPostData,'addToBasket').then((result) => {
          this.responseData = result;
          this.dataSet = this.responseData.productData;
          loading.dismiss();
          this.showConfirm();
        });

      }else{
        this.navCtrl.push(MapPage);
      }


    }else{
      this.presentToast("Masukkan jumlah produk.");
    }
  }

  distance(lat1, lon1, lat2, lon2, unit) {
    return new Promise(resolve => {
      var radlat1 = Math.PI * lat1/180
      var radlat2 = Math.PI * lat2/180
      var theta = lon1-lon2
      var radtheta = Math.PI * theta/180
      var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
      dist = Math.acos(dist)
      dist = dist * 180/Math.PI
      dist = dist * 60 * 1.1515
      if (unit=="K") { dist = dist * 1.609344 }
      if (unit=="N") { dist = dist * 0.8684 }
      resolve(dist);
    });
  }

  convertCurr(angka){
    var rev     = parseInt(angka, 10).toString().split('').reverse().join('');
    var rev2    = '';
    for(var i = 0; i < rev.length; i++){
        rev2  += rev[i];
        if((i + 1) % 3 === 0 && i !== (rev.length - 1)){
            rev2 += '.';
        }
    }
    return rev2.split('').reverse().join('');
  }

}