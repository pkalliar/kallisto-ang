import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Location } from '@angular/common';
import 'rxjs/add/operator/switchMap';

import { ContactService } from './contact.service';

import { Contact } from './contact';

@Component({
  selector: 'contact-detail',
  templateUrl: './contact-detail.component.html',
  styleUrls: ['./contact-detail.component.css']
})



export class ContactDetailComponent implements OnInit{
    @Input() contact: Contact;

    constructor(
      private protocolService: ContactService,
      private route: ActivatedRoute,
      private location: Location
    ) {}

    ngOnInit(): void {
      this.route.paramMap
        .switchMap((params: ParamMap) => this.protocolService.getContact(params.get('id')))
        .subscribe(contact => this.contact = contact);
    }

    goBack(): void {
      this.location.back();
    }

}