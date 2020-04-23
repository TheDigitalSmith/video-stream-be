const request = require('supertest');
const {User} = require('../../src/schema/user');
const {Genre} = require('../../src/schema/genre');
let server

describe('auth middleware',()=>{
    let token;

    beforeEach(()=>{
        server = require('../../index');
        token = new User().generateAuthToken();
    });
    afterEach(async()=>{
        server.close()
        await Genre.remove();
    });

    const exec = () =>{
        return request(server)
        .post('/api/films/genre')
        .set('x-auth-token', token)
        .send({name:'genre1'});
    };

    it('should return 401 when a request is made without a token',async ()=>{
        token = '';
        const res = await exec();
        expect(res.status).toBe(401);
    })

    it('should return 400 when a request is made with an invalid token', async()=>{
        token = 'hello';
        const res = await exec();
        expect(res.status).toBe(400);
    })

    it('should return 200 when a request is made with a valid token',async ()=>{
        const res = await exec();
        expect(res.status).toBe(200);
    })
})
