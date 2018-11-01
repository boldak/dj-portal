// let test = require ("./test.js")
 // import HelloWorld from './components/HelloWorld.vue'
   new Vue({
    el: '#app',
   components: {
     "hello-world": () => import('./components/HelloWorld.js')
   },
    data () {
      return {
        title: 'Your Logo',
        posts: [
          {
            title: 'Fusce ullamcorper tellus sed maximus',
            content: 'Fusce ullamcorper tellus sed maximus rutrum. Donec imperdiet ultrices maximus. Donec non tellus non neque pellentesque fermentum. Aenean in pellentesque urna. Mauris aliquet elit rutrum lorem fermentum, id lobortis arcu facilisis. Mauris ut justo magna. Vivamus euismod fringilla. ',
            imgUrl: '../img/cards/drop.jpg'
          },
          {
            title: 'Donec vitae suscipit lectus, a luctus diam.',
            content: 'Donec vitae suscipit lectus, a luctus diam. Proin vitae felis gravida, lobortis massa sit amet, efficitur erat. Morbi vel ultrices nisi. Aenean arcu sapien, rutrum nec mollis id, condimentum quis orci. Praesent a rhoncus orci. Praesent turpis turpis, imperdiet id eleifend consequat. ',
            imgUrl: '../img/cards/docks.jpg'
          },
          {
            title: 'Vestibulum condimentum quam eu est convallis',
            content: ' at sagittis sapien vulputate. Vivamus laoreet lacus id magna rutrum dapibus. Donec vel pellentesque arcu. Maecenas mollis odio tempus felis elementum commodo. Quisque gravida, est quis tincidunt bibendum, nibh elit dapibus mauris.',
            imgUrl: '../img/cards/plane.jpg'
          }
        ]
      }
    }
  })