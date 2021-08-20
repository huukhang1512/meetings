import os, uuid, decimal
import json, logging
import boto3
from botocore.exceptions import ClientError
FETCH_NEW_QUESTIONS = "FETCH_NEW_QUESTIONS"

# Create an Lambda client
lambda_client = boto3.client('lambda')
dynamodb = boto3.resource('dynamodb')
client = boto3.client('dynamodb')
logger = logging.getLogger("handler_logger")
logger.setLevel(logging.DEBUG)

# Share function
def create_room_api(event, context):
    try:
        body = json.loads(event["body"])
        admin = body["userName"]
        newRoomId = str(uuid.uuid4().int)[:6]
        table = dynamodb.Table(os.environ['QUEUE_TABLE_NAME'])
        response = table.put_item(
            Item={
                "id" : newRoomId,
                "admin" : admin,
                "modeName" : "Default Mode",
                "name" : "Default Room Name",
                "questions" :[],
                "queue" : [],
                "whiteBoard":[],
                "members" : []
            }, 
            ConditionExpression='attribute_not_exists(id)'
        )
        response = {
            "statusCode": response["ResponseMetadata"]["HTTPStatusCode"],
            "headers": {"Access-Control-Allow-Origin" : "*" },
            "body": json.dumps({ "roomid" : newRoomId })
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

def connect_to_room(connectionId, roomId):
    try:        
        table = dynamodb.Table(os.environ['QUEUE_TABLE_NAME'])
        table.update_item(
            Key = {
                "id" : roomId
            }, 
            UpdateExpression = "ADD connections :value",
            ExpressionAttributeValues={
                ':value': set([connectionId])
            }
        )
        return True
    except Exception as e:
        logger.info("Exception {}, connect to room failed ".format(e))
        return False

def disconnect_from_room(connectionId, roomId):
    try:        
        table = dynamodb.Table(os.environ['QUEUE_TABLE_NAME'])
        table.update_item(
            Key = {
                "id" :  roomId
            }, 
            UpdateExpression = "DELETE connections :value",
            ConditionExpression='id = :id',
            ExpressionAttributeValues={
                ':id' : roomId,
                ':value': set([connectionId])
            }
        )
        return True
    except Exception as e:
        logger.info("Exception {} , disconnect failed".format(e))
        return False

def delete_participant(userName, roomId):
    try: 
        table = dynamodb.Table(os.environ['QUEUE_TABLE_NAME'])
        roomMembers = get_room_members(roomId)
        userIndex = str(roomMembers.index(userName))
        table.update_item(
            Key = {
                "id" :  roomId
            }, 
            UpdateExpression = "REMOVE members["+userIndex+"]" ,
        )
        return True
    except Exception as e:
        logger.info("Exception {} Cannot delete participant".format(e))
        return False

def get_room_connections(roomId):
    try: 
        table = dynamodb.Table(os.environ['QUEUE_TABLE_NAME'])
        response = table.get_item(
            Key = { 'id' : roomId }, 
            AttributesToGet  = ["connections"]
        )
        return response["Item"]["connections"]
    except Exception as e:
        return None

def add_participant(fullName,roomId):
    try :
        table = dynamodb.Table(os.environ['QUEUE_TABLE_NAME'])
        table.update_item(
            Key = {
                "id" :  roomId
            }, 
            UpdateExpression = "SET members = list_append(members, :participants)",
            ExpressionAttributeValues = {
                ':participants': [fullName],
            }
        )
        return fullName
    except Exception as e:
        logger.info("Exception {}, Failed to add participant".format(e))
        return False

def get_room_members_api(event,context):
    roomId = event["pathParameters"]["roomid"]
    logger.info("Event {}".format(event))
    try: 
        members = get_room_members(roomId)
        return {
            "statusCode": 200,
            "headers": {"Access-Control-Allow-Origin" : "*" },
            "body": json.dumps(members)
        }
    except Exception as e:
        logger.info("Exception {}".format(e))
        return {
            "statusCode": 500,
            "headers": {"Access-Control-Allow-Origin" : "*" },
            "body": json.dumps(e.response)
        }

def get_room_members(roomId):
    table = dynamodb.Table(os.environ['QUEUE_TABLE_NAME'])
    response = table.get_item(
        Key = { 'id' : roomId }, 
        AttributesToGet = ["members"]
    )
    return response["Item"]["members"]

def get_room_admin(roomId):
    try :
        table = dynamodb.Table(os.environ['QUEUE_TABLE_NAME'])
        response = table.get_item(
            Key = { 'id' : roomId },
            AttributesToGet = ["admin"]
        )
        return response["Item"]["admin"]
    except Exception as e:
        logger.info("Exception {}".format(e))
        return False

def changing_mode(roomId,modeName):
    table = dynamodb.Table(os.environ['QUEUE_TABLE_NAME'])
    table.update_item(
        Key = {
            "id" :  roomId
        },
        UpdateExpression = "SET modeName = :modeName",
        ExpressionAttributeValues = {
            ':modeName': modeName,
        }
    )
    return modeName
#Meeting queue
def raise_hand(roomId, queueObj): 
    table = dynamodb.Table(os.environ['QUEUE_TABLE_NAME'])
    table.update_item(
        Key = {
            "id" :  roomId
        },
        UpdateExpression = "SET queue = list_append(queue, :queue)",
        ExpressionAttributeValues = {
            ':queue': [queueObj],
        }
    )
    return queueObj

def done_talking(roomId,userName):
    table = dynamodb.Table(os.environ['QUEUE_TABLE_NAME'])
    roomQueue = get_room_queue(roomId)
    queue_by_id = build_dict(roomQueue,key="userName")
    queueInfo = queue_by_id.get(userName)

    table.update_item(
        Key = {
            'id' : roomId
        },
        UpdateExpression = "REMOVE queue["+str(queueInfo.get('index'))+"]",
    )

def get_room_queue_api(event, context):
    roomId = event["pathParameters"]["roomid"]
    logger.info("Event {}".format(event))
    try: 
        queue = get_room_queue(roomId)
        return {
            "statusCode": 200,
            "headers": {"Access-Control-Allow-Origin" : "*" },
            "body": json.dumps(queue)
        }
    except Exception as e:
        logger.info("Exception {}".format(e))
        return {
            "statusCode": 500,
            "headers": {"Access-Control-Allow-Origin" : "*" },
            "body": json.dumps(e.response)
        }
    
def get_room_mode(roomId):
    table = dynamodb.Table(os.environ['QUEUE_TABLE_NAME'])
    response = table.get_item(
        Key = { 'id' : roomId }, 
        AttributesToGet = ["modeName"]
    )
    return response["Item"]["modeName"]
    
def get_room_queue(roomId):
    table = dynamodb.Table(os.environ['QUEUE_TABLE_NAME'])
    response = table.get_item(
        Key = { 'id' : roomId }, 
        AttributesToGet = ["queue"]
    )
    return response["Item"]["queue"]

#Q&A
def replace_decimals(obj):
    if isinstance(obj, list):
        for i in range(len(obj)):
            obj[i] = replace_decimals(obj[i])
        return obj
    elif isinstance(obj, dict):
        for k, v in obj.items():
            obj[k] = replace_decimals(v)
        return obj
    elif isinstance(obj, decimal.Decimal):
        if obj % 1 == 0:
            return int(obj)
        else:
            return float(obj)
    else:
        return obj
# Use to convert the decimal value in dynamodb from decimal to int/float

def get_room_questions_api(event, context):
    roomId = event["pathParameters"]["roomid"]
    logger.info("Event {}".format(event))
    try: 
        questions = get_room_questions(roomId)
        return {
            "statusCode": 200,
            "headers": {"Access-Control-Allow-Origin" : "*" },
            "body": json.dumps(questions)
        }
    except Exception as e:
        logger.info("Exception {}".format(e))
        return {
            "statusCode": 500,
            "headers": {"Access-Control-Allow-Origin" : "*" },
            "body": "Exception {}".format(e)
        }
    
def get_room_questions(roomId):
    table = dynamodb.Table(os.environ['QUEUE_TABLE_NAME'])
    response = table.get_item(
        Key = { 'id' : roomId }, 
        AttributesToGet  = ["questions"]
    )
    return replace_decimals(response["Item"]["questions"])

def ask_question(roomId, question):
    table = dynamodb.Table(os.environ['QUEUE_TABLE_NAME'])
    questionObj = {
        "question" : question,
        "question_id" : str(uuid.uuid4().int)[:6]
    }
    table.update_item(
        Key = {
            "id" :  roomId
        },
        UpdateExpression = "SET questions = list_append(questions, :new_question)",
        ExpressionAttributeValues = {
            ':new_question': [questionObj],
        }
    )
    return questionObj

def build_dict(seq, key):
    return dict((d[key], dict(d, index=index)) for (index, d) in enumerate(seq))

def remove_question(roomId,question_id):
    table = dynamodb.Table(os.environ['QUEUE_TABLE_NAME'])
    questions = get_room_questions(roomId)
    question_by_id = build_dict(questions,key="question_id")
    question_info = question_by_id.get(question_id)

    table.update_item(
        Key = {
            "id" : roomId
        },
        UpdateExpression = "REMOVE questions["+str(question_info.get('index'))+"]",
    )
    return question_id

#White board mode
def drawing(roomId,line):
    lines_drawed = get_white_board_content(roomId)
    if([line] != lines_drawed):
        table = dynamodb.Table(os.environ['QUEUE_TABLE_NAME'])
        table.update_item(
            Key = {
                "id": roomId
            },
            UpdateExpression = "SET whiteBoard = :new_lines",
            ExpressionAttributeValues = {
                ':new_lines': [line],
            }
        )
        return line
    else:
        logger.info("No changes to saved")
        return line

def get_white_board_content(roomId):
    try :
        table = dynamodb.Table(os.environ['QUEUE_TABLE_NAME'])
        response = table.get_item(
            Key = { 'id' : roomId },
            AttributesToGet = ["whiteBoard"]
        )
        return replace_decimals(response["Item"]["whiteBoard"])
    except Exception as e:
        logger.info("Exception {}".format(e))
        return False

def get_white_board_content_api(event,context):
    roomId = event["pathParameters"]["roomid"]
    logger.info("Event {}".format(event))
    try: 
        lines = get_white_board_content(roomId)
        return {
            "statusCode": 200,
            "headers": {"Access-Control-Allow-Origin" : "*" },
            "body": json.dumps(lines)
        }
    except Exception as e:
        logger.info("Exception {}".format(e))
        return {
            "statusCode": 500,
            "headers": {"Access-Control-Allow-Origin" : "*" },
            "body": json.dumps(e.response)
        }

def subscribe_to_push_api(event, context):
    body = json.loads(event["body"])
    subscription = body["subscription"]
    roomId = body["roomid"]    
    
    try:        
        table = dynamodb.Table(os.environ['QUEUE_TABLE_NAME'])
        response = table.update_item(
            Key = {
                "id" :  roomId
            }, 
            UpdateExpression = "ADD subscriptions :value",
            ConditionExpression='id = :id',
            ExpressionAttributeValues={
                ':id' : roomId,
                ':value': set([subscription])
            }
        )
        response = {
            "statusCode": 200,
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

def notifySubscriber(subscriptions, message):
    pushLambda = os.environ['PUSH_LAMBDA_NAME'] 

    lambda_client.invoke(
        FunctionName= pushLambda,
        InvocationType='Event',
        Payload=json.dumps({
            "subscriptions" : subscriptions,
            "message" : message
        })
    )

def echo_api(event, context):
    """
    When a message is sent on the socket, forward it to all connections.
    """
    logger.info("Message sent on WebSocket.")
    connectionID = event["requestContext"].get("connectionId")
    message = event.get("body", "")  
    
    _send_to_connection(connectionID, message, event)

    return _get_response(200, "Message echo-ed.")

def _send_to_connection(connection_id, data, event):
    gatewayapi = boto3.client("apigatewaymanagementapi", 
        endpoint_url = "https://" + event["requestContext"]["domainName"] + "/" + event["requestContext"]["stage"])
    
    return gatewayapi.post_to_connection(ConnectionId=connection_id, Data=json.dumps(data).encode('utf-8'))

def _get_response(status_code, body):
    if not isinstance(body, str):
        body = json.dumps(body)
    return {"statusCode": status_code, "body": body}