import { CanDeactivateFn } from '@angular/router';
import { CanComponentDeactivate } from '../models/guard';

export const canDeactiveGuard: CanDeactivateFn<CanComponentDeactivate> = (
  component: CanComponentDeactivate
) => component.canDeactivate ? component.canDeactivate() : true;

