import React, { useEffect, useRef, useState } from 'react';

const Video = () => {
  const videoRef = useRef(null);
  const containerRef = useRef(null);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [videoError, setVideoError] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    let playAttempted = false;

    // Function to attempt video playback
    const attemptPlay = async () => {
      if (playAttempted) return;
      playAttempted = true;

      try {
        // Ensure video is properly configured for iOS
        video.muted = true;
        video.playsInline = true;
        video.setAttribute('playsinline', '');
        video.setAttribute('webkit-playsinline', '');
        video.setAttribute('x-webkit-airplay', 'allow');
        
        // Force load the video
        video.load();
        
        // Wait a bit for the video to be ready
        await new Promise(resolve => setTimeout(resolve, 100));
        
        const playPromise = video.play();
        
        if (playPromise !== undefined) {
          await playPromise;
          console.log('Video started playing successfully');
          setVideoLoaded(true);
        }
      } catch (error) {
        console.warn('Video autoplay failed:', error);
        
        // Try again after a short delay
        setTimeout(async () => {
          try {
            await video.play();
            setVideoLoaded(true);
          } catch (retryError) {
            console.warn('Video retry failed:', retryError);
            setVideoError(true);
          }
        }, 500);
      }
    };

    // Handle when video data is loaded
    const handleLoadedData = () => {
      console.log('Video data loaded');
      attemptPlay();
    };

    // Handle when video can start playing
    const handleCanPlay = () => {
      console.log('Video can play');
      attemptPlay();
    };

    // Handle video errors
    const handleVideoError = (e) => {
      console.error('Video error:', e);
      setVideoError(true);
    };

    // Handle successful video play
    const handlePlay = () => {
      console.log('Video is playing');
      setVideoLoaded(true);
    };

    // iOS-specific user interaction handler
    const handleUserInteraction = async () => {
      if (!videoLoaded && !videoError) {
        try {
          await video.play();
          setVideoLoaded(true);
          console.log('Video started after user interaction');
        } catch (error) {
          console.warn('Video play failed after user interaction:', error);
        }
      }
      
      // Remove listeners after first successful interaction
      document.removeEventListener('touchstart', handleUserInteraction);
      document.removeEventListener('click', handleUserInteraction);
      document.removeEventListener('scroll', handleUserInteraction);
    };

    // Add event listeners
    video.addEventListener('loadeddata', handleLoadedData);
    video.addEventListener('canplay', handleCanPlay);
    video.addEventListener('error', handleVideoError);
    video.addEventListener('play', handlePlay);
    
    // Add user interaction listeners for iOS fallback
    document.addEventListener('touchstart', handleUserInteraction, { passive: true });
    document.addEventListener('click', handleUserInteraction, { passive: true });
    document.addEventListener('scroll', handleUserInteraction, { passive: true });

    // Immediate attempt to load and play
    if (video.readyState >= 3) {
      // Video is already loaded enough to play
      attemptPlay();
    }

    // Cleanup
    return () => {
      video.removeEventListener('loadeddata', handleLoadedData);
      video.removeEventListener('canplay', handleCanPlay);
      video.removeEventListener('error', handleVideoError);
      video.removeEventListener('play', handlePlay);
      document.removeEventListener('touchstart', handleUserInteraction);
      document.removeEventListener('click', handleUserInteraction);
      document.removeEventListener('scroll', handleUserInteraction);
    };
  }, [videoLoaded, videoError]);

  return (
    <div ref={containerRef} className="h-full w-full relative overflow-hidden">
      {/* Fallback image - only show if video fails or hasn't loaded yet */}
      <img
        className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${
          videoLoaded ? 'opacity-0 z-0' : 'opacity-100 z-10'
        }`}
        src="https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&fit=crop"
        alt="Creative workspace background"
        loading="eager"
        style={{
          objectFit: 'cover',
          objectPosition: 'center center',
        }}
      />

      {/* Main background video with comprehensive iOS support */}
      <video
        ref={videoRef}
        className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${
          videoLoaded ? 'opacity-100 z-20' : 'opacity-0 z-10'
        }`}
        style={{
          objectFit: 'cover',
          objectPosition: 'center center',
        }}
        autoPlay
        playsInline
        loop
        muted
        preload="auto"
        controls={false}
        disablePictureInPicture
        disableRemotePlayback
        // iOS-specific attributes
        webkit-playsinline="true"
        playsinline="true"
        x-webkit-airplay="allow"
        // Poster for initial frame
        poster="https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&fit=crop"
      >
        {/* Multiple source formats for better compatibility */}
        <source
          src="/video.mp4"
          type="video/mp4"
        />
        {/* Fallback message */}
        Your browser does not support the video tag.
      </video>

      {/* Additional overlay for better text readability */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/30 z-30 pointer-events-none" />
      
      {/* Debug info (remove in production) */}
      {process.env.NODE_ENV === 'development' && (
        <div className="absolute top-4 left-4 z-50 bg-black/50 text-white p-2 rounded text-xs">
          Video Loaded: {videoLoaded ? 'Yes' : 'No'} | Error: {videoError ? 'Yes' : 'No'}
        </div>
      )}
    </div>
  );
};

export default Video;