angular.module('employeeApp')
.service('LoginService', function ($http) {
  const apiUrl = 'https://localhost:5001/api/login';

  this.login = function (data) {
    return $http.post(apiUrl, data);
  };

  this.changePassword = function (data) {
    return $http.post(`${apiUrl}/change-password`, data);
  };

  this.forgotPassword = function (email) {
    return $http.post(`${apiUrl}/forgot-password`, { username: email });
  };

  this.resetPassword = function (data) {
    return $http.post(`${apiUrl}/set-password`, data);
  };

  // ✅ ADD THIS
  this.signIn = function () {
    return $http.post(`${apiUrl}/signin`);
  };

  this.signOut = function () {
    return $http.post(`${apiUrl}/signout`);
  };

  
});
