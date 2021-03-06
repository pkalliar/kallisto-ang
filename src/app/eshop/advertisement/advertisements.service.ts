import { Injectable } from '@angular/core';

import { Headers, Http } from '@angular/http';
import { HttpClient } from '@angular/common/http';

import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';

import { environment } from '../../../environments/environment';

import { Advertisement, AdvCat } from './advertisement';
import { AuthService } from '../../services/auth.service';
import { AngularFireStorage } from '@angular/fire/storage';
import { Reference } from '@angular/fire/storage/interfaces';
// import { Reference } from 'angularfire2/storage/interfaces';

@Injectable()
export class AdsService {

    private baseUrl = environment.apiurl  + '/api/skroutz';  // URL to web api
    url: string;
    authService: AuthService;
    storageRef: Reference;

    constructor(private http: Http, private httpClient: HttpClient,
      private afs: AngularFirestore, authService: AuthService,
      private afStorage: AngularFireStorage) {
        this.authService = authService;
        this.storageRef = this.afStorage.storage.ref();
    }

    search_word(keyword) {
      console.log('in search word..');
      return this.http.get(this.baseUrl + '/search/' + keyword)
            .toPromise()
            .then(response => response.json())
            .catch(this.handleError);
        // return this.http.get(this.baseUrl + '/search/' + term).map(res => {
        //     return res.json().map(item => {
        //         return item;
        //     });
        // });
    }

    uploadImage(user_uid: String, adv_id: String, f: File, main: boolean) {

      const fpath = 'user/' + user_uid + '/advertisements/' + adv_id + '/' + f.name;
      const metadata = {
        'contentType': f.type,
        'adv': adv_id
      };

      return this.storageRef.child(fpath).put(f, metadata)
      .then(function(snapshot) {
        return snapshot.ref.getDownloadURL().then(url => url); })
      .catch(this.handleError);

    }

    upload(user_uid: String, adv_id: String, f: File, main: boolean) {
      let uid = '';
      this.authService.user.subscribe(
        (user) => {
          if (user) {
            uid = user.uid;
          }
        });

        const fpath = 'user/' + user_uid + '/advertisements/' + adv_id + '/' + f.name;

        const metadata = {
          'contentType': f.type,
          'adv': adv_id
        };

        this.storageRef.child(fpath).put(f, metadata).then(function(snapshot) {
          console.log('Uploaded', snapshot.totalBytes, 'bytes.');
          console.log('File metadata:', snapshot.metadata);
          // Let's get a download URL for the file.
          snapshot.ref.getDownloadURL().then(function(url) {
            console.log('File available at', url);

          });
        }).catch(function(error) {
          // [START onfailure]
          console.error('Upload failed:', error);
          // [END onfailure]
        });

      // console.log( 'user.uid ' + this.uid  + ' read file ' + f.name);
      // if (window.FileReader) {
        // FileReader are supported.
        // this.getAsText(f);
    // } else {
        // alert('FileReader are not supported in this browser.');
    // }

      console.log( user_uid + ' adv_id ' + adv_id);

      // this.afStorage.upload(fpath, f);
    }

    searchCar() {
      console.log('in searchCar()');
      // const url = 'https://pankal-e7786.appspot.com/search/car/volvo';
      const url = 'http://localhost:8080/search/car/volvo/v40';
      this.httpClient.get(url).subscribe(res => console.log(res));
    }

    search_firestore(keyword) {
      console.log('in search_firestore..');

      // const query = this.afs.firestore
      // .collection('advertisements')
      // .orderBy('email', 'desc')
      // .limit(50);

      // query.onSnapshot(function (snapshot) {
      //   if (!snapshot.size) {
      //     return render();
      //   }
      //   snapshot.docChanges().forEach(function(change) {
      //     if (change.type === 'added') {
      //       render(change.doc);
      //     }
      //   });
      // });


      return this.afs.firestore.collection('advertisements').get().then(querySnapshot => querySnapshot.docs
        // ({
          // querySnapshot.forEach((doc) => {
          //     console.log(`${doc.id} => ${doc.data()}`);
          // });
      );

      // return this.http.get(this.baseUrl + '/search/' + keyword)
      //       .toPromise()
      //       .then(response => response.json())
      //       .catch(this.handleError);
    }

    get_categories() {
      return this.afs.firestore.collection('ads_categories').get().then(querySnapshot => querySnapshot.docs
      );
    }

    get(id) {
      return this.afs.firestore.collection('advertisements').doc(id).get();
    }

    getAdvFromToken(token): Advertisement {

      const ad = new Advertisement();

      ad.id = token.id;
      ad.body = token.get('body');
      ad.category = token.get('category');
      ad.phone = token.get('phone');
      ad.user_uid = token.get('user_uid');
      ad.created_on = new Date((token.get('created_on').seconds * 1000));
      ad.images = token.get('images');
      ad.geometry = token.get('geometry');


      // if (token.get('category') !== undefined) {
      //   appt.category = new ApptCat(token.get('category').id, token.get('category').name);
      // } else {
      //   appt.category = new ApptCat('', '');
      // }
      // console.log(JSON.stringify(appt));
      return ad;
    }


   private handleError(error: any): Promise<any> {
     console.error('An error occurred', error); // for demo purposes only
     return Promise.reject(error.message || error);
   }
}
