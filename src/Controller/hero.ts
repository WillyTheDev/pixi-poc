"use strict";
import {Application, IRenderer, Sprite, Ticker} from "pixi.js";
import {SpriteSource} from "@pixi/sprite/lib/Sprite";
import {Socket} from "socket.io-client";


export class Hero {

    private readonly player_sprite : Sprite;
    // private socket
    public uid: number
    private ticker: Ticker
    private app : Application<HTMLCanvasElement>
    private renderer : IRenderer<HTMLCanvasElement>
    private STEP_SIZE : number = 50
    private SPEED: number = 3
    private socket: Socket

    constructor(img_src: SpriteSource, app : Application<HTMLCanvasElement>, socket: Socket) {
        this.uid = Math.floor(Math.random()*100)
        this.app = app
        this.socket = socket;
        this.renderer = app.renderer
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
        if(!e.repeat){
            switch (e.key){
                case 'w':
                    this.movePlayerUp()
                    this.socket.emit("player moving", {uid: this.uid, direction: "UP"})
                    break;
                case 's':
                    this.movePlayerDown()
                    this.socket.emit("player moving", {uid: this.uid, direction: "DOWN"})
                    break;
                case 'a':
                    this.movePlayerLeft()
                    this.socket.emit("player moving", {uid: this.uid, direction: "LEFT"})
                    break;
                case 'd':
                    this.movePlayerRight()
                    this.socket.emit("player moving", {uid: this.uid, direction: "RIGHT"})
                    break;
                default:
                    break;
            }
        }
    }

    private movePlayerUp(){
        console.log("Moving player Up !")
        let counter = 0
        let mss = ()=>{
            if(counter <= this.STEP_SIZE){
                this.player_sprite.position.set(
                    this.player_sprite.x,
                    this.player_sprite.position.y - this.SPEED)
                counter += this.SPEED;
                this.renderer.render(this.app.stage)
            } else {
                this.ticker.remove(mss)
            }
        }
        this.ticker.add(mss)
    }

    private movePlayerDown(){
        let counter = 0
        let mss = ()=>{
            if(counter <= this.STEP_SIZE){
                this.player_sprite.position.set(
                    this.player_sprite.x,
                    this.player_sprite.position.y + this.SPEED)
                counter += this.SPEED;
                this.renderer.render(this.app.stage)
            } else {
                this.ticker.remove(mss)
            }
        }
        this.ticker.add(mss)
    }

    private movePlayerLeft(){
        let counter = 0
        let mss = ()=>{
            if(counter <= this.STEP_SIZE){
                this.player_sprite.position.set(
                    this.player_sprite.x - this.SPEED,
                    this.player_sprite.position.y)
                counter += this.SPEED;
                this.renderer.render(this.app.stage)
            } else {
                this.ticker.remove(mss)
            }
        }
        this.ticker.add(mss)
    }

    private movePlayerRight(){

        let counter = 0
        let mss = ()=>{
            if(counter <= this.STEP_SIZE){
                this.player_sprite.position.set(
                    this.player_sprite.x + this.SPEED,
                    this.player_sprite.position.y)
                counter += this.SPEED;
                this.renderer.render(this.app.stage)
            } else {
                this.ticker.remove(mss)
            }
        }
        this.ticker.add(mss)
    }

    //WITH TWEEN
    // private movePlayerUp(){
    //     new Tween(this.player_sprite.position).to({
    //         x: this.player_sprite.x,
    //         y: this.player_sprite.position.y - this.STEP_SIZE}, 500
    //     ).easing(Easing.Quintic.Out).start()
    //     let tweenfct = () =>{
    //         Group.shared.update()
    //     }
    //     this.ticker.add(tweenfct)
    // }
    //
    // private movePlayerDown(){
    //     new Tween(this.player_sprite.position).to({
    //         x: this.player_sprite.x,
    //         y: this.player_sprite.position.y + this.STEP_SIZE}, 500
    //     ).easing(Easing.Quintic.Out).start()
    //     let tweenfct = () =>{
    //         Group.shared.update()
    //     }
    //     this.ticker.add(tweenfct)
    // }
    //
    // private movePlayerLeft(){
    //     new Tween(this.player_sprite.position).to({
    //         x: this.player_sprite.x - this.STEP_SIZE,
    //         y: this.player_sprite.position.y}, 500
    //     ).easing(Easing.Quintic.Out).start()
    //     let tweenfct = () =>{
    //         Group.shared.update()
    //     }
    //     this.ticker.add(tweenfct)
    // }
    //
    // private movePlayerRight(){
    //     new Tween(this.player_sprite.position).to({
    //         x: this.player_sprite.x + this.STEP_SIZE,
    //         y: this.player_sprite.position.y}, 500
    //     ).easing(Easing.Quintic.Out).start()
    //     let tweenfct = () =>{
    //         Group.shared.update()
    //     }
    //     this.ticker.add(tweenfct)
    // }

}