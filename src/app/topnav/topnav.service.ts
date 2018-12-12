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

  public setUser(user: User) {

    sessionStorage.setItem('user', JSON.stringify(user));

    this.changeUser.emit(user);
  }

  public getUserInfo(): User {

    // console.log('getUserInfo');

    const user = sessionStorage.getItem('user');
    return JSON.parse(user);
  }

}
