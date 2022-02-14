

window.addEventListener('DOMContentLoaded', event => {

    // Navbar shrink function
    var navbarShrink = function () {
        const navbarCollapsible = document.body.querySelector('#mainNav');
        if (!navbarCollapsible) {
            return;
        }
        if (window.scrollY === 0) {
            navbarCollapsible.classList.remove('navbar-shrink')
        } else {
            navbarCollapsible.classList.add('navbar-shrink')
        }

    };

    // Shrink the navbar 
    navbarShrink();

    // Shrink the navbar when page is scrolled
    document.addEventListener('scroll', navbarShrink);

    // Activate Bootstrap scrollspy on the main nav element
    const mainNav = document.body.querySelector('#mainNav');
    if (mainNav) {
        new bootstrap.ScrollSpy(document.body, {
            target: '#mainNav',
            offset: 74,
        });
    };

    // Collapse responsive navbar when toggler is visible
    const navbarToggler = document.body.querySelector('.navbar-toggler');
    const responsiveNavItems = [].slice.call(
        document.querySelectorAll('#navbarResponsive .nav-link')
    );
    responsiveNavItems.map(function (responsiveNavItem) {
        responsiveNavItem.addEventListener('click', () => {
            if (window.getComputedStyle(navbarToggler).display !== 'none') {
                navbarToggler.click();
            }
        });
    });

});



//-----------------ANGULAR BEGINS

var app = angular.module('myAngular', ['ngRoute']);
app.controller('myAngularController', function($scope){

    //set defaut value for dates

    $scope.datefrom = new Date();
    $scope.dateto = new Date();
    // var getTodaysDate = new Date();
    // $scope.datefrom =  getTodaysDate;
    // var todate = getTodaysDate.setDate(getTodaysDate + 1);
    // $scope.dateto = todate;


    // $scope.getdays = function(){

    //     var datefrom = $scope.datefrom;
    //     var dateto = $scope.dateto;
 
    //     var time = dateto.getTime() - datefrom.getTime();
    //     var days = time / (1000 * 3600 * 24);
    //     return days;
    //  }   



    $scope.getdays = function(){

       var datefrom = $scope.datefrom;
       var dateto = $scope.dateto;

       var time = dateto.getTime() - datefrom.getTime();
       var days = time / (1000 * 3600 * 24);
       return days;
    }

});


//-----------------ANGULAR ENDS


