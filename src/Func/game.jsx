// import Phaser from "phaser";
// import { MainGame } from "../Func/Main";
// console.log("Game is running");
// const config = {
//     type: Phaser.AUTO,
//     width: 1200,
//     height: 600,
//     physics: {
//         default: "arcade",
//         arcade: { debug: false },
//     },
//     scene: [MainGame],
//     parent:"phaser-game"
// };

// const game = new Phaser.Game(config);
// export default game;

// import { useEffect,useState } from "react";
// import game from "../Func/game";
// export const Space = () => {
//     const [isGameLoaded, setIsGameLoaded] = useState(false);

//     useEffect(() => {
//         setTimeout(() => {
//             setIsGameLoaded(true);
//         }, 500); // Wait for Phaser to initialize
//     }, []);

//     return <div id="phaser-game">{isGameLoaded ? "Game Loading..." : ""}</div>;
// };