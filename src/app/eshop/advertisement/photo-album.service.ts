import {Injectable} from '@angular/core';
import {Response} from '@angular/http';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {Photo} from './photo';
import {Cloudinary} from '@cloudinary/angular-5.x';

@Injectable()
export class PhotoAlbum {

    apiRoot = 'http://httpbin.org';

    constructor(private http: HttpClient, private cloudinary: Cloudinary) {
    }

    getPhotos(tag: string): Observable<Photo[]> {
        // instead of maintaining the list of images, we rely on the 'myphotoalbum' tag
        // and simply retrieve a list of all images with that tag.

        const url = this.cloudinary.url(tag, {
            format: 'json',
            type: 'list',
            // cache bust (lists are cached by the CDN for 1 minute)
            // *************************************************************************
            // Note that this is practice is DISCOURAGED in production code and is here
            // for demonstration purposes only
            // *************************************************************************
            version: Math.ceil(new Date().getTime() / 1000)
        });

        // console.log('url: ' + url);


        return this.http
            .get(url)
            .pipe(map((data: any) => data.resources));
    }

    doGET() {
        console.log('GET');
        const url = `${this.apiRoot}/get`;
        this.http.get(url).subscribe(res => console.log(res));
      }
}
