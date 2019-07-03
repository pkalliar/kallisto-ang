import { Component, OnInit } from '@angular/core';
import { TopnavService } from './topnav.service';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { User } from '../security/users/user';
// import * as dayjs from 'dayjs';
import { DateTime, Duration, Interval } from 'luxon';
import { PersonService } from '../security/persons/person.service';

@Component({
  selector: 'app-topnav',
  templateUrl: './topnav.component.html',
  styleUrls: ['./topnav.component.css']
})
export class TopnavComponent implements OnInit {

  title = '--';
  ttposition = 'below';
  user: User;
  userDetails: firebase.User = null;
  displayName = '';
  counter: number;
  counterStr: string;

  // spinner
  color = 'primary';
  mode = 'determinate';
  spinnerValue = 0;

  constructor(private topnav: TopnavService, private authService: AuthService , private personService: PersonService,
    private router: Router, private route: ActivatedRoute) {
      this.authService = authService;

      authService.user.subscribe(
        (user) => {
          if (user) {
            console.log( 'user.uid ' + user.uid );
            this.userDetails = user;
            this.displayName = user.displayName;

            this.personService.getFB(user.uid).then(
              persons =>  {
                for (const ent of persons) {
                  console.log('contact: ' + JSON.stringify(ent));
                  this.displayName = ent.firstname + ' ' + ent.lastname;
                }
            });

            console.log(JSON.stringify(user));
            user.getIdTokenResult().then((res) => {
              console.log(this.authService.isLoggedIn() + ' Write succeeded!' + res.expirationTime);
              console.log(res.issuedAtTime + '..' + res.authTime);
            }
            );
          } else {
          }
        }
      );

    }

  ngOnInit() {

    this.topnav.changeTitle.subscribe(title => {
      this.title = title;
    });

    this.user = this.topnav.getUserInfo();
    if (this.user) {
      this.initUserInfo(this.user);
    }


    this.topnav.changeUser.subscribe(user => {
      this.user = user;
      this.initUserInfo(this.user);
    });

  }

  initUserInfo(user: User) {
    console.log('this.user: ' + JSON.stringify(this.user));
    const expireDate = DateTime.fromMillis(this.user.apikey_expires);
    // const expireDate = DateTime.fromJSDate(this.user.apikey_expires) ;
    let loginTime = DateTime.fromISO(this.user.loginTime) ;
    if (this.user.loginTime instanceof Date) {
      loginTime = DateTime.fromJSDate(this.user.loginTime) ;
    }
    console.log('loginTime: ' + loginTime.toISO());
    console.log('expireDate: ' + expireDate.toISO() + ' ' + DateTime.local().toISO());
    const interval = Interval.fromDateTimes(DateTime.local(), expireDate);

    const maxlocal = DateTime.max(loginTime, DateTime.local());
    const offset = Interval.fromDateTimes(loginTime, DateTime.local());
    this.startCountdown(
      interval.toDuration('seconds').toFormat('s'),
      offset.toDuration('seconds').toFormat('s')
    );
  }

  login() {
    this.route.paramMap.subscribe((params: ParamMap) => console.log(params.get('id')));

    console.log('current path: ' + location.pathname);
    console.log('current path: ' + decodeURIComponent(location.pathname));
    console.log('current path: ' + encodeURIComponent(location.pathname));
    // if (location.pathname.endsWith('edit') || location.pathname.endsWith('new')) { this.isEdit = true; }

    this.router.navigate(['/login', { then: decodeURIComponent(location.pathname) }]);
  }

  logout = function() {
    // this.httpClient.get(environment.apiurl + '/api/authenticate/logout').toPromise()
    // .then(function(resp: any) {
    //   console.log('refreshing : ' + JSON.stringify(resp) );
    // });
    this.authService.logout().then(
      (res: Object) => {
        console.log(JSON.stringify(res));
        this.user = null;
        this.userDetails  = null;
        // this.router.navigate(['/login' ]);
      }
      );
  };

  isLoggedIn = function() {return this.authService.isLoggedIn(); };

  startCountdown(secondsLeft, offset) {
    this.counter = secondsLeft - offset;
    console.log('seconds: ' + secondsLeft + ' offset: ' + offset);

    const interval = setInterval(() => {
      this.counter--;
      this.spinnerValue = this.counter / secondsLeft * 100;
      const dur = Duration.fromObject({seconds: this.counter});
      this.counterStr = dur.toFormat('mm:ss');

      if (this.counter < 0 ) {
        // The code here will run when
        // the timer has reached zero.

        clearInterval(interval);
        console.log('Ding!');
        this.logout();
      }
    }, 1000);
  }

}
