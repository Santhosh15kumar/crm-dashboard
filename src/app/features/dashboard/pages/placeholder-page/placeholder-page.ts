import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-placeholder-page',
  standalone: true,
  templateUrl: './placeholder-page.html',
  styleUrl: './placeholder-page.scss',
})
export class PlaceholderPage {
  private readonly route = inject(ActivatedRoute);
  readonly pageTitle = this.route.snapshot.data['pageTitle'] as string;
  protected readonly description = this.route.snapshot.data['description'] as string;
}
