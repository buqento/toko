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

  productPostData = {"id":"", "kategori":""};
  public responseData : any;
  public dataSet : any;
  public judul: any;

  constructor(public navCtrl: NavController, 
    public navParams: NavParams, 
    public loadingCtrl: LoadingController, 
    public authService: AuthService) {
  }

  ionViewDidLoad() {
    let kategori = this.navParams.get('dt1');
    let judul = this.navParams.get('dt2');
    this.judul = judul;
    this.getProduct(kategori);
  }

  getProduct(kategori){
    let loading = this.loadingCtrl.create({
      spinner: 'crescent',
      showBackdrop: true
    });
    loading.present();
    this.productPostData.kategori = kategori;
    this.authService.postData(this.productPostData,'productDetailKategori').then((result) => {
      this.responseData = result;
      this.dataSet = this.responseData.detailKategori;
      loading.dismiss();
    });
  }

  getProductDetail(id){
    this.productPostData.id = id;
    this.authService.postData(this.productPostData,'productDetail').then((result) => {
      this.responseData = result;
      this.navCtrl.push(DetailPage, result);
    });
  }

}