import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { Location } from '@angular/common';
import 'rxjs/add/operator/switchMap';

import { AdsService } from './advertisements.service';


@Component({
  selector: 'app-detail',
  templateUrl: './ad-detail.component.html',
  styleUrls: ['./ad-detail.component.css']
})



export class AdDetailComponent implements OnInit {
    // @Input() contact: Contact;
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

    saveContact(contact): void {
      console.log('loc: ' + location.pathname);
    }

    deleteContact(contact): void {
      console.log('delete contact: ' + contact.id);
    }

}
