let chai = require('chai');
let chaiHttp = require('chai-http');
const expect = require('chai').expect;
const dotenv = require('dotenv');

dotenv.config();
const { USER_TEST } = process.env;

chai.use(chaiHttp);
const url = 'http://localhost:3000/api/v1';

describe('Registrar un usuario: ', () => {

    it('debería registrar un usuario con status 200', (done) => {
        chai.request(url)
            .post('/register')
            .send({ nombreUsuario: `${USER_TEST}`, nombreApellido: "Juan Pruebas", telefono: "444444", email: "email", password: "password123", direccion1: "direccion1" })
            .end((err, res) => {
                expect(err).to.be.null;
                expect(res).to.have.status(200);
                done();
            });
    });

    it('debería eliminar el usuario con status 200', (done) => {
        chai.request(url)
            .delete('/usuarios/test')
            .end((err, res) => {
                expect(err).to.be.null;
                expect(res).to.have.status(200);
                done();
            });
    })
});