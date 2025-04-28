import { Readable } from "stream";

function ReadableStreamToNode(buffer, headers) {
  const stream = new Readable();
  stream.push(buffer);
  stream.push(null);
  stream.headers = Object.fromEntries(headers.entries());
  return stream;
}

export default ReadableStreamToNode;