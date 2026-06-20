import { Component } from '@angular/core';
import { HousingLocationComponent } from '../housing-location/housing-location.component';
import { HeaderComponent } from '../header/header.component';

@Component({
  selector: 'app-homepage',
  standalone: true,
  imports: [HousingLocationComponent, HeaderComponent],
template: `
    <section>
      <form>
        <input type="text" placeholder="Filter by city" />
        <button class="primary" type="button">Search</button>
      </form>
    </section>
    <section class="results">
      <app-housing-location /><app-header />
    </section>
  `,
  styleUrl: './homepage.component.css'
})
export class HomepageComponent {
  appTitle = 'Crafteez';
  subTitle = 'Crafting all kinds of things';
}
