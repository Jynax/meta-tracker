interface Env {}

const CREDENTIALS = {
  username: "michael",
  password: "meta2026!",
};

export const onRequest: PagesFunction<Env> = async (context) => {
  const authorization = context.request.headers.get("Authorization");

  if (!authorization) {
    return new Response("Unauthorized", {
      status: 401,
      headers: {
        "WWW-Authenticate": 'Basic realm="Meta Tracker", charset="UTF-8"',
      },
    });
  }

  const [scheme, encoded] = authorization.split(" ");

  if (!encoded || scheme !== "Basic") {
    return new Response("Malformed authorization header", {
      status: 400,
    });
  }

  let decoded: string;

  try {
    decoded = atob(encoded);
  } catch {
    return new Response("Malformed authorization header", {
      status: 400,
    });
  }

  const index = decoded.indexOf(":");
  const user = decoded.substring(0, index);
  const pass = decoded.substring(index + 1);

  if (user !== CREDENTIALS.username || pass !== CREDENTIALS.password) {
    return new Response("Invalid credentials", {
      status: 401,
      headers: {
        "WWW-Authenticate": 'Basic realm="Meta Tracker", charset="UTF-8"',
      },
    });
  }

  return context.next();
};
