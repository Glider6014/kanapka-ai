import { Event } from "react-big-calendar";

export interface CustomEvent extends Event {
  id: number;
  title: string;
  start: Date;
  end: Date;
}
