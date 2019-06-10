import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DassCanvasComponent } from './ui-component/canvas/dass-canvas.component';
import { CavasExampleComponent } from './cavas-example/cavas-example.component';

const routes: Routes = [
  //default routing : dashboard...
	{
		path: '',
		redirectTo: '/dass-canvas',
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
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
