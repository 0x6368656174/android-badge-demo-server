import * as bodyParser from 'body-parser';
import * as cors from 'cors';
import * as express from 'express';
import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';

admin.initializeApp(functions.config().firebase);
const messaging = admin.messaging();

const app = express();
app.use(cors({ origin: true }));
app.use(bodyParser.json());

app.get('/', async (request, response) => {
  response.send('Hello=) This is simple service for test Android Badge Demo.');
});

app.post('/', async (request, response) => {
  const { token, title, body, badge } = request.body;

  console.log(`Start send message to "${token}" sended`, {title, body, badge});

  const payload: admin.messaging.MessagingPayload = {
    notification: {
      title,
      body,
    }
  };

  if (badge) {
    payload.data = {};
    payload.data['badge'] = String(badge);
    payload.notification.badge = String(badge);
  }

  const messageDevicesResponse = await messaging.sendToDevice(token, payload);

  console.log(`Message to "${token}" sended`, {title, body, badge}, messageDevicesResponse);

  response.json({
    success: messageDevicesResponse.failureCount === 0,
    data: {
      messageDevicesResponse,
    },
  });
});

export const sendMessage = functions.https.onRequest(app);
