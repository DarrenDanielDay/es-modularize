import { Component, ChangeDetectionStrategy, Inject, ChangeDetectorRef } from "@angular/core";

@Component({
  selector: "app",
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"],
})
export class AppComponent {
  title = "ESModularize Angular Demo";
  count = 0;
  constructor(
    @Inject(ChangeDetectorRef)
    protected readonly cdr: ChangeDetectorRef
  ) {}
  add() {
    this.count++;
    this.cdr.detectChanges();
  }
}
