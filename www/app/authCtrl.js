
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
                    $rootScope.updatestatus = results.updatestatus;
                    var storage = window.localStorage;                    
                    storage.setItem('uid', results.uid);
                    storage.setItem('name', results.name);
                    storage.setItem('email', results.email);
                    storage.setItem('district', results.district);
                    storage.setItem('notifications', results.notifications);
                    storage.setItem('updatestatus', results.updatestatus); 
                    if(results.forgotpassword=='1')
                    {
                       $location.path('changepassword');         
                    }   
                    else
                    {
                        $location.path('dashboard');
                    }                                                                       
                
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
        var storage = window.localStorage;  
        var accessToken=storage.getItem('goosbumps')
        var term=null;        
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
    $scope.call_FB=function(){
		facebookConnectPlugin.login(["email"],$scope.fbLoginSuccess,function (error) { alert("" + error) }); 
	}
	$scope.fbLoginSuccess = function (userData) {
			/*alert("UserInfo: " + JSON.stringify(userData));*/
			facebookConnectPlugin.api('/me?fields=id,email,name', null,
			 function(response) {
                $scope.values = {Email:response.email,Name:response.name};                
                $scope.socialLogin();				 
				 /*alert("UserInfo: " + JSON.stringify(response));
				 alert('Good to see you, ' +
					 response.email + response.name + '.');*/
			 });
	}	
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
                    if(results.updatestatus=='1')
                    {
                        $location.path('dashboard');       
                    }else{
                        $location.path('profile/'+results.uid);
                    }                                                                             
                
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
      };
      $scope.ShareApp=function(){
        window.plugins.socialsharing.share('Download and be a part of the huge Mikudu blood donor community. Blood Donor details at the touch of a button. Visit www.mikudu.com')                         
      };                                    
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
    $scope.customer.dateformat= new Date();
    $scope.customer.Pincode=($scope.customer.Pincode*1);
    $scope.customer.Mobilenumber=($scope.customer.Mobilenumber*1);
    if($scope.customer.updatestatus=='0')
    {
         $scope.customer.Modeofcontact=['c'];
        if($scope.customer.Mobilenumber!=''){
            $scope.customer.Modeofcontact.push('a');
            $scope.customer.Modeofcontact.push('b');   
        }
        
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
                    var storage = window.localStorage;                    
                    storage.setItem('updatestatus', '1');                                        
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
                    Location_Address:'',Remarks:'',Cananygroup:'',Directcontact:'1',Mobile1:$scope.customer.Mobilenumber,Mobile2:'',Mobile3:'',
                    Email1:$scope.customer.Email,Email2:'',Email3:''};
    $scope.request.Neededate= new Date();                          
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
                    $scope.noresult=true;
                    $scope.showsearch=false;
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
		var options = {
		  /*message: 'share this', // not supported on some apps (Facebook, Instagram)
		  subject: 'the subject', // fi. for email*/
		  files: ['http://hosting.solminds.com/dev/mikuduadmin/web/img/logomain.png'], // an array of filenames either locally or remotely
		  //url: 'https://www.website.com/foo/#bar?a=b',
		  chooserTitle: 'Pick an app' // Android only, you can override the default share sheet title
		}

		var onSuccess = function(result) {
		  console.log("Share completed? " + result.completed); // On Android apps mostly return false even while it's true
		  console.log("Shared to app: " + result.app); // On Android result.app is currently empty. On iOS it's empty when sharing is cancelled (result.completed=false)
		}

		var onError = function(msg) {
		  console.log("Sharing failed with message: " + msg);
		}

		window.plugins.socialsharing.shareViaFacebook(options, onSuccess, onError);        
        /*$scope.showsocialshare=true;
        $scope.showsocialproceed=false;*/
        $scope.saveRequest(request);        
               
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
                $scope.smscontent=results.smscontent;
                $scope.multysms=results.multysms;
                $scope.showsearch=false;  
            }
            else
            {
                $scope.noresult=true; 
                $scope.showsearch=false;
                Data.toast(results);
                             
            }
            $scope.saveRequest(request);   
        }); 
                               
    };
     
    $scope.ListEmail=function(request){
        Data.post('emailsearch', {
            customer: request
        }).then(function (results) {                
            if (results.status == "success") {
                $scope.emailresultarray=results.users;
                $scope.emailcontent=results.emailcontent;
                $scope.emailsubject=results.emailsubject;
                $scope.requestremail=results.requestremail;
                $scope.showsearch=false;  
            }
            else
            {
                $scope.noresult=true; 
                $scope.showsearch=false;
                Data.toast(results);                                                
            }
            $scope.saveRequest(request); 
        });
                                       
    };    
    $scope.saveRequest=function(request){
            Data.post('addrequest', {
                customer: request
            }).then(function (results) {
                //Data.toast(results);
                if (results.status == "success") {
                    //$location.path('dashboard');
                }
            });         
    };    
    $scope.goback=function()
    {
        $scope.resultarray=[];
        $scope.smsresultarray=[];
        $scope.emailresultarray=[];
        $scope.showsearch=true;
        $scope.showdetails=false;
        $scope.showsmsproceed=false;
        $scope.showemailproceed=false;
        $scope.showsocialproceed=false;
        $scope.showsocialshare=false;
        $scope.noresult=false;                
    }                     
                                           
});
app.controller('notificationsCtrl', function ($scope, $rootScope, $location, $routeParams, Data, customer,$http) {
    var customerID = ($routeParams.customerID) ? parseInt($routeParams.customerID) : 0;
    $scope.notificationlists=[];
    $scope.busy = false;
    $scope.after = 0;  
    $scope.nextPage=function(){
        if ($scope.busy==false){
            $scope.busy = true;  
            Data.get('notifications?customer='+customerID+'&after='+$scope.after).then(function (results) {            
                var notificationlist=results;
                  for (var i = 0; i < notificationlist.length; i++) {
                    $scope.notificationlists.push(notificationlist[i].items);
                  }         
                $scope.after = $scope.after+10 ;
                $scope.busy = false;                              
            });            
        } 
        
              
    }
 
    //alert(JSON.stringify($scope.notificationlists))
 $scope.AcceptRequest=function(requestdata){
        requestdata.Loggeduser=$routeParams.customerID; 
            Data.post('acceptrequest', {
                request: requestdata
            }).then(function (results) {
                Data.toast(results);
                if (results.status == "success") {
                    $rootScope.notifications = results.notifications;                    
                    var storage = window.localStorage;                    
                    storage.setItem('notifications', results.notifications);                    
                    var myEl = angular.element( document.querySelector( '#requestdiv'+requestdata.Notification_Id ) );
                    myEl.remove();                   
                }
            });         
    };

    $scope.IgnoreRequest=function(requestdata){
            requestdata.Loggeduser=$routeParams.customerID;
            Data.post('ignorerequest', {
                request: requestdata
            }).then(function (results) {
                Data.toast(results);
                if (results.status == "success") {
                    $rootScope.notifications = results.notifications;                    
                    var storage = window.localStorage;                    
                    storage.setItem('notifications', results.notifications);                     
                    var myEl = angular.element( document.querySelector( '#requestdiv'+requestdata.Notification_Id ) );
                    myEl.remove(); 
                }
            });         
    };

    $scope.RequestContact=function(requestdata){
            requestdata.Loggeduser=$routeParams.customerID;
            Data.post('requestcontact', {
                request: requestdata
            }).then(function (results) {
                Data.toast(results);
                if (results.status == "success") {
                    $rootScope.notifications = results.notifications;                    
                    var storage = window.localStorage;                    
                    storage.setItem('notifications', results.notifications);                     
                    var myEl = angular.element( document.querySelector( '#acceptview'+requestdata.Notification_Id ) );
                    myEl.remove();                    
                }
            });        
    };

    $scope.RequestEnough=function(requestdata){
            requestdata.Loggeduser=$routeParams.customerID;
            Data.post('requestenough', {
                request: requestdata
            }).then(function (results) {
                Data.toast(results);
                if (results.status == "success") {
                    $rootScope.notifications = results.notifications;                    
                    var storage = window.localStorage;                    
                    storage.setItem('notifications', results.notifications);                     
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
                    var notcount=($rootScope.notifications*1)-1;                    
                    $rootScope.notifications = notcount;
                     var storage = window.localStorage;                                                           
                    storage.setItem('notifications', notcount);                     
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
                    var notcount=($rootScope.notifications*1)-1;                    
                    $rootScope.notifications = notcount;
                     var storage = window.localStorage;                                                           
                    storage.setItem('notifications', notcount);                    
                    var myEl = angular.element( document.querySelector( '#enoughview'+requestdata.Notification_Id ) );
                    myEl.remove(); 
                }
            });         
    };               
});
app.controller('passwordCtrl', function ($scope, $rootScope, $routeParams, $location, $http, Data) {
    var storage = window.localStorage; 
    $scope.changebutton=true;    
    $scope.changepassword = {User_Id:storage.getItem('uid'),password:'',confirmpassword:''};  
    $scope.PasswordChange = function (customer) {
        $scope.changebutton=false;
        Data.post('changepassword', {
            customer: customer
        }).then(function (results) {
            Data.toast(results);
            if (results.status == "success") {
                $location.path('logout');
            }
        });
    }; 
    $scope.forgotpassword = {Email:''};
    $scope.showbutton=true;  
    $scope.sendrequest=function(forgotpassword){
        $scope.showbutton=false;
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
        $scope.haveresult=false;        
        if(results.status=='Succcess')
        {
            var requestslist=results.data;
            $scope.requestslists = angular.copy(requestslist);
            $scope.haveresult=true;            
        }
                          
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

app.controller('helpCtrl', function ($scope, $rootScope, $routeParams, $location, $http, Data) {
    var storage = window.localStorage;
    if(storage.getItem('uid'))
    {
       $scope.showmenu=true; 
    }
    else
    {
       $scope.showmenu=false; 
    } 
    $scope.goback=function()
    {
        $location.path('login');               
    }                    
});
app.controller('faqCtrl', function ($scope, $rootScope, $routeParams, $location, $http, Data) {
                      
});

app.controller('mapCtrl', function ($scope, $rootScope, $routeParams, $location,country, $http, Data,$window) {
	$scope.mapsval = {Country_Id:'',State_Id:'',District_Id:''};
    	
	var originalcountry = country;       
	$scope.countries = angular.copy(originalcountry);           
	$scope.isClean = function() {
	return angular.equals(originalcountry, $scope.countries);
	}
    $scope.mapsval.Country_Id=$scope.countries[0].Id;
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
    $scope.showresult=false;
    $scope.shownoresult=false;
    $scope.Getbanks=function(searchval){
    $scope.showresult=false;
    $scope.shownoresult=false; 
    $scope.banksresults='';       
    	Data.getStates('bloodbanks?district='+searchval.District_Id).then(function (results) {
    	   if(results.status=='success'){    	       
    	       $scope.showresult=true;
                var originalbanks=results.banks;
                $scope.banksresults = angular.copy(originalbanks);               
    	   }
           else{
                $scope.showresult=true;
                $scope.shownoresult=true;            
           }
    		
    		                 
    	});        
    }
    $scope.goback=function(){
        $scope.showresult=false;
        $scope.shownoresult=false;
        $scope.banksresults='';                
    }	
 	
});
