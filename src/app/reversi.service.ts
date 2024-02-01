import { Injectable, computed, signal } from '@angular/core';
import { GameState, ReversiModelInterface, TileCoords } from '../app/data/reversi.definitions';
import { initialGameState, tryPlay } from './data/reversi.game';


@Injectable({
  providedIn: 'root'
})
export class ReversiService implements ReversiModelInterface {
  private readonly _sigGameState = signal<GameState>(initialGameState) ;
  public readonly sigGameState = computed<GameState>(
    () => this._sigGameState()
  );

  play(coord: TileCoords): void {
    this._sigGameState.set(
      tryPlay(this.sigGameState(), coord[0], coord[1])
    )
  }

  restart(): void {
    this._sigGameState.set(initialGameState) ;
  }
  

}
