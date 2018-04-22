// global variables
let modalWindowRecords = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
let currRecNo = 0;
let currIndex = 0;

// make sure to load all html first before javascript
$(document).ready(function() {
  $('#overlay').hide();

  $('#dialog').hide();
  const url = "https://randomuser.me/api/";
  const data = {
    results: 12,
    nat: 'us'
  };

  // callback function after successfully getting data
  const success = function(response) {
    let itemHtml = '';
    $.each(response.results, function(i, item) {
      itemHtml += '<div class="grid-item">';
      itemHtml += '<div class="menu">';
      itemHtml += '<img src=' + item.picture.large + ' alt="photo">';
      itemHtml += '</div>';
      itemHtml += '<div class="main">';
      itemHtml += '<h3><span class="first-name">' + item.name.first + '</span> ';
      itemHtml += '<span class="last-name">' + item.name.last + '</span></h3>';
      itemHtml += '<p class="email">' + item.email + '</p>';
      itemHtml += '<p class="city">' + item.location.city + '</p>';
      itemHtml += '</div>';  
      itemHtml += '<div class="username" style="display: none;">' + item.login.username + '</div>';    
      itemHtml += '<div class="postcode" style="display: none;">' + item.location.postcode + '</div>';    
      itemHtml += '<div class="state" style="display: none;">' + item.location.state + '</div>';    
      itemHtml += '<div class="street" style="display: none;">' + item.location.street + '</div>';    
      itemHtml += '<div class="cell" style="display: none;">' + item.cell + '</div>';    
      itemHtml += '<div class="dob" style="display: none;">' + item.dob + '</div>';    
      itemHtml += '</div>';
    }); // end each

    $('.grid-container').html(itemHtml);

    $('#dialog').dialog({
      dialogClass: "dialog",
      width: "500px",
      autoOpen: false,

      open: function() {
        $('#overlay').show();
        $('.grid-item').off();
      },

      close: function() {
        $('#overlay').hide();
        $('.grid-item').on('click', clickGridItem);
      }

    }); // end dialog

    let parent;
    let photo;
    let firstname;
    let lastname;
    let email;
    let city;
    let username;
    let postcode;
    let state;
    let street;
    let cell;
    let date;
    let year;
    let month;
    let day;
    let dob;

    const getDetails = function(p) {
      parent = p;
      photo = parent.find('.menu img').attr('src');
      firstname = $(parent.find('.first-name')).text();
      lastname = $(parent.find('.last-name')).text();
      email = $(parent.find('.email')).text();
      city = $(parent.find('.city')).text();
      username = $(parent.find('.username')).text();
      postcode = $(parent.find('.postcode')).text();
      state = $(parent.find('.state')).text();
      street = $(parent.find('.street')).text();
      cell = $(parent.find('.cell')).text();
      date = $(parent.find('.dob')).text();
      year = date.slice(2, 4);
      month = date.slice(5, 7);
      day = date.slice(8, 10);
      dob = `${month}/${day}/${year}`;
    }

    const enableDisableLeftRightButtons = function() {
      if (currIndex === 0) {
        $('#left button').prop("disabled",true);       
      }    
      if (currIndex !== 0) {          
        $('#left button').prop("disabled",false);          
      }        
      if (currIndex === modalWindowRecords.length - 1) {  
        $('#right button').prop("disabled",true);
      }         
      if (currIndex !== modalWindowRecords.length - 1) {
        $('#right button').prop("disabled",false);
      }              
    }

    const clickGridItem = function(event) {
      getDetails($(event.target).parents('.grid-item'));

      currRecNo = $(parent).index();
      currIndex = modalWindowRecords.indexOf(currRecNo);

      let dialogHtml = '<div id="left"><button class="btn"><i class="fas fa-angle-left"></i></button></div>';
      dialogHtml += '<div class="dialog-content">';
      dialogHtml += '<div class="dialog-basic">';
      dialogHtml += '<img src=' + photo + ' alt="picture">';
      dialogHtml += '<h3><span class="first-name">' + firstname + '</span> ';
      dialogHtml += '<span class="last-name">' + lastname + '</span></h3>';
      dialogHtml += '<p class="username">' + username + '</p>';   
      dialogHtml += '<p class="email">' + email + '</p>';   
      dialogHtml += '<p class="city">' + city + '</p>';     
      dialogHtml += '</div>';
      dialogHtml += '<p class="cell">' + cell + '</p>';  
      dialogHtml += '<p class="address">' + street + ', ' + state + ' ' + postcode + '</p>';
      dialogHtml += '<p class="birthdate">Birthday: ' + dob + '</p>';
      dialogHtml += '</div>';
      dialogHtml += '<div id="right"><button class="btn"><i class="fas fa-angle-right"></i></button></div>';

      $('#dialog').html(dialogHtml);
      $('#dialog').dialog('open');
      $('#dialog').show();

      enableDisableLeftRightButtons();

      const renderDialogHtml = function() {
        $('.dialog-basic img').attr('src', photo);
        $('.dialog-basic .first-name').text(firstname);
        $('.dialog-basic .last-name').text(lastname);
        $('.dialog-basic .username').text(username);
        $('.dialog-basic .email').text(email);
        $('.dialog-basic .city').text(city);
        $('.dialog-content .cell').text(cell);
        $('.dialog-content .address').text(`${street}, ${state} ${postcode}`);
        $('.dialog-content .birthdate').text(`Birthday: ${dob}`);
      }

      $('#left button').on('click', function(event) {
        currIndex--;  
        enableDisableLeftRightButtons();
        getDetails($($('.grid-item')[modalWindowRecords[currIndex]]));
        renderDialogHtml();
      }); //end left button click

      $('#right button').on('click', function(event) {
        currIndex++;         
        enableDisableLeftRightButtons();
        getDetails($($('.grid-item')[modalWindowRecords[currIndex]]));
        renderDialogHtml();
      }); //end left button click

    }; // end click

    $('.grid-item').on('click', clickGridItem);
    

    // employee search feature by name or username
    const searchHtml = '<div class="employee-search">' +
      '<select>' +
        '<option value="name">Name</option>' +
        '<option value="username">Username</option>' +
      '</select>' +
      '<input placeholder="Search for employees...">' +
      '<button>Search</button>' +
    '</div>';        
    $('header').append(searchHtml);

    $('.employee-search button').on('click', function() {
      modalWindowRecords = [];
      const searchBy = $('.employee-search select')[0].value;
      const employees = $('.grid-item');
      const searchKey = $('.employee-search input')[0].value.trim().toLowerCase();

      if (searchBy === 'name') {
        $.each(employees, function(i, employee) {
          const firstName = ($(employee).find('.first-name')[0].textContent);
          const lastName = ($(employee).find('.last-name')[0].textContent);

          if (firstName.indexOf(searchKey) === -1 && lastName.indexOf(searchKey) === -1) {
            $(employee).hide();
          } else {
            $(employee).show();
            modalWindowRecords.push(i);
          }
        });
      } else {
        $.each(employees, function(i, employee) {
          const userName = ($(employee).find('.username')[0].textContent);

          if (userName.indexOf(searchKey) === -1) {
            $(employee).hide();
          } else {
            $(employee).show();
            modalWindowRecords.push(i);
          }
        });
      }
    }); //end employee-search button click

  } // end success function

  $.getJSON(url, data, success);

}); // end ready