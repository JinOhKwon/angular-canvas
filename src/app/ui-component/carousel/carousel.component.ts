import { Component, OnInit } from '@angular/core';
import { NgbCarouselConfig } from '@ng-bootstrap/ng-bootstrap';

@Component({
	selector: 'carousel',
	templateUrl: './carousel.component.html',
	styleUrls: ['./carousel.component.scss']
})
export class CarouselComponent implements OnInit {
	showNavigationArrows = false;
	showNavigationIndicators = false;
	images =[
		{
			id: 1,
			url: `https://picsum.photos/900/500?random&t=${Math.random()}`
		},
		{
			id: 2,
			url: `https://picsum.photos/900/500?random&t=${Math.random()}`
		},
		{
			id: 3,
			url: `https://picsum.photos/900/500?random&t=${Math.random()}`
		}
	];


	constructor(config: NgbCarouselConfig) {
		// customize default values of carousels used by this component tree
		config.showNavigationArrows = true;
		config.showNavigationIndicators = true;

	}

	ngOnInit() {
	}

}
