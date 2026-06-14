import { useEffect, useState, useRef } from "react";
import screen from "../phaser/screen";
import Phaser from "phaser";
export default function GameCar() {
  const gameRef = useRef(null);
  useEffect(() => {
    const config = {
      type: Phaser.AUTO,
      width: 300,
      height: 600,
      backgroundColor: "#510C0C",
      scene: [screen],
      scale: {
        mode: Phaser.Scale.FIT,
        // autoCenter: Phaser.Scale.CENTER_BOTH,
      },
    };
    const game = new Phaser.Game({
      ...config,
      parent: gameRef.current,
    });

    return () => {
      game.destroy(true);
    };
  }, []);
  return (
    <>
      <section className="">
        <div className="border-4 border-amber-400" ref={gameRef}></div>
      </section>
    </>
  );
}
