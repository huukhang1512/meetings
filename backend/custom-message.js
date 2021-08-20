exports.customMessage = (event, context, callback) => {
    if(event.triggerSource === "CustomMessage_ForgotPassword") {
        event.response.smsMessage = "Reset password requested, please click on this link to reset your password"
        event.response.emailSubject = "Meetings - Reset password requested"
        event.response.emailMessage = `We heard that you lost access to your account. Please click on this link to reset your password. https://test.enu1ar2615.execute-api.us-east-1.amazonaws.com:3000/forgotpassword/?verificationCode=${event.request.codeParameter}&email=${event.request.userAttributes.email}`
    }
    callback(null, event);
};