import React, { useState, useMemo } from 'react';
import { PredictionResult, UserInput, Category } from '../types';
import { COLLEGE_DATABASE } from '../constants';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import ReactMarkdown from 'react-markdown';

interface Props {
  results: PredictionResult;
  input: UserInput;
  onReset: () => void;
}

const ResultView: React.FC<Props> = ({ results, input, onReset }) => {
  const [filterType, setFilterType] = useState<'All' | 'NIT' | 'IIIT' | 'GFTI'>('All');
  const [filterText, setFilterText] = useState('');

  const chartData = [
    { name: 'Your Score', value: input.totalMarks, fill: '#3b82f6' },
    { name: 'Avg. Topper', value: 285, fill: '#334155' },
    { name: 'Cutoff', value: 90, fill: '#334155' },
  ];

  const filteredColleges = useMemo(() => {
    return COLLEGE_DATABASE.filter(college => {
      const matchType = filterType === 'All' || college.type === filterType;
      const matchText = college.name.toLowerCase().includes(filterText.toLowerCase()) || 
                        college.branch.toLowerCase().includes(filterText.toLowerCase());
      const matchCategory = college.category === input.category || college.category === Category.OPEN;

      return matchType && matchText && matchCategory;
    }).sort((a, b) => {
        return Math.abs(a.closingRank - results.rank) - Math.abs(b.closingRank - results.rank);
    });
  }, [filterType, filterText, input.category, results.rank]);

  return (
    <div className="max-w-5xl mx-auto px-4 pb-20 pt-8 animate-fade-in">
      <button 
        onClick={onReset}
        className="mb-6 flex items-center text-slate-400 hover:text-brand-400 transition-colors"
      >
        ← Back to Predictor
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Key Stats */}
        <div className="lg:col-span-2 space-y-6">
            
            {/* Rank Card */}
            <div className="bg-slate-900 rounded-2xl shadow-lg shadow-slate-950/50 border border-slate-800 overflow-hidden relative">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-brand-400 to-brand-600"></div>
                <div className="p-8 text-center">
                    <div className="grid grid-cols-2 gap-4 divide-x divide-slate-800">
                        <div>
                             <h3 className="text-slate-400 font-medium uppercase tracking-wider text-xs mb-2">Est. All India Rank</h3>
                             <div className="text-4xl font-extrabold text-white">
                                {results.rank.toLocaleString()}
                             </div>
                        </div>
                        <div>
                             <h3 className="text-slate-400 font-medium uppercase tracking-wider text-xs mb-2">Category Rank ({input.category})</h3>
                             <div className="text-4xl font-extrabold text-brand-500">
                                {results.categoryRank?.toLocaleString() || 'N/A'}
                             </div>
                        </div>
                    </div>
                    
                    <div className="mt-6 inline-block bg-brand-900/30 text-brand-300 border border-brand-900 px-3 py-1 rounded-full text-sm font-semibold">
                        Percentile: {results.percentile.toFixed(4)}
                    </div>
                    <p className="mt-4 text-xs text-slate-500">
                        *Based on historical data (2023-2025) & 14L+ applicants.
                    </p>
                </div>
            </div>

            {/* AI Analysis Card */}
            <div className="bg-slate-900 rounded-2xl shadow-md border border-slate-800 p-8">
                <div className="flex items-center gap-3 mb-4 border-b border-slate-800 pb-4">
                     <span className="p-2 bg-purple-900/30 text-purple-400 rounded-lg">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456ZM16.894 20.567 16.5 21.75l-.394-1.183a2.25 2.25 0 0 0-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 0 0 1.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 0 0 1.423 1.423l1.183.394-1.183.394a2.25 2.25 0 0 0-1.423 1.423Z" />
                        </svg>
                     </span>
                     <h3 className="text-xl font-bold text-slate-100">AI Counselor Insights</h3>
                </div>
                <div className="prose prose-sm md:prose-base prose-invert max-w-none text-slate-300">
                    <ReactMarkdown>{results.aiAnalysis}</ReactMarkdown>
                </div>
            </div>

            {/* College Cutoff Explorer */}
            <div className="bg-slate-900 rounded-2xl shadow-md border border-slate-800 overflow-hidden">
                <div className="p-6 border-b border-slate-800">
                    <h3 className="text-lg font-bold text-slate-100 mb-4">College Cutoff Explorer</h3>
                    <div className="flex flex-col sm:flex-row gap-4">
                        <div className="relative flex-grow">
                             <input 
                                type="text" 
                                placeholder="Search college or branch..." 
                                value={filterText}
                                onChange={(e) => setFilterText(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 bg-slate-950 border border-slate-700 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 text-white placeholder-slate-500"
                             />
                             <svg className="w-4 h-4 text-slate-500 absolute left-3 top-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                        </div>
                        <div className="flex gap-2">
                             {(['All', 'NIT', 'IIIT', 'GFTI'] as const).map(type => (
                                 <button 
                                    key={type}
                                    onClick={() => setFilterType(type)}
                                    className={`px-3 py-2 text-xs font-medium rounded-lg border transition-colors
                                        ${filterType === type 
                                            ? 'bg-brand-600 text-white border-brand-600' 
                                            : 'bg-slate-900 text-slate-400 border-slate-700 hover:bg-slate-800'}`}
                                 >
                                     {type}
                                 </button>
                             ))}
                        </div>
                    </div>
                </div>
                
                <div className="max-h-80 overflow-y-auto">
                    {filteredColleges.length > 0 ? (
                        <table className="w-full text-sm text-left">
                            <thead className="text-xs text-slate-500 uppercase bg-slate-950 sticky top-0">
                                <tr>
                                    <th className="px-6 py-3">College</th>
                                    <th className="px-6 py-3">Branch</th>
                                    <th className="px-6 py-3">Quota</th>
                                    <th className="px-6 py-3 text-right">Cutoff Rank</th>
                                    <th className="px-6 py-3 text-right">Chance</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-800">
                                {filteredColleges.map((college) => {
                                    const rankDiff = college.closingRank - (college.category === Category.OPEN ? results.rank : results.categoryRank!);
                                    let chance = 'Low';
                                    let color = 'text-red-400 bg-red-900/20 border border-red-900/30';
                                    
                                    if (rankDiff > 0) {
                                        chance = 'High';
                                        color = 'text-green-400 bg-green-900/20 border border-green-900/30';
                                    } else if (rankDiff > -1000) {
                                        chance = 'Medium';
                                        color = 'text-yellow-400 bg-yellow-900/20 border border-yellow-900/30';
                                    }

                                    return (
                                        <tr key={college.id} className="hover:bg-slate-800 transition-colors">
                                            <td className="px-6 py-4 font-medium text-slate-200">{college.name}</td>
                                            <td className="px-6 py-4 text-slate-400">{college.branch}</td>
                                            <td className="px-6 py-4 text-slate-500">{college.quota}</td>
                                            <td className="px-6 py-4 text-slate-200 text-right">{college.closingRank.toLocaleString()}</td>
                                            <td className="px-6 py-4 text-right">
                                                <span className={`px-2 py-1 rounded text-xs font-bold ${color}`}>
                                                    {chance}
                                                </span>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    ) : (
                        <div className="p-8 text-center text-slate-500">
                            No colleges found matching your criteria in our historical database.
                        </div>
                    )}
                </div>
                <div className="p-3 bg-slate-950 border-t border-slate-800 text-xs text-center text-slate-500">
                    Disclaimer: Cutoffs are estimates based on previous year data (JoSAA Round 6). Actual results may vary.
                </div>
            </div>
        </div>

        {/* Right Column: Visualization */}
        <div className="lg:col-span-1 space-y-6">
            <div className="bg-slate-900 p-6 rounded-2xl shadow-md border border-slate-800">
                <h3 className="font-bold text-slate-100 mb-6">Performance Viz</h3>
                <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={chartData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                            <XAxis dataKey="name" tick={{fontSize: 12, fill: '#94a3b8'}} />
                            <YAxis tick={{fill: '#94a3b8'}} />
                            <Tooltip cursor={{fill: '#334155'}} contentStyle={{ borderRadius: '8px', border: '1px solid #1e293b', backgroundColor: '#0f172a', color: '#fff' }}/>
                            <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                                {chartData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.fill} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>
                <div className="mt-4 grid grid-cols-3 gap-2 text-center text-xs">
                     <div className="bg-slate-950 p-2 rounded border border-slate-800">
                        <span className="block text-slate-500">Phy</span>
                        <span className="font-bold text-slate-300">{input.marks.physics}</span>
                     </div>
                     <div className="bg-slate-950 p-2 rounded border border-slate-800">
                        <span className="block text-slate-500">Chem</span>
                        <span className="font-bold text-slate-300">{input.marks.chemistry}</span>
                     </div>
                     <div className="bg-slate-950 p-2 rounded border border-slate-800">
                        <span className="block text-slate-500">Math</span>
                        <span className="font-bold text-slate-300">{input.marks.maths}</span>
                     </div>
                </div>
            </div>

            {/* AI Suggested Colleges */}
             <div className="bg-slate-900 p-5 rounded-2xl shadow-sm border border-slate-800">
                <h3 className="text-sm font-bold text-slate-100 mb-4 uppercase tracking-wide">Top AI Recommendations</h3>
                <div className="space-y-3">
                    {results.suggestedColleges.length > 0 ? (
                        results.suggestedColleges.slice(0, 3).map((college, idx) => (
                            <div key={idx} className="flex justify-between items-start text-sm border-b border-slate-800 last:border-0 pb-2 last:pb-0">
                                <div>
                                    <div className="font-semibold text-slate-200">{college.name}</div>
                                    <div className="text-xs text-slate-500">{college.branch}</div>
                                </div>
                                <div className={`text-xs font-bold ${college.probability === 'High' ? 'text-green-400' : 'text-yellow-400'}`}>
                                    {college.probability}
                                </div>
                            </div>
                        ))
                    ) : (
                         <div className="text-slate-500 text-xs italic">AI is generating suggestions...</div>
                    )}
                </div>
            </div>
        </div>

      </div>
    </div>
  );
};

export default ResultView;