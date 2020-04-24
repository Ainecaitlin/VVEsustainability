/*************** CONSTRUCTOR *************/
var AccountController = function (userModel, session, userSession, mailer) {

    this.crypto = require('crypto');
    this.uuid = require('node-uuid');
    this.ApiResponse = require('../models/api-response.js');
    this.ApiMessages = require('../models/api-messages.js');
    this.UserProfile = require('../models/user-profile.js');
    this.userModel = userModel;
    this.session = session;

    this.userSession = userSession;

    this.mailer = mailer;
    this.User = require('../models/user.js');
};
/*************** GETTERS AND SETTERS ***********/
AccountController.prototype.getSession = function () {
    return this.session;
};
AccountController.prototype.setSession = function (session) {
    this.session = session;
};
/*************** HASH PASSWORD *************/
AccountController.prototype.hashPassword = function (password, salt, callback) {       
    // we use pbkdf2 to hash and iterate 10k times by default
    var iterations = 10000,
        keyLen = 64; // 64 bit.
    this.crypto.pbkdf2(password, salt, iterations, keyLen, callback);
};
/************** LOG ON *******************/
AccountController.prototype.logon = function(email, password, callback) {
    var me = this;
    me.userModel.findOne({ email: email }, function (err, user) {
        if (err) {
            return callback(err, new me.ApiResponse({ success: false, extras: { msg: me.ApiMessages.DB_ERROR } }));
        }
        if (user && user.passwordSalt) {  
            me.hashPassword(password, user.passwordSalt, function (err, passwordHash) {
                if (passwordHash == user.passwordHash) {
                    var userProfileModel = new me.UserProfile({
                        email: user.email,
                        firstName: user.firstName,
                        lastName: user.lastName
                    });
                    // Save to http session.
                    me.session.userProfileModel = userProfileModel;
                    me.session.id = me.uuid.v4();
                    // Save to persistent session.
                    me.userSession.userId = user._id;
                    me.userSession.sessionId = me.session.id;                    
                    me.userSession.save(function (err, sessionData, numberAffected) {
                        if (err) {
                            return callback(err, new me.ApiResponse({ success: false, extras: { msg: me.ApiMessages.DB_ERROR } }));
                        }
                        if (numberAffected === 1) {
                            // Return the user profile so the router sends it to the client app doing the logon.
                            return callback(err, new me.ApiResponse({
                                success: true, extras: {
                                    userProfileModel: userProfileModel,
                                    sessionId: me.session.id
                                }
                            }));                            
                        } else {
                            
                            return callback(err, new me.ApiResponse({ success: false, extras: { msg: me.ApiMessages.COULD_NOT_CREATE_SESSION } }));
                        }
                    });                    
                } else {
                    return callback(err, new me.ApiResponse({ success: false, extras: { msg: me.ApiMessages.INVALID_PWD } }));
                }
            });
        } else {
            return callback(err, new me.ApiResponse({ success: false, extras: { msg: me.ApiMessages.EMAIL_NOT_FOUND } }));
        }

    });
};
/************* LOG OFF ************/
AccountController.prototype.logoff = function () {
    if (this.session.userProfileModel) delete this.session.userProfileModel;
    return;
};
/************* REGISTER **********/
AccountController.prototype.register = function (newUser, callback) {
    var me = this;
    me.userModel.findOne({ email: newUser.email }, function (err, user) {
        if (err) {
            return callback(err, new me.ApiResponse({ success: false, extras: { msg: me.ApiMessages.DB_ERROR } }));
        }
        if (user) {
            return callback(err, new me.ApiResponse({ success: false, extras: { msg: me.ApiMessages.EMAIL_ALREADY_EXISTS } }));
        } else {
			
            newUser.save(function (err, user, numberAffected) {
                if (err) {
                    return callback(err, new me.ApiResponse({ success: false, extras: { msg: me.ApiMessages.DB_ERROR } }));
                }   
                if (numberAffected === 1) {
                    var userProfileModel = new me.UserProfileModel({
                        email: user.email,
                        firstName: user.firstName,
                        lastName: user.lastName
                    });
                    return callback(err, new me.ApiResponse({
                        success: true, extras: {
                            userProfileModel: userProfileModel
                        }
                    }));
                } else {
                    return callback(err, new me.ApiResponse({ success: false, extras: { msg: me.ApiMessages.COULD_NOT_CREATE_USER } }));
                }             

            });
        }

    });
};
/********************** RESET PASSWORD ***********************/
AccountController.prototype.resetPassword = function (email, callback) {
    var me = this;
    me.userModel.findOne({ email: email }, function (err, user) {

        if (err) {
            return callback(err, new me.ApiResponse({ success: false, extras: { msg: me.ApiMessages.DB_ERROR } }));
        }
        // Save the user's email and a password reset hash in session. We will use
        var passwordResetHash = me.uuid.v4();
        me.session.passwordResetHash = passwordResetHash;
        me.session.emailWhoRequestedPasswordReset = email;
        me.mailer.sendPasswordResetHash(email, passwordResetHash);
        return callback(err, new me.ApiResponse({ success: true, extras: { passwordResetHash: passwordResetHash } }));
    })
};
/******************* CONFIRM LINK [RESET PASSWORD] *****************/
AccountController.prototype.resetPasswordFinal = function (email, newPassword, passwordResetHash, callback) {
    var me = this;
    if (!me.session || !me.session.passwordResetHash) {
        return callback(null, new me.ApiResponse({ success: false, extras: { msg: me.ApiMessages.PASSWORD_RESET_EXPIRED } }));
    }

    if (me.session.passwordResetHash !== passwordResetHash) {
        return callback(null, new me.ApiResponse({ success: false, extras: { msg: me.ApiMessages.PASSWORD_RESET_HASH_MISMATCH } }));
    }

    if (me.session.emailWhoRequestedPasswordReset !== email) {
        return callback(null, new me.ApiResponse({ success: false, extras: { msg: me.ApiMessages.PASSWORD_RESET_EMAIL_MISMATCH } }));
    }

    var passwordSalt = this.uuid.v4();

    me.hashPassword(newPassword, passwordSalt, function (err, passwordHash) {

        me.userModel.update({ email: email }, { passwordHash: passwordHash, passwordSalt: passwordSalt }, function (err, numberAffected, raw) {

            if (err) {
                return callback(err, new me.ApiResponse({ success: false, extras: { msg: me.ApiMessages.DB_ERROR } }));
            }

            if (numberAffected < 1) {

                return callback(err, new me.ApiResponse({ success: false, extras: { msg: me.ApiMessages.COULD_NOT_RESET_PASSWORD } }));
            } else {
                return callback(err, new me.ApiResponse({ success: true, extras: null }));
            }                
        });
    });
};
module.exports = AccountController;



/*User Model is the object that has two-way communication with the MongoDB. The mailer is an argument that will be utilised via sending emails for reset of passwords
and the session is what the controller uses as a read-write object*/