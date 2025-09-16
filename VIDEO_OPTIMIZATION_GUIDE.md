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
# For 1080p version (recommended for desktop)
ffmpeg -i input.mp4 -c:v libx264 -profile:v main -level:v 4.0 -crf 23 -preset medium -c:a aac -b:a 128k -movflags +faststart -pix_fmt yuv420p output_1080p.mp4

# For 720p mobile-optimized version
ffmpeg -i input.mp4 -c:v libx264 -profile:v baseline -level:v 3.1 -crf 25 -preset medium -c:a aac -b:a 96k -movflags +faststart -pix_fmt yuv420p -vf "scale=1280:720" output_720p.mp4

# For ultra-compressed mobile version (under 5MB)
ffmpeg -i input.mp4 -c:v libx264 -profile:v baseline -level:v 3.0 -crf 28 -preset slow -c:a aac -b:a 64k -movflags +faststart -pix_fmt yuv420p -vf "scale=960:540" -t 30 output_mobile.mp4
```

## Implementation Steps

### 1. Replace Current Video File
- Encode your video using the settings above
- Replace `/public/video.mp4` with the optimized version
- Ensure file size is under 10MB for better mobile performance

### 2. Add Multiple Video Sources (Optional)
```html
<video>
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

### CSS Requirements:
- `object-fit: cover` - Maintains aspect ratio
- `object-position: center center` - Centers video
- Hardware acceleration with `transform: translate3d(0,0,0)`
- Proper z-index stacking

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

Remember to test on actual iOS devices, as desktop Safari behavior differs from mobile Safari.