
import { computed, Injectable, signal, Signal } from '@angular/core';
import { GameState, ReversiModelInterface, TileCoords } from './data/reversi.definitions';
import { initialGameState, tryPlay } from './data/reversi.game';

@Injectable({
  providedIn: 'root'
})
export class ReversiService implements ReversiModelInterface {

  private readonly _sigGameState;
  public readonly sigGameState;

  constructor() { 
    this._sigGameState = signal(initialGameState);
    this.sigGameState = computed( () => this._sigGameState() );
  }

  play(coord: TileCoords): void {
    this._sigGameState.set(tryPlay(this.sigGameState(), coord[0], coord[1]));
  }
  restart(): void {
    this._sigGameState.set(initialGameState);
  }
}
