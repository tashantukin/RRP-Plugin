var scriptSrc = document.currentScript.src;
var packagePath = scriptSrc.replace('/scripts/package.js', '').trim();
var re = /([a-f0-9]{8}(?:-[a-f0-9]{4}){3}-[a-f0-9]{12})/i;
var packageId = re.exec(scriptSrc.toLowerCase())[1];
document.addEventListener('DOMContentLoaded', function () {
// document.getElementsByClassName('title-dashboard')[0].innerText = 'ORIGINAL PRICE (BEFORE DISCOUNT)';
const HOST = window.location.host;
var customFieldPrefix = packageId.replace(/-/g, "");
var userId = $('#userGuid').val();
  var accessToken = 'Bearer ' + getCookie('webapitoken');
  var rrpStatusExist = false;
  var rrpStatusFieldId = 0;
  var code = "";
  var rrpStatusFieldCode = "";
  // var iconHeader = document.querySelector('.page-icon .icon');
  // iconHeader.classList.add('fa','fa-balance-scale', 'fa-3x');
  var rrpPackageCheckBox = document.getElementById('myonoffswitch');
  //switch
  rrpPackageCheckBox.addEventListener('change', () => {
    saveStatus(rrpPackageCheckBox.checked);
  });
  
//=====================================================================================================================================================================
  function getMarketplaceCustomFields(callback){
    var apiUrl = '/api/v2/marketplaces'
    $.ajax({
        url: apiUrl,
        method: 'GET',
        contentType: 'application/json',
        success: function(result) {
            if (result) {
                callback(result.CustomFields);
            }
        }
    });
}

function saveStatus(rrpStatus) {
  var data = { 'userId': userId, 'status': rrpStatus };
   var apiUrl = packagePath + '/package_switch.php';
  $.ajax({
      url: apiUrl,          
      headers: {
          'Authorization':  accessToken,
      },
      method: 'POST',
      contentType: 'application/json',
      data: JSON.stringify(data),
      success: function(response) {
         if(rrpStatus == 1){
          toastr.success('RRP plugin is enabled.');
         }else { toastr.success('RRP plugin is disabled.');}
        
      },
      error: function (jqXHR, status, err) {
            toastr.error('---');
      }
  });

}
//=======================================================================================================================================================================
$(document).ready(function() {
  getMarketplaceCustomFields(function(result) {
      $.each(result, function(index, cf) {
          if (cf.Name == 'RRP Status' && cf.Code.startsWith(customFieldPrefix)) {
               code = cf.Code;
              var rrp_status = cf.Values[0];
              if (rrp_status == 'true') {
                rrpPackageCheckBox.checked = true;
                console.log('the package is enabled.')
              } else {
                rrpPackageCheckBox.checked = false;
                console.log('The cf is off');
              }    
          }
          
      })
  });

});

  // function getPackageCustomFields () {
  //   var settings = {
  //     'async': false,
  //     'crossDomain': true,
  //     'url': '//' + HOST + '/api/developer-packages/custom-fields?packageId='+packageId,
  //     'method': 'GET',
  //     'headers': {
  //       'authorization': accessToken
  //     },
  //     'success': function (response) {
  //       var packageCustomFields = response;
  //       console.log('Custom Fields', packageCustomFields);
  //       packageCustomFields.forEach((rrpField) => {
  //         if (rrpField.Name.search('RRP Status') !== -1) {
  //           rrpStatusFieldCode = rrpField.Code;
  //           rrpStatusFieldId = rrpField.Id;
  //           rrpStatusExist = true;
  //         }
  //       });
  //     }
  //   };
  //   $.ajax(settings);
  // }


  function getCookie (name) {
    var value = '; ' + document.cookie;
    var parts = value.split('; ' + name + '=');
    if (parts.length === 2) return parts.pop().split(';').shift();
  }

  // function updateRRPStatus (rrpStatus) {
  //   console.log('RRP STATUS: ',rrpStatus);
  //   var settings = {
  //     'async': false,
  //     'crossDomain': true,
  //     'url': '//' + HOST + '/api/v2/marketplaces',
  //     'headers': {
  //       'authorization': accessToken,
  //       'Content-Type': 'application/json'
  //     },
  //     'processData': false,
  //     'data': JSON.stringify([
  //       {
  //         //'ReferenceId': rrpStatusFieldId,
  //         'Code': code,
  //         'Values': rrpStatus
  //       }
  //     ]),
  //     'method': 'POST',
  //     'success': function (response) {
  //       console.log('Status of updated custom field', response);
  //       if(rrpStatus === true) {
  //         toastr.success('Recommended Retail Price Package is activated', 'Success!');
  //       } else {
  //         toastr.success('Recommended Retail Price Package is deactivated', 'Success!');
  //       }
  //     }
  //   };
  //     $.ajax(settings);
  // }


  // function fetchRRPStatus () {
  //   var settings = {
  //     'async': false,
  //     'crossDomain': true,
  //     'url': '//' + HOST + '/api/admin/custom-fields-value/view?referenceTable=Implementations&referenceId=' + rrpStatusFieldId,
  //     'headers': {
  //       'authorization': accessToken
  //     },
  //     'method': 'GET',
  //     'success': function (response) {
  //       response.forEach(function (customFieldObj) {
  //         if (customFieldObj.Name.search('RRP Status') !== -1) {
  //           if (customFieldObj.Value === 'true') {
  //             rrpPackageCheckBox.checked = true;
  //           } else {
  //             rrpPackageCheckBox.checked = false;
  //           }
  //         }
  //       });
  //     }
  //   };
  //   $.ajax(settings);
  // }
});
