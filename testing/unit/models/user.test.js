const {User} = require('../../../src/schema/user');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

describe('userAuthenticationToken', ()=>{
    it('should return a valid JWT token',()=>{
        const payload = {_id: new mongoose.Types.ObjectId().toHexString(), isAdmin:true}
        const user = new User(payload);
        const token = user.generateAuthToken();
        const decoded = jwt.verify(token, process.env.secretOrKey);
        expect(decoded).toMatchObject(payload);
    })
})