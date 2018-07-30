import { Component, OnInit, Input } from '@angular/core';
import { AngularFirestore, AngularFirestoreDocument } from 'angularfire2/firestore';
import { AngularFireAuth } from 'angularfire2/auth';
import { Advertisement, AdvCat } from '../advertisement';
import { AdsService } from '../advertisements.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { throwMatDuplicatedDrawerError } from '@angular/material';
import { Cloudinary } from '@cloudinary/angular-5.x';

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
  categories: Array<AdvCat> = [];
  isLinear = true;
  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;

  constructor(private afs: AngularFirestore, private _formBuilder: FormBuilder,
    private cloudinary: Cloudinary,
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
      console.log(this.firstFormGroup.status + ' form group 1 ' + JSON.stringify(this.firstFormGroup.value));
    });

    this.secondFormGroup = this._formBuilder.group({
      secondCtrl: ['', Validators.required]
    });

    this.service.get_categories().then(response => {
      response.forEach((doc) => {
        console.log(doc.id + ' : ' + doc.get('name'));
        const a = new AdvCat(doc.id, doc.get('name'));
        this.categories.push(a);

        this.firstFormGroup.setValue({phone: '99094190', body: 'Drew', category: this.categories[0]});
      });
    });

    console.log(this.cloudinary.cloudinaryInstance.image('samples/food/spices'));
  }

  upload(event) {
    this.f = event.target.files[0];

    this.service.upload(this.user_uid, this.adv_id, this.f, true);
  }

  onFileChanged(event) {
    this.f = event.target.files[0];
    console.log('uploading file ' + this.f.name);
    if (event.target.files && event.target.files[0]) {
      const reader = new FileReader();

      reader.onload = function(e) {

        // Jimp.read(reader.result)
        // .then(image => {
        //     // do stuff with the image
        // })
        // .catch(err => {
        //     // handle an exception
        // });

      //   Jimp.loadFont(Jimp.FONT_SANS_32_BLACK).then(function(font) {
      //     // image.print(font, 10, 10, 'Hello world!');
      // });


        document.getElementById('img_1').setAttribute('src', reader.result);
      };

      reader.readAsDataURL(event.target.files[0]);
    }
  }

  createAd() {
    console.log('ad is ' + JSON.stringify(this.ad));
    this.ad.user_uid = this.user_uid;
    this.adv_id = this.afs.createId();

    this.afs.collection('advertisements').doc(this.adv_id).set(Object.assign({}, this.ad))
    .then(function() {
      console.log('Document successfully written!');

    })
    .catch(function(error) {
      console.error('Error writing document: ', error);
    });

  }

}
