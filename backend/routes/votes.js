const express = require('express');
const Vote = require('../models/Vote');
const User = require('../models/User');
const Nominee = require('../models/Nominee');
const { auth, adminAuth } = require('../middleware/auth');

const router = express.Router();

// ================== CAST A VOTE ==================
router.post('/', auth, async (req, res) => {
  const { nomineeId, position } = req.body;
  try {
    const userId = req.user && req.user.id;
    console.log('Vote request', { userId, nomineeId, position });

    if (!userId) {
      console.warn('No userId found on req.user');
      return res.status(401).json({ msg: 'Unauthorized' });
    }

    // Check if user already voted for this position
    const existingVote = await Vote.findOne({ user: userId, position });
    console.log('existingVote:', !!existingVote);
    if (existingVote) {
      return res.status(400).json({ msg: `You have already voted for ${position}` });
    }

    // Validate nominee
    const nominee = await Nominee.findById(nomineeId);
    if (!nominee || nominee.position !== position || !nominee.approved) {
      console.log('Invalid nominee check', { nominee });
      return res.status(400).json({ msg: 'Invalid nominee' });
    }

    // Save vote
    const vote = new Vote({ user: userId, nominee: nomineeId, position });
    const savedVote = await vote.save();
    console.log('savedVote id:', savedVote._id);

    // Increment nominee votes
    nominee.votes = (nominee.votes || 0) + 1;
    const savedNominee = await nominee.save();
    console.log('nominee votes after increment:', savedNominee.votes);

    // ✅ Update user hasVoted — use $set and return the updated doc
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: { hasVoted: true } },
      { new: true } // return updated document
    );

    console.log('updatedUser (after set hasVoted):', updatedUser ? updatedUser.hasVoted : updatedUser);
    if (!updatedUser) {
      // this means the findByIdAndUpdate returned null — userId mismatch
      console.warn('User update returned null. Check that userId exists in users collection.');
    }

    // Return updated user so frontend can immediately reflect change
    res.json({ msg: 'Vote recorded successfully', nominee: savedNominee, user: updatedUser });
  } catch (error) {
    console.error('Vote route error:', error);
    res.status(500).json({ msg: 'Server error' });
  }
});

// ================== VIEW RESULTS (ADMIN ONLY) ==================
router.get('/results', auth, adminAuth, async (req, res) => {
  try {
    const votes = await Vote.aggregate([
      {
        $group: {
          _id: { nomineeId: '$nominee', position: '$position' },
          count: { $sum: 1 },
        },
      },
      {
        $lookup: {
          from: 'nominees',
          localField: '_id.nomineeId',
          foreignField: '_id',
          as: 'nominee',
        },
      },
      { $unwind: '$nominee' },
    ]);

    res.json(votes);
  } catch (error) {
    console.error('Vote results error:', error);
    res.status(500).json({ msg: 'Server error' });
  }
});

module.exports = router;
