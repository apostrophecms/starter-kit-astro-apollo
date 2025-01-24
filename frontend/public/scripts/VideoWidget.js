/**
 * VideoWidget - A custom web component for embedding videos with responsive sizing
 *
 * This component handles video embedding through ApostropheCMS's oEmbed endpoint,
 * which supports multiple video providers (YouTube, Vimeo, etc). While typically
 * used with URLs from ApostropheCMS's video widget schema, it can accept any
 * standard video sharing URL. The component handles all provider-specific details
 * through the oEmbed standard and maintains responsive sizing.
 *
 * Typical usage (with ApostropheCMS):
 * The URL typically comes from the video widget schema data:
 * <video-widget url={widget.video.url}></video-widget>
 *
 * Direct usage (if needed):
 * <video-widget url="https://youtube.com/..."></video-widget>
 * <video-widget url="https://vimeo.com/..."></video-widget>
 */
class VideoWidget extends HTMLElement {
  constructor() {
    super();
    this.init();
  }

  /**
   * Initializes the video widget by fetching oEmbed data and rendering the video
   */
  async init() {
    const videoUrl = this.getAttribute('url');

    if (!videoUrl) {
      console.warn('VideoWidget: No URL provided');
      return;
    }

    try {
      this.result = await this.oembed(videoUrl);
      this.renderVideo();
    } catch (error) {
      console.error('VideoWidget initialization failed:', error);
      this.innerHTML = `<div class="error">Failed to load video: ${error.message}</div>`;
    }
  }

  /**
   * Fetches oEmbed data for the given URL using ApostropheCMS's oEmbed endpoint
   * @param {string} url - The video URL to fetch oEmbed data for
   * @returns {Promise<Object>} The oEmbed response data
   */
  async oembed(url) {
    const response = await fetch('/api/v1/@apostrophecms/oembed/query?' + new URLSearchParams({
      url
    }));
    if (response.status >= 400) {
      throw new Error(`oEmbed request failed with status: ${response.status}`);
    }
    return response.json();
  }

  /**
   * Renders the video iframe with proper responsive sizing
   * Uses oEmbed HTML and maintains aspect ratio if dimensions are provided
   */
  renderVideo() {
    // Create temporary container to parse oEmbed HTML
    const shaker = document.createElement('div');
    shaker.innerHTML = this.result.html;
    const inner = shaker.firstChild;
    
    if (!inner || !(inner instanceof HTMLElement)) {
      throw new Error('oEmbed response must contain a valid HTML element');
    }

    this.canvasEl = inner;
    this.innerHTML = '';

    // Add title attribute to iframe
    if (inner instanceof HTMLIFrameElement) {
      const title = this.getAttribute('title') || 'Video content';
      inner.setAttribute('title', title);
    }

    // Remove fixed dimensions to allow responsive sizing
    inner.removeAttribute('width');
    inner.removeAttribute('height');
    this.append(inner);

    // Wait for CSS width to be applied before calculating dimensions
    setTimeout(() => {
      if (this.result.width && this.result.height) {
        inner.style.width = '100%';
        this.resizeVideo();
        // Maintain aspect ratio on window resize
        window.addEventListener('resize', this.resizeHandler.bind(this));
      }
      // If no dimensions provided, assume oEmbed HTML is already responsive
    }, 0);
  }

  /**
   * Updates video height to maintain aspect ratio based on current width
   */
  resizeVideo() {
    const aspectRatio = this.result.height / this.result.width;
    this.canvasEl.style.height = (aspectRatio * this.canvasEl.offsetWidth) + 'px';
  }

  /**
   * Handles window resize events and cleans up when component is removed
   */
  resizeHandler() {
    if (document.contains(this)) {
      this.resizeVideo();
    } else {
      // Clean up resize listener when component is removed from DOM
      window.removeEventListener('resize', this.resizeHandler);
    }
  }
}

// Register the web component if it hasn't been registered already
if (!customElements.get('video-widget')) {
  console.log('Registering VideoWidget web component');
  customElements.define('video-widget', VideoWidget);
} else {
  console.log('VideoWidget was already registered');
}