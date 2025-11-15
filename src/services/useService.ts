import prisma from "../../db";

async function createUser(email: string, password: string) {
  return prisma.user.create({
    data: { email, password }
  })
}

async function getUsers() {
  return prisma.user.findMany()
}

async function getUserByEmail(email: string) {
  return prisma.user.findUnique({
    where: { email }
  })
}

async function updateUser(id: number, newData: { email?: string, password?: string}) {
  return prisma.user.update({
    where: { id},
    data: newData
  })
}

async function deleteUser(id: number) {
  return prisma.user.delete({
    where: { id}
  })
}

