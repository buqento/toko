import { Component } from '@angular/core';
import { IonicPage, NavController, Events, ToastController } from 'ionic-angular';
import { AuthService } from '../../providers/auth-service/auth-service';
import { HomePage } from '../home/home';

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
  userPostData = {"id_user":""};

  constructor(public events: Events, public navCtrl: NavController, 
    public toastController:ToastController, public authService: AuthService) {
    this.pushPage = HomePage;
    const data = JSON.parse(localStorage.getItem('userData'));
    this.userDetails = data.userData;
  }

  ionViewDidLoad() {
    this.getOrder();
  }

  createUser(firstName, angka){
    this.events.publish('user:created', firstName, angka);
  }

  getOrder(){
    this.userPostData.id_user = this.userDetails.id;
    this.authService.postData(this.userPostData,'userOrder').then((result) => {
    this.responseData = result;
    this.dataSet = this.responseData.userDataOrder;
    this.totalPembayaran = this.convertCurr(this.dataSet[0].items_total);
    }, (err) => { 
      // Error log
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