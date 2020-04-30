const {Rental} = require('../../src/schema/rental')
const mongoose = require('mongoose');


describe('/api/returns', ()=>{
    let server
    let customerId
    let filmId
    let rental

    beforeEach(async ()=>{
        server = require('../../index');
        customerId = mongoose.Types.ObjectId();
        filmId = mongoose.Types.ObjectId();
        
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
        console.log('rental', rental);
    })

    afterEach(async()=>{
        server.close();
        await Rental.remove({});
    })

    it('should work',async()=>{
        const result = await Rental.findById(rental._id);
        expect(result).not.toBeNull();
    })

})