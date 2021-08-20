import os, json, logging, boto3
import hmac, hashlib, base64, time
import datetime
from dateutil.tz import tzlocal
from jose import jwk, jwt
from jose.utils import base64url_decode
import urllib.request 

dynamodb = boto3.resource('dynamodb') 
cognito = boto3.client('cognito-idp', region_name='us-east-1')
ssm = boto3.client('ssm')
logger = logging.getLogger("handler_logger")
logger.setLevel(logging.DEBUG)

# Authentication
service = os.environ['SERVICE_NAME']
region = os.environ['REGION']
userPoolId = os.environ['COGNITO_USER_POOL_ID']

def _get_parameter_value(name):
    logger.info("Parameter: {}".format(name))
    response = ssm.get_parameter(Name=name, WithDecryption=False)
    return response["Parameter"]["Value"]

def _load_cognito_public_keys(region, userPoolId):
    keys_url = 'https://cognito-idp.{}.amazonaws.com/{}/.well-known/jwks.json'.format(region, userPoolId)
    with urllib.request.urlopen(keys_url) as f:
        response = f.read()
        return json.loads(response.decode('utf-8'))['keys']

authClientId = _get_parameter_value("{}-authClientId".format(service))
authClientSecret = _get_parameter_value("{}-authClientSecret".format(service))

keys = _load_cognito_public_keys(region,userPoolId)

class UnauthorizedException(Exception):
    pass
# Sign in / Sign up
def sign_up_api(event, context):
    try: 
        body = json.loads(event["body"])
        given_name = body["given_name"]
        family_name = body["family_name"]
        email = body["email"]
        password = body["password"]

        response = cognito.sign_up(
            ClientId = authClientId,
            SecretHash = _get_secret_hash(email),
            Username = email,
            Password = password,
            UserAttributes= [
                {
                    "Name" : 'given_name',
                    "Value": given_name
                },
                {
                    'Name': 'family_name',
                    'Value': family_name
                },
                {
                    'Name': 'email',
                    'Value': email
                },
            ],
        )

        logger.info("Response - {}".format(response))

        response = {
            "statusCode": response["ResponseMetadata"]["HTTPStatusCode"],
            "headers": {"Access-Control-Allow-Origin" : "*" },
            "body": json.dumps(response)
        }
        return response

    except Exception as e:
        logger.info("Exception {}".format(e))
        response = {
            "statusCode": 500,
            "headers": {"Access-Control-Allow-Origin" : "*" },
            "body": "Exception {}".format(e)
        }
        return response

def sign_in_api(event, context):
    try: 
        body = json.loads(event["body"])
        username = body["username"]
        password = body["password"]

        response = cognito.admin_initiate_auth(
            AuthFlow ='ADMIN_USER_PASSWORD_AUTH',
            UserPoolId = userPoolId,
            ClientId = authClientId,
            AuthParameters={
                'SECRET_HASH' : _get_secret_hash(username),
                'USERNAME': username,
                'PASSWORD': password
            }
        )

        response = {
            "statusCode": response["ResponseMetadata"]["HTTPStatusCode"],
            "headers": {
                "Access-Control-Allow-Origin" : "https://test.enu1ar2615.execute-api.us-east-1.amazonaws.com:3000",
                "Access-Control-Allow-Credentials" : True,
            },
            "multiValueHeaders": {
                "Set-cookie": [
                    'AccessToken = {}; HttpOnly; Max-Age={}; Path=/'.format(response["AuthenticationResult"]["AccessToken"],response["AuthenticationResult"]["ExpiresIn"]),
                    'RefreshToken = {}; HttpOnly;Max-Age={};Path=/'.format(response["AuthenticationResult"]["RefreshToken"],2592000)
                ]
            },
            "body": json.dumps(response)
        }
        return response
    except Exception as e:
        logger.info("Exception {}".format(e))
        response = {
            "statusCode": 500,
            "headers": {
                "Access-Control-Allow-Origin" : "https://test.enu1ar2615.execute-api.us-east-1.amazonaws.com:3000",
                "Access-Control-Allow-Credentials" : True,
            },
            "body": "Exception {}".format(e)
        }
        return response

# Confirm sign up with verification code 
def confirm_sign_up_api(event, context):
    try:
        body = json.loads(event["body"])
        email = body["email"]
        confirmationCode = body["confirmationCode"]
        table = dynamodb.Table(os.environ['USER_TABLE_NAME'])

        response = cognito.confirm_sign_up(
            ClientId= authClientId,
            SecretHash= _get_secret_hash(email),
            Username= email,
            ConfirmationCode= confirmationCode,
        )
        userInfo = cognito.admin_get_user(
            UserPoolId= userPoolId,
            Username= email
        )
        table.put_item(
            Item={
                "id" : userInfo.get("Username"),
                "questionsAsked" : [],
                "roomJoined" : []
            },
            ConditionExpression='attribute_not_exists(id)'
        )
        response = {
            "statusCode": response["ResponseMetadata"]["HTTPStatusCode"],
            "headers": {"Access-Control-Allow-Origin" : "*" },
            "body": json.dumps(response)
        }
        return response
    except Exception as e :
        logger.info("Exception {}".format(e))
        response = {
            "statusCode": 500,
            "headers": {"Access-Control-Allow-Origin" : "*" },
            "body": "Exception {}".format(e)
        }
        return response

# Get user information

def get_user_information_api(event, context):
    try:
        CookieDict = parse_dict_cookies(event["headers"]["Cookie"])
        AccessToken = CookieDict["AccessToken"]
        response = cognito.get_user(
            AccessToken = AccessToken
        )
        response = {
            "statusCode": response["ResponseMetadata"]["HTTPStatusCode"],
            "headers": {
                "Access-Control-Allow-Origin" : "https://test.enu1ar2615.execute-api.us-east-1.amazonaws.com:3000",
                "Access-Control-Allow-Credentials" : True,
            },
            "body": json.dumps(response)
        }
        return response
    except Exception as e :
        logger.info("Exception {}".format(e))
        response = {
            "statusCode": 500,
            "headers": {"Access-Control-Allow-Origin" : "*" },
            "body": "Exception {}".format(e)
        }
        return response

# Resend code for verification

def resend_verification_code_api(event,context):
    try:
        body = json.loads(event["body"])
        username = body["username"]
        response = cognito.resend_confirmation_code(
            ClientId= authClientId,
            SecretHash= _get_secret_hash(username),
            Username= username,
        )
        response = {
            "statusCode": response["ResponseMetadata"]["HTTPStatusCode"],
            "headers": {"Access-Control-Allow-Origin" : "*" },
            "body": json.dumps(response)
        }
        return response
    except Exception as e :
        logger.info("Exception {}".format(e))
        response = {
            "statusCode": 500,
            "headers": {"Access-Control-Allow-Origin" : "*" },
            "body": "Exception {}".format(e)
        }
        return response

# Forgot password / Confirm Forgot password API
def forgot_password_api(event, context):
    try:
        body = json.loads(event["body"])
        username = body["username"]
        response = cognito.forgot_password(
            ClientId= authClientId,
            SecretHash=_get_secret_hash(username),
            Username= username
        )
        response = {
            "statusCode": response["ResponseMetadata"]["HTTPStatusCode"],
            "headers": {"Access-Control-Allow-Origin" : "*" },
            "body": json.dumps(response)
        }
        return response
    except Exception as e :
        logger.info("Exception {}".format(e))
        response = {
            "statusCode": 500,
            "headers": {"Access-Control-Allow-Origin" : "*" },
            "body": "Exception {}".format(e)
        }
        return response

def custom_message(event,context):
    if(event["userPoolId"] == userPoolId):
        if(event["triggerSource"] == 'CustomMessage_ForgotPassword'):
            event["response"]["smsMessage"] = "Reset password requested"
            event["response"]["emailSubject"] = "Please click on this link to reset your password"
            event["response"]["mailMessage"] = "Thank you for signing up. " + event["request"]["codeParameter"] + event["request"]["userAttributes"]["email"] + " is your verification code"
    return event

def confirm_forgot_password_api(event,context):
    try:
        body = json.loads(event["body"])
        username = body["username"]
        password = body["password"]
        confirmationCode = body["confirmationCode"]
        response = cognito.confirm_forgot_password(
            ClientId= authClientId,
            SecretHash=_get_secret_hash(username),
            Password= password,
            Username= username,
            ConfirmationCode= confirmationCode,
        )
        response = {
            "statusCode": response["ResponseMetadata"]["HTTPStatusCode"],
            "headers": {"Access-Control-Allow-Origin" : "*" },
            "body": json.dumps(response)
        }
        return response
    except Exception as e :
        logger.info("Exception {}".format(e))
        response = {
            "statusCode": 500,
            "headers": {"Access-Control-Allow-Origin" : "*" },
            "body": "Exception {}".format(e)
        }
        return response
# Code for token
def refresh_token_api(event, context):
    try: 
        CookieDict = parse_dict_cookies(event["headers"]["Cookie"])
        AccessToken = CookieDict["AccessToken"]
        RefreshToken = CookieDict["RefreshToken"]

        newHeader = event["headers"]
        newHeader.update({"Authorization": "Bearer {}".format(AccessToken)})
        
        claims = verify_token(newHeader)

        response = cognito.admin_initiate_auth(
            AuthFlow ='REFRESH_TOKEN_AUTH',
            UserPoolId = userPoolId,
            ClientId = authClientId,
            AuthParameters={
                'SECRET_HASH' : _get_secret_hash(claims["sub"]),
                'REFRESH_TOKEN': RefreshToken,
            }
        )

        logger.info("Response - {}".format(response))

        response = {
            "statusCode": response["ResponseMetadata"]["HTTPStatusCode"],
            "headers": {
                "Access-Control-Allow-Origin" : "https://test.enu1ar2615.execute-api.us-east-1.amazonaws.com:3000",
                "Access-Control-Allow-Credentials" : True,
                "Set-Cookie": 'AccessToken = {};Path = /; HttpOnly'.format(response["AuthenticationResult"]["AccessToken"]),
            },
            "body": json.dumps(response)
        }
        return response
    except UnauthorizedException as e:
        logger.info("Exception {}".format(e))
        response = {
            "statusCode": 401,
            "headers": {"Access-Control-Allow-Origin" : "*" },
            "body": "Exception {}".format(e)
        }
        return response
    except Exception as e:
        logger.info("Exception {}".format(e))
        response = {
            "statusCode": 500,
            "headers": {"Access-Control-Allow-Origin" : "*" },
            "body": "Exception {}".format(e)
        }
        return response

def verify_token(headers):
    if("Authorization" in headers):
        token = headers["Authorization"].replace("Bearer ", "")
    else:
        raise UnauthorizedException("Authorization header now found")

    headers = jwt.get_unverified_headers(token)
    kid = headers['kid']
    key_index = -1

    for i in range(len(keys)):
        if kid == keys[i]['kid']:
            key_index = i
            break
    if key_index == -1:
        raise UnauthorizedException('Public key not found in jwks.json')

    publicKey = jwk.construct(keys[key_index])
    message, encodedSignature = str(token).rsplit('.', 1)
    decoded_signature = base64url_decode(encodedSignature.encode('utf-8'))

    if not publicKey.verify(message.encode("utf8"), decoded_signature):
        raise UnauthorizedException('Signature verification failed')

    logger.info('Signature successfully verified')
    claims = jwt.get_unverified_claims(token)

    if time.time() > claims['exp']:
        raise UnauthorizedException('Token is expired')

    if claims['client_id'] != authClientId:
        raise UnauthorizedException('Token was not issued for this audience')

    return claims   

def parse_dict_cookies(value):
    result = {}
    for item in value.split(';'):
        item = item.strip()
        if not item:
            continue
        if '=' not in item:
            result[item] = None
            continue
        name, value = item.split('=', 1)
        result[name] = value
    return result

def _get_secret_hash(username):
    message = username + authClientId
    dig = hmac.new(bytes(authClientSecret, 'UTF-8'), msg=message.encode('UTF-8'),
                    digestmod=hashlib.sha256).digest()
    return base64.b64encode(dig).decode()

# User database functions
def set_question_asked(question_id,userName):
    try:
        table = dynamodb.Table(os.environ['USER_TABLE_NAME'])
        table.update_item(
            Key = {
                "id" :  userName
            }, 
            UpdateExpression = "SET questionsAsked = list_append(questionsAsked, :question_id)",
            ExpressionAttributeValues = {
                ':question_id': [question_id],
            }
        )
        return question_id

    except Exception as e:
        logger.info("Exception {}, Failed add the data to user database".format(e))
        return False

def set_room_joined(roomId, userName):
    try:
        table = dynamodb.Table(os.environ['USER_TABLE_NAME'])
        roomJoined = get_room_joined(userName)
        if not (roomId in roomJoined):
            table.update_item(
                Key = {
                    "id" :  userName
                }, 
                UpdateExpression = "SET roomJoined = list_append(roomJoined, :newRoom)",
                ExpressionAttributeValues = {
                    ':newRoom': [roomId],
                }
            )
        return roomId

    except Exception as e:
        logger.info("Exception {}, Failed add the data to user database".format(e))
        return False

def get_question_asked_api(event,context):
    CookieDict = parse_dict_cookies(event["headers"]["Cookie"])
    AccessToken = CookieDict["AccessToken"]
    newHeader = event["headers"]
    newHeader.update({"Authorization": "Bearer {}".format(AccessToken)})
    verify_token(newHeader)
    data = json.loads(event["body"])
    userName = data["userName"]
    logger.info("Event {}".format(event))
    try: 
        questions_asked = get_question_asked(userName)
        return {
            "statusCode": 200,
            "headers": {
                "Access-Control-Allow-Origin" : "https://test.enu1ar2615.execute-api.us-east-1.amazonaws.com:3000",
                "Access-Control-Allow-Credentials" : True,
            },
            "body": json.dumps(questions_asked)
        }
    except Exception as e:
        logger.info("Exception {}".format(e))
        return {
            "statusCode": 500,
            "headers": {"Access-Control-Allow-Origin" : "*" },
            "body": json.dumps(e.response)
        }

def get_question_asked(userName):
    table = dynamodb.Table(os.environ['USER_TABLE_NAME'])
    response = table.get_item(
        Key = { 'id' : userName },
        AttributesToGet = ["questionsAsked"]
    )
    return response["Item"]["questionsAsked"]

def get_room_joined_api(event,context):
    CookieDict = parse_dict_cookies(event["headers"]["Cookie"])
    AccessToken = CookieDict["AccessToken"]
    newHeader = event["headers"]
    newHeader.update({"Authorization": "Bearer {}".format(AccessToken)})
    verify_token(newHeader)
    data = json.loads(event["body"])
    userName = data["userName"]

    logger.info("Event {}".format(event))
    try: 
        roomJoined = get_room_joined(userName)
        return {
            "statusCode": 200,
            "headers": {
                "Access-Control-Allow-Origin" : "https://test.enu1ar2615.execute-api.us-east-1.amazonaws.com:3000",
                "Access-Control-Allow-Credentials" : True,
            },
            "body": json.dumps(roomJoined)
        }
    except Exception as e:
        logger.info("Exception {}".format(e))
        return {
            "statusCode": 500,
            "headers": {"Access-Control-Allow-Origin" : "*" },
            "body": json.dumps(e.response)
        }

def get_room_joined(userName):
    table = dynamodb.Table(os.environ['USER_TABLE_NAME'])
    response = table.get_item(
        Key = { 'id' : userName },
        AttributesToGet = ["roomJoined"]
    )
    return response["Item"]["roomJoined"]
