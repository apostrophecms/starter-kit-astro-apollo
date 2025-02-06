/**
* VideoWidget - A custom web component for embedding responsive videos
*
* @customElement video-widget
* @extends HTMLElement
* @description
* Handles video embedding through ApostropheCMS's oEmbed endpoint.
* Supports multiple video providers (YouTube, Vimeo, etc) and maintains
* responsive sizing. The component automatically handles provider-specific
* details through the oEmbed standard.
*
* @example
* // With ApostropheCMS video widget data:
* <video-widget url={widget.video.url}></video-widget>
*
* // Direct usage:
* <video-widget url="https://youtube.com/..."></video-widget>
* <video-widget url="https://vimeo.com/..." title="My Video"></video-widget>
*
* @property {string} url - The video URL to embed (required)
* @property {string} [title] - Optional title for the video iframe
*/
class VideoWidget extends HTMLElement {
  constructor() {
    super();
    this.init();
  }

    /**
   * Initializes the video widget by fetching oEmbed data and rendering
   * @async
   * @private
   * @throws {Error} When video initialization fails
   * @returns {Promise<void>}
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
   * Fetches oEmbed data for the provided video URL
   * @async
   * @private
   * @param {string} url - The video URL to fetch oEmbed data for
   * @throws {Error} When oEmbed request fails
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
   * Renders the video iframe with responsive sizing
   * @private
   * @throws {Error} When oEmbed response doesn't contain valid HTML
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
   * Updates video dimensions to maintain aspect ratio
   * @private
   */
  resizeVideo() {
    const aspectRatio = this.result.height / this.result.width;
    this.canvasEl.style.height = (aspectRatio * this.canvasEl.offsetWidth) + 'px';
  }

  /**
   * Handles window resize events with cleanup
   * @private
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