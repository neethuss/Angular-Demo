import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router'; //function used to configure application routing on defined routes
import { provideHttpClient } from '@angular/common/http'; //function sets up HTTP services for making requests to APIs
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
//ngx-translate core modules to enable internationalization (i18n) in the application.
//TranslateModule for translation setup, TranslateLoader for custom loaders
import { TranslateHttpLoader } from '@ngx-translate/http-loader';//used to fetch translation JSON files from a server or file system
import { HttpClient } from '@angular/common/http';//module enables HTTP operations for requesting translation files or APIs


import { routes } from './app.routes';
import { ToastrModule } from 'ngx-toastr';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

//Factory function to create a TranslateHttpLoader instance.loader fetches translation files from the ./assets/i18n/ directory with a .json extension
export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}


export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(),
    importProvidersFrom(
      TranslateModule.forRoot({
        loader: {
          provide: TranslateLoader,
          useFactory: HttpLoaderFactory,
          deps: [HttpClient]
        }
      }),
      ToastrModule.forRoot({
        timeOut: 3000,
        positionClass: 'toast-top-right',
        preventDuplicates: true,
      }),
      BrowserAnimationsModule 
    )
  ]
};