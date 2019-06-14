export class Geoshape {
  type: string;
  points: any[];
  obj: any;

  // constructor(type: string, points: any[]) {
  //   this.type = type;
  //   this.points = points;
  // }
}

export class NavtexData {
  id: string;
  station: string;
  name: string;
  description: string;
  published: Date;
  created_on: Date;
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
