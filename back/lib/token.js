const jwt = require("jsonwebtoken");
const { v4: uuidv4 } = require("uuid");
const crypto = require("crypto");

class TokenManager {
  constructor(secretKey) {
    this.secretKey = secretKey;
    this.RESET_PASSWORD_EXPIRATION = 3600; // 1 hour
    this.ACCESS_DELAY = 3600 * 24; // 1 day
    this.REFRESH_DELAY = 3600 * 24 * 31; // 31 days
  }

  generateAccess(userId) {
    const now = Math.floor(Date.now() / 1000);
    const exp = now + this.ACCESS_DELAY;
    const payload = {
      sub: userId,
      iat: now,
      exp: exp,
    };

    const token = jwt.sign(payload, this.secretKey);
    return {
      token: token,
      exp: exp,
    };
  }

  generateRefresh(userId) {
    const refreshToken = uuidv4();
    const expiresAt = Date.now() + this.REFRESH_DELAY * 1000;

    return {
      token: refreshToken,
      user_id: userId,
      expired_at: new Date(expiresAt).toISOString(),
    };
  }

  generateResetPasswordToken(userId) {
    const now = Math.floor(Date.now() / 1000);
    const exp = now + this.RESET_PASSWORD_EXPIRATION;
    const payload = {
      sub: userId,
      iat: now,
      exp: exp,
    };
    return jwt.sign(payload, this.secretKey);
  }

  resetRefresh(userId) {
    return this.generateRefresh(userId);
  }

  generateToken() {
    return crypto.randomBytes(32).toString("hex");
  }
}

module.exports = TokenManager;
