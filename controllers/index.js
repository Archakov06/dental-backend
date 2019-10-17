const PatientController = require('./PatientController');
const AppointmentController = require('./AppointmentController');

module.exports = {
  PatientCtrl: new PatientController(),
  AppointmentCtrl: new AppointmentController()
};
