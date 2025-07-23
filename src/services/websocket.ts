let ws: any;
let handlers: any = {};

export const initWebSocket = (token: string) => {
  ws = new WebSocket(
    `ws://${import.meta.env.VITE_WEBSOCKET_BASE}/ws?token=${token}`,
  );
  ws.onopen = () => {
    console.log("WebSocket连接已打开");
  };

  ws.onmessage = (event: any) => {
    try {
      const data = JSON.parse(event.data);
      const { type } = data;
      const handler = handlers[type];
      if (handler) {
        handler(data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  ws.onerror = (error: any) => {
    console.error("WebSocket连接错误:", error);
  };

  ws.onclose = () => {
    console.log("WebSocket连接已关闭");
    ws = null;
  };
};

export const sendMessage = ({
  type,
  ...rest
}: {
  type: string;
  [key: string]: any;
}) => {
  if (ws.readyState === WebSocket.OPEN) {
    ws.send(JSON.stringify({ type, ...rest }));
  }
};

export const onMessage = (type: string, handler: any) => {
  handlers[type] = handler;
};

export const removeMessageListener = (type: string) => {
  delete handlers[type];
};

export const closeWebsocket = () => {
  if (ws) {
    handlers = {};
    ws.close();
  }
};
