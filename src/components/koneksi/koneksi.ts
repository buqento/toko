import { Component } from '@angular/core';
import { Network } from '@ionic-native/network';
import { ToastController } from 'ionic-angular';

@Component({
  selector: 'koneksi',
  templateUrl: 'koneksi.html'
})
export class KoneksiComponent { 
  constructor(public network: Network, public toastCtrl: ToastController) {
    let disconnectSubscription = this.network.onDisconnect().subscribe(()=>{
      this.toastCtrl.create({
        message: 'Koneksi internet tidak tersedia!',
        closeButtonText: 'Oke',
        showCloseButton: true
      }).present();
    })
  }

}