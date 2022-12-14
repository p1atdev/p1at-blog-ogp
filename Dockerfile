FROM denoland/deno:1.25.1

ARG NEWT_API_TOKEN
ARG NEWT_API_TYPE
ARG NEWT_APP_UID
ARG NEWT_POST_MODEL_UID
ARG NEWT_SPACE_UID
ARG NEWT_TAG_MODEL_UID

ARG PORT

EXPOSE $PORT

ENV PORT=$PORT

WORKDIR /app

COPY ./ /app

RUN deno task setup:chrome

CMD ["task", "start"]