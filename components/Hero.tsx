import React from 'react';
import { ICONS } from '../constants';

const Hero: React.FC<{ scrollToForm: () => void }> = ({ scrollToForm }) => {
  return (
    <div className="relative pt-12 pb-16 lg:pt-20 lg:pb-24">
        {/* Background Grid */}
        <div className="absolute inset-0 z-0 grid-bg opacity-100 pointer-events-none"></div>

        <div className="relative z-10 max-w-4xl mx-auto text-center px-4 sm:px-6">
            <div className="inline-flex items-center space-x-2 bg-green-900/30 text-green-400 px-3 py-1 rounded-full text-xs font-semibold mb-6 border border-green-800 shadow-sm backdrop-blur-sm">
                <span dangerouslySetInnerHTML={{__html: ICONS.check}} />
                <span>No Hidden Charges, 100% Free</span>
            </div>

            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-white mb-4">
                <span className="text-brand-500 block mb-2">nogoofup</span>
                Rank Predictor 2026
            </h1>
            
            <p className="mt-4 text-lg md:text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed">
                Get accurate college predictions based on your expected JEE Marks or percentile. 
                Powered by advanced algorithms and AI insights.
            </p>

            <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
                <div className="bg-slate-900/50 backdrop-blur-sm p-6 rounded-xl border border-slate-800 flex items-center gap-4 text-left">
                    <div className="bg-blue-900/30 text-blue-400 p-3 rounded-lg" dangerouslySetInnerHTML={{__html: ICONS.userGroup}} />
                    <div>
                        <div className="font-bold text-slate-100">76,850+</div>
                        <div className="text-xs text-slate-400">Students Predicted</div>
                    </div>
                </div>
                <div className="bg-slate-900/50 backdrop-blur-sm p-6 rounded-xl border border-slate-800 flex items-center gap-4 text-left">
                    <div className="bg-green-900/30 text-green-400 p-3 rounded-lg" dangerouslySetInnerHTML={{__html: ICONS.chart}} />
                    <div>
                        <div className="font-bold text-slate-100">College Insights</div>
                        <div className="text-xs text-slate-400">Rank Prediction</div>
                    </div>
                </div>
                <div className="bg-slate-900/50 backdrop-blur-sm p-6 rounded-xl border border-slate-800 flex items-center gap-4 text-left">
                     <div className="bg-orange-900/30 text-orange-400 p-3 rounded-lg">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.563.563 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.563.563 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z" />
                        </svg>
                    </div>
                    <div>
                        <div className="font-bold text-slate-100">AI Powered</div>
                        <div className="text-xs text-slate-400">Smart Analysis</div>
                    </div>
                </div>
            </div>
            
            <div className="mt-12">
               <button 
                onClick={scrollToForm}
                className="bg-brand-600 text-white px-8 py-4 rounded-full font-bold text-lg shadow-lg shadow-brand-500/25 hover:bg-brand-500 transition-transform transform hover:-translate-y-1 active:translate-y-0"
               >
                 Predict My Rank Now
               </button>
            </div>
        </div>
    </div>
  );
};

export default Hero;