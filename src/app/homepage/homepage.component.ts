import { NgFor, NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { IGX_CAROUSEL_DIRECTIVES, IgxCarouselModule, IgxIconComponent, IgxIconModule, IgxCardActionsComponent } from 'igniteui-angular';

@Component({
  selector: 'app-homepage',
  standalone: true,
  imports: [IgxCarouselModule, IGX_CAROUSEL_DIRECTIVES, NgFor, NgIf, IgxIconComponent, IgxIconModule, IgxCardActionsComponent],
  templateUrl: './homepage.component.html',
  styleUrl: './homepage.component.css'
})
export class HomepageComponent {
  appTitle = 'Crafteez';
  subTitle = 'Crafting all kinds of things';
  currentBackground = "url('assets/background.jpg')";
  public slides = [
    { src: '/assets/paint-cat.mp4', type: 'video' },
    { src: '/assets/stationery-display.jpg', type: 'image' },
    { src: '/assets/painting-example.jpg', type: 'image' },
    { src: '/assets/stationery-craft.jpg', type: 'image' },
  ];
}
