angular.module('employeeApp').service('EmployeService', function($http) {
    const apiUrl = 'https://sample-backend-uvkh.onrender.com/api/employee';  // ✅ Render backend URL

    this.post = function(data) {
        return $http.post(apiUrl, data);
    };

    this.getAll = function() {
        return $http.get(apiUrl);
    };

    this.put = function(data) {
        return $http.put(apiUrl, data);  
    };

    this.delete = function(id) {
        return $http.delete(apiUrl + '/' + id);
    };
});
