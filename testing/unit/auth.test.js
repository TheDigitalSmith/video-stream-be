const auth = require("../../src/utils/middleware/auth");
const dotenv = require('dotenv');
const { User } = require("../../src/schema/user");
const mongoose = require('mongoose');
dotenv.config();

describe("auth middleware", () => {
  it("should populate req.user with the payload of a valid JWT", () => {
    const user = {_id: new mongoose.Types.ObjectId().toHexString(), isAdmin: true};
    const token = new User(user).generateAuthToken();
    // const token = new User().generateAuthToken();
    const req = {
      header: jest.fn().mockReturnValue(token),
    };
    const res = {};
    const next = jest.fn();

    auth(req, res, next);
    expect(req.user).toMatchObject(user);
  });
});
