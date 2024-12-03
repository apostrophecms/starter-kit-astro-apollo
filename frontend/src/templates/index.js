import HomePage from './HomePage.astro';
import DefaultPage from './DefaultPage.astro';
import ArticleIndexPage from './ArticleIndexPage.astro';
import ArticleShowPage from './ArticleShowPage.astro';
import NotFoundPage from './NotFoundPage.astro';

const templateComponents = {
  '@apostrophecms/home-page': HomePage,
  'default-page': DefaultPage,
  'article-page:index': ArticleIndexPage,
  'article-page:show': ArticleShowPage,
  '@apostrophecms/page:notFound': NotFoundPage
};

export default templateComponents;
