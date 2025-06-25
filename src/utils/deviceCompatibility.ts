// Device compatibility checker
export const checkDeviceCompatibility = (): boolean => {
  try {
    // Check for basic WebGL support
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    if (!gl) {
      console.warn('WebGL not supported');
      return false;
    }

    // Check for basic ES6 support
    try {
      new Function('() => {}');
    } catch (e) {
      console.warn('ES6 not supported');
      return false;
    }

    // Check for basic video support
    const video = document.createElement('video');
    if (!video.canPlayType) {
      console.warn('Video not supported');
      return false;
    }

    // Check for basic audio support
    const audio = document.createElement('audio');
    if (!audio.canPlayType) {
      console.warn('Audio not supported');
      return false;
    }

    // Check for requestAnimationFrame
    if (!window.requestAnimationFrame) {
      console.warn('RequestAnimationFrame not supported');
      return false;
    }

    // Check for basic touch/pointer events on mobile
    const isMobile = /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    if (isMobile && !('ontouchstart' in window)) {
      console.warn('Touch events not supported on mobile device');
      return false;
    }

    // Check for basic CSS3 support
    const testElement = document.createElement('div');
    testElement.style.transform = 'translateZ(0)';
    if (!testElement.style.transform) {
      console.warn('CSS3 transforms not supported');
      return false;
    }

    // Check for basic Canvas support
    if (!canvas.getContext('2d')) {
      console.warn('Canvas 2D not supported');
      return false;
    }

    // Check for basic localStorage
    try {
      localStorage.setItem('test', 'test');
      localStorage.removeItem('test');
    } catch (e) {
      console.warn('LocalStorage not supported');
      return false;
    }

    // Check for basic fetch API
    if (!window.fetch) {
      console.warn('Fetch API not supported');
      return false;
    }

    // Check for basic Promise support
    if (!window.Promise) {
      console.warn('Promises not supported');
      return false;
    }

    console.log('Device compatibility check passed');
    return true;
  } catch (error) {
    console.error('Device compatibility check failed:', error);
    return false;
  }
};

export const redirectToFallback = () => {
  console.log('Redirecting to fallback site due to compatibility issues');
  window.location.href = 'https://loja.pilar.com.br';
};

export const performCompatibilityCheck = () => {
  // Add a small delay to ensure the page has started loading
  setTimeout(() => {
    if (!checkDeviceCompatibility()) {
      redirectToFallback();
    }
  }, 1000);
};