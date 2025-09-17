import React, { useEffect, useRef, useState } from 'react';

const Video = () => {
  const videoRef = useRef(null);
  const containerRef = useRef(null);
  const [videoState, setVideoState] = useState({
    isLoaded: false,
    isPlaying: false,
    hasError: false,
    canPlay: false
  });

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    let playAttempts = 0;
    const maxPlayAttempts = 3;

    // Enhanced video loading and playback handling
    const handleLoadedData = () => {
      console.log('Background video loaded');
      setVideoState(prev => ({ ...prev, isLoaded: true, hasError: false }));
      
      // Force iOS-specific properties
      video.muted = true;
      video.playsInline = true;
      video.setAttribute('playsinline', 'true');
      video.setAttribute('webkit-playsinline', 'true');
      video.setAttribute('muted', 'true');
      
      attemptPlay();
    };

    const handleCanPlay = () => {
      console.log('Background video can play');
      setVideoState(prev => ({ ...prev, canPlay: true }));
      attemptPlay();
    };

    const handlePlay = () => {
      console.log('Background video started playing');
      setVideoState(prev => ({ ...prev, isPlaying: true, hasError: false }));
    };

    const handlePause = () => {
      console.log('Background video paused');
      setVideoState(prev => ({ ...prev, isPlaying: false }));
      // Try to resume if paused unexpectedly
      if (!video.ended) {
        setTimeout(() => attemptPlay(), 100);
      }
    };

    const handleError = (e) => {
      console.error('Background video error:', e);
      setVideoState(prev => ({ ...prev, hasError: true, isPlaying: false }));
    };

    const attemptPlay = async () => {
      if (playAttempts >= maxPlayAttempts) {
        console.warn('Max play attempts reached for background video');
        return;
      }

      playAttempts++;
      console.log(`Background video play attempt ${playAttempts}`);

      try {
        // Ensure video is ready
        if (video.readyState >= 2) {
          const playPromise = video.play();
          
          if (playPromise !== undefined) {
            await playPromise;
            console.log('Background video playing successfully');
          }
        } else {
          // Wait for video to be ready
          setTimeout(() => attemptPlay(), 200);
        }
      } catch (error) {
        console.warn(`Background video play attempt ${playAttempts} failed:`, error);
        
        if (playAttempts < maxPlayAttempts) {
          setTimeout(() => attemptPlay(), 500);
        } else {
          // Set up user interaction listener as final fallback
          setupUserInteractionFallback();
        }
      }
    };

    const setupUserInteractionFallback = () => {
      const handleUserInteraction = async () => {
        try {
          await video.play();
          console.log('Background video playing after user interaction');
          
          // Remove listeners after successful play
          document.removeEventListener('touchstart', handleUserInteraction);
          document.removeEventListener('click', handleUserInteraction);
          document.removeEventListener('scroll', handleUserInteraction);
        } catch (error) {
          console.warn('Background video play failed even after user interaction:', error);
        }
      };

      document.addEventListener('touchstart', handleUserInteraction, { passive: true, once: true });
      document.addEventListener('click', handleUserInteraction, { passive: true, once: true });
      document.addEventListener('scroll', handleUserInteraction, { passive: true, once: true });
    };

    // Add all event listeners
    video.addEventListener('loadeddata', handleLoadedData);
    video.addEventListener('canplay', handleCanPlay);
    video.addEventListener('canplaythrough', handleCanPlay);
    video.addEventListener('play', handlePlay);
    video.addEventListener('pause', handlePause);
    video.addEventListener('error', handleError);

    // Force load the video
    video.load();

    // Cleanup function
    return () => {
      video.removeEventListener('loadeddata', handleLoadedData);
      video.removeEventListener('canplay', handleCanPlay);
      video.removeEventListener('canplaythrough', handleCanPlay);
      video.removeEventListener('play', handlePlay);
      video.removeEventListener('pause', handlePause);
      video.removeEventListener('error', handleError);
    };
  }, []);

  return (
    <div ref={containerRef} className="h-full w-full relative overflow-hidden">
      {/* Fallback image - only visible when video fails or is loading */}
      <img
        className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${
          videoState.isPlaying ? 'opacity-0' : 'opacity-100'
        }`}
        src="https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&fit=crop"
        alt="Creative workspace background"
        loading="eager"
        style={{
          objectFit: 'cover',
          objectPosition: 'center center',
          width: '100%',
          height: '100%'
        }}
      />

      {/* Main background video */}
      <video
        ref={videoRef}
        className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${
          videoState.isPlaying ? 'opacity-100' : 'opacity-0'
        }`}
        style={{
          objectFit: 'cover',
          objectPosition: 'center center',
          width: '100%',
          height: '100%',
          minWidth: '100%',
          minHeight: '100%'
        }}
        autoPlay
        playsInline
        loop
        muted
        preload="auto"
        webkit-playsinline="true"
        x-webkit-airplay="allow"
        controls={false}
        disablePictureInPicture
        disableRemotePlayback
        poster="https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&fit=crop"
      >
        {/* Multiple source formats for better compatibility */}
        <source
          src="/video.mp4"
          type="video/mp4"
        />
        <source
          src="/video.webm"
          type="video/webm"
        />
        <source
          src="/video.ogv"
          type="video/ogg"
        />
        
        {/* Fallback message */}
        Your browser does not support the video tag.
      </video>

      {/* Loading indicator */}
      {videoState.isLoaded && !videoState.isPlaying && !videoState.hasError && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/20 pointer-events-none">
          <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin opacity-50"></div>
        </div>
      )}

      {/* Debug info (remove in production) */}
      {process.env.NODE_ENV === 'development' && (
        <div className="absolute top-4 left-4 bg-black/80 text-white p-2 rounded text-xs font-mono">
          <div>Loaded: {videoState.isLoaded ? '✓' : '✗'}</div>
          <div>Playing: {videoState.isPlaying ? '✓' : '✗'}</div>
          <div>Error: {videoState.hasError ? '✓' : '✗'}</div>
          <div>Can Play: {videoState.canPlay ? '✓' : '✗'}</div>
        </div>
      )}

      {/* Additional overlay for better text readability */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/30 pointer-events-none" />
    </div>
  );
};

export default Video;