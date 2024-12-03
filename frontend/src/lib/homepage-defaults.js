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
            _urls: {
              full: 'https://picsum.photos/seed/slide1/1600/900'
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
            _urls: {
              full: 'https://picsum.photos/seed/slide2/1600/900'
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
            _urls: {
              full: 'https://picsum.photos/seed/slide3/1600/900'
            },
            alt: 'Getting started slide'
          }
        }
      ]
    }
  ]
};
