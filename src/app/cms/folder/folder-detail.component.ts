import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { Location } from '@angular/common';

import { FolderService } from './folder.service';

import { Folder } from './folder';
import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-folder-detail',
  templateUrl: './folder-detail.component.html',
  styleUrls: ['./folder-detail.component.css']
})



export class FolderDetailComponent implements OnInit {
    @Input() folder: Folder;
    isEdit = false;

    constructor(
      private route: ActivatedRoute,
      private router: Router,
      private location: Location,
      private service: FolderService
    ) {}

    ngOnInit(): void {
      this.route.paramMap.pipe(
        switchMap((params: ParamMap) => this.service.getFolder(params.get('id'))))
        .subscribe(folder => this.folder = folder);
        if (location.pathname.endsWith('edit') || location.pathname.endsWith('new')) { this.isEdit = true; }
    }

    // loadContact(id): void {
    //   this.contactService.getContact(id)
    // }

    goBack(): void {
      this.location.back();
    }

    edit(): void {
      this.router.navigate([location.pathname, 'edit']);
    }

    save(folder): void {
      console.log('loc: ' + location.pathname);
      this.service.saveFolder(folder);
    }

    delete(folder): void {
      console.log('delete folder: ' + folder.id);
      this.service.deleteFolder(folder);
    }

}
