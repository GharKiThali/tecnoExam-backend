// utils/normalizePhone.js
function normalizePhone(rawPhone) {
  if (!rawPhone) {
    throw new Error('Phone is required');
  }

  let phone = rawPhone.replace(/\s/g, '');

  if (phone.startsWith('+91')) {
    return phone;
  } else if (phone.startsWith('91') && phone.length === 12) {
    return '+' + phone;
  } else if (phone.length === 10) {
    return '+91' + phone;
  } else {
    throw new Error('Invalid phone format');
  }
}

module.exports = { normalizePhone };
