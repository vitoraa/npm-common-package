import { OrderStatus } from "..";
import { Subjects } from "./subjects";

export interface OrderCreatedEvent {
  subject: Subjects.OrderCreated;
  data: {
    id: string;
    version: number;
    status: OrderStatus
    ticket: {
      id: string;
      price: number
    };
    userId: string;
    expiresAt: string;
  }
}