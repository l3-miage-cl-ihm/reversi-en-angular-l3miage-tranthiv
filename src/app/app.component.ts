import { ChangeDetectionStrategy, Component, Signal, computed, signal } from '@angular/core';
import { Matrix, initMatrix } from './data/utils';
import { Board, BoardtoString, GameState, TileCoords, Turn, cToString } from './data/reversi.definitions';
import { produce } from 'immer';
import { whereCanPlay } from './data/reversi.game';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent {
  // à compléter
}
