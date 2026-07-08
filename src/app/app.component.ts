import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HomepageComponent } from "./homepage/homepage.component";
import { ProductListComponent } from "./product-list/product-list.component";
import { HousingLocationComponent } from "./housing-location/housing-location.component";
import { HeaderComponent } from "./header/header.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [HomepageComponent, ProductListComponent, HousingLocationComponent, HeaderComponent],
   templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'crafteez-marketplace-ui';
}
