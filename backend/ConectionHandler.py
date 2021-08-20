import os, json, logging, boto3
from QueueHandler import connect_to_room, disconnect_from_room, raise_hand, get_room_connections, get_room_members,done_talking,add_participant, delete_participant, get_room_admin, ask_question,changing_mode, get_room_mode, drawing,remove_question
from AuthenticationHandler import set_question_asked,set_room_joined,verify_token
dynamodb = boto3.resource('dynamodb')
logger = logging.getLogger("handler_logger")
logger.setLevel(logging.DEBUG)

# Notifications that server can send 
# Message that server send
CONNECTION_CONFIRMED = "CONNECTION_CONFIRMED"
CONNECTION_FAILED = "CONNCECTION_FAILED"
CONNECTION_DISCONNECTED = "CONNECTION_DISCONNECTED"
NEW_RAISE = "NEW_RAISE"
DONE_TALKING = "DONE_TALKING"
CHANGING_MODE = "CHANGING_MODE"
ADD_MEMBERS = "ADD_MEMBERS"
REMOVE_MEMBERS = "REMOVE_MEMBERS"
QUESTION_NEW = "QUESTION_NEW"
QUESTION_ASKED = "QUESTION_ASKED"
QUESTION_REMOVED = "QUESTION_REMOVED"
DRAWING = "DRAWING"
BOARD_SAVED = "BOARD_SAVED"
BOARD_CLEARED= "BOARD_CLEARED"
UNDO = "UNDO"
REDO = "REDO"

def connection_manager_api(event, context):
    """
    Handles connecting and disconnecting for the Websocket.
    """
    connectionId = event["requestContext"].get("connectionId")
    if event["requestContext"]["eventType"] == "CONNECT":
        logger.info("Connect requested")        
        return _get_response(200, "Connect successful.")
        
    elif event["requestContext"]["eventType"] == "DISCONNECT":
        logger.info("Disconnect requested")

        userName = get_connected_user(connectionId)
        roomId = get_connected_room(connectionId)
        # Remove ConnectionID from Connection Table
        remove_connection(connectionId)

        # Remove ConnectionID from Queue Table
        disconnect_from_room(connectionId, roomId)
        delete_participant(userName, roomId)

        connections = get_room_connections(roomId)
        _send_to_connections(connections, {
                "action" : REMOVE_MEMBERS,
                "data" : {
                    "userName" : userName,
                    "roomId" : roomId
                }
            }, event)

        return _get_response(200, "Disconnect successful.")
    else:
        logger.error("Connection manager received unrecognized eventType.")
        return _get_response(500, "Unrecognized eventType.")

def connect_to_room_hanlder(event, context):
    connectionId = event["requestContext"].get("connectionId")
    try:
        body = event.get("body", "")  
        data = json.loads(body)
        roomId = data["roomId"]
        userName = data["userName"]
        fullName = data["fullName"]

        roomMode = get_room_mode(roomId)
        logger.info(data.keys())
        nameObj = {
            "userName" : userName,
            "fullName" : fullName
        }
        
        conenction_added_to_room = connect_to_room(connectionId, roomId)
        conenction_saved = save_connection(connectionId, roomId, nameObj)

        set_room_joined(roomId,userName)
        
        participant_added_to_room = add_participant(nameObj, roomId)
        connections = get_room_connections(roomId)

        admin = get_room_admin(roomId)

        _send_to_connection(connectionId, {
            "action" : CONNECTION_CONFIRMED,
            "data" : { 
                "current_mode": roomMode,
                "is_admin" : admin == userName,
                "conenction_added_to_room" : conenction_added_to_room,
                "conenction_saved" : conenction_saved,
            }
        }, event)

        _send_to_connections(connections, {
            "action" : ADD_MEMBERS,
            "data" : {
                "userName" : participant_added_to_room,
                "roomId" : roomId
            }
        }, event)
        return _get_response(200, "Message echo-ed.")
    except Exception as e:
        _send_to_connection(connectionId, {
            "action" : CONNECTION_FAILED,
        }, event)
        logger.info("Exception {}".format(e))
        return False

# Changing mode
def changing_mode_handler(event, context):
    body = json.loads(event.get("body",""))
    roomId = body["roomId"]
    modeName = body["modeName"]
    adminName = body["adminName"]
    admin = get_room_admin(roomId)
    if(admin == adminName):
        modeChange = changing_mode(roomId,modeName)
        connections = get_room_connections(roomId)

        _send_to_connections(connections, {
            "action" : CHANGING_MODE,
            "data" : {
                "roomId" : roomId,
                "mode" : modeChange
            }
        }, event)

# Q&A
def send_question_hanlder(event, context):
    body = json.loads(event.get("body", ""))
    connectionId = event["requestContext"].get("connectionId")

    roomId = body["roomId"]
    question = body["question"]

    questionObj = ask_question(roomId, question)

    set_question_asked(questionObj["question_id"],questionObj["question"]["userName"])

    connections = get_room_connections(roomId)
    _send_to_connection(connectionId, {
        "action" : QUESTION_ASKED,
        "data" : { 
            "question_id" : questionObj
        }
    }, event)

    _send_to_connections(connections, {
        "action" : QUESTION_NEW,
        "data" : {
            "roomId" : roomId,
            "question" : questionObj
        }
    }, event)

    return _get_response(200, "Message echo-ed.")

def remove_question_hanlder(event,context):
    body = json.loads(event.get("body", ""))
    roomId = body["roomId"]
    question_id = body["question_id"]

    question_removed = remove_question(roomId,question_id)
    connections = get_room_connections(roomId)

    _send_to_connections(connections, {
        "action" : QUESTION_REMOVED,
        "data" : {
            "roomId" : roomId,
            "question_id" : question_removed
        }
    }, event)

    return _get_response(200, "Message echo-ed.")

# Meeting-queue
def raise_hand_hanlder(event, context):
    body = json.loads(event.get("body", ""))
    roomId = body["roomId"]
    userName = body["userName"]

    queueObj = raise_hand(roomId, userName)
    connections = get_room_connections(roomId)

    _send_to_connections(connections, {
        "action" : NEW_RAISE,
        "data" : {
            "roomId" : roomId,
            "queue" : queueObj
        }
    }, event)

    return _get_response(200, "Message echo-ed.")

def done_talking_handler(event, context):
    body = event.get("body", "")  
    data = json.loads(body)
    roomId = data["roomId"]
    userName = data["userName"]

    done_talking(roomId,userName)
    connections = get_room_connections(roomId)

    _send_to_connections(connections, {
        "action" : DONE_TALKING,
        "data" : {
            "roomId" : roomId,
            "userName" : userName
        }
    }, event)

    return _get_response(200, "Message echo-ed.")
#Drawing 
def drawing_handler(event,context):
    body = event.get("body","")
    data = json.loads(body)
    roomId = data["roomId"]
    lines = data["lines"]

    # lines_draw = drawing(roomId,lines)

    connections = get_room_connections(roomId)
    _send_to_connections(connections, {
        "action" : DRAWING,
        "data" : {
            "roomId" : roomId,
            "lines" : lines
        }
    }, event)

    return _get_response(200, "Message echo-ed.")

def save_board(event,context):
    body = event.get("body","")
    data = json.loads(body)
    roomId = data["roomId"]
    lines = data["lines"]

    lines_draw = drawing(roomId,lines)

    connections = get_room_connections(roomId)
    _send_to_connections(connections, {
        "action" : BOARD_SAVED,
        "data" : {
            "roomId" : roomId,
            "lines" : lines_draw
        }
    }, event)

    return _get_response(200, "Message echo-ed.")

def clear_board(event,context):
    body = event.get("body","")
    data = json.loads(body)
    roomId = data["roomId"]
    lines = []
    connections = get_room_connections(roomId)

    _send_to_connections(connections, {
        "action" : BOARD_CLEARED,
        "data" : {
            "roomId" : roomId,
            "lines" : lines
        }
    }, event)

    return _get_response(200, "Message echo-ed.")

def undo_handler(event,handler):
    body = event.get("body","")
    data = json.loads(body)
    roomId = data["roomId"]
    lines = data["lines"]
    connections = get_room_connections(roomId)

    _send_to_connections(connections, {
        "action" : UNDO,
        "data" : {
            "roomId" : roomId,
            "lines" : lines
        }
    }, event)

    return _get_response(200, "Message echo-ed.")

def redo_handler(event,handler):
    body = event.get("body","")
    data = json.loads(body)
    roomId = data["roomId"]
    lines = data["lines"]
    connections = get_room_connections(roomId)

    _send_to_connections(connections, {
        "action" : REDO,
        "data" : {
            "roomId" : roomId,
            "lines" : lines
        }
    }, event)
    return _get_response(200, "Message echo-ed.")

def get_connected_room(connectionId):
    try:        
        table = dynamodb.Table(os.environ['CONNECTION_TABLE_NAME'])
        response = table.get_item(
            Key = { 'id' : connectionId }, 
            AttributesToGet  = ["RoomID"]
        )
        return response["Item"]["RoomID"]
    except Exception as e:
        logger.info("Exception {}, Get connected room failed".format(e))
        return None

def get_connected_user(connectionId):
    try:        
        table = dynamodb.Table(os.environ['CONNECTION_TABLE_NAME'])
        response = table.get_item(
            Key = { 'id' : connectionId }, 
            AttributesToGet = ["UserName"]
        )
        return response["Item"]["UserName"]
    except Exception as e:
        logger.info("Exception {}, Get connected user failed ".format(e))
        return None

def remove_connection(connectionId):
    table = dynamodb.Table(os.environ['CONNECTION_TABLE_NAME'])
    table.delete_item(Key={ "id" : connectionId })

def save_connection(connectionId, roomId, userName):
    try:        
        # Add connectionId to the database
        table = dynamodb.Table(os.environ['CONNECTION_TABLE_NAME'])
        table.put_item(Item={
            "id" : connectionId,
            "RoomID" : roomId,
            "UserName" : userName
        })
        return True
    except Exception as e:
        logger.info("Exception {}, Failed to save connection".format(e))
        return False

def echo_api(event, context):
    """
    When a message is sent on the socket, forward it to all connections.
    """
    logger.info("Message sent on WebSocket.")
    connectionId = event["requestContext"].get("connectionId")
    message = event.get("body", "")  
    
    _send_to_connection(connectionId, message, event)

    return _get_response(200, "Message echo-ed.")

def _send_to_connection(connection_id, data, event):
    gatewayapi = boto3.client("apigatewaymanagementapi", 
        endpoint_url = "https://" + event["requestContext"]["domainName"] + "/" + event["requestContext"]["stage"])
    
    return gatewayapi.post_to_connection(ConnectionId=connection_id, Data=json.dumps(data).encode('utf-8'))

def _send_to_connections(connections, data, event):
    for connection in connections: 
        _send_to_connection(connection, data, event)

def _get_response(status_code, body):
    if not isinstance(body, str):
        body = json.dumps(body)
    return {"statusCode": status_code, "body": body}