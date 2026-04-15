import React, { useState, useEffect } from 'react';
import { VideoScript, Scene } from '../services/gemini';
import { Play, Pause, RotateCcw } from 'lucide-react';

interface RendererProps {
  script: VideoScript;
}

export default function Renderer({ script }: RendererProps) {
  const [currentSceneIndex, setCurrentSceneIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [progress, setProgress] = useState(0);

  const currentScene = script.scenes[currentSceneIndex];

  useEffect(() => {
    if (!isPlaying) return;

    const duration = currentScene.duration;
    const startTime = Date.now();
    
    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const newProgress = Math.min((elapsed / duration) * 100, 100);
      setProgress(newProgress);

      if (elapsed >= duration) {
        clearInterval(interval);
        if (currentSceneIndex < script.scenes.length - 1) {
          setCurrentSceneIndex(prev => prev + 1);
          setProgress(0);
        } else {
          setIsPlaying(false);
        }
      }
    }, 16);

    return () => clearInterval(interval);
  }, [currentSceneIndex, isPlaying, currentScene.duration, script.scenes.length]);

  const handleRestart = () => {
    setCurrentSceneIndex(0);
    setProgress(0);
    setIsPlaying(true);
  };

  const getImageUrl = (keyword: string) => {
    return `https://picsum.photos/seed/${encodeURIComponent(keyword)}/1280/720?grayscale&blur=2`;
  };

  const getCameraClass = (effect: string) => {
    switch (effect) {
      case 'zoom-in': return 'scale-110';
      case 'zoom-out': return 'scale-90';
      case 'pan-left': return '-translate-x-10';
      case 'pan-right': return 'translate-x-10';
      default: return '';
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="video-container group relative bg-black overflow-hidden" style={{ backgroundColor: currentScene.themeColor }}>
        {script.scenes.map((scene, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-all duration-1000 ease-in-out ${
              index === currentSceneIndex ? 'opacity-100 scale-100' : 'opacity-0 scale-105 pointer-events-none'
            }`}
          >
            {/* Background Texture (Subtle) */}
            <div className={`absolute inset-0 transition-transform duration-[4000ms] ease-out ${index === currentSceneIndex ? getCameraClass(scene.cameraEffect) : ''}`}>
              <img
                src={getImageUrl(scene.imageKeyword)}
                alt={scene.text}
                className="w-full h-full object-cover opacity-40 mix-blend-overlay grayscale blur-[2px]"
                referrerPolicy="no-referrer"
              />
            </div>

            {/* Animated Shapes */}
            <div className="absolute inset-0 overflow-hidden">
              {scene.shapes.map((shape, sIdx) => (
                <div
                  key={sIdx}
                  className={`shape shape-${shape.type} animate-${shape.animation}`}
                  style={{
                    width: shape.type === 'line' ? `${shape.size * 8}px` : `${shape.size * 4}px`,
                    height: shape.type === 'line' ? '2px' : `${shape.size * 4}px`,
                    left: `${shape.x}%`,
                    top: `${shape.y}%`,
                    backgroundColor: shape.color,
                    borderBottomColor: shape.type === 'triangle' ? shape.color : undefined,
                    filter: `blur(${shape.blur || 40}px)`,
                    boxShadow: `0 0 60px ${shape.color}33`,
                  }}
                />
              ))}
            </div>

            {/* Content Overlay */}
            <div className="scene-overlay flex flex-col items-center justify-center p-12">
              <div className="relative z-10 max-w-4xl">
                <h3 className="motion-text animate-reveal" style={{ color: 'white' }}>
                  {scene.text}
                </h3>
                <div 
                  className="h-1 w-24 mx-auto mt-8 rounded-full animate-reveal" 
                  style={{ backgroundColor: scene.secondaryColor, animationDelay: '0.2s' }} 
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Playback Controls - Minimalist HUD */}
      <div className="glass-panel rounded-2xl p-4 flex items-center gap-6">
        <button
          onClick={() => setIsPlaying(!isPlaying)}
          className="w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
        >
          {isPlaying ? <Pause size={20} className="text-white" /> : <Play size={20} className="text-white ml-1" />}
        </button>
        
        <div className="flex-1 space-y-2">
          <div className="flex justify-between text-[10px] font-mono text-white/40 uppercase tracking-widest">
            <span>Scene {currentSceneIndex + 1} / {script.scenes.length}</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <div className="h-1 bg-white/5 rounded-full overflow-hidden">
            <div 
              className="h-full bg-white transition-all duration-100 ease-linear"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <button
          onClick={handleRestart}
          className="p-3 rounded-xl hover:bg-white/5 text-white/60 hover:text-white transition-colors"
          title="Restart"
        >
          <RotateCcw size={18} />
        </button>
      </div>
    </div>
  );
}
