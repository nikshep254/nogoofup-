import React, { useState, useEffect } from 'react';
import { Category, UserInput, STATES } from '../types';

interface Props {
  onSubmit: (data: UserInput) => void;
  isLoading: boolean;
  initialData?: UserInput | null;
}

const PredictionForm: React.FC<Props> = ({ onSubmit, isLoading, initialData }) => {
  const [formData, setFormData] = useState<UserInput>({
    name: '',
    marks: { physics: 0, chemistry: 0, maths: 0 },
    totalMarks: 0,
    category: Category.OPEN,
    state: 'Delhi'
  });

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    }
  }, [initialData]);

  useEffect(() => {
    const total = (formData.marks.physics || 0) + (formData.marks.chemistry || 0) + (formData.marks.maths || 0);
    setFormData(prev => ({ ...prev, totalMarks: total }));
  }, [formData.marks]);

  const handleSubjectChange = (subject: keyof typeof formData.marks, value: string) => {
    const numValue = Math.min(100, Math.max(0, Number(value)));
    setFormData(prev => ({
        ...prev,
        marks: {
            ...prev.marks,
            [subject]: numValue
        }
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.totalMarks > 300) {
        alert("Total marks cannot exceed 300");
        return;
    }
    onSubmit(formData);
  };

  return (
    <div id="prediction-form" className="max-w-xl mx-auto bg-white p-8 rounded-2xl shadow-xl border border-slate-100 mb-20 relative z-10">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-slate-900">Enter Your Details</h2>
        <p className="text-slate-500 text-sm mt-1">Provide subject-wise marks for accurate analysis</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Name</label>
            <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none"
                placeholder="Your Name"
            />
        </div>

        {/* Subject Marks Inputs */}
        <div className="grid grid-cols-3 gap-4">
            <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Physics</label>
                <input
                    type="number"
                    min="0"
                    max="100"
                    value={formData.marks.physics || ''}
                    onChange={(e) => handleSubjectChange('physics', e.target.value)}
                    className="w-full px-3 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-brand-500 outline-none text-center font-mono"
                    placeholder="0-100"
                />
            </div>
            <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Chemistry</label>
                <input
                    type="number"
                    min="0"
                    max="100"
                    value={formData.marks.chemistry || ''}
                    onChange={(e) => handleSubjectChange('chemistry', e.target.value)}
                    className="w-full px-3 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-brand-500 outline-none text-center font-mono"
                    placeholder="0-100"
                />
            </div>
            <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Maths</label>
                <input
                    type="number"
                    min="0"
                    max="100"
                    value={formData.marks.maths || ''}
                    onChange={(e) => handleSubjectChange('maths', e.target.value)}
                    className="w-full px-3 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-brand-500 outline-none text-center font-mono"
                    placeholder="0-100"
                />
            </div>
        </div>

        <div className="flex justify-between items-center bg-slate-50 p-3 rounded-lg border border-slate-200">
            <span className="text-sm text-slate-600 font-medium">Total Marks:</span>
            <span className={`text-xl font-bold ${formData.totalMarks > 300 ? 'text-red-500' : 'text-brand-600'}`}>
                {formData.totalMarks} / 300
            </span>
        </div>

        {/* Category Input */}
        <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
                Category
            </label>
            <select
                value={formData.category}
                onChange={(e) => setFormData({...formData, category: e.target.value as Category})}
                className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition-colors outline-none bg-white"
            >
                {Object.values(Category).map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                ))}
            </select>
        </div>

        {/* State Input */}
        <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
                Home State
            </label>
            <select
                value={formData.state}
                onChange={(e) => setFormData({...formData, state: e.target.value})}
                className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition-colors outline-none bg-white"
            >
                {STATES.map((state) => (
                    <option key={state} value={state}>{state}</option>
                ))}
            </select>
        </div>

        <button
            type="submit"
            disabled={isLoading || formData.totalMarks === 0}
            className={`w-full py-4 px-6 rounded-xl text-white font-bold text-lg shadow-md transition-all
                ${(isLoading || formData.totalMarks === 0) 
                    ? 'bg-slate-400 cursor-not-allowed' 
                    : 'bg-brand-600 hover:bg-brand-700 hover:shadow-lg active:scale-[0.98]'
                }`}
        >
            {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Analyzing Data...
                </span>
            ) : (
                'Calculate Rank'
            )}
        </button>
      </form>
    </div>
  );
};

export default PredictionForm;