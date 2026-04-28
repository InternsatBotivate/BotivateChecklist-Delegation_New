/**
 * WhatsApp Messaging Service (MOCK / DISABLED)
 * This service has been decoupled from the real WhatsApp API.
 * All messages are now logged to the console for local development.
 */

/**
 * Format phone number to international format
 */
const formatPhoneNumber = (phone) => {
    if (!phone) return "unknown";
    let cleaned = String(phone).replace(/\D/g, '');
    if (!cleaned.startsWith('91') && cleaned.length === 10) {
        cleaned = '91' + cleaned;
    }
    return cleaned;
};

/**
 * Mock message sender
 */
const logMockMessage = (type, recipient, content) => {
    console.log(`📱 [MOCK WHATSAPP] ${type.toUpperCase()}`);
    console.log(`To: +${formatPhoneNumber(recipient)}`);
    if (typeof content === 'string') {
        console.log(`Content: ${content}`);
    } else {
        console.log(`Content:`, content);
    }
    console.log('---');
    return true;
};

// --- MOCK API FUNCTIONS ---

export const sendUrgentTaskNotification = async (details) => logMockMessage('urgent notification', details.doerName || 'User', details);
export const sendTaskExtensionNotification = async (details) => logMockMessage('task extension', details.doerName || 'User', details);
export const sendTaskAssignmentNotification = async (details) => logMockMessage('task assignment', details.doerName || 'User', details);
export const sendChecklistTaskNotification = async (details) => logMockMessage('checklist task', details.doerName || 'User', details);
export const sendMaintenanceTaskNotification = async (details) => logMockMessage('maintenance task', details.doerName || 'User', details);
export const sendRepairTaskNotification = async (details) => logMockMessage('repair task', details.doerName || 'User', details);
export const sendEATaskNotification = async (details) => logMockMessage('ea task', details.doerName || 'User', details);
export const sendDelegationTaskNotification = async (details) => logMockMessage('delegation task', details.doerName || 'User', details);
export const sendTaskReminderNotification = async (details) => logMockMessage('task reminder', details.doerName || 'User', details);
export const sendTaskCompletionNotification = async (details) => logMockMessage('task completion', details.givenBy || 'Admin', details);
export const sendTaskRejectionNotification = async (details) => logMockMessage('task rejection', details.doerName || 'User', details);
export const sendTaskReassignmentNotification = async (details) => logMockMessage('task reassignment', details.newDoerName || 'User', details);
export const sendPasswordResetOTP = async (username, otp) => logMockMessage('password reset otp', 'Admin', { username, otp });
export const sendAdminExtensionRemarkNotification = async (details) => logMockMessage('admin extension remark', details.doerName || 'User', details);

export default {
    sendUrgentTaskNotification,
    sendTaskExtensionNotification,
    sendTaskAssignmentNotification,
    sendChecklistTaskNotification,
    sendMaintenanceTaskNotification,
    sendRepairTaskNotification,
    sendEATaskNotification,
    sendDelegationTaskNotification,
    sendTaskReminderNotification,
    sendTaskCompletionNotification,
    sendTaskRejectionNotification,
    sendTaskReassignmentNotification,
    sendPasswordResetOTP,
    sendAdminExtensionRemarkNotification
};
