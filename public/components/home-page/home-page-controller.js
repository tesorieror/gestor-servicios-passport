class HomePageController extends PageController {
  constructor(model) {
    super(model);
    this.view = new HomePageView();
  }
}