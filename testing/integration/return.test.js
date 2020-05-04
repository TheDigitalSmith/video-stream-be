const {Rental} = require('../../src/schema/rental');
const {Film} = require('../../src/schema/films');
const{User} = require('../../src/schema/user');
const mongoose = require('mongoose');
const request = require('supertest');
const moment = require('moment');


describe('/api/returns', ()=>{
    let server
    let customerId
    let filmId
    let rental
    let token
    let film

    const exec = () => {
        return request(server)
        .post('/api/returns')
        .set('x-auth-token', token)
        .send({customerId, filmId})
    }

    beforeEach(async ()=>{
        server = require('../../index');
        customerId = mongoose.Types.ObjectId();
        filmId = mongoose.Types.ObjectId();
        token = new User().generateAuthToken();
        
        film = new Film ({
            _id : filmId,
            title: '12345',
            dailyRentalRate:'1',
            genre: {name: '12345'},
            numberInStock: 10
        })
        await film.save();

        rental = new Rental({
            customer:{
                name: '12345',
                phone: '12345',
                _id: customerId
            },
            film:{
                title: '12345',
                dailyRentalRate: 1,
                _id: filmId
            }
        })
        await rental.save();
    })

    afterEach(async()=>{
        await Rental.remove({});
        await Film.remove({});
        await server.close();
    })

    it('should return 401 if client is not logged in',async()=>{
        token = '';
        const result = await exec();
        expect(result.status).toBe(401);
    })

    it('should return 400 if customerId is not provided', async ()=>{
        customerId = ''
        const result = await exec();
        expect(result.status).toBe(400);
    })

    it('should return 400 if filmId not provided', async()=>{
        filmId = '';
        const result = await exec();
        expect(result.status).toBe(400);
    })

    it('should Return 404 if no rental found with the customer/film', async()=>{
        await Rental.remove({});
        const result = await exec();

        expect(result.status).toBe(404);
    })

    it('should return 400 if rental is already processed', async()=>{
        rental.dateReturned = new Date();
        await rental.save();
        const result = await exec();
        expect(result.status).toBe(400);
    })

    it('should return 200 if valid request', async()=>{
        const result = await exec();
        expect(result.status).toBe(200);
    })

    it('should set the return date if input is valid', async()=>{
        const result = await exec()
        const rentalInDb = await Rental.findById(rental._id);
        const diff = new Date() - rentalInDb.dateReturned
        expect(diff).toBeLessThan(10 * 1000);
        // expect(rentalInDb.dateReturned).toBeDefined();
        // expect(result.body).toHaveProperty('dateReturned')
    })

    it('should calculate the rental fee if input is valid', async() => {
        rental.dateOut = moment().add(-7,'days').toDate();
        await rental.save();

        const result = await exec();
        const rentalInDb = await Rental.findById(rental._id);
        
        expect(rentalInDb.rentalFee).toBe(7);    
    })

    it('should increase the stock in Db if input is valid', async() => {
        const result = await exec();

        const filmInDb = await Film.findById(filmId);
        expect(filmInDb.numberInStock).toBe(film.numberInStock + 1);
    })

    it('should return the rental in the response', async() => {
        const result = await exec();

        const rentalInDb = await Rental.findById(rental._id);
        expect(Object.keys(result.body)).toEqual(expect.arrayContaining (['dateOut', 'dateReturned', 'rentalFee', 'customer', 'film']));
    })


})