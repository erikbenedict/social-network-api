const User = require('../models/User');

module.exports = {
  async getUsers(req, res) {
    try {
      const users = await User.find();

      res.json(users);
    } catch (err) {
      console.log('Something went wrong getting the users');
      return res.status(500).json(err);
    }
  },

  async getSingleUser(req, res) {
    try {
      const user = await User.findOne({ _id: req.params.userId }).select(
        '-__v'
      );

      if (!user) {
        return res.status(404).json({ message: 'No user with that ID' });
      }

      res.json(user);
    } catch (err) {
      console.log('Something went wrong getting that user');
      return res.status(500).json(err);
    }
  },

  async createUser(req, res) {
    try {
      const newUser = await User.create(req.body);
      res.json(newUser);
    } catch (err) {
      console.log('Something went wrong creating a new user');
      res.status(500).json(err);
    }
  },

  async updateUser(req, res) {
    try {
      const { userId } = req.params;
      const { username, email } = req.body;

      const updatedUser = await User.findOneAndUpdate(
        { _id: userId },
        { $set: { username, email } },
        { new: true }
      );

      if (!updatedUser) {
        return res.status(404).json({ message: 'User not found' });
      }

      res.json(updatedUser);
    } catch (err) {
      console.log('Something went wrong when updating that user');
      res.status(500).json(err);
    }
  },

  async deleteUser(req, res) {
    try {
      const deletedUser = await User.findOneAndDelete({
        _id: req.params.userId,
      });
      res.json(deletedUser);
      console.log(`Deleted: ${deletedUser}`);
    } catch (err) {
      console.log('Something went wrong when deleting that user');
      res.status(500).json(err);
    }
  },
};
