import {SpriteSource} from "@pixi/sprite/lib/Sprite";
import { Sprite, Ticker} from "pixi.js";
import {Easing, Group, Tween} from "tweedle.js";
import {Viewport} from "pixi-viewport";

export class Player {

    private viewPort : Viewport
    private readonly player_sprite : Sprite;
    public uid: number
    private ticker: Ticker
    constructor(img_src: SpriteSource, uid:number, x : number,y: number, viewPort : Viewport ) {
        this.uid = uid
        this.player_sprite = Sprite.from(img_src);
        this.player_sprite.anchor.set(0.5, 0.5);
        this.player_sprite.scale.set(2,2);
        this.player_sprite.position.set(x, y);
        this.player_sprite.eventMode = 'static';
        this.player_sprite.cursor = 'pointer';
        this.ticker = Ticker.shared;
        this.viewPort = viewPort
        this.viewPort.addChild(this.player_sprite)
    }

    public removePlayerFromScene(){
        this.viewPort.removeChild(this.player_sprite)
    }


    /**
     * Moves the player sprite to a new position asynchronously.
     *
     * @param direction - An object containing the x and y coordinates for the new position.
     * @returns A promise that resolves when the movement is complete.
     */
    public async movePlayer(direction: {x:number,y:number}){
        return new Promise((resolve) =>{
            // Create a new tween for the player sprite's position
            new Tween(this.player_sprite.position).to({
                x: direction.x,
                y: direction.y}, 300
            ) // Set the duration of the tween to 300ms
                .easing(Easing.Back.InOut) // Use the Back InOut easing function
                .start() // Start the tween
                .onComplete(()=>{
                    // Normalize the position of the player sprite
                    this.player_sprite.position.set(
                        this.player_sprite.x = Math.round(this.player_sprite.x / 10) * 10,
                        this.player_sprite.y = Math.round(this.player_sprite.y / 10) * 10)
                    console.log(this.player_sprite.position) // Log the new position
                    resolve("moving player is over") // Resolve the promise when the movement is over
                })
            // Define a function to update the shared group
            let tweenfct = () =>{
                Group.shared.update()
            }
            // Add the function to the ticker
            this.ticker.add(tweenfct)
        })
    }

}