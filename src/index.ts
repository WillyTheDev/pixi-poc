import {Application, SCALE_MODES, settings} from 'pixi.js'
import {Hero} from "./Controller/hero";
import {io} from "socket.io-client"
import {Player} from "./Controller/player"

//PIXEL PERFECT SETTINGS
settings.SCALE_MODE = SCALE_MODES.NEAREST

const app = new Application<HTMLCanvasElement>({
	view: document.getElementById("pixi-canvas") as HTMLCanvasElement,
	resolution: window.devicePixelRatio || 2,
	autoDensity: true,
	backgroundColor: 0x6495ed,
	width: window.screen.width,
	height: window.screen.height

});

const socket = io("https://game-service-3xgpbrmyzq-ez.a.run.app")

let players: Player[] = []

const hero = new Hero("hero.png", app, socket)
console.log(hero)
socket.on("new player", (msg)=>{
	console.log("New Player connected")
	if(msg.uid != hero.uid){
		const player = new Player("jn.png", msg.uid, app)
		players.push(player)
	}
})
socket.on("player moving", (msg)=>{
	console.log("player is moving !")
	for (const player of players) {
		if(player.uid === msg.uid){
			console.log("player has been found !")
			player.movePlayer(msg.direction)
		}
	}
})

socket.on("player disconnected", (msg) => {
	console.log("player has been disconnected :" +  msg.uid)

})

window.addEventListener('beforeunload', function (e) {
	e.preventDefault();
	socket.emit("close connection", {uid: hero.uid})
});













