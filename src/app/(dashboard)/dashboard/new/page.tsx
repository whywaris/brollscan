'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';

export default function NewScanPage() {
  const router = useRouter();
  const [scriptText, setScriptText] = useState('');
  const [title, setTitle] = useState('');
  const [analyzing, setAnalyzing] = useState(false);
  const [error, setError] = useState('');
  const [dragOver, setDragOver] = useState(false);
  const [fileName, setFileName] = useState('');

  const handleFileUpload = useCallback(async (file: File) => {
    setError('');
    setFileName(file.name);

    if (file.name.endsWith('.txt')) {
      const text = await file.text();
      setScriptText(text);
      if (!title) setTitle(file.name.replace('.txt', ''));
    } else if (file.name.endsWith('.docx')) {
      const formData = new FormData();
      formData.append('file', file);

      try {
        const res = await fetch('/api/upload/parse-docx', {
          method: 'POST',
          body: formData,
        });

        if (!res.ok) throw new Error('Failed to parse document');

        const data = await res.json();
        setScriptText(data.text);
        if (!title) setTitle(file.name.replace('.docx', ''));
      } catch {
        setError('Failed to parse .docx file. Please try pasting the text instead.');
      }
    } else {
      setError('Unsupported file format. Please upload a .txt or .docx file.');
    }
  }, [title]);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragOver(false);
      const file = e.dataTransfer.files[0];
      if (file) handleFileUpload(file);
    },
    [handleFileUpload]
  );

  const handleAnalyze = async () => {
    if (!scriptText.trim()) {
      setError('Please enter or upload a script to analyze.');
      return;
    }

    setAnalyzing(true);
    setError('');

    try {
      const res = await fetch('/api/scripts/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: scriptText, title: title || undefined }),
      });

      if (res.status === 402) {
        setError('You\'ve reached your free plan limit. Upgrade to analyze more scripts.');
        setAnalyzing(false);
        return;
      }

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Analysis failed');
      }

      const data = await res.json();
      
      try {
        const localScripts = JSON.parse(localStorage.getItem('brollscan_scripts') || '[]');
        localScripts.push(data.script);
        localStorage.setItem('brollscan_scripts', JSON.stringify(localScripts));
        localStorage.setItem(`brollscan_scenes_${data.script.id}`, JSON.stringify(data.scenes));
      } catch (e) {
        console.warn('Failed to save to localStorage:', e);
      }

      router.push(`/dashboard/scripts/${data.script.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
      setAnalyzing(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto animate-fade-in">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl lg:text-3xl font-heading font-bold text-white">
          New Script Scan
        </h1>
        <p className="text-gray-400 mt-1">
          Paste your video script or upload a file to find matching B-roll footage
        </p>
      </div>

      {/* Title input */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Script Title <span className="text-gray-500">(optional)</span>
        </label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g. Product Launch Video, Travel Vlog Intro..."
          className="input-field"
        />
      </div>

      {/* File upload zone */}
      <div
        className={`mb-6 border-2 border-dashed rounded-xl p-8 text-center transition-all duration-200 cursor-pointer ${
          dragOver
            ? 'border-violet bg-violet/5'
            : 'border-dark-300 hover:border-dark-400 hover:bg-dark-100/30'
        }`}
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        onClick={() => {
          const input = document.createElement('input');
          input.type = 'file';
          input.accept = '.txt,.docx';
          input.onchange = (e) => {
            const file = (e.target as HTMLInputElement).files?.[0];
            if (file) handleFileUpload(file);
          };
          input.click();
        }}
      >
        <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-violet/10 flex items-center justify-center">
          <svg className="w-6 h-6 text-violet-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
          </svg>
        </div>
        <p className="text-sm text-gray-300 mb-1">
          {fileName ? (
            <span className="text-mint">{fileName} loaded</span>
          ) : (
            <>
              <span className="text-violet-300 font-medium">Click to upload</span> or drag and drop
            </>
          )}
        </p>
        <p className="text-xs text-gray-500">
          Supports .txt and .docx files
        </p>
      </div>

      {/* Divider */}
      <div className="flex items-center gap-4 mb-6">
        <div className="flex-1 h-px bg-dark-300" />
        <span className="text-xs text-gray-500 uppercase tracking-wider">or paste your script</span>
        <div className="flex-1 h-px bg-dark-300" />
      </div>

      {/* Script textarea */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Script Text
        </label>
        <textarea
          value={scriptText}
          onChange={(e) => setScriptText(e.target.value)}
          placeholder="Paste your video script here...&#10;&#10;The script will be analyzed by AI to identify visual scenes and find matching B-roll footage from Pexels and Pixabay."
          className="textarea-field min-h-[300px] font-mono text-sm leading-relaxed"
          rows={15}
        />
        <div className="flex items-center justify-between mt-2">
          <p className="text-xs text-gray-500">
            {scriptText.length > 0 && (
              <>
                {scriptText.split(/\s+/).filter(Boolean).length} words •{' '}
                {scriptText.length.toLocaleString()} characters
              </>
            )}
          </p>
          {scriptText.length > 0 && (
            <button
              onClick={() => {
                setScriptText('');
                setFileName('');
              }}
              className="text-xs text-gray-500 hover:text-gray-300 transition-colors"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Error message */}
      {error && (
        <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
          <p className="text-sm text-red-400">{error}</p>
        </div>
      )}

      {/* Analyze button */}
      <button
        onClick={handleAnalyze}
        disabled={analyzing || !scriptText.trim()}
        className="btn-primary w-full flex items-center justify-center gap-3 text-base py-4"
      >
        {analyzing ? (
          <>
            <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            Analyzing Script with AI...
          </>
        ) : (
          <>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            Analyze Script & Find B-Roll
          </>
        )}
      </button>

      {/* Info */}
      <p className="text-center text-xs text-gray-500 mt-4">
        Your script will be analyzed by AI to identify 8–20 visual scenes, then matched with stock footage from Pexels and Pixabay.
      </p>
    </div>
  );
}
