import { Component } from '@angular/core';
import { IonicPage, NavController, Events, ToastController, LoadingController, ModalController } from 'ionic-angular';
import { AuthService } from '../../providers/auth-service/auth-service';
import { HomePage } from '../home/home';
import { InfoPage } from '../info/info';
import { UlasanPage } from '../ulasan/ulasan';

@IonicPage()
@Component({
  selector: 'page-order',
  templateUrl: 'order.html',
})
export class OrderPage {
  pushPage: any;
  userDetails : any;
  responseData : any;
  dataSet : any;
  kodeBelanja: any;
  totalPembayaran: any;
  jmlOrder: any;
  userPostData = {"id_user":""};
  empty:boolean = true;
  konten:boolean = true;
  pushUlasan: any;

  constructor(public events: Events, 
    public navCtrl: NavController, 
    public toastController:ToastController, 
    public loadingCtrl: LoadingController,
    public modalCtrl: ModalController,
    public authService: AuthService) {
    this.pushPage = HomePage;
    this.pushUlasan = UlasanPage;
    
    const data = JSON.parse(localStorage.getItem('userData'));
    this.userDetails = data.userData;

    const dataOrder = JSON.parse(localStorage.getItem('userOrder'));
    this.jmlOrder = dataOrder.userOrder;
    let total = parseInt(this.jmlOrder.total);  
    if(total > 1){
      this.empty = !this.empty;
      this.getOrder();
    }else{
      this.konten = !this.konten;
    }
  }

  openInfo(nama, conv_harga_satuan, foto, nama_penyedia, alamat, kode_item, id_penyedia) {
    let infoModal = this.modalCtrl.create(InfoPage, 
      { pNama: nama, 
        pHargaSatuan: conv_harga_satuan, 
        pFoto: foto,
        pNamaPenyedia: nama_penyedia,
        pAlamat: alamat,
        pKodeItem: kode_item,
        pIdPenyedia: id_penyedia
      })
    infoModal.present();
  }

  getOrder(){
    let loading = this.loadingCtrl.create({
      spinner: 'crescent',
      showBackdrop: true,
    })
    loading.present();
    setTimeout(() => { loading.dismiss(); }, 5000);
    this.userPostData.id_user = this.userDetails.id;
    this.authService.postData(this.userPostData,'userOrder').then((result) => {
    this.responseData = result;
    this.dataSet = this.responseData.userDataOrder;
    this.totalPembayaran = this.convertCurr(this.dataSet[0].items_total);
    }, (err) => { 
      // Error log
    });
    loading.dismiss();
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