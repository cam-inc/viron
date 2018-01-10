export default function() {
  this.json = {
    size: 1,
    limit: 10,
    offset: null,
    list: [
      {
        id: '5efa2430-ed35-11e7-8c18-0242ac120002',
        date: '2016-12-18',
        title: '始まりの朝',
        body: '5:00に起床。 デニーズは6:00時からなので、このまま行くとまだ開店してないなと思い、 布団の中でうだうだしていたら、寝てしまったようで6:00になっていた。 12月の外はまだ暗く、狭い小窓から見える東京タワーは夜の世界でオレンジ色に輝いていた。 渋谷のストリートを駆け上がり、デニーズに着いたのは6:40だったか、6:50くらいだったと思う。 僕はツヤツヤ光るスクランブルエッグとベーコンを横に見ながら、コーヒーを飲み、 次は5:30に起きればちょうどいいかなというような事を考えながら、ノートPCを開いたのである。',
        publishing: true
      }
    ]
  };

  const store = this.riotx.get();

  this.isDesktop = store.getter('layout.isDesktop');
  this.isMobile = store.getter('layout.isMobile');
  this.layoutType = store.getter('layout.type');
  this.endpoints = store.getter('endpoints.allByOrderFiltered');
  // エンドポイントカードがDnD可能な状態か否か。
  this.isDraggable = false;

  this.listen('application', () => {
    this.endpoints = store.getter('endpoints.allByOrderFiltered');
    this.update();
  });
  this.listen('endpoints', () => {
    this.endpoints = store.getter('endpoints.allByOrderFiltered');
    this.update();
  });
  this.listen('layout', () => {
    this.isDesktop = store.getter('layout.isDesktop');
    this.isMobile = store.getter('layout.isMobile');
    this.layoutType = store.getter('layout.type');
    if (!this.isDesktop) {
      this.isDraggable = false;
    }
    this.update();
  });

  this.handleOrderButtonTap = () => {
    if (!this.isDesktop) {
      return;
    }
    this.isDraggable = !this.isDraggable;
    this.update();
  };
}
