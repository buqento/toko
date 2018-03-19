import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AuthService } from '../../providers/auth-service/auth-service';
import { KategoriPage } from '../kategori/kategori';

@IonicPage()
@Component({
  selector: 'page-history',
  templateUrl: 'history.html',
})
export class HistoryPage {
  pushPage: any;
  userDetails : any;
  responseData : any;
  dataSet : any;
  kodeBelanja: any;
  userPostData = {"id_user":""};
  productPostData = {};
  kategoriArray: any = [];
  jmlOrder: any;
  empty:boolean = true;
  konten:boolean = true;

  constructor(public navCtrl: NavController, 
    public authService: AuthService,
    public navParams: NavParams) {
      const data = JSON.parse(localStorage.getItem('userData'));
      this.userDetails = data.userData;

      const dataOrder = JSON.parse(localStorage.getItem('userHistoryOrder'));
      this.jmlOrder = dataOrder.userHistoryOrder;
      let total = parseInt(this.jmlOrder.total);  
      if(total > 0){
        this.empty = !this.empty;
        this.getOrderHistory();
      }else{
        this.konten = !this.konten;
      }
  }

  getOrderHistory(){
    this.userPostData.id_user = this.userDetails.id;
    this.authService.postData(this.userPostData,'userOrderHistory').then((result) => {
    this.responseData = result;
    this.dataSet = this.responseData.orderHistory;
    }, (err) => { 
      // Error log
    });
  }

  openCategory(kategori, title){
    let data1 = { dt1: kategori, dt2: title }
    this.navCtrl.push(KategoriPage, data1);
  }

}
