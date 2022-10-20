import { platformBrowserDynamic } from "@angular/platform-browser-dynamic";
import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { AppComponent } from "./app.component";

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, CommonModule],
  bootstrap: [AppComponent],
})
class AppModule {}

platformBrowserDynamic()
  .bootstrapModule(AppModule, {
    ngZone: "noop",
  })
  .catch(console.error);
