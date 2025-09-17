# Mobile Video Optimization Guide for iOS

## Video Encoding Recommendations

### For `/public/video.mp4`:

**Optimal Settings for iOS Compatibility:**
- **Codec**: H.264 (AVC)
- **Profile**: Baseline or Main Profile (avoid High Profile)
- **Resolution**: 1920x1080 (Full HD) or 1280x720 (HD)
- **Frame Rate**: 30fps (avoid 60fps for better compatibility)
- **Bitrate**: 2-4 Mbps for 1080p, 1-2 Mbps for 720p
- **Audio**: AAC, 128kbps, 44.1kHz
- **Container**: MP4 with faststart flag

### FFmpeg Command for Optimization:

```bash
# CRITICAL: iOS-Compatible Video (Use this exact command)
ffmpeg -i input.mp4 -c:v libx264 -profile:v baseline -level:v 3.1 -crf 20 -preset slow -c:a aac -b:a 128k -ar 44100 -movflags +faststart -pix_fmt yuv420p -vf "scale=1920:1080:force_original_aspect_ratio=decrease,pad=1920:1080:(ow-iw)/2:(oh-ih)/2" -t 30 -r 30 output.mp4

# Alternative mobile-optimized version (smaller file size)
ffmpeg -i input.mp4 -c:v libx264 -profile:v baseline -level:v 3.0 -crf 23 -preset slow -c:a aac -b:a 96k -ar 44100 -movflags +faststart -pix_fmt yuv420p -vf "scale=1280:720:force_original_aspect_ratio=decrease,pad=1280:720:(ow-iw)/2:(oh-ih)/2" -t 30 -r 30 output_mobile.mp4

# For inline video elements (smaller, optimized for circular display)
ffmpeg -i input.mp4 -c:v libx264 -profile:v baseline -level:v 3.0 -crf 25 -preset medium -c:a aac -b:a 64k -ar 44100 -movflags +faststart -pix_fmt yuv420p -vf "scale=400:400:force_original_aspect_ratio=increase,crop=400:400" -t 15 -r 24 output_inline.mp4

# Create WebM version for better browser support
ffmpeg -i input.mp4 -c:v libvpx-vp9 -crf 30 -b:v 0 -b:a 128k -c:a libopus -vf "scale=400:400:force_original_aspect_ratio=increase,crop=400:400" -t 15 output_inline.webm

# Quick test version (very small file for testing)
ffmpeg -i input.mp4 -c:v libx264 -profile:v baseline -level:v 3.0 -crf 28 -preset slow -c:a aac -b:a 64k -ar 44100 -movflags +faststart -pix_fmt yuv420p -vf "scale=960:540:force_original_aspect_ratio=decrease,pad=960:540:(ow-iw)/2:(oh-ih)/2" -t 15 -r 24 output_test.mp4
```

## Implementation Steps

### 1. Replace Current Video File
- Encode your video using the settings above
- Replace `/public/video.mp4` with the optimized version
- Ensure file size is under 10MB for better mobile performance

### 2. Add Multiple Video Sources (Optional)
```html
<video>
  <source src="/video_inline.webm" type="video/webm" media="(max-width: 768px)">
  <source src="/video_mobile.mp4" type="video/mp4" media="(max-width: 768px)">
  <source src="/video.mp4" type="video/mp4">
</video>
```

### 3. Test on Real iOS Devices
- Test on iPhone Safari (iOS 12+)
- Test on iPhone Chrome
- Test on different network conditions (3G, 4G, WiFi)
- Verify autoplay works without user interaction

## Key iOS Compatibility Requirements

### Required Video Attributes:
- `autoplay` - Enables automatic playback
- `muted` - Required for autoplay on iOS
- `playsInline` - Prevents fullscreen on iOS
- `loop` - Continuous playback
- `preload="auto"` - Preloads video data
- `webkit-playsinline="true"` - iOS-specific inline play
- `poster` - Fallback image while loading
- `disablePictureInPicture` - Prevents PiP mode
- `disableRemotePlayback` - Prevents casting

### CSS Requirements:
- `object-fit: cover` - Maintains aspect ratio
- `object-position: center center` - Centers video
- Hardware acceleration with `transform: translate3d(0,0,0)`
- Proper z-index stacking
- `aspect-ratio` property for consistent sizing
- Smooth transitions with `transition` property

## Troubleshooting Common Issues

### Video Not Playing on iOS:
1. Check video encoding (must be H.264 baseline/main profile)
2. Ensure `muted` attribute is present
3. Verify `playsInline` attribute
4. Check file size (large files may not autoplay)
5. Test network conditions

### Video Aspect Ratio Issues:
1. Use `object-fit: cover` instead of `background-size`
2. Set explicit width/height: 100%
3. Use `transform: translate(-50%, -50%)` for centering
4. Apply `overflow: hidden` to container

### Performance Optimization:
1. Keep video under 10MB for mobile
2. Use appropriate resolution (720p for mobile)
3. Enable faststart flag for streaming
4. Consider lazy loading for non-critical videos

## Testing Checklist

- [ ] Video plays automatically on iPhone Safari
- [ ] Video plays automatically on iPhone Chrome
- [ ] Video covers full background without stretching
- [ ] Fallback image displays properly if video fails
- [ ] Performance is acceptable on 3G networks
- [ ] Video loops seamlessly
- [ ] No video controls appear on mobile
- [ ] Text remains readable over video
- [ ] Works in both portrait and landscape orientations

## File Size Targets

- **Desktop**: 5-15MB (1080p, higher quality)
- **Mobile**: 2-8MB (720p, optimized)
- **Ultra-mobile**: 1-3MB (540p, highly compressed)
- **Inline videos**: 500KB-2MB (400x400, square format)
- **WebM format**: 30-50% smaller than MP4

## Cross-Platform Testing Checklist

- [ ] Video plays on iPhone Safari (iOS 12+)
- [ ] Video plays on iPhone Chrome
- [ ] Video plays on Android Chrome
- [ ] Video plays on Android Firefox
- [ ] Video plays on Desktop Safari
- [ ] Video plays on Desktop Chrome
- [ ] Video plays on Desktop Firefox
- [ ] Video plays on Desktop Edge
- [ ] Aspect ratio consistent across all devices
- [ ] Fallback image displays properly if video fails
- [ ] Loading states work correctly
- [ ] No layout shifts during video loading
- [ ] Performance acceptable on 3G networks
Remember to test on actual iOS devices, as desktop Safari behavior differs from mobile Safari.