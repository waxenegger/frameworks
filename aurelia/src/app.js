export class App {
  configureRouter(config, router) {
    config.title = 'Aurelia Example';
    config.map([
      { route: [''], name: 'example',      moduleId: 'example',      nav: true, title: 'Aurelia Example' }
    ]);

    this.router = router;
  }
}
