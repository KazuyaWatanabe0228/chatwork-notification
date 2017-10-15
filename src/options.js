// Saves options to chrome.storage.sync.
function save_options() {
  var isTargetAll = document.getElementById('target0').checked;
  var displayIntarval = document.getElementById('displayIntarval').value;
  var status1 = document.getElementById('status1');
  var status2 = document.getElementById('status2');
  var regexIsNumber = /^[1-9][0-9]*$/;
  var isError = false;
  if (regexIsNumber.test(displayIntarval)){
    status1.textContent = '';
  }else{
    status1.textContent = '1以上の半角数値を入力して下さい。';
    isError = true;
  }
  
  if(isError){
    status2.textContent = '';
    return;
  }
  
  chrome.storage.sync.set({
    isTargetAll: isTargetAll,
    displayIntarval: displayIntarval,
  }, function() {
    // Update status to let user know options were saved.
    status2.textContent = '設定が保存されました。';
  });
}

// Restores select box and checkbox state using the preferences
// stored in chrome.storage.
function restore_options() {
  // Use default value isTargetAll=true, displayIntarval=120 and checkIntarval=5
  chrome.storage.sync.get({
    isTargetAll: true,
    displayIntarval: 10,
  }, function(items) {
    if(items.isTargetAll){
      document.getElementById('target0').checked = true;
    }else{
      document.getElementById('target1').checked = true;
    }
    document.getElementById('displayIntarval').value = items.displayIntarval;
  });
}
document.addEventListener('DOMContentLoaded', restore_options);
document.getElementById('save').addEventListener('click', save_options);
