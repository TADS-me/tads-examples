import { useState, useEffect } from 'react';

interface UserStats {
  maxScore: number;
  coins: number;
}

const STORAGE_KEY = 'user_stats';

export const useUserStats = () => {
  const [stats, setStats] = useState<UserStats>(() => {
    // Try to load data from localStorage
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (error) {
      console.warn('Failed to load user stats from localStorage:', error);
    }
    
    // Return default values
    return {
      maxScore: 0,
      coins: 100, // Initial number of coins
    };
  });

  // Save data to localStorage when changed
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(stats));
    } catch (error) {
      console.warn('Failed to save user stats to localStorage:', error);
    }
  }, [stats]);

  // Function to update maximum score
  const updateMaxScore = (newScore: number) => {
    setStats(prev => ({
      ...prev,
      maxScore: Math.max(prev.maxScore, newScore),
    }));
  };

  // Function to change number of coins
  const updateCoins = (change: number) => {
    setStats(prev => ({
      ...prev,
      coins: Math.max(0, prev.coins + change), // Don't allow going negative
    }));
  };

  // Function to reset statistics
  const resetStats = () => {
    setStats({
      maxScore: 0,
      coins: 100,
    });
  };

  return {
    ...stats,
    updateMaxScore,
    updateCoins,
    resetStats,
  };
};
