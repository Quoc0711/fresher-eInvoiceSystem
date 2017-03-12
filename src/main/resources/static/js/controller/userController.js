'use strict';

var app = angular.module('dbApp');

app.controller('UserController', ['$scope','$filter', 'UserService', function($scope, $filter, UserService) {
    var self = this;
    self.user={id:null,username:'',password:'',active:''};    
    self.users=[];
    
    $scope.currentPage = 0;
    $scope.pageSize = 1;    
    $scope.search = '';
   
    
    self.submit = submit;
    self.edit = edit;
    self.remove = remove;
    self.reset = reset;
    self.isActive = isActive;
    self.update = updateUser;
    self.filterActive = filterActive;
    


    fetchAllUsers();
    
    $scope.getData = function () {
        
        return $filter('filter')( self.users, $scope.search)
       
      }
    
    $scope.numberOfPages=function(){
        return Math.ceil($scope.getData().length/$scope.pageSize);                
    }

    function fetchAllUsers(){
        UserService.fetchAllUsers()
            .then(
            function(d) {
            	self.users = d;
            },
            function(errResponse){
                console.error('Error while fetching Users');
            }
        );
    }
    
    function filterActive(status){
    	console.log(status);
    	if(status == 'all')
    	{
    		fetchAllUsers();
    	}
    	else{
    		console.log("Filter by status");
    		getUserByActive(status);
    	}
    }
    
    function getUserByActive(active){
        UserService.getUsersByActive(active)
            .then(
            function(d) {
            	self.users = d;
            	console.log(self.users);
            },
            function(errResponse){
                console.error('Error while fetching Users');
            }
        );
    }

    function createUser(user){
        UserService.createUser(user)
            .then(
            fetchAllUsers,
            function(errResponse){
                console.error('Error while creating User');
            }
        );
    }

    function updateUser(user, id){    	
    	var r = confirm("Are you sure!");
    	if (r == true) {
    		console.log(user);
            UserService.updateUser(user, id)
                .then(
                fetchAllUsers,
                function(errResponse){
                    console.error('Error while updating User');
                }
            );
    	} else {
    		fetchAllUsers();
    	}
    	
    }

    function deleteUser(id){
        UserService.deleteUser(id)
            .then(
            fetchAllUsers,
            function(errResponse){
                console.error('Error while deleting User');
            }
        );
    }

    function submit() {
        if(self.user.id===null){
            console.log('Saving New User', self.user);
            createUser(self.user);
        }else{
            updateUser(self.user, self.user.id);
            console.log('User updated with id ', self.user.id);
        }
        reset();
    }

    function edit(id){
        console.log('id to be edited', id);
        for(var i = 0; i < self.users.length; i++){
            if(self.users[i].id === id) {
                self.user = angular.copy(self.users[i]);
               
                break;
            }
        }
    }
    
    function isActive(user){
        console.log('id to be edited', user.id);
        self.user = user;
        updateUser(self.user, self.user.id);
    }

    function remove(id){
        console.log('id to be deleted', id);
        if(self.user.id === id) {//clean form if the user to be deleted is shown there.
            reset();
        }
        deleteUser(id);
    }

    function reset(){
        self.user={id:null,username:'',password:'',active:''};
        $scope.myForm.$setPristine(); //reset Form
    }
    
   
}]);


app.filter('startFrom', function() {
    return function(input, start) {
        start = +start; //parse to int
        return input.slice(start);
    }
});
