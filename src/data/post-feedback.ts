let latestPostFeedbackMessage: string | null = null;

export function setPostFeedbackMessage(message: string) {
  latestPostFeedbackMessage = message;
}

export function consumePostFeedbackMessage() {
  const message = latestPostFeedbackMessage;
  latestPostFeedbackMessage = null;
  return message;
}
