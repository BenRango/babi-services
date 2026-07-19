interface BaseMessage {
  moi: boolean;
  heure: string;
  avatarUrl: string;
}

export type MessageItem =
  | (BaseMessage & { type: "text"; text: string })
  | (BaseMessage & { type: "audio"; uri: string; dureeSec: number });
