import React, { useState } from 'react';
import { generateVideoScript, VideoScript } from './services/gemini';
import Renderer from './components/Renderer';
import { Sparkles, Loader2, PlayCircle, Zap, Layers, Cpu, ChevronRight } from 'lucide-react';

export default function App() {
  const [prompt, setPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [script, setScript] = useState<VideoScript | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showEditor, setShowEditor] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    setIsLoading(true);
    setError(null);
    try {
      const result = await generateVideoScript(prompt);
      setScript(result);
      setShowEditor(true);
    } catch (err: any) {
      console.error("Submission error:", err);
      let errorMessage = 'Failed to generate motion graphics. Please try again.';
      if (err?.message) {
        try {
          const parsed = JSON.parse(err.message);
          errorMessage = parsed.error?.message || parsed.message || err.message;
        } catch {
          errorMessage = err.message;
        }
      }
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  if (!showEditor) {
    return (
      <div className="min-h-screen bg-[#050505] text-white font-sans selection:bg-blue-500/30 overflow-x-hidden">
        {/* Navigation */}
        <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-8">
          <div className="max-w-7xl mx-auto flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-black">
                <PlayCircle size={24} />
              </div>
              <span className="font-display font-extrabold text-xl tracking-tighter uppercase">moshono</span>
            </div>
            <div className="hidden md:flex items-center gap-8 text-sm font-medium text-white/50">
              <a href="#" className="hover:text-white transition-colors">Showcase</a>
              <a href="#" className="hover:text-white transition-colors">Technology</a>
              <a href="#" className="hover:text-white transition-colors">Pricing</a>
              <button 
                onClick={() => setShowEditor(true)}
                className="px-5 py-2.5 bg-white text-black rounded-full hover:bg-white/90 transition-all font-bold"
              >
                Get Started
              </button>
            </div>
          </div>
        </nav>

        {/* Hero Section */}
        <section className="relative pt-40 pb-20 px-6 hero-gradient">
          <div className="max-w-5xl mx-auto text-center space-y-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-panel text-xs font-bold tracking-widest uppercase text-blue-400 animate-reveal">
              <Zap size={14} />
              The Future of Motion Design
            </div>
            
            <h1 className="text-6xl md:text-8xl font-display font-extrabold tracking-tighter leading-[0.9] animate-reveal [animation-delay:0.2s]">
              Cinematic Motion <br />
              <span className="text-white/30">from a single prompt.</span>
            </h1>

            <p className="max-w-2xl mx-auto text-xl text-white/50 leading-relaxed animate-reveal [animation-delay:0.4s]">
              moshono transforms your ideas into high-end motion graphics using advanced generative architecture. No keyframes. No complexity. Just pure cinematic output.
            </p>

            <div className="max-w-2xl mx-auto pt-8 animate-reveal [animation-delay:0.6s]">
              <form onSubmit={handleSubmit} className="relative group">
                <input
                  type="text"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="Describe your cinematic vision..."
                  className="w-full px-8 py-6 bg-white/5 border border-white/10 rounded-3xl text-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all placeholder:text-white/20"
                />
                <button
                  type="submit"
                  disabled={isLoading || !prompt.trim()}
                  className="absolute right-3 top-3 bottom-3 px-8 bg-white text-black rounded-2xl font-bold flex items-center gap-2 hover:bg-white/90 transition-all disabled:opacity-50"
                >
                  {isLoading ? <Loader2 className="animate-spin" size={20} /> : <ChevronRight size={20} />}
                  Generate
                </button>
              </form>
              {error && <p className="mt-4 text-red-400 text-sm">{error}</p>}
            </div>
          </div>
        </section>

        {/* Features Grid */}
        <section className="py-32 px-6">
          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="glass-panel p-10 rounded-[32px] space-y-6">
              <div className="w-12 h-12 bg-blue-500/20 rounded-2xl flex items-center justify-center text-blue-400">
                <Layers size={24} />
              </div>
              <h3 className="text-2xl font-bold">Multi-Layered Compositions</h3>
              <p className="text-white/40 leading-relaxed">Sophisticated depth with atmospheric textures, geometric motion, and cinematic typography.</p>
            </div>
            <div className="glass-panel p-10 rounded-[32px] space-y-6">
              <div className="w-12 h-12 bg-purple-500/20 rounded-2xl flex items-center justify-center text-purple-400">
                <Cpu size={24} />
              </div>
              <h3 className="text-2xl font-bold">Neural Motion Engine</h3>
              <p className="text-white/40 leading-relaxed">AI-driven camera movements and shape-shifting animations that respond to your prompt's mood.</p>
            </div>
            <div className="glass-panel p-10 rounded-[32px] space-y-6">
              <div className="w-12 h-12 bg-emerald-500/20 rounded-2xl flex items-center justify-center text-emerald-400">
                <Sparkles size={24} />
              </div>
              <h3 className="text-2xl font-bold">Pro Color Theory</h3>
              <p className="text-white/40 leading-relaxed">Intelligent color orchestration that creates cohesive visual identities for every generation.</p>
            </div>
          </div>
        </section>

        <footer className="py-20 px-6 border-t border-white/5 text-center text-white/20 text-sm uppercase tracking-widest font-bold">
          © 2026 moshono Motion Systems. All Rights Reserved.
        </footer>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans selection:bg-blue-500/30">
      <header className="px-8 py-6 flex items-center justify-between border-b border-white/5">
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => setShowEditor(false)}>
          <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center text-black">
            <PlayCircle size={18} />
          </div>
          <span className="font-display font-extrabold text-lg tracking-tighter uppercase">moshono</span>
        </div>
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setShowEditor(false)}
            className="text-sm font-bold text-white/40 hover:text-white transition-colors"
          >
            Back to Landing
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          {/* Left Column: Generator */}
          <div className="lg:col-span-4 space-y-12">
            <div className="space-y-4">
              <h2 className="text-4xl font-display font-extrabold tracking-tighter">
                Cinematic <br />
                <span className="text-white/30">Editor</span>
              </h2>
              <p className="text-white/40 leading-relaxed">
                Refine your vision. Describe the mood, colors, and motion patterns you want to see.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/30">Prompt Input</label>
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="e.g. Minimalist techno aesthetics with neon pulses..."
                  className="w-full h-40 p-6 bg-white/5 border border-white/10 rounded-2xl focus:ring-2 focus:ring-blue-500/50 focus:outline-none transition-all resize-none text-white placeholder:text-white/10"
                  disabled={isLoading}
                />
              </div>

              <button
                type="submit"
                disabled={isLoading || !prompt.trim()}
                className="w-full py-5 bg-white text-black font-bold rounded-2xl hover:bg-white/90 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="animate-spin" size={20} />
                    <span>Processing Neural Script...</span>
                  </>
                ) : (
                  <>
                    <Sparkles size={20} />
                    <span>Generate Motion</span>
                  </>
                )}
              </button>
            </form>

            {error && (
              <div className="p-5 glass-panel rounded-2xl text-red-400 text-sm border-red-500/20">
                <span className="font-bold uppercase text-[10px] block mb-1 opacity-50">System Error</span>
                {error}
              </div>
            )}

            <div className="space-y-4">
              <h4 className="text-[10px] font-bold text-white/20 uppercase tracking-[0.2em]">Quick Presets</h4>
              <div className="flex flex-wrap gap-2">
                {['Cyberpunk Neon', 'Minimalist Swiss', 'Organic Flow', 'Tech Noir'].map((suggestion) => (
                  <button
                    key={suggestion}
                    onClick={() => setPrompt(suggestion)}
                    className="px-4 py-2 bg-white/5 border border-white/10 rounded-full text-xs font-bold text-white/40 hover:border-white/30 hover:text-white transition-all"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Renderer */}
          <div className="lg:col-span-8">
            {script ? (
              <div className="space-y-8">
                <Renderer script={script} />
                <div className="glass-panel rounded-3xl p-8 space-y-6">
                  <div className="flex items-center justify-between">
                    <h4 className="text-[10px] font-bold text-white/30 uppercase tracking-[0.2em]">Neural Script Breakdown</h4>
                    <span className="text-[10px] font-mono text-blue-400 uppercase tracking-widest">Active Generation</span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {script.scenes.map((scene, i) => (
                      <div key={i} className="p-4 bg-white/5 rounded-xl border border-white/5 space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-[10px] font-mono text-white/20">SCENE_0{i + 1}</span>
                          <span className="text-[10px] font-mono text-blue-400/50 uppercase">{scene.cameraEffect}</span>
                        </div>
                        <p className="text-sm text-white/60 font-medium leading-relaxed">{scene.text}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="aspect-video glass-panel rounded-[32px] flex flex-col items-center justify-center text-white/10 space-y-6">
                <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center">
                  <PlayCircle size={48} />
                </div>
                <div className="text-center">
                  <p className="font-display font-extrabold text-2xl tracking-tight text-white/20 uppercase">Awaiting Input</p>
                  <p className="text-sm font-medium opacity-50">Your cinematic preview will render here</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
