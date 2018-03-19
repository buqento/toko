import { Component } from '@angular/core';
import { IonicPage, NavController, LoadingController, NavParams } from 'ionic-angular';
import { AuthService } from '../../providers/auth-service/auth-service';
import { DetailPage } from '../detail/detail';

@IonicPage()
@Component({
  selector: 'page-kategori',
  templateUrl: 'kategori.html',
})
export class KategoriPage {

  productPostData = {"id":"", "kategori":"", "keyword":""};
  responseData : any;
  dataSet : any;
  judul: any;

  constructor(public navCtrl: NavController, 
    public navParams: NavParams, 
    public loadingCtrl: LoadingController, 
    public authService: AuthService) {
      this.initializeItems();
  }

  ionViewDidLoad() {
    let kategori = this.navParams.get('dt1');
    let judul = this.navParams.get('dt2');
    this.judul = judul;
    this.getProduct(kategori);
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

  getProduct(kategori){
    let loading = this.loadingCtrl.create({
      spinner: 'crescent',
      showBackdrop: true
    });
    loading.present();
    setTimeout(() => { loading.dismiss(); }, 5000);
    this.productPostData.kategori = kategori;
    this.authService.postData(this.productPostData,'productDetailKategori').then((result) => {
      this.responseData = result;
      this.dataSet = this.responseData.detailKategori;
      loading.dismiss();
    });
  }

  initializeItems() {
    this.authService.postData(this.productPostData,'productDetailKategori').then(data =>{
      this.responseData = data;
      this.dataSet = this.responseData.detailKategori;
    })
  }

  getItems(ev: any) {
    let val = ev.target.value;
    if (val && val.trim() != '') {
      this.productPostData.keyword = val;
      this.authService.postData(this.productPostData,'productCariKategori').then(data => {
        this.responseData = data;
        this.dataSet = this.responseData.cariKategori;
      });
    }else{
      this.initializeItems();
    }
  }
}