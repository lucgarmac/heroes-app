export interface IHeroeSearch {
  id: number;
  name: string;
}

export interface IHeroeDetail {
  id: number;
  name: string;
  powerstats: IPowerstat;
  biography: IBiography;
  appearance: IAppearance;
  work: IWork;
  images: IImage;
}

export interface IPowerstat {
  intelligence: number;
  strength: number;
  speed: number;
  durability: number;
  power: number;
  combat: number;
}

export interface IBiography {
  fullName: string;
  alterEgos: string;
  aliases: string[];
  placeOfBirth: string;
  firstAppearance: string;
  publisher: string;
  alignment: string;
}

export interface IAppearance {
  gender: string;
  race: string;
  height: number;
  weight: number;
  eyeColor: string;
  hairColor: string;
}

export interface IWork {
  occupation: string;
  base: string;
}

export interface IImage {
  xs: string;
  sm: string;
  md: string;
  lg: string;
}

export enum EHeroeProperty {
  POWERSTATS = 'powerstats',
  BIO = 'biography',
  APPEARANCE = 'appearance',
  WORK = 'work',
}

export interface IHeroePostRequest extends IPowerstat, IBiography, IAppearance, IWork {
  name: string;
  image: File;
}

export interface IPatchRequest {
  operation: EOperationPatch;
  path: string;
  value: any;
}

export enum EOperationPatch {
  ADD = 'add',
  REMOVE = 'remove',
  REPLACE = 'replace'
}
