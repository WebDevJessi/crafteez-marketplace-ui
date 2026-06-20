import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HomepageComponent } from "./homepage/homepage.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [HomepageComponent],
   template: `
    <main>
      <header class="brand-name">
        <img class="brand-logo" src="../assets/star.svg" alt="log" aria-hidden="true" />
      </header>
      <section class="content">
        <app-homepage />
      </section>
    </main>
  `,
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'crafteez-marketplace-ui';
}
