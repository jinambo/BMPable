type MessageType = 'warn' | 'err' | 'succ';

export interface GlobalMessageProps {
  text: string;
  type: MessageType;
}