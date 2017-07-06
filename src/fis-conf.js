fis.match('*_Route.js', {
  packTo: '/resources/pack/Route.js'
});
fis.match('*_Controller.js', {
  packTo: '/resources/pack/Controller.js'
});
fis.match('*_Service.js', {
  packTo: '/resources/pack/Service.js'
});
fis.match('{app,font,simple-line-icons,font-awesome.min,animate}.css', {
  packTo: '/resources/pack/style.css'
});