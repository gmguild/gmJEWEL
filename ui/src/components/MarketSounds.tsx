import React, { useEffect, useState } from 'react';
import useSound from "use-sound";
import MarketDay from "../assets/Market_Day.mp3";

export function MarketSounds () {
  const [isPlaying, setIsPlaying] = useState(false);
  const [play, {stop}] = useSound(MarketDay, {volume: 0.1, interrupt: true, loop: true});

  useEffect(() => {
    if(isPlaying) play()
    else stop()
  }, [isPlaying])

  return(
    <div>
      <button onClick= {() => setIsPlaying(!isPlaying)} > {isPlaying ? 'Stop' : 'Play'}</button>
    </div>
  );
}
