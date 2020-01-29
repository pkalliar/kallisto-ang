import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { Location } from '@angular/common';

import { ContactService } from './contact.service';
import { ContactGroupService } from './contactgroup.service';

import { Contact, ContactGroup, ContactGroupFull } from './contact';
import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-contactgroup-detail',
  templateUrl: './contactgroup-detail.component.html',
  styleUrls: ['./contactgroup-detail.component.css']
})



export class ContactGroupDetailComponent implements OnInit {
    @Input() contactgroup: ContactGroup;
    // contactGroupFull: ContactGroupFull;
    isEdit = false;
    checked = false;
    contactsCriteria = [];
    showContacts = false;

    constructor(
      private route: ActivatedRoute,
      private router: Router,
      private location: Location,
      private contactgroupService: ContactGroupService
    ) {}

    ngOnInit(): void {
      this.route.paramMap.pipe(
        switchMap((params: ParamMap) => this.contactgroupService.get(params.get('id'))))
        .subscribe(result => this.loadGroupContacts(result));



        // this.contactgroup = this.contactGroupFull.group;

        console.log(this.contactgroup);
        if (location.pathname.endsWith('edit') || location.pathname.endsWith('new')) { this.isEdit = true; }
    }

    loadGroupContacts(result): void {
      this.contactgroup = result;
      this.contactsCriteria.push({ group : this.contactgroup.id});
      this.showContacts = true;
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

    save(contactgroup): void {
      console.log('loc: ' + location.pathname);
      this.contactgroupService.save(contactgroup);
    }

    delete(contactgroup): void {
      console.log('delete contact: ' + contactgroup.id);
      this.contactgroupService.delete(contactgroup);
    }

}
