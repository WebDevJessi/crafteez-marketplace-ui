import { NgFor } from '@angular/common';
import { Component } from '@angular/core';
import { IGX_CAROUSEL_DIRECTIVES, IgxCarouselModule, IgxIconComponent, IgxIconModule } from 'igniteui-angular';

@Component({
  selector: 'app-homepage',
  standalone: true,
  imports: [IgxCarouselModule, IGX_CAROUSEL_DIRECTIVES, NgFor, IgxIconComponent, IgxIconModule],
templateUrl: './homepage.component.html',
  styleUrl: './homepage.component.css'
})
export class HomepageComponent {
  appTitle = 'Crafteez';
  subTitle = 'Crafting all kinds of things';
  currentBackground = "url('assets/background.jpg')";
  public slides = [
    { src: '/assets/ceramic.jpg' },
    { src: '/assets/sticker.jpg' },
    { src: '/assets/star.svg' },
  ]
}
