import { Component } from '@angular/core';
import { IonicPage, NavController, LoadingController, AlertController } from 'ionic-angular';
import { AuthService } from '../../providers/auth-service/auth-service';
import { HomePage } from '../home/home';
import { OrderPage } from '../order/order';
import { DepositPage } from '../deposit/deposit';

@IonicPage()
@Component({
  selector: 'page-keranjang',
  templateUrl: 'keranjang.html',
})
export class KeranjangPage {
  pushPage: any;
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
  productPostData = {
    "id_belanja":"", 
    "id_user":"", 
    "kodeBelanja":"",
    "saldo":"",
    "id":""
  };

  constructor(public navCtrl: NavController, 
    public loadingCtrl:LoadingController,
    public alertCtrl: AlertController, 
    public authService: AuthService) {
    this.pushPage = HomePage;
    const data = JSON.parse(localStorage.getItem('userData'));
    this.userDetails = data.userData;
    const dataKodeBelanja = JSON.parse(localStorage.getItem('kodeBelanja'));
    this.kodeBelanja = dataKodeBelanja.kodeBelanja;
    this.productPostData.id_user = this.userDetails.id;
    this.getProduct();
  }

  ionViewDidLoad(){ 
    const dataSaldo = JSON.parse(localStorage.getItem('userSaldo'));
    this.userSaldo = dataSaldo.userSaldo;
    this.updateSaldo = this.userSaldo.saldo;
    this.vSaldo = this.convertCurr(this.updateSaldo);
  }

  confirmDelete(id, msgIndex) {
    let confirm = this.alertCtrl.create({
      title: 'Hapus produk?',
      message: 'Anda setuju untuk menghapus produk ini dari keranjang?',
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

  showAlert() {
    let alert = this.alertCtrl.create({
      title: 'Informasi',
      subTitle: 'Terima kasih, pesanan yang ada pada orderan anda akan segera kami antar.',
      buttons: ['OK']
    });
    alert.present();
  }

  getRandom(length){
    return Math.floor(Math.pow(10, length-1) + Math.random() * 9 * Math.pow(10, length-1));
  }

  payOrder(){ 
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
        // update status belanja
        this.productPostData.kodeBelanja = this.kodeBelanja.kode;
        this.authService.postData(this.productPostData,'ubahStatusBelanja');
        this.showAlert();
        //update user saldo
        this.saldoSekarang = this.updateSaldo - parseInt(this.totalPembayaran);
        localStorage.setItem('userSaldo','{"userSaldo":{"saldo":"'+this.saldoSekarang+'"}}');
        this.productPostData.saldo = this.saldoSekarang;
        this.authService.postData(this.productPostData,'updateSaldo');
        //generate kode belanja
        localStorage.setItem('kodeBelanja','{"kodeBelanja":{"kode":"'+this.getRandom(12)+'"}}');
        this.navCtrl.push(OrderPage);
      }
    })
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
      }
    })
  }}

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