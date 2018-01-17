const expect = require('chai').expect;
const assert = require('chai').assert;
const MHGrab = require('../mhgrab');
const fs = require('fs');


let grab, opt, login;

describe('MHGrab' , function () {
    this.timeout(6000);
    beforeEach( () => {
        opt = require('../data/data');
        login = require('../data/login');

        grab = new MHGrab();
    })
    describe('.getRequest arguments, should return', function () {
        it('false if arguments empty', function () {
            expect(grab.getRequest()).to.be.false;
        })
        it('false if first argument is not Object', function () {
            expect(grab.getRequest('str')).to.be.false;
            expect(grab.getRequest(1)).to.be.false;
            expect(grab.getRequest([])).to.be.false;
        })
        it('false if second argument is not Array', function () {
            expect(grab.getRequest({},'str')).to.be.false;
        })
        it('Promise if first argument object {uri:"https://ya.ru/"}', function () {
            expect(grab.getRequest({uri:'https://ya.ru/'})).to.be.instanceof(Promise)
        })
        it('html page ya.ru if url: "https://ya.ru"', function() {
            let options = {
                uri: 'https://ya.ru/',
                method: 'GET'
            };

            return  grab.getRequest(options).then(resp => {
                return expect(resp).to.match(/Яндекс/);
            })
        })
    })
    describe('.getRequest content', function () {
        it('should retrurn home page site MH, when first argument options connection, second login couple [login, password]', function () {
            return    grab.getRequest(opt, login['de']).then(resp => {
                expect(resp).to.match(/delante_new/);
            })
        })
        it('should return cirylic simbols to utf8, site data in encoding windows-1251', function () {
            return  grab.getRequest(opt, login['de']).then(
                resp => {
                    expect(resp).to.match(/Услуги/);
                })
            })
            it('should return current score, when call function getMony', function () {
                return grab.getRequest(opt, login['de']).then(
                    resp => {
                        let score = grab.getMony();

                        expect(Number(score)).to.be.a('number');
                    })
                })
            })
            describe('private function _saveToFile', function(){
                this.timeout(12000);
                let fileName, data, counter = 0;

                const path = require('path');
                // funcction test access file or dir
                const existFile = (fileName) => {
                    return new Promise((resolve, reject) => {
                        fs.access(fileName, fs.constants.F_OK | fs.constants.R_OK, err => {
                            err ? reject(false) : resolve(true);
                        })
                    })
                }

                beforeEach(() => {
                    [fileName, data] = [`${__dirname}/../saveFiles/TestPDF${counter++}.pdf`, `<html><head><title>Test html file</title></head><body><h1>TEST PDF</h1></body></html>`];
                })
                // afterEach(() => {
                //     fs.access(fileName, (err) => {
                //         if (err) {
                //             if (err.code === 'ENOENT') {
                //                 //   console.error('myfile does not exist');
                //                 return;
                //             }
                //         } else {
                //             fs.unlink(fileName, (err) => {
                //                 if(err){
                //                     throw err;
                //                 }
                //             })
                //         }
                //     })
                // })
                it('should return false when data is empty', () => {
                    return grab
                    ._saveToFile()
                    .catch( res => expect(res).to.be.false)
                })
                it('should return Promise when data save to file', () => {
                    return expect(grab._saveToFile(fileName, data)).to.be.instanceof(Promise);
                });
                it('should return "successfully save file %fileName%"', () => {
                    return grab._saveToFile(fileName, data)
                    .then(result => {
                        return expect(result).to.match(/TestPDF/);
                    }).catch( err => expect(err).to.match(/Error write file/) )
                });
                it('should return pdf file when set in input html file', () => {
                    const source = path.resolve(`${__dirname}/../data/outHTML.html`);

                    return grab._saveToFile(fileName, fs.readFileSync(source, 'utf8'))
                    .then( resp => {
                        return  existFile(fileName)
                        .then(ok => expect(ok).to.be.true)
                        .catch( err => console.log(`Error ${fileName} not find!`))
                    }).catch( err => console.log(`Error when save file: ${err}`))
                })
                it(`should save pdf file after get new score`, () => {

                    return grab
                    .getRequest(opt, login['de'])
                    .then(() => grab.getScore('1000'))
                    .then(res => res.toPDF(fileName))
                    .then(() => existFile(fileName))
                    .then(ok => expect(ok).to.true)
                    .catch( err => expect(err).to.be.false)
                })
            })
        })
