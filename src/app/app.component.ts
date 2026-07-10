import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { HousingLocationComponent } from "./housing-location/housing-location.component";
import { HeaderComponent } from "./header/header.component";
import { HomepageComponent } from "./homepage/homepage.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [ HousingLocationComponent, HeaderComponent, RouterModule, HomepageComponent],
   templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'crafteez-marketplace-ui';
}
