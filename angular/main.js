import { __decorate } from "tslib";
import "zone.js";
import { platformBrowserDynamic } from "@angular/platform-browser-dynamic";
import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { AppComponent } from "./app.component.js";
globalThis.__ESM_LOADED__ = true;
let AppModule = class AppModule {
};
AppModule = __decorate([
    NgModule({
        declarations: [AppComponent],
        imports: [BrowserModule, CommonModule],
        bootstrap: [AppComponent],
    })
], AppModule);
platformBrowserDynamic()
    .bootstrapModule(AppModule, {
    ngZone: "zone.js",
})
    .catch(console.error);
//# sourceMappingURL=main.js.map