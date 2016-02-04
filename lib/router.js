Router.configure({
  layoutTemplate: 'layout'
});

Router.route('/', {
  name: 'home'
});

Router.route('/hello', {
  name: 'hello'
});

Router.route('/config', {
  name: 'loginConfig'
});