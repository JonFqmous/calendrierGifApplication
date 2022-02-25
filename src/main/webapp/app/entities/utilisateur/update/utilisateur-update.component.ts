import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import dayjs from 'dayjs/esm';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';

import { IUtilisateur, Utilisateur } from '../utilisateur.model';
import { UtilisateurService } from '../service/utilisateur.service';
import { ITheme } from 'app/entities/theme/theme.model';
import { ThemeService } from 'app/entities/theme/service/theme.service';

@Component({
  selector: 'jhi-utilisateur-update',
  templateUrl: './utilisateur-update.component.html',
})
export class UtilisateurUpdateComponent implements OnInit {
  isSaving = false;

  themesSharedCollection: ITheme[] = [];

  editForm = this.fb.group({
    id: [],
    nom: [],
    prenom: [],
    nbPoint: [],
    dateHeureInscription: [],
    email: [],
    theme: [],
  });

  constructor(
    protected utilisateurService: UtilisateurService,
    protected themeService: ThemeService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ utilisateur }) => {
      if (utilisateur.id === undefined) {
        const today = dayjs().startOf('day');
        utilisateur.dateHeureInscription = today;
      }

      this.updateForm(utilisateur);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const utilisateur = this.createFromForm();
    if (utilisateur.id !== undefined) {
      this.subscribeToSaveResponse(this.utilisateurService.update(utilisateur));
    } else {
      this.subscribeToSaveResponse(this.utilisateurService.create(utilisateur));
    }
  }

  trackThemeById(index: number, item: ITheme): number {
    return item.id!;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IUtilisateur>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe({
      next: () => this.onSaveSuccess(),
      error: () => this.onSaveError(),
    });
  }

  protected onSaveSuccess(): void {
    this.previousState();
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  protected updateForm(utilisateur: IUtilisateur): void {
    this.editForm.patchValue({
      id: utilisateur.id,
      nom: utilisateur.nom,
      prenom: utilisateur.prenom,
      nbPoint: utilisateur.nbPoint,
      dateHeureInscription: utilisateur.dateHeureInscription ? utilisateur.dateHeureInscription.format(DATE_TIME_FORMAT) : null,
      email: utilisateur.email,
      theme: utilisateur.theme,
    });

    this.themesSharedCollection = this.themeService.addThemeToCollectionIfMissing(this.themesSharedCollection, utilisateur.theme);
  }

  protected loadRelationshipsOptions(): void {
    this.themeService
      .query()
      .pipe(map((res: HttpResponse<ITheme[]>) => res.body ?? []))
      .pipe(map((themes: ITheme[]) => this.themeService.addThemeToCollectionIfMissing(themes, this.editForm.get('theme')!.value)))
      .subscribe((themes: ITheme[]) => (this.themesSharedCollection = themes));
  }

  protected createFromForm(): IUtilisateur {
    return {
      ...new Utilisateur(),
      id: this.editForm.get(['id'])!.value,
      nom: this.editForm.get(['nom'])!.value,
      prenom: this.editForm.get(['prenom'])!.value,
      nbPoint: this.editForm.get(['nbPoint'])!.value,
      dateHeureInscription: this.editForm.get(['dateHeureInscription'])!.value
        ? dayjs(this.editForm.get(['dateHeureInscription'])!.value, DATE_TIME_FORMAT)
        : undefined,
      email: this.editForm.get(['email'])!.value,
      theme: this.editForm.get(['theme'])!.value,
    };
  }
}
