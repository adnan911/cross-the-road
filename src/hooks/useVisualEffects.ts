import { useState, useCallback, useMemo } from 'react';
import { WeatherType } from '@/components/game/WeatherEffects';

interface TimeOfDay {
  name: 'dawn' | 'day' | 'dusk' | 'night';
  overlayColor: string;
  overlayOpacity: number;
  skyGradient: string;
}

const TIME_CYCLES: TimeOfDay[] = [
  { 
    name: 'dawn', 
    overlayColor: 'rgba(255, 180, 100, 0.15)', 
    overlayOpacity: 0.15,
    skyGradient: 'linear-gradient(to bottom, #ff9a56 0%, #ffcd82 50%, #87ceeb 100%)',
  },
  { 
    name: 'day', 
    overlayColor: 'transparent', 
    overlayOpacity: 0,
    skyGradient: 'linear-gradient(to bottom, #87ceeb 0%, #e0f4ff 100%)',
  },
  { 
    name: 'dusk', 
    overlayColor: 'rgba(255, 100, 50, 0.2)', 
    overlayOpacity: 0.2,
    skyGradient: 'linear-gradient(to bottom, #ff6b35 0%, #f7931a 30%, #ffd93d 60%, #1a1a2e 100%)',
  },
  { 
    name: 'night', 
    overlayColor: 'rgba(20, 20, 60, 0.4)', 
    overlayOpacity: 0.4,
    skyGradient: 'linear-gradient(to bottom, #0d1b2a 0%, #1b263b 50%, #415a77 100%)',
  },
];

const WEATHER_PATTERNS: WeatherType[] = ['clear', 'clear', 'clear', 'rain', 'snow', 'fog'];

export const useVisualEffects = (score: number) => {
  const [screenShake, setScreenShake] = useState(false);
  const [shakeIntensity, setShakeIntensity] = useState(0);

  // Time of day changes every 25 points
  const timeOfDay = useMemo((): TimeOfDay => {
    const cycleIndex = Math.floor(score / 25) % TIME_CYCLES.length;
    return TIME_CYCLES[cycleIndex];
  }, [score]);

  // Weather changes every 50 points with some randomness
  const weather = useMemo((): WeatherType => {
    if (score < 20) return 'clear';
    const weatherSeed = Math.floor(score / 50);
    return WEATHER_PATTERNS[weatherSeed % WEATHER_PATTERNS.length];
  }, [score]);

  // Trigger screen shake
  const triggerShake = useCallback((intensity: number = 8) => {
    setShakeIntensity(intensity);
    setScreenShake(true);
    setTimeout(() => setScreenShake(false), 300);
  }, []);

  // Generate shake transform
  const getShakeTransform = useCallback(() => {
    if (!screenShake) return '';
    const x = (Math.random() - 0.5) * shakeIntensity;
    const y = (Math.random() - 0.5) * shakeIntensity;
    return `translate(${x}px, ${y}px)`;
  }, [screenShake, shakeIntensity]);

  return {
    timeOfDay,
    weather,
    screenShake,
    triggerShake,
    getShakeTransform,
  };
};
