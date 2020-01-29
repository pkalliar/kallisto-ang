import { Component, OnInit, Input } from '@angular/core';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';
import { Advertisement, AdvCat, Geometry } from '../advertisement';
import { AdsService } from '../advertisements.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { throwMatDuplicatedDrawerError } from '@angular/material/sidenav';
import { Cloudinary } from '@cloudinary/angular-5.x';
import { Router } from '@angular/router';

@Component({
  selector: 'app-eshop-createad',
  templateUrl: './create-ad.component.html',
  styleUrls: ['./create-ad.component.css']
})
export class CreateAdComponent implements OnInit {

  @Input() ad: Advertisement;
  f: File;
  user_uid: String;
  adv_id: string;
  images: Array<String> = [];
  geometry: Geometry;
  categories: Array<AdvCat> = [];
  isLinear = true;
  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;
  thirdFormGroup: FormGroup;

  constructor(private afs: AngularFirestore, private _formBuilder: FormBuilder,
    private cloudinary: Cloudinary, private router: Router,
    private _firebaseAuth: AngularFireAuth, private service: AdsService) {

    _firebaseAuth.authState.subscribe((user) => {if (user) { this.user_uid = user.uid; } });
  }

  ngOnInit() {
    this.ad = new Advertisement();
    this.firstFormGroup = this._formBuilder.group({
      phone: ['', Validators.required],
      body: ['', [Validators.required, Validators.minLength(4)]],
      category: ['', Validators.required]
    });

    this.firstFormGroup.statusChanges.subscribe(val => {
      // console.log(this.firstFormGroup.status + ' form group 1 ' + JSON.stringify(this.firstFormGroup.value));
    });

    this.secondFormGroup = this._formBuilder.group({
      secondCtrl: ['', Validators.nullValidator]
    });

    this.thirdFormGroup = this._formBuilder.group({
      thirdCtrl: ['', Validators.nullValidator]
    });

    this.service.get_categories().then(response => {
      response.forEach((doc) => {
        // console.log(doc.id + ' : ' + doc.get('name'));
        const a = new AdvCat(doc.id, doc.get('name'));
        this.categories.push(a);

        this.adv_id = this.afs.createId();
        // this.firstFormGroup.setValue({user_uid: this.user_uid});
        this.firstFormGroup.setValue({phone: '99094190', body: 'Drew', category: this.categories[0]});
      });
    });

    console.log(this.cloudinary.cloudinaryInstance.image('samples/food/spices'));
  }

  upload(event) {
    this.f = event.target.files[0];

    this.service.uploadImage(this.user_uid, this.adv_id, this.f, true).then(res => {
      console.log('uploadImage res ' + res);
    });
  }

  onFileChanged(event) {
    this.f = event.target.files[0];
    console.log('uploading file ' + this.f.name);
    if (event.target.files && event.target.files[0]) {
      const reader = new FileReader();

      reader.onload = function(e) {

        document.getElementById('img_1').setAttribute('src', reader.result.toString());
      };

      reader.readAsDataURL(event.target.files[0]);
    }
  }

  onUploaded(resp: Array<any>) {
    // console.log(resp);
    this.images = [];
    resp.forEach(element => {
      if (element.data.secure_url != null) {
        console.log(element.data.secure_url);
        this.images.push(element.data.secure_url);
      }
    });
  }

  onPositioned(resp: Geometry) {
    // console.log(resp.geometry.coordinates);
    this.geometry = resp;

  }

  createAd() {
    console.log('ad is ' + JSON.stringify(this.firstFormGroup.value));
    this.ad = this.firstFormGroup.value;
    this.ad.user_uid = this.user_uid;
    this.ad.created_on = new Date();
    this.ad.images = this.images;
    this.ad.geometry = this.geometry;
    if (this.ad.category !== undefined) {
      this.ad.category = JSON.parse(JSON.stringify(this.ad.category));
    }

    console.log('ad is ' + JSON.stringify(this.ad));

    this.afs.collection('advertisements').doc(this.adv_id).set(Object.assign({}, this.ad))
    .then(doc => {
      console.log('Document successfully written!');
      this.router.navigate(['/eshop/aggelies/' + this.adv_id + '']);
    })
    .catch(function(error) {
      console.error('Error writing document: ', error);
    });

  }

}
