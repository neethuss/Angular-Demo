import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { TranslateService } from "@ngx-translate/core";

@Injectable({
  providedIn:'root'
})

export class SettingsService{
  constructor(private translate:TranslateService, private router: Router){}

  getLanguageFromLocalStorage(){
    return localStorage.getItem('language') as string
  }

  getThemeFromLocalStorage(){
    return localStorage.getItem('theme') as string
  }

  getLanguageFromUrl(): string {
    const url = window.location.pathname;
    console.log('Current URL:', url);
    const match = url.match(/^\/([a-z]{2})\//);
    return match ? match[1] : 'en';
  }

  getThemeFromUrl(): string {
    const url = window.location.pathname;
    if (url.includes('/blue')) {
      return 'blue';
    } else if (url.includes('/green')) {
      return 'green';
    } else {
      return 'blue';
    }
  }

  setLanguage(lang: string) {
    this.translate.setDefaultLang('en');
    this.translate.use(lang);
    localStorage.setItem('language', lang);

    const theme = this.getThemeFromLocalStorage() || this.getThemeFromUrl();
    document.documentElement.setAttribute('dir', lang === 'ar' ? 'rtl' : 'ltr');
    this.updateUrl(lang, theme);
  }

  setTheme(theme: string) {
    document.body.classList.remove('blue-theme', 'green-theme');
    document.body.classList.add(`${theme}-theme`);
    localStorage.setItem('theme', theme);

    const lang = this.getLanguageFromLocalStorage() || this.getLanguageFromUrl();
    this.updateUrl(lang, theme);
  }

  updateUrl(lang: string, theme: string) {
    const currentUrl = window.location.pathname;
    const newUrl = currentUrl.replace(/^\/[a-z]{2}\/[^\/]+/, `/${lang}/${theme}`);
    this.router.navigateByUrl(newUrl);
  }

  applySettingsFromLocalStorage() {
    const lang = this.getLanguageFromLocalStorage() || 'en';
    const theme = this.getThemeFromLocalStorage() || 'blue';
    this.setTheme(theme);
    this.setLanguage(lang);
  }
}