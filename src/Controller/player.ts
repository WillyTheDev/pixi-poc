import {SpriteSource} from "@pixi/sprite/lib/Sprite";
import {Application,  Sprite, Ticker} from "pixi.js";
import {Easing, Group, Tween} from "tweedle.js";

export class Player {

    private readonly player_sprite : Sprite;
    public uid: number
    private ticker: Ticker
    private app : Application<HTMLCanvasElement>
    private STEP_SIZE : number = 50
    constructor(img_src: SpriteSource, uid:number, app : Application<HTMLCanvasElement>) {
        this.app = app
        this.uid = uid
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

    public async movePlayerFromWebsocket(msg: string){
        let direction: {x:number,y:number}
        switch (msg) {
            case 'UP':
                direction = {
                    x: this.player_sprite.x,
                    y: this.player_sprite.position.y - this.STEP_SIZE}
                break;
            case 'DOWN':
                direction = {
                    x: this.player_sprite.x,
                    y: this.player_sprite.position.y + this.STEP_SIZE}
                break;
            case 'LEFT':
                direction = {
                    x: this.player_sprite.x - this.STEP_SIZE,
                    y: this.player_sprite.position.y}
                break;
            case 'RIGHT':
                direction = {
                    x: this.player_sprite.x + this.STEP_SIZE,
                    y: this.player_sprite.position.y}
                break;
            default:
                console.log("bizarre ...")
                direction = {
                    x: this.player_sprite.position.x,
                    y: this.player_sprite.position.y
                }
                break;
        }
        await this.movePlayer(direction)
    }



    private async movePlayer(direction: {x:number,y:number}){
        return new Promise((resolve) =>{
            new Tween(this.player_sprite.position).to({
                x: direction.x,
                y: direction.y}, 300
            ).easing(Easing.Back.InOut).start().onComplete(()=>{
                //normalizing position:
                this.player_sprite.position.set(
                    this.player_sprite.x = Math.round(this.player_sprite.x / 10) * 10,
                    this.player_sprite.y = Math.round(this.player_sprite.y / 10) * 10)
                console.log(this.player_sprite.position)
                resolve("moving player is over")
            })
            let tweenfct = () =>{
                Group.shared.update()
            }
            this.ticker.add(tweenfct)
        })


    }




}