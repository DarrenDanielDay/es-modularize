import { __decorate, __metadata, __param } from "tslib";
import { Component, ChangeDetectionStrategy, Inject, ChangeDetectorRef } from "@angular/core";
let AppComponent = class AppComponent {
    constructor(cdr) {
        this.cdr = cdr;
        this.title = "ESModularize Angular Demo";
        this.count = 0;
    }
    add() {
        this.count++;
        this.cdr.detectChanges();
    }
};
AppComponent = __decorate([
    Component({
        selector: "app",
        changeDetection: ChangeDetectionStrategy.OnPush,
        templateUrl: "./app.component.html",
        styleUrls: ["./app.component.css"],
    }),
    __param(0, Inject(ChangeDetectorRef)),
    __metadata("design:paramtypes", [ChangeDetectorRef])
], AppComponent);
export { AppComponent };
//# sourceMappingURL=app.component.js.map