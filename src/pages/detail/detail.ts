import { Component, ViewChild, ElementRef } from '@angular/core';
import { IonicPage, NavController, App, NavParams, AlertController, LoadingController, ToastController } from 'ionic-angular';
import { AuthService } from '../../providers/auth-service/auth-service';
import { Geolocation } from '@ionic-native/geolocation';
import { KeranjangPage } from '../keranjang/keranjang';
import { HomePage } from '../home/home';
import { MapPage } from '../map/map';
import { UlasanPage } from '../ulasan/ulasan';

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
  vBiayaPengiriman: any;
  biayaPengiriman: any;
  estimasiHarga: any;
  ongKir:any;
  uLat: any;
  uLng: any;
  address: any;
  hargaItem: any;
  id: any;
  like: any;
  vJml: any;
  userDataBasket: any;
  lokasiUser: any;
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
    "address":""
  };

  forms = [
    {"val":"1","name":"1 item"},
    {"val":"2","name":"2 item"},
    {"val":"3","name":"3 item"},
    {"val":"4","name":"4 item"},
    {"val":"5","name":"5 item"},
    {"val":"6","name":"6 item"},
    {"val":"7","name":"7 item"},
    {"val":"8","name":"8 item"},
    {"val":"9","name":"9 item"},
    {"val":"10","name":"10 item"},
    
  ]

  @ViewChild('map') mapRef:ElementRef;

  constructor(
    public navCtrl: NavController, 
    public app: App, 
    public navParams:NavParams, 
    public alertCtrl: AlertController,
    public authService:AuthService, 
    public toastCtrl: ToastController, 
    public geolocation: Geolocation,
    public loadingController:LoadingController) {

      this.selectOptions = {
        // title: 'Produk',
        subTitle: 'Tentukan jumlah produk'
      };
      
      const data = JSON.parse(localStorage.getItem('userData'));
      this.userDetails = data.userData;
      const dataKodeBelanja = JSON.parse(localStorage.getItem('kodeBelanja'));
      this.kodeBelanja = dataKodeBelanja.kodeBelanja;
      const dataLokasi = JSON.parse(localStorage.getItem('userLocation'));
      this.lokasiUser = dataLokasi.userLocation;

      this.nama = this.navParams.get('pNama');
      this.foto = this.navParams.get('pFoto');
      this.dlat = this.navParams.get('pLat');
      this.dlng = this.navParams.get('pLng');
      this.like = this.navParams.get('pSuka');
      this.harga_satuan = this.navParams.get('pHargaSatuan');
      this.vPenjual = this.navParams.get('pNamaPenyedia');
      this.vAlamatPenjual = this.navParams.get('pAlamat');
      this.userPostData.id_user = this.navParams.get('pNama');
      this.userPostData.kode_item = this.navParams.get('pKodeItem');
      this.userPostData.id = this.navParams.get('pId');
      this.userPostData.id_penyedia = this.navParams.get('pIdPenyedia');
      this.userPostData.kode_item = this.navParams.get('pKodeItem');
      this.vJml = this.navParams.get('pJml');

      this.vHargaSatuan = this.convertCurr(this.harga_satuan);
      this.userPostData.id_user = this.userDetails.id;
      this.userPostData.lat = this.lokasiUser.lat;
      this.userPostData.lng = this.lokasiUser.lng;
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
      let biayaKirim: any;
      let jarak: any = data;
      if(jarak >= 2){
        biayaKirim = 2500 * parseInt(jarak);
      }else{
        biayaKirim = 5000;
      }
      this.biayaPengiriman = biayaKirim;
      this.vBiayaPengiriman = this.convertCurr(biayaKirim);
      this.estimasiHarga = this.convertCurr(biayaKirim);
    });
  }

  hitung(){
    let jumlah: any = this.userPostData.qty;
    let hrgSatuan = this.harga_satuan;
    let tbayar: any = jumlah * hrgSatuan;
    this.tHarga = tbayar + this.biayaPengiriman;
    this.hargaItem = this.convertCurr(tbayar);
    this.userPostData.tBayar = this.tHarga;
    this.estimasiHarga = this.convertCurr(this.tHarga);
  }

  getUlasan(kode_item, nama_produk, id_penyedia){
    let data = { kodeItem: kode_item, namaProduk: nama_produk, idPenyedia: id_penyedia}
    this.navCtrl.push(UlasanPage, data);
  }

  sukaProduct(){  
    this.like = parseInt(this.like) + 1;
    this.authService.postData(this.userPostData,'sukaProduct');
    this.presentToast("Anda menyukai produk ini.");
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
      let loading = this.loadingController.create({
        spinner: 'crescent',
        showBackdrop: true
      })
      loading.present();
      setTimeout(() => { loading.dismiss(); }, 5000);
      const dataLocation = JSON.parse(localStorage.getItem('userLocation'));
      this.userLocation = dataLocation.userLocation;
      this.lat = this.userLocation.lat;
      if(this.lat != 0){
        this.userPostData.address = this.userLocation.address;
        this.authService.postData(this.userPostData,'addToBasket').then((result) => {
          this.responseData = result;
          this.dataSet = this.responseData.productData;
          //Update jumlah data keranjang
          const dataBasket = JSON.parse(localStorage.getItem('userBasket'));
          this.userDataBasket = dataBasket.userBasket;
          let jmlBasket = parseInt(this.userDataBasket.jml) + 1;
          localStorage.setItem('userBasket','{"userBasket":{"jml":"'+jmlBasket+'"}}');

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
            rev2 += ',';
        }
    }
    return rev2.split('').reverse().join('');
  }

}