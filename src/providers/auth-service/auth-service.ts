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
      // }, (err) => {
        // reject(err);
      });
    });
  }

}