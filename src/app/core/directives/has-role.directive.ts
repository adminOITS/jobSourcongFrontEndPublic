import {
  Directive,
  Input,
  TemplateRef,
  ViewContainerRef,
  OnInit,
  OnDestroy,
  inject,
  effect,
} from '@angular/core';
import { AuthService } from '../services/auth/auth.service';

@Directive({
  selector: '[appHasRole]',
  standalone: true,
})
export class HasRoleDirective implements OnInit, OnDestroy {
  @Input('appHasRole') roles!: string | string[];
  private hasView = false;

  private templateRef = inject(TemplateRef<any>);
  private viewContainer = inject(ViewContainerRef);
  private authService = inject(AuthService);

  constructor() {
    effect(() => {
      const user = this.authService.currentUser();
      if (!user) {
        this.viewContainer.clear();
        this.hasView = false;
        return;
      }

      const userRoles = user.roles;

      const requiredRoles = Array.isArray(this.roles)
        ? this.roles
        : [this.roles];

      const hasRequiredRole = requiredRoles.some((role) =>
        userRoles.includes(role)
      );

      if (hasRequiredRole && !this.hasView) {
        this.viewContainer.createEmbeddedView(this.templateRef);
        this.hasView = true;
      } else if (!hasRequiredRole && this.hasView) {
        this.viewContainer.clear();
        this.hasView = false;
      }
    });
  }

  ngOnInit() {}

  ngOnDestroy() {}
}
