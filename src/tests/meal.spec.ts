import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest';
import supertest from 'supertest';
import { app } from '../app';
import { execSync } from 'child_process';

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

})