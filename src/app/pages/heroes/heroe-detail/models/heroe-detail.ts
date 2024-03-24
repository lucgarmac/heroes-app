export interface IPowerstatsForm {
  intelligence: number;
  strength: number;
  speed: number;
  durability: number;
  power: number;
  combat: number;
}

export interface IBioForm {
  fullName: string;
  alterEgos: string;
  placeBirth: string;
  firstAppearance: string;
  publisher: string;
  alignment: string;
  aliases: string[];
}

export interface IAppearanceForm {
  gender: string;
  race: string;
  height: number;
  weight: number;
  eyeColor: string;
  hairColor: string;
}
