import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { UtilisateurService } from '../service/utilisateur.service';
import { IUtilisateur, Utilisateur } from '../utilisateur.model';
import { ITheme } from 'app/entities/theme/theme.model';
import { ThemeService } from 'app/entities/theme/service/theme.service';

import { UtilisateurUpdateComponent } from './utilisateur-update.component';

describe('Utilisateur Management Update Component', () => {
  let comp: UtilisateurUpdateComponent;
  let fixture: ComponentFixture<UtilisateurUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let utilisateurService: UtilisateurService;
  let themeService: ThemeService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [UtilisateurUpdateComponent],
      providers: [
        FormBuilder,
        {
          provide: ActivatedRoute,
          useValue: {
            params: from([{}]),
          },
        },
      ],
    })
      .overrideTemplate(UtilisateurUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(UtilisateurUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    utilisateurService = TestBed.inject(UtilisateurService);
    themeService = TestBed.inject(ThemeService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call Theme query and add missing value', () => {
      const utilisateur: IUtilisateur = { id: 456 };
      const theme: ITheme = { id: 55946 };
      utilisateur.theme = theme;

      const themeCollection: ITheme[] = [{ id: 80804 }];
      jest.spyOn(themeService, 'query').mockReturnValue(of(new HttpResponse({ body: themeCollection })));
      const additionalThemes = [theme];
      const expectedCollection: ITheme[] = [...additionalThemes, ...themeCollection];
      jest.spyOn(themeService, 'addThemeToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ utilisateur });
      comp.ngOnInit();

      expect(themeService.query).toHaveBeenCalled();
      expect(themeService.addThemeToCollectionIfMissing).toHaveBeenCalledWith(themeCollection, ...additionalThemes);
      expect(comp.themesSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const utilisateur: IUtilisateur = { id: 456 };
      const theme: ITheme = { id: 98804 };
      utilisateur.theme = theme;

      activatedRoute.data = of({ utilisateur });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(utilisateur));
      expect(comp.themesSharedCollection).toContain(theme);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Utilisateur>>();
      const utilisateur = { id: 123 };
      jest.spyOn(utilisateurService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ utilisateur });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: utilisateur }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(utilisateurService.update).toHaveBeenCalledWith(utilisateur);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Utilisateur>>();
      const utilisateur = new Utilisateur();
      jest.spyOn(utilisateurService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ utilisateur });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: utilisateur }));
      saveSubject.complete();

      // THEN
      expect(utilisateurService.create).toHaveBeenCalledWith(utilisateur);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Utilisateur>>();
      const utilisateur = { id: 123 };
      jest.spyOn(utilisateurService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ utilisateur });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(utilisateurService.update).toHaveBeenCalledWith(utilisateur);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Tracking relationships identifiers', () => {
    describe('trackThemeById', () => {
      it('Should return tracked Theme primary key', () => {
        const entity = { id: 123 };
        const trackResult = comp.trackThemeById(0, entity);
        expect(trackResult).toEqual(entity.id);
      });
    });
  });
});
