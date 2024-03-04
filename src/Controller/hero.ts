"use strict";
import {Application, Sprite, Ticker} from "pixi.js";
import {SpriteSource} from "@pixi/sprite/lib/Sprite";
import {Socket} from "socket.io-client";
import {Easing, Group, Tween} from "tweedle.js";
import {Viewport} from "pixi-viewport";


export class Hero {

    private readonly player_sprite : Sprite;
    public uid: number
    private ticker: Ticker
    private STEP_SIZE : number = 50
    private socket: Socket
    private isMoving : boolean = false

    constructor(img_src: SpriteSource, app : Application<HTMLCanvasElement>, socket: Socket, viewPort : Viewport) {
        this.uid = Math.floor(Math.random()*100)
        this.socket = socket;
        this.player_sprite = Sprite.from(img_src);
        this.player_sprite.anchor.set(0.5, 0.5);
        this.player_sprite.scale.set(2,2);
        this.player_sprite.position.set(app.screen.width / 2, app.screen.height / 2);
        this.player_sprite.eventMode = 'static';
        this.player_sprite.cursor = 'pointer';
        document.addEventListener("keydown", this.onKeyDown.bind(this));
        viewPort.addChild(this.player_sprite)
        socket.emit("new player", {uid: this.uid, x: this.player_sprite.x,y: this.player_sprite.y})
        this.ticker = Ticker.shared;
        viewPort.follow(this.player_sprite)
    }


    /**
     * Handles the keydown event to move the player sprite.
     *
     * @param e - The KeyboardEvent object.
     */
    private onKeyDown(e: KeyboardEvent): void {
        // Check if the key is not being held down and the player is not currently moving
        if (!e.repeat && !this.isMoving) {
            // Declare a direction object to hold the x and y coordinates and the type of movement
            let direction: { x: number, y: number, type: string }
            // Determine the direction of movement based on the key pressed
            switch (e.key) {
                case 'w':
                    // If 'w' is pressed, move the player sprite up
                    direction = {
                        x: this.player_sprite.x,
                        y: this.player_sprite.position.y - this.STEP_SIZE,
                        type: "UP"
                    }
                    break;
                case 's':
                    // If 's' is pressed, move the player sprite down
                    direction = {
                        x: this.player_sprite.x,
                        y: this.player_sprite.position.y + this.STEP_SIZE,
                        type: "DOWN"
                    }
                    break;
                case 'a':
                    // If 'a' is pressed, move the player sprite to the left
                    direction = {
                        x: this.player_sprite.x - this.STEP_SIZE,
                        y: this.player_sprite.position.y,
                        type: "LEFT"
                    }
                    break;
                case 'd':
                    // If 'd' is pressed, move the player sprite to the right
                    direction = {
                        x: this.player_sprite.x + this.STEP_SIZE,
                        y: this.player_sprite.position.y,
                        type: "RIGHT"
                    }
                    break;
                default:
                    // If any other key is pressed, keep the player sprite static
                    direction = {
                        x: this.player_sprite.x,
                        y: this.player_sprite.position.y,
                        type: "STATIC"
                    }
                    break;
            }
// Emit a "player moving" event to the server with the player's uid and direction
            this.socket.emit("player moving", {uid: this.uid, x:direction.x, y: direction.y, direction: direction.type})
            // Call the movePlayer method to move the player sprite
            this.movePlayer(direction)
        }
    }

            /**
     * Moves the player sprite to a new position.
     *
     * @param direction - An object containing the x and y coordinates for the new position.
     */
    private movePlayer(direction: {x:number,y:number, type:string}){
        // Set the moving state to true
        this.isMoving = true

        // Create a new tween for the player sprite's position
        new Tween(this.player_sprite.position)
            .to({
                x: direction.x,
                y: direction.y
            }, 300) // Set the duration of the tween to 300ms
            .easing(Easing.Sinusoidal.InOut) // Use the Back InOut easing function
            .start() // Start the tween
            .onComplete(()=>{ // When the tween completes
                // Normalize the position of the player sprite
                this.player_sprite.position.set(
                    this.player_sprite.x = Math.round(this.player_sprite.x / 10) * 10,
                    this.player_sprite.y = Math.round(this.player_sprite.y / 10) * 10
                )

                this.isMoving = false // Set the moving state to false
            })

        // Define a function to update the shared group
        let tweenfct = () =>{
            Group.shared.update()
        }

        // Add the function to the ticker
        this.ticker.add(tweenfct)
    }

    // PREVIOUS EXAMPLE WITH RENDERER AND TICK
    // private movePlayer(direction: {x:number,y:number}){
    //     const renderer   = this.app.renderer
    //     console.log("Moving player Up !")
    //     let counter = 0
    //     let mss = ()=>{
    //         if(counter <= this.STEP_SIZE){
    //             this.player_sprite.position.set(direction.x, direction.y)
    //             counter += this.SPEED;
    //             renderer.render(this.app.stage)
    //         } else {
    //             this.ticker.remove(mss)
    //         }
    //     }
    //     this.ticker.add(mss)
    // }



}