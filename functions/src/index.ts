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

  const notificationPayload: admin.messaging.MessagingPayload = {
    notification: {
      title,
      body,
    }
  };

  if (badge) {
    notificationPayload.notification.badge = String(badge);
  }

  const notificationMessageDevicesResponse = await messaging.sendToDevice(token, notificationPayload);

  const resultData = {
    messageDevicesResponses: {
      notification: notificationMessageDevicesResponse,
      data: null,
    },
  };

  if (badge) {
    const dataPayload = {
      data: {
        badge: String(badge),
      },
    };

    resultData.messageDevicesResponses.data = await messaging.sendToDevice(token, dataPayload);
  }

  console.log(`Message to "${token}" sended`, notificationPayload, resultData);

  response.json({
    success: notificationMessageDevicesResponse.failureCount === 0,
    data: resultData,
  });
});

export const sendMessage = functions.https.onRequest(app);
