var app = angular.module('employeeApp', []);

app.controller('employeeController', function ($scope, EmployeService) {

    $scope.employeeData = {};
    $scope.employees = [];
    $scope.showModal = false;
    $scope.isEditMode = false;
    

    // Format date as yyyy-MM-dd (for backend)
    function formatDate(date) {
        if (!date) return null;
        return new Date(date).toISOString().split('T')[0];
    }

    $scope.submitForm = function (form) {
        if (form.$valid) {
            var payload = angular.copy($scope.employeeData);

            payload.dob = formatDate(payload.dob);
            payload.joiningDate = formatDate(payload.joiningDate);

            if ($scope.isEditMode) {
                $scope.editEmployee(payload);
            } else {
                $scope.addEmployee(payload);
            }
        } else {
            console.error('Form is invalid');
        }
    };

    $scope.addEmployee = function (employee) {
        EmployeService.post(employee)
            .then(function (response) {
                console.log('Employee added:', response.data);
                $scope.closePopup();
                $scope.getEmployees();
            }, function (error) {
                console.error('Error adding employee:', error.data || error);
            });
    };

    $scope.editEmployee = function (employee) {
        EmployeService.put(employee)
            .then(function (response) {
                console.log('Employee updated:', response.data);
                $scope.closePopup();
                $scope.getEmployees();
            }, function (error) {
                console.error('Error updating employee:', error.data || error);
            });
    };

    $scope.deleteEmployee = function (empCode) {
        if (confirm("Are you sure you want to delete this employee?")) {
            EmployeService.delete(empCode)
                .then(function (response) {
                    console.log('Employee deleted:', response.data);
                    $scope.getEmployees();
                }, function (error) {
                    console.error('Error deleting employee:', error);
                });
        }
    };

    $scope.getEmployees = function () {
        EmployeService.getAll()
            .then(function (response) {
                $scope.employees = response.data;
            }, function (error) {
                console.error('Error loading employees:', error);
            });
    };

    $scope.openPopup = function (employee) {
        if (employee) {
            $scope.employeeData = angular.copy(employee);
            $scope.employeeData.dob = new Date($scope.employeeData.dob);
            $scope.employeeData.joiningDate = new Date($scope.employeeData.joiningDate);
            $scope.isEditMode = true;
        } else {
            $scope.employeeData = {
                role: 'Employee'  
            };
            $scope.isEditMode = false;
        }
        $scope.showModal = true;
    };

    $scope.closePopup = function () {
        $scope.clearForm();
        $scope.showModal = false;
    };

    $scope.clearForm = function () {
        $scope.employeeData = {};
        if ($scope.employeeForm) {
            $scope.employeeForm.$setPristine();
            $scope.employeeForm.$setUntouched();
        }
        $scope.isEditMode = false;
    };


    $scope.getEmployees();


});
