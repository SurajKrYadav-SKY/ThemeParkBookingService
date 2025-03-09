const amqplib = require("amqplib");
const { MESSAGE_BORKER_URL, EXCHANGE_NAME } = require("../config/serverConfig");

const createChannel = async () => {
  try {
    const connection = await amqplib.connect(MESSAGE_BORKER_URL);

    const channel = await connection.createChannel();
    await channel.assertExchange(EXCHANGE_NAME, "direct", { durable: true });
    return channel;
  } catch (error) {
    console.error("Failed to create channel:", error);
    throw error;
  }
};

const subscribeMessage = async (channel, service, binding_key) => {
  try {
    const queue = await channel.assertQueue("", { exclusive: true }); // dynamic queue

    channel.bindQueue(queue.queue, EXCHANGE_NAME, binding_key);

    channel.consume(
      queue.queue,
      (msg) => {
        if (msg !== null) {
          console.log(`recieved message with binding key : ${binding_key}`);
          console.log(msg.content.toString());
          const payload = JSON.parse(msg.content.toString());
          // service(payload);
          service.subscribeEvents(payload);
          channel.ack(msg);
        }
      },
      { noAck: false }
    );
  } catch (error) {
    console.error("Failed to subscribe to queue:", error);
    throw error;
  }
};

const publishMessage = async (channel, binding_key, message) => {
  try {
    // await channel.assertQueue("CONFIRMATION_QUEUE");
    await channel.publish(EXCHANGE_NAME, binding_key, Buffer.from(message));
    console.log(`Message published with binding key: ${binding_key}`);
  } catch (error) {
    console.error("Failed to publish message:", error);
    throw error;
  }
};

module.exports = {
  subscribeMessage,
  createChannel,
  publishMessage,
};
