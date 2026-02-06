import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import { FloatingPetals } from './components/FloatingPetals';
import { Rose } from './components/Rose';
import { SCENES } from './constants';
import { Play, RotateCcw, Volume2, VolumeX, Music, Upload } from 'lucide-react';
import { SceneData } from './types';

const App: React.FC = () => {
  const [currentSceneIndex, setCurrentSceneIndex] = useState<number>(-1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showFinal, setShowFinal] = useState(false);
  const [finalPhase, setFinalPhase] = useState(0); // 0: Enter, 1: Face, 2: Change, 3: Amazing, 4: Just way you are
  const [isMuted, setIsMuted] = useState(false);
  const [audioError, setAudioError] = useState(false);
  const [audioFileName, setAudioFileName] = useState<string>('');
  
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Constants for timing
  const EXIT_ANIMATION_DURATION = 1000; // ms
  const ENTER_ANIMATION_DURATION = 1500; // ms

  // Initialize Audio
  useEffect(() => {
    // Default to looking for song.mp3
    audioRef.current = new Audio('/song.mp3'); 
    audioRef.current.loop = false;
    
    // Add error handler
    const handleError = () => {
      console.warn("Audio file not found or failed to load");
      setAudioError(true);
    };
    
    // Add loaded data handler
    const handleLoaded = () => {
      setAudioError(false);
    };

    audioRef.current.addEventListener('error', handleError);
    audioRef.current.addEventListener('loadeddata', handleLoaded);
    
    return () => {
      if (audioRef.current) {
        audioRef.current.removeEventListener('error', handleError);
        audioRef.current.removeEventListener('loadeddata', handleLoaded);
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  // Handle Playback State
  useEffect(() => {
    if (audioRef.current && isPlaying) {
      if (audioRef.current.paused && !audioError) {
        audioRef.current.play().catch(e => console.log("Playback resume failed:", e));
      }
    } else if (audioRef.current && !isPlaying) {
      audioRef.current.pause();
    }
  }, [isPlaying, audioError]);

  // Handle Mute
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.muted = isMuted;
    }
  }, [isMuted]);

  // Sequence Logic
  useEffect(() => {
    if (!isPlaying) return;

    if (currentSceneIndex < SCENES.length) {
      // Calculate total wait time: Scene Duration + Time it takes for previous scene to exit
      // We add a buffer to ensure the user actually sees the scene for the full 'duration'
      const baseDuration = currentSceneIndex === -1 ? 100 : SCENES[currentSceneIndex].duration;
      
      // If it's the first scene, no exit wait needed. Otherwise, wait for exit animation.
      const buffer = currentSceneIndex === -1 ? 0 : EXIT_ANIMATION_DURATION;
      const totalDelay = baseDuration + buffer;
      
      const timeout = setTimeout(() => {
        setCurrentSceneIndex(prev => prev + 1);
      }, totalDelay); 

      return () => clearTimeout(timeout);
    } else {
      // Transition to Final Scene after last rose
      const finalTimeout = setTimeout(() => {
        setShowFinal(true);
        // Start Final Scene Phasing
        handleFinalSequence();
      }, 1000);
      return () => clearTimeout(finalTimeout);
    }
  }, [isPlaying, currentSceneIndex]);

  // Final Scene Choreography (Synced to Chorus)
  const handleFinalSequence = () => {
    // Phase 0: "When I see your face" (Starts immediately)
    setFinalPhase(0);

    setTimeout(() => {
      // Phase 1: "There's not a thing that I would change"
      setFinalPhase(1);
    }, 3500);

    setTimeout(() => {
      // Phase 2: "Cause you're AMAZING" (Climax)
      setFinalPhase(2);
    }, 7000);

    setTimeout(() => {
      // Phase 3: "Just the way you are" (Resolve)
      setFinalPhase(3);
    }, 10500);
  };

  const startSequence = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play().then(() => {
        setAudioError(false);
      }).catch(e => {
        console.error("Audio play failed:", e);
      });
    }

    setIsPlaying(true);
    setCurrentSceneIndex(0);
    setShowFinal(false);
    setFinalPhase(0);
  };

  const restart = () => {
    setIsPlaying(false);
    setCurrentSceneIndex(-1);
    setShowFinal(false);
    setFinalPhase(0);
    setTimeout(() => startSequence(), 100);
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && audioRef.current) {
      const url = URL.createObjectURL(file);
      audioRef.current.src = url;
      audioRef.current.load();
      setAudioFileName(file.name);
      setAudioError(false);
    }
  };

  const currentScene = SCENES[currentSceneIndex];

  // --- Dynamic Animation Variants ---
  const getAnimationVariant = (type: string): Variants => {
    // Base duration for all enter animations
    const DURATION = ENTER_ANIMATION_DURATION / 1000; 

    switch (type) {
      case 'sway':
        return {
          initial: { opacity: 0, rotate: -5, scale: 0.9 },
          animate: { 
            opacity: 1, 
            rotate: [5, -5, 5], 
            scale: 1,
            transition: { duration: 4, ease: "easeInOut", repeat: Infinity, repeatType: "reverse" }
          },
          exit: { opacity: 0, rotate: 0, scale: 0.9, transition: { duration: EXIT_ANIMATION_DURATION / 1000 } }
        };
      case 'bloom':
        return {
          initial: { opacity: 0, scale: 0.4 },
          animate: { 
            opacity: 1, 
            scale: 1,
            transition: { duration: DURATION, ease: "easeOut" }
          },
          exit: { opacity: 0, scale: 1.1, filter: "blur(10px)", transition: { duration: EXIT_ANIMATION_DURATION / 1000 } }
        };
      case 'pulse':
        return {
          initial: { opacity: 0, scale: 0.9 },
          animate: { 
            opacity: 1, 
            scale: [1, 1.05, 1],
            filter: ["brightness(1)", "brightness(1.1)", "brightness(1)"],
            transition: { duration: 3, repeat: Infinity, ease: "easeInOut" }
          },
          exit: { opacity: 0, scale: 0.95, transition: { duration: EXIT_ANIMATION_DURATION / 1000 } }
        };
      case 'gentle_spin':
        return {
          initial: { opacity: 0, rotate: -30, scale: 0.8 },
          animate: { 
            opacity: 1, 
            rotate: 0,
            scale: 1,
            transition: { duration: DURATION, ease: "circOut" }
          },
          exit: { opacity: 0, rotate: 10, scale: 0.9, transition: { duration: EXIT_ANIMATION_DURATION / 1000 } }
        };
      case 'float':
      default:
        return {
          initial: { opacity: 0, y: 30, scale: 0.95 },
          animate: { 
            opacity: 1, 
            y: [0, -10, 0], 
            scale: 1,
            transition: { 
              y: { duration: 3, repeat: Infinity, ease: "easeInOut" },
              opacity: { duration: 1 }
            }
          },
          exit: { opacity: 0, y: -20, scale: 0.95, transition: { duration: EXIT_ANIMATION_DURATION / 1000 } }
        };
    }
  };

  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsMuted(!isMuted);
  };

  return (
    <div className="relative min-h-screen w-full bg-[#fdfaf5] flex items-center justify-center overflow-hidden font-serif">
      <FloatingPetals />

      {/* Hidden File Input */}
      <input 
        type="file" 
        ref={fileInputRef}
        onChange={handleFileSelect}
        accept="audio/*"
        className="hidden"
      />

      {/* Audio Control (Top Right) */}
      {isPlaying && (
        <button 
          onClick={toggleMute}
          className="absolute top-6 right-6 z-50 text-stone-400 hover:text-stone-600 transition-colors p-2"
        >
          {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
        </button>
      )}

      {/* Intro Screen */}
      {!isPlaying && !showFinal && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.5 }}
          className="z-10 text-center p-8 w-full max-w-md flex flex-col items-center"
        >
          <div className="mb-12 relative opacity-60">
             <Rose color="#e11d48" size={80} />
          </div>

          <p className="text-xl text-stone-500 italic mb-4 font-serif tracking-widest">
            For Prachi
          </p>
          
          {/* Audio Status / Selector */}
          <div className="mb-8 flex flex-col items-center gap-2">
            <button 
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-2 px-4 py-2 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-500 text-xs transition-colors"
            >
              <Music size={12} />
              {audioFileName ? 'Music Selected' : 'Select "Just The Way You Are"'}
              <Upload size={12} className="ml-1 opacity-50"/>
            </button>
            
            {audioError && !audioFileName && (
               <span className="text-amber-500 text-[10px] uppercase tracking-wider">
                 song.mp3 not found. Please select file.
               </span>
            )}
            
            {!audioError && !audioFileName && (
              <p className="text-[10px] text-stone-400 font-sans">
                (Ensure sound is on)
              </p>
            )}
          </div>

          <button
            onClick={startSequence}
            className="text-stone-400 hover:text-stone-600 transition-colors uppercase text-xs tracking-[0.3em] flex items-center gap-2 border-b border-transparent hover:border-stone-300 pb-1"
          >
            Start Sequence <Play size={10} />
          </button>
        </motion.div>
      )}

      {/* Main Sequence */}
      <AnimatePresence mode="wait">
        {isPlaying && !showFinal && currentScene && (
          <motion.div
            key={currentScene.id}
            className="z-10 flex flex-col items-center justify-center p-8 w-full max-w-lg text-center absolute"
          >
            {/* Rose Animation */}
            <motion.div
              variants={getAnimationVariant(currentScene.animationType)}
              initial="initial"
              animate="animate"
              exit="exit"
              className="mb-8"
            >
              <Rose 
                color={currentScene.roseColorHex} 
                size={220} 
              />
            </motion.div>

            {/* Main Message (Hindi) - appears fast */}
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ delay: 0.2, duration: 0.8 }}
              className="text-xl md:text-2xl text-stone-600 font-hindi leading-loose mb-12"
            >
              {currentScene.message}
            </motion.p>

            {/* Lyric Subtitle - appears shortly after message */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className="absolute bottom-[-100px] left-0 right-0 px-4"
            >
              <p className="text-sm md:text-base text-stone-400 font-serif italic tracking-wide">
                ♫ "{currentScene.lyric}"
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Final Scene: Climax & Handwritten Note */}
      {showFinal && (
        <div className="z-10 relative w-full h-full min-h-screen flex flex-col items-center justify-center p-6">
          
          {/* Red Rose with Dynamic Glow */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ 
              opacity: 1, 
              scale: finalPhase === 2 ? 1.1 : 1, // Pulse on "Amazing"
            }}
            transition={{ duration: 2, ease: "easeOut" }}
            className="relative mb-12"
          >
            {/* Diffused Backlight - Intensifies on 'Amazing' */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: finalPhase >= 2 ? 0.8 : 0.4 }}
              transition={{ duration: 2 }}
              className="absolute inset-0 bg-red-200/50 blur-[60px] rounded-full transform scale-150"
            />
            
            <Rose color="#be123c" size={240} className="relative z-10 drop-shadow-lg" />
          </motion.div>

          {/* Dynamic Lyrics Overlay */}
          <div className="h-16 mb-8 flex items-center justify-center w-full">
            <AnimatePresence mode="wait">
              {finalPhase === 0 && (
                <motion.p key="p1" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-stone-500 font-serif text-lg italic">
                  When I see your face...
                </motion.p>
              )}
              {finalPhase === 1 && (
                <motion.p key="p2" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-stone-500 font-serif text-lg italic">
                  There's not a thing that I would change...
                </motion.p>
              )}
              {finalPhase === 2 && (
                <motion.p 
                  key="p3" 
                  initial={{ opacity: 0, scale: 0.9 }} 
                  animate={{ opacity: 1, scale: 1.2 }} 
                  exit={{ opacity: 0 }} 
                  className="text-rose-600 font-serif text-2xl md:text-3xl italic font-medium"
                >
                  'Cause you're amazing
                </motion.p>
              )}
              {finalPhase >= 3 && (
                <motion.p key="p4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-stone-500 font-serif text-lg italic">
                  Just the way you are.
                </motion.p>
              )}
            </AnimatePresence>
          </div>

          {/* Handwritten Note (Appears at the end) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: finalPhase >= 3 ? 1 : 0, y: finalPhase >= 3 ? 0 : 20 }}
            transition={{ duration: 2 }}
            className="relative max-w-sm w-full mt-4"
          >
            <div className="bg-[#fffdf5] p-8 pb-12 shadow-lg torn-edge transform rotate-1">
              <h1 className="text-4xl font-script text-stone-700 mb-4 text-center transform -rotate-2">
                Happy Rose Day
              </h1>
              <p className="text-center font-script text-stone-500 text-lg leading-relaxed">
                Simple, pure, and forever yours.
              </p>
            </div>
            
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1, duration: 1 }}
              className="absolute -bottom-16 left-0 right-0 flex justify-center"
            >
              <button
                onClick={restart}
                className="text-stone-300 hover:text-stone-500 transition-colors"
              >
                <RotateCcw size={16} />
              </button>
            </motion.div>
          </motion.div>

        </div>
      )}
    </div>
  );
};

export default App;