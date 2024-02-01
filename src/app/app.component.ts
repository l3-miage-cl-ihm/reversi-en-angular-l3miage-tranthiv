import { ChangeDetectionStrategy, Component, Signal, computed, signal } from '@angular/core';
import { BoardtoString, TileCoords } from './data/reversi.definitions';
import { whereCanPlay } from './data/reversi.game';
import { IntRange } from './data/utils';
import { ReversiService } from './reversi.service';



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
  strCoord: string = '';
  //une liste contient X: Player1 et O: Player2.
  readonly jouers = signal(['X:Player1', 'O:Player2']);
  readonly index = signal(0);
  readonly joueurCourant = computed(() => this.jouers()[this.index()]);
  readonly nextJoueur = () => this.index.set((this.index() + 1) % 2);
  



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
  
  
  
}