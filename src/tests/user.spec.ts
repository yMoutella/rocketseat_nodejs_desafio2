import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest';
import supertest from 'supertest';
import { app } from '../app';
import { execSync } from 'child_process';


beforeAll(async () => {
  app.ready()
})

beforeEach(async () => {
  execSync('yarn knex migrate:rollback --all')
  execSync('yarn knex migrate:latest')
})

afterAll(async () => {
  app.close()
})

describe('User Management', () => {


  it('should create a user', async () => {
    const user = await supertest(app.server)
      .post('/user')
      .send({
        name: 'John doe'
      })
      .expect(201)

    expect(user.body).toEqual(
      expect.objectContaining({
        message: expect.any(String),
        user: expect.objectContaining({
          id: expect.any(String),
          name: expect.any(String),
          created_at: expect.any(String)
        })
      })
    )
  })

  it('should list all users', async () => {

    await supertest(app.server)
      .post('/user')
      .send({
        name: 'John doe'
      })
      .expect(201)

    const user = await supertest(app.server)
      .get('/user')
      .expect(200)

    expect(user.body).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: expect.any(String),
          name: expect.any(String),
          created_at: expect.any(String)
        })
      ])
    )
  })

  it('should return a specific user', async () => {

    const createdUser = await supertest(app.server)
      .post('/user')
      .send({
        name: 'John doe'
      })
      .expect(201)


    const user = await supertest(app.server)
      .get('/user/' + createdUser.body.user.id)
      .expect(200)

    expect(user.body).toEqual(
      expect.objectContaining({
        message: expect.any(String),
        user: expect.objectContaining({
          created_at: expect.any(String),
          id: expect.any(String),
          name: expect.any(String)
        })
      })
    )
  })
})

describe('Meal management', () => {

  beforeAll(async () => {
    app.ready()
  })

  beforeEach(async () => {
    execSync('yarn knex migrate:rollback --all')
    execSync('yarn knex migrate:latest')
  })

  afterAll(async () => {
    app.close()
  })

  it('should create a meal', async () => {

    const createdUser = await supertest(app.server)
      .post('/user')
      .send({
        name: 'John doe'
      })
      .expect(201)

    expect(createdUser.body).toEqual(
      expect.objectContaining({
        message: expect.any(String),
        user: expect.objectContaining({
          id: expect.any(String),
          name: expect.any(String),
          created_at: expect.any(String)
        })
      })
    )

    const createdMeal = await supertest(app.server)
      .post('/user/' + createdUser.body.user.id + '/meal')
      .send({
        name: "Dinner",
        description: "diet dinner",
        diet: true,
        meal_dateTime: "2025-08-06T18:42:00"
      })
      .expect(201)

    expect(createdMeal.body).toEqual(
      expect.objectContaining({
        message: expect.any(String),
        meal: expect.objectContaining({
          name: expect.any(String),
          description: expect.any(String),
          created_at: expect.any(String),
          meal_timestamp: expect.any(String),
          diet: expect.any(Number),
          user_id: expect.any(String),
          meal_id: expect.any(String),
        })
      })
    )
  })

  it('should list all meals', async () => {

    const createdUser = await supertest(app.server)
      .post('/user')
      .send({
        name: 'John doe'
      })
      .expect(201)

    expect(createdUser.body).toEqual(
      expect.objectContaining({
        message: expect.any(String),
        user: expect.objectContaining({
          id: expect.any(String),
          name: expect.any(String),
          created_at: expect.any(String)
        })
      })
    )

    const createdMeal = await supertest(app.server)
      .post('/user/' + createdUser.body.user.id + '/meal')
      .send({
        name: "Dinner",
        description: "diet dinner",
        diet: true,
        meal_dateTime: "2025-08-06T18:42:00"
      })
      .expect(201)

    expect(createdMeal.body).toEqual(
      expect.objectContaining({
        message: expect.any(String),
        meal: expect.objectContaining({
          name: expect.any(String),
          description: expect.any(String),
          created_at: expect.any(String),
          meal_timestamp: expect.any(String),
          diet: expect.any(Number),
          user_id: expect.any(String),
          meal_id: expect.any(String),
        })
      })
    )

    const mealsList = await supertest(app.server)
      .get('/user/' + createdUser.body.user.id + '/meal')
      .expect(200)

    expect(mealsList.body).toEqual(
      expect.objectContaining({
        message: expect.any(String),
        meals: expect.arrayContaining([
          expect.objectContaining({
            name: expect.any(String),
            description: expect.any(String),
            meal_timestamp: expect.any(String),
            diet: expect.any(Number),
            user_id: expect.any(String),
            created_at: expect.any(String),
            meal_id: expect.any(String)
          })
        ])
      })
    )
  })

  it('should get a specific meal', async () => {

    const createdUser = await supertest(app.server)
      .post('/user')
      .send({
        name: 'John doe'
      })
      .expect(201)

    expect(createdUser.body).toEqual(
      expect.objectContaining({
        message: expect.any(String),
        user: expect.objectContaining({
          id: expect.any(String),
          name: expect.any(String),
          created_at: expect.any(String)
        })
      })
    )

    const createdMeal = await supertest(app.server)
      .post('/user/' + createdUser.body.user.id + '/meal')
      .send({
        name: "Dinner",
        description: "diet dinner",
        diet: true,
        meal_dateTime: "2025-08-06T18:42:00"
      })
      .expect(201)

    expect(createdMeal.body).toEqual(
      expect.objectContaining({
        message: expect.any(String),
        meal: expect.objectContaining({
          name: expect.any(String),
          description: expect.any(String),
          created_at: expect.any(String),
          meal_timestamp: expect.any(String),
          diet: expect.any(Number),
          user_id: expect.any(String),
          meal_id: expect.any(String),
        })
      })
    )

    const meal = await supertest(app.server)
      .get('/user/' + createdUser.body.user.id + '/meal/' + createdMeal.body.meal.meal_id)
      .expect(200)

    expect(meal.body).toEqual(
      expect.objectContaining({
        message: expect.any(String),
        meal: expect.objectContaining({
          name: expect.any(String),
          description: expect.any(String),
          meal_timestamp: expect.any(String),
          diet: expect.any(Number),
          user_id: expect.any(String),
          created_at: expect.any(String),
          meal_id: expect.any(String)
        })
      })
    )
  })

  it('should update a specific meal', async () => {

    const createdUser = await supertest(app.server)
      .post('/user')
      .send({
        name: 'John doe'
      })
      .expect(201)

    expect(createdUser.body).toEqual(
      expect.objectContaining({
        message: expect.any(String),
        user: expect.objectContaining({
          id: expect.any(String),
          name: expect.any(String),
          created_at: expect.any(String)
        })
      })
    )

    const createdMeal = await supertest(app.server)
      .post('/user/' + createdUser.body.user.id + '/meal')
      .send({
        name: "Dinner",
        description: "diet dinner",
        diet: true,
        meal_dateTime: "2025-08-06T18:42:00"
      })
      .expect(201)

    expect(createdMeal.body).toEqual(
      expect.objectContaining({
        message: expect.any(String),
        meal: expect.objectContaining({
          name: expect.any(String),
          description: expect.any(String),
          created_at: expect.any(String),
          meal_timestamp: expect.any(String),
          diet: expect.any(Number),
          user_id: expect.any(String),
          meal_id: expect.any(String),
        })
      })
    )


    const updatedMeal = await supertest(app.server)
      .patch('/user/' + createdUser.body.user.id + '/meal/' + createdMeal.body.meal.meal_id)
      .send({
        'name': 'updated Dinner',
        'description': 'this is my updated dinner diet test',
        'diet': false,
        'meal_dateTime': '2025-08-06T12:43:00'
      })
      .expect(200)

    expect(updatedMeal.body).toEqual(
      expect.objectContaining({
        message: expect.any(String),
        meal: expect.objectContaining({
          name: expect.any(String),
          description: expect.any(String),
          meal_timestamp: expect.any(String),
          diet: expect.any(Number),
          user_id: expect.any(String),
          created_at: expect.any(String),
          meal_id: expect.any(String)
        })
      })
    )
  })


  it('should delete a specific meal', async () => {

    const createdUser = await supertest(app.server)
      .post('/user')
      .send({
        name: 'John doe'
      })
      .expect(201)

    expect(createdUser.body).toEqual(
      expect.objectContaining({
        message: expect.any(String),
        user: expect.objectContaining({
          id: expect.any(String),
          name: expect.any(String),
          created_at: expect.any(String)
        })
      })
    )

    const createdMeal = await supertest(app.server)
      .post('/user/' + createdUser.body.user.id + '/meal')
      .send({
        name: "Dinner",
        description: "diet dinner",
        diet: true,
        meal_dateTime: "2025-08-06T18:42:00"
      })
      .expect(201)

    expect(createdMeal.body).toEqual(
      expect.objectContaining({
        message: expect.any(String),
        meal: expect.objectContaining({
          name: expect.any(String),
          description: expect.any(String),
          created_at: expect.any(String),
          meal_timestamp: expect.any(String),
          diet: expect.any(Number),
          user_id: expect.any(String),
          meal_id: expect.any(String),
        })
      })
    )


    const deletedMeal = await supertest(app.server)
      .delete('/user/' + createdUser.body.user.id + '/meal/' + createdMeal.body.meal.meal_id)
      .expect(200)

    expect(deletedMeal.body).toEqual(
      expect.objectContaining({
        message: expect.any(String),
      })
    )
  })

  it('should return the diet statistics', async () => {

    const createdUser = await supertest(app.server)
      .post('/user')
      .send({
        name: 'John doe'
      })
      .expect(201)

    expect(createdUser.body).toEqual(
      expect.objectContaining({
        message: expect.any(String),
        user: expect.objectContaining({
          id: expect.any(String),
          name: expect.any(String),
          created_at: expect.any(String)
        })
      })
    )

    const createdMeal = await supertest(app.server)
      .post('/user/' + createdUser.body.user.id + '/meal')
      .send({
        name: "Dinner",
        description: "diet dinner",
        diet: true,
        meal_dateTime: "2025-08-06T18:42:00"
      })
      .expect(201)

    expect(createdMeal.body).toEqual(
      expect.objectContaining({
        message: expect.any(String),
        meal: expect.objectContaining({
          name: expect.any(String),
          description: expect.any(String),
          created_at: expect.any(String),
          meal_timestamp: expect.any(String),
          diet: expect.any(Number),
          user_id: expect.any(String),
          meal_id: expect.any(String),
        })
      })
    )


    const dietStatistics = await supertest(app.server)
      .get('/user/' + createdUser.body.user.id + '/meal/diet-statistics')
      .expect(200)

    expect(dietStatistics.body).toEqual(
      expect.objectContaining({
        message: expect.any(String),
        statistics: expect.objectContaining({
          totalMeals: expect.any(Number),
          dietMealsCount: expect.any(Number),
          nonDietMealsCount: expect.any(Number),
          betterDietSequence: expect.any(Number)
        })
      })
    )
  })


})
