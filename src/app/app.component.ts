import { ChangeDetectionStrategy, Component, Signal, computed, signal } from '@angular/core';
import { BoardtoString, TileCoords } from './data/reversi.definitions';
import { whereCanPlay } from './data/reversi.game';
import { IntRange } from './data/utils';
import { ReversiService } from './reversi.service';
import { produce } from 'immer';
import { initMatrix } from './data/utils';
import { GameState, Turn } from './data/reversi.definitions';
import { Matrix } from './data/utils';

export interface GameStateAll {
  readonly gameState: GameState;
  readonly listPlayable: readonly TileCoords[];
  readonly isPlayable: Matrix<boolean, 8, 8>;
  readonly scores: Readonly<{ Player1: number, Player2: number }>;
  readonly boardString: string;
  readonly winner: undefined | "Drawn" | Turn;
}


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent {
  // Publie des string qui représente le plateau de jeu
  readonly strBoard: Signal<string>;  
  readonly coupsPossibles: Signal<readonly TileCoords[]>;
  //readonly scores: Signal<{ Player1: number, Player2: number }>;
  
  strCoord: string = '';
  //une liste contient X: Player1 et O: Player2.
  readonly jouers = signal(['X:Player1', 'O:Player2']);
  readonly index = signal(0);
  readonly nextJoueur = () => this.index.set((this.index() + 1) % 2);
  readonly joueurCourant = computed(() => this.jouers()[this.index()]);
  
  

   constructor(private S: ReversiService) {
    this.strBoard = computed(
      () => BoardtoString( S.sigGameState().board )
    )

    this.coupsPossibles = computed(
      () => whereCanPlay( S.sigGameState() )
    )

  }

  playAt(c: TileCoords): void {
    this.S.play(c);
  }

  playAtCoord(coord: string): void {
    const [line, column] = coord.split(',').map( c => parseInt(c) as IntRange<0, 8> );
    if (Number.isInteger(line) && Number.isInteger(column)) {
      this.S.play([line, column]);
    }
  }
  

  public sigGameStateAll = computed<GameStateAll>(
    () => {
    const gameState = this.S.sigGameState();
     const listPlayable = whereCanPlay(gameState);
    
     const isPlayable = produce(initMatrix(() => false, 8, 8), draft => {
        listPlayable.forEach( ([i, j]) => {
          draft[i][j] = true;
        });
     });
      
     const scores = (() => {
        let Player1 = 0;
        let Player2 = 0;
        gameState.board.forEach( line => line.forEach( c => {
          if (c === 'Player1') Player1++;
          if (c === 'Player2') Player2++;
        }));
        return { Player1, Player2 };
     }
     )();
      
      const boardString = BoardtoString(gameState.board);

      const winner = (() => {
        if (listPlayable.length === 0) {
          if (scores.Player1 > scores.Player2) return 'Player1';
          if (scores.Player1 < scores.Player2) return 'Player2';
          return 'Drawn';
        }
        return undefined;
      })();
      return { gameState, listPlayable, isPlayable, scores, boardString, winner };
    }
  );

  
  
}