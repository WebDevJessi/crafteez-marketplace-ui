import { Routes } from '@angular/router';
import { HomepageComponent } from './homepage/homepage.component';
import { ProductCardComponent } from './product-card/product-card.component';
import { ProductListComponent } from './product-list/product-list.component';
import { CartComponent } from './cart/cart.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { AboutComponent } from './about/about.component';

export const routes: Routes = [
  {
    path: '',
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
    path: 'cart',
    component: CartComponent,
  },
    {
    path: 'about',
    component: AboutComponent,
  }
];
