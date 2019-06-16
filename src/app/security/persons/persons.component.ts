import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { Person } from './person';
// import { ContactDetailComponent } from './contact-detail.component';
import { PersonService } from './person.service';
import {FormControl} from '@angular/forms';

import {DataSource} from '@angular/cdk/collections';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatChipInputEvent } from '@angular/material/chips';
import { MatSort } from '@angular/material/sort';
import { catchError, tap, switchMap, debounceTime, distinctUntilChanged, takeWhile, first, map } from 'rxjs/operators';
import {ENTER} from '@angular/cdk/keycodes';

import { TableDatabase, TableDataSource } from '../../utilities';
import { Observable } from 'rxjs';

const COMMA = 188;

// my comment on Monday morning
@Component({
  selector: 'app-person',
  templateUrl: './persons.component.html',
  styleUrls: ['./persons.component.css'],
  providers: []
})



export class PersonComponent implements OnInit {

  selected: Person;

  entlist: Person[];

  currentFilter = '';
  displayedColumns = ['firstname', 'lastname', 'mobile'];

  tableDatabase = new TableDatabase();
  dataSource: TableDataSource | null;
  @ViewChild(MatSort, {static: true}) sort: MatSort;

  visible = true;
  selectable = true;
  removable = true;

  constructor(
    private router: Router,
    private service: PersonService) { }

    // Enter, comma
    separatorKeysCodes = [ENTER, COMMA];

     criteria = [];

     isExpanded = false;

    searchTerm: FormControl = new FormControl();

    searchResult = [];

    filteredOptions: Observable<any[]>;

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
        this.searchTerm.setValue('');

        console.log(' before asking filter ' + JSON.stringify(this.criteria));

        this.tableDatabase.clear();
        this.searchResult = [];
        this.getWithFilter(this.criteria);


       }
       if (this.criteria.length > 0) { this.isExpanded = true; }
     }

    remove(fruit: any): void {
      console.log('removing' + JSON.stringify(fruit));
      const index = this.criteria.indexOf(fruit);

      if (index >= 0) {
        this.criteria.splice(index, 1);
        this.tableDatabase.clear();
        this.getWithFilter(this.criteria);
      }
      if (this.criteria.length === 0) { this.isExpanded = false; }
    }

  filter(name: string): Observable<any[]> {
    console.log('123 ' + name);
    // if ( name.length > 1 ) {

      return this.service.searchSync(name);
      // .pipe(
      //   map(response => response.filter(option => {
      //     return option.display_name.toLowerCase().indexOf(name.toLowerCase()) === 0;
      //   }))
      // );
    // }
  }

  displayFn = (cc: Person): string => {
    if ( cc != null && this.currentFilter.length > 0) {
      // console.log(cc);
      this.remove({name : this.currentFilter});
      console.log(this.currentFilter + ' 456' + JSON.stringify(cc) + ' - ' + cc.lastname);
      this.router.navigate(['/affairs/', cc.id]);

      return cc ? cc.lastname : cc.id;
    }

  }

  selectedFn(event: MatAutocompleteSelectedEvent): void {
      console.log('selected ' + event.source);
  }

  getWithFilter(filter: any): void {
    // this.service.get(JSON.stringify(filter)).then(
    //   folders => this.entlist = this.prepare(folders));
    this.service.getFB(JSON.stringify(filter)).then(
      folders => this.entlist = this.prepare(folders));
  }

  prepare(entList: Person[]): Person[] {
    for (const ent of entList) {
      console.log('contact: ' + JSON.stringify(ent));
      this.tableDatabase.addLine(ent);
    }

    return entList;
  }

  new(): void {
    console.log('new line: ');
    this.service.new().then(
      contact => this.router.navigate(['/persons/' + 'new']));
  }

  ngOnInit(): void {
    this.getWithFilter([]);
    this.dataSource = new TableDataSource(this.tableDatabase, this.sort);

    this.searchTerm.valueChanges
    // .debounceTime(400)
    .subscribe(data => {
      if (data.length > 2) {
        this.service.search_word(data).subscribe(response => {
            this.searchResult = response;
        });
      }
    });

  }

  onSelect(folder: Person): void {
    this.selected = folder;
  }

  gotoDetail(): void {
    this.router.navigate(['/detail', this.selected.id]);
  }


}
