function generateOtp(length = 6) {
  const digits = '0123456789';
  let otp = '';

  for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * digits.length);
      otp += digits[randomIndex];
  }

  return otp;
}

module.exports = {
  generateOtp,
};
// const OTPGenerator = require('otp-generator');

// function generateOtp(length = 6) {
//   return OTPGenerator.generate(length, { digits: true, alphabets: false, upperCase: false, specialChars: false });
// }

// module.exports = {
//     generateOtp,
// };