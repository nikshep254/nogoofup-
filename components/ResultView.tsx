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
    { name: 'Avg. Topper', value: 285, fill: '#e2e8f0' },
    { name: 'Cutoff', value: 90, fill: '#e2e8f0' },
  ];

  // Logic to filter colleges based on user input rank and database
  const filteredColleges = useMemo(() => {
    // We show colleges where the closing rank is within reasonable range (e.g. up to 20% higher than prediction)
    // or if the prediction is much better than cutoff.
    // For demo purposes, we show all that match the filter.
    return COLLEGE_DATABASE.filter(college => {
      const matchType = filterType === 'All' || college.type === filterType;
      const matchText = college.name.toLowerCase().includes(filterText.toLowerCase()) || 
                        college.branch.toLowerCase().includes(filterText.toLowerCase());
      
      // Category match logic:
      // If user is OPEN, show OPEN cutoffs.
      // If user is OBC, show OBC cutoffs. 
      // Simplified: We filter database items that match user category OR are OPEN (since categories can apply for Open seats)
      const matchCategory = college.category === input.category || college.category === Category.OPEN;

      return matchType && matchText && matchCategory;
    }).sort((a, b) => {
        // Sort by how close the rank is to the user's rank
        return Math.abs(a.closingRank - results.rank) - Math.abs(b.closingRank - results.rank);
    });
  }, [filterType, filterText, input.category, results.rank]);

  return (
    <div className="max-w-5xl mx-auto px-4 pb-20 pt-8 animate-fade-in">
      <button 
        onClick={onReset}
        className="mb-6 flex items-center text-slate-500 hover:text-brand-600 transition-colors"
      >
        ← Back to Predictor
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Key Stats */}
        <div className="lg:col-span-2 space-y-6">
            
            {/* Rank Card */}
            <div className="bg-white rounded-2xl shadow-lg border border-slate-100 overflow-hidden relative">
                <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-brand-400 to-brand-600"></div>
                <div className="p-8 text-center">
                    <div className="grid grid-cols-2 gap-4 divide-x divide-slate-100">
                        <div>
                             <h3 className="text-slate-500 font-medium uppercase tracking-wider text-xs mb-2">Est. All India Rank</h3>
                             <div className="text-4xl font-extrabold text-slate-900">
                                {results.rank.toLocaleString()}
                             </div>
                        </div>
                        <div>
                             <h3 className="text-slate-500 font-medium uppercase tracking-wider text-xs mb-2">Category Rank ({input.category})</h3>
                             <div className="text-4xl font-extrabold text-brand-600">
                                {results.categoryRank?.toLocaleString() || 'N/A'}
                             </div>
                        </div>
                    </div>
                    
                    <div className="mt-6 inline-block bg-brand-50 text-brand-700 px-3 py-1 rounded-full text-sm font-semibold">
                        Percentile: {results.percentile.toFixed(4)}
                    </div>
                    <p className="mt-4 text-xs text-slate-400">
                        *Based on historical data (2023-2025) & 14L+ applicants.
                    </p>
                </div>
            </div>

            {/* AI Analysis Card */}
            <div className="bg-white rounded-2xl shadow-md border border-slate-100 p-8">
                <div className="flex items-center gap-3 mb-4 border-b border-slate-100 pb-4">
                     <span className="p-2 bg-purple-100 text-purple-600 rounded-lg">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456ZM16.894 20.567 16.5 21.75l-.394-1.183a2.25 2.25 0 0 0-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 0 0 1.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 0 0 1.423 1.423l1.183.394-1.183.394a2.25 2.25 0 0 0-1.423 1.423Z" />
                        </svg>
                     </span>
                     <h3 className="text-xl font-bold text-slate-800">AI Counselor Insights</h3>
                </div>
                <div className="prose prose-sm md:prose-base prose-slate max-w-none text-slate-600">
                    <ReactMarkdown>{results.aiAnalysis}</ReactMarkdown>
                </div>
            </div>

            {/* College Cutoff Explorer */}
            <div className="bg-white rounded-2xl shadow-md border border-slate-100 overflow-hidden">
                <div className="p-6 border-b border-slate-100">
                    <h3 className="text-lg font-bold text-slate-900 mb-4">College Cutoff Explorer</h3>
                    <div className="flex flex-col sm:flex-row gap-4">
                        <div className="relative flex-grow">
                             <input 
                                type="text" 
                                placeholder="Search college or branch..." 
                                value={filterText}
                                onChange={(e) => setFilterText(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                             />
                             <svg className="w-4 h-4 text-slate-400 absolute left-3 top-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                        </div>
                        <div className="flex gap-2">
                             {(['All', 'NIT', 'IIIT', 'GFTI'] as const).map(type => (
                                 <button 
                                    key={type}
                                    onClick={() => setFilterType(type)}
                                    className={`px-3 py-2 text-xs font-medium rounded-lg border transition-colors
                                        ${filterType === type 
                                            ? 'bg-brand-600 text-white border-brand-600' 
                                            : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'}`}
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
                            <thead className="text-xs text-slate-500 uppercase bg-slate-50 sticky top-0">
                                <tr>
                                    <th className="px-6 py-3">College</th>
                                    <th className="px-6 py-3">Branch</th>
                                    <th className="px-6 py-3">Quota</th>
                                    <th className="px-6 py-3 text-right">Cutoff Rank</th>
                                    <th className="px-6 py-3 text-right">Chance</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {filteredColleges.map((college) => {
                                    // Calculate simple chance based on rank
                                    const rankDiff = college.closingRank - (college.category === Category.OPEN ? results.rank : results.categoryRank!);
                                    let chance = 'Low';
                                    let color = 'text-red-600 bg-red-50';
                                    
                                    if (rankDiff > 0) {
                                        chance = 'High';
                                        color = 'text-green-600 bg-green-50';
                                    } else if (rankDiff > -1000) {
                                        chance = 'Medium';
                                        color = 'text-yellow-600 bg-yellow-50';
                                    }

                                    return (
                                        <tr key={college.id} className="hover:bg-slate-50 transition-colors">
                                            <td className="px-6 py-4 font-medium text-slate-900">{college.name}</td>
                                            <td className="px-6 py-4 text-slate-600">{college.branch}</td>
                                            <td className="px-6 py-4 text-slate-500">{college.quota}</td>
                                            <td className="px-6 py-4 text-slate-900 text-right">{college.closingRank.toLocaleString()}</td>
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
                <div className="p-3 bg-slate-50 border-t border-slate-200 text-xs text-center text-slate-400">
                    Disclaimer: Cutoffs are estimates based on previous year data (JoSAA Round 6). Actual results may vary.
                </div>
            </div>
        </div>

        {/* Right Column: Visualization */}
        <div className="lg:col-span-1 space-y-6">
            <div className="bg-white p-6 rounded-2xl shadow-md border border-slate-100">
                <h3 className="font-bold text-slate-800 mb-6">Performance Viz</h3>
                <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={chartData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                            <XAxis dataKey="name" tick={{fontSize: 12}} />
                            <YAxis />
                            <Tooltip cursor={{fill: 'transparent'}} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}/>
                            <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                                {chartData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.fill} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>
                <div className="mt-4 grid grid-cols-3 gap-2 text-center text-xs">
                     <div className="bg-slate-50 p-2 rounded">
                        <span className="block text-slate-400">Phy</span>
                        <span className="font-bold text-slate-700">{input.marks.physics}</span>
                     </div>
                     <div className="bg-slate-50 p-2 rounded">
                        <span className="block text-slate-400">Chem</span>
                        <span className="font-bold text-slate-700">{input.marks.chemistry}</span>
                     </div>
                     <div className="bg-slate-50 p-2 rounded">
                        <span className="block text-slate-400">Math</span>
                        <span className="font-bold text-slate-700">{input.marks.maths}</span>
                     </div>
                </div>
            </div>

            {/* AI Suggested Colleges (Legacy/AI Generated) */}
             <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100">
                <h3 className="text-sm font-bold text-slate-800 mb-4 uppercase tracking-wide">Top AI Recommendations</h3>
                <div className="space-y-3">
                    {results.suggestedColleges.length > 0 ? (
                        results.suggestedColleges.slice(0, 3).map((college, idx) => (
                            <div key={idx} className="flex justify-between items-start text-sm border-b border-slate-50 last:border-0 pb-2 last:pb-0">
                                <div>
                                    <div className="font-semibold text-slate-900">{college.name}</div>
                                    <div className="text-xs text-slate-500">{college.branch}</div>
                                </div>
                                <div className={`text-xs font-bold ${college.probability === 'High' ? 'text-green-600' : 'text-yellow-600'}`}>
                                    {college.probability}
                                </div>
                            </div>
                        ))
                    ) : (
                         <div className="text-slate-400 text-xs italic">AI is generating suggestions...</div>
                    )}
                </div>
            </div>
        </div>

      </div>
    </div>
  );
};

export default ResultView;