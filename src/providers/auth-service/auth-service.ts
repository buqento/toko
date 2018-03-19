import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import 'rxjs/add/operator/map';

// let apiUrl = 'http://localhost/PHP-Slim-Restful-master/api/';
let apiUrl = 'http://jembatanmerahputih.com/PHP-Slim-Restful-master/api/';

@Injectable()
export class AuthService {

  constructor(public http: Http) {}

  postData(credentials, type){
    return new Promise((resolve, reject) => {
      let headers = new Headers();
      this.http.post(apiUrl + type, JSON.stringify(credentials), {headers: headers})
      .subscribe(res => {
        resolve(res.json());
      }, (err) => {
        reject(err);
      });
    });
  }

  getUlasan(type, kode) {
    return new Promise(resolve => {
      this.http.get(apiUrl + type + kode)
        .subscribe(data => {
          resolve(data);
        }, err => {
          console.log(err);
        });
    });
  }

  getUser(id) {
    return new Promise(resolve => {
      this.http.get(apiUrl+'/user/'+id).subscribe(data => {
        resolve(data);
      }, err => {
        console.log(err);
      });
    });
  }

  getUsers() {
    return new Promise(resolve => {
      this.http.get(apiUrl+'users').subscribe(data => {
        resolve(data);
      }, err => {
        console.log(err);
      });
    });
  }

  getCategory(keyword) {
    return new Promise(resolve => {
      this.http.get(apiUrl+'/category/'+keyword).subscribe(data => {
        resolve(data);
      }, err => {
        console.log(err);
      });
    });
  }

}