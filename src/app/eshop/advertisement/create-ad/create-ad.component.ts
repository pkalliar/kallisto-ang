import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'pk-create-ad',
  templateUrl: './create-ad.component.html',
  styleUrls: ['./create-ad.component.css']
})
export class CreateAdComponent implements OnInit {

  ad = null;

  constructor() { }

  ngOnInit() {
    this.ad = {};
  }

  createAd() {
    console.log('ad is ' + JSON.stringify(this.ad));
  }

}
