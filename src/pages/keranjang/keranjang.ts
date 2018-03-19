import { Component } from '@angular/core';
import { IonicPage, NavController, LoadingController, AlertController, ModalController } from 'ionic-angular';
import { AuthService } from '../../providers/auth-service/auth-service';
import { HomePage } from '../home/home';
import { DepositPage } from '../deposit/deposit';
import { SuksesPage } from '../sukses/sukses';
import { InfoPage } from '../info/info';
import { HistoryPage } from '../history/history';

@IonicPage()

@Component({
  selector: 'page-keranjang',
  templateUrl: 'keranjang.html',
})
export class KeranjangPage {
  pushHome: any;
  pushHistory: any;
  responseData: any;
  userDetails : any;
  dataSet : any;
  userSaldo: any;
  updateSaldo: any;
  userSaldoNow: any;
  saldoSekarang: any;
  vSaldo: any;
  totalPembayaran: any;
  itemtotal: any;
  tot: any;
  kodeBelanja: any;
  userDataBasket: any;
  metodeBayar: boolean;
  jmlBasket: any;
  productPostData = {
    "id_belanja":"", 
    "id_user":"", 
    "kodeBelanja":"",
    "saldo":"",
    "id":"",
    "metode_pembayaran":""
  };
  metode:boolean = true;
  empty:boolean = true;
  konten:boolean = true;
  footer: boolean = true;

  constructor(public navCtrl: NavController, 
    public loadingCtrl:LoadingController,
    public alertCtrl: AlertController, 
    public modalCtrl: ModalController,
    public authService: AuthService) {
    this.pushHome = HomePage;
    this.pushHistory = HistoryPage;
    const data = JSON.parse(localStorage.getItem('userData'));
    this.userDetails = data.userData;
    const dataKodeBelanja = JSON.parse(localStorage.getItem('kodeBelanja'));
    this.kodeBelanja = dataKodeBelanja.kodeBelanja;
    this.productPostData.id_user = this.userDetails.id;
    const dataKeranjang = JSON.parse(localStorage.getItem('userBasket'));
    this.jmlBasket = dataKeranjang.userBasket;
    let jml = parseInt(this.jmlBasket.jml);  
    if(jml < 1){
      this.konten = !this.konten;
      this.footer = !this.footer;
    }else{
      this.empty = !this.empty;
      this.getProduct();
    }
  }

  ionViewDidLoad(){ 
    const dataSaldo = JSON.parse(localStorage.getItem('userSaldo'));
    this.userSaldo = dataSaldo.userSaldo;
    this.updateSaldo = this.userSaldo.saldo;
    this.vSaldo = this.convertCurr(this.updateSaldo);
    if(this.userDetails.metode_pembayaran != 2){
      this.metode = !this.metode;
    }
  }

  openInfo(nama, harga_satuan, foto, nama_penyedia, alamat, kode_item, id_penyedia) {
    let infoModal = this.modalCtrl.create(InfoPage, 
      { pNama: nama, 
        pHargaSatuan: harga_satuan, 
        pFoto: foto,
        pNamaPenyedia: nama_penyedia,
        pAlamat: alamat,
        pKodeItem: kode_item,
        pIdPenyedia: id_penyedia
      })
    infoModal.present();
  }

  confirmDelete(id, msgIndex) {
    let confirm = this.alertCtrl.create({
      title: 'Batal order?',
      message: 'Anda setuju untuk membatalkan orderan produk ini?',
      buttons: [
        {
          text: 'Tidak',
          handler: () => {
            console.log('Disagree clicked');
          }
        },
        {
          text: 'Ya',
          handler: () => {
            this.deleteProduct(id, msgIndex);
          }
        }
      ]
    });
    confirm.present();
  }

  confirmPembayaran() {   
    let confirm = this.alertCtrl.create({
      title: 'Lakukan pembayaran?',
      message: 'Anda setuju untuk melakukan pembayaran semua produk yang ada pada keranjang?',
      buttons: [
        {
          text: 'Tidak',
          handler: () => {
            console.log('Disagree clicked');
          }
        },
        {
          text: 'Ya',
          handler: () => {
            this.payOrder();
          }
        }
      ]
    });
    confirm.present();
  }

  getRandom(length){
    return Math.floor(Math.pow(10, length-1) + Math.random() * 9 * Math.pow(10, length-1));
  }

  payOrder(){ 
    if(this.metodeBayar == true){
          //update status belanja
          this.productPostData.kodeBelanja = this.kodeBelanja.kode;
          this.productPostData.metode_pembayaran = "2";
          this.authService.postData(this.productPostData,'ubahStatusBelanja');
          //generate kode belanja
          localStorage.setItem('kodeBelanja','{"kodeBelanja":{"kode":"'+this.getRandom(12)+'"}}');
          //update jumlah data keranjang
          localStorage.setItem('userBasket','{"userBasket":{"jml":"0"}}');
          this.navCtrl.push(SuksesPage);
    }else{
      //get user saldo
      const dataSaldo = JSON.parse(localStorage.getItem('userSaldo'));
      this.userSaldo = dataSaldo.userSaldo;
      this.updateSaldo = this.userSaldo.saldo;
      //get total pembayaran
      this.productPostData.kodeBelanja = this.kodeBelanja.kode;
      this.authService.postData(this.productPostData,'userBasket').then((result) => {
      this.responseData = result;
      this.dataSet = this.responseData.userDataBasket;
      this.totalPembayaran = this.dataSet[0].items_total;

      }).then(()=>{
        if(parseInt(this.updateSaldo) < parseInt(this.totalPembayaran)){
          this.navCtrl.push(DepositPage);
        }else{
          //update status belanja
          this.productPostData.kodeBelanja = this.kodeBelanja.kode;
          this.productPostData.metode_pembayaran = "1";
          this.authService.postData(this.productPostData,'ubahStatusBelanja');
          //update user saldo
          this.saldoSekarang = this.updateSaldo - parseInt(this.totalPembayaran);
          localStorage.setItem('userSaldo','{"userSaldo":{"saldo":"'+this.saldoSekarang+'"}}');
          this.productPostData.saldo = this.saldoSekarang;
          this.authService.postData(this.productPostData,'updateSaldo');
          //generate kode belanja
          localStorage.setItem('kodeBelanja','{"kodeBelanja":{"kode":"'+this.getRandom(12)+'"}}');
          //update jumlah data keranjang
          localStorage.setItem('userBasket','{"userBasket":{"jml":"0"}}');
          this.navCtrl.push(SuksesPage);
        }
      })

    }
    //update total order
    localStorage.setItem('userOrder','{"userOrder":{"total":"2"}}');
    localStorage.setItem('userHistoryOrder','{"userHistoryOrder":{"total":"'+1+'"}}');
  }

  getProduct(){
      let loading = this.loadingCtrl.create({
        spinner: 'crescent',
        showBackdrop: true,
      })
      loading.present();
      setTimeout(() => { loading.dismiss(); }, 5000);
      this.productPostData.kodeBelanja = this.kodeBelanja.kode;
      this.authService.postData(this.productPostData,'userBasket').then((result) => {
      this.responseData = result;
      if(this.responseData.userDataBasket){
        this.dataSet = this.responseData.userDataBasket;
        this.totalPembayaran = this.convertCurr(this.dataSet[0].items_total);
      }else{
        this.navCtrl.push(HomePage);
        this.alertCtrl.create({
          message: 'tidak ada data',
        })
      }
      })
      loading.dismiss();
  }

  deleteProduct(id_belanja, msgIndex){
    if(id_belanja > 0){
      this.productPostData.id_belanja = id_belanja;
      this.authService.postData(this.productPostData,'orderDelete').then((result) => {
      this.responseData = result;
      if(this.responseData.success){
        this.dataSet.splice(msgIndex, 1);
        this.getProduct();
        //update jumlah data keranjang
        const dataBasket = JSON.parse(localStorage.getItem('userBasket'));
        this.userDataBasket = dataBasket.userBasket;
        let jmlBasket = parseInt(this.userDataBasket.jml) - 1;
        localStorage.setItem('userBasket','{"userBasket":{"jml":"'+jmlBasket+'"}}');

      }
    })
  }}

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