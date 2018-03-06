import { Component } from '@angular/core';
import { NavController, App } from 'ionic-angular';
import { DepositPage } from '../deposit/deposit';
import { BantuanPage } from '../bantuan/bantuan';
import { HomePage } from '../home/home';
import { LoginPage } from '../login/login';
import { MapPage } from '../map/map';

@Component({
  selector: 'page-akun',
  templateUrl: 'akun.html'
})
export class AkunPage {
  pushDeposit: any;
  pushBantuan: any;
  pushMap: any;
  userDetails: any;
  userLokasi: any;
  userSaldos: any;
  vAlamat: any;
  userLocation: any;
  vUserSaldo: any;

  constructor(public navCtrl: NavController, public app: App) {
      this.pushDeposit = DepositPage;
      this.pushBantuan = BantuanPage;
      this.pushMap = MapPage;
      const data = JSON.parse(localStorage.getItem('userData'));
      this.userDetails = data.userData;
      const dataSaldo = JSON.parse(localStorage.getItem('userSaldo'));
      this.userSaldos = dataSaldo.userSaldo;
      this.vUserSaldo = this.convertCurr(this.userSaldos.saldo);
      const dataLokasi = JSON.parse(localStorage.getItem('userLocation'));
      this.userLokasi = dataLokasi.userLocation;
      this.vAlamat = this.userLokasi.address;
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

  logOut(){
    localStorage.clear();
    this.navCtrl.setRoot(LoginPage);
  }

}