import {Component, OnInit} from '@angular/core';
import {Observable} from 'rxjs';
import {PhotoAlbum} from '../photo-album.service';
import {Photo} from '../photo';

@Component({
    selector: 'photo-list',
    templateUrl: 'photo-list.component.html',
    styleUrls: ['photo-list.component.css']
})
export class PhotoListComponent implements OnInit {

    private photos: Observable<Photo[]>;
    private publicId = 'officialchucknorrispage';

    constructor(
        private photoAlbum: PhotoAlbum
    ) { }

    ngOnInit(): void {

        this.photos = this.photoAlbum.getPhotos('samples');

        this.photos.subscribe(
            x => { console.log('Observer got a next value: ' + JSON.stringify(x)); }
        );

        // if (this.photos === undefined) {
        //     this.photos = new Observable((observer) => {
        //         // observable execution
        //         observer.next([]);
        //         observer.complete();
        //     });
        // }
    }

    getAlbum() {
        console.log('getAlbum: ');
        const photos2 = this.photoAlbum.getPhotos('samples');
    }

    changePublicId() {
        this.publicId = (this.publicId === 'officialchucknorrispage') ? 'billclinton' : 'officialchucknorrispage';
    }

    onLoadImage(success) {
        console.log('On load', success);
    }
    onErrorImage(err) {
        console.log('On error!!', err);
    }
}