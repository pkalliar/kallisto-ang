import { Injectable, Output, EventEmitter } from '@angular/core';
import { User } from '../security/users/user';

@Injectable({
  providedIn: 'root'
})
export class TopnavService {


  @Output() changeTitle: EventEmitter<string> = new EventEmitter();
  @Output() changeUser: EventEmitter<User> = new EventEmitter();

  constructor() { }

  public setTitle(title: string) {
    console.log('setting title: ' + title);
    this.changeTitle.emit(title);
  }

  public getTitlo() {return 'titlo'; }

  public setUser(user: User) {

    sessionStorage.setItem('user', JSON.stringify(user));

    this.changeUser.emit(user);
  }

}
