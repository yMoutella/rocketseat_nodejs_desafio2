import { FastifyReply, FastifyRequest } from "fastify";

export async function handleCookies(req: FastifyRequest, res: FastifyReply) {

  const { userId } = req.cookies

  if (!userId) {
    return res.status(401).send({
      message: 'Unauthorized!'
    })
  }

}
