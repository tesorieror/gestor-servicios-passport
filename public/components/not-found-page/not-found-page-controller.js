class NotFoundPageController extends PageController {
  constructor(model) {
    super(model);
    this.view = new NotFoundPageView();
  }

  async refresh(url) {
    let urlParam = this.getParam('url');
    if (urlParam) this.view.url = urlParam;
    await super.refresh(url);
  }

}