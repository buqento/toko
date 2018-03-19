import { Component } from '@angular/core';
import { IonicPage, NavParams, ViewController, NavController } from 'ionic-angular';
import { UlasanPage } from '../ulasan/ulasan';

@IonicPage()
@Component({
  selector: 'page-info',
  templateUrl: 'info.html',
})
export class InfoPage {
  nama: any;
  conv_harga_satuan: any;
  foto: any;
  nama_penyedia: any;
  alamat: any;
  kode_item: any;
  id_penyedia: any;
  constructor(public viewCtrl: ViewController, 
    public navCtrl: NavController,
    public navParams: NavParams) {
  }

  ionViewDidLoad() {
    this.nama = this.navParams.get("pNama");
    this.conv_harga_satuan = this.convertCurr(this.navParams.get("pHargaSatuan"));
    this.foto = this.navParams.get("pFoto");
    this.nama_penyedia = this.navParams.get("pNamaPenyedia");
    this.alamat = this.navParams.get("pAlamat");
    this.kode_item = this.navParams.get("pKodeItem");
    this.id_penyedia = this.navParams.get("pIdPenyedia");
  }

  openUlasan(kode_item, nama_produk, id_penyedia){
    let data = { kodeItem: kode_item, namaProduk: nama_produk, idPenyedia: id_penyedia}
    this.navCtrl.push(UlasanPage, data);
  }

  closeModal(){
    this.viewCtrl.dismiss();
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
