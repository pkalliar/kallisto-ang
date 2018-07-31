import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { Location } from '@angular/common';
import 'rxjs/add/operator/switchMap';

import { Advertisement } from './advertisement';
import { AdsService } from './advertisements.service';


@Component({
  selector: 'app-detail',
  templateUrl: './ad-detail.component.html',
  styleUrls: ['./ad-detail.component.css']
})


export class AdDetailComponent implements OnInit {
    @Input() item: Advertisement;
    isEdit = false;

    constructor(
      private route: ActivatedRoute,
      private router: Router,
      private location: Location,
      private service: AdsService
    ) {}

    ngOnInit(): void {

       }

    // loadContact(id): void {
    //   this.contactService.getContact(id)
    // }

    goBack(): void {
      this.location.back();
    }

    edit(): void {
      this.router.navigate([location.pathname, 'edit']);
    }

    save(): void {
      console.log('loc: ' + location.pathname);
    }

    delete(): void {
      console.log('delete contact: ' + location.pathname);
    }

}
