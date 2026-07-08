import { Component, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-housing-location',
  standalone: true,
  imports: [MatToolbarModule, MatButtonModule, MatIconModule],
  templateUrl: './housing-location.component.html',
  styleUrl: './housing-location.component.css'
})
export class HousingLocationComponent implements OnInit, OnChanges {
  constructor() {
    // this.clickMe = true;
  }
  ngOnChanges(changes: SimpleChanges): void {
    throw new Error('Method not implemented.');
  }
  ngOnInit() {
    console.log('zssdfr');
  }

  clickedThis() {
    console.log('heloooerlkeujrklj');
    alert('hello yes');
  }
}
