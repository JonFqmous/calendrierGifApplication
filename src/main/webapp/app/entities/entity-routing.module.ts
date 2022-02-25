import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'utilisateur',
        data: { pageTitle: 'calendrierGifApplicationApp.utilisateur.home.title' },
        loadChildren: () => import('./utilisateur/utilisateur.module').then(m => m.UtilisateurModule),
      },
      {
        path: 'theme',
        data: { pageTitle: 'calendrierGifApplicationApp.theme.home.title' },
        loadChildren: () => import('./theme/theme.module').then(m => m.ThemeModule),
      },
      /* jhipster-needle-add-entity-route - JHipster will add entity modules routes here */
    ]),
  ],
})
export class EntityRoutingModule {}
