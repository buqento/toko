import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { MomentModule } from 'angular2-moment'
import { StatusBar } from '@ionic-native/status-bar';
import { MyApp } from './app.component';
import { HttpModule } from '@angular/http';
import { AuthService } from '../providers/auth-service/auth-service';
import { Geolocation } from '@ionic-native/geolocation';
import { GoogleMaps } from '@ionic-native/google-maps';1
import { LoginPage } from '../pages/login/login';
import { HomePage } from '../pages/home/home';
import { DetailPage } from '../pages/detail/detail';
import { PenyediaPage } from '../pages/penyedia/penyedia';
import { KategoriPage } from '../pages/kategori/kategori';
import { KeranjangPage } from '../pages/keranjang/keranjang';
import { OrderPage } from '../pages/order/order';
import { DepositPage } from '../pages/deposit/deposit';
import { BantuanPage } from '../pages/bantuan/bantuan';
import { AkunPage } from '../pages/akun/akun';
import { MapPage } from '../pages/map/map';
import { SignupPage } from '../pages/signup/signup';

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    LoginPage,
    DetailPage,
    PenyediaPage,
    KategoriPage,
    KeranjangPage,
    OrderPage,
    DepositPage,
    BantuanPage,
    AkunPage,
    MapPage,
    SignupPage
  ],
  imports: [
    BrowserModule, HttpModule, MomentModule,
    IonicModule.forRoot(MyApp), BrowserAnimationsModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    LoginPage,
    DetailPage,
    PenyediaPage,
    KategoriPage,
    KeranjangPage,
    OrderPage,
    DepositPage,
    BantuanPage,
    AkunPage,
    MapPage,
    SignupPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    AuthService,
    GoogleMaps,
    Geolocation
  ]
})
export class AppModule {}