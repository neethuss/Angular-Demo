import { NgIf } from '@angular/common';
import { Component, ElementRef, HostListener, OnInit } from '@angular/core';
import { SettingsService } from '../services/settings.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  standalone:true,
  imports:[NgIf],
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit {

  constructor(private settingsServie:SettingsService, private elementRef:ElementRef) { }

  selectedLanguage:string='en'
  selectedTheme:string='blue'
  isSettingsMenuVisible = false;

  ngOnInit() {
    this.selectedLanguage = this.settingsServie.getLanguageFromLocalStorage();
    this.selectedTheme = this.settingsServie.getThemeFromLocalStorage();
  }

  toggleSettingsMenu() {
    this.isSettingsMenuVisible = !this.isSettingsMenuVisible;
  }

  onLanguageChange(event: any) {
    const selectedLanguage = event.target.value;
    this.settingsServie.setLanguage(selectedLanguage);
    this.selectedLanguage = selectedLanguage
  }

  onThemeChange(event: any) {
    const selectedTheme = event.target.value;
    this.settingsServie.setTheme(selectedTheme);
    this.selectedTheme = selectedTheme
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    const clickedElement = event.target as HTMLElement;
    if (!this.elementRef.nativeElement.contains(clickedElement)) {
      this.isSettingsMenuVisible = false;
    }
  }
}
