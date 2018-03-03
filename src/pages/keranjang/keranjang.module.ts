import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { KeranjangPage } from './keranjang';

@NgModule({
  declarations: [
    KeranjangPage,
  ],
  imports: [
    IonicPageModule.forChild(KeranjangPage),
  ],
})
export class KeranjangPageModule {}
