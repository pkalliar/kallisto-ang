import { Injectable } from '@angular/core';


@Injectable({
  providedIn: 'root'
})
export class MongoService {

  url = 'mongodb://195.167.30.73:80';

  dbName = 'kallisto'; 


  constructor() { 

  }
}
