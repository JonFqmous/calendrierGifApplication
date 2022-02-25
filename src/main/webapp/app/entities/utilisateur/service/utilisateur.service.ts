import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import dayjs from 'dayjs/esm';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IUtilisateur, getUtilisateurIdentifier } from '../utilisateur.model';

export type EntityResponseType = HttpResponse<IUtilisateur>;
export type EntityArrayResponseType = HttpResponse<IUtilisateur[]>;

@Injectable({ providedIn: 'root' })
export class UtilisateurService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/utilisateurs');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(utilisateur: IUtilisateur): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(utilisateur);
    return this.http
      .post<IUtilisateur>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  update(utilisateur: IUtilisateur): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(utilisateur);
    return this.http
      .put<IUtilisateur>(`${this.resourceUrl}/${getUtilisateurIdentifier(utilisateur) as number}`, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  partialUpdate(utilisateur: IUtilisateur): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(utilisateur);
    return this.http
      .patch<IUtilisateur>(`${this.resourceUrl}/${getUtilisateurIdentifier(utilisateur) as number}`, copy, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<IUtilisateur>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map((res: EntityResponseType) => this.convertDateFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<IUtilisateur[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map((res: EntityArrayResponseType) => this.convertDateArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addUtilisateurToCollectionIfMissing(
    utilisateurCollection: IUtilisateur[],
    ...utilisateursToCheck: (IUtilisateur | null | undefined)[]
  ): IUtilisateur[] {
    const utilisateurs: IUtilisateur[] = utilisateursToCheck.filter(isPresent);
    if (utilisateurs.length > 0) {
      const utilisateurCollectionIdentifiers = utilisateurCollection.map(utilisateurItem => getUtilisateurIdentifier(utilisateurItem)!);
      const utilisateursToAdd = utilisateurs.filter(utilisateurItem => {
        const utilisateurIdentifier = getUtilisateurIdentifier(utilisateurItem);
        if (utilisateurIdentifier == null || utilisateurCollectionIdentifiers.includes(utilisateurIdentifier)) {
          return false;
        }
        utilisateurCollectionIdentifiers.push(utilisateurIdentifier);
        return true;
      });
      return [...utilisateursToAdd, ...utilisateurCollection];
    }
    return utilisateurCollection;
  }

  protected convertDateFromClient(utilisateur: IUtilisateur): IUtilisateur {
    return Object.assign({}, utilisateur, {
      dateHeureInscription: utilisateur.dateHeureInscription?.isValid() ? utilisateur.dateHeureInscription.toJSON() : undefined,
    });
  }

  protected convertDateFromServer(res: EntityResponseType): EntityResponseType {
    if (res.body) {
      res.body.dateHeureInscription = res.body.dateHeureInscription ? dayjs(res.body.dateHeureInscription) : undefined;
    }
    return res;
  }

  protected convertDateArrayFromServer(res: EntityArrayResponseType): EntityArrayResponseType {
    if (res.body) {
      res.body.forEach((utilisateur: IUtilisateur) => {
        utilisateur.dateHeureInscription = utilisateur.dateHeureInscription ? dayjs(utilisateur.dateHeureInscription) : undefined;
      });
    }
    return res;
  }
}
