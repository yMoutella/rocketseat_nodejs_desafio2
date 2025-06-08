import { FastifyInstance, FastifyRequest } from "fastify";
import z from "zod";
import { connection } from "../database";
import { randomUUID } from "crypto";

export async function userHandler(app: FastifyInstance) {

  app.post('/', async (req, res) => {

    const bodySchema = z.object({
      name: z.string().nonempty()
    })

    const { name } = bodySchema.parse(req.body)

    const result = await connection('user').insert({
      id: randomUUID(),
      name
    })
      .returning('*')

    res.setCookie('userId', result[0].id, {})

    return res.status(201).send({
      message: 'User created successfully',
      user: result
    })
  })

  app.get('/:id', {
  }, async (req, res) => {

    const paramsSchema = z.object({
      id: z.string().uuid()
    })

    await connection('user').where({
      id: paramsSchema.parse(req.params).id
    })
      .first()
      .then((user) => {
        if (!user) {
          return res.status(404).send({
            message: 'User not found'
          })
        }

        return res.status(200).send({
          message: 'User found',
          user
        })
      })
  })

  app.get('/', async (req, res) => {

    const result = await connection('user').select('*')

    return result
  })



}
