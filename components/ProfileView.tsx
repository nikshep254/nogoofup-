import React from 'react';
import { UserProfile, UserInput, PredictionResult } from '../types';

interface Props {
  profile: UserProfile;
  onSelectHistory: (input: UserInput, result: PredictionResult) => void;
  onBack: () => void;
}

const ProfileView: React.FC<Props> = ({ profile, onSelectHistory, onBack }) => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12 animate-fade-in">
       <button 
        onClick={onBack}
        className="mb-6 flex items-center text-slate-400 hover:text-brand-400 transition-colors"
      >
        ← Back to Predictor
      </button>

      <div className="bg-slate-900 rounded-2xl shadow-lg border border-slate-800 overflow-hidden mb-8">
        <div className="bg-slate-950 p-8 text-white border-b border-slate-800">
            <h2 className="text-3xl font-bold mb-2">Student Profile</h2>
            <div className="flex gap-6 mt-4 text-sm text-slate-400">
                <div>
                    <span className="block uppercase text-xs tracking-wider opacity-70">Name</span>
                    <span className="font-semibold text-white">{profile.name}</span>
                </div>
                <div>
                    <span className="block uppercase text-xs tracking-wider opacity-70">Category</span>
                    <span className="font-semibold text-white">{profile.category}</span>
                </div>
                <div>
                    <span className="block uppercase text-xs tracking-wider opacity-70">Home State</span>
                    <span className="font-semibold text-white">{profile.homeState}</span>
                </div>
            </div>
        </div>
        <div className="p-8">
            <h3 className="font-bold text-lg text-slate-200 mb-4">Best Performance</h3>
            {profile.bestMarks ? (
                <div className="grid grid-cols-4 gap-4 max-w-lg">
                    <div className="bg-slate-950 p-3 rounded-lg text-center border border-slate-800">
                        <div className="text-2xl font-bold text-brand-500">
                            {profile.bestMarks.physics + profile.bestMarks.chemistry + profile.bestMarks.maths}
                        </div>
                        <div className="text-xs text-slate-500">Total</div>
                    </div>
                    <div className="bg-slate-950 p-3 rounded-lg text-center border border-slate-800 border-t-2 border-t-blue-500">
                        <div className="text-lg font-bold text-slate-300">{profile.bestMarks.physics}</div>
                        <div className="text-xs text-slate-500">Physics</div>
                    </div>
                    <div className="bg-slate-950 p-3 rounded-lg text-center border border-slate-800 border-t-2 border-t-green-500">
                        <div className="text-lg font-bold text-slate-300">{profile.bestMarks.chemistry}</div>
                        <div className="text-xs text-slate-500">Chem</div>
                    </div>
                    <div className="bg-slate-950 p-3 rounded-lg text-center border border-slate-800 border-t-2 border-t-red-500">
                        <div className="text-lg font-bold text-slate-300">{profile.bestMarks.maths}</div>
                        <div className="text-xs text-slate-500">Maths</div>
                    </div>
                </div>
            ) : (
                <p className="text-slate-500 text-sm">No predictions made yet.</p>
            )}
        </div>
      </div>

      <h3 className="font-bold text-xl text-slate-200 mb-4 px-2">Prediction History</h3>
      <div className="space-y-4">
        {profile.history.length > 0 ? (
            profile.history.map((item) => (
                <div key={item.id} className="bg-slate-900 p-5 rounded-xl shadow-sm border border-slate-800 flex items-center justify-between hover:border-brand-500/50 transition-colors">
                    <div>
                        <div className="flex items-center gap-3">
                            <span className="font-bold text-slate-100 text-lg">
                                {item.input.totalMarks} Marks
                            </span>
                            <span className="text-sm text-slate-500 bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                                {new Date(item.date).toLocaleDateString()}
                            </span>
                        </div>
                        <div className="text-sm text-slate-500 mt-1">
                            Predicted Rank: <span className="text-brand-500 font-semibold">{item.metrics.rank.toLocaleString()}</span> • Percentile: {item.metrics.percentile.toFixed(2)}
                        </div>
                    </div>
                    <button 
                        onClick={() => onSelectHistory(item.input, { ...item.metrics, aiAnalysis: '', suggestedColleges: [] })}
                        className="text-brand-500 font-medium text-sm hover:underline"
                    >
                        View Details →
                    </button>
                </div>
            ))
        ) : (
            <div className="text-center py-12 bg-slate-900 rounded-xl border border-dashed border-slate-800">
                <p className="text-slate-500">You haven't made any predictions yet.</p>
            </div>
        )}
      </div>
    </div>
  );
};

export default ProfileView;