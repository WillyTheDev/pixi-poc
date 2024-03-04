import {SpriteSource} from "@pixi/sprite/lib/Sprite";
import {Application, IRenderer, Sprite, Ticker} from "pixi.js";

export class Player {

    private readonly player_sprite : Sprite;
    public uid: number
    private ticker: Ticker
    private app : Application<HTMLCanvasElement>
    private renderer : IRenderer
    private STEP_SIZE : number = 50
    private SPEED : number = 2
    constructor(img_src: SpriteSource, uid:number, app : Application<HTMLCanvasElement>) {
        this.app = app
        this.uid = uid
        this.renderer = app.renderer
        this.player_sprite = Sprite.from(img_src);
        this.player_sprite.anchor.set(0.5, 0.5);
        this.player_sprite.scale.set(2,2);
        this.player_sprite.position.set(app.screen.width / 2, app.screen.height / 2);
        this.player_sprite.eventMode = 'static';
        this.player_sprite.cursor = 'pointer';
        this.app.stage.addChild(this.player_sprite)
        //this.socket = io("URL_OF_SOCKET_SERVER")
        this.ticker = Ticker.shared;
    }

    public movePlayer(direction: string){
        switch (direction)
        {
            case 'UP':
                this.movePlayerUp();
                break;
            case 'DOWN':
                this.movePlayerDown();
                break;
            case 'LEFT':
                this.movePlayerLeft();
                break;
            case 'RIGHT':
                this.movePlayerRight()
                break;
            default:
                console.log("Direction bizarre ...")
                break
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