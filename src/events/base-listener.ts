import { Message, Stan } from "node-nats-streaming";
import { Subjects } from "./subjects";

interface Event {
  subject: Subjects;
  data: any;
}

export abstract class Listener<T extends Event> {
  abstract subject: T['subject'];
  abstract queueGroupName: string;
  abstract onMessage (data: T['data'], msg: Message): void;
  protected ackWait = 5 * 1000;

  constructor (protected readonly client: Stan) {

  }

  subscriptionOptions () {
    return this.client.subscriptionOptions().setDeliverAllAvailable().setManualAckMode(true).setAckWait(this.ackWait).setDurableName(this.queueGroupName);
  }

  listen () {
    const subscription = this.client.subscribe(this.subject, this.queueGroupName, this.subscriptionOptions());

    subscription.on('message', (msg: Message) => {
      console.log(`Received a message #${msg.getSequence()}`);
      const data = this.parseMessage(msg);
      console.log(`Parsed message: ${JSON.stringify(data)}`);
      this.onMessage(data, msg);
    });
  }

  parseMessage (msg: Message) {
    const data = msg.getData();
    return typeof data === 'string' ? JSON.parse(data) : JSON.parse(data.toString('utf8'));
  }
}