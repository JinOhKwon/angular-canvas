import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CavasExampleComponent } from './cavas-example/cavas-example.component';
import { DassCanvasComponent } from './ui-component/canvas/dass-canvas.component';
import { PrintComponent } from './ui-component/print/print.component';


@NgModule({
  declarations: [
    AppComponent,
    CavasExampleComponent,
    DassCanvasComponent,
    PrintComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
