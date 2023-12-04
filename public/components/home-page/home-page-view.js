class HomePageView extends PageView {


  constructor() {
    super('home-page');
  }

  async refresh(url) {
    await super.refresh(url);
  }

}