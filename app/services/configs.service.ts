import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ConfigsService {

  constructor() { }

  public isCar: boolean;
  public music: boolean;
  public sound: boolean = true;
  public voltou: boolean;
  public veiculo: string;

  
}
