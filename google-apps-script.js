/**
 * GOOGLE APPS SCRIPT - Email Collection for PM Plugins
 * =====================================================
 *
 * SETUP INSTRUCTIONS:
 *
 * 1. Go to https://script.google.com and create a new project
 * 2. Delete the default code and paste this entire file
 * 3. Click "Deploy" > "New deployment"
 * 4. Select type: "Web app"
 * 5. Set "Execute as": "Me"
 * 6. Set "Who has access": "Anyone"
 * 7. Click "Deploy" and copy the Web App URL
 * 8. In your portfolio's js/main.js, replace YOUR_SCRIPT_ID in the
 *    GOOGLE_SCRIPT_URL with the ID from the URL:
 *    https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec
 *
 * The script will automatically create a "PM Plugin Emails" sheet
 * in a new Google Spreadsheet on first run.
 */

var SHEET_NAME = 'PM Plugin Emails';
var SPREADSHEET_ID = '1qoMY4oWnnbgSZPiHSnsycMdmeWHWwX-L6kqb0zXYVQM';

function getOrCreateSheet() {
  var ss;

  if (SPREADSHEET_ID) {
    ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  } else {
    // Try to find existing spreadsheet by name
    var files = DriveApp.getFilesByName('PM Plugin Email Signups');
    if (files.hasNext()) {
      ss = SpreadsheetApp.open(files.next());
    } else {
      // Create new spreadsheet
      ss = SpreadsheetApp.create('PM Plugin Email Signups');
      var sheet = ss.getActiveSheet();
      sheet.setName(SHEET_NAME);
      // Add headers
      sheet.getRange(1, 1, 1, 3).setValues([['Email', 'Timestamp', 'Source']]);
      sheet.getRange(1, 1, 1, 3).setFontWeight('bold');
      sheet.setColumnWidth(1, 300);
      sheet.setColumnWidth(2, 200);
      sheet.setColumnWidth(3, 150);
    }
  }

  var sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
    sheet.getRange(1, 1, 1, 3).setValues([['Email', 'Timestamp', 'Source']]);
    sheet.getRange(1, 1, 1, 3).setFontWeight('bold');
  }

  return sheet;
}

function doPost(e) {
  try {
    var sheet = getOrCreateSheet();
    var email = e.parameter.email;
    var timestamp = new Date().toISOString();
    var source = e.parameter.source || 'portfolio';

    // Check for duplicate (per source — same email can sign up for different projects)
    var data = sheet.getDataRange().getValues();
    for (var i = 1; i < data.length; i++) {
      if (data[i][0] === email && data[i][2] === source) {
        return ContentService.createTextOutput(
          JSON.stringify({ status: 'duplicate', message: 'Email already registered for this project' })
        ).setMimeType(ContentService.MimeType.JSON);
      }
    }

    // Add new row
    sheet.appendRow([email, timestamp, source]);

    return ContentService.createTextOutput(
      JSON.stringify({ status: 'success', message: 'Email saved' })
    ).setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    return ContentService.createTextOutput(
      JSON.stringify({ status: 'error', message: error.toString() })
    ).setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet(e) {
  return ContentService.createTextOutput(
    JSON.stringify({ status: 'ok', message: 'PM Plugin email collector is running' })
  ).setMimeType(ContentService.MimeType.JSON);
}
