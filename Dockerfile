FROM denoland/deno:alpine-1.25.0 as builder

WORKDIR /app

COPY src/ ./

RUN deno compile --allow-read --allow-net --allow-env ./server.ts

FROM debian:stable-slim as runner
WORKDIR /app

RUN adduser --uid 1002 deno

COPY --from=builder /app/server ./namaderu

USER deno

EXPOSE 3000

CMD ["./namaderu"]