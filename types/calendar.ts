export interface CustomEvent {
  id: string | number;
  title: string;
  start: string | Date;
  end: string | Date;
  allDay?: boolean;
}
