function login(username, password) {

  $.ajax({
    type:"POST",
    url:"http://localhost:8000/api/v1/accounts/token/",
    data: "username=" + username + "&password=" + password,
    success: function(data) {
      window.location.href = '/tokenValidation?tmApiToken=' + data.token
    },
    error: function(){
      alert('Request failed');
    },
    dataType: 'json',
  });

};

function submitLogin(e) {
  e.preventDefault();
  login(document.getElementById('username'), document.getElementById('password'));
}
