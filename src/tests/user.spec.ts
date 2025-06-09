import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest';
import supertest from 'supertest';
import { app } from '../app';
import { execSync } from 'child_process';

describe('User Management', () => {

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