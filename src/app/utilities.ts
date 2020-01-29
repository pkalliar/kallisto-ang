import {DataSource} from '@angular/cdk/collections';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatChipInputEvent } from '@angular/material/chips';
import { MatSort } from '@angular/material/sort';
import { BehaviorSubject, Observable, merge } from 'rxjs';
import { map } from 'rxjs/operators';




/** An example database that the data source uses to retrieve data for the table. */
export class TableDatabase {
    /** Stream that emits whenever the data has been modified. */
    dataChange: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);
    get data(): any[] { return this.dataChange.value; }

    clear() {
      const copiedData = [];
      this.dataChange.next(copiedData);
    }

    /** Adds a new user to the database. */
    addLine(line: any) {
      const copiedData = this.data.slice();
      // copiedData.push(this.createNewLine(line));
      copiedData.push(line);
      this.dataChange.next(copiedData);
    }

    // /** Builds and returns a new User. */
    // private createNewLine(line: any) {
    //   return {
    //     id: line.id,
    //     code: line.code,
    //     display_name: line.display_name,
    //     enabled: line.enabled
    //   };
    // }
  }

  /**
   * Data source to provide what data should be rendered in the table. Note that the data source
   * can retrieve its data in any way. In this case, the data source is provided a reference
   * to a common data base, ExampleDatabase. It is not the data source's responsibility to manage
   * the underlying data. Instead, it only needs to take the data and send the table exactly what
   * should be rendered.
   */
  export class TableDataSource extends DataSource<any> {
    constructor(private _cDatabase: TableDatabase, private _sort: MatSort) {
      super();
    }

    /** Connect function called by the table to retrieve one stream containing the data to render. */
    connect(): Observable<any[]> {
      // return this._cDatabase.dataChange;
      const displayDataChanges = [
        this._cDatabase.dataChange,
        this._sort.sortChange,
      ];

      return merge(...displayDataChanges).pipe(map(() => {
        return this.getSortedData();
      }));
    }

    disconnect() {}

      /** Returns a sorted copy of the database data. */
      getSortedData(): any[] {
        const data = this._cDatabase.data.slice();
        if (!this._sort.active || this._sort.direction === '') { return data; }

        return data.sort((a, b) => {
          let propertyA: number|string = '';
          let propertyB: number|string = '';

          switch (this._sort.active) {
            case 'id': [propertyA, propertyB] = [a.id, b.id]; break;
            case 'code': [propertyA, propertyB] = [a.code, b.code]; break;
            case 'display_name': [propertyA, propertyB] = [a.display_name, b.display_name]; break;
          }

          const valueA = isNaN(+propertyA) ? propertyA : +propertyA;
          const valueB = isNaN(+propertyB) ? propertyB : +propertyB;

          return (valueA < valueB ? -1 : 1) * (this._sort.direction === 'asc' ? 1 : -1);
        });
      }
  }
