const request = require('supertest');
const {Genre} = require('../../src/schema/genre');
const {User} = require('../../src/schema/user');
const mongoose = require('mongoose');
let server

describe('/api/genres',()=>{
    beforeEach(() =>{server = require('../../index'); })
    afterEach(async ()=>{
        server.close();
        await Genre.remove();
    });

    describe('GET /',()=>{
        it('should return all genres', async ()=>{
            await Genre.collection.insertMany([
                {name:'genre1'},
                {name:'genre2'}
            ])
            const res = await request(server).get('/api/films/genre');
            expect(res.status).toBe(200); 
            expect(res.body.length).toBe(2)
            expect(res.body.some(g=> g.name === 'genre1')).toBeTruthy();
            expect(res.body.some(g=> g.name === 'genre2')).toBeTruthy();
        })
    })

    describe('GET /:id',()=>{
        it('should return a specific genre',async ()=>{
            const genre = new Genre(
                {name:"genre1"}
            );
            await genre.save()
            const res = await request(server).get('/api/films/genre/' + genre._id);
            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty('name',genre.name);
        })

        it('should return a status 404 for invalid Id',async ()=>{
            const res = await request(server).get('/api/films/genre/1');
            expect(res.status).toBe(401);
        })
    })

    describe('POST /', ()=>{
        let token
        let name

        const exec = async() =>{
            return await request(server)
            .post('/api/films/genre')
            .set('x-auth-token', token)
            .send({name})
        }

        beforeEach(()=>{
            token = new User().generateAuthToken();
            name = 'genre1';
        })

        it('should return 401 if client is not logged in', async ()=>{
            token = '';
            const res = await exec();

            expect(res.status).toBe(401);
        })

        it('should return 400 if genre is less than 5 characters', async ()=>{
            name = '1234'
            const res = await exec()

            expect(res.status).toBe(400);
        })

        it('should return 400 if genre is more than 50 characters', async ()=>{
            name = new Array(52).join('a');
            const res = await exec();

            expect(res.status).toBe(400)
        })

        it('should save the genre when the body of the request is valid and the request has a valid token ', async ()=>{
            await exec();
            const genre = await Genre.find();
            
            expect(genre).not.toBeNull();
        })

        it('should have the genre returned in the body of the response when posted successfully ', async ()=>{
            const res = await exec();

            expect(res.body).toHaveProperty('_id');
            expect(res.body).toHaveProperty('name', 'genre1')
        })
    })

    describe('PUT /:id', ()=>{
        let token
        let name
        let endPoint
        let objectId = new mongoose.Types.ObjectId();
        const exec = async() =>{
            return await request(server)
            .put(endPoint)
            .set('x-auth-token', token)
            .send({name})
        }

        beforeEach(()=>{
            token = new User().generateAuthToken();
            name = 'genrePUT';
            endPoint = '/api/films/genre/' + objectId
        })

        it('should return a 401 if user is not logged in', async()=>{
            token = '';
            const result = await exec();
            expect(result.status).toBe(401)
        })

        it('should return status 400 if the body of the request has less than 5 characters', async ()=>{
            name = '1234'
            const result = await exec();
            expect(result.status).toBe(400);
        })

        it('should return status 400 if the body of the request has more than 50 characters', async()=>{
            name = new Array(52).join('a');
            const result = await exec();
            expect(result.status).toBe(400)
        })

        // it('should return status 404 if the genre has an invalid id',async()=>{
        //     endPoint = 'api/films/genre/' + 1
        //     const result = await exec();
        //     expect(result.status).toBe(404);
        // })

        it('should return status 404 if the genre with the given id to update is not found',async ()=>{
            const result = await exec();
            expect(result.status).toBe(404);
        })

        it('should return status 200 when successfully updating a genre', async()=>{
            const genre = new Genre({name});
            await genre.save();

            endPoint ='/api/films/genre/' + genre._id
            name = 'genrePUT3'
            const result = await exec();

            expect(result.status).toBe(200);
            expect(result.body).toHaveProperty('name', 'genrePUT3')
        })
    })

    // // describe('DELETE /:id',()=>{
    // //     let token
    // //     let endPoint
    // //     const objectId = new mongoose.Types.ObjectId();

    // //     const exec = async() =>{
    // //         return await request(server)
    // //         .delete(endPoint)
    // //         .set('x-auth-token', token)
    // //     }

    // //     beforeEach(()=>{
    // //         endPoint = 'api/films/genre/' + objectId
    // //     })

    // //     it('should return status 404 if genre with a given id is not found', async()=>{
    // //         const user = {_id: new mongoose.Types.ObjectId(), isAdmin:true}
    // //         token = new User(user).generateAuthToken()
    // //         const result = await exec();
    // //         expect(result.status).toBe(404);
    // //     })
    // // })
})