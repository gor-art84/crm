export const MAIL = Symbol("MAIL");

export type SendMailInput = {
  to: string;
  subject: string;
  text: string;
};

export interface Mail {
  send(input: SendMailInput): Promise<void>;
}
