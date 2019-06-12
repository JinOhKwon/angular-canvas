import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CavasExampleComponent } from './cavas-example/cavas-example.component';
import { DassCanvasComponent } from './ui-component/canvas/dass-canvas.component';
import { CarouselComponent } from './ui-component/carousel/carousel.component';
import { NgbCarousel } from '@ng-bootstrap/ng-bootstrap';


@NgModule({
  declarations: [
    AppComponent,
    CavasExampleComponent,
    DassCanvasComponent,
    CarouselComponent,
    NgbCarousel
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
