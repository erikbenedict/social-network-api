const Thought = require('../models/Thought');
const User = require('../models/User');

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
      const userId = req.body.userId;

      await User.findByIdAndUpdate(userId, {
        $push: { thoughts: newThought._id },
      });

      res.json(newThought);
    } catch (err) {
      console.log('Something went wrong creating a new thought', err);
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

  // **** Reaction Controllers **** //

  async addReaction(req, res) {
    try {
      const thought = await Thought.findOneAndUpdate(
        { _id: req.params.thoughtId },
        { $addToSet: { reactions: req.body } },
        { runValidators: true, new: true }
      );

      if (!thought) {
        return res
          .status(404)
          .json({ message: 'No thought found with that id' });
      }

      res.json(thought);
    } catch (err) {
      console.log('Something went wrong when adding that reaction');
      res.status(500).json(err);
    }
  },

  async removeReaction(req, res) {
    try {
      const thought = await Thought.findOneAndUpdate(
        { _id: req.params.thoughtId },
        { $pull: { reactions: { _id: req.params.reactionId } } },
        { runValidators: true, new: true }
      );

      if (!thought) {
        return res
          .status(404)
          .json({ message: 'No thought found with that id' });
      }

      res.json(thought);
    } catch (err) {
      console.log('Something went wrong when removing that reaction');
      res.status(500).json(err);
    }
  },
};
