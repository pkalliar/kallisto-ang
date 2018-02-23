import { Injectable } from '@angular/core';

import * as moment from 'moment';

@Injectable()
export class UtilitiesService {

  constructor() { }

  parseJavaDate2ISO(javaObj: any): string  {
    return moment([ javaObj.year,
      javaObj.monthValue - 1,
      javaObj.dayOfMonth,
      javaObj.hour,
      javaObj.minute,
      javaObj.second,
      0]).
      utcOffset(javaObj.offset.id).
      toISOString();
  }

}
