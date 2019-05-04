import {Component, OnInit, Input} from '@angular/core';
import {Observable} from 'rxjs';
import {PhotoAlbum} from '../photo-album.service';
import {Photo} from '../photo';

@Component({
    selector: 'app-photo-list',
    templateUrl: 'photo-list.component.html',
    styleUrls: ['photo-list.component.css']
})
export class PhotoListComponent implements OnInit {

    public photos: Observable<Photo[]>;

    @Input() imgPath: string;
    @Input() maxHeight: number;

    constructor(
        private photoAlbum: PhotoAlbum
    ) { }

    ngOnInit(): void {

        this.photos = this.photoAlbum.getPhotos( this.imgPath );

        this.photos.subscribe(
            x => {
                // console.log('Observer got a next value: ' + JSON.stringify(x));
            }
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

    onLoadImage(success) {
        console.log('On load', success);
    }
    onErrorImage(err) {
        console.log('On error!!', err);
    }
}
