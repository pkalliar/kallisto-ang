import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { Location } from '@angular/common';

import { ContactService } from './contact.service';

import { Contact } from './contact';
import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-contact-detail',
  templateUrl: './contact-detail.component.html',
  styleUrls: ['./contact-detail.component.css']
})



export class ContactDetailComponent implements OnInit {
    @Input() contact: Contact;
    isEdit = false;

    constructor(
      private route: ActivatedRoute,
      private router: Router,
      private location: Location,
      private contactService: ContactService
    ) {}

    ngOnInit(): void {
      this.route.paramMap.pipe(
        switchMap((params: ParamMap) => this.contactService.getContact(params.get('id'))))
        .subscribe(contact => this.contact = contact);
        if (location.pathname.endsWith('edit') || location.pathname.endsWith('new')) { this.isEdit = true; }
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

    save(contact): void {
      console.log('loc: ' + location.pathname);
      this.contactService.saveContact(contact);
    }

    delete(contact): void {
      console.log('delete contact: ' + contact.id);
      this.contactService.deleteContact(contact);
    }

}
