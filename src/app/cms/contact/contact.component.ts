import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { Router } from '@angular/router';
import { Contact, ContactCategory, ContactGroup } from './contact';
import { ContactDetailComponent } from './contact-detail.component';
import { ContactService } from './contact.service';
import { ContactGroupService } from './contactgroup.service';
import {FormControl} from '@angular/forms';

import {DataSource} from '@angular/cdk/collections';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatChipInputEvent } from '@angular/material/chips';
import { MatSort } from '@angular/material/sort';
import { catchError, tap, switchMap, debounceTime, distinctUntilChanged, takeWhile, first, map } from 'rxjs/operators';
import {ENTER} from '@angular/cdk/keycodes';
import { Observable, BehaviorSubject, merge } from 'rxjs';

const COMMA = 188;

// my comment on Monday morning
@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css'],
  providers: []
})



export class ContactComponent implements OnInit {

  @Input() showSearchBar = true;

  @Input() criteria = [];

  selectedContact: Contact;

  contacts: Contact[];

  currentFilter = '';
  displayedColumns = ['code', 'legal_name', 'enabled'];

  contactDatabase = new ContactDatabase();
  dataSource: ContactDataSource | null;
  @ViewChild(MatSort, {static: true}) sort: MatSort;

  visible = true;
  selectable = true;
  removable = true;

  constructor(
    private router: Router,
    private contactService: ContactService,
    private contactgroupService: ContactGroupService) { }

    // Enter, comma
    separatorKeysCodes = [ENTER, COMMA];

    isExpanded = false;

    searchTerm: FormControl = new FormControl();

    searchResult = [];

    filteredOptions: Observable<any[]>;

    ngOnInit(): void {
      this.getContacts(this.criteria);
      this.dataSource = new ContactDataSource(this.contactDatabase, this.sort);
      this.searchTerm.valueChanges
      // .debounceTime(400)
      .subscribe(data => {
        if (data.length > 2) {
          this.contactService.search_word(data).subscribe(response => {
            console.log('resp: ' + response);
              this.searchResult = response;
          });
        }
      });
    }

    dataChanged(newObj) {
      console.log('changed ' + newObj + '..' + this.criteria.length );
      this.currentFilter = newObj;
      if (this.criteria.length > 0) { this.isExpanded = true; }
    }

    handleKeyPress(e) {
      const key = e.keyCode || e.which;
       if (key === 13 && this.currentFilter.length > 0) {
        console.log(' enter pressed ' + this.currentFilter);

        this.criteria.push({ name: this.currentFilter });
        this.router.navigate(['/contacts/search/', JSON.stringify(this.criteria)]);

        this.searchTerm.setValue('');

        console.log(' before asking filter ' + JSON.stringify(this.criteria));

        this.contactDatabase.clear();
        this.searchResult = [];
        this.getContacts(this.criteria);


       }
       if (this.criteria.length > 0) { this.isExpanded = true; }
     }

    remove(fruit: any): void {
      console.log('removing' + JSON.stringify(fruit));
      const index = this.criteria.indexOf(fruit);

      if (index >= 0) {
        this.criteria.splice(index, 1);
        this.contactDatabase.clear();
        this.getContacts(this.criteria);
      }
      if (this.criteria.length === 0) { this.isExpanded = false; }
    }

  filter(name: string): Observable<any[]> {
    // console.log('123 ' + name);
    // if ( name.length > 1 ) {

      return this.contactService.searchContact(name)
      .pipe(
        map(response => response
          // .filter(option => { return option.legal_name.toLowerCase().indexOf(name.toLowerCase()) === 0;})
        )
      );
    // }
  }

  displayFn = (cc: any): string => {
    if ( cc != null && this.currentFilter.length > 0) {
      console.log('constructor: ' + JSON.stringify(cc.constructor.name));
      this.remove({name : this.currentFilter});
      console.log(this.currentFilter + ' 456' + JSON.stringify(cc) + ' - ' + cc.code);
      if (cc.legal_name !== undefined && cc.legal_name.length > 1) {
        this.router.navigate(['/contacts/', cc.id]);
      } else if (cc.name !== undefined && cc.name.length > 1 ) {
        this.router.navigate(['/contact-groups/', cc.id]);
      }


      return cc ? cc.code : cc.id;
    }

  }

  selectedFn(event: MatAutocompleteSelectedEvent): void {
      console.log('selected ' + event.source);
  }

  getContacts(filter: any): void {
    this.contactService.getContacts(JSON.stringify(filter)).then(
      contacts => this.contacts = this.prepareContacts(contacts));
  }

  prepareContacts(contacts: Contact[]): Contact[] {
    for (const contact of contacts) {
      // console.log('contact: ' + contact);
      this.contactDatabase.addContact(contact);
    }

    return contacts;
  }

  newContact(): void {
    console.log('new contact: ');
    this.contactService.newContact().then(
      contact => this.router.navigate(['/contacts/' + 'new']));
  }



  onSelect(contact: Contact): void {
    this.selectedContact = contact;
  }

  gotoDetail(): void {
    this.router.navigate(['/detail', this.selectedContact.id]);
  }

  searchContact(toSearch: String): void {
    console.log('searching for ' + toSearch);
  }

}



/** An example database that the data source uses to retrieve data for the table. */
export class ContactDatabase {
  /** Stream that emits whenever the data has been modified. */
  dataChange: BehaviorSubject<Contact[]> = new BehaviorSubject<Contact[]>([]);
  get data(): Contact[] { return this.dataChange.value; }

  clear() {
    const copiedData = [];
    this.dataChange.next(copiedData);
  }

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


    return Observable.create(this.getSortedData());

  }

  disconnect() {}

    /** Returns a sorted copy of the database data. */
    getSortedData(): Contact[] {
      const data = this._cDatabase.data.slice();
      if (!this._sort.active || this._sort.direction === '') { return data; }

      return data.sort((a, b) => {
        let propertyA: number|string = '';
        let propertyB: number|string = '';

        switch (this._sort.active) {
          case 'id': [propertyA, propertyB] = [a.id, b.id]; break;
          case 'code': [propertyA, propertyB] = [a.code, b.code]; break;
          case 'legal_name': [propertyA, propertyB] = [a.legal_name, b.legal_name]; break;
        }

        const valueA = isNaN(+propertyA) ? propertyA : +propertyA;
        const valueB = isNaN(+propertyB) ? propertyB : +propertyB;

        return (valueA < valueB ? -1 : 1) * (this._sort.direction === 'asc' ? 1 : -1);
      });
    }
}
