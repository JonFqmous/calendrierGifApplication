export interface ITheme {
  id?: number;
  nom?: string | null;
}

export class Theme implements ITheme {
  constructor(public id?: number, public nom?: string | null) {}
}

export function getThemeIdentifier(theme: ITheme): number | undefined {
  return theme.id;
}
