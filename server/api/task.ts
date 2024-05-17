import { PrismaClient } from '@prisma/client';

export default defineEventHandler(async (event) => {
const prisma = new PrismaClient();

//   GETかPOSTかを表示
console.log(event.node.req.method);

//   GET時の処理
if (event.node.req.method === 'GET') {
    const tasks = await prisma.task.findMany();

    return tasks;
}

//   POST時の処理
    if (event.node.req.method === 'POST') {
        const body = await readBody(event);
        const newTask = await prisma.task.create({
        data: {
            task: body.task,
            completed: false,
        },
        });
        console.log(newTask);
        return newTask;
    }
});