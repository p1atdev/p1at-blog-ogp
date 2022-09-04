FROM denoland/deno:1.25.1

ARG EnvironmentVariable

EXPOSE $PORT

WORKDIR /app

COPY ./ /app

RUN deno task setup:chrome

CMD ["task", "start"]