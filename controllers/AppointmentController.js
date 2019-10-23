const { validationResult } = require('express-validator');
const dayjs = require('dayjs');

const ruLocale = require('dayjs/locale/ru');

const { groupBy, reduce } = require('lodash');

const { Appointment, Patient } = require('../models');

const { sendSMS } = require('../utils');

function AppointmentController() {}

const create = async function(req, res) {
  const errors = validationResult(req);
  let patient;

  const data = {
    patient: req.body.patient,
    dentNumber: req.body.dentNumber,
    diagnosis: req.body.diagnosis,
    price: req.body.price,
    date: req.body.date,
    time: req.body.time,
  };

  if (!errors.isEmpty()) {
    return res.status(422).json({
      success: false,
      message: errors.array(),
    });
  }

  try {
    patient = await Patient.findOne({ _id: data.patient });
  } catch (e) {
    return res.status(404).json({
      success: false,
      message: 'PATIENT_NOT_FOUND',
    });
  }

  Appointment.create(data, function(err, doc) {
    if (err) {
      return res.status(500).json({
        success: false,
        message: err,
      });
    }

    const delayedTime = dayjs(
      `${data.date
        .split('.')
        .reverse()
        .join('.')}T${data.time}`,
    )
      .subtract(1, 'minute')
      .unix();

    sendSMS({
      number: patient.phone,
      time: delayedTime,
      text: `Сегодня в ${data.time} у Вас приём в стоматологию "Granit".`,
    });

    res.status(201).json({
      success: true,
      data: doc,
    });
  });
};

const update = async function(req, res) {
  const appointmentId = req.params.id;
  const errors = validationResult(req);

  const data = {
    dentNumber: req.body.dentNumber,
    diagnosis: req.body.diagnosis,
    price: req.body.price,
    date: req.body.date,
    time: req.body.time,
  };

  if (!errors.isEmpty()) {
    return res.status(422).json({
      success: false,
      message: errors.array(),
    });
  }

  Appointment.updateOne({ _id: appointmentId }, { $set: data }, function(err, doc) {
    if (err) {
      return res.status(500).json({
        success: false,
        message: err,
      });
    }

    if (!doc) {
      return res.status(404).json({
        success: false,
        message: 'APPOINTMENT_NOT_FOUND',
      });
    }

    res.json({
      success: true,
    });
  });
};

const remove = async function(req, res) {
  const id = req.params.id;

  try {
    await Appointment.findOne({ _id: id });
  } catch (e) {
    return res.status(404).json({
      success: false,
      message: 'APPOINTMENT_NOT_FOUND',
    });
  }

  Appointment.deleteOne({ _id: id }, err => {
    if (err) {
      return res.status(500).json({
        success: false,
        message: err,
      });
    }

    res.json({
      status: 'succces',
    });
  });
};

const all = function(req, res) {
  Appointment.find({})
    .populate('patient')
    .exec(function(err, docs) {
      if (err) {
        return res.status(500).json({
          success: false,
          message: err,
        });
      }

      res.json({
        status: 'succces',
        data: reduce(
          groupBy(docs, 'date'),
          (result, value, key) => {
            result = [
              ...result,
              {
                title: dayjs(key)
                  .locale(ruLocale)
                  .format('D MMMM'),
                data: value,
              },
            ];
            return result;
          },
          [],
        ),
      });
    });
};

AppointmentController.prototype = {
  all,
  create,
  remove,
  update,
};

module.exports = AppointmentController;
