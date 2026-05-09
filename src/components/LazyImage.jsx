import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Box, Skeleton } from '@mui/material';
import { ImageNotSupported as ImageNotSupportedIcon } from '@mui/icons-material';

/**
 * LazyImage Component
 * Staggered image loading to prevent overwhelming the ngrok tunnel
 * 
 * - Delays image src assignment by (index * 150ms)
 * - Shows skeleton placeholder while loading
 * - Graceful fallback on error
 * - Memoized to prevent unnecessary re-renders
 */
const LazyImage = React.memo(function LazyImage({
  src,
  alt = 'Device Image',
  index = 0,
  fallbackSrc = null,
  height = 160,
  borderRadius = 2.5,
  objectFit = 'cover',
  onLoadStart = () => {},
  onLoadEnd = () => {},
}) {
  const [imageSrc, setImageSrc] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  // Calculate staggered delay based on index (150ms per item)
  const staggerDelay = useMemo(() => index * 150, [index]);

  // Set up staggered image loading
  useEffect(() => {
    let timeoutId;
    let isMounted = true;

    const loadImage = () => {
      if (isMounted) {
        console.log(`[LazyImage] Loading image ${index + 1} after ${staggerDelay}ms delay: ${src}`);
        setImageSrc(src);
        onLoadStart();
      }
    };

    // Delay the src assignment to prevent tunnel saturation
    timeoutId = setTimeout(loadImage, staggerDelay);

    // Cleanup
    return () => {
      isMounted = false;
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [src, index, staggerDelay, onLoadStart]);

  // Handle successful image load
  const handleImageLoad = useCallback(() => {
    setIsLoading(false);
    setHasError(false);
    onLoadEnd();
    console.log(`[LazyImage] Image ${index + 1} loaded successfully`);
  }, [index, onLoadEnd]);

  // Handle image load errors with fallback
  const handleImageError = useCallback((e) => {
    console.warn(`[LazyImage] Image ${index + 1} failed to load:`, src);
    setHasError(true);
    setIsLoading(false);

    // Try fallback image if available
    if (fallbackSrc && e.target.src !== fallbackSrc) {
      console.log(`[LazyImage] Attempting fallback image for index ${index + 1}`);
      e.target.src = fallbackSrc;
      e.target.onError = null; // Prevent infinite loop
    } else {
      onLoadEnd();
    }
  }, [index, src, fallbackSrc, onLoadEnd]);

  return (
    <Box
      sx={{
        position: 'relative',
        width: '100%',
        height: height,
        backgroundColor: '#f5f5f5',
        borderRadius: borderRadius,
        overflow: 'hidden',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      {/* Loading skeleton placeholder */}
      {isLoading && (
        <Skeleton
          variant="rectangular"
          width="100%"
          height="100%"
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            zIndex: 1,
          }}
        />
      )}

      {/* Error state: Show fallback icon if image completely failed */}
      {hasError && !imageSrc && (
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            width: '100%',
            height: '100%',
            backgroundColor: '#e0e0e0',
            color: '#999',
          }}
        >
          <ImageNotSupportedIcon sx={{ fontSize: 48 }} />
        </Box>
      )}

      {/* Actual image - only renders if imageSrc is set */}
      {imageSrc && (
        <img
          src={imageSrc}
          alt={alt}
          onLoad={handleImageLoad}
          onError={handleImageError}
          style={{
            width: '100%',
            height: '100%',
            objectFit: objectFit,
            borderRadius: borderRadius,
            display: isLoading ? 'none' : 'block',
            position: 'relative',
            zIndex: 2,
          }}
        />
      )}
    </Box>
  );
});

LazyImage.displayName = 'LazyImage';

export default LazyImage;
