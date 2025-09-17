import React, { useRef, useEffect, useState } from 'react';

const HomeHeroText = () => {
  const videoRef = useRef(null);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [videoError, setVideoError] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Enhanced iOS and cross-platform video handling
    const handleVideoLoad = () => {
      console.log('Inline video loaded successfully');
      setVideoLoaded(true);
      setVideoError(false);
      
      // Force video properties for iOS compatibility
      video.muted = true;
      video.playsInline = true;
      video.setAttribute('playsinline', 'true');
      video.setAttribute('webkit-playsinline', 'true');
      
      // Multiple play attempts for better compatibility
      const attemptPlay = async () => {
        try {
          await video.play();
          console.log('Inline video playing successfully');
        } catch (error) {
          console.warn('Inline video autoplay failed, will retry on user interaction:', error);
          // Set up user interaction listener
          const playOnInteraction = () => {
            video.play().catch(e => console.warn('Manual play failed:', e));
            document.removeEventListener('touchstart', playOnInteraction);
            document.removeEventListener('click', playOnInteraction);
          };
          
          document.addEventListener('touchstart', playOnInteraction, { passive: true });
          document.addEventListener('click', playOnInteraction, { passive: true });
        }
      };

      // Delay play attempt to ensure video is ready
      setTimeout(attemptPlay, 100);
    };

    const handleVideoError = (e) => {
      console.error('Inline video failed to load:', e);
      setVideoError(true);
      setVideoLoaded(false);
    };

    const handleCanPlay = () => {
      console.log('Inline video can play');
      setVideoLoaded(true);
    };

    // Add event listeners
    video.addEventListener('loadeddata', handleVideoLoad);
    video.addEventListener('canplay', handleCanPlay);
    video.addEventListener('error', handleVideoError);

    // Force load the video
    video.load();

    // Cleanup
    return () => {
      video.removeEventListener('loadeddata', handleVideoLoad);
      video.removeEventListener('canplay', handleCanPlay);
      video.removeEventListener('error', handleVideoError);
    };
  }, []);

  return (
    <div className="font-[font1] text-center relative depth-4 px-4 flex-1 flex items-center justify-center">
      <div className="w-full">
        <div className="text-[12vw] sm:text-[9vw] lg:text-[9.5vw] justify-center flex items-center uppercase leading-[10vw] sm:leading-[7.5vw] lg:leading-[8vw] text-layer-3 mb-2 sm:mb-0">
          You do the work
        </div>
        <div className="text-[12vw] sm:text-[9vw] lg:text-[9.5vw] justify-center flex items-center uppercase leading-[10vw] sm:leading-[7.5vw] lg:leading-[8vw] text-layer-3 flex-wrap justify-center mb-2 sm:mb-0">
          <span>we</span>
          <div className="inline-video-container h-[8vw] w-[20vw] sm:h-[7vw] sm:w-[16vw] rounded-full overflow-hidden mx-2 sm:mx-2 glass glow-accent flex-shrink-0 my-1 sm:my-0 relative">
            {/* Fallback image - only shows if video fails */}
            <img
              className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${
                videoLoaded && !videoError ? 'opacity-0' : 'opacity-100'
              }`}
              src="https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop"
              alt="Video preview"
              loading="eager"
            />
            
            {/* Responsive video element */}
            <video
              ref={videoRef}
              className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${
                videoLoaded && !videoError ? 'opacity-100' : 'opacity-0'
              }`}
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
              poster="https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop"
            >
              {/* Multiple source formats for maximum compatibility */}
              <source src="/video.mp4" type="video/mp4" />
              <source src="/video.webm" type="video/webm" />
              <source src="/video.ogv" type="video/ogg" />
              
              {/* Fallback for browsers that don't support video */}
              <img 
                src="https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop"
                alt="Video not supported"
                className="w-full h-full object-cover"
              />
            </video>
            
            {/* Loading indicator */}
            {!videoLoaded && !videoError && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              </div>
            )}
          </div>
          <span>do the</span>
        </div>
        <div className="text-[12vw] sm:text-[9vw] lg:text-[9.5vw] justify-center flex items-center uppercase leading-[10vw] sm:leading-[7.5vw] lg:leading-[8vw] text-layer-3">
          stitches
        </div>
      </div>
    </div>
  );
};

export default HomeHeroText;