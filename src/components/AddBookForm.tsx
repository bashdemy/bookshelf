'use client';

import { useState } from 'react';

export default function AddBookForm() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage('');

    const formData = new FormData(e.currentTarget);
    const data = {
      title: formData.get('title') as string,
      author: formData.get('author') as string,
      status: formData.get('status') as string,
      notes: formData.get('notes') as string,
      adminKey: formData.get('adminKey') as string,
    };

    try {
      const response = await fetch('/api/books', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        setMessage('Book added successfully!');
        e.currentTarget.reset();
        setIsExpanded(false);
        // Refresh the page to show the new book
        window.location.reload();
      } else {
        const error = await response.text();
        setMessage(`Error: ${error}`);
      }
    } catch (error) {
      setMessage('Error adding book. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-[#c9b7b4] overflow-hidden">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex items-center justify-between w-full p-6 text-left hover:bg-[#d9a6b3]/20 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-pink-500 to-dusty-500 rounded-lg">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
          </div>
          <h2 className="text-xl font-bold text-[#232020]">Add New Book</h2>
        </div>
        <div className={`text-2xl font-light transition-transform duration-300 ${isExpanded ? 'rotate-45' : 'rotate-0'}`}>
          <svg className="w-6 h-6 text-[#b57281]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
        </div>
      </button>

      {isExpanded && (
        <div className="px-6 pb-6 animate-slide-up">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label htmlFor="title" className="flex items-center gap-2 text-sm font-semibold text-[#704a51]">
                  <svg className="w-4 h-4 text-[#b57281]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
                    <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
                  </svg>
                  Title *
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  required
                  className="w-full px-4 py-3 border border-[#c9b7b4] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#b57281] focus:border-transparent bg-white/90 backdrop-blur-sm transition-all duration-300"
                  placeholder="Enter book title..."
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="author" className="flex items-center gap-2 text-sm font-semibold text-[#704a51]">
                  <svg className="w-4 h-4 text-[#b57281]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                    <circle cx="12" cy="7" r="4"></circle>
                  </svg>
                  Author *
                </label>
                <input
                  type="text"
                  id="author"
                  name="author"
                  required
                  className="w-full px-4 py-3 border border-[#c9b7b4] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#b57281] focus:border-transparent bg-white/90 backdrop-blur-sm transition-all duration-300"
                  placeholder="Enter author name..."
                />
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="status" className="flex items-center gap-2 text-sm font-semibold text-[#704a51]">
                <svg className="w-4 h-4 text-[#b57281]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
                  <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
                </svg>
                Status
              </label>
              <select
                id="status"
                name="status"
                className="w-full px-4 py-3 border border-[#c9b7b4] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#b57281] focus:border-transparent bg-white/90 backdrop-blur-sm transition-all duration-300"
              >
                <option value="to-read">To Read</option>
                <option value="reading">Currently Reading</option>
                <option value="completed">Completed</option>
              </select>
            </div>

            <div className="space-y-2">
              <label htmlFor="notes" className="flex items-center gap-2 text-sm font-semibold text-[#704a51]">
                <svg className="w-4 h-4 text-[#b57281]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                  <polyline points="14,2 14,8 20,8"></polyline>
                  <line x1="16" y1="13" x2="8" y2="13"></line>
                  <line x1="16" y1="17" x2="8" y2="17"></line>
                  <polyline points="10,9 9,9 8,9"></polyline>
                </svg>
                Notes
              </label>
              <textarea
                id="notes"
                name="notes"
                rows={3}
                className="w-full px-4 py-3 border border-[#c9b7b4] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#b57281] focus:border-transparent bg-white/90 backdrop-blur-sm transition-all duration-300 resize-none"
                placeholder="Any thoughts or notes about this book..."
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="adminKey" className="flex items-center gap-2 text-sm font-semibold text-[#704a51]">
                <svg className="w-4 h-4 text-[#b57281]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                  <circle cx="12" cy="16" r="1"></circle>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                </svg>
                Admin Key *
              </label>
              <input
                type="password"
                id="adminKey"
                name="adminKey"
                required
                className="w-full px-4 py-3 border border-[#c9b7b4] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#b57281] focus:border-transparent bg-white/90 backdrop-blur-sm transition-all duration-300"
                placeholder="Enter admin key to add book"
              />
            </div>

            {message && (
              <div className={`p-4 rounded-xl border ${
                message.includes('Error') 
                  ? 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 border-red-200 dark:border-red-800' 
                  : 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 border-green-200 dark:border-green-800'
              }`}>
                {message}
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-gradient-to-r from-[#b57281] to-[#94596b] hover:from-[#a34d6d] hover:to-[#704a51] text-white py-3 px-6 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <svg className="w-5 h-5 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path d="M21 12a9 9 0 11-6.219-8.56"></path>
                  </svg>
                  Adding...
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <line x1="12" y1="5" x2="12" y2="19"></line>
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                  </svg>
                  Add Book
                </>
              )}
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
