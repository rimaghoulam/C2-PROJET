// import {WS_LINK} from '../../../globals.js'


// export default class UploadAdapter {
//   constructor( loader ) {
//       // The file loader instance to use during the upload.
//       this.loader = loader;
//   }

//   // Starts the upload process.
//   upload() {
//     return this.loader.file
//         .then( file => new Promise( ( resolve, reject ) => {
//             this._initRequest();
//             this._initListeners( resolve, reject, file );
//             this._sendRequest( file );
//         } ) );
// }

// // Aborts the upload process.
// abort() {
//     if ( this.xhr ) {
//         this.xhr.abort();
//     }
// }

// _initRequest() {
//   const xhr = this.xhr = new XMLHttpRequest();

//   // Note that your request may look different. It is up to you and your editor
//   // integration to choose the right communication channel. This example uses
//   // a POST request with JSON as a data structure but your configuration
//   // could be different.
//   xhr.open( 'POST', `${WS_LINK}upload_image`, true );
//   xhr.responseType = 'json';
// }
// }