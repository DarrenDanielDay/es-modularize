/// <reference path="../global.d.ts" />
import "zone.js";
import { platformBrowserDynamic } from "@angular/platform-browser-dynamic";
import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { AppComponent } from "./app.component";
globalThis.__ESM_LOADED__ = true;

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, CommonModule],
  bootstrap: [AppComponent],
})
class AppModule {}

platformBrowserDynamic()
  .bootstrapModule(AppModule, {
    ngZone: "zone.js",
  })
  .catch(console.error);
