const { validationResult } = require('express-validator');
const { Patient } = require('../models');

function PatientContoller() {}

const create = function(req, res) {
  const errors = validationResult(req);
  const data = {
    fullname: req.body.fullname,
    phone: req.body.phone
  };

  if (!errors.isEmpty()) {
    return res.status(422).json({
      success: false,
      message: errors.array()
    });
  }

  Patient.create(data, function(err, doc) {
    if (err) {
      return res.status(500).json({
        success: false,
        message: err
      });
    }

    res.status(201).json({
      success: true,
      data: doc
    });
  });
};

const update = async function(req, res) {
  const patientId = req.params.id;
  const errors = validationResult(req);

  const data = {
    fullname: req.body.fullname,
    phone: req.body.phone
  };

  if (!errors.isEmpty()) {
    return res.status(422).json({
      success: false,
      message: errors.array()
    });
  }

  Patient.updateOne({ _id: patientId }, { $set: data }, function(err, doc) {
    if (err) {
      return res.status(500).json({
        success: false,
        message: err
      });
    }

    if (!doc) {
      return res.status(404).json({
        success: false,
        message: 'PATIENT_NOT_FOUND'
      });
    }

    res.json({
      success: true
    });
  });
};

const remove = async function(req, res) {
  const id = req.params.id;

  try {
    await Patient.findOne({ _id: id });
  } catch (e) {
    return res.status(404).json({
      success: false,
      message: 'PATIENT_NOT_FOUND'
    });
  }

  Patient.deleteOne({ _id: id }, err => {
    if (err) {
      return res.status(500).json({
        success: false,
        message: err
      });
    }

    res.json({
      status: 'succces'
    });
  });
};

const show = async function(req, res) {
  const id = req.params.id;
  try {
    const patient = await Patient.findById(id)
      .populate('appointments')
      .exec();

    res.json({
      status: 'succces',
      data: { ...patient._doc, appointments: patient.appointments }
    });
  } catch (e) {
    return res.status(404).json({
      success: false,
      message: 'PATIENT_NOT_FOUND'
    });
  }
};

const all = function(req, res) {
  Patient.find({}, function(err, docs) {
    if (err) {
      return res.status(500).json({
        success: false,
        message: err
      });
    }

    res.json({
      status: 'succces',
      data: docs
    });
  });
};

PatientContoller.prototype = {
  all,
  create,
  update,
  remove,
  show
};

module.exports = PatientContoller;
