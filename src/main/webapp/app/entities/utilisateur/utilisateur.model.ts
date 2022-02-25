import dayjs from 'dayjs/esm';
import { ITheme } from 'app/entities/theme/theme.model';

export interface IUtilisateur {
  id?: number;
  nom?: string | null;
  prenom?: string | null;
  nbPoint?: number | null;
  dateHeureInscription?: dayjs.Dayjs | null;
  email?: string | null;
  theme?: ITheme | null;
}

export class Utilisateur implements IUtilisateur {
  constructor(
    public id?: number,
    public nom?: string | null,
    public prenom?: string | null,
    public nbPoint?: number | null,
    public dateHeureInscription?: dayjs.Dayjs | null,
    public email?: string | null,
    public theme?: ITheme | null
  ) {}
}

export function getUtilisateurIdentifier(utilisateur: IUtilisateur): number | undefined {
  return utilisateur.id;
}
