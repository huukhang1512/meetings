SERVICE_NAME="khang-deploy-meetings-2"

while getopts "s:i:" OPTION; do
    case $OPTION in

        s)
            COGNITO_CLIENT_SECRET="$OPTARG"
            echo "Updating parameter ${SERVICE_NAME}-authClientSecret..."
            aws ssm put-parameter --overwrite --name ${SERVICE_NAME}-authClientSecret --value ${COGNITO_CLIENT_SECRET} --type String
            ;;
        i)
            COGNITO_CLIENT_ID="$OPTARG"
            echo "Updating parameter ${SERVICE_NAME}-authClientId..."
            aws ssm put-parameter --overwrite  --name ${SERVICE_NAME}-authClientId --value ${COGNITO_CLIENT_ID} --type String
            ;;
        h)
            echo "Usage:"
            echo "args.sh -i <path to iso> -d <usb drive device>"
            echo "Example: args.sh -i ~/Downloads/ubuntu.iso -d /dev/disk2s1"
            echo ""
            echo "   -i <arg>   cognito client id" 
            echo "   -s <arg>   cognito client secret"
            echo "   -h         help (this output)"
            exit 0
            ;;
    esac
done