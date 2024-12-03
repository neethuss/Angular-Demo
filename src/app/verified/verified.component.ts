import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-verified',
  standalone: true,
  imports: [TranslateModule],
  templateUrl: './verified.component.html',
  styleUrl: './verified.component.css'
})
export class VerifiedComponent {

  lang: string = 'en';
  theme:string='blue'

  constructor(private router:Router, private activatedRoute:ActivatedRoute){

  }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe((params) => {
      this.lang = params['lang'] || 'en';
      this.theme = params['theme'] || 'blue'
      console.log('Language in LoginComponent:', this.lang);
    });
  }
  onclick(){
    this.router.navigate([`${this.lang}/${this.theme}/login`])
  }
}
