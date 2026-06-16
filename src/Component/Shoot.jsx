import { useEffect, useState, useRef } from "react";
import Phaser from "phaser";
import screen from "../phaser/Shoot/screen";
export default function Shoot() {
  const gameRef = useRef(null);
  useEffect(() => {
    const config = {
      type: Phaser.AUTO,
      width: window.innerWidth,
      height: window.innerHeight,
      backgroundColor: "#000000",
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
        <div className="" ref={gameRef}></div>
      </section>
    </>
  );
}
