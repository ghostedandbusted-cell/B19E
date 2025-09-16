import React, { useEffect, useRef } from 'react';

const Video = () => {
  const videoRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // iOS-specific video handling
    const handleVideoLoad = () => {
      // Force video dimensions for iOS
      video.style.width = '100%';
      video.style.height = '100%';
      video.style.objectFit = 'cover';
      video.style.objectPosition = 'center center';
      
      // Attempt to play video on iOS
      const playPromise = video.play();
      if (playPromise !== undefined) {
        playPromise.catch(error => {
          console.warn('Video autoplay failed:', error);
          // Hide video if autoplay fails
          video.style.display = 'none';
        });
      }
    };

    // Handle video errors
    const handleVideoError = (e) => {
      console.warn('Video failed to load, falling back to image');
      video.style.display = 'none';
    };

    // iOS Safari requires user interaction for autoplay in some cases
    const handleUserInteraction = () => {
      if (video.paused) {
        const playPromise = video.play();
        if (playPromise !== undefined) {
          playPromise.catch(error => {
            console.warn('Video play failed after user interaction:', error);
          });
        }
      }
      
      // Remove event listeners after first interaction
      document.removeEventListener('touchstart', handleUserInteraction);
      document.removeEventListener('click', handleUserInteraction);
    };

    // Add event listeners
    video.addEventListener('loadeddata', handleVideoLoad);
    video.addEventListener('error', handleVideoError);
    
    // Add user interaction listeners for iOS
    document.addEventListener('touchstart', handleUserInteraction, { passive: true });
    document.addEventListener('click', handleUserInteraction, { passive: true });

    // Cleanup
    return () => {
      video.removeEventListener('loadeddata', handleVideoLoad);
      video.removeEventListener('error', handleVideoError);
      document.removeEventListener('touchstart', handleUserInteraction);
      document.removeEventListener('click', handleUserInteraction);
    };
  }, []);

  return (
    <div ref={containerRef} className="h-full w-full relative overflow-hidden">
      {/* Optimized fallback image with proper aspect ratio */}
      <img
        className="absolute inset-0 w-full h-full object-cover z-0"
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

      {/* Main background video with comprehensive iOS support */}
      <video
        ref={videoRef}
        className="absolute inset-0 w-full h-full object-cover z-10"
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
        // iOS-specific attributes
        controls={false}
        disablePictureInPicture
        disableRemotePlayback
        // Additional mobile optimization attributes
        poster="https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&fit=crop"
      >
        {/* Multiple source formats for better compatibility */}
        <source
          src="/video.mp4"
          type="video/mp4"
        />
        {/* Fallback message for browsers that don't support video */}
        Your browser does not support the video tag.
      </video>

      {/* Additional overlay for better text readability on mobile */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/30 z-20 pointer-events-none" />
    </div>
  );
};

export default Video;