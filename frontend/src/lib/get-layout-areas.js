export const getLayoutAreas = (widget) => {
  switch (widget.layoutType) {
    case 'asideMain':
      return [
        {
          name: 'aside',
          content: widget.primaryAsideContent,
          colStart: 1,
          colSpan: 4,
          rowStart: 1,
          rowSpan: 3,
          tabletColSpan: 5,
          mobileColSpan: 12,
        },
        {
          name: 'main',
          content: widget.mainContent,
          colStart: 5,
          colSpan: 8,
          rowStart: 1,
          rowSpan: 3,
          tabletColSpan: 7,
          mobileColSpan: 12,
        },
      ];

    case 'mainAside':
      return [
        {
          name: 'main',
          content: widget.mainContent,
          colStart: 1,
          colSpan: 8,
          rowStart: 1,
          rowSpan: 3,
          tabletColSpan: 7,
          mobileColSpan: 12,
        },
        {
          name: 'aside',
          content: widget.primaryAsideContent,
          colStart: 9,
          colSpan: 4,
          rowStart: 1,
          rowSpan: 3,
          tabletColSpan: 5,
          mobileColSpan: 12,
        },
      ];

    case 'asideTwoMain':
      return [
        {
          name: 'aside',
          content: widget.primaryAsideContent,
          colStart: 1,
          colSpan: 4,
          rowStart: 1,
          rowSpan: 4,
          tabletColSpan: 4,
          mobileColSpan: 12,
        },
        {
          name: 'main-top',
          content: widget.mainContent,
          colStart: 5,
          colSpan: 8,
          rowStart: 1,
          rowSpan: 2,
          tabletColSpan: 8,
          mobileColSpan: 12,
        },
        {
          name: 'main-bottom',
          content: widget.secondaryAsideContent,
          colStart: 5,
          colSpan: 8,
          rowStart: 3,
          rowSpan: 2,
          tabletColSpan: 8,
          mobileColSpan: 12,
        },
      ];

    case 'twoMainAside':
      return [
        {
          name: 'main-top',
          content: widget.mainContent,
          colStart: 1,
          colSpan: 8,
          rowStart: 1,
          rowSpan: 2,
          tabletColSpan: 8,
          mobileColSpan: 12,
        },
        {
          name: 'main-bottom',
          content: widget.secondaryAsideContent,
          colStart: 1,
          colSpan: 8,
          rowStart: 3,
          rowSpan: 2,
          tabletColSpan: 8,
          mobileColSpan: 12,
        },
        {
          name: 'aside',
          content: widget.primaryAsideContent,
          colStart: 9,
          colSpan: 4,
          rowStart: 1,
          rowSpan: 4,
          tabletColSpan: 4,
          mobileColSpan: 12,
        },
      ];

    case 'headerTwoColFooter':
      return [
        {
          name: 'header',
          content: widget.headerContent,
          colStart: 1,
          colSpan: 12,
          rowStart: 1,
          rowSpan: 1,
          tabletColSpan: 12,
          mobileColSpan: 12,
        },
        {
          name: 'left',
          content: widget.mainContent,
          colStart: 1,
          colSpan: 6,
          rowStart: 2,
          rowSpan: 1,
          tabletColSpan: 6,
          mobileColSpan: 12,
        },
        {
          name: 'right',
          content: widget.primaryAsideContent,
          colStart: 7,
          colSpan: 6,
          rowStart: 2,
          rowSpan: 1,
          tabletColSpan: 6,
          mobileColSpan: 12,
        },
        {
          name: 'footer',
          content: widget.footerContent,
          colStart: 1,
          colSpan: 12,
          rowStart: 3,
          rowSpan: 1,
          tabletColSpan: 12,
          mobileColSpan: 12,
        },
      ];

    case 'featuredThreeGrid':
      return [
        {
          name: 'featured',
          content: widget.mainContent,
          colStart: 1,
          colSpan: 12,
          rowStart: 1,
          rowSpan: 1,
          tabletColSpan: 12,
          mobileColSpan: 12,
        },
        {
          name: 'col1',
          content: widget.primaryAsideContent,
          colStart: 1,
          colSpan: 4,
          rowStart: 2,
          rowSpan: 1,
          tabletColSpan: 4,
          mobileColSpan: 12,
        },
        {
          name: 'col2',
          content: widget.secondaryAsideContent,
          colStart: 5,
          colSpan: 4,
          rowStart: 2,
          rowSpan: 1,
          tabletColSpan: 4,
          mobileColSpan: 12,
        },
        {
          name: 'col3',
          content: widget.columnThreeContent,
          colStart: 9,
          colSpan: 4,
          rowStart: 2,
          rowSpan: 1,
          tabletColSpan: 4,
          mobileColSpan: 12,
        },
      ];

    case 'magazineLayout':
      return [
        {
          name: 'feature',
          content: widget.mainContent,
          colStart: 1,
          colSpan: 8,
          rowStart: 1,
          rowSpan: 2,
          tabletColSpan: 8,
          mobileColSpan: 12,
        },
        {
          name: 'topSidebar',
          content: widget.primaryAsideContent,
          colStart: 9,
          colSpan: 4,
          rowStart: 1,
          rowSpan: 1,
          tabletColSpan: 4,
          mobileColSpan: 12,
        },
        {
          name: 'bottomSidebar',
          content: widget.secondaryAsideContent,
          colStart: 9,
          colSpan: 4,
          rowStart: 2,
          rowSpan: 1,
          tabletColSpan: 4,
          mobileColSpan: 12,
        }
      ];

    case 'contentHub':
      return [
        {
          name: 'headline',
          content: widget.headlineContent,
          colStart: 1,
          colSpan: 12,
          rowStart: 1,
          rowSpan: 1,
          tabletColSpan: 12,
          mobileColSpan: 12,
        },
        {
          name: 'featured',
          content: widget.mainContent,
          colStart: 1,
          colSpan: 8,
          rowStart: 2,
          rowSpan: 2,
          tabletColSpan: 8,
          mobileColSpan: 12,
        },
        {
          name: 'quickLinks',
          content: widget.primaryAsideContent,
          colStart: 9,
          colSpan: 4,
          rowStart: 2,
          rowSpan: 2,
          tabletColSpan: 4,
          mobileColSpan: 12,
        },
        {
          name: 'section1',
          content: widget.section1Content,
          colStart: 1,
          colSpan: 6,
          rowStart: 4,
          rowSpan: 1,
          tabletColSpan: 6,
          mobileColSpan: 12,
        },
        {
          name: 'section2',
          content: widget.section2Content,
          colStart: 7,
          colSpan: 6,
          rowStart: 4,
          rowSpan: 1,
          tabletColSpan: 6,
          mobileColSpan: 12,
        }
      ];

    case 'galleryMasonry':
      return [
        {
          name: 'featured',
          content: widget.mainContent,
          colStart: 1,
          colSpan: 8,
          rowStart: 1,
          rowSpan: 2,
          tabletColSpan: 8,
          mobileColSpan: 12,
        },
        {
          name: 'side1',
          content: widget.primaryAsideContent,
          colStart: 9,
          colSpan: 4,
          rowStart: 1,
          rowSpan: 1,
          tabletColSpan: 4,
          mobileColSpan: 12,
        },
        {
          name: 'side2',
          content: widget.secondaryAsideContent,
          colStart: 9,
          colSpan: 4,
          rowStart: 2,
          rowSpan: 1,
          tabletColSpan: 4,
          mobileColSpan: 12,
        },
        {
          name: 'bottom',
          content: widget.galleryBottomContent,
          colStart: 1,
          colSpan: 12,
          rowStart: 3,
          rowSpan: 1,
          tabletColSpan: 12,
          mobileColSpan: 12,
        },
      ];

    case 'dashboardLayout':
      return [
        {
          name: 'mainMetric',
          content: widget.mainContent,
          colStart: 1,
          colSpan: 8,
          rowStart: 1,
          rowSpan: 3,
          tabletColSpan: 8,
          mobileColSpan: 12,
        },
        {
          name: 'sideMetrics',
          content: widget.primaryAsideContent,
          colStart: 9,
          colSpan: 4,
          rowStart: 1,
          rowSpan: 1,
          tabletColSpan: 4,
          mobileColSpan: 12,
        },
        {
          name: 'chart',
          content: widget.secondaryAsideContent,
          colStart: 9,
          colSpan: 4,
          rowStart: 2,
          rowSpan: 1,
          tabletColSpan: 4,
          mobileColSpan: 12,
        },
        {
          name: 'table',
          content: widget.tertiaryAsideContent,
          colStart: 9,
          colSpan: 4,
          rowStart: 3,
          rowSpan: 1,
          tabletColSpan: 4,
          mobileColSpan: 12,
        },
      ];

    case 'productShowcase':
      return [
        {
          name: 'mainProduct',
          content: widget.mainContent,
          colStart: 1,
          colSpan: 6,
          rowStart: 1,
          rowSpan: 2,
          tabletColSpan: 6,
          mobileColSpan: 12,
        },
        {
          name: 'details',
          content: widget.primaryAsideContent,
          colStart: 7,
          colSpan: 6,
          rowStart: 1,
          rowSpan: 2,
          tabletColSpan: 6,
          mobileColSpan: 12,
        },
        {
          name: 'related1',
          content: widget.related1Content,
          colStart: 1,
          colSpan: 4,
          rowStart: 3,
          rowSpan: 1,
          tabletColSpan: 4,
          mobileColSpan: 12,
        },
        {
          name: 'related2',
          content: widget.related2Content,
          colStart: 5,
          colSpan: 4,
          rowStart: 3,
          rowSpan: 1,
          tabletColSpan: 4,
          mobileColSpan: 12,
        },
        {
          name: 'related3',
          content: widget.related3Content,
          colStart: 9,
          colSpan: 4,
          rowStart: 3,
          rowSpan: 1,
          tabletColSpan: 4,
          mobileColSpan: 12,
        },
      ];

    case 'custom':
    default:
      return widget.customGrid.contentAreas.map((area) => ({
        ...area,
        tabletColSpan: area.tabletColSpan || area.colSpan,
        mobileColSpan: 12,
      }));
  }
};