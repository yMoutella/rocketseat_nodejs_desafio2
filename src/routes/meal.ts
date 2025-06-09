import z from "zod";
import { app } from "../app";
import { connection } from "../database";
import { FastifyRequest } from "fastify";
import { findBestDietSequence } from "../utils/findBestDietSequence";
import { randomUUID } from "crypto";

export async function mealHandler(app) {

  app.post('/:id/meal', async (req: FastifyRequest, res) => {

    const userParam = z.object({
      id: z.string().uuid().nonempty()
    })

    const { id } = userParam.parse(req.params)


    await connection('user').where({
      id
    }).first()
      .then(user => {
        if (!user) {
          return res.status(404).send({
            message: 'User not found'
          })
        }
      })


    const mealSchema = z.object({
      name: z.string().nonempty(),
      description: z.string().nonempty(),
      diet: z.boolean().default(false),
      meal_dateTime: z.string().nonempty()
    })



    const body = mealSchema.safeParse(req.body);

    if (!body.success) {
      return res.status(400).send({
        message: 'Invalid meal data',
        errors: body.error.errors
      });
    }


    const result = await connection('meal').insert({
      meal_id: randomUUID(),
      name: body.data.name,
      description: body.data.description,
      diet: body.data.diet,
      user_id: id,
      meal_timestamp: body.data.meal_dateTime,
      created_at: new Date().toISOString()
    })
      .returning('*');

    return res.status(201).send({
      message: 'Meal created successfully',
      meal: result[0]
    });

  })


  app.get('/:id/meal', async (req: FastifyRequest, res) => {
    const userParam = z.object({
      id: z.string().uuid().nonempty()
    })

    const { id } = userParam.parse(req.params)

    const meals = await connection('meal').where({
      user_id: id
    }).select('*')


    if (meals.length === 0) {
      return res.status(404).send({
        message: 'No meals found for this user'
      })
    }

    return res.status(200).send({
      message: 'Meals found',
      meals
    })
  })

  app.get('/:id/meal/:meal', async (req: FastifyRequest, res) => {
    const userParam = z.object({
      id: z.string().uuid().nonempty(),
      meal: z.string().uuid().nonempty()
    })

    const params = userParam.safeParse(req.params)

    if (!params.success) {
      return res.status(400).send({
        message: 'Invalid parameters',
        errors: params.error.errors
      })
    }

    const result = await connection('meal').where({
      user_id: params.data.id,
      meal_id: params.data.meal
    }).select('*')
      .first()


    if (!result) {
      return res.status(404).send({
        message: 'Meal not found'
      })
    }

    return res.status(200).send({
      message: 'Meal found',
      meal: result
    })

  })

  app.patch('/:id/meal/:meal', async (req: FastifyRequest, res) => {
    const userParam = z.object({
      id: z.string().uuid().nonempty(),
      meal: z.string().uuid().nonempty()
    })

    const params = userParam.safeParse(req.params)

    if (!params.success) {
      return res.status(400).send({
        message: 'Invalid parameters',
        errors: params.error.errors
      })
    }

    const mealSchema = z.object({
      name: z.string().nonempty(),
      description: z.string().nonempty(),
      diet: z.boolean().default(false),
      meal_dateTime: z.string().nonempty()
    })

    const body = mealSchema.safeParse(req.body);

    if (!body.success) {
      return res.status(400).send({
        message: 'Invalid meal data',
        errors: body.error.errors
      });
    }

    const result = await connection('meal').update({
      name: body.data.name,
      description: body.data.description,
      diet: body.data.diet,
      meal_timestamp: body.data.meal_dateTime
    })
      .where({
        user_id: params.data.id,
        meal_id: params.data.meal
      })
      .returning('*')

    return res.status(200).send({
      message: 'Meal updated successfully',
      meal: result[0]
    })
  })


  app.delete('/:id/meal/:meal', async (req: FastifyRequest, res) => {
    const userParam = z.object({
      id: z.string().uuid().nonempty(),
      meal: z.string().uuid().nonempty()
    })

    const params = userParam.safeParse(req.params)

    if (!params.success) {
      return res.status(400).send({
        message: 'Invalid parameters',
        errors: params.error.errors
      })
    }

    const result = await connection('meal').where({
      user_id: params.data.id,
      meal_id: params.data.meal
    }).delete()
      .returning('*')

    if (result.length === 0) {
      return res.status(404).send({
        message: 'Meal not found'
      })
    }

    return res.status(200).send({
      message: 'Meal deleted successfully',
      meal: result[0]
    })
  })

  app.get('/:id/meal/diet-statistics', async (req: FastifyRequest, res) => {
    const userParam = z.object({
      id: z.string().uuid().nonempty()
    })

    const { id } = userParam.parse(req.params)

    const meals = await connection('meal').where({
      user_id: id
    }).select('*')

    if (meals.length === 0) {
      return res.status(404).send({
        message: 'No meals found for this user'
      })
    }


    console.log(meals)

    const totalMeals = meals.length
    const dietMeals = meals.filter(meal => meal.diet === 1)
    const nonDietMeals = meals.filter(meal => meal.diet !== 1)
    const betterDietSequence = findBestDietSequence(meals)


    return res.status(200).send({
      message: 'Diet statistics found',
      statistics: {
        totalMeals: totalMeals,
        dietMealsCount: dietMeals.length,
        nonDietMealsCount: nonDietMeals.length,
        betterDietSequence: betterDietSequence
      }
    })
  })

}
