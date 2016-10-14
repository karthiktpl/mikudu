
app.controller('authCtrl', function ($scope, $rootScope, $routeParams, $location, $http, Data) {
    //initially set those objects to null to avoid undefined error
    $scope.login = {};
    $scope.signup = {};
    $scope.profiledetails = {};    
    $scope.getdetails = {};
    $scope.bloodgroups = [{
    value: '1',
    label: 'A-'
  }, {
    value: '2',
    label: 'A+'
  }, {
    value: '3',
    label: 'AB-'
  }, {
    value: '4',
    label: 'AB+'
  }, {
    value: '5',
    label: 'B-'
  }, {
    value: '6',
    label: 'B+'
  }, {
    value: '7',
    label: 'O-'
  }, {
    value: '8',
    label: 'O+'
  }];  
                
    $scope.doLogin = function (customer) {
        Data.post('login', {
            customer: customer
        }).then(function (results) {
            Data.toast(results);
            if (results.status == "success") {
                    $rootScope.authenticated = true;
                    $rootScope.uid = results.uid;
                    $rootScope.name = results.name;
                    $rootScope.email = results.email;
                    $rootScope.district = results.district;
                    $rootScope.notifications = results.notifications;
                    var storage = window.localStorage;                    
                    storage.setItem('uid', results.uid);
                    storage.setItem('name', results.name);
                    storage.setItem('email', results.email);
                    storage.setItem('district', results.district);                                                         
                $location.path('dashboard');
            }
        });
    };
    $scope.signup = {email:'',password:'',name:'',bloodgroup:'',mobile:''};
  
    $scope.signUp = function (customer) {        
        Data.post('signUp', {
            customer: customer
        }).then(function (results) {
            Data.toast(results);
            if (results.status == "success") {
                $location.path('login');
            }
        });
    };
    $scope.showterms=false; 
    $scope.showTerms=function(){
        if($scope.showterms)
        {
            $scope.showterms=false;            
        }
        else
        {
            $scope.showterms=true;            
        }    
    }                          
    $scope.logout = function () {
        Data.get('logout').then(function (results) {
            Data.toast(results);
            $location.path('login');
        });
    }
    $scope.call_google = function(){
              googleapi.authorize({
                client_id: '640582960337-bn7j1apasl53bmcf2iiho41np6e9vgea.apps.googleusercontent.com',
                //client_secret: 'CLIENT_SECRET',
        
                redirect_uri: 'http://localhost',
                scope: 'https://www.googleapis.com/auth/plus.login https://www.googleapis.com/auth/userinfo.email'
            }).done(function(data) {
                var storage = window.localStorage;                    
        		storage.setItem('goosbumps', data.access_token);                
                accessToken=data.access_token;
                $scope.getDataProfile();
            });

    };    
    $scope.getDataProfile = function(){
        var accessToken=storage.getItem('goosbumps')
        var term=null;
        //  alert("getting user data="+accessToken);
        $.ajax({
               url:'https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token='+accessToken,
               type:'GET',
               data:term,
               dataType:'json',
               error:function(jqXHR,text_status,strError){
               },
               success:function(data)
               {
                $scope.values = {Email:data.email,Name:data.given_name};
                $scope.socialLogin();
               }
            });
            //$scope.disconnectUser(); //This call can be done later.
    };
    
    $scope.socialLogin = function ()
    {       
        Data.post('sociallogin', {
            customer: {Email:$scope.values.Email,Name:$scope.values.Name}
        }).then(function (results) {
            Data.toast(results);
            if (results.status == "success") {
                    $rootScope.authenticated = true;
                    $rootScope.uid = results.uid;
                    $rootScope.name = results.name;
                    $rootScope.email = results.email;                                        
                    var storage = window.localStorage;                    
                    storage.setItem('uid', results.uid);
                    storage.setItem('name', results.name);
                    storage.setItem('email', results.email);                                                                             
                $location.path('profile/'+results.uid);
            }
        });        
        
    }   
});

app.controller('dashboardCtrl', function ($scope, $rootScope, $location, $routeParams, Data,availability,$http) {      
      $scope.availabile = availability.Availability;
      $scope.changeAvail=function(checkedval){
            Data.post('setavaili', {
                customer: {user:$rootScope.uid,value:checkedval}
            }).then(function (results) {
                Data.toast(results);                
            });         
      } ;                              
});
app.controller('editCtrl', function ($scope, $rootScope, $location, $routeParams, Data, customer,country,$http) {
    var customerID = ($routeParams.customerID) ? parseInt($routeParams.customerID) : 0; 
        Data.get('bloodgroups').then(function (results) {            
            var originalbloods=results;
            $scope.bloodgroups = angular.copy(originalbloods);                  
        });   
        $scope.genders = [{
            Id: '0',
            Name: 'Female'
          }, {
            Id: '1',
            Name: 'Male'
          }];                 
        ///alert(JSON.stringify($scope.countries));              
      /*$scope.state=Data.get('countries');
      $scope.district=Data.get('countries');*/   
  $scope.roles = {
    a: 'Call',
    b: 'SMS',
    c: 'Email',
    //d: 'App'
  };           
      var original = customer;       
      $scope.customer = angular.copy(original);           
      $scope.isClean = function() {
        return angular.equals(original, $scope.customer);
      }

      var originalcountry = country;       
      $scope.countries = angular.copy(originalcountry);
      
      $scope.customer.Country_Id=$scope.countries[0].Id;                 
      $scope.isClean = function() {
        return angular.equals(originalcountry, $scope.countries);
      }
        Data.getStates('states?country='+$scope.customer.Country_Id).then(function (results) {
            var originalstates=results;
            $scope.states = angular.copy(originalstates);                  
        });       
    $scope.getCountryStates=function(){ 
        Data.getStates('states?country='+$scope.customer.Country_Id).then(function (results) {
            var originalstates=results;
            $scope.states = angular.copy(originalstates);                  
        });        
                               
    };
        Data.get('districts?state='+$scope.customer.State_Id).then(function (results) {            
            var originaldistricts=results;
            $scope.districts = angular.copy(originaldistricts);                  
        });
    $scope.getStatesCities=function(){ 
        Data.get('districts?state='+$scope.customer.State_Id).then(function (results) {            
            var originaldistricts=results;
            $scope.districts = angular.copy(originaldistricts);                  
        });        
                               
    };  

  
 /*   
      $scope.deleteCustomer = function(customer) {
        $location.path('/');
        if(confirm("Are you sure to delete customer number: "+$scope.customer._id)==true)
        services.deleteCustomer(customer.customerNumber);
      };
*/
      $scope.saveCustomer = function(donor) { 
            Data.post('updateprofile', {
                customer: donor
            }).then(function (results) {
                Data.toast(results);
                if (results.status == "success") {
                    $location.path('dashboard');
                }
            });        
            //services.updateCustomer(customerID, customer);       
    };
});
app.controller('requestCtrl', function ($scope,$filter, $rootScope, $location, $routeParams, Data, customer,country,$http) {
    $scope.showsearch=true;
    $scope.showdetails=false;
    var customerID = ($routeParams.customerID) ? parseInt($routeParams.customerID) : 0;
     $scope.maxLength = 140;
     $scope.maxLengthLoc = 30;
          
    Data.get('bloodgroups').then(function (results) {            
        var originalbloods=results;
        $scope.bloodgroups = angular.copy(originalbloods);                  
    });        
      var original = customer;       
      $scope.customer = angular.copy(original);           
      $scope.isClean = function() {
        return angular.equals(original, $scope.customer);
      }
      
	var originalcountry = country;       
      $scope.countries = angular.copy(originalcountry); 
          
      $scope.isClean = function() {
        return angular.equals(originalcountry, $scope.countries);
      }
    $scope.request = {Name:$scope.customer.Name,User_Id:customerID,Neededon:'',Bloodgroup_Id:'',Country_Id:$scope.countries[0].Id,State_Id:'',District_Id:'',
                    Location_Address:'',Remarks:'',Cananygroup:'',Directcontact:'1',Mobile1:'',Mobile2:'',Mobile3:'',
                    Email1:$scope.customer.Email,Email2:'',Email3:''};      
        Data.getStates('states?country='+$scope.request.Country_Id).then(function (results) {
            var originalstates=results;
            $scope.states = angular.copy(originalstates);                  
        });       
    $scope.getCountryStates=function(){ 
        Data.getStates('states?country='+$scope.request.Country_Id).then(function (results) {
            var originalstates=results;
            $scope.states = angular.copy(originalstates);                  
        });        
                               
    };
        Data.get('districts?state='+$scope.request.State_Id).then(function (results) {            
            var originaldistricts=results;
            $scope.districts = angular.copy(originaldistricts);                  
        });
    $scope.getStatesCities=function(){ 
        Data.get('districts?state='+$scope.request.State_Id).then(function (results) {            
            var originaldistricts=results;
            $scope.districts = angular.copy(originaldistricts);                  
        });        
                               
    };
        
    $scope.emaildiv='';
                       
    $scope.saveRequest=function(request){
            Data.post('addrequest', {
                customer: request
            }).then(function (results) {
                Data.toast(results);
                if (results.status == "success") {
                    $location.path('dashboard');
                }
            });         
    };

    $scope.CallSearch=function(request){
            Data.post('callsearch', {
                customer: request
            }).then(function (results) {                
                if (results.status == "success") {
                    $scope.resultarray=results.users
                    $scope.showsearch=false;  
                }
                else
                {
                    Data.toast(results);
                }
            });        
    };
    $scope.showsmsproceed=false;
    $scope.showemailproceed=false;
    $scope.showsocialproceed=false;
    $scope.showsocialshare=false;
    $scope.SMSSearch=function(request){
        $scope.showdetails=true;
        $scope.showsmsproceed=true;         
    };
    $scope.EmailSearch=function(request){
        $scope.showdetails=true;
        $scope.showemailproceed=true;         
    };

    $scope.Socialproceed=function(request){
        $scope.showdetails=true;
        $scope.showsocialproceed=true;
                         
    }; 
    $scope.SocialShare=function(request)
    {
        var foundItem = $filter('filter')($scope.bloodgroups, { Id: request.Bloodgroup_Id  }, true)[0];
        var index = $scope.bloodgroups.indexOf(foundItem);
//        $scope.socialmessage= 'Need '+$scope.bloodgroups[index].Name+' blood on '+request.Neededon+' at '+request.Location_Address+' Name - '+request.Name+'  Phone - '+request.Mobile1+' Note:'+request.Remarks ;
        window.plugins.socialsharing.share('Need '+$scope.bloodgroups[index].Name+' blood on '+request.Neededon+' at '+request.Location_Address+' Name - '+request.Name+'  Phone - '+request.Mobile1+' Note:'+request.Remarks)
        /*$scope.showsocialshare=true;
        $scope.showsocialproceed=false;*/
               
    } 
    $scope.ShareIt=function(socialmessage){
        window.plugins.socialsharing.share(socialmessage)
    }
      
    $scope.Cancelrequest=function(){
        $scope.showdetails=false;
        $scope.showsmsproceed=false;
        $scope.showemailproceed=false;  
        $scope.showsocialproceed=false;
        $scope.showsocialshare=false;
    };
     
    $scope.ListSMS=function(request){
        Data.post('smssearch', {
            customer: request
        }).then(function (results) {                
            if (results.status == "success") {
                $scope.smsresultarray=results.users;
                $scope.smscontent=results.smscontent
                $scope.showsearch=false;  
            }
            else
            {
                Data.toast(results);
            }
        });                        
    };
     
    $scope.ListEmail=function(request){
        Data.post('emailsearch', {
            customer: request
        }).then(function (results) {                
            if (results.status == "success") {
                $scope.emailresultarray=results.users;
                $scope.emailcontent=results.emailcontent
                $scope.emailsubject=results.emailsubject
                $scope.showsearch=false;  
            }
            else
            {
                Data.toast(results);
            }
        });                        
    };    
    
    $scope.goback=function()
    {
        $scope.resultarray='';
        $scope.smsresultarray='';
        $scope.emailresultarray='';
        $scope.showsearch=true;
        $scope.showdetails=false;
        $scope.showsmsproceed=false;
        $scope.showemailproceed=false;
        $scope.showsocialproceed=false;
        $scope.showsocialshare=false;                
    }                     
                                           
});
app.controller('notificationsCtrl', function ($scope, $rootScope, $location, $routeParams, Data, customer,$http) {
    var customerID = ($routeParams.customerID) ? parseInt($routeParams.customerID) : 0;
    Data.get('notifications?customer='+customerID).then(function (results) {            
        var notificationlist=results;
        $scope.notificationlists = angular.copy(notificationlist);                  
    });  
    $scope.getIncludeFile = function(lists) {    
        // Make this more dynamic, but you get the idea
        if(lists)
        {
            switch (lists.type) {
                case "0": 
                    $scope.requestdata=lists.data; 
                    $scope.requestdata.Loggeduser=$routeParams.customerID                                   
                    return 'partials/_requestview.html';
                case "1":
                    $scope.acceptdata=lists.data; 
                    $scope.acceptdata.Loggeduser=$routeParams.customerID            
                    return 'partials/_acceptview.html';
                case "2":
                    $scope.thankyoudata=lists.data; 
                    $scope.thankyoudata.Loggeduser=$routeParams.customerID             
                    return 'partials/_thankyouview.html';
                case "3":
                    $scope.enoughdata=lists.data; 
                    $scope.enoughdata.Loggeduser=$routeParams.customerID             
                    return 'partials/_enoughview.html'; 
                default:
                    return 'partials/nonotifications.html';
                                           
            }
        }else{
             return 'partials/nonotifications.html';
        }               
    }
 $scope.AcceptRequest=function(requestdata){  
            Data.post('acceptrequest', {
                request: requestdata
            }).then(function (results) {
                Data.toast(results);
                if (results.status == "success") {
                    var myEl = angular.element( document.querySelector( '#requestdiv'+requestdata.Notification_Id ) );
                    myEl.remove();                   
                }
            });         
    };

    $scope.IgnoreRequest=function(requestdata){
            Data.post('ignorerequest', {
                request: requestdata
            }).then(function (results) {
                Data.toast(results);
                if (results.status == "success") {
                    var myEl = angular.element( document.querySelector( '#requestdiv'+requestdata.Notification_Id ) );
                    myEl.remove(); 
                }
            });         
    };

    $scope.RequestContact=function(requestdata){
            Data.post('requestcontact', {
                request: requestdata
            }).then(function (results) {
                Data.toast(results);
                if (results.status == "success") {
                    var myEl = angular.element( document.querySelector( '#acceptview'+requestdata.Notification_Id ) );
                    myEl.remove();                    
                }
            });        
    };

    $scope.RequestEnough=function(requestdata){
            Data.post('requestenough', {
                request: requestdata
            }).then(function (results) {
                Data.toast(results);
                if (results.status == "success") {
                    var myEl = angular.element( document.querySelector( '#acceptview'+requestdata.Notification_Id ) );
                    myEl.remove(); 
                }
            });         
    };
    $scope.RemoveThanks=function(requestdata){
            Data.post('removethanks', {
                request: requestdata
            }).then(function (results) {
                Data.toast(results);
                if (results.status == "success") {
                    var myEl = angular.element( document.querySelector( '#thankyouview'+requestdata.Notification_Id ) );
                    myEl.remove(); 
                }
            });         
    };
    
    $scope.RemoveEnough=function(requestdata){
            Data.post('removeenough', {
                request: requestdata
            }).then(function (results) {
                Data.toast(results);
                if (results.status == "success") {
                    var myEl = angular.element( document.querySelector( '#enoughview'+requestdata.Notification_Id ) );
                    myEl.remove(); 
                }
            });         
    };               
});
app.controller('passwordCtrl', function ($scope, $rootScope, $routeParams, $location, $http, Data) {
    var storage = window.localStorage; 
    $scope.changepassword = {User_Id:storage.getItem('uid'),password:'',confirmpassword:''};  
    $scope.PasswordChange = function (customer) {        
        Data.post('changepassword', {
            customer: customer
        }).then(function (results) {
            Data.toast(results);
            if (results.status == "success") {
                $location.path('dashboard');
            }
        });
    }; 
    $scope.forgotpassword = {Email:''};
    $scope.sendrequest=function(forgotpassword){
        Data.post('forgotpassword', {
            customer: forgotpassword
        }).then(function (results) {
            Data.toast(results);
            if (results.status == "success") {
                $location.path('login');
            }
        });        
    }       
});
app.controller('requestsCtrl', function ($scope, $rootScope, $routeParams, $location, $http, Data) {
    var storage = window.localStorage;
    var customerID = storage.getItem('uid');
    Data.get('myrequests?customer='+customerID).then(function (results) {            
        var requestslist=results;
        $scope.requestslists = angular.copy(requestslist);                  
    });  
    $scope.getIncludeReqFile = function(lists) {    
        // Make this more dynamic, but you get the idea 
        $scope.viewdata='';
        $scope.RequestId='';       
        if(lists)
        {
            $scope.viewdata=lists;
            $scope.RequestId=lists.Id;                                       
            return 'partials/_myrequests.html';
        }else{
             return 'partials/norequests.html';
        }               
    }
    $scope.cancelRequest= function(datareq){        
        Data.post('cancelrequest', {
            request:datareq 
        }).then(function (results) {
            Data.toast(results);
            if (results.status == "success") {
                var myEl = angular.element( document.querySelector( '#requestdiv'+datareq ) );
                myEl.remove(); 
            }
        });       
    }
});
app.controller('viewRequestCtrl', function ($scope, $rootScope, $routeParams, $location,request, $http, Data) {
    $scope.requestview = angular.copy(request);  
});
app.controller('mapCtrl', function ($scope, $rootScope, $routeParams, $location,country, $http, Data,$window) {
	$scope.mapsval = {Country_Id:'',State_Id:'',District_Id:''};	
	var originalcountry = country;       
	$scope.countries = angular.copy(originalcountry);           
	$scope.isClean = function() {
	return angular.equals(originalcountry, $scope.countries);
	}
	Data.getStates('states?country='+$scope.mapsval.Country_Id).then(function (results) {
		var originalstates=results;
		$scope.states = angular.copy(originalstates);                  
	});       
    $scope.getCountryStates=function(){ 
        Data.getStates('states?country='+$scope.mapsval.Country_Id).then(function (results) {
            var originalstates=results;
            $scope.states = angular.copy(originalstates);                  
        });        
                               
    };
	Data.get('districts?state='+$scope.mapsval.State_Id).then(function (results) {            
		var originaldistricts=results;
		$scope.districts = angular.copy(originaldistricts);                  
	});
    $scope.getStatesCities=function(){ 
        Data.get('districts?state='+$scope.mapsval.State_Id).then(function (results) {            
            var originaldistricts=results;
            $scope.districts = angular.copy(originaldistricts);                  
        });                                      
    };
    $scope.setmap=function(searchval){ 
		var storage = window.localStorage;                    
		storage.setItem('bloodcountry', searchval.Country_Id);
		storage.setItem('bloodstate', searchval.State_Id);
		storage.setItem('blooddistrict', searchval.District_Id);
		window.location='maps.html'
		//$window.location= 'maps.html';
    };	
 	
});
