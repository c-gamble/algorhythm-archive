export const createStream = () => {
    const encoder = new TextEncoder();
    const stream = new TransformStream();
    const writer = stream.writable.getWriter();
    return {
        stream: stream.readable,
        write: (message: string) =>
            writer.write(
                encoder.encode(`data: ${JSON.stringify({ message })}\n\n`),
            ),
        close: () => writer.close(),
    };
};
