import RichTextWidget from './RichTextWidget.astro';
import ImageWidget from './ImageWidget.astro';
import VideoWidget from './VideoWidget.astro';
import GridLayoutWidget from './GridLayoutWidget.astro';
import AccordionWidget from './AccordionWidget.astro';
import CardWidget from './CardWidget.astro';
import HeroWidget from './HeroWidget.astro';
import LinkWidget from './LinkWidget.astro';
import SlideshowWidget from './SlideshowWidget.astro';
import RowsWidget from './RowsWidget.astro';
import LayoutWidget from '@apostrophecms/apostrophe-astro/widgets/LayoutWidget.astro';
import LayoutColumnWidget from '@apostrophecms/apostrophe-astro/widgets/LayoutColumnWidget.astro';

const widgetComponents = {
  '@apostrophecms/rich-text': RichTextWidget,
  '@apostrophecms/image': ImageWidget,
  '@apostrophecms/video': VideoWidget,
  'accordion': AccordionWidget,
  'card': CardWidget,
  'hero': HeroWidget,
  'link': LinkWidget,
  'slideshow': SlideshowWidget,
  '@apostrophecms/layout': LayoutWidget,
  '@apostrophecms/layout-column': LayoutColumnWidget
};

export default widgetComponents;
