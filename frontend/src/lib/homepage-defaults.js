import { text } from "@fortawesome/fontawesome-svg-core";

export const heroDefaults = {
  layout: 'split',
  splitSide: 'right',
  background: 'image',
  height: 'large',
  contentAlignment: 'left',
  mainContent: {
    title: 'Welcome to Your Site',
    subtitle: 'Start customizing your homepage',
    titleColor: 'primary',
    subtitleColor: 'primary',
  }
};

export const slideshowDefaults = {
  slideDuration: 5000,
  transitionSpeed: 300,
  autoplay: true,
  showControls: true,
  slides: [
    {
      slideTitle: 'Welcome to Our Site',
      titleColor: 'warning',
      cardContent: 'Edit this slideshow to add your own content and images.',
      contentColor: 'success',
      textBlockBackground: 'dark',
      textBlockOpacity: '65',
      _image: [
        {
          attachment: {
            extension: 'jpg',
            _urls: {
              'max': 'https://picsum.photos/seed/slide1/1600/1600',
              'full': 'https://picsum.photos/seed/slide1/1600/900',
              'two-thirds': 'https://picsum.photos/seed/slide1/760/760',
              'one-half': 'https://picsum.photos/seed/slide1/570/700',
              'one-third': 'https://picsum.photos/seed/slide1/380/700',
              'one-sixth': 'https://picsum.photos/seed/slide1/190/350'
            },
            alt: 'Welcome slide'
          }
        }
      ]
    },
    {
      slideTitle: 'Customizable Design',
      titleColor: 'primary',
      cardContent: 'Add your own slides with content.',
      contentColor: 'warning',
      textBlockBackground: 'dark',
      textBlockOpacity: '65',
      _image: [
        {
          attachment: {
            extension: 'jpg',
            _urls: {
              'max': 'https://picsum.photos/seed/slide1/1600/1600',
              'full': 'https://picsum.photos/seed/slide1/1600/900',
              'two-thirds': 'https://picsum.photos/seed/slide1/760/760',
              'one-half': 'https://picsum.photos/seed/slide1/570/700',
              'one-third': 'https://picsum.photos/seed/slide1/380/700',
              'one-sixth': 'https://picsum.photos/seed/slide1/190/350'
            },
            alt: 'Design slide'
          }
        }
      ]
    },
    {
      slideTitle: 'Getting Started',
      titleColor: 'info',
      cardContent: 'Click edit to begin customizing your slideshow.',
      contentColor: 'white',
      textBlockBackground: 'dark',
      textBlockOpacity: '65',
      _image: [
        {
          attachment: {
            extension: 'jpg',
            _urls: {
              'max': 'https://picsum.photos/seed/slide1/1600/1600',
              'full': 'https://picsum.photos/seed/slide1/1600/900',
              'two-thirds': 'https://picsum.photos/seed/slide1/760/760',
              'one-half': 'https://picsum.photos/seed/slide1/570/700',
              'one-third': 'https://picsum.photos/seed/slide1/380/700',
              'one-sixth': 'https://picsum.photos/seed/slide1/190/350'
            },
            alt: 'Getting started slide'
          }
        }
      ]
    }
  ]
};
