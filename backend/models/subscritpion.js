const mongoose = require('mongoose');

const SubscriptionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  planId: { type: mongoose.Schema.Types.ObjectId, ref: 'Plan', required: true },
  startDate: { type: Date, default: Date.now },
  status: { type: String, enum: ['ACTIVE', 'CANCELED'], default: 'ACTIVE' },
});

module.exports = mongoose.model('Subscription', SubscriptionSchema);
