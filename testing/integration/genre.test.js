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
        let objectId = mongoose.Types.ObjectId();
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

    describe('DELETE /:id', () => {
        let token; 
        let genre; 
        let id; 
    
        const exec = async () => {
          return await request(server)
            .delete('/api/films/genre/' + id)
            .set('x-auth-token', token)
            .send();
        }
    
        beforeEach(async () => {
          genre = new Genre({ name: 'genre1' });
          await genre.save();
          
          id = genre._id; 
          token = new User({ isAdmin: true }).generateAuthToken();     
        })
    
        it('should return 401 if client is not logged in', async () => {
          token = ''; 
    
          const res = await exec();
    
          expect(res.status).toBe(401);
        });
    
        it('should return 403 if the user is not an admin', async () => {
          token = new User({ isAdmin: false }).generateAuthToken(); 
    
          const res = await exec();
    
          expect(res.status).toBe(403);
        });
    
        it('should return 401 if id is invalid', async () => {
          id = 1; 
          
          const res = await exec();
    
          expect(res.status).toBe(401);
        });
    
        it('should return 404 if no genre with the given id was found', async () => {
          id = mongoose.Types.ObjectId();
    
          const res = await exec();
    
          expect(res.status).toBe(404);
        });
    
        it('should delete the genre if input is valid', async () => {
          await exec();
    
          const genreInDb = await Genre.findById(id);
    
          expect(genreInDb).toBeNull();
        });
    
        it('should return the removed genre', async () => {
          const res = await exec();
    
          expect(res.body.genre).toHaveProperty('_id', genre._id.toHexString());
          expect(res.body.genre).toHaveProperty('name', genre.name);
        });
      });  
})