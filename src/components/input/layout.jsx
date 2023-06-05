const Layout = { HORIZONTAL: 'HorizonalLayout', VERTICAL: 'VerticalLayout' }
Layout.flip = layout => (layout === Layout.VERTICAL) ? Layout.HORIZONTAL : Layout.VERTICAL
export default Layout