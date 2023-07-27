const Thought = require('../models/Thought');

module.exports = {
  async getThoughts(req, res) {
    try {
      const thoughts = await Thoughts.find();

      res.json(thoughts);
    } catch (err) {
      console.log('Something went wrong getting the thoughts');
      return res.status(500).json(err);
    }
  },

  async getSingleThought(req, res) {
    try {
      const thought = await Thought.findOne({
        _id: req.params.thoughtId,
      }).select('-__v');

      if (!thought) {
        return res.status(404).json({ message: 'No thought with that ID' });
      }

      res.json(thought);
    } catch (err) {
      console.log('Something went wrong getting that thought');
      return res.status(500).json(err);
    }
  },

  async createThought(req, res) {
    try {
      const newThought = await Thought.create(req.body);

      res.json(newThought);
    } catch (err) {
      console.log('Something went wrong creating a new thought');
      res.status(500).json(err);
    }
  },

  async updateThought(req, res) {
    try {
      const { thoughtId } = req.params.thoughtId;
      const { thoughtText } = req.body;

      const updatedThought = await Thought.findOneAndUpdate(
        { _id: thoughtId },
        { $set: { thoughtText } },
        { new: true }
      );

      if (!updatedThought) {
        return res.status(404).json({ message: 'Thought not found' });
      }

      res.json(updatedThought);
    } catch (err) {
      console.log('Something went wrong when updating that thought');
      res.status(500).json(err);
    }
  },

  async deleteThought(req, res) {
    try {
      const deletedThought = await Thought.findOneAndDelete({
        _id: req.params.thoughtId,
      });

      if (!deletedThought) {
        return res
          .status(404)
          .json({ message: 'No thought found with that id' });
      }

      res.json(deletedThought);
      console.log(`Deleted: ${deletedThought}`);
    } catch (err) {
      console.log('Something went wrong when deleting that thought');
      res.status(500).json(err);
    }
  },
};
