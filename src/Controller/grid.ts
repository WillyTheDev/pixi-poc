import {Cell} from './cell'
import {Container} from "pixi.js";

export class Grid{
    grid : Cell[][] = []
    constructor(x_cells: number, y_cells: number, sizeOfCells: number) {
        for (var i = 0; i < x_cells; i++){
            for (let j = 0; j < y_cells; j++) {
                let container    = new Container()
                container.position.set(sizeOfCells * i, sizeOfCells * j)
                container.width = sizeOfCells
                container.height = sizeOfCells
                this.grid[i][j] = container
            }
        }
    }

}