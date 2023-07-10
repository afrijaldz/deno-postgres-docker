FROM lukechannings/deno as builder

WORKDIR /app

COPY ./ ./

RUN deno task compile


FROM ubuntu:20.04

WORKDIR /app

COPY --from=builder /app/rad /usr/local/bin/rad

RUN chmod 755 /usr/local/bin/rad

EXPOSE 8000

CMD [ "rad" ]