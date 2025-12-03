/**
 * ============================================
 * WINHOUSE QUOTE TOOL - GOOGLE SHEETS WEBHOOK
 * ============================================
 * 
 * Instructions:
 * 1. Open Google Sheets and create a new spreadsheet
 * 2. Go to Extensions > Apps Script
 * 3. Replace the default code with this script
 * 4. Deploy as Web App:
 *    - Click Deploy > New deployment
 *    - Select type: Web app
 *    - Execute as: Me
 *    - Who has access: Anyone
 * 5. Copy the Web app URL and add to your .env.local as GOOGLE_SHEETS_WEBHOOK_URL
 */

// Sheet names
const LEADS_SHEET = 'Leads';
const QUOTES_SHEET = 'Quotes';
const LOG_SHEET = 'Log';

/**
 * Initialize sheets if they don't exist
 */
function initializeSheets() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  
  // Create Leads sheet
  let leadsSheet = ss.getSheetByName(LEADS_SHEET);
  if (!leadsSheet) {
    leadsSheet = ss.insertSheet(LEADS_SHEET);
    leadsSheet.appendRow([
      'Timestamp',
      'Event',
      'Name',
      'Email',
      'Phone',
      'Company',
      'Role',
      'Industry',
      'Module Count',
      'Modules',
      'Total Amount',
      'Monthly Amount'
    ]);
    leadsSheet.getRange(1, 1, 1, 12).setFontWeight('bold');
  }
  
  // Create Log sheet
  let logSheet = ss.getSheetByName(LOG_SHEET);
  if (!logSheet) {
    logSheet = ss.insertSheet(LOG_SHEET);
    logSheet.appendRow(['Timestamp', 'Event', 'Status', 'Data']);
    logSheet.getRange(1, 1, 1, 4).setFontWeight('bold');
  }
  
  return { leadsSheet, logSheet };
}

/**
 * Handle POST requests from the webhook
 */
function doPost(e) {
  const { leadsSheet, logSheet } = initializeSheets();
  
  try {
    // Parse the incoming data
    const data = JSON.parse(e.postData.contents);
    
    // Log the request
    logSheet.appendRow([
      new Date().toLocaleString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' }),
      data.event || 'unknown',
      'received',
      JSON.stringify(data).substring(0, 500)
    ]);
    
    // Handle different event types
    switch (data.event) {
      case 'lead_captured':
        handleLeadCaptured(leadsSheet, data);
        break;
      case 'quote_created':
        handleQuoteCreated(leadsSheet, data);
        break;
      case 'quote_downloaded':
        handleQuoteDownloaded(logSheet, data);
        break;
      default:
        // Log unknown events
        logSheet.appendRow([
          new Date().toLocaleString('vi-VN'),
          'unknown_event',
          data.event,
          JSON.stringify(data)
        ]);
    }
    
    // Send success response
    return ContentService
      .createTextOutput(JSON.stringify({ success: true }))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    // Log error
    logSheet.appendRow([
      new Date().toLocaleString('vi-VN'),
      'error',
      error.toString(),
      e.postData ? e.postData.contents : 'no data'
    ]);
    
    return ContentService
      .createTextOutput(JSON.stringify({ success: false, error: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * Handle lead_captured event
 */
function handleLeadCaptured(sheet, data) {
  const eventData = data.data || data;
  
  sheet.appendRow([
    data.timestamp || new Date().toLocaleString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' }),
    'lead_captured',
    eventData.leadName || '',
    eventData.leadEmail || '',
    eventData.leadPhone || '',
    eventData.leadCompany || '',
    eventData.leadRole || '',
    eventData.industrySlug || '',
    eventData.moduleCount || 0,
    eventData.modules || '',
    eventData.totalAmount || 0,
    eventData.monthlyAmount || 0
  ]);
  
  // Optional: Send email notification
  sendNotificationEmail(eventData);
}

/**
 * Handle quote_created event
 */
function handleQuoteCreated(sheet, data) {
  const eventData = data.data || data;
  
  sheet.appendRow([
    data.timestamp || new Date().toLocaleString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' }),
    'quote_created',
    eventData.leadName || '',
    eventData.leadEmail || '',
    eventData.leadPhone || '',
    eventData.leadCompany || '',
    '',
    eventData.industryName || '',
    eventData.moduleCount || 0,
    '',
    eventData.totalAmount || 0,
    eventData.monthlyAmount || 0
  ]);
}

/**
 * Handle quote_downloaded event
 */
function handleQuoteDownloaded(logSheet, data) {
  logSheet.appendRow([
    data.timestamp || new Date().toLocaleString('vi-VN'),
    'quote_downloaded',
    data.data?.quoteNumber || 'unknown',
    JSON.stringify(data.data)
  ]);
}

/**
 * Send email notification for new leads
 */
function sendNotificationEmail(leadData) {
  // Uncomment and configure to enable email notifications
  /*
  const recipientEmail = 'sales@thewinhouse.com';
  const subject = `[Winhouse] New Lead: ${leadData.leadName}`;
  
  const body = `
New lead from Quote Tool!

Name: ${leadData.leadName}
Email: ${leadData.leadEmail}
Phone: ${leadData.leadPhone}
Company: ${leadData.leadCompany || 'N/A'}
Role: ${leadData.leadRole}
Industry: ${leadData.industrySlug}

Selected Modules: ${leadData.moduleCount}
Total Amount: ${formatCurrency(leadData.totalAmount)}
Monthly Amount: ${formatCurrency(leadData.monthlyAmount)}

Modules: ${leadData.modules}

---
This is an automated notification from Winhouse Quote Tool.
  `;
  
  MailApp.sendEmail(recipientEmail, subject, body);
  */
}

/**
 * Format currency in VND
 */
function formatCurrency(amount) {
  if (!amount) return '0 ₫';
  return new Intl.NumberFormat('vi-VN').format(amount) + ' ₫';
}

/**
 * Handle GET requests (for testing)
 */
function doGet(e) {
  return ContentService
    .createTextOutput(JSON.stringify({ 
      status: 'ok', 
      message: 'Winhouse Quote Tool Webhook is running',
      timestamp: new Date().toISOString()
    }))
    .setMimeType(ContentService.MimeType.JSON);
}

/**
 * Test function - run this to initialize sheets
 */
function testInit() {
  initializeSheets();
  Logger.log('Sheets initialized successfully');
}
