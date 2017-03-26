import React, {PropTypes, Component} from 'react'
import {
	View,
	ScrollView,
	Text,
	TextInput,
	TouchableOpacity,
	Platform,
	StyleSheet,
} from 'react-native'
import KeyboardSpacer from 'react-native-keyboard-spacer'
import MessageBubble from './MessageBubble'

let scrollWindow
let scrollHeight
let apiPollIntervalId

class ChatScreen extends Component {

	constructor (props) {
		super (props)
		this._fetchResponses = this._fetchResponses.bind(this)
	}

	componentDidMount() {
		apiPollIntervalId = setInterval(this._fetchResponses, 500)
	}

	componentWillMount() {
		clearInterval (apiPollIntervalId)
	}

	_fetchResponses(){
		fetch('http://localhost:8080/messages')
			.then(response => response.json())
			.then(data => {
				if(data && data.message) {
					this.props.onReceivedMessage(data)
				}
			}).catch(e => {
				console.log(e)
			})
	}

	render() {
		const bubbles =  this.props.messages.map( (m, i) => <MessageBubble {...m} key={i} />)
		const spacer = 	Platform.OS === 'ios' ? <KeyboardSpacer /> : null

		return (
			<View behavior="padding" style={styles.container}>
				<ScrollView 
					style={styles.bubbleContainer}
					ref={ scrollView => {scrollWindow = scrollView}}
					onLayout={event => {
						scrollHeight = event.nativeEvent.layout.height
					}}
					onContentSizeChange={(width, height) =>{
						if (scrollHeight < height) {
							scrollWindow.scrollTo({ y: height - scrollHeight })
						}
					}}
				>
					{bubbles}
				</ScrollView>
				<View style={styles.messageBoxContainer}>
					<TextInput 
						style={styles.messageBox}
						value={this.props.composingMessage}
						onChangeText={this.props.onComposeMessageUpdate}
						onSubmitEditting={this.props.onSendMessage}
						returnKeyType="send"
					/>
					<TouchableOpacity onPress={this.props.onSendMessage}>
						<Text style={styles.sendButton}>Send</Text>
					</TouchableOpacity>
				</View>
				{spacer}
			</View>
		)

	}
}

ChatScreen.propTypes = {
	messages: PropTypes.array.isRequired,
	composingMessage: PropTypes.string,
	onComposeMessageUpdate: PropTypes.func.isRequired,
	onSendMessage: PropTypes.func.isRequired,
	onReceivedMessage: PropTypes.func.isRequired,
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#ffffff',
	},
	bubbleContainer: {
		flex: 1,
	},
	messageBoxContainer: {
		flexDirection: 'row',
		alignItems: 'center',
		borderTopWidth: 1,
		borderTopColor: '#cccccc',
		backgroundColor: '#eeeeee',
		paddingVertical: 5,
		paddingHorizontal: 10,
	},
	messageBox: {
		flex: 1,
		height: 40,
		borderWidth: 1,
		borderRadius: 10,
		borderColor: '#dddddd',
		backgroundColor:'#ffffff',
		paddingHorizontal: 5,
	},
	sendButton: {
		color: 'blue',
		marginLeft: 10,
		marginRight: 5,
		fontSize: 16,
		fontWeight: '500',
	},
})

export default ChatScreen