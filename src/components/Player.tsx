import React, { useState, useEffect, useCallback } from 'react';
import { useKeyboardShortcut } from '../hooks';
import Plot from './Plot';
import Button from './Button';
import { Size } from '../types';

const Player: React.FC<{
  buffer: AudioBuffer;
  options: Size;
}> = ({ buffer, options: { width, height } = { width: 800, height: 350 } }): JSX.Element => {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  useEffect((): (() => void) => {
    const audioCtx = new AudioContext();
    let source: AudioBufferSourceNode | undefined;

    if (isPlaying) {
      // Get an AudioBufferSourceNode.
      // This is the AudioNode to use when we want to play an AudioBuffer
      source = audioCtx.createBufferSource();

      // set the buffer in the AudioBufferSourceNode
      source.buffer = buffer;

      // connect the AudioBufferSourceNode to the destination to hear the sound
      source.connect(audioCtx.destination);

      source.loop = true;
      source.start();
    } else {
      source?.stop();
    }

    return (): void => source?.stop();
  }, [isPlaying]);

  useKeyboardShortcut(['Control', 'S'], useCallback((): void => {
    setIsPlaying((prevPlaying): boolean => !prevPlaying);
  }, [setIsPlaying]));

  return (
    <div className="player">
      <Plot buffer={buffer} options={{ width, height }} />
      <div className="panel">
        <span className="text-dark text-sm">Length: {buffer.duration}s | </span>
        <span className="text-dark text-sm">Frequency: {buffer.sampleRate}hz | </span>
        <Button className="btn btn-sm" handleClick={(): void => {
          setIsPlaying((p): boolean => !p);
        }}>{isPlaying ? 'stop' : 'play'}</Button>
        <span className="text-dark text-sm"> (Ctrl+S)</span>
      </div>
    </div>
  );
};

export default Player;
