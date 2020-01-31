export class Geoshape {
  type: string;
  points: any[];
  obj: any[];

  constructor(type: string, points: any[]) {
    this.type = type;
    this.points = points;
  }
}

export class NavtexData {
  id: string;
  station_id: string;
  station_name: string;
  name: string;
  description: string;
  published: Date;
  created_on: Date;
  // validity_periods: [
  //   {
  //     from: Date;
  //     until: Date;
  //   }
  // ];
  valid_from: Date;
  valid_until: Date;
  area: number;
  geoshapes: Geoshape[];
  show: boolean;
  expanded: boolean;

  constructor() {
    // this.points = [];
    this.geoshapes = [];
  }
}


export class NavtexStation {
  id: string;
  name: string;
  url: string;
  emails: string[];
  smsNumbers: string[];
  show: boolean;
  checked: Date;

  constructor(id: string, name: string, url: string, checked: any, emails: string[], smsNumbers: string[]) {
    this.id = id;
    this.name = name;
    this.url = url;
    if(checked){
      this.checked = new Date((checked.seconds * 1000));
    }
    // this.checked = checked;
    this.emails = emails;
    this.smsNumbers = smsNumbers;
  }

}

export class GeoLayer {
  type: string;
  points: firebase.firestore.GeoPoint[];
  obj: any[];

  constructor(type: string, points: firebase.firestore.GeoPoint[]) {
    this.type = type;
    this.points = points;
  }
}

export class MapLayer {
  name: string;
  kmlFile: string;
  layer: any;
  show: boolean;
  color: string;
  // point: firebase.firestore.GeoPoint;
  geolayers: GeoLayer[];

  constructor(name, file, layer, show, color) {
      this.name = name;
      this.kmlFile = file;
      this.layer = layer;
      this.show = show;
      this.color = color;
  }
}
