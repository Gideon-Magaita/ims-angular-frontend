import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, GuardResult, MaybeAsync, Router, RouterStateSnapshot } from '@angular/router';
import { Api } from './api';

@Injectable({
  providedIn: 'root',
})
export class Guard implements CanActivate {

  constructor(
    private api:Api,
    private router:Router){}

    canActivate(
      route: ActivatedRouteSnapshot,
      state: RouterStateSnapshot):
      boolean {

        const requiresAdmin = route.data['requiresAdmin'] || false;

        if (requiresAdmin){
          if(this.api.isAdmin()){
            return true;
          }else{
            this.router.navigate(['/login'],{
              queryParams:{returnUrl:state.url}
            });
            return false;
          }
        }else{
          if (this.api.isAuthenticated()){
            return true;
          }else{
            this.router.navigate(['/login'],{
              queryParams:{returnUrl:state.url}
            });
            return false;//deny access
          }
        }
    }
}
