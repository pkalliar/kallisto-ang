import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Contact } from './contact';
import { ContactDetailComponent } from './contact-detail.component';
import { ContactService } from './contact.service';

import {DataSource} from '@angular/cdk/collections';
import {MatSort} from '@angular/material';
import {Observable} from 'rxjs/Observable';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/startWith';
import 'rxjs/add/observable/merge';
import 'rxjs/add/operator/map';


// my comment on Monday morning
@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css'],
  providers: []
})



export class ContactComponent implements OnInit {
  selectedContact: Contact;

  contacts: Contact[];


  displayedColumns = ['code', 'legal_name', 'enabled'];

  contactDatabase = new ContactDatabase();
  dataSource: ContactDataSource | null;
  @ViewChild(MatSort) sort: MatSort;


  constructor(
    private router: Router,
    private contactService: ContactService) { }

  getContacts(): void {
    this.contactService.getContacts().then(
      contacts => this.contacts = this.prepareContacts(contacts));
  }

  prepareContacts(contacts: Contact[]): Contact[] {
    for (const contact of contacts) {
      // console.log('contact: ' + contact);
      this.contactDatabase.addContact(contact);
    }

    return contacts;
  }

  ngOnInit(): void {
    this.getContacts();
    this.dataSource = new ContactDataSource(this.contactDatabase, this.sort);
  }

  onSelect(contact: Contact): void {
    this.selectedContact = contact;
  }

  gotoDetail(): void {
    this.router.navigate(['/detail', this.selectedContact.id]);
  }

}



/** An example database that the data source uses to retrieve data for the table. */
export class ContactDatabase {
  /** Stream that emits whenever the data has been modified. */
  dataChange: BehaviorSubject<Contact[]> = new BehaviorSubject<Contact[]>([]);
  get data(): Contact[] { return this.dataChange.value; }

  // constructor() {
  //   // Fill up the database with 100 users.
  //   for (let i = 0; i < 2; i++) { this.addContact(); }
  // }

  /** Adds a new user to the database. */
  addContact(contact: Contact) {
    const copiedData = this.data.slice();
    copiedData.push(this.createNewContact(contact));
    this.dataChange.next(copiedData);
  }

  /** Builds and returns a new User. */
  private createNewContact(contact: Contact) {
    return {
      id: contact.id,
      code: contact.code,
      legal_name: contact.legal_name,
      enabled: contact.enabled
    };
  }
}

/**
 * Data source to provide what data should be rendered in the table. Note that the data source
 * can retrieve its data in any way. In this case, the data source is provided a reference
 * to a common data base, ExampleDatabase. It is not the data source's responsibility to manage
 * the underlying data. Instead, it only needs to take the data and send the table exactly what
 * should be rendered.
 */
export class ContactDataSource extends DataSource<any> {
  constructor(private _cDatabase: ContactDatabase, private _sort: MatSort) {
    super();
  }

  /** Connect function called by the table to retrieve one stream containing the data to render. */
  connect(): Observable<Contact[]> {
    // return this._cDatabase.dataChange;
    const displayDataChanges = [
      this._cDatabase.dataChange,
      this._sort.sortChange,
    ];

    return Observable.merge(...displayDataChanges).map(() => {
      return this.getSortedData();
    });
  }

  disconnect() {}

    /** Returns a sorted copy of the database data. */
    getSortedData(): Contact[] {
      const data = this._cDatabase.data.slice();
      if (!this._sort.active || this._sort.direction == '') { return data; }
  
      return data.sort((a, b) => {
        let propertyA: number|string = '';
        let propertyB: number|string = '';
  
        switch (this._sort.active) {
          case 'id': [propertyA, propertyB] = [a.id, b.id]; break;
          case 'code': [propertyA, propertyB] = [a.code, b.code]; break;
          case 'legal_name': [propertyA, propertyB] = [a.legal_name, b.legal_name]; break;
        }
  
        let valueA = isNaN(+propertyA) ? propertyA : +propertyA;
        let valueB = isNaN(+propertyB) ? propertyB : +propertyB;
  
        return (valueA < valueB ? -1 : 1) * (this._sort.direction == 'asc' ? 1 : -1);
      });
    }
}
