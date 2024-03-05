import {Application, SCALE_MODES, settings, Sprite} from 'pixi.js'
import {Hero} from "./Controller/hero";
import {io} from "socket.io-client"
import {Player} from "./Controller/player"
import {Viewport} from "pixi-viewport";

//PIXEL PERFECT SETTINGS
settings.SCALE_MODE = SCALE_MODES.NEAREST

const app = new Application<HTMLCanvasElement>({
	view: document.getElementById("pixi-canvas") as HTMLCanvasElement,
	resolution: window.devicePixelRatio || 2,
	autoDensity: true,
	backgroundColor: 0x000000,
	width: window.screen.width,
	height: window.screen.height

});

const socket = io("https://game-service-3xgpbrmyzq-ez.a.run.app")

// create viewport
const viewport = new Viewport({
	screenWidth: window.innerWidth,
	screenHeight: window.innerHeight,
	worldWidth: 4000,
	worldHeight: 4000,
	events: app.renderer.events // the interaction module is important for wheel to work properly when renderer.view is placed or scaled
})

viewport.scale.set(2,2)


const map = Sprite.from("map.png")
map.anchor.set(0.5, 0.5);
map.scale.set(2,2);
map.position.set(app.screen.width / 2, app.screen.height / 2)
viewport.addChild(map)


let players: Player[] = []
let uid_players: number[] = []

const hero = new Hero("hero.png", app, socket, viewport)
uid_players.push(hero.uid)



// add the viewport to the stage
app.stage.addChild(viewport)
socket.on("new player", (msg)=>{
	console.log("New Player connected, here is the list of all connected players \n", msg.players)
	console.log("this is the local list of connected players \n " + uid_players)
	for(const player of msg.players) {
		if (!uid_players.includes(player.uid, 0)) {
			if (player.uid != hero.uid) {
				const newPlayer = new Player("jn.png", player.uid,player.x,player.y, viewport)
				players.push(newPlayer)
				uid_players.push(player.uid)
			}
		}
	}
})
socket.on("player moving", (msg)=>{
	for (const player of players) {
		console.log(msg.uid)
		if(player.uid === msg.uid){
			player.movePlayer(msg.direction).then(r => console.log(r))
		}
	}
})

socket.on("player disconnected", (msg) => {
	console.log("player has been disconnected :" +  msg.uid)
	const index = uid_players.indexOf(msg.uid)
	uid_players.splice(index, 1)
	for (const player of players) {
		if(player.uid === msg.uid){
			player.removePlayerFromScene()
		}

	}

})

window.addEventListener('beforeunload', function () {
	socket.emit("close connection", {uid: hero.uid})
});













