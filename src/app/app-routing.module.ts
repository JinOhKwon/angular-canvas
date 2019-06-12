import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DassCanvasComponent } from './ui-component/canvas/dass-canvas.component';
import { CavasExampleComponent } from './cavas-example/cavas-example.component';
import { CarouselComponent } from './ui-component/carousel/carousel.component';

const routes: Routes = [
  //default routing : dashboard...
	{
		path: '',
		redirectTo: '/carousel',
		pathMatch: 'full'
  },
  {
		path: 'dass-canvas',
		component: DassCanvasComponent,
		data: { title: '공통 캔버스' }
	},
  {
		path: 'canvas-example',
		component: CavasExampleComponent,
		data: { title: '캔버스 예제' }
	},
  {
		path: 'carousel',
		component: CarouselComponent,
		data: { title: '카로셀 예제' }
	},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
