import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Microscope, FlaskConical, Activity, Heart, Dna, ClipboardCheck, ScanSearch, RotateCcw, Volume2, VolumeX } from 'lucide-react';
import { FloatingPetals } from './components/FloatingPetals';
import { Rose } from './components/Rose';
import { Specimen, LabStage } from './types';

// --- Data ---
const SPECIMENS: Specimen[] = [
  {
    id: 'yellow',
    name: 'Yellow Rose',
    scientificName: 'Rosa amicitia',
    color: '#facc15',
    molecule: 'C8H11NO2 (Dopamine)',
    description: "Bright pigmentation indicates high energy levels.",
    effect: "Stimulates laughter and reduces stress levels."
  },
  {
    id: 'pink',
    name: 'Pink Rose',
    scientificName: 'Rosa gratia',
    color: '#f472b6',
    molecule: 'C10H12N2O (Serotonin)',
    description: "Soft hue suggests a calming, stabilizing property.",
    effect: "Induces feelings of grace, gratitude, and comfort."
  },
  {
    id: 'red',
    name: 'Red Rose',
    scientificName: 'Rosa amoris',
    color: '#e11d48',
    molecule: 'C43H66N12O12S2 (Oxytocin)',
    description: "Intense saturation. Highly reactive.",
    effect: "Triggers rapid heartbeat and emotional bonding."
  }
];

const DIAGNOSES: Record<string, { title: string; colorClass: string; hexColor: string; observation: string; conclusion: string }> = {
  yellow: {
    title: "Chronic Joy Syndrome",
    colorClass: "text-yellow-600",
    hexColor: "#facc15",
    observation: "Subject exhibits uncontrollable smiling and high dopamine levels.",
    conclusion: "Permanently bonded as Best Friends Forever."
  },
  pink: {
    title: "Acute Gratitude Overload",
    colorClass: "text-pink-500",
    hexColor: "#f472b6",
    observation: "Subject radiates warmth, elegance, and serenity.",
    conclusion: "Presence creates a therapeutic calming effect."
  },
  red: {
    title: "Irreversibly In Love",
    colorClass: "text-rose-600",
    hexColor: "#e11d48",
    observation: "Elevated heart rate and butterflies detected in stomach region.",
    conclusion: "Life functions are biologically optimized when near you."
  }
};

// --- Components ---

const BootScreen: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
  const [text, setText] = useState<string[]>([]);
  const messages = [
    "Initializing Bio-Lab v1.0...",
    "Calibrating Microscope Lenses...",
    "Sterilizing Petri Dishes...",
    "Detecting Pheromones...",
    "Subject Identified: 'You'...",
    "Loading Experiment #1402..."
  ];

  useEffect(() => {
    let delay = 0;
    messages.forEach((msg, index) => {
      delay += 800;
      setTimeout(() => {
        setText(prev => [...prev, msg]);
        if (index === messages.length - 1) {
          setTimeout(onComplete, 1000);
        }
      }, delay);
    });
  }, []);

  return (
    <div className="h-full w-full bg-slate-900 text-teal-400 font-mono p-8 flex flex-col justify-center items-start overflow-hidden">
      <div className="max-w-md w-full mx-auto space-y-3">
        {text.map((line, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-2 text-sm md:text-base"
          >
            <span className="text-teal-600 shrink-0">{">"}</span> 
            <span className="break-words">{line}</span>
          </motion.div>
        ))}
        <motion.div 
          animate={{ opacity: [0, 1] }} 
          transition={{ repeat: Infinity, duration: 0.8 }}
          className="w-3 h-5 bg-teal-500 inline-block align-middle ml-2"
        />
      </div>
    </div>
  );
};

const SpecimenCard: React.FC<{ 
  specimen: Specimen; 
  isSelected: boolean; 
  onClick: () => void; 
}> = ({ specimen, isSelected, onClick }) => {
  return (
    <motion.div
      layoutId={`card-${specimen.id}`}
      onClick={onClick}
      className={`
        relative cursor-pointer rounded-2xl p-4 transition-all duration-300 border-2 w-full
        ${isSelected 
          ? 'bg-white border-lab-accent shadow-xl scale-[1.02] z-10' 
          : 'bg-white/60 border-transparent hover:bg-white hover:border-lab-border'
        }
      `}
    >
      <div className="flex flex-row md:flex-col items-center gap-4 md:gap-3">
        {/* Petri Dish Look */}
        <div className={`
          w-20 h-20 md:w-24 md:h-24 rounded-full border-4 flex items-center justify-center bg-lab-bg relative overflow-hidden shrink-0
          ${isSelected ? 'border-lab-accent' : 'border-slate-200'}
        `}>
          <div className="absolute inset-0 opacity-20 bg-gradient-to-br from-transparent to-slate-200 pointer-events-none" />
          <Rose color={specimen.color} size={isSelected ? 60 : 50} />
        </div>
        
        <div className="text-left md:text-center flex-1">
          <h3 className="font-sans font-bold text-slate-700 text-lg">{specimen.name}</h3>
          <p className="font-mono text-[10px] md:text-xs text-slate-400 italic">{specimen.scientificName}</p>
        </div>
      </div>

      {isSelected && (
        <motion.div 
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="mt-4 pt-4 border-t border-slate-100"
        >
          <div className="space-y-3 text-xs md:text-sm text-slate-600 font-hand leading-relaxed">
            <div className="flex items-start gap-2">
              <FlaskConical size={14} className="mt-1 text-teal-500 shrink-0"/>
              <span><strong className="text-teal-700">Molecule:</strong> {specimen.molecule}</span>
            </div>
            <div className="flex items-start gap-2">
              <ScanSearch size={14} className="mt-1 text-teal-500 shrink-0"/>
              <span><strong className="text-teal-700">Obs:</strong> {specimen.description}</span>
            </div>
            <div className="flex items-start gap-2">
              <Activity size={14} className="mt-1 text-teal-500 shrink-0"/>
              <span><strong className="text-teal-700">Effect:</strong> {specimen.effect}</span>
            </div>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

const AnalyzingScreen: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
  useEffect(() => {
    setTimeout(onComplete, 4000);
  }, []);

  return (
    <div className="h-full w-full flex flex-col items-center justify-center p-8 bg-slate-900/95 backdrop-blur-md z-50 fixed inset-0">
      <div className="w-full max-w-md relative">
        {/* ECG Animation */}
        <div className="h-32 w-full bg-slate-800 rounded-lg border border-slate-700 relative overflow-hidden mb-6 flex items-center">
          <svg className="w-full h-24 stroke-teal-400 fill-none stroke-2" viewBox="0 0 500 100" preserveAspectRatio="none">
             <path 
               className="animate-ecg"
               d="M0,50 L50,50 L60,20 L70,80 L80,50 L120,50 L130,10 L140,90 L150,50 L200,50 L210,30 L220,70 L230,50 L300,50 L310,15 L320,85 L330,50 L400,50 L450,50 L500,50" 
             />
          </svg>
          <div className="absolute top-2 right-2 flex items-center gap-1 text-xs text-teal-500 font-mono animate-pulse">
            <Activity size={12} /> RECORDING
          </div>
        </div>

        <div className="space-y-4 text-center">
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
            className="text-teal-400 font-mono text-sm"
          >
            Analyzing bio-rhythms...
          </motion.div>
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.5 }}
            className="text-teal-300 font-mono text-sm"
          >
            Detecting elevated hormone levels...
          </motion.div>
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2.5 }}
            className="text-pink-400 font-mono text-lg font-bold"
          >
            Heart rate abnormality confirmed.
          </motion.div>
        </div>
      </div>
    </div>
  );
};

const DiagnosisScreen: React.FC<{ onBack: () => void; specimenId: string }> = ({ onBack, specimenId }) => {
  const diagnosis = DIAGNOSES[specimenId] || DIAGNOSES.red;

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="h-full w-full flex flex-col items-center justify-center p-6 relative z-10 overflow-y-auto"
    >
      <div className="bg-white/80 backdrop-blur-md p-6 md:p-8 rounded-3xl shadow-2xl border-4 border-pink-100 max-w-md w-full text-center relative my-auto">
        {/* Decorative Tape */}
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-32 h-6 bg-pink-200/50 rotate-1 transform"></div>

        <motion.div 
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 100, delay: 0.2 }}
          className="mb-6 flex justify-center"
        >
          <Rose color={diagnosis.hexColor} size={140} />
        </motion.div>

        <h1 className="text-2xl md:text-3xl font-script text-slate-800 mb-2">Diagnosis:</h1>
        <h2 className={`text-xl md:text-2xl font-bold mb-6 ${diagnosis.colorClass}`}>{diagnosis.title}</h2>

        <div className="text-left bg-lab-bg p-4 rounded-xl border border-lab-border font-hand text-slate-600 space-y-3 mb-8 text-sm md:text-base shadow-inner">
          <p><strong>Subject:</strong> My Favorite Person</p>
          <p><strong>Observation:</strong> {diagnosis.observation}</p>
          <p><strong>Conclusion:</strong> {diagnosis.conclusion}</p>
        </div>

        <div className="flex flex-col items-center gap-6">
          <div className="flex justify-center gap-2 text-pink-500">
            <Heart fill="currentColor" size={24} className="animate-bounce" />
            <span className="font-script text-2xl">Happy Rose Day</span>
            <Heart fill="currentColor" size={24} className="animate-bounce delay-75" />
          </div>

          <button 
            onClick={onBack}
            className="flex items-center gap-2 text-slate-400 hover:text-slate-600 transition-colors text-xs uppercase tracking-widest font-bold"
          >
            <RotateCcw size={14} /> New Experiment
          </button>
        </div>
      </div>
    </motion.div>
  );
};

// --- Main App ---
const App: React.FC = () => {
  const [stage, setStage] = useState<LabStage>('boot');
  const [selectedSpecimen, setSelectedSpecimen] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  // Auto-select first specimen on load of lab stage
  useEffect(() => {
    if (stage === 'lab') {
      setTimeout(() => setSelectedSpecimen('yellow'), 500);
    }
  }, [stage]);

  // Attempt auto-play on first click
  useEffect(() => {
    const handleFirstInteraction = () => {
      if (audioRef.current && !isPlaying) {
        audioRef.current.play()
          .then(() => setIsPlaying(true))
          .catch((e) => console.log("Auto-play prevented by browser policy", e));
      }
      // Remove listener after first attempt
      window.removeEventListener('click', handleFirstInteraction);
    };

    window.addEventListener('click', handleFirstInteraction);
    return () => window.removeEventListener('click', handleFirstInteraction);
  }, [isPlaying]);

  const toggleMusic = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent triggering other click handlers
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  return (
    <div className="relative h-[100dvh] w-full bg-lab-bg overflow-hidden font-sans text-lab-text">
      {/* Background Audio */}
      <audio ref={audioRef} loop src="background.mp3" />
      
      {/* Music Toggle */}
      <button 
        onClick={toggleMusic}
        className="fixed top-4 right-4 z-50 bg-white/50 backdrop-blur p-2 rounded-full shadow-md text-teal-600 hover:bg-white transition-all"
      >
        {isPlaying ? <Volume2 size={20} /> : <VolumeX size={20} />}
      </button>

      <FloatingPetals />
      
      {/* Background Decor */}
      <div className="absolute top-[-10%] right-[-10%] w-96 h-96 bg-teal-100/50 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-10%] w-96 h-96 bg-pink-100/50 rounded-full blur-3xl pointer-events-none" />

      <AnimatePresence mode="wait">
        {stage === 'boot' && (
          <motion.div key="boot" exit={{ opacity: 0 }} className="absolute inset-0 z-50">
            <BootScreen onComplete={() => setStage('lab')} />
          </motion.div>
        )}

        {stage === 'lab' && (
          <motion.div 
            key="lab"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, filter: 'blur(10px)' }}
            className="absolute inset-0 flex flex-col z-10"
          >
            {/* Header Area */}
            <div className="pt-6 pb-2 px-6 flex-none">
                <div className="w-full max-w-4xl mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="bg-white p-2 rounded-full shadow-sm border border-lab-border">
                        <Microscope size={24} className="text-lab-accent" />
                        </div>
                        <div>
                        <h1 className="font-bold text-slate-700 text-lg md:text-xl leading-tight">Biology Lab</h1>
                        <p className="text-[10px] md:text-xs font-mono text-slate-400">Exp. #1402: The "You" Effect</p>
                        </div>
                    </div>
                    <div className="hidden md:flex items-center gap-2 text-xs font-mono text-slate-400 bg-white/50 px-3 py-1 rounded-full">
                        <Dna size={14} /> Stable Environment
                    </div>
                </div>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto px-6 pb-32 pt-4">
                <div className="w-full max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-4">
                    {SPECIMENS.map((specimen) => (
                        <SpecimenCard 
                        key={specimen.id}
                        specimen={specimen}
                        isSelected={selectedSpecimen === specimen.id}
                        onClick={() => setSelectedSpecimen(specimen.id)}
                        />
                    ))}
                    
                    {/* Add extra padding element for mobile scrolling to ensure last item clears the floating button */}
                    <div className="h-20 md:hidden" />
                </div>
            </div>

            {/* Fixed Action Button */}
            <motion.div 
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="absolute bottom-6 left-0 right-0 flex justify-center px-6 z-20 pointer-events-none"
            >
              <button
                onClick={() => setStage('analyzing')}
                className="
                  pointer-events-auto
                  flex items-center gap-3 bg-gradient-to-r from-teal-500 to-emerald-500 
                  text-white px-8 py-4 rounded-2xl font-bold shadow-lg shadow-teal-200/50 
                  hover:scale-105 active:scale-95 transition-all w-full md:w-auto justify-center
                "
              >
                <div className="bg-white/20 p-1 rounded">
                    <ClipboardCheck size={20} />
                </div>
                <span>Start Final Test</span>
              </button>
            </motion.div>
          </motion.div>
        )}

        {stage === 'analyzing' && (
          <motion.div key="analyzing" className="absolute inset-0 z-50">
            <AnalyzingScreen onComplete={() => setStage('diagnosis')} />
          </motion.div>
        )}

        {stage === 'diagnosis' && (
          <motion.div key="diagnosis" className="absolute inset-0 z-40">
            <DiagnosisScreen 
              specimenId={selectedSpecimen || 'red'} 
              onBack={() => setStage('lab')} 
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default App;