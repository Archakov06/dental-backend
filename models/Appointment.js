const mongoose = require('mongoose');
const { Schema } = mongoose;

const AppointmentSchema = new Schema(
  {
    dentNumber: Number,
    price: Number,
    diagnosis: String,
    date: String,
    time: String,
    patient: { type: Schema.Types.ObjectId, ref: 'Patient' }
  },
  {
    timestamps: true
  }
);

const Appointment = mongoose.model('Appointment', AppointmentSchema);

module.exports = Appointment;
