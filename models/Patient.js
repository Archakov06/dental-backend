const mongoose = require('mongoose');
const { Schema } = mongoose;

const PatientSchema = new Schema(
  {
    id: String,
    fullname: String,
    phone: String
  },
  {
    timestamps: true
  }
);

const Patient = mongoose.model('Patient', PatientSchema);

module.exports = Patient;
