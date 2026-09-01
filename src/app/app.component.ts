import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CartComponent } from "./cart/cart.component";
import { HeaderComponent } from "./header/header.component";
import { HomepageComponent } from "./homepage/homepage.component";
import { CrudService } from "./crud.service";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [ CartComponent, HeaderComponent, RouterModule, HomepageComponent],
   templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {

  constructor(private crud:CrudService){}

  title = 'crafteez-marketplace-ui';

  ngOnInit() {
    this.crud.checkConnection().subscribe((data) => {
      console.log(data);
    });
  }
}

