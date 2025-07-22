angular.module('employeeApp', [])
.controller('LoginController', function ($scope,$window, LoginService) {
  $scope.loginData = {};
  $scope.forgotData = {};
  $scope.resetPasswordData = {};
  $scope.passwordData = {};

  $scope.isLoggedIn = false;
  $scope.showForgotPassword = false;
  $scope.showResetPasswordForm = false;
  $scope.showChangePasswordForm = false;

  $scope.username = '';
  $scope.role = '';

  // Check for token in URL
  const urlParams = new URLSearchParams(window.location.search);
  const tokenFromUrl = urlParams.get('token');

  if (tokenFromUrl) {
    $scope.showResetPasswordForm = true;
  }

  $scope.submitLogin = function (form) {
  if (form.$valid) {
    LoginService.login($scope.loginData).then(function (response) {
      const user = response.data;
      $scope.username = user.username;
      $scope.role = user.role;
      $scope.errorMessage = '';

      if (user.isFirstTimeLogin) {
        $scope.showChangePasswordForm = true;
        $scope.isLoggedIn = false;
      } else {
        $scope.isLoggedIn = true;

        // ✅ Redirect if Admin
        if ($scope.role === 'Admin') {
          $window.location.href = 'login.html'; // Change to your actual page
        }
      }
    }).catch(function () {
      $scope.errorMessage = 'Invalid username or password';
    });
  }
};


  $scope.showForgotPasswordForm = function () {
    $scope.showForgotPassword = true;
    $scope.errorMessage = '';
    $scope.successMessage = '';
  };

  $scope.cancelForgotPassword = function () {
    $scope.showForgotPassword = false;
    $scope.forgotData.email = '';
  };

  $scope.forgotPassword = function (form) {
    if (form.$valid) {
      LoginService.forgotPassword($scope.forgotData.email).then(function () {
        $scope.successMessage = 'Reset link sent to your email';
        $scope.errorMessage = '';
      }).catch(function () {
        $scope.errorMessage = 'Email not found or failed to send reset link';
        $scope.successMessage = '';
      });
    }
  };

  $scope.resetPassword = function (form) {
    if (form.$valid && tokenFromUrl) {
      const requestData = {
        newPassword: $scope.resetPasswordData.newPassword,
        token: tokenFromUrl
      };

      LoginService.resetPassword(requestData)
        .then(function () {
          $scope.resetSuccessMessage = "Password reset successfully. Please log in.";
          $scope.resetErrorMessage = "";

          $scope.showResetPasswordForm = false;
          $scope.showForgotPassword = false;
          $scope.showChangePasswordForm = false;
          $scope.isLoggedIn = false;
          $scope.role = "";
          $scope.username = "";

          setTimeout(() => {
            history.replaceState(null, '', 'index.html');
            window.location.reload();
          }, 2000);
        })
        .catch(function () {
          $scope.resetErrorMessage = "Failed to reset password. Try again.";
          $scope.resetSuccessMessage = "";
        });
    }
  };

  $scope.changePassword = function (form) {
    if (form.$valid) {
      LoginService.changePassword($scope.passwordData).then(function () {
        $scope.changePasswordSuccess = "Password updated successfully. Please log in.";

        $scope.showChangePasswordForm = false;
        $scope.isLoggedIn = false;
        $scope.role = "";
        $scope.username = "";

        setTimeout(() => {
          window.location.reload();
        }, 2000);
      }).catch(function () {
        $scope.changePasswordError = "Failed to update password";
        $scope.changePasswordSuccess = "";
      });
    }
  };

  $scope.handleSignIn = function () {
      const now = new Date();
      $scope.signInTime = now.toLocaleString(); // Format as human-readable
    };

    $scope.handleSignOut = function () {
      const now = new Date();
      $scope.signOutTime = now.toLocaleString();
    };

});
