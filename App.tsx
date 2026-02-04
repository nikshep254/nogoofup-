import React, { useState, useCallback, useRef, useEffect } from 'react';
import Hero from './components/Hero';
import PredictionForm from './components/PredictionForm';
import ResultView from './components/ResultView';
import ProfileView from './components/ProfileView';
import { UserInput, PredictionResult, CalculatedMetrics, Category, UserProfile, PredictionHistoryItem } from './types';
import { MARKS_VS_PERCENTILE, TOTAL_APPLICANTS, CATEGORY_WEIGHTS, ICONS } from './constants';
import { getAIAnalysis, getCollegeList } from './services/geminiService';

const App: React.FC = () => {
  const [view, setView] = useState<'home' | 'result' | 'profile'>('home');
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<PredictionResult | null>(null);
  const [userInput, setUserInput] = useState<UserInput | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  
  const formRef = useRef<HTMLDivElement>(null);

  // Load Profile from LocalStorage on mount
  useEffect(() => {
    const savedProfile = localStorage.getItem('jee_predictor_profile');
    if (savedProfile) {
        setUserProfile(JSON.parse(savedProfile));
    }
  }, []);

  const calculateMetrics = useCallback((totalMarks: number, category: Category): CalculatedMetrics => {
    // Basic linear interpolation for percentile
    let percentile = 0;
    
    // Sort descending just in case
    const data = [...MARKS_VS_PERCENTILE].sort((a, b) => b.marks - a.marks);

    if (totalMarks >= data[0].marks) {
        percentile = 100;
    } else if (totalMarks <= 0) {
        percentile = 0;
    } else {
        for (let i = 0; i < data.length - 1; i++) {
            if (totalMarks <= data[i].marks && totalMarks >= data[i + 1].marks) {
                const upper = data[i];
                const lower = data[i + 1];
                const range = upper.marks - lower.marks;
                const progress = (totalMarks - lower.marks) / range;
                const percRange = upper.percentile - lower.percentile;
                percentile = lower.percentile + (progress * percRange);
                break;
            }
        }
    }

    // AIR Rank Formula: ((100 - P) / 100) * Total_Candidates
    const rank = Math.ceil(((100 - percentile) / 100) * TOTAL_APPLICANTS) || 1;

    // Estimate Category Rank
    // This is a simplification. Real cat rank depends on cat-specific percentile.
    // We approximate by applying population weights to the AIR.
    const multiplier = CATEGORY_WEIGHTS[category];
    const categoryRank = category === Category.OPEN 
        ? rank 
        : Math.ceil(rank * multiplier);

    return { percentile, rank, categoryRank };
  }, []);

  const handlePrediction = async (input: UserInput) => {
    setIsLoading(true);
    setUserInput(input);

    // 1. Calculate Math locally
    const metrics = calculateMetrics(input.totalMarks, input.category);

    // 2. Fetch AI Insights
    const [aiAnalysis, suggestedColleges] = await Promise.all([
        getAIAnalysis(input, metrics),
        getCollegeList(input, metrics)
    ]);

    const fullResult: PredictionResult = {
        ...metrics,
        aiAnalysis,
        suggestedColleges
    };

    setResults(fullResult);

    // 3. Update Profile & History securely in LocalStorage
    const historyItem: PredictionHistoryItem = {
        id: Date.now().toString(),
        date: new Date().toISOString(),
        input: input,
        metrics: metrics
    };

    const updatedProfile: UserProfile = userProfile ? {
        ...userProfile,
        name: input.name, // update latest name
        history: [historyItem, ...userProfile.history].slice(0, 20), // keep last 20
        bestMarks: (!userProfile.bestMarks || input.totalMarks > (userProfile.bestMarks.physics + userProfile.bestMarks.chemistry + userProfile.bestMarks.maths)) ? input.marks : userProfile.bestMarks
    } : {
        name: input.name,
        category: input.category,
        homeState: input.state,
        bestMarks: input.marks,
        history: [historyItem]
    };

    setUserProfile(updatedProfile);
    localStorage.setItem('jee_predictor_profile', JSON.stringify(updatedProfile));

    setIsLoading(false);
    setView('result');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleScrollToForm = () => {
    if (view !== 'home') setView('home');
    setTimeout(() => {
        formRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const loadHistoryItem = async (input: UserInput, partialResult: PredictionResult) => {
      setIsLoading(true);
      // Re-fetch AI data because we don't store full AI response text in history to save space
      const [aiAnalysis, suggestedColleges] = await Promise.all([
        getAIAnalysis(input, partialResult),
        getCollegeList(input, partialResult)
      ]);

      setUserInput(input);
      setResults({
          ...partialResult,
          aiAnalysis,
          suggestedColleges
      });
      setIsLoading(false);
      setView('result');
      window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => setView('home')}>
                 <div className="w-8 h-8 bg-brand-600 rounded-lg flex items-center justify-center text-white font-bold text-xl">
                    n
                 </div>
                 <span className="font-bold text-slate-900 tracking-tight">nogoofup</span>
            </div>
            <nav className="hidden md:flex gap-6 text-sm font-medium text-slate-600">
                <button onClick={() => setView('home')} className="hover:text-brand-600 transition">Predictor</button>
                <button onClick={() => setView('profile')} className="hover:text-brand-600 transition">My Profile</button>
            </nav>
            <div className="flex gap-3">
                <button 
                    onClick={() => setView('profile')}
                    className="flex items-center gap-2 text-slate-600 hover:text-brand-600 font-medium text-sm transition"
                >
                    <span dangerouslySetInnerHTML={{__html: ICONS.history}} className="w-5 h-5" />
                    <span className="hidden sm:inline">History</span>
                </button>
            </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow">
        {view === 'home' && (
            <>
                <Hero scrollToForm={handleScrollToForm} />
                <div ref={formRef} className="px-4 bg-gradient-to-b from-white to-slate-50 pt-10">
                    <PredictionForm 
                        onSubmit={handlePrediction} 
                        isLoading={isLoading} 
                        initialData={userInput} // Pre-fill if they go back
                    />
                </div>
            </>
        )}

        {view === 'result' && results && userInput && (
            <ResultView 
                results={results} 
                input={userInput} 
                onReset={() => setView('home')} 
            />
        )}

        {view === 'profile' && userProfile ? (
            <ProfileView 
                profile={userProfile} 
                onBack={() => setView('home')}
                onSelectHistory={loadHistoryItem}
            />
        ) : view === 'profile' && !userProfile ? (
             <div className="max-w-4xl mx-auto px-4 py-20 text-center">
                <h2 className="text-2xl font-bold text-slate-900">No Profile Found</h2>
                <p className="text-slate-500 mb-6">Make a prediction to create your student profile.</p>
                <button onClick={() => setView('home')} className="bg-brand-600 text-white px-6 py-2 rounded-lg">Go to Predictor</button>
             </div>
        ) : null}
      </main>

      {/* Footer */}
      <footer className="bg-slate-50 border-t border-slate-200 py-12">
        <div className="max-w-7xl mx-auto px-4 text-center">
            <p className="text-slate-500 text-sm">
                © 2026 nogoofup. All rights reserved. <br/> 
                Disclaimer: Predictions use historical data (2023-2025). Actual ranks and cutoffs may vary.
            </p>
        </div>
      </footer>
    </div>
  );
};

export default App;