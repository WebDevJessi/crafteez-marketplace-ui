import { Routes } from '@angular/router';
import { HomepageComponent } from './homepage/homepage.component';
import { ProductCardComponent } from './product-card/product-card.component';
import { ProductListComponent } from './product-list/product-list.component';
import { HousingLocationComponent } from './housing-location/housing-location.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';

export const routes: Routes = [
  {
    path: 'home',
    component: HomepageComponent,
    title: 'Home Page',
  },
  {
    path: 'product-card',
    component: ProductCardComponent,
  },
  {
    path: 'app-product-list',
    component: ProductListComponent,
  },
  {
    path: 'housing',
    component: HousingLocationComponent,
  }
];
