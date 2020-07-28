import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-input',
  templateUrl: './input.component.html',
  styleUrls: ['./input.component.css',	'../app.component.css']
})
export class InputComponent implements OnInit {

	isAdmin = true;

  constructor() { }

  ngOnInit(): void {
  }

}
