"use strict";
import {Application, Sprite, Ticker} from "pixi.js";
import {SpriteSource} from "@pixi/sprite/lib/Sprite";
import {Socket} from "socket.io-client";
import {Easing, Group, Tween} from "tweedle.js";


export class Hero {

    private readonly player_sprite : Sprite;
    public uid: number
    private ticker: Ticker
    private app : Application<HTMLCanvasElement>
    private STEP_SIZE : number = 50
    //private SPEED: number = 3
    private socket: Socket
    private isMoving : boolean = false

    constructor(img_src: SpriteSource, app : Application<HTMLCanvasElement>, socket: Socket) {
        this.uid = Math.floor(Math.random()*100)
        this.app = app
        this.socket = socket;
        this.player_sprite = Sprite.from(img_src);
        this.player_sprite.anchor.set(0.5, 0.5);
        this.player_sprite.scale.set(2,2);
        this.player_sprite.position.set(app.screen.width / 2, app.screen.height / 2);
        this.player_sprite.eventMode = 'static';
        this.player_sprite.cursor = 'pointer';
        document.addEventListener("keydown", this.onKeyDown.bind(this));
        console.log(this.player_sprite.position)
        this.app.stage.addChild(this.player_sprite)
        socket.emit("new player", {uid: this.uid})
        this.ticker = Ticker.shared;
    }


    private onKeyDown(e: KeyboardEvent): void {
        if(!e.repeat && !this.isMoving){
            let direction: {x:number, y:number, type: string}
            switch (e.key){
                case 'w':
                    direction = {
                        x: this.player_sprite.x,
                        y: this.player_sprite.position.y - this.STEP_SIZE,
                        type: "UP"}
                    break;
                case 's':
                    direction = {
                        x: this.player_sprite.x,
                        y: this.player_sprite.position.y + this.STEP_SIZE,
                        type: "DOWN"}
                    break;
                case 'a':
                    direction = {
                        x: this.player_sprite.x - this.STEP_SIZE,
                        y: this.player_sprite.position.y,
                        type: "LEFT"}
                    break;
                case 'd':
                    direction = {
                        x: this.player_sprite.x + this.STEP_SIZE,
                        y: this.player_sprite.position.y,
                        type: "RIGHT"}
                    break;
                default:
                    direction = {
                        x:this.player_sprite.x,
                        y: this.player_sprite.position.y,
                        type: "STATIC"
                    }
                    break;
            }
            this.socket.emit("player moving", {uid: this.uid, direction: direction.type})
            this.movePlayer(direction)
        }
    }



    private movePlayer(direction: {x:number,y:number}){
        this.isMoving = true
        new Tween(this.player_sprite.position).to({
            x: direction.x,
            y: direction.y}, 300
        ).easing(Easing.Back.InOut).start().onComplete(()=>{
            //normalizing position:
            this.player_sprite.position.set(
                this.player_sprite.x = Math.round(this.player_sprite.x / 10) * 10,
                this.player_sprite.y = Math.round(this.player_sprite.y / 10) * 10)
            console.log(this.player_sprite.position)
            this.isMoving = false
        })
        let tweenfct = () =>{
            Group.shared.update()
        }
        this.ticker.add(tweenfct)

    }

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