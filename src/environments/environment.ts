// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  production: false,
  // apiurl : 'https://kallisto-backend.herokuapp.com',
  apiurl : 'http://127.0.0.1:9000',
  firebase: {
    apiKey: 'AIzaSyBJ0SwPMbbakEGHG1YV1xKb9q_gjxpVkog',
    authDomain: 'pankal-e7786.firebaseapp.com',
    databaseURL: 'https://pankal-e7786.firebaseio.com',
    projectId: 'pankal-e7786',
    storageBucket: 'pankal-e7786.appspot.com',
    messagingSenderId: '138882110784'
   }

};
