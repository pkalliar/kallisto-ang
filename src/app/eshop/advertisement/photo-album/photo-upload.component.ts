import { Component, OnInit, Input, NgZone, Output, EventEmitter } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FileUploader, FileUploaderOptions, ParsedResponseHeaders } from 'ng2-file-upload';
import { Cloudinary } from '@cloudinary/angular-5.x';

@Component({
  selector: 'photo-upload',
  templateUrl: 'photo-upload.component.html',
  styleUrls: ['photo-upload.component.css']
})
export class PhotoUploadComponent implements OnInit {

  @Input()
  responses: Array<any>;

  @Input() uploadPath = true;

  @Output() uploaded = new EventEmitter<Object>();

  public hasBaseDropZoneOver = false;
  public uploader: FileUploader;
  private title: string;

  constructor(
    private cloudinary: Cloudinary,
    private zone: NgZone,
    private http: HttpClient
  ) {
    this.responses = [];
    this.title = '';
  }

  ngOnInit(): void {
    // Create the file uploader, wire it to upload to your account
    const uploaderOptions: FileUploaderOptions = {
      url: `https://api.cloudinary.com/v1_1/${this.cloudinary.config().cloud_name}/upload`,
      // Upload files automatically upon addition to upload queue
      autoUpload: true,
      // Use xhrTransport in favor of iframeTransport
      isHTML5: true,
      // Calculate progress independently for each uploaded file
      removeAfterUpload: true,
      // XHR request headers
      headers: [
        {
          name: 'X-Requested-With',
          value: 'XMLHttpRequest'
        }
      ]
    };
    this.uploader = new FileUploader(uploaderOptions);

    this.uploader.onBuildItemForm = (fileItem: any, form: FormData): any => {
      // Add Cloudinary's unsigned upload preset to the upload form
      form.append('upload_preset', this.cloudinary.config().upload_preset);
      // Add built-in and custom tags for displaying the uploaded photo in the list
      let tags = `advertisements,${this.uploadPath}`;
      if (this.title) {
        form.append('context', `photo=${this.title}`);
        tags = `advertisements,${this.uploadPath},${this.title}`;
      }
      // Upload to a custom folder
      // Note that by default, when uploading via the API, folders are not automatically created in your Media Library.
      // In order to automatically create the folders based on the API requests,
      // please go to your account upload settings and set the 'Auto-create folders' option to enabled.
      form.append('folder', 'advertisements/' + this.uploadPath );
      // Add custom tags
      form.append('tags', tags);
      // Add file to upload
      form.append('file', fileItem);

      // const eager =  [
      //   { width: 400, height: 300,
      //       crop: 'pad' },
      //   { width: 260, height: 200,
      //           crop: 'crop', gravity: 'north'} ];

      // form.append('eager', JSON.stringify(eager));



      // Use default "withCredentials" value for CORS requests
      fileItem.withCredentials = false;

      return { fileItem, form };
    };

    // Insert or update an entry in the responses array
    const upsertResponse = fileItem => {



      // Run the update in a custom zone since for some reason change detection isn't performed
      // as part of the XHR request to upload the files.
      // Running in a custom zone forces change detection
      this.zone.run(() => {
        // Update an existing entry if it's upload hasn't completed yet

        // Find the id of an existing item
        const existingId = this.responses.reduce((prev, current, index) => {
          if (current.file.name === fileItem.file.name && !current.status) {
            return index;
          }
          return prev;
        }, -1);
        if (existingId > -1) {
          // Update existing item with new data
          this.responses[existingId] = Object.assign(this.responses[existingId], fileItem);
        } else {
          // Create new response
          this.responses.push(fileItem);
        }
        this.uploaded.emit(this.responses);
      });

     };

    // Update model on completion of uploading a file
    this.uploader.onCompleteItem = (item: any, response: string, status: number, headers: ParsedResponseHeaders) => {

      const resp = JSON.parse(response);
      upsertResponse(
        {
          file: item.file,
          status,
          data: resp
        }
      );
      console.log(resp);
      // document.getElementById('img_1').setAttribute('src', resp.secure_url);

    };



    // Update model on upload progress event
    this.uploader.onProgressItem = (fileItem: any, progress: any) => {
      upsertResponse(
        {
          file: fileItem.file,
          progress,
          data: {}
        }
      );
    };
  }

  updateTitle(value: string) {
    this.title = value;
  }

  // Delete an uploaded image
  // Requires setting "Return delete token" to "Yes" in your upload preset configuration
  // See also https://support.cloudinary.com/hc/en-us/articles/202521132-How-to-delete-an-image-from-the-client-side-
  deleteImage = function (data: any, index: number) {
    const url = `https://api.cloudinary.com/v1_1/${this.cloudinary.config().cloud_name}/delete_by_token`;
    const headers = new Headers({ 'Content-Type': 'application/json', 'X-Requested-With': 'XMLHttpRequest' });
    const options = { headers: headers };
    const body = {
      token: data.delete_token
    };
    this.http.post(url, body, options).subscribe(response => {
      console.log(`Deleted image - ${data.public_id} ${response.result}`);
      // Remove deleted item for responses
      this.responses.splice(index, 1);
    });
  };

  fileOverBase(e: any): void {
    this.hasBaseDropZoneOver = e;
  }

  getFileProperties(fileProperties: any) {
    // Transforms Javascript Object to an iterable to be used by *ngFor
    if (!fileProperties) {
      return null;
    }

    if (fileProperties['secure_url']) {
      console.log('the download url is ' + fileProperties['secure_url']);
        document.getElementById('img_1').setAttribute('src', fileProperties['secure_url']);
    }

    return Object.keys(fileProperties)
      .map((key) => ({ 'key': key, 'value': fileProperties[key] }));
  }
}
