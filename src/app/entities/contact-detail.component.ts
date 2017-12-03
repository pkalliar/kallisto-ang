import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { Location } from '@angular/common';
import 'rxjs/add/operator/switchMap';

import { ContactService } from './contact.service';

import { Contact } from './contact';

@Component({
  selector: 'contact-detail',
  templateUrl: './contact-detail.component.html',
  styleUrls: ['./contact-detail.component.css']
})



export class ContactDetailComponent implements OnInit {
    @Input() contact: Contact;

    constructor(
      private route: ActivatedRoute,
      private location: Location,
      private router: Router,
      private contactService: ContactService
    ) {}



    ngOnInit(): void {
      this.route.paramMap
        .switchMap((params: ParamMap) => this.contactService.getContact(params.get('id')))
        .subscribe(contact => this.contact = contact);
    }

    goBack(): void {
      this.location.back();
    }

    saveContact(contact): void {
      this.contactService.saveContact(contact).then( response => this.router.navigate(['/contacts/' + response.id]));
    }

    deleteContact(contact): void {
      this.contactService.deleteContact(contact).then( response => this.router.navigate(['/contacts']));
    }

}
