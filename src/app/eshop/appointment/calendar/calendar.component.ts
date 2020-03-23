import { Component, OnInit, ViewChild, AfterViewInit, ElementRef } from '@angular/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';

import elLocale from '@fullcalendar/core/locales/el';
import { Calendar, EventInput } from '@fullcalendar/core';
import { FullCalendarComponent } from '@fullcalendar/angular';
import { MongoService, Appointment } from '../mongo.service';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css']
})
export class CalendarComponent implements OnInit, AfterViewInit {

  appointment: Appointment;
  appointments: Appointment[];

  title = 'appointment-scheduler';

  @ViewChild('calendar') calendarComponent: FullCalendarComponent;
  calendarApi = null;

  calendarPlugins = [dayGridPlugin, timeGridPlugin, interactionPlugin];
  // calendarEvents: EventInput[] = [
  //   { title: 'Event Now', start: new Date() }
  // ];
  locales = [elLocale];
  dview = 'dayGridMonth';
  slotDuration = '00:10:00';
  minTime = '09:00:00';
  maxTime = '18:00:00';
  headers = {
    left: 'prev,next today',
    center: 'title',
    right: 'dayGridMonth,timeGridWeek,timeGridDay'
  };

  navLinkDayClick(event) {
    this.srv.getDailyAppointments(event)
    .subscribe((data: Appointment[]) => {
      this.appointments = data;
      const eventsArr = [];
      this.appointments.forEach(a => {
        eventsArr.push({
          title: a.name + ' ' + a.surname + ' ' + a.phone + ' ' + a.type,
          start: a.date,
          end: new Date(new Date(a.date).getTime() + 10 * 60000),
          allDay: false
        });
      });
      const evsrc = {
        events: eventsArr,
        id: 'day',
        color: 'cyan',
        textColor: 'black'
      };
      this.calendarApi.addEventSource(evsrc);
    });
    this.calendarApi.gotoDate(event);
    this.calendarApi.changeView('timeGridDay');
  }

  navLinkWeekClick(event) {
    console.log(event);
    this.srv.getWeeklyAppointments(event)
    .subscribe((data: Appointment[]) => {
      this.appointments = data;
      console.log(this.appointments);
      const eventsArr = this.appointments2events(data, 1);
      const evsrc = {
        events: eventsArr,
        id: 'week',
        color: 'cyan',
        textColor: 'black'
      };
      this.calendarApi.addEventSource(evsrc);
      // this.calendarApi.render();
    });

    this.calendarApi.gotoDate(event);
    this.calendarApi.changeView('timeGridWeek');
  }


  constructor(private srv: MongoService) { }

  ngOnInit() {}

  ngAfterViewInit() {
    this.calendarApi = this.calendarComponent.getApi();
    this.calendarApi.gotoDate(new Date('2019-12-18'));
    // this.calendarApi.prevYear();
  }

  datesRender(event) {
    console.log(event);
    if (this.calendarApi) {
      const weekSrc = this.calendarApi.getEventSourceById('week');
      if (weekSrc) {weekSrc.remove(); }
      const daySrc = this.calendarApi.getEventSourceById('day');
      if (daySrc) {daySrc.remove(); }

      this.calendarApi.updateSize();
      this.calendarApi.render();
      this.calendarApi.setOption('contentHeight', 500);
    }

  }

  addNewEvent(date) {
    if (!isNaN(date.valueOf())) { // valid?
      this.calendarApi.addEvent({
        title: 'dynamic event',
        start: date,
        allDay: true
      });
    }
  }

  appointments2events (appointments: Appointment[], mode: number): any[] {
    const eventsArr = [];
    appointments.forEach(a => {
      let textContent = '';
      if (mode === 1) {
        textContent = a.name + ' ' + a.surname;
      } else if (mode === 2) {
        textContent = a.name + ' ' + a.surname + ' ' + a.phone + ' ' + a.type;
      }
      eventsArr.push({
          title: textContent,
          start: a.date,
          end: new Date(new Date(a.date).getTime() + 10 * 60000),
          allDay: false
        }
      );
    });
    return eventsArr;
  }



}
