const expect = require('chai').expect;
const assert = require('chai').assert;
const MHGrab = require('../mhgrab');



describe('Parse content page, test whit using local webserver', function() {
  let WebServer = require('../libs/webserver'),
    options = {
        url: 'http://localhost:4000',
        method: 'GET'
    },
    serverSettings = {
        port: 4000,
        file: `${__dirname}/../data/mainPage.html`
    }, server, grab;
  beforeEach( () => {
    grab = new MHGrab();
    server = new WebServer(serverSettings, 100);
  })
  afterEach(() => {
    server.close();
  })
  it('should return "csrf_token" when call function getCSRFKey', function () {
      return grab.getRequest(options)
      .then(
          resp => {
              let result = grab.getCSRFKey();

              expect(result).to.be.eql('DT2ZnxB0gDwk9a3hyd362XHuA2DglkBh');
          })
  })
  it('should return id score user, when call function getIdScope', function () {
      return grab.getRequest(options)
      .then(
          resp => {
              let result = grab.getIdScope();

              expect(result).to.be.a("Number");
              expect(result).to.be.eql(429470);
          })
  })
})
