export const EMAIL_RULE = {
  required: 'Email is required',
  pattern: {
    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
    message: 'Invalid email address',
  },
};

export const FULL_NAME_RULE = {
  required: 'Display name is required',
  minLength: {
    value: 2,
    message: 'Name must be at least 2 characters',
  },
};

export const PHONE_NUMBER_RULE = {
  required: 'Phone number is required',
  pattern: {
    value: /^[0-9+\-\s()]+$/,
    message: 'Please enter a valid phone number',
  },
  minLength: {
    value: 10,
    message: 'Phone number must be at least 10 digits',
  },
};

export const PASSOWRD_RULE = {
  required: 'Password is required',
  minLength: {
    value: 6,
    message: 'Password must be at least 6 characters',
  },
};
